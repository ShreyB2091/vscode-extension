const vscode = require("vscode");
const axios = require('axios');
const { Octokit } = require("@octokit/rest");

/**
 * @param {vscode.ExtensionContext} context
 */

let commits = [];
let commitData = [];
let eventListener;

function activate(context) {
  console.log('Congratulations, your extension "gitlinetrace" is now active!');

  let disposable = vscode.commands.registerCommand(
    "gitlinetrace.checkRepo",
    async function () {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders) {
				vscode.window.showWarningMessage("No Workspace Folder is open!");
				exit();
			}
			
			const gitExtension = vscode.extensions.getExtension('vscode.git');
			if (!gitExtension) {
				vscode.window.showErrorMessage("No Git Extension!");
				exit();
			}
			
			const gitAPI = gitExtension.exports.getAPI(1);
			if (!gitAPI.repositories.length) {
				vscode.window.showErrorMessage("No Repository found!");
				exit();
			}

			const currentRepo = gitAPI.repositories[0];
      console.log(currentRepo.state);
      const branch = currentRepo.state.a.u.name;
			const remote = await currentRepo.state.remotes.find(
				(remote) => remote.name === "origin" && remote.fetchUrl.includes("github.com")
			);

			if (!!remote) {
        console.log("Current opened folder is a GitHub repository.");
			} else {
				vscode.window.showErrorMessage("Current opened folder is not a GitHub repository.");
        exit();
			}

      const remoteUrl = currentRepo.state.remotes[0].fetchUrl.trim();
      const regex = /github\.com[:/](.+?)\/(.+?)(?:\.git)?$/;
      const match = regex.exec(remoteUrl);
      
      const filePath = vscode.window.activeTextEditor.document.uri.fsPath;
      const path = vscode.workspace.asRelativePath(filePath, false);
      let owner = '';
      let repo = '';
      
      if (match) {
        owner = match[1];
        repo = match[2];
      } else {
        console.error('Unable to determine repository information.');
      }

      const octokit = new Octokit({
        auth: process.env.GITHUB_REFERENCE_TOKEN
      });
      
      // const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      //   owner: owner,
      //   repo: repo,
      //   headers: {
      //     'X-GitHub-Api-Version': '2022-11-28',
      //     'accept': 'application/vnd.github+json'
      //   }
      // });
      const response = await octokit.rest.repos.listCommits({
        owner: owner,
        repo: repo,
        sha: branch,
      });
      commits = response.data;
      for (const commit of commits) {
        const commitUrl = commit.url;
        const commitResponse = await axios.get(commitUrl);
        const data = commitResponse.data;
        commitData = [...commitData, data];
      }
      console.log(commitData);
    }
  );

  eventListener = vscode.window.onDidChangeTextEditorSelection(async (event) => {
    const selectedLine = event.selections[0].active.line;
    const filePath = vscode.window.activeTextEditor.document.uri.fsPath;
    const path = vscode.workspace.asRelativePath(filePath, false);
    const commit = await getLatestCommit(path);
    const author = await commit.commit.author;
    const commitMessage = `Latest commit by ${author.name} on ${author.date}`;
    // const activeEditor = vscode.window.activeTextEditor;
    // if (activeEditor) {
    //   activeEditor.setDecorations(decorationType, []);
    // }
    showTextBoxAtLine(commitMessage, selectedLine);
  });

  context.subscriptions.push(disposable);
}

function exit() {
  const extension = vscode.extensions.getExtension("gitlinetrace");
  if (extension) {
    extension.deactivate();
  }
}

function showTextBoxAtLine(text, line) {
  const activeEditor = vscode.window.activeTextEditor;
  
  const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      contentText: text,
      margin: '0 0 0 3em',
      backgroundColor: new vscode.ThemeColor('editor.hoverHighlightBackground'),
      color: new vscode.ThemeColor('editor.foreground'),
      fontWeight: 'bold',
      border: '1px solid',
      borderColor: new vscode.ThemeColor('editorWidget.border'),
      padding: '4px 15px',
      borderRadius: '8px',
    },
  });
  
  if (activeEditor) {
    const startPosition = new vscode.Position(line, 0);
    const endPosition = new vscode.Position(line, activeEditor.document.lineAt(line).range.end.character);
    const range = new vscode.Range(startPosition, endPosition);
    
    
    const decoration = { range };
    activeEditor.setDecorations(decorationType, [decoration]);

    setTimeout(() => {
      if (activeEditor) {
        activeEditor.setDecorations(decorationType, []);
      }
    }, 4000);
  }
}

async function getLatestCommit(path) {
  try {
    for (const data of commitData) {
      const files = data.files;
      for (const file of files) {
        if (file.filename === path) {
          return data;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error occurred while retrieving the latest commit details:', error);
    return null;
  }
}

function deactivate() {
  if (eventListener) {
    eventListener.dispose();
  }
}

module.exports = {
  activate,
  deactivate,
};

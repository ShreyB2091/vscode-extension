const vscode = require("vscode");

async function checkRepo () {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showWarningMessage("No Workspace Folder is open!");
    return;
  }
  
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    vscode.window.showErrorMessage("No Git Extension!");
    return;
  }
  
  const gitAPI = gitExtension.exports.getAPI(1);
  if (!gitAPI.repositories.length) {
    vscode.window.showErrorMessage("No Repository found!");
    return;
  }
  const currentRepo = gitAPI.repositories[0];
  const remote = await currentRepo.state.remotes.find(
    (remote) => remote.name === "origin" && remote.fetchUrl.includes("github.com")
  );

  if (!!remote) {
    console.log("Current opened folder is a GitHub repository.");
  } else {
    vscode.window.showErrorMessage("Current opened folder is not a GitHub repository.");
    return;
  }
}

module.exports = checkRepo;
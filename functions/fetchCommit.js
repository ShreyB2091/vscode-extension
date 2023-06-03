const vscode = require("vscode");

async function getLatestCommit(path, selectedLine) {
  try {
    const gitAPI = vscode.extensions.getExtension('vscode.git').exports.getAPI(1)
    const repository = gitAPI.repositories[0];
    const blameInfo = await repository.blame(path);
    const lineInfo = blameInfo.split('\n');
    console.log(lineInfo[selectedLine]);
    const line = lineInfo[selectedLine];

    // Check if commit for the line exists or not
    if(line.includes('Not Committed Yet') && line.includes('00000000')) return null;

    const usernameRegex = /\((.*?)\s/;
    const timeRegex = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;
    const usernameMatch = line.match(usernameRegex);
    const timeMatch = line.match(timeRegex);

    if (usernameMatch && timeMatch) {
      const username = usernameMatch[1];
      const time = timeMatch[0];

      console.log(`Username: ${username}`);
      console.log(`Time of Commit: ${time}`);
      return {name: username, date: time};
    }
  } catch (error) {
    vscode.window.showErrorMessage('Failed to fetch Git History.');
    console.error(error);
  }
}

module.exports = getLatestCommit;
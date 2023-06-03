const vscode = require("vscode");
const path = require('path');
const displayDetails = require('./displayDetails');
const fetchCommit = require('./fetchCommit');

const clickHandler = vscode.window.onDidChangeTextEditorSelection(async (event) => {
  const selectedLine = event.selections[0].active.line;
  const filePath = vscode.window.activeTextEditor.document.fileName;

  // Cleaning the path to make it usable across all operating systems
  const cleanedPath = path.normalize(filePath);
  const commit = await fetchCommit(cleanedPath, selectedLine);
  let commitMessage;

  if(!commit) {
    commitMessage = 'No commit found for line';
  }
  else {
    commitMessage = `Latest commit by ${commit.name} on ${commit.date}`;
  }
  
  displayDetails(commitMessage, selectedLine);
});

module.exports = clickHandler;
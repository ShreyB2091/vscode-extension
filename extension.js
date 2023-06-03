const vscode = require("vscode");
const checkRepo = require('./functions/checkRepo');
const clickHandler = require('./functions/clickHandler');

/**
 * @param {vscode.ExtensionContext} context
 */

let eventListener;

function activate(context) {
  console.log('Congratulations, your extension "gitlinetrace" is now active!');

  let hist = vscode.commands.registerCommand(
    "gitlinetrace.showHistory",
    checkRepo()
  )

  eventListener = clickHandler;
  
  context.subscriptions.push(hist);
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

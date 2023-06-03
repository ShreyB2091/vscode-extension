const vscode = require("vscode");

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
    }, 2000);
  }
}

module.exports = showTextBoxAtLine;
import * as vscode from 'vscode';
const { workspace, window, commands, Position, Range } = vscode;
const csso = require('csso');

function setText(text: string) {
  const { activeTextEditor } = window;

  if (!activeTextEditor) {
    return Promise.reject(null);
  }

  const { document } = activeTextEditor;

  return new Promise(resolve => {
    activeTextEditor.edit(builder => {
      const lastLine = document.lineAt(document.lineCount - 2);
      const start = new Position(0, 0);
      const end = new Position(document.lineCount - 1, lastLine.text.length);
      builder.replace(new Range(start, end), text);
      resolve();
    });
  });
}

function canApply(document: vscode.TextDocument) {
  return document.languageId === 'css';
}

export function activate(context: vscode.ExtensionContext) {
  const minify = commands.registerCommand('csso.minify', async () => {
    if (!window.activeTextEditor) {
      return;
    }

    const { document } = window.activeTextEditor;

    if (!canApply(document)) {
      return;
    }

    const { css } = csso.minify(document.getText(), {
      restructure: workspace.getConfiguration('csso').get('restructure')
    })

    await setText(css);
  });

  context.subscriptions.push(minify);
}

export function deactivate() {}

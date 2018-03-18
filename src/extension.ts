import * as vscode from 'vscode';
import setText from 'vscode-set-text';
const { workspace, window, commands } = vscode;
const csso = require('csso');

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

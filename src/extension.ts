import { ExtensionContext, TextDocument, workspace, window, commands } from 'vscode';
import setText from 'vscode-set-text';
const csso = require('csso');

function canApply(document: TextDocument) {
  return document.languageId === 'css';
}

export function activate(context: ExtensionContext) {
  const minify = commands.registerCommand('csso.minify', async () => {
    if (!window.activeTextEditor) {
      return;
    }

    const { document } = window.activeTextEditor;

    if (!canApply(document)) {
      return;
    }

    const cssoConfig = workspace.getConfiguration('csso');

    const { css } = csso.minify(document.getText(), {
      restructure: cssoConfig.get('restructure')
    })

    await setText(css);
  });

  context.subscriptions.push(minify);
}

export function deactivate() {}

import {ExtensionContext, TextDocument, workspace, window, commands} from 'vscode';
import setText from 'vscode-set-text';
import setSelectedText from 'vscode-set-selected-text';
import csso from 'csso';

type Options = csso.MinifyOptions & csso.CompressOptions;

function isCSS({languageId}: TextDocument): boolean {
  return languageId === 'css';
}

function getPluginConfig(): Options {
  const cssoConfig = workspace.getConfiguration('svgo');
  const pluginConfig: Options = {
    restructure: cssoConfig.get('restructure'),
  };

  return pluginConfig;
}

function optimize(text: string): string {
  const config = getPluginConfig();

  return csso.minify(text, config).css;
}

async function optimizeTextDocument(textDocument: TextDocument) {
  if (!isCSS(textDocument)) {
    return;
  }

  const text = optimize(textDocument.getText());
  const textEditor = await window.showTextDocument(textDocument);
  await setText(text, textEditor);
}

async function minify() {
  if (!window.activeTextEditor) {
    return;
  }

  await optimizeTextDocument(window.activeTextEditor.document);
  await window.showInformationMessage('Minified current CSS file');
}

async function minifySelected() {
  if (!window.activeTextEditor) {
    return;
  }

  const {document, selection} = window.activeTextEditor;
  const text = optimize(document.getText(selection));
  await setSelectedText(text);
  await window.showInformationMessage('Minified selected CSS');
}

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('csso.minify', minify),
    commands.registerCommand('csso.minify-selected', minifySelected),
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}

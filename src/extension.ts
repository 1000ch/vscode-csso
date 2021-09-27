import {workspace, window, commands} from 'vscode';
import type {ExtensionContext, TextDocument, TextEditor} from 'vscode';
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

async function processTextEditor(textEditor: TextEditor) {
  if (!isCSS(textEditor.document)) {
    return;
  }

  const text = textEditor.document.getText();
  const optimizedText = optimize(text);
  await setText(optimizedText, textEditor);
}

async function minify() {
  if (!window.activeTextEditor) {
    return;
  }

  try {
    await processTextEditor(window.activeTextEditor);
    await window.showInformationMessage('Minified current CSS file');
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      await window.showErrorMessage(error.message);
    }
  }
}

async function minifySelected() {
  if (!window.activeTextEditor) {
    return;
  }

  try {
    const {document, selection} = window.activeTextEditor;
    const text = optimize(document.getText(selection));
    await setSelectedText(text);
    await window.showInformationMessage('Minified selected CSS');
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      await window.showErrorMessage(error.message);
    }
  }
}

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('csso.minify', minify),
    commands.registerCommand('csso.minify-selected', minifySelected),
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}

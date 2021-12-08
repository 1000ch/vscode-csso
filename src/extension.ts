import {workspace, window, commands} from 'vscode';
import type {ExtensionContext, TextDocument} from 'vscode';
import setText from 'vscode-set-text';
import setSelectedText from 'vscode-set-selected-text';
import {minify} from 'csso';

type Options = csso.MinifyOptions & csso.CompressOptions;

function isCss({languageId}: TextDocument): boolean {
  return languageId === 'css';
}

function getPluginConfig(): Options {
  const cssoConfig = workspace.getConfiguration('svgo');
  const pluginConfig: Options = {
    restructure: cssoConfig.get('restructure'),
  };

  return pluginConfig;
}

async function commandMinify(): Promise<void> {
  if (!window.activeTextEditor) {
    return;
  }

  if (!isCss(window.activeTextEditor.document)) {
    return;
  }

  try {
    const config: Options = getPluginConfig();
    const {document} = window.activeTextEditor;
    const result = minify(document.getText(), config);

    await setText(result.css, window.activeTextEditor);
    await window.showInformationMessage('Minified current CSS file');
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      await window.showErrorMessage(error.message);
    }
  }
}

async function commandMinifySelected(): Promise<void> {
  if (!window.activeTextEditor) {
    return;
  }

  try {
    const config: Options = getPluginConfig();
    const {document, selection} = window.activeTextEditor;
    const result = minify(document.getText(selection), config);

    await setSelectedText(result.css, window.activeTextEditor);
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
    commands.registerCommand('csso.minify', commandMinify),
    commands.registerCommand('csso.minify-selected', commandMinifySelected),
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}

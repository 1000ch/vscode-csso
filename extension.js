const { workspace, window, commands, Position, Range } = require('vscode');
const csso = require('csso');

function setText(text) {
  const { document } = window.activeTextEditor;

  return new Promise(resolve => {
    window.activeTextEditor.edit(builder => {
      const lastLine = document.lineAt(document.lineCount - 2);
      const start = new Position(0, 0);
      const end = new Position(document.lineCount - 1, lastLine.text.length);
      builder.replace(new Range(start, end), text);
      resolve();
    });
  });
}

function cannotApply(document) {
  const { languageId, fileName } = document;

  return languageId !== 'css';
}

exports.activate = ({ subscriptions }) => {
  const minify = commands.registerCommand('csso.minify', async () => {
    const { document } = window.activeTextEditor;

    if (cannotApply(document)) {
      return;
    }

    const { css } = csso.minify(document.getText(), {
      restructure: workspace.getConfiguration('csso').get('restructure')
    })

    await setText(css);
  });

  subscriptions.push(minify);
};

exports.deactivate = () => {};

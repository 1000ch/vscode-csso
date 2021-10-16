# vscode-csso ![GitHub Actions Status](https://github.com/1000ch/vscode-csso/workflows/test/badge.svg)

Minify CSS with [CSSO](http://github.com/css/csso).

## Install

Execute `Extensions: Install Extensions` command from [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) (<kbd>Cmd</kbd> <kbd>Shift</kbd> <kbd>P</kbd>) and search by **csso**.

Also you can install this extension locally by putting symbolic link from `~/.vscode/extensions` to `~/path/to/this/repo` like below.

```bash
$ ln -s ~/workspace/github.com/1000ch/vscode-csso  ~/.vscode/extensions/1000ch.csso-local
```

## Usage

Open the Command Palette (<kbd>Cmd</kbd> <kbd>Shift</kbd> <kbd>P</kbd>) and search following commands.

- **csso: Minify current CSS file**: to minify current CSS file
- **csso: Minify selected part of CSS**: to minify selected part of CSS

You can also execute these commands from context menu of [Explorer](https://code.visualstudio.com/docs/getstarted/userinterface#_explorer) or Editor.

![You can use commands from the context menu of editor view](./screenshot-1.png)

## Config

### [restructure](https://github.com/css/csso#compressast-options)

`true` as default. If you want to disable, set `false`.

## License

[MIT](https://1000ch.mit-license.org) © [Shogo Sensui](https://github.com/1000ch)

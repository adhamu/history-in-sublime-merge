# History In Sublime Merge

[![Version](https://img.shields.io/visual-studio-marketplace/v/adhamu.history-in-sublime-merge.svg?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=adhamu.history-in-sublime-merge)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/adhamu.history-in-sublime-merge.svg?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=adhamu.history-in-sublime-merge)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/adhamu.history-in-sublime-merge.svg?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=adhamu.history-in-sublime-merge)
[![Open VSX Downloads](https://img.shields.io/open-vsx/dt/adhamu/history-in-sublime-merge.svg?color=green&label=Open%20VSX&style=for-the-badge)](https://open-vsx.org/extension/adhamu/history-in-sublime-merge)

Adds Sublime Merge commands to VSCode/VSCodium.

To differentiate between other Sublime Merge plugins, this one isn't concerned with what workspace (multi or single) you have setup.

Whatever file you have open, it will traverse up the directory structure and find the appropriate `.git` repository.

## Features

- Open Repository
- View File History
- View Line History
- Blame File

### Command Palette

![Command Palette](./command-palette.webp)

### Explorer Context Menu

![Explorer Context Menu](./explorer-context.webp)

### Editor Context Menu

![Editor Context Menu](./editor-context.webp)

## Installation

```sh
ext install adhamu.history-in-sublime-merge
```

## Requirements

Ensure the `smerge` command is in your `$PATH`.

[Details can be found here](https://www.sublimemerge.com/docs/command_line)

## Settings

### `history-in-sublime-merge.path`

Edit this value to override the path to Sublime Merge. When not set, the default path, depending on the operating system, is used.

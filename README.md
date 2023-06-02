# Git Line Trace README

Clone this repository in your local machine to use the extension.

## Installation

run ``code --install-extension gitlinetrace-0.0.1.vsix`` in your terminal to install the extension.

## Usage

You need a GitHub Personal Access Token to use the extension.

Create a file ``.env.local`` in the root directory and add the following line in it -

```
GITHUB_REFERENCE_TOKEN="<YOUR_ACCESS_TOKEN>"
```

## Loading the Extension

To load the extension, you need to copy the files to your VS Code extensions folder `.vscode/extensions`. Depending on your platform, it is located in the following folders:

* **Windows** `%USERPROFILE%\.vscode\extensions`
* **macOS** `~/.vscode/extensions`
* **Linux** `~/.vscode/extensions`

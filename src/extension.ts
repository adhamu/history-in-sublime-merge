import * as vscode from 'vscode';
import * as child from 'child_process';
import * as findUp from 'find-up';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const viewFileHistoryCommand = vscode.commands.registerCommand(
    'history-in-sublime-merge.viewFileHistory',
    viewFileHistory
  );

  context.subscriptions.push(viewFileHistoryCommand);
}

export function deactivate() {}

const viewFileHistory = async () => {
  if (vscode.window.activeTextEditor) {
    let filePath = vscode.window.activeTextEditor.document.uri.path;
    const findRepo = await findUp('.git', {
      cwd: path.dirname(filePath),
      type: 'directory',
    });

    if (!findRepo) {
      return;
    }

    const repoLocation = path.dirname(findRepo);
    filePath = filePath.replace(`${repoLocation}/`, '');
    child.execFile(`smerge`, ['search', `file:"${filePath}"`], {
      cwd: repoLocation,
    });
  }
};

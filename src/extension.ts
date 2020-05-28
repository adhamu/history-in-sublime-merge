import * as vscode from 'vscode';
import * as child from 'child_process';
import * as findUp from 'find-up';
import * as path from 'path';

const getCurrentRepository = async (file: string): Promise<string | null> => {
  const repository = await findUp('.git', {
    cwd: path.dirname(file),
    type: 'directory',
  });

  return path.dirname(repository ?? '');
};

const openSublimeMerge = (args: string[], repository: string) => {
  child.execFile('smerge', args, {
    cwd: repository,
  });
};

const getFileDetails = async (editor: vscode.TextEditor) => {
  const repository = await getCurrentRepository(editor.document.uri.path);

  return {
    path: editor.document.uri.path.replace(`${repository}/`, ''),
    currentLineNumber: editor.selection.active.line + 1,
    repository: repository ?? '',
  };
};

const viewFileHistory = async () => {
  if (vscode.window.activeTextEditor) {
    const { path, repository } = await getFileDetails(
      vscode.window.activeTextEditor
    );

    openSublimeMerge(['search', `file:"${path}"`], repository);
  }
};

const viewLineHistory = async () => {
  if (vscode.window.activeTextEditor) {
    const { path, repository, currentLineNumber } = await getFileDetails(
      vscode.window.activeTextEditor
    );

    openSublimeMerge(
      [
        'search',
        `file:"${path}" line:${currentLineNumber}-${currentLineNumber}`,
      ],
      repository
    );
  }
};

const blameFile = async () => {
  if (vscode.window.activeTextEditor) {
    const { path, repository } = await getFileDetails(
      vscode.window.activeTextEditor
    );

    openSublimeMerge(['blame', path], repository);
  }
};

export function activate(context: vscode.ExtensionContext) {
  const viewFileHistoryCommand = vscode.commands.registerCommand(
    'history-in-sublime-merge.viewFileHistory',
    viewFileHistory
  );

  const viewLineHistoryCommand = vscode.commands.registerCommand(
    'history-in-sublime-merge.viewLineHistory',
    viewLineHistory
  );

  const blameFileCommand = vscode.commands.registerCommand(
    'history-in-sublime-merge.blameFile',
    blameFile
  );

  context.subscriptions.push(viewFileHistoryCommand);
  context.subscriptions.push(viewLineHistoryCommand);
  context.subscriptions.push(blameFileCommand);
}

export function deactivate() {}

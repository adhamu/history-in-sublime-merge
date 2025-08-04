import * as vscode from 'vscode';
import * as child from 'child_process';
import * as findUp from 'find-up';
import * as path from 'path';

type FileDetails = {
  path: string
  selectionStart: number
  selectionEnd: number
  repository: string
};

let SMERGE_BINARY_PATH: string;

const getCurrentRepository = async (file: string): Promise<string> => {
  const repository = await findUp('.git', {
    cwd: path.dirname(file),
    type: 'directory',
  });

  return path.dirname(repository ?? '');
};

const openSublimeMerge = (args: string[], repository: string): void => {
  const customPath = vscode.workspace
    .getConfiguration()
    .get<string>('history-in-sublime-merge.path');

  child.execFile(customPath || SMERGE_BINARY_PATH, args, {
    cwd: repository,
  });
};

const getFileDetails = async (
  editor: vscode.TextEditor
): Promise<FileDetails> => {
  const repository: string = await getCurrentRepository(
    editor.document.uri.path
  );

  return {
    path: editor.document.uri.path.replace(`${repository}/`, ''),
    selectionStart: editor.selection.start.line + 1,
    selectionEnd: editor.selection.end.line + 1,
    repository: repository ?? '',
  };
};

const viewFileHistory = async (): Promise<void> => {
  if (vscode.window.activeTextEditor) {
    const { path, repository } = await getFileDetails(
      vscode.window.activeTextEditor
    );

    openSublimeMerge(['search', `file:"${path}"`], repository);
  }
};

const viewLineHistory = async (): Promise<void> => {
  if (vscode.window.activeTextEditor) {
    const { path, repository, selectionStart, selectionEnd } =
      await getFileDetails(vscode.window.activeTextEditor);

    openSublimeMerge(
      ['search', `file:"${path}" line:${selectionStart}-${selectionEnd}`],
      repository
    );
  }
};

const blameFile = async (): Promise<void> => {
  if (vscode.window.activeTextEditor) {
    const { path, repository } = await getFileDetails(
      vscode.window.activeTextEditor
    );

    openSublimeMerge(['blame', path], repository);
  }
};

const getSmergeBinaryPath = () => {
  switch (process.platform) {
    case 'win32':
      return 'smerge';
    case 'darwin':
      return '/Applications/Sublime\ Merge.app/Contents/SharedSupport/bin/smerge';
    default:
      return '/opt/sublime_merge/sublime_merge';
  }
};

export const activate = (context: vscode.ExtensionContext): void => {
  const extensionName = 'history-in-sublime-merge';
  SMERGE_BINARY_PATH = getSmergeBinaryPath();

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${extensionName}.viewFileHistory`,
      viewFileHistory
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${extensionName}.viewLineHistory`,
      viewLineHistory
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(`${extensionName}.blameFile`, blameFile)
  );
};

export const deactivate = (): void => {};

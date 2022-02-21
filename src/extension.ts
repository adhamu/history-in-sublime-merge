import * as vscode from 'vscode';
import * as child from 'child_process';
import * as findUp from 'find-up';
import * as path from 'path';

type FileDetails = {
  path: string;
  currentLineNumber: number;
  repository: string;
};

const getCurrentRepository = async (file: string): Promise<string> => {
  const repository = await findUp('.git', {
    cwd: path.dirname(file),
    type: 'directory',
  });

  return path.dirname(repository ?? '');
};

const openSublimeMerge = (args: string[], repository: string): void => {
  child.execFile('/Applications/Sublime\ Merge.app/Contents/SharedSupport/bin/smerge', args, {
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
    currentLineNumber: editor.selection.active.line + 1,
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

const blameFile = async (): Promise<void> => {
  if (vscode.window.activeTextEditor) {
    const { path, repository } = await getFileDetails(
      vscode.window.activeTextEditor
    );

    openSublimeMerge(['blame', path], repository);
  }
};

export const activate = (context: vscode.ExtensionContext): void => {
  const extensionName = 'history-in-sublime-merge';

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

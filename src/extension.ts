import * as vscode from "vscode";
import * as newFile from "./newFile";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("new-file.run", () => newFile.run()),
  );

  context.subscriptions.push(newFile);
}

export function deactivate() {}

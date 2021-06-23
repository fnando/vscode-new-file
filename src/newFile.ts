import * as vscode from "vscode";
import path from "path";
import os from "os";
import fs from "fs";

import { DataSource } from "./DataSource";
import { DataSourceEntry } from "./DataSourceEntry";

const disposable: vscode.Disposable[] = [];

export function addReplacements(entry: string, date: Date): string {
  const padNumber = (num: number) => num.toString().padStart(2, "0");

  return entry
    .replace(/(?<!%)%F/g, "%Y-%m-%d")
    .replace(/(?<!%)%Y/g, date.getFullYear().toString())
    .replace(/(?<!%)%m/g, padNumber(date.getMonth() + 1))
    .replace(/(?<!%)%d/g, padNumber(date.getDate()))
    .replace(/(?<!%)%H/g, padNumber(date.getHours()))
    .replace(/(?<!%)%M/g, padNumber(date.getMinutes()))
    .replace(/(?<!%)%S/g, padNumber(date.getSeconds()))
    .replace(/(?<!%)%s/g, padNumber(Math.floor(date.getTime() / 1000)))
    .replace(/(?<!%)%user/g, process.env.USER as string)
    .replace(/%%/g, "%");
}

export function dispose() {
  disposable.forEach((item) => item.dispose());
}

async function openFile(entry: string) {
  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.parse(`file:${entry}`),
  );

  vscode.window.showTextDocument(document);
}

function isFile(entry: string) {
  try {
    return fs.statSync(entry).isFile();
  } catch (error) {
    return false;
  }
}

function isDir(entry: string) {
  try {
    return fs.statSync(entry).isDirectory();
  } catch (error) {
    return false;
  }
}

function findRootDir(): string {
  if (vscode.workspace.workspaceFolders) {
    return vscode.workspace.workspaceFolders[0].uri.path;
  }

  if (vscode.window.activeTextEditor?.document.uri) {
    return path.dirname(vscode.window.activeTextEditor.document.uri.path);
  }

  return os.homedir();
}

export function run() {
  const panel = vscode.window.createQuickPick();
  const rootdir = findRootDir();
  const dataSource = new DataSource({ rootdir, homedir: os.homedir() });
  let currentEntry = new DataSourceEntry(rootdir, dataSource.options);
  let didChangeSelection = false;

  panel.canSelectMany = false;

  disposable.push(
    panel.onDidHide(() => {
      dispose();
      panel.dispose();
    }),
  );

  const updateItems = async () => {
    const entries = await dataSource.entries(currentEntry.path);

    const items: vscode.QuickPickItem[] = entries.map((entry) => ({
      label: `$(folder) ${entry.collapsedPath}`,
    }));

    panel.items = items;
    panel.title = currentEntry.path;
  };

  updateItems();

  disposable.push(
    panel.onDidChangeValue(async (value: string) => {
      if (didChangeSelection) {
        didChangeSelection = false;
        return;
      }

      value = value.trim();

      // If value is empty, then just display all project dir's entries.
      if (value === "") {
        currentEntry = new DataSourceEntry("", dataSource.options);
        console.log("here", currentEntry.path, currentEntry.collapsedPath);
        return updateItems();
      }

      if (value === "~" && currentEntry.collapsedPath === "~/") {
        currentEntry = new DataSourceEntry(
          path.join(dataSource.options.rootdir, "~"),
          dataSource.options,
        );

        return updateItems();
      }

      if (value === "~") {
        currentEntry = new DataSourceEntry("~", dataSource.options);
        return updateItems();
      }

      currentEntry = new DataSourceEntry(value, dataSource.options);
      updateItems();
    }),
  );

  disposable.push(
    panel.onDidChangeSelection(async ([selectedItem]) => {
      if (!selectedItem) {
        return;
      }

      didChangeSelection = true;

      currentEntry = new DataSourceEntry(
        selectedItem.label.replace("$(folder) ", ""),
        dataSource.options,
      );

      if (currentEntry.isDir) {
        panel.value = `${currentEntry.collapsedPath}/`;
      }

      updateItems();
    }),
  );

  disposable.push(
    panel.onDidAccept(async () => {
      if (!currentEntry.isDir && isFile(currentEntry.path)) {
        await openFile(currentEntry.path);
        panel.hide();
        return;
      }

      if (currentEntry.isDir && isDir(currentEntry.path)) {
        return updateItems();
      }

      const replacedPath = addReplacements(currentEntry.path, new Date());

      if (currentEntry.isDir) {
        try {
          fs.mkdirSync(replacedPath, { recursive: true });
        } catch (error) {
          vscode.window.showErrorMessage("The directory could not be created.");
        }

        panel.hide();
        return;
      }

      try {
        fs.mkdirSync(path.dirname(replacedPath), { recursive: true });
        fs.writeFileSync(replacedPath, "");
        await openFile(replacedPath);
        panel.hide();
      } catch (error) {
        vscode.window.showErrorMessage("The file could not be created.");
      }
    }),
  );

  panel.show();
}

import path from "path";
import fs from "fs";

import { DataSourceEnv } from "./DataSourceEnv";

function isDir(entry: string): boolean {
  try {
    return fs.statSync(entry).isDirectory();
  } catch (error) {
    return false;
  }
}

function collapse(entry: string, options: DataSourceEnv): string {
  const didHaveTrailingSlash = entry.endsWith("/");

  if (entry.startsWith(options.rootdir)) {
    return entry.substring(options.rootdir.length + 1);
  }

  if (entry.startsWith(options.homedir)) {
    return appendTrailingSlash(
      path.join("~", entry.substr(options.homedir.length)),
      didHaveTrailingSlash,
    );
  }

  return entry;
}

function appendTrailingSlash(
  entry: string,
  didHaveTrailingSlash: boolean,
): string {
  const mustHaveTrailingSlash = didHaveTrailingSlash || isDir(entry);

  return entry.replace(/\/+$/, "") + (mustHaveTrailingSlash ? "/" : "");
}

function expand(entry: string, options: DataSourceEnv): string {
  const didHaveTrailingSlash = entry.endsWith("/");

  if (entry.startsWith("~")) {
    entry = path.join(options.homedir, entry.replace(/^\~\/?/, ""));
  }

  if (entry.startsWith("/")) {
    entry = path.resolve(entry);
  } else {
    entry = path.resolve(path.join(options.rootdir, entry));
  }

  return appendTrailingSlash(entry, didHaveTrailingSlash).replace(/\/$/, "");
}

export class DataSourceEntry {
  public path: string;
  public collapsedPath: string;
  public isDir: boolean;

  constructor(entry: string, options: DataSourceEnv) {
    this.path = expand(entry, options);
    this.collapsedPath = collapse(this.path, options);
    this.isDir = entry.endsWith("/") || isDir(this.path);
  }
}

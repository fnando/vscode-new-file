export class DataSourceEnv {
  public readonly homedir: string;
  public readonly rootdir: string;

  constructor({ homedir, rootdir }: { homedir: string; rootdir: string }) {
    this.homedir = homedir.replace(/\/$/, "") + "/";
    this.rootdir = rootdir.replace(/\/$/, "") + "/";
  }
}

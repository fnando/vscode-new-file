import assert from "assert";
import path from "path";
import { DataSourceEntry } from "../../DataSourceEntry";
import { suite } from "mocha";

import "../fixtures/a/a.1/file.json";

suite("DataSourceEntry", () => {
  test("detects ~", () => {
    const homedir = path.resolve(path.join(__dirname, "..", "fixtures"));
    const rootdir = "/tmp/foo/bar";

    let entry = new DataSourceEntry("~", { homedir, rootdir });

    assert.strictEqual(entry.path, homedir);
    assert.strictEqual(entry.collapsedPath, "~");

    entry = new DataSourceEntry("~/a/a.1", { homedir, rootdir });

    assert.strictEqual(entry.path, path.join(homedir, "a/a.1"));
    assert.strictEqual(entry.collapsedPath, "~/a/a.1");
  });

  test("detects relative path to root dir", () => {
    const homedir = path.resolve(path.join(__dirname, "..", "fixtures"));
    const rootdir = path.join(homedir, "a");
    const entry = new DataSourceEntry("a.1", { homedir, rootdir });

    assert.strictEqual(entry.path, path.join(rootdir, "a.1"));
    assert.strictEqual(entry.collapsedPath, "a.1");
  });

  test("detects /", () => {
    const homedir = path.resolve(path.join(__dirname, "..", "fixtures"));
    const entry = new DataSourceEntry("/tmp", { homedir, rootdir: homedir });

    assert.strictEqual(entry.path, "/tmp");
    assert.strictEqual(entry.collapsedPath, "/tmp");
  });

  test("detects file relative to root dir", () => {
    const homedir = path.resolve(path.join(__dirname, "..", "fixtures"));
    const rootdir = path.join(homedir, "a");
    const entry = new DataSourceEntry("a.1/file.json", { homedir, rootdir });

    assert.strictEqual(entry.path, path.join(rootdir, "a.1/file.json"));
    assert.strictEqual(entry.collapsedPath, "a.1/file.json");
  });
});

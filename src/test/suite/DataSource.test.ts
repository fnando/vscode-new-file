import assert from "assert";
import path from "path";

import { DataSource } from "../../DataSource";
import { DataSourceEntry } from "../../DataSourceEntry";

function assertDataSourceEntry(
  actual: DataSourceEntry | undefined,
  expected: DataSourceEntry,
) {
  assert.ok(actual);
  assert.strictEqual(actual.path, expected.path);
  assert.strictEqual(actual.collapsedPath, expected.collapsedPath);
}

test("returns entries for homedir", async () => {
  const homedir = path.resolve(path.join(__dirname, "..", "fixtures"));
  const rootdir = "/tmp/foo/bar";
  const options = { homedir, rootdir };

  const source = new DataSource(options);
  const entries = await source.entries("~");

  assert.strictEqual(entries.length, 1);
  assertDataSourceEntry(
    entries[0],
    new DataSourceEntry(path.join(homedir, "a"), options),
  );
});

test("returns entries for rootdir", async () => {
  const homedir = path.resolve(path.join(__dirname, "..", "fixtures"));
  const rootdir = path.join(homedir, "a");
  const options = { homedir, rootdir };

  const source = new DataSource(options);
  const entries = await source.entries("a");

  assert.strictEqual(entries.length, 1);
  assertDataSourceEntry(
    entries[0],
    new DataSourceEntry(path.join(rootdir, "a.1"), options),
  );
});

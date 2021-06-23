import assert from "assert";

import { addReplacements } from "../../newFile";

const date = new Date(2021, 6, 14, 9, 36, 42);

test("replaces all year occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%Y/%Y.txt", date),
    `/foo/2021/2021.txt`,
  );
});

test("replaces all month occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%m/%m.txt", date),
    `/foo/07/07.txt`,
  );
});

test("replaces all day occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%d/%d.txt", date),
    `/foo/14/14.txt`,
  );
});

test("replaces all hour occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%H/%H.txt", date),
    `/foo/09/09.txt`,
  );
});

test("replaces all minutes occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%M/%M.txt", date),
    `/foo/36/36.txt`,
  );
});

test("replaces all seconds occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%S/%S.txt", date),
    `/foo/42/42.txt`,
  );
});

test("replaces timestamp occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%s/%s.txt", date),
    `/foo/1626280602/1626280602.txt`,
  );
});

test("replaces %F occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%F/%F.txt", date),
    `/foo/2021-07-14/2021-07-14.txt`,
  );
});

test("replaces %user occurrences", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%user/%user.txt", date),
    `/foo/${process.env.USER}/${process.env.USER}.txt`,
  );
});

test("respects escaped %", async () => {
  assert.deepStrictEqual(
    addReplacements("/foo/%%F/%F.txt", date),
    `/foo/%F/2021-07-14.txt`,
  );
});

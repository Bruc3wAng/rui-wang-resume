import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

for (const [build, prefix] of [
  ["out", "/rui-wang-resume"],
  ["dist/client", ""],
]) {
  test(`${build} serves the portrait directly in both languages`, async () => {
    for (const page of ["index.html", "en/index.html"]) {
      const html = await readFile(new URL(`${build}/${page}`, root), "utf8");
      const portrait = [...html.matchAll(/<img\b[^>]*>/g)]
        .map(([tag]) => tag)
        .find((tag) => tag.includes("rui-wang-portrait.jpg"));
      assert.ok(portrait, `${build}/${page}: portrait is present`);
      assert.ok(
        portrait.includes(`src="${prefix}/images/rui-wang-portrait.jpg"`),
        `${build}/${page}: portrait must use the bundled image`,
      );
      assert.doesNotMatch(portrait, /\/_vinext\/image|\/_next\/image/);
      assert.match(portrait, /width="1023"/);
      assert.match(portrait, /height="1144"/);
    }
  });
}

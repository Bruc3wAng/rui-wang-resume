import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const sitesBuild = process.env.RUI_SITES_BUILD_DIR ?? "dist/client";
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");

test("navigation avatar preserves the original and losslessly encodes the display-size derivative", async () => {
  const original = await readFile(new URL("public/images/rui-wang-chibi.png", root));
  const compact = await readFile(new URL("public/images/rui-wang-avatar-192.webp", root));
  assert.equal(createHash("sha256").update(original).digest("hex"), "583c73a88355f8e00f20275923a2c01fbd7346dd657d4c827af8855208486fa0");
  const info = await sharp(compact).metadata();
  assert.equal(info.format, "webp");
  assert.equal(info.width, 192);
  assert.equal(info.height, 192);
  assert.ok(compact.length < 40_000 && compact.length < original.length * .025);
  const expected = await sharp(original).resize(192, 192, { fit: "inside", withoutEnlargement: true, kernel: "lanczos3" }).raw().toBuffer();
  const decoded = await sharp(compact).raw().toBuffer();
  assert.deepEqual(decoded, expected, "No crop, recoloring or lossy pixel changes beyond the declared resize");
});

for (const [build, prefix] of [
  ["out", "/rui-wang-resume"],
  [sitesBuild, ""],
]) {
  test(`${build} loads the compact navigation avatar eagerly on both homepages and Atlas pages`, async () => {
    const compact = await readFile(new URL("public/images/rui-wang-avatar-192.webp", root));
    assert.deepEqual(await readFile(new URL(`${build}/images/rui-wang-avatar-192.webp`, root)), compact);
    for (const page of ["index.html", "en/index.html", "overseas/index.html", "en/overseas/index.html"]) {
      const html = await readFile(new URL(`${build}/${page}`, root), "utf8");
      const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
      const avatar = images.filter(tag => tag.includes("rui-wang-avatar-192.webp"));
      assert.equal(avatar.length, 1, `${build}/${page}: exactly one navigation avatar`);
      assert.ok(avatar[0].includes(`src="${prefix}/images/rui-wang-avatar-192.webp"`));
      assert.match(avatar[0], /loading="eager"/);
      assert.match(avatar[0], /fetch[Pp]riority="high"/);
      assert.match(avatar[0], /decoding="async"/);
      assert.doesNotMatch(avatar[0], /srcset=|sizes=/i, "Do not attach incorrect width descriptors to the pre-sized static asset");
      assert.doesNotMatch(avatar[0], /\/_vinext\/image|\/_next\/image/);
      assert.ok(!images.some(tag => tag.includes("rui-wang-chibi.png")), "Full-size archive is not requested by the initial page");
    }
  });
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
      // The source portrait stays unchanged; its display footprint is deliberately small.
      assert.match(portrait, /width="48"/);
      assert.match(portrait, /height="54"/);
    }
  });
}

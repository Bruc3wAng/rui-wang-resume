// Create a lossless delivery-size copy; retain the full-resolution source.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const root = new URL("../", import.meta.url);
const source = new URL("public/images/rui-wang-chibi.png", root);
const output = new URL("public/images/rui-wang-avatar-192.webp", root);
const original = await readFile(source);
const sourceSha256 = createHash("sha256").update(original).digest("hex");
assert.equal(sourceSha256, "583c73a88355f8e00f20275923a2c01fbd7346dd657d4c827af8855208486fa0");
await sharp(original)
  .resize(192, 192, { fit: "inside", withoutEnlargement: true, kernel: "lanczos3" })
  .webp({ lossless: true, effort: 6 })
  .toFile(fileURLToPath(output));
const derivative = await readFile(output);
assert.deepEqual(await readFile(source), original);
console.log(JSON.stringify({
  source: fileURLToPath(source), sourceSha256, sourceBytes: original.length,
  output: fileURLToPath(output), sha256: createHash("sha256").update(derivative).digest("hex"),
  bytes: (await stat(output)).size, width: 192, height: 192,
  savedPercent: 100 * (1 - derivative.length / original.length),
  encoding: "lossless WebP", crop: false,
}));

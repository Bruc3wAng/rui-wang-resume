// Render the approved one-page PDFs. No document rewriting or image generation.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import release from "../content/resume-release.json" with { type: "json" };

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const root = new URL("../", import.meta.url);
const renderer = process.env.RUI_PDFTOPPM;
if (!renderer) throw Error("Set RUI_PDFTOPPM to the installed Poppler pdftoppm executable.");
const info = join(dirname(renderer), "pdfinfo");
const qa = process.env.RUI_PREVIEW_QA ?? fileURLToPath(new URL("tmp/resume-previews/", root));
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
await mkdir(qa, { recursive: true });
const previews = {};
for (const language of ["zh", "en"]) {
  const document = language === "en" ? release.english : release;
  const source = fileURLToPath(new URL(`public/resume/rui-wang-resume-${language}.pdf`, root));
  if (sha(await readFile(source)) !== document.pdfSha256) throw Error(`Unreviewed ${language} PDF`);
  const metadata = execFileSync(info, [source], { encoding: "utf8" });
  if (!/^Pages:\s+1\s*$/m.test(metadata)) throw Error("Résumé preview requires exactly one source page");
  const prefix = join(qa, `resume-${language}`);
  execFileSync(renderer, ["-f", "1", "-l", "1", "-singlefile", "-png", "-scale-to-x", "1800", "-scale-to-y", "-1", source, prefix]);
  const output = fileURLToPath(new URL(`public/resume/rui-wang-resume-${language}.webp`, root));
  await sharp(prefix+".png").webp({ lossless: true, effort: 6 }).toFile(output);
  const [original, published] = await Promise.all([sharp(prefix+".png").removeAlpha().raw().toBuffer(), sharp(output).removeAlpha().raw().toBuffer()]);
  if (!original.equals(published)) throw Error(`Pixel mismatch in the ${language} preview`);
  const bytes = await readFile(output), image = await sharp(output).metadata();
  previews[language] = { path: `/resume/rui-wang-resume-${language}.webp`, width: image.width, height: image.height,
    sha256: sha(bytes), sourcePdfSha256: document.pdfSha256, bytes: bytes.length };
}
process.stdout.write(JSON.stringify({ previews, pixelsUnchanged: true })+"\n");

# Rui Wang — Bilingual Research Portfolio

A bilingual professional profile for Rui Wang (王睿), Research Executive at Ipsos. The site leads with work experience, then presents research contexts, analytical capabilities, a reusable human–AI research workflow, and selected personal product cases.

## Site highlights

- Experience-first Chinese and English pages
- Quantitative research, multi-market insight, and delivery ownership
- Interactive research-case and human–AI workflow modules
- Personal product cases demonstrating product thinking and implementation
- Featured research-data prototype; other personal projects remain expandable secondary content
- Responsive layouts for desktop, tablet, and mobile
- Rotatable satellite-textured globe, China/U.S. focal views, and market-linked research entries
- Working comparison checks, update-scope planning, and example-library queries
- Standalone bilingual résumé, browser-local photo editor, and restaurant-selection exhibits

## Local development

The project uses the bundled vinext starter for local Sites compatibility and Next.js static export for GitHub Pages.

```bash
pnpm install
pnpm dev
```

Static GitHub Pages build:

```bash
NEXT_PUBLIC_BASE_PATH=/rui-wang-resume pnpm run build:github
```

Quality checks:

```bash
pnpm run lint
pnpm test
```

Before publishing to both hosts, build GitHub Pages with its base path, run
`pnpm run build` for Sites, then run `NEXT_PUBLIC_BASE_PATH=/rui-wang-resume pnpm run test:release`.
This also checks that both language pages serve the bundled portrait directly
without relying on a runtime image-optimization endpoint.

The homepage places three representative study links next to the introduction and before the market globe in reading order. The links use the same permanent case fragments as the full work section, including with scripts unavailable. The work section keeps desktop roving tabs and exposes a full mobile study index. Each public study has a stable `#study-…` link and a copy action; the live language switch and browser history keep the addressed study. Explicit mobile selection opens the matching contribution with an index return action; related AI practices link back to their actual work entry. The personal prototype has no employer-study association.

The case text separates context, the researcher's decisions, verified AI use, and a selected deliverable's purpose. The deliverable action opens its exact entry in the existing research folio, which retains three contribution/purpose views per study. Folios grow with their content, support keyboard selection and Escape-to-close, and return focus to the action that opened them.

Each AI practice has a stable `#practice-…` address. Work cases link to their actual practice; language switching, reload, and browser history keep the addressed practice. Copying a practice shares its localized public address, not example inputs or results. A no-script view still shows the addressed practice and offers native links to its case and other language.

The analysis workflow and the cross-market report description link to `#example-relative-weights`. The worked example holds correlations with satisfaction fixed and changes just one pairwise predictor correlation. It compares Pearson ranks with Johnson relative weights, exposes the inputs and an independent regression check of model R², and links back to the case deliverable. Two constructed scenarios render as ordinary tables and switch with native radio controls even without scripts.

The personal Research Data Platform prototype links to `#prototype-research-questions`. Three questions run the existing source review with comparable, single-record, and no-eligible-record scopes. The result view and all three exports use the same evidence decision; native disclosures show the decisions with scripts off. This is a presentation of the prototype's research logic using constructed records, not a publication of its database or implementation.

## Content maintenance

Each AI practice opens with the researcher's judgment, the work done with Codex, and the delivered result or prototype. These three steps stay visible when switching details. The runnable examples cover a cross-wave audience-mix comparison, a new wave with a revised measure, and a research source query. The comparison computes observed rates and rates under a common reference mix from constructed group counts; if any comparison criterion changes, it withholds the numerical comparison. Visitors can inspect the numerator, denominator, and calculation, and download the findings with the selected reference. The tracking example generates before and after chart and text from the same constructed data. It keeps an incompatible measure separate, preserves historical values, and traces each selected change to updates and analyst checks. The source query screens constructed product records by category, channel, batch, and net weight before converting list prices to a common unit. It shows the original fields, formulas, and reasons for exclusion. The visible document and text download share one output model. Each practice has three output documents; changed inputs invalidate prior results before anything can be downloaded again. The examples do not use client data.

- Website copy: `content/resume.ts`
- Chinese résumé download: `public/resume/rui-wang-resume-zh.pdf`
- English résumé download: `public/resume/rui-wang-resume-en.pdf`
- Résumé pages default to the current interface language and offer a Chinese/English document switch. The reader uses lossless page previews rendered from the released PDFs, with zoom, direct PDF access and downloads; it does not require an embedded PDF plug-in. Regenerate previews with `RUI_PDFTOPPM=/path/to/pdftoppm node scripts/build_resume_previews.mjs` and record the returned source-PDF/image hashes in `content/resume-release.json`.
- The résumé page links its three selected research entries to the exact existing deliverable descriptions in the same language. Native in-page links lead to `#resume-work` and `#resume-downloads`. Changing the website language keeps either supported anchor; the résumé document selector still changes only the document.
- Chinese routes use `app/(zh)/layout.tsx`; English routes use `app/en/layout.tsx`. Both are server-rendered document roots with fixed, correct `lang` values. Route groups do not change the public URLs. Keep shared metadata and viewport settings in `content/document-metadata.ts`; do not restore a Chinese-only top-level layout or repair document language after hydration.
- Atlas language navigation retains its selected country, indicator, year and topic in the destination URL. The same selection is restored by the destination page; language-link `lang` and `hreflang` identify the target language.
- Atlas header links share vertically centered text and 44px targets. On narrow screens the brand stays above a single evenly spaced navigation row; preserve source, locale and portfolio destinations and visible keyboard focus when editing this header.
- Atlas starts with a neutral preparation state until URL selection restoration is complete. The initial HTML still contains the full default dataset inside a disabled fieldset. A native `#atlas-default-data` link reveals that read-only view even when application scripts are blocked; normal hydration enables the controls and removes the preparation state. Keep default labels bound to the same default selection constants as the explorer.
- When the Sites export is built in a separate checkout, set `RUI_SITES_BUILD_DIR` to that checkout's absolute `dist/client` path for release tests. This checks the actual current export rather than a stale copy left in this checkout.
- Résumé release and file checksum: `content/resume-release.json`
- Portrait: `public/images/rui-wang-portrait.jpg`
- Navigation avatar: `public/images/rui-wang-avatar-192.webp`, a lossless display-size copy generated by `node scripts/build_navigation_avatar.mjs`. The original `rui-wang-chibi.png` stays unchanged. Above-the-fold avatar images load eagerly with a high fetch priority; keep their established CSS sizes and crop.
- Localized share copy: `content/social-cards.ts`; image paths and hashes: `content/social-images.json`
- Social-card builder: `scripts/build_social_preview.mjs` (Node 24, local `@napi-rs/canvas` and the existing Sharp dependency). Set `RUI_FONT_HAN`, `RUI_FONT_LATIN` and `RUI_FONT_LATIN_BOLD` to licensed Microsoft YaHei and Arial files; `RUI_GRAPHICS_MODULES` can point to an existing graphics runtime. Font binaries stay local. The builder prints the manifest and font audit; review them before updating the checked-in manifest. `scripts/build_social_preview.py` forwards to this builder.
- Cards have content-hashed image URLs for each language and page. `public/social-preview.png` is a Chinese-profile compatibility alias; public metadata uses the localized files.

The verified master résumé data remains in the parent project’s `resume-library/resume_master.json`. New facts should be verified there before the bilingual public copy is updated.

Current website prose is an editorial adaptation of the verified V17 résumé facts, emphasizing project responsibility, analytical judgment, and concrete AI-assisted delivery. The PDF remains the validated V17 document; website wording need not be verbatim. The private résumé library records the reviewed source hashes and evidence. Maintain client wording as ByteDance and Lenovo only. Describe overall research experience as multi-country; the two separate tracking studies retain their own verified market lists, which are not a complete career total. The website expands the two product-research internships with verified exhibition-sector pre-acquisition commercial research; it does not claim valuation, deal execution or acquisition completion. Personal research prototypes stay separate from employment achievements and do not imply commercial validation. Keep evidence, internal project files, and the private résumé library outside this repository.

Each work case leads with its project title, responsibility, concrete contribution, and a representative deliverable. Each folio cover row opens the corresponding output, with keyboard focus restored to that row or the case’s deliverable link on close. The open folio shows the case and role. Each existing description has a stable `#output-<case>--<output>` address; copying or switching languages retains the selected output, and the native no-script target shows the same contribution and purpose. Output names and descriptions share the case and folio sources.

When updating a résumé download, copy the validated PDF, update its filename/version/hash and source-bound preview in `content/resume-release.json`, then build and run the content tests. Chinese and English PDFs share the verified V17 facts; English wording is adapted for English-language applications. Tests check both exported PDFs and preview assets byte-for-byte against the release record. Public disclosure rules belong in maintenance notes and tests, not visitor copy.

## Image credits

- Earth surface: [NASA Blue Marble surface texture](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg).
- Clouds: [NASA Blue Marble cloud composite](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg), used as a visual texture, not current weather.
- Night lights: [NASA Black Marble 2016, 3600×1800](https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg), from the [NASA Earth at Night maps](https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/). This historical composite is a visual texture, not a current electricity, population or economic indicator.
- Satellite mode uses graded ivory relief, ink-blue oceans, a light cloud layer and a thin atmosphere; selected market markers remain interactive. Research-network mode adds a dark stippled map, warm focus links, cool secondary links and light packets moving along the existing paths. Paths join the Beijing base to verified markets or connect markets in the same verified tracking study; they illustrate comparisons, not traffic, electricity, sample counts or client relationships. China and U.S. focal views work in either mode. Neither mode uses decorative rings.
- The market index sits under the globe. A pin reveals only as much of the index as needed; the native market picker can change scope without rotating a fallback image or moving focus. The U.S. view opens the independently owned content-consumption study first and keeps all four verified U.S. studies available. Each entry names the scope and responsibility; detail separates contribution, delivery, and documented AI use. Links open the corresponding featured-work story and preserve the selected market and study on return. The standalone U.S. search-experience study stays inline. Rotation does not alter research scope, and without scripts the two multi-country cases remain available as ordinary links.
- In network mode, the optional selected-case layer filters the existing signals to the selected study's verified markets. A cross-market line appears only if both endpoints belong to that study; a single-market case shows a marker without cross-market lines. The Beijing hub belongs to the overview only. The study's market list is also readable in the detail panel with no WebGL.
- Verified study maps have stable `#map-…` addresses. Matching work cases link to the map and can return there after reading the full case. Language switching and reload preserve the case identity; the shared address does not store ad-hoc camera rotation. A script-free brief at the same address lists the verified markets and links to the related work case where one exists.
- The first-paint China view is rendered from the same textures, camera and shared material in `app/earth-material.ts` as the interactive Earth. Regenerate it offline with `node scripts/render_globe_poster.mjs`; the script uses the existing Next.js Sharp dependency and requires no downloads.
- Lenovo: [official horizontal logo asset](https://media.lenovobrandworld.fiestic.com/2021/01/08011220/03_Logo_01Overview_6B_v-07.png).
- University of Toronto: [official signature resource](https://www.utm.utoronto.ca/communications/brand-resources/utm-signature-usage-guidelines).
- The photo-editor demonstration uses an original code-native still-life illustration. Visitor-selected photographs remain browser-local.

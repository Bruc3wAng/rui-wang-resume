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

## Content maintenance

- Website copy: `content/resume.ts`
- Chinese résumé download: `public/resume/rui-wang-resume-zh.pdf`
- Résumé release and file checksum: `content/resume-release.json`
- Portrait: `public/images/rui-wang-portrait.jpg`
- Social preview source and build script: `work/social-preview-generated.png` and `scripts/build_social_preview.py`

The verified master résumé data remains in the parent project’s `resume-library/resume_master.json`. New facts should be verified there before the bilingual public copy is updated.

Current website prose is an editorial adaptation of the verified V17 résumé facts, emphasizing project responsibility, analytical judgment, and concrete AI-assisted delivery. The PDF remains the validated V17 document; website wording need not be verbatim. The private résumé library records the reviewed source hashes and evidence. Maintain client wording as ByteDance and Lenovo only. Describe overall research experience as multi-country; the two separate tracking studies retain their own verified market lists, which are not a complete career total. The website expands the two product-research internships with verified exhibition-sector pre-acquisition commercial research; it does not claim valuation, deal execution or acquisition completion. Personal research prototypes stay separate from employment achievements and do not imply commercial validation. Keep evidence, internal project files, and the private résumé library outside this repository.

When updating the résumé download, copy the validated PDF, update its filename/version/hash in `content/resume-release.json`, then build and run the content tests. The tests check the exported PDF byte-for-byte against the release record. Public disclosure rules belong in maintenance notes and tests, not visitor copy.

## Image credits

- Earth surface: [NASA Blue Marble surface texture](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg).
- Clouds: [NASA Blue Marble cloud composite](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg), used as a visual texture, not current weather.
- The first-paint China view is rendered from the same textures, camera and lighting as the interactive Earth. Regenerate it offline with `node scripts/render_globe_poster.mjs`; the script uses the existing Next.js Sharp dependency and requires no downloads.
- Lenovo: [official horizontal logo asset](https://media.lenovobrandworld.fiestic.com/2021/01/08011220/03_Logo_01Overview_6B_v-07.png).
- University of Toronto: [official signature resource](https://www.utm.utoronto.ca/communications/brand-resources/utm-signature-usage-guidelines).
- The photo-editor demonstration uses an original code-native still-life illustration. Visitor-selected photographs remain browser-local.

# Rui Wang — Bilingual Research Portfolio

A bilingual professional profile for Rui Wang (王睿), Research Executive at Ipsos. The site presents market and user research experience, anonymized case themes, analytical capabilities, and a reusable human–AI research workflow.

## Public information boundary

- ByteDance and Lenovo appear only at client level.
- All project themes are anonymized.
- The public site excludes phone number, internal project codes, sample details, pricing, and unpublished findings.
- The downloadable Chinese résumé contains fuller contact details.

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

## Content maintenance

- Website copy: `content/resume.ts`
- Chinese résumé download: `public/resume/rui-wang-resume-zh.pdf`
- Portrait: `public/images/rui-wang-portrait.jpg`
- Social preview source and build script: `work/social-preview-generated.png` and `scripts/build_social_preview.py`

The verified master résumé data remains in the parent project’s `resume-library/resume_master.json`. New facts should be verified there before the bilingual public copy is updated.

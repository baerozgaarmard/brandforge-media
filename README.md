# BrandForge Media website

Studio site for BrandForge Media, Dehradun. Live at https://brandforge-media.vercel.app. Every push to `main` deploys on Vercel.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Both commands first run `scripts/pages.mjs`, which writes the static pages below. Don't edit those files by hand; they are git-ignored and rebuilt every time.

## Where things live

| Path | What it is |
|---|---|
| `index.html`, `work.html` | Hand-written home and work pages. The project cards between the `<!--projects-->` markers are filled at build time. |
| `src/content.js` | Services (with prices) and journal articles |
| `src/locations.js` | City pages: `/india/<slug>.html` |
| `src/local.js` | Dehradun service pages (website, SEO, digital marketing, hotels, Shopify) |
| `src/projects.js`, `src/stories.js` | Concept case studies: `/work/<slug>.html` |
| `scripts/pages.mjs` | Generates `/india/`, `/services/`, `/work/`, `/journal/` and `public/sitemap.xml` |
| `partials/` | Shared header and footer for generated pages. `index.html` and `work.html` embed copies, so keep them in sync. |
| `src/main.js` | Scroll, cursor, header and enquiry form |
| `src/forge.js` | The Three.js scene on the home page (loaded only there) |
| `public/` | Static files: 3D models, case-study shots, favicons, `llms.txt`, `robots.txt`, IndexNow key |
| `mockups/` | Source designs for `public/shots/*.webp`; re-render with `bash mockups/capture.sh` |
| `marketing/` | Keyword research, listings and Google Business Profile copy (not part of the site) |

## Adding a page

- **City:** add an entry to `src/locations.js`. Keep the title ≤ 60 characters and `metaDesc` ≤ 155.
- **Article:** add to `posts` in `src/content.js`.
- **Service:** add to `services` in `src/content.js`.

The sitemap, breadcrumbs, schema and internal links update on the next build. After deploying, submit new URLs in Google Search Console (URL inspection → Request indexing).

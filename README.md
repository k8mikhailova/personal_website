# Kate Mikhailova — personal site

React + TypeScript + Vite. Styling is CSS Modules with shared design tokens in `src/styles/global.css`. Animations use [Motion](https://motion.dev) plus a hand-written canvas for the hero lines.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Where things live

Three pages, routed with React Router: Home (`/`), About (`/about`), Contact (`/contact`).

- `src/content/` — all copy and data. Edit text here, not in components.
  - `home.ts` intro, `experience.ts` timeline (projects are nested inside each role), `education.ts`
  - `about.ts` About page notes, age counter birth date, photo grid slots
  - `site.ts` name, nav, email/GitHub/LinkedIn/resume links
- `src/pages/` — one file per page.
- `src/sections/home/` — the homepage sections (Intro, ExperienceTimeline, Education).
- `src/components/` — reusable pieces (`hero/` lines + rotating headline, `experience/` nested project previews, `about/`, `layout/`, `ui/`).
- `public/` — static files: `resume.pdf`, photos, project screenshots.

Empty links, dates and photos render as dashed placeholders until real values are added.

## Deploy

Vercel: import the repo, framework preset "Vite". `vercel.json` rewrites all paths to `index.html` so `/about` and `/contact` work on refresh.

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

- `src/content/` — all copy and data (site links, hero, about, experience, education, projects, skills). Edit text here, not in components.
- `src/sections/` — homepage sections, in order: Hero, About, Experience, Education, Projects, Skills, Contact.
- `src/components/` — reusable pieces (`ui/`, `layout/`, `hero/`, `work/`).
- `public/` — static files. Put the resume at `public/resume.pdf`, your photo at e.g. `public/kate.jpg`, and project assets in `public/projects/<slug>/`.

Empty links and dates render as dashed placeholders until real values are added.

## Deploy

Vercel: import the repo, framework preset "Vite", no extra config needed.

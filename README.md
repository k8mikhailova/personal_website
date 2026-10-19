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

## Kate's AI Assistant (chatbot)

A small AI assistant on the About page that answers questions about Kate's background.

- **UI:** `src/components/about/AskKate.tsx` (text and starter questions in `src/content/askKate.ts`).
- **API:** `api/chat.ts` is a Vercel serverless function (`POST /api/chat`). Logic lives in `chatbot/`.
- **Knowledge base:** `chatbot/knowledge.ts` — everything the assistant may say about Kate. Public info only.
- **Personality and rules:** `chatbot/instructions.ts`.
- **Limits** (message length, history, output tokens, rate limits): `chatbot/limits.ts`.

Uses the OpenAI Responses API with `store: false`; conversations are not saved anywhere by the site.

### Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `OPENAI_API_KEY` | yes | Server-side only. Never add a `VITE_` prefix. |
| `OPENAI_MODEL` | no | Defaults to `gpt-5-mini`. |
| `OPENAI_REASONING_EFFORT` | no | GPT-5 models only. Defaults to `minimal`. |
| `CHAT_ALLOWED_ORIGINS` | no | Extra allowed origins, comma-separated. |

Locally: copy `.env.example` to `.env.local`, fill in the key, run `npm run dev` (the Vite dev server runs `/api/chat` too).
On Vercel: Project → Settings → Environment Variables, then redeploy.

### Tests

`npm test` runs the chatbot unit tests (validation, rate limiting, error handling, and the OpenAI request shape against a fake local server). `npm run typecheck` checks app and server code.

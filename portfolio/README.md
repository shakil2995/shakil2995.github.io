# Shakil — Portfolio

A single-page, futuristic-dark personal portfolio with an interactive 3D hero. Built with
**Vite + React + TypeScript**, **Three.js** (via react-three-fiber / drei), **Framer Motion**,
and **Tailwind CSS**.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # type-checks, then outputs static files to dist/
npm run preview  # serve the built dist/ locally to sanity-check
```

## Edit the content

Everything you'd want to change lives in **`src/data/portfolio.ts`** — your name, tagline,
stats, skills, projects, timeline, and links. No component edits needed for content.

Before publishing, personalize the two `// TODO:` fields in that file:

- `socials.email` — your real public contact email (used by the "Say hello" button).
- `socials.linkedin` / `socials.twitter` — optional; leave empty to hide.

## Deploy to cPanel (static hosting)

The build is fully static and uses **relative asset paths** (`base: './'` in `vite.config.ts`),
so it works from `public_html` root or any subfolder with no server config.

1. Run `npm run build`.
2. Open cPanel → **File Manager** → `public_html` (or a subfolder like `public_html/portfolio`).
3. Upload the **contents of `dist/`** (the files inside it — `index.html`, `assets/`, `favicon.svg`),
   not the `dist` folder itself. Zipping `dist/`'s contents and using "Extract" in File Manager
   is the fastest route.
4. Visit your domain — done. No `.htaccess` needed (it's a single page, no client-side routing).

> Fonts load from Google Fonts at runtime; the rest of the site is self-contained.

## Structure

```
src/
├── data/portfolio.ts        # ← all content lives here
├── hooks/                   # media-query, reduced-motion, scroll-spy
├── components/
│   ├── three/HeroScene.tsx  # the 3D hero (lazy-loaded, code-split)
│   ├── ui/                  # Reveal, SectionHeading, icons
│   ├── Navbar / Hero / About / Skills / Projects / Timeline / Contact / Footer
└── App.tsx
```

## Notes

- Honors `prefers-reduced-motion` (the 3D scene falls back to a static gradient).
- The Three.js scene is code-split into its own chunk so first paint isn't blocked.
- Lighter particle counts on mobile keep scrolling smooth.

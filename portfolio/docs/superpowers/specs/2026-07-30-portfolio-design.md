# Shakil — Portfolio Website Design

**Date:** 2026-07-30
**Status:** Approved

## Goal
A single-page, "wow"-factor personal portfolio for **Shakil**, a fullstack developer (MERN / Next.js / Flutter) at Wiining bees LLC. Futuristic dark aesthetic with an interactive 3D hero, deployed as static files to cPanel (`public_html`).

## Stack
- **Vite + React + TypeScript**
- **@react-three/fiber** + **@react-three/drei** — 3D hero scene
- **Framer Motion** — scroll reveals & transitions
- **Tailwind CSS** — styling
- No router (single-page anchor scroll) → no `.htaccess` needed
- `vite.config.ts` `base: './'` → relative asset paths, works from `public_html` or any subfolder

## Visual direction
Deep space-dark background, neon gradient accents (electric cyan → violet → magenta), glassmorphism cards, gradient headline type, scroll-triggered reveals. Studio-grade, not templated.

## Sections
1. **Navbar** — sticky glassmorphism, smooth-scroll anchors, active-section highlight, mobile menu.
2. **Hero** — full-screen react-three-fiber scene: mouse-reactive particle field + glowing distorted icosahedron core + starfield. Name, role/tagline, CTAs (View Work, Get in touch), animated scroll cue.
3. **About** — GitHub avatar, short bio, animated stat counters (8+ yrs since 2017, 45 repos, etc.).
4. **Skills** — tech grid grouped Frontend / Mobile / Backend / Tools, hover-glow, scroll reveal.
5. **Featured Projects** — cards with 3D hover-tilt, tech tags, GitHub/live links. Ushuttle, QRMate, IUB Help-Desk System, + 2 more.
6. **Journey** — vertical timeline that draws on scroll: Wiining bees LLC (current) → coding since 2017 → education.
7. **Contact** — bold CTA, email placeholder + GitHub/social links.
8. **Footer** — minimal credit + back-to-top.

## Architecture
- Content is **data-driven** in `src/data/portfolio.ts` (profile, skills, projects, timeline, socials) — single edit point.
- Components: `src/components/*` (sections) + `src/components/three/*` (3D scenes).
- Hooks: `src/hooks/*` (scroll spy, reduced-motion, media query).

## Performance & accessibility
- Honors `prefers-reduced-motion` (static fallback for the 3D scene).
- Lighter particle count on mobile; lazy-mounted Canvas.
- Semantic landmarks, keyboard-focusable nav/links, sufficient contrast on accent text.

## Deployment (cPanel)
1. `npm run build` → `dist/`.
2. Upload the **contents** of `dist/` into `public_html` (or a subfolder).
3. No server config needed (relative base, single page).

## Assumptions (correctable)
- Title: "Shakil — Fullstack Developer".
- Contact email: clearly-marked placeholder (no private address guessed). GitHub confirmed: https://github.com/shakil2995.
- Project descriptions written honestly from repo signals; swappable.

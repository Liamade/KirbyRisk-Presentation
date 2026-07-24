# Kirby Risk Presentation

A reveal.js 6 deck: the presenter's 6–7 months in IT support at Kirby Risk
(electrical distributor, Lafayette, IN — 100 years old in 2026). Tone:
personal accomplishments + promotional for the company. The presenter writes
the content; Claude's job is structure, styling, animation, and review.

## Commands

- `pnpm start` — Vite dev server on http://localhost:5173 (also `.claude/launch.json`, name `deck`)
- `pnpm build` — production build to `dist/`
- PDF export: open `http://localhost:5173/?print-pdf` → browser print to PDF

## Layout

- `index.html` — ALL slides, one `<section>` per slide, ordered top-to-bottom; deck config in the `<script type="module">` block at the bottom
- `theme/kirby-risk.css` — brand theme, once applied (it ships inside the kirby-risk-brand skill until then)
- `effects/kr-effects.css` + `effects/kr-effects.js` — signature animations, once installed (they ship inside the kr-effects skill until then)
- `public/images/` — images/logos, referenced as `/images/…`
- `docs/outline.md` — narrative outline (created by the story-coach agent)

## Skills — read before touching slides

- `.claude/skills/revealjs-authoring` — slide markup, deck config, layout patterns, design rules
- `.claude/skills/reveal-animations` — fragments, auto-animate, choreography rules
- `.claude/skills/kirby-risk-brand` — palette, typography, voice, verified company facts, and the theme CSS asset
- `.claude/skills/kr-effects` — signature animation library (counters, typewriter, sparks, draw-ons) + how to build new custom effects; live demo at `/.claude/skills/kr-effects/demo.html` when the dev server runs

## Agents

- `story-coach` — turns raw notes into a slide outline (`docs/outline.md`); doesn't touch HTML
- `slide-builder` — writes/edits slide markup per the skills
- `deck-reviewer` — runs the deck in the browser, walks every slide/fragment, reports ranked findings

Typical loop: story-coach → slide-builder → deck-reviewer → fix → re-review.

## Hard rules

- Never invent facts/metrics about the presenter's work — use `<!-- TODO -->` placeholders and ask.
- Company facts only from the brand skill's fact sheet (re-verify on kirbyrisk.com if load-bearing).
- Brand colors via CSS variables (`var(--kr-red)`), never raw hex in slide markup.
- Fit the canvas (1280×720 recommended) — split slides rather than shrink text.

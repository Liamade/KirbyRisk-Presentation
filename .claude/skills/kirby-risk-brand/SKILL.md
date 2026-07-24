---
name: kirby-risk-brand
description: Kirby Risk brand guidelines for this deck — official colors, typography, the ready-to-apply reveal.js theme, promotional voice, and verified company facts. Use when styling slides, applying or editing the theme, choosing colors, or writing company-facing copy.
---

# Kirby Risk brand guide

Sourced from kirbyrisk.com (July 2026). The company's own logo file is named
"Warm Red and Cool Gray" — those two colors ARE the brand.

## The theme (ships with this skill)

A complete Kirby Risk reveal.js theme lives at **`assets/kirby-risk.css` inside this
skill's directory**. It is NOT applied to the deck until the user wants it. To apply:

1. Copy `.claude/skills/kirby-risk-brand/assets/kirby-risk.css` → `theme/kirby-risk.css` in the repo root.
2. In `index.html`, replace the stock theme link (`…/dist/theme/black.css`) with
   `<link rel="stylesheet" href="theme/kirby-risk.css" id="theme" />`
   (keep the `reset.css` and `reveal.css` links above it).
3. Edit the copy in `theme/`, not the skill asset, for deck-specific tweaks; fold
   genuinely reusable improvements back into the asset.

**Fonts**: the theme asks for Roboto (kirbyrisk.com's font) but falls back to
Helvetica/Arial, which looks fine and needs no setup. For exact Roboto: add
`<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">`
(online only) — or self-host with @fontsource if the deck must be pixel-perfect offline.

## Palette

CSS variables defined at the top of the theme — always use the variable, never a raw hex:

| Variable | Hex | Use |
| --- | --- | --- |
| `--kr-red` | `#BF311A` | THE brand color. Accents, kickers, stat numbers, links, underlines. |
| `--kr-red-dark` / `--kr-red-deep` | `#8E2413` / `#6D1B0E` | Gradient partners for red; hover states. |
| `--kr-gray` | `#5F6062` | Cool Gray — secondary text, labels, the "Risk" in the wordmark. |
| `--kr-charcoal` / `--kr-ink` | `#212121` / `#1A1A1A` | Body text; dark divider backgrounds. |
| `--kr-light` / `--kr-line` | `#F2F2F2` / `#E6E6E6` | Panels, borders, subtle fills. |
| `--kr-gradient` | red 135° gradient | Impact slide backgrounds, the bottom brand bar. |

**Contrast rules**: white text on `--kr-red` or `--kr-charcoal` ✓. Red text on white/light ✓. Never red-on-charcoal or gray-on-red (fails contrast). Light slides are the default — the deck should read white/red/black like kirbyrisk.com.

**Ratio**: red is seasoning, not sauce — on a standard slide red appears in the kicker, the h2 underline, bullets, and maybe one stat or highlight. Full-red slides (`impact`) are for the title and closer only.

## Typography

Roboto stack, weights 400/500/700/900; Roboto Mono for code.

- Headings: 900 weight (h3/h4: 700). `h2` gets an automatic short red underline — suppress with class `no-rule` when it fights the layout.
- `kicker` class: the small red uppercase section label — every content slide has one.
- UPPERCASE + `letter-spacing: 0.04–0.12em` is the display treatment for mottos and dividers.

## Theme class quick reference

Slide variants: `impact` (white text, pair with the red gradient — see authoring skill), `divider` (same, charcoal), `center-text`.
Components: `kr-card`, `stat-row`/`stat`/`stat-number`/`stat-label`, `timeline`, `tags`/`tag`/`tag hot`, `blockquote + cite`, `wordmark`.
Text utilities: `kicker`, `muted`, `accent`, `small`, `no-rule`.
Media: `kr-shadow`, `rounded`. Motion: `fragment scale-in`, `fragment custom highlight-kr`, `kr-pulse`.
Full markup for each is in the `revealjs-authoring` skill.

## Logo

No official logo art is in the repo yet. Until the user drops files into `public/images/`:
- Use the text wordmark: `<span class="wordmark"><span class="kirby">Kirby</span> <span class="risk">Risk</span></span>` (red + cool gray, matching the real logo's colors).
- When official art lands, prefer it on title/closing slides; keep clear space around it and never recolor or stretch it. There is also a 100th-anniversary logo variant on kirbyrisk.com worth asking the user to obtain — it fits the centennial angle.

## Voice — promotional but earned

The deck promotes Kirby Risk through the presenter's real story, not ad copy.

- **Motto: "MAKE IT HAPPEN!"** — the company's rallying cry. Use it sincerely (it's a genuinely good closer), typically uppercase.
- **Core value: "sacrificial service"** — their own words for going above and beyond. Quote it, don't paraphrase it.
- Tagline on site: "Responsive Service and Quality Products".
- Tone: proud, concrete, Midwest-plainspoken. "60 PCs deployed across 8 branches" sells the company better than "world-class support".
- The 2026 centennial is the gift angle: a 100-year-old company trusting an intern with real work says everything about both.

## Company fact sheet (verified from kirbyrisk.com, July 2026)

- Founded **1926** by **James Kirby Risk** in an old blacksmith shop on North Second Street, **Lafayette, Indiana** → **100 years old in 2026**. Known as Kirby Risk Electric Co. by 1934.
- **40+ locations** across **Indiana, Illinois, Ohio, and Georgia**. HQ: 1815 Sagamore Parkway North, Lafayette, IN.
- A leading electrical supply wholesale distributor; five business operations:
  1. **Kirby Risk Electrical Supply** — electrical, automation, lighting, power distribution products
  2. **Kirby Risk Service Center** — custom wiring harnesses/subassemblies, JIT manufacturing
  3. **Kirby Risk Mechanical Solutions & Service** — electrical apparatus repair, motors, predictive maintenance
  4. **Kirby Risk Precision Machining** — CNC precision components
  5. **ARCO Electric Products** — roto-phase converters

Numbers above may drift — if a slide hinges on one, re-verify on kirbyrisk.com before finalizing. Facts about the presenter's own IT work must come from the user; never invent metrics for them.

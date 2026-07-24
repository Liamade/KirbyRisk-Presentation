---
name: kr-effects
description: The Kirby Risk signature animation library — reusable effects (animated counters, typewriter terminal, spark particles, SVG circuit draw-ons, power-on entrances, kinetic typography, custom fragments) plus patterns for building brand-new custom animations. Use when the user wants a slide to feel impossible in PowerPoint, asks for a specific wow-effect, or wants to invent a new animation.
---

# kr-effects — signature animations

Motion language: **electricity** (Kirby Risk is an electrical company — the deck's
animations should feel like power, current, and sparks, not generic slide-ware).

Files in this skill:
- `assets/kr-effects.css` — CSS effects (entrances, loops, custom fragments, draw-ons)
- `assets/kr-effects.js` — JS engine (counters, typewriter, sparks, text splitting)
- `demo.html` — live gallery of every effect. Preview it with the dev server running:
  `http://localhost:5173/.claude/skills/kr-effects/demo.html`

## Installing into the deck (once)

1. Copy both assets into the repo: `effects/kr-effects.css`, `effects/kr-effects.js`.
2. In `index.html` `<head>`, after the theme link:
   `<link rel="stylesheet" href="effects/kr-effects.css" />`
3. In the module script:
   ```js
   import { initKrEffects } from './effects/kr-effects.js';
   // …after deck.initialize():
   initKrEffects(deck);
   window.deck = deck; // expose for devtools and the deck-reviewer agent
   ```
Everything replays when a slide is revisited, renders final-state in `?print-pdf`
export, and collapses to instant for `prefers-reduced-motion` users.

## Effect catalog

### Entrances (automatic on slide entry — no keypress)
| Effect | Markup | Use for |
| --- | --- | --- |
| Power-on flicker | `<h1 class="kr-power-on">` | THE title-slide moment. One per deck. |
| Rise | `class="kr-rise"` | Anything that should drift up in without a click. |
| Auto-stagger | `<div class="kr-stagger">` (children cascade) | Tag rows, card trios. Step: `--kr-stagger-step`. |
| Kinetic type | `<h2 class="kr-cascade" data-kr-split="letters">` | Big statements. `words` mode for longer lines. |
| SVG draw-on | `<svg class="kr-draw">` — every path needs `pathLength="1"` | Circuit traces, diagrams, routes, underlines that draw themselves. Stagger strokes with `style="--kr-i: 1"`. |

### Loops (ambient — max ONE per slide)
| Effect | Markup | Notes |
| --- | --- | --- |
| Electrical glow | `class="kr-glow"` (`.white` variant on dark/red slides) | Title or closer only. |
| Shimmer sweep | `class="kr-shimmer"` | Metallic light pass over text. |
| Current wire | `<div class="kr-wire"></div>` | Animated divider — current flows through it. |
| Ken Burns | `data-state="kenburns"` + `data-background-image` on the section | Slow photo drift; audience feels it more than sees it. |
| Spark embers | `data-kr-sparks="80"` on the section | Canvas particles behind content. Title/closer only. |

### JS-driven (data attributes)
| Effect | Markup |
| --- | --- |
| Count-up number | `<span data-kr-count="250" data-kr-count-suffix="+"></span>` (+ `-prefix`, `-decimals`, `-duration`). Counts on slide entry, or on keypress if it's inside a `fragment`. |
| Typewriter | `<span data-kr-type>text to type</span>` (+ `data-kr-type-speed`, `data-kr-type-delay`). Multiple on one slide type sequentially in DOM order. |
| Terminal window | Wrap typed lines in the `.kr-terminal` component (see demo slide 3) — the IT-story prop. |

### Custom fragments (keypress reveals — `class="fragment kr-…"`)
`kr-wipe` (masked sweep) · `kr-blur-in` (snaps into focus) · `kr-flip` (swings in like a switch) · `kr-jolt` (lands with an electric thump — for the one number that matters).

### Timing overrides
Every CSS effect reads `style="--kr-delay: .4s; --kr-duration: 1.5s"` per element.

## Building a NEW custom animation (the three patterns)

1. **Keypress reveal** → custom fragment. Add to `effects/kr-effects.css`:
   ```css
   .reveal .fragment.my-effect { /* hidden state */ opacity: 0; visibility: hidden; transform: …; transition: all .5s ease; }
   .reveal .fragment.my-effect.visible { /* shown */ opacity: 1; visibility: inherit; transform: none; }
   ```
2. **Automatic on slide entry (replays each visit)** → keyframes scoped to the
   current slide. The `:not(:has(> section))` guard keeps vertical stacks from
   triggering early:
   ```css
   @keyframes my-entrance { from { … } to { … } }
   .reveal .slides section.present:not(:has(> section)) .my-entrance {
     animation: my-entrance var(--kr-duration, .8s) ease both;
     animation-delay: var(--kr-delay, .15s);
   }
   ```
3. **Anything CSS can't do** (numbers, canvas, DOM manipulation, sound) → hook
   reveal's event API in `effects/kr-effects.js`:
   ```js
   deck.on('slidetransitionend', (e) => { /* start when e.currentSlide is fully visible */ });
   deck.on('slidechanged', (e) => { /* reset e.previousSlide so it replays */ });
   deck.on('fragmentshown', (e) => { /* e.fragment stepped to */ });
   ```
   This is how the famous D3/chart decks work — animation code keyed to fragments.
   Rules: animate only `transform`/`opacity` where possible, always write the
   reset path, and honor the `INSTANT` flag (print + reduced motion).

Escalation paths when a vision outgrows this library: GSAP (timeline choreography),
D3 (data-driven charts on `fragmentshown`), three.js (3D), or the community
plugins at rajgoel/reveal.js-plugins (chalkboard, audio, SVG animate). Add a
dependency only for a specific slide that earns it.

## The "can't do that in PowerPoint" checklist

Reach for these when the deck needs to flex:
- **Live iframe slides** — `data-background-iframe="https://…" data-background-interactive`: embed the real ticket dashboard, the company site, anything with a URL (demo slide 8).
- **Auto-Animate morphs** — elements glide/grow between slides (see `reveal-animations` skill). PowerPoint's Morph is a toy next to it: reveal morphs code blocks line-by-line.
- **Animated counters + live terminal** — numbers that count and commands that type, exactly when you press the key.
- **Canvas particles / SVG that draws itself** — real-time graphics, not video exports.
- **Video backgrounds with content over them**, deep-linkable slides (`/#/7`), speaker view with notes+timer, and the whole thing versioned in git.

## Taste rules (unchanged from reveal-animations, they bind here too)

One hero moment per section. Motion carries meaning. 0.4–0.8s durations.
Loops are ambient, never load-bearing. If every slide sparkles, none do.

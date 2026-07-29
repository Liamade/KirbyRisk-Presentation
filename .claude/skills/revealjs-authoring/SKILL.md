---
name: revealjs-authoring
description: How to add, edit, and lay out slides in this reveal.js deck — markup structure, where slides go, deck config, layout patterns, speaker notes, and slide design rules. Use whenever creating or editing slides in index.html.
---

# Authoring slides in this deck

## Where things live

| What | Where |
| --- | --- |
| All slides | `index.html` — one `<section>` per slide inside `<div class="slides">` |
| Deck config & plugins | the `<script type="module">` block at the bottom of `index.html` |
| Brand theme | ships inside the `kirby-risk-brand` skill; apply per that skill (copy to `theme/kirby-risk.css`) before styling slides |
| Signature animations | ship inside the `kr-effects` skill; install per that skill (copies to `effects/kr-effects.css` + `.js`) |
| Images, logos, screenshots | `images/` at the repo root — reference RELATIVELY as `images/file.png` (no leading slash) so the deck also works under a plain static server like VS Code Live Server |
| Narrative outline | `docs/outline.md` (written by the story-coach agent) |

Slides stay in `index.html` (not split files): auto-animate and fragments need real HTML, and one file keeps ordering obvious. Dev server: `pnpm start` → http://localhost:5173 (also `.claude/launch.json`, name `deck`).

## Recommended deck config

Merge into the existing `new Reveal({ … })` init (keep whatever plugins are already there):

```js
const deck = new Reveal({
  width: 1280, height: 720, margin: 0.06,   // 16:9 canvas — design every slide inside it
  hash: true,                                // deep-linkable slides (/#/4)
  slideNumber: 'c/t',
  transition: 'slide',
  backgroundTransition: 'fade',
  autoAnimateEasing: 'ease-out',
  autoAnimateDuration: 0.7,
  plugins: [Notes], // list ONLY plugins that are imported (see below)
});
deck.initialize();
window.deck = deck; // expose for devtools poking and the deck-reviewer agent
```

Optional plugins — each entry in `plugins:` needs its matching import first:
```js
import Highlight from './node_modules/reveal.js/dist/plugin/highlight.mjs'; // code slides
import Zoom from './node_modules/reveal.js/dist/plugin/zoom.mjs';           // Alt+click zoom
```
Code slides also need the highlight stylesheet in `<head>`:
`<link rel="stylesheet" href="node_modules/reveal.js/dist/plugin/highlight/monokai.css" />`

The canvas never scrolls — reveal scales it. If content overflows, cut or split the slide; don't shrink fonts below theme defaults to cram.

## Slide structure

- Horizontal `<section>` = new topic. Nested `<section><section>…</section></section>` = vertical stack for optional drill-downs. Keep the main story horizontal — vertical slides are easy to miss when presenting.
- File order top-to-bottom = deck order left-to-right. Insert a slide by inserting a `<section>` at the right spot.
- Group with HTML comments: `<!-- ===== SECTION: The Company ===== -->` so the file scans like an outline.

## Slide skeleton

```html
<section>
  <span class="kicker">Section Label</span>
  <h2>One clear point</h2>
  <p>Supporting line.</p>
  <aside class="notes">What you'll actually say — press S for speaker view.</aside>
</section>
```

- Every content slide gets a `kicker` (small red section label) + one `h2`. `h1` is reserved for title/divider/impact slides.
- Body text is left-aligned by default (theme). Add class `center-text` to the section to center.
- Write speaker notes as you go — they're the script, and they export with PDFs.

## Layout patterns (require the Kirby Risk theme)

**Columns**
```html
<div class="cols">            <!-- add "middle" to vertically center -->
  <div class="col">left</div>
  <div class="col-2">right, twice as wide</div>
</div>
```

**Cards** — white panels with a red top edge:
```html
<div class="cols">
  <div class="col kr-card"><h3>Title</h3><p>Short text.</p></div>
  <div class="col kr-card"><h3>Title</h3><p>Short text.</p></div>
</div>
```

**Big-number stats** — the workhorse for impact slides:
```html
<div class="stat-row">
  <div class="stat"><span class="stat-number">250+</span><span class="stat-label">Tickets resolved</span></div>
  <div class="stat"><span class="stat-number">60</span><span class="stat-label">PCs deployed</span></div>
</div>
```

**Horizontal timeline** — one `li` per milestone, 4–6 max:
```html
<ul class="timeline">
  <li><b>Month 1</b>Onboarding</li>
  <li><b>Month 3</b>First solo project</li>
  <li><b>Month 6</b>Handoff</li>
</ul>
```

**Tag chips** — for tools/tech: `<div class="tags"><span class="tag">Active Directory</span><span class="tag hot">highlighted</span></div>`

**Quote** — `<blockquote>Text <cite>Name · Role</cite></blockquote>`

**Code** with step-through line highlighting (Highlight plugin required, see config above):
```html
<pre><code class="language-powershell" data-trim data-line-numbers="1-2|4|6">
# lines 1-2 highlight first, then 4, then 6 — one step per | group
</code></pre>
```

**Images**: `<img src="images/shot.png" class="kr-shadow" />` (shadow + rounded corners). Reveal built-ins: `r-stretch` on an img auto-fills remaining slide height; `r-fit-text` on a heading fills the width.

## Backgrounds

- Brand variants — class styles the text, attribute paints the background; use both:
  ```html
  <section class="impact" data-background-gradient="linear-gradient(135deg, #bf311a 0%, #8e2413 60%, #6d1b0e 100%)">
  <section class="divider" data-background-gradient="linear-gradient(150deg, #2a2a2a 0%, #1a1a1a 70%)">
  ```
  `impact` (red, white text) = title/closing only; `divider` (charcoal) = section breaks.
- Full-bleed image: `<section data-background-image="images/branch.jpg" data-background-opacity="0.3">` — keep opacity low or text drowns.
- Solid/gradient: `data-background-color="#F2F2F2"`, `data-background-gradient="linear-gradient(...)"`.
- Video: `data-background-video="images/clip.mp4" data-background-video-muted data-background-video-loop`.

## Design rules

1. One idea per slide. If a slide needs two headings, it's two slides.
2. Max ~5 bullets, ~8 words each. Prose belongs in speaker notes, not on screen.
3. Numbers beat adjectives: "250 tickets" not "lots of tickets". Use `stat-row`.
4. Slides support the speaker; they don't replace them. If a slide reads fine without you, it has too many words.
5. Check every slide against the canvas — press `O` (overview) in the browser to spot overflow fast.
6. Keyboard while testing: `F` fullscreen, `S` speaker view, `O` overview, `Alt+click` zoom (Zoom plugin).

## Export / print

Append `?print-pdf` to the URL, then browser Print → Save as PDF, landscape, no margins. The theme hides its bottom brand bar in print automatically.

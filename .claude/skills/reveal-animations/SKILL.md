---
name: reveal-animations
description: How to format animations in this deck — fragments (step-through reveals), auto-animate (morphing between slides), custom CSS animation classes, and choreography rules for when to use which. Use whenever adding motion, transitions, reveals, or animated sequences to slides.
---

# Animations in this deck

Two built-in reveal.js systems cover 95% of needs. Pick by intent — and for
signature wow-moments (counters, typewriter terminal, sparks, SVG draw-ons,
power-on entrances), use the reusable library in the `kr-effects` skill:

- **Fragments** — reveal things *within one slide*, one keypress at a time. Use for: bullet lists, stat rows appearing one by one, highlighting the current point.
- **Auto-Animate** — *morph between two slides* that share elements. Use for: a number growing, an element moving/restyling, code evolving, before → after.

Global timing lives in the `new Reveal({ … })` init block in `index.html`. Recommended (add if missing): `autoAnimateDuration: 0.7, autoAnimateEasing: 'ease-out', transition: 'slide', backgroundTransition: 'fade'`. Don't change globals to fix one slide — override per slide/element.

## Fragments

Add `class="fragment"` to any element; each fragment is one keypress.

```html
<ul>
  <li class="fragment">appears first</li>
  <li class="fragment">appears second</li>
</ul>
```

**Built-in styles** (add after `fragment`): `fade-up` `fade-down` `fade-left` `fade-right` `fade-out` `fade-in-then-out` `fade-in-then-semi-out` `grow` `shrink` `strike` `semi-fade-out` `current-visible` `highlight-red` `highlight-green` `highlight-blue` `highlight-current-red` (…green/blue)

**The Kirby Risk theme adds two custom fragments** (available once the theme from the `kirby-risk-brand` skill is applied):
- `class="fragment scale-in"` — scales up + fades in with a springy ease. House style for stats/cards.
- `class="fragment custom highlight-kr"` — text turns brand red + bold when stepped (the `custom` class is required; it disables the default fade).

**Ordering**: default is DOM order. Override with `data-fragment-index="1"` (same index = simultaneous):
```html
<p class="fragment" data-fragment-index="2">shown second</p>
<p class="fragment" data-fragment-index="1">shown first</p>
```

**Nesting** — one element, multiple steps: appears, then turns red, then fades:
```html
<span class="fragment fade-in">
  <span class="fragment custom highlight-kr">
    <span class="fragment fade-out">key phrase</span>
  </span>
</span>
```

**Step-through walkthroughs**: put `fade-in-then-semi-out` on list items so the current point is full-strength and previous ones dim — great for "what I did each month".

**New custom fragment styles** go in the theme CSS following this pattern:
```css
.reveal .fragment.myeffect { /* hidden state */ opacity: 0; transform: …; transition: all 0.4s ease; }
.reveal .fragment.myeffect.visible { /* shown state */ opacity: 1; transform: none; }
```

## Auto-Animate

Put `data-auto-animate` on **two adjacent** `<section>`s. Reveal tweens elements that match between them (animatable: position, size, font-size, color, background, margin, padding — done via CSS transforms, so it stays smooth).

**Matching rules**: text elements match on identical text + tag; images/media on `src`. When content differs (a number that changes, a box that transforms), force the match with `data-id`:

```html
<section data-auto-animate>
  <h1 data-id="num" style="font-size: 2em; color: var(--kr-red);">1926</h1>
</section>
<section data-auto-animate>
  <h1 data-id="num" style="font-size: 5.5em; color: var(--kr-red);">100</h1>
</section>
```
(The number swaps + grows in one motion. Unmatched elements on the new slide fade in.)

**Recipes that work well in this deck:**

1. *Growing stat* — the pattern above; use for the one number that matters most (e.g. the company centennial, or your biggest metric). Follow-up text on slide 2 fades in around it.
2. *List morph* — same `<ul>`, slide 2 adds/removes/reorders `<li>`s; matched items glide, new ones fade. Good for "the queue at week 1 vs week 12".
3. *Code evolution* — two `<pre data-id="code"><code data-trim data-line-numbers>` blocks; v1 script morphs into v2. Tells the "then I automated it" story. (Needs the Highlight plugin — see the authoring skill.)
4. *Title → corner* — big centered `h2` on slide 1; same text smaller at the top on slide 2 with content below. The heading "docks" while detail arrives.
5. *Card shuffle* — same three `kr-card`s, different order/emphasis; matched via `data-id="card1"` etc.

**Controls** (attributes on the destination `<section>` or element):
- `data-auto-animate-duration="1.2"` (seconds) / `data-auto-animate-easing="ease-in-out"` (any CSS easing)
- `data-auto-animate-delay="0.3"` — element-level only; stagger arrivals
- `data-auto-animate-unmatched="false"` — unmatched elements pop in instantly instead of fading
- `data-auto-animate-id="story2"` — sequences only chain between sections sharing the same id (or both having none); use it to stop accidental morphs between unrelated adjacent slides
- `data-auto-animate-restart` — force-break a chain even with matching ids

## Continuous / ambient motion

- `class="kr-pulse"` — slow scale pulse (theme-provided). At most **one** element, on at most the title or closing slide.
- New keyframe loops go in the theme CSS; animate only `transform` and `opacity` (compositor-friendly — anything else stutters when reveal scales the canvas).

## Choreography rules

1. Animation carries meaning: something grows because it grew, moves because it changed. Decoration-only motion gets cut.
2. One hero auto-animate moment per deck section. Everywhere else, plain `slide` transitions.
3. Fragments follow the spoken script — each keypress is a beat you'd pause on. Rehearse with `S` (speaker view).
4. Keep durations 0.4–0.8s. Over ~1s the audience waits for the deck.
5. Stat rows: `fragment scale-in` on each stat, left to right. Save simultaneous reveals (shared `data-fragment-index`) for the finale row.
6. Test every animated pair by arrowing **backward** too — auto-animate runs both directions.
7. If an auto-animate looks broken, check: are the sections adjacent? Same `data-auto-animate-id`? Do texts differ without a `data-id`? (`data-id` fixes 90% of cases.)

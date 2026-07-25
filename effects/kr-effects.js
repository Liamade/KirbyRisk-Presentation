/**
 * kr-effects.js — Kirby Risk signature animation engine for reveal.js
 *
 * Ships inside the kr-effects skill. To use: copy to effects/kr-effects.js,
 * then in index.html's module script:
 *
 *   import { initKrEffects } from './effects/kr-effects.js';
 *   const deck = new Reveal({ ... });
 *   deck.initialize();
 *   initKrEffects(deck);
 *
 * Provides (all replay when you revisit a slide, run instantly in
 * PDF export, and respect prefers-reduced-motion):
 *
 *   data-kr-count="250"        animated count-up number
 *     data-kr-count-prefix="$" data-kr-count-suffix="+"
 *     data-kr-count-duration="1.6" data-kr-count-decimals="1"
 *     (add class="fragment" to trigger on keypress instead of slide entry)
 *
 *   data-kr-type               typewriter: types the element's own text
 *     data-kr-type-speed="26"  ms per character
 *     data-kr-type-delay="300" extra ms before this element starts
 *     (elements on a slide type one after another, in DOM order)
 *
 *   data-kr-sparks="70"        on a <section>: ember particles drift up
 *                              behind the slide content (canvas layer)
 *
 *   data-kr-split="letters|words"  wraps text in indexed spans for the
 *                              CSS .kr-cascade effect (kinetic typography)
 */

export function initKrEffects(deck) {
  if (!deck || deck.__krEffects) return;
  deck.__krEffects = true;

  const INSTANT =
    /print-pdf/gi.test(window.location.search) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEl = deck.getRevealElement();

  /* ----------------------------------------------------------- helpers */

  const fmt = (value, decimals) =>
    value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  // An element participates on slide entry unless it sits in a fragment
  // that hasn't been stepped to yet (those trigger on fragmentshown).
  const isPending = (el) => {
    const frag = el.closest('.fragment');
    return frag && !frag.classList.contains('visible');
  };

  const eventFragments = (event) =>
    event.fragments || (event.fragment ? [event.fragment] : []);

  /* ----------------------------------------------------------- counters */

  const renderCount = (el, value) => {
    const decimals = parseInt(el.dataset.krCountDecimals || '0', 10);
    el.textContent =
      (el.dataset.krCountPrefix || '') +
      fmt(value, decimals) +
      (el.dataset.krCountSuffix || '');
  };

  const startCount = (el) => {
    const target = parseFloat(el.dataset.krCount);
    if (isNaN(target) || el.__krCounting) return;
    if (INSTANT) return renderCount(el, target);
    el.__krCounting = true;
    const duration = (parseFloat(el.dataset.krCountDuration) || 1.6) * 1000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      renderCount(el, target * (1 - Math.pow(1 - p, 3))); // ease-out cubic
      if (p < 1) el.__krRaf = requestAnimationFrame(tick);
      else el.__krCounting = false;
    };
    el.__krRaf = requestAnimationFrame(tick);
  };

  const resetCount = (el) => {
    cancelAnimationFrame(el.__krRaf);
    el.__krCounting = false;
    renderCount(el, 0);
  };

  /* --------------------------------------------------------- typewriter */

  const slideTimers = new Map(); // slide element -> [timeout ids]

  const addTimer = (slide, id) => {
    if (!slideTimers.has(slide)) slideTimers.set(slide, []);
    slideTimers.get(slide).push(id);
  };

  const prepareType = (el) => {
    if (el.__krFull == null) el.__krFull = (el.textContent || '').trim();
    el.textContent = INSTANT ? el.__krFull : '';
  };

  // Types one element; returns a promise so elements can run in sequence.
  const typeElement = (el, slide) =>
    new Promise((resolve) => {
      const text = el.__krFull || '';
      if (INSTANT || !text) {
        el.textContent = text;
        return resolve();
      }
      const speed = parseFloat(el.dataset.krTypeSpeed) || 26;
      const preDelay = parseFloat(el.dataset.krTypeDelay) || 0;
      let i = 0;
      el.classList.add('kr-typing');
      const step = () => {
        i += 1;
        el.textContent = text.slice(0, i);
        if (i >= text.length) {
          el.classList.remove('kr-typing');
          return resolve();
        }
        // jittered keystrokes read as human
        addTimer(slide, setTimeout(step, speed * (0.6 + Math.random() * 0.8)));
      };
      addTimer(slide, setTimeout(step, preDelay));
    });

  const resetType = (el) => {
    el.classList.remove('kr-typing');
    if (el.__krFull != null) el.textContent = '';
  };

  /* ------------------------------------------- per-slide start & reset */

  const started = new WeakSet();

  const startSlideEffects = (slide) => {
    if (!slide || started.has(slide)) return;
    started.add(slide);

    slide.querySelectorAll('[data-kr-count]').forEach((el) => {
      if (!isPending(el)) startCount(el);
    });

    const typers = [...slide.querySelectorAll('[data-kr-type]')].filter(
      (el) => !isPending(el)
    );
    typers
      .reduce((chain, el) => chain.then(() => typeElement(el, slide)), Promise.resolve())
      .catch(() => {});
  };

  const resetSlideEffects = (slide) => {
    if (!slide) return;
    started.delete(slide);
    (slideTimers.get(slide) || []).forEach(clearTimeout);
    slideTimers.delete(slide);
    slide.querySelectorAll('[data-kr-count]').forEach(resetCount);
    if (!INSTANT) slide.querySelectorAll('[data-kr-type]').forEach(resetType);
  };

  /* ------------------------------------------------------ spark canvas */

  const sparks = (() => {
    if (INSTANT) return { update() {} };

    let canvas, ctx, raf, active = false, particles = [];
    const COLORS = ['#bf311a', '#e06a55', '#ffb199', '#fff3ee'];

    const size = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (w, h) => ({
      x: Math.random() * w,
      y: h + 8,
      r: 0.8 + Math.random() * 2.4,
      vy: 0.35 + Math.random() * 1.1,
      sway: 0.4 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      life: 0,
      maxLife: 240 + Math.random() * 240,
      color: COLORS[(Math.random() * COLORS.length) | 0],
    });

    const ensure = () => {
      if (canvas) return;
      canvas = document.createElement('canvas');
      canvas.className = 'kr-sparks-canvas';
      canvas.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
      const backgrounds = revealEl.querySelector('.backgrounds');
      if (backgrounds) backgrounds.after(canvas);
      else revealEl.prepend(canvas);
      ctx = canvas.getContext('2d');
      size();
      window.addEventListener('resize', size);
      deck.on('resize', size);
    };

    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.life += active ? 1 : 3; // drain leftovers fast once the slide moves on
        p.y -= p.vy;
        p.x += Math.sin(p.phase + p.life * 0.02) * p.sway * 0.4;
        const fade = Math.min(1, p.life / 40) * Math.max(0, 1 - p.life / p.maxLife);
        ctx.globalAlpha = fade * 0.85;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      particles = particles.filter((p) => p.life < p.maxLife && p.y > -12);
      const want = active ? sparks.count : 0;
      while (particles.length < want) particles.push(spawn(w, h));
      if (active || particles.length) raf = requestAnimationFrame(loop);
      else raf = null;
    };

    const api = {
      count: 70,
      update(slide) {
        const attr = slide && slide.getAttribute('data-kr-sparks');
        active = attr != null && !document.hidden;
        if (active) {
          api.count = parseInt(attr, 10) || 70;
          ensure();
          if (!raf) raf = requestAnimationFrame(loop);
        }
      },
    };
    document.addEventListener('visibilitychange', () =>
      api.update(deck.getCurrentSlide())
    );
    return api;
  })();

  /* -------------------------------------------------------- text split */

  document.querySelectorAll('[data-kr-split]').forEach((el) => {
    const mode = el.dataset.krSplit === 'words' ? 'words' : 'letters';
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    const push = (unit) => {
      if (/^\s+$/.test(unit)) {
        el.appendChild(document.createTextNode(unit));
        return;
      }
      const span = document.createElement('span');
      span.className = 'kr-split-unit';
      span.style.setProperty('--kr-i', i++);
      span.textContent = unit;
      el.appendChild(span);
    };
    if (mode === 'words') text.split(/(\s+)/).forEach(push);
    else [...text].forEach(push);
  });

  /* ------------------------------------------------------------ wiring */

  document.querySelectorAll('[data-kr-count]').forEach((el) => {
    renderCount(el, INSTANT ? parseFloat(el.dataset.krCount) || 0 : 0);
  });
  document.querySelectorAll('[data-kr-type]').forEach(prepareType);

  const onReady = () => {
    sparks.update(deck.getCurrentSlide());
    // let the first paint settle, then run the opening slide's effects
    setTimeout(() => startSlideEffects(deck.getCurrentSlide()), INSTANT ? 0 : 400);
    if (INSTANT) {
      // print/reduced-motion: render every slide's final state immediately
      document.querySelectorAll('.slides section').forEach(startSlideEffects);
    }
  };
  // initKrEffects is usually called right after deck.initialize(), which may
  // have already fired 'ready' — handle both orders
  if (deck.isReady()) onReady();
  else deck.on('ready', onReady);

  deck.on('slidechanged', (event) => {
    resetSlideEffects(event.previousSlide);
    sparks.update(event.currentSlide);
    // slidetransitionend is the clean trigger, but guard with a timer in
    // case the transition is 'none' (both paths are idempotent)
    const slide = event.currentSlide;
    setTimeout(() => startSlideEffects(slide), 750);
  });

  deck.on('slidetransitionend', (event) => startSlideEffects(event.currentSlide));

  deck.on('fragmentshown', (event) => {
    eventFragments(event).forEach((frag) => {
      const els = frag.matches('[data-kr-count]')
        ? [frag]
        : [...frag.querySelectorAll('[data-kr-count]')];
      els.forEach(startCount);
      const typers = frag.matches('[data-kr-type]')
        ? [frag]
        : [...frag.querySelectorAll('[data-kr-type]')];
      typers.reduce(
        (chain, el) => chain.then(() => typeElement(el, deck.getCurrentSlide())),
        Promise.resolve()
      );
    });
  });

  deck.on('fragmenthidden', (event) => {
    eventFragments(event).forEach((frag) => {
      const els = frag.matches('[data-kr-count]')
        ? [frag]
        : [...frag.querySelectorAll('[data-kr-count]')];
      els.forEach(resetCount);
    });
  });
}

export default initKrEffects;

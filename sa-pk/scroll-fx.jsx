/* eslint-disable */
/* sa-pk/scroll-fx.jsx — Site-wide scroll-reveal layer (helloup-style).
   Mounts once, finds curated targets at runtime, and toggles `.fx-in` when each
   enters the viewport. No per-component markup edits needed.

   Variants (CSS in scroll-fx.css):
     .fx-img    image clip-reveal + slow scale settle
     .fx-words  headline split into words that rise/blur in, staggered
     .fx-up     block slides up + fades (larger travel than the base reveal)
   Honors prefers-reduced-motion (reveals instantly, no transform). */

const ScrollFX = () => {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // --- Curated targets ---------------------------------------------------
    // Images that should clip-reveal as they enter.
    const imgSel = [
      '.cc__media', '.cmp__frame', '.pr__device-float',
    ];
    // Headlines that should reveal word-by-word.
    const wordSel = [
      '.prob__statement', '.pr__title',
      '.cc__head .hp-h2', '.priv__head .hp-h2', '.ben__head .hp-h2',
      '.how2__head .hp-h2', '.spec__head .hp-h2',
    ];
    // Blocks that slide up a little more dramatically.
    const upSel = [
      '.price__card', '.spec__scroll', '.faq__item',
      '.how2__phases', '.rights__card', '.ben__card',
    ];

    const tagged = [];

    const tag = (sel, cls) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (el.dataset.fx) return;
        // Skip elements already managed by the Reveal wrapper (avoids a
        // class/opacity conflict that left them stuck hidden).
        if (el.classList.contains('reveal__item') || el.closest('.reveal')) return;
        el.dataset.fx = '1';
        el.classList.add(cls);
        tagged.push(el);
      });
    };

    // Split a headline into word spans (once). Preserves <br> as line breaks.
    const splitWords = (el) => {
      if (el.dataset.fxSplit) return;
      el.dataset.fxSplit = '1';
      const frag = document.createDocumentFragment();
      el.childNodes.forEach((node) => {
        if (node.nodeType === 1 && node.tagName === 'BR') { frag.appendChild(node.cloneNode()); return; }
        const text = node.textContent;
        // keep nested accent spans whole (e.g. .cta__big)
        if (node.nodeType === 1) {
          const w = document.createElement('span');
          w.className = 'fx-word';
          w.appendChild(node.cloneNode(true));
          frag.appendChild(w);
          // no trailing space — Korean particles (의/으로) attach to the word
          return;
        }
        (text.match(/\S+/g) || []).forEach((word) => {
          const w = document.createElement('span');
          w.className = 'fx-word';
          w.textContent = word;
          frag.appendChild(w);
          frag.appendChild(document.createTextNode(' '));
        });
      });
      el.innerHTML = '';
      el.appendChild(frag);
    };

    if (!reduced) {
      tag(imgSel.join(','), 'fx-img');
      tag(upSel.join(','), 'fx-up');
      // words: split + tag
      document.querySelectorAll(wordSel.join(',')).forEach((el) => {
        if (el.dataset.fx) return;
        if (el.classList.contains('reveal__item') || el.closest('.reveal')) return;
        el.dataset.fx = '1';
        splitWords(el);
        el.classList.add('fx-words');
        // per-word stagger via CSS var index
        [...el.querySelectorAll('.fx-word')].forEach((w, i) => {
          w.style.setProperty('--w', i);
        });
        tagged.push(el);
      });
    }

    if (reduced || typeof IntersectionObserver === 'undefined') {
      tagged.forEach((el) => el.classList.add('fx-in'));
      return;
    }

    // Deterministic, bidirectional reveal driven by a throttled scroll handler:
    // an element is "in" when its vertical center band overlaps the viewport.
    // Scrolling down reveals (text rises); scrolling back up un-reveals.
    let raf = 0;
    const update = () => {
      const vh = window.innerHeight || 800;
      for (const el of tagged) {
        const r = el.getBoundingClientRect();
        // visible once the top passes 88% of the viewport, hidden once it
        // leaves above the top — gives a clean rise-in / settle-out band.
        const inView = r.top < vh * 0.88 && r.bottom > vh * 0.06;
        el.classList.toggle('fx-in', inView);
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return null;
};

Object.assign(window, { ScrollFX });

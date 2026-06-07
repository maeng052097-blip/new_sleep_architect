/* eslint-disable */
/* sa-pk/split-text.jsx — Character & word level SplitText with rAF-driven tween
   Mirrors Punchi-Kun's `delay`-staggered entry, but driven by JS (rAF) because
   in the preview iframe CSS transitions/animations sometimes never resolve.

   Usage:
     <SplitText text="Drifting in." perCharDelay={50} duration={500} startDelay={0} />
     <SplitText text={['Lights ', 'dim.']} accentLast />   // last word gets gradient
*/

const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3);

const _tweenChars = ({ nodes, charDelay, duration, baseDelay, reduced }) => {
  if (reduced) {
    nodes.forEach((n) => { n.style.opacity = '1'; n.style.transform = 'none'; });
    return () => {};
  }
  const t0 = performance.now();
  let raf = 0;
  const tick = (now) => {
    let allDone = true;
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      const elapsed = now - t0 - baseDelay - i * charDelay;
      if (elapsed < 0) { allDone = false; continue; }
      const k = Math.min(1, elapsed / duration);
      if (k < 1) allDone = false;
      const e = easeOutCubic(k);
      el.style.opacity = String(e);
      const ty = (1 - e) * 0.45;
      el.style.transform = `translateY(${ty.toFixed(3)}em)`;
    }
    if (!allDone) raf = requestAnimationFrame(tick);
    else {
      nodes.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
};

/* SplitText — renders one or more text segments with character-level stagger.
   `segments` accepts either a string OR an array of strings — when an array,
   the LAST segment can be styled with the .accent-word class for gradient. */
const SplitText = ({
  text,
  segments,                       // alternative to text — array form for accent
  accentLast = false,
  perCharDelay = 50,
  duration = 500,
  startDelay = 0,
  animationKey = 0,
  className = '',
  ariaLabel,
}) => {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef(null);

  // Normalize input
  const parts = useMemo(() => {
    if (segments && Array.isArray(segments)) return segments;
    return [text || ''];
  }, [text, segments]);

  // Build per-char structure
  const builtChars = useMemo(() => {
    const out = [];
    parts.forEach((p, segIdx) => {
      const isLast = segIdx === parts.length - 1;
      const chars = [];
      for (const ch of p) {
        if (ch === ' ') chars.push({ kind: 'space' });
        else chars.push({ kind: 'char', ch });
      }
      out.push({ chars, accent: accentLast && isLast });
    });
    return out;
  }, [parts, accentLast]);

  // Trigger tween whenever animationKey changes
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const nodes = [...rootRef.current.querySelectorAll('.split-char')];
    // Reset
    nodes.forEach((n) => { n.style.opacity = '0'; n.style.transform = 'translateY(0.45em)'; });
    const cancel = _tweenChars({
      nodes,
      charDelay: perCharDelay,
      duration,
      baseDelay: startDelay,
      reduced,
    });
    return cancel;
  }, [animationKey, perCharDelay, duration, startDelay, reduced, builtChars.length]);

  // ariaLabel = full sentence
  const fullText = parts.join('');

  let charCounter = 0;
  return (
    <span
      ref={rootRef}
      className={className}
      aria-label={ariaLabel || fullText}
    >
      {builtChars.map((seg, segIdx) => (
        <span
          key={segIdx}
          className={seg.accent ? 'accent-word' : undefined}
          aria-hidden="true"
        >
          {seg.chars.map((c, i) =>
            c.kind === 'space'
              ? <span key={i} className="split-space" aria-hidden="true">&nbsp;</span>
              : <span key={i} className="split-char" aria-hidden="true">{c.ch}</span>
          )}
        </span>
      ))}
    </span>
  );
};

Object.assign(window, { SplitText, easeOutCubic });

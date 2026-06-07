/* eslint-disable */
/* sa-pk/engine.jsx — Viewport scaler, step state, auto-advance, drag, keyboard */

const { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } = React;

const BASE_W = 1440;
const BASE_H = 1080;
const STAGE_COUNT = 5;

/* prefers-reduced-motion */
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
};

/* Responsive viewport scale — 1440×1080 canvas scaled to fit, centered.
   Desktop uses 'contain' (letterbox), tablet/mobile use 'cover' (crop). */
const useViewportScale = () => {
  const getLayout = useCallback(() => {
    if (typeof window === 'undefined') {
      return { s: 1, cW: BASE_W, cH: BASE_H, vw: BASE_W, vh: BASE_H, isMobile: false, isTablet: false, isDesktop: true };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw <= 768;
    const isTablet = vw > 768 && vw <= 1024;
    const isDesktop = vw > 1024;
    const s = isDesktop ? Math.min(vw / BASE_W, vh / BASE_H) : Math.max(vw / BASE_W, vh / BASE_H);
    return { s, cW: BASE_W * s, cH: BASE_H * s, vw, vh, isMobile, isTablet, isDesktop };
  }, []);
  const [layout, setLayout] = useState(getLayout);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setLayout(getLayout()));
    };
    setLayout(getLayout());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [getLayout]);
  return layout;
};

/* Step state + auto-advance + pause-on-hover + safety unpause */
const STEP_STORAGE_KEY = 'sa-pk-step';
const useStepEngine = ({ autoAdvanceMs, paused, setPaused }) => {
  const [step, setStep] = useState(() => {
    if (typeof window === 'undefined') return 1;
    const stored = parseInt(localStorage.getItem(STEP_STORAGE_KEY) || '1', 10);
    return Math.min(Math.max(1, stored), STAGE_COUNT) || 1;
  });
  // Persist step across reloads (also enables external test harnesses to seed state)
  useEffect(() => {
    try { localStorage.setItem(STEP_STORAGE_KEY, String(step)); } catch (e) {}
  }, [step]);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  const goNext = useCallback(() => setStep((p) => (p < STAGE_COUNT ? p + 1 : 1)), []);
  const goPrev = useCallback(() => setStep((p) => (p > 1 ? p - 1 : STAGE_COUNT)), []);
  const goTo   = useCallback((n) => setStep(Math.min(Math.max(1, n), STAGE_COUNT)), []);

  // Auto-advance + progress bar
  useEffect(() => {
    if (paused) return;
    if (reduced) return; // honor reduced motion — no auto cycle
    let raf = 0;
    let t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / autoAdvanceMs);
      setProgress(k);
      if (k >= 1) {
        goNext();
        t0 = performance.now();
        setProgress(0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduced, autoAdvanceMs, goNext, step]);

  // Reset progress on manual step change
  useEffect(() => { setProgress(0); }, [step]);

  // Keyboard navigation (desktop)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goPrev(); }
      else if (e.key >= '1' && e.key <= '5') { e.preventDefault(); goTo(parseInt(e.key, 10)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, goTo]);

  // Safety: if paused for >10s, force unpause (mirrors Punchi-Kun)
  const lastPauseRef = useRef(Date.now());
  useEffect(() => {
    if (paused) lastPauseRef.current = Date.now();
    if (!paused) return;
    const t = setTimeout(() => {
      if (paused && Date.now() - lastPauseRef.current > 10000) setPaused(false);
    }, 10000);
    return () => clearTimeout(t);
  }, [paused, setPaused]);

  return { step, progress, goNext, goPrev, goTo };
};

/* Drag-to-swipe horizontal — pointer events on the canvas */
const useSwipe = (onLeft, onRight, threshold = 60) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0, dragging = false;
    const onDown = (e) => {
      // Only respond to primary button / single touch
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      startX = (e.touches?.[0]?.clientX ?? e.clientX) || 0;
    };
    const onMove = (e) => {
      if (!dragging) return;
      // prevent text selection while dragging
    };
    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      const endX = (e.changedTouches?.[0]?.clientX ?? e.clientX) || 0;
      const dx = endX - startX;
      if (dx > threshold) onRight?.();
      else if (dx < -threshold) onLeft?.();
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [onLeft, onRight, threshold]);
  return ref;
};

/* Stage definitions — single source of truth for all 5 scenes */
const STAGES = [
  {
    id: 'awake', num: '01', short: 'Awake',
    title: 'The day fades.',
    sub:   ['Lights ', 'dim.'],
    korean: '체온이 0.3℃ 내려가고, 조명이 따뜻한 호박빛으로 가라앉습니다.',
    meta: { temp: '24.0°C', humi: '52%', lux: '180 LX', noise: '38 DB' },
  },
  {
    id: 'n1', num: '02', short: 'Drift',
    title: 'Drifting in.',
    sub:   ['Muscles ', 'soften.'],
    korean: '근육이 풀리고 호흡이 느려집니다. 입면까지 평균 9분.',
    meta: { temp: '22.4°C', humi: '54%', lux: '12 LX', noise: '32 DB' },
  },
  {
    id: 'n2', num: '03', short: 'Sink',
    title: 'Going deeper.',
    sub:   ['Spindles ', 'appear.'],
    korean: '수면 방추파가 나타나고, 체온이 가장 빠르게 떨어집니다.',
    meta: { temp: '21.8°C', humi: '55%', lux: '0 LX', noise: '28 DB' },
  },
  {
    id: 'n3', num: '04', short: 'Still',
    title: 'Stillness.',
    sub:   ['Body ', 'restores.'],
    korean: '깊은 수면. 성장호르몬이 분비되고 면역이 회복됩니다.',
    meta: { temp: '21.2°C', humi: '55%', lux: '0 LX', noise: '24 DB' },
  },
  {
    id: 'rem', num: '05', short: 'Dream',
    title: 'Dreaming.',
    sub:   ['Memory ', 'reorders.'],
    korean: 'REM 단계. 안구가 움직이고 기억이 정리됩니다.',
    meta: { temp: '21.6°C', humi: '54%', lux: '0 LX', noise: '26 DB' },
  },
];

/* Oval orbit positions — 5 nodes around an ellipse, currentStep at apex.
   Mirrors Punchi-Kun's "wheel" rotation: positions array rotates by currentStep. */
const ORBIT_POSITIONS = [
  { x: 0,    y: 8   },  // top (current)
  { x: 201,  y: 55  },  // top-right
  { x: 300,  y: 202 },  // bottom-right
  { x: -300, y: 202 },  // bottom-left
  { x: -197, y: 55  },  // top-left
];

const positionForOrbit = (slotIdx, currentStep) => {
  // slotIdx is 0..4 (a stage's home slot)
  // We want stage = currentStep-1 to sit at index 0 (top)
  const rotated = ((slotIdx - (currentStep - 1)) + STAGE_COUNT) % STAGE_COUNT;
  return ORBIT_POSITIONS[rotated];
};

/* Export to window */
Object.assign(window, {
  BASE_W, BASE_H, STAGE_COUNT, STAGES, ORBIT_POSITIONS, positionForOrbit,
  useViewportScale, useStepEngine, useSwipe, usePrefersReducedMotion,
});

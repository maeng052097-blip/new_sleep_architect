/* eslint-disable */
/* sa-pk/cursor-aurora.jsx — Autonomous flowing "aurora ribbon" canvas.
   A calm aurora ribbon that roams the HERO scene on its own (no cursor tracking).
   Soft layered ribbons drift along a slow Lissajous path in the sleep-stage
   palette (teal → blue → violet → amber).
   - Used only inside the hero (contained). prefers-reduced-motion: static glow. */

const AURORA_STOPS = [
  '#4FD1C5', // accent teal
  '#60A5FA', // n2 blue
  '#8B5CF6', // rem violet
  '#93C5FD', // n1 light blue
  '#FBBF24', // awake amber (brief warm accent)
];

const CursorAurora = ({ contained = false }) => {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      if (contained) {
        const r = canvas.getBoundingClientRect();
        W = r.width || canvas.parentElement.clientWidth;
        H = r.height || canvas.parentElement.clientHeight;
      } else {
        W = window.innerWidth; H = window.innerHeight;
      }
      W = Math.min(W, 2400);
      H = Math.min(H, 1400);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ---- Reduced motion: paint one static glow and stop ----
    if (reduced) {
      const g = ctx.createRadialGradient(W * 0.4, H * 0.32, 0, W * 0.4, H * 0.32, Math.max(W, H) * 0.5);
      g.addColorStop(0, 'rgba(79,209,197,0.16)');
      g.addColorStop(0.5, 'rgba(96,165,250,0.08)');
      g.addColorStop(1, 'rgba(10,14,26,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      return () => window.removeEventListener('resize', resize);
    }

    // ---- Trail state — fully autonomous, follows a slow Lissajous orbit ----
    const trail = [];
    const MAX = 64;
    let cur = { x: W * 0.5, y: H * 0.4 };
    let hue = 0;
    let raf = 0;

    const lerpColor = (a, b, t) => {
      const pa = [parseInt(a.slice(1,3),16), parseInt(a.slice(3,5),16), parseInt(a.slice(5,7),16)];
      const pb = [parseInt(b.slice(1,3),16), parseInt(b.slice(3,5),16), parseInt(b.slice(5,7),16)];
      return pa.map((v,i)=> Math.round(v + (pb[i]-v)*t));
    };
    const colorAt = (p) => {
      const n = AURORA_STOPS.length;
      const f = (p % 1 + 1) % 1 * n;
      const i = Math.floor(f);
      const [r,g,b] = lerpColor(AURORA_STOPS[i % n], AURORA_STOPS[(i+1) % n], f - i);
      return { r, g, b };
    };

    const draw = (now) => {
      // Autonomous wander — a layered Lissajous so the ribbon roams the whole
      // upper area without ever needing the pointer.
      const t = now * 0.00018;
      const tx = W * (0.5 + 0.34 * Math.sin(t * 1.0) + 0.08 * Math.sin(t * 2.3 + 1.7));
      const ty = H * (0.40 + 0.26 * Math.sin(t * 1.31 + 1.1) + 0.06 * Math.cos(t * 2.9));
      cur.x += (tx - cur.x) * 0.08;
      cur.y += (ty - cur.y) * 0.08;

      trail.push({ x: cur.x, y: cur.y });
      if (trail.length > MAX) trail.shift();

      hue = (hue + 0.0012) % 1;

      ctx.clearRect(0, 0, W, H);
      if (trail.length > 2) {
        const layers = [
          { w: 96, a: 0.10, off: 0 },
          { w: 56, a: 0.16, off: 0.08 },
          { w: 26, a: 0.28, off: 0.16 },
          { w: 9,  a: 0.50, off: 0.24 },
        ];
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (const L of layers) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length - 1; i++) {
            const mx = (trail[i].x + trail[i+1].x) / 2;
            const my = (trail[i].y + trail[i+1].y) / 2;
            ctx.quadraticCurveTo(trail[i].x, trail[i].y, mx, my);
          }
          const c1 = colorAt(hue + L.off);
          const c2 = colorAt(hue + L.off + 0.18);
          const head = trail[trail.length - 1];
          const tail = trail[0];
          const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
          grad.addColorStop(0, `rgba(${c1.r},${c1.g},${c1.b},0)`);
          grad.addColorStop(1, `rgba(${c2.r},${c2.g},${c2.b},${L.a})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = L.w;
          ctx.stroke();
        }
        const hc = colorAt(hue + 0.24);
        const head = trail[trail.length - 1];
        const rg = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 150);
        rg.addColorStop(0, `rgba(${hc.r},${hc.g},${hc.b},0.32)`);
        rg.addColorStop(1, `rgba(${hc.r},${hc.g},${hc.b},0)`);
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 150, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={`cursor-aurora ${contained ? 'cursor-aurora--hero' : ''}`} aria-hidden="true" />;
};

Object.assign(window, { CursorAurora });

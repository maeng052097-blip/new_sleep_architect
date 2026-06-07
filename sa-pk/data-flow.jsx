/* eslint-disable */
/* sa-pk/data-flow.jsx — Animated "How It Works" data flow, inspired by the
   reference AI Data Flow viz: SENSORS (left) → AI BRAIN (center) → CONTROLS (right),
   with glowing connector lines + flowing particles, cycling through 3 phases:
     SENSE (sensors light up) → ESTIMATE (brain processes) → ADJUST (controls act).
   Pure React + CSS/SVG, loops on a timer, pauses when offscreen, respects RM. */

const DF_SENSORS = [
  { k: '온도',   v: '21.8°C', c: 'var(--color-warning)' },
  { k: '습도',   v: '55%',    c: 'var(--color-info)' },
  { k: '조도',   v: '0 lx',   c: 'var(--color-stage-awake)' },
  { k: '소음',   v: '24 dB',  c: 'var(--color-stage-rem)' },
  { k: '호흡',   v: '12/min', c: 'var(--color-accent)' },
  { k: '뒤척임', v: 'LOW',    c: 'var(--color-stage-n2)' },
];
const DF_CONTROLS = [
  { k: '조명', v: '단계별 색온도', c: 'var(--color-stage-awake)' },
  { k: '온도', v: '−0.6°C 미세조정', c: 'var(--color-warning)' },
  { k: '습도', v: '가습 ON', c: 'var(--color-info)' },
  { k: '소리', v: '백색소음 페이드', c: 'var(--color-stage-rem)' },
];

const DataFlow = () => {
  const [phase, setPhase] = useState(0); // 0 sense, 1 estimate, 2 adjust
  const [ref, seen] = useReveal({ threshold: 0.3 });
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef(null);
  const [visible, setVisible] = useState(true);

  // Pause cycling when offscreen
  useEffect(() => {
    if (!rootRef.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => setVisible(e.isIntersecting)),
      { threshold: 0.2 }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) { setPhase(1); return; }
    if (!visible) return;
    // Slower, calmer cadence so each phase has time to breathe and the eye can
    // follow signal → brain → control without feeling strobed.
    const id = setInterval(() => setPhase((p) => (p + 1) % 3), 3400);
    return () => clearInterval(id);
  }, [reduced, visible]);

  const PHASES = ['감지', '추정', '제어'];

  return (
    <section id="how" className="how2" data-screen-label="04 How It Works" ref={rootRef}>
      <div className="hp-container">
        <div ref={ref} className={`how2__head ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 className="hp-h2">읽고, 추정하고, 바꿉니다.</h2>
          <p className="hp-sub">센서가 모은 신호를 온디바이스 모델이 수면 단계로 추정하고, 환경을 단계에 맞춰 제어합니다. 30초마다 반복됩니다.</p>
        </div>

        {/* Phase status bar */}
        <div className="how2__phases" role="list" aria-label="처리 단계">
          {PHASES.map((p, i) => (
            <div key={p} role="listitem" className={`how2__phase ${i === phase ? 'is-active' : ''} ${i < phase ? 'is-done' : ''}`}>
              <span className="how2__phase-dot" />
              <span className="how2__phase-label">{p}</span>
            </div>
          ))}
        </div>

        <div className="how2__flow">
          {/* Connectors behind the panels */}
          <svg className="how2__wires" viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="df-wire" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(79,209,197,0.1)" />
                <stop offset="50%" stopColor="rgba(79,209,197,0.5)" />
                <stop offset="100%" stopColor="rgba(79,209,197,0.1)" />
              </linearGradient>
            </defs>
            {/* left → brain */}
            <line x1="300" y1="190" x2="430" y2="190" stroke="url(#df-wire)" strokeWidth="2" className={`how2__wire ${phase >= 0 ? 'is-live' : ''}`} />
            {/* brain → right */}
            <line x1="570" y1="190" x2="700" y2="190" stroke="url(#df-wire)" strokeWidth="2" className={`how2__wire ${phase >= 2 ? 'is-live' : ''}`} />
          </svg>

          {/* LEFT — sensors */}
          <div className={`how2__panel how2__panel--left ${phase === 0 ? 'is-active' : ''}`}>
            <p className="how2__panel-h">센서 입력</p>
            <ul className="how2__cards">
              {DF_SENSORS.map((s, i) => (
                <li key={s.k} className={`how2__card ${phase === 0 ? 'is-lit' : ''}`} style={{ '--c': s.c, '--d': `${i * 90}ms` }}>
                  <span className="how2__card-dot" />
                  <span className="how2__card-k">{s.k}</span>
                  <span className="how2__card-v">{s.v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER — brain */}
          <div className="how2__brain-wrap">
            <DataBrain phase={phase} />
            {/* directional arrows: signal in (sensors → brain), action out (brain → controls) */}
            <span className="how2__arrow how2__arrow--in" aria-hidden="true">→</span>
            <span className="how2__arrow how2__arrow--out" aria-hidden="true">→</span>
          </div>

          {/* RIGHT — controls */}
          <div className={`how2__panel how2__panel--right ${phase === 2 ? 'is-active' : ''}`}>
            <p className="how2__panel-h">환경 제어</p>
            <ul className="how2__cards">
              {DF_CONTROLS.map((c, i) => (
                <li key={c.k} className={`how2__card how2__card--ctrl ${phase === 2 ? 'is-lit' : ''}`} style={{ '--c': c.c, '--d': `${i * 110}ms` }}>
                  <span className="how2__card-dot" />
                  <span className="how2__card-k">{c.k}</span>
                  <span className="how2__card-v">{c.v}</span>
                  <span className="how2__card-check" aria-hidden="true">✓</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Center brain — pulsing neural node, tinted to the active phase */
const DataBrain = ({ phase }) => {
  const active = phase === 1;
  return (
    <div className={`how2__brain ${active ? 'is-processing' : ''}`}>
      <svg viewBox="0 0 160 160" className="how2__brain-svg" aria-hidden="true">
        <defs>
          <filter id="df-glow"><feGaussianBlur stdDeviation="1.6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {[...Array(6)].map((_, i) => {
          const a = (i * 60) * Math.PI / 180;
          const x = 80 + Math.cos(a) * 54, y = 80 + Math.sin(a) * 54;
          const x1 = 80 + Math.cos(a) * 16, y1 = 80 + Math.sin(a) * 16;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x} y2={y} stroke="var(--color-accent)" strokeWidth="1.4" opacity={active ? 0.7 : 0.3} filter="url(#df-glow)" />
              <circle cx={x} cy={y} r="3" fill="var(--color-accent)" filter="url(#df-glow)" opacity={active ? 1 : 0.5}
                style={{ animation: active ? `df-node 1.8s ${i*0.15}s ease-in-out infinite` : 'none', transformBox: 'fill-box', transformOrigin: 'center' }} />
            </g>
          );
        })}
        <circle cx="80" cy="80" r="7" fill="var(--color-accent)" filter="url(#df-glow)"
          style={{ animation: 'df-node 2.4s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
      </svg>
      <div className="how2__brain-label">
        <span className="how2__brain-title">Edge AI</span>
        <span className="how2__brain-sub">1D-CNN · BiLSTM</span>
      </div>
    </div>
  );
};

Object.assign(window, { DataFlow, DataBrain });

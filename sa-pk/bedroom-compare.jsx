/* eslint-disable */
/* sa-pk/bedroom-compare.jsx — Before/After drag slider comparing a bedroom
   WITHOUT the product (restless: warm, bright, hot, tossing sleeper) vs WITH it
   (calm: cool, dim, optimal, settled sleeper + the robot on the nightstand).

   Two inline-SVG room scenes (no external images). A draggable divider wipes
   between them; tooltip markers on the "after" side call out what changed.
   Users can also drop their own before/after photos via the image-slots. */

/* ---- Room scene: WITHOUT product (before) ---- */
const RoomBefore = () => (
  <svg className="cmp__svg" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="rb-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a2a22" /><stop offset="100%" stopColor="#241712" />
      </linearGradient>
      <linearGradient id="rb-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2a1d16" /><stop offset="100%" stopColor="#1a110c" />
      </linearGradient>
      <radialGradient id="rb-lamp" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="rgba(255,180,90,0.9)" /><stop offset="60%" stopColor="rgba(255,150,60,0.25)" /><stop offset="100%" stopColor="rgba(255,150,60,0)" />
      </radialGradient>
    </defs>
    {/* wall + floor */}
    <rect x="0" y="0" width="1000" height="470" fill="url(#rb-wall)" />
    <rect x="0" y="470" width="1000" height="170" fill="url(#rb-floor)" />
    {/* harsh warm light bloom */}
    <ellipse cx="780" cy="300" rx="360" ry="320" fill="url(#rb-lamp)" />
    {/* window with bright glare (blinds open) */}
    <rect x="80" y="90" width="240" height="180" rx="6" fill="#7a5a30" />
    <rect x="92" y="102" width="216" height="156" fill="#caa45e" opacity="0.8" />
    {[0,1,2,3,4].map(i => <line key={i} x1="92" y1={102+i*32} x2="308" y2={102+i*32} stroke="#7a5a30" strokeWidth="4" />)}
    {/* bed */}
    <rect x="120" y="360" width="520" height="150" rx="14" fill="#4a3328" />
    <rect x="120" y="330" width="520" height="60" rx="14" fill="#5a4032" />
    {/* pillow */}
    <rect x="150" y="345" width="150" height="70" rx="14" fill="#6b4d3c" />
    {/* restless sleeper — tossed blanket, bent figure */}
    <path d="M300 470 Q420 410 560 470 L560 510 L300 510 Z" fill="#6b4031" />
    <circle cx="330" cy="392" r="30" fill="#8a6450" />
    {/* sweat / heat squiggles */}
    <g stroke="#ff8a5a" strokeWidth="3" fill="none" opacity="0.8" strokeLinecap="round">
      <path d="M360 320 q8 -12 0 -24 q-8 -12 0 -24" />
      <path d="M390 314 q8 -12 0 -24 q-8 -12 0 -24" />
    </g>
    {/* nightstand, empty */}
    <rect x="680" y="400" width="120" height="110" rx="8" fill="#3a281f" />
    {/* clock showing late hour */}
    <rect x="700" y="420" width="80" height="40" rx="6" fill="#1a110c" />
    <text x="740" y="447" fill="#ff5a4a" fontSize="22" fontFamily="monospace" textAnchor="middle">3:48</text>
  </svg>
);

/* ---- Room scene: WITH product (after) ---- */
const RoomAfter = () => (
  <svg className="cmp__svg" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="ra-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#141e36" /><stop offset="100%" stopColor="#0a1020" />
      </linearGradient>
      <linearGradient id="ra-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10182c" /><stop offset="100%" stopColor="#0a0f1c" />
      </linearGradient>
      <radialGradient id="ra-glow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="rgba(79,209,197,0.5)" /><stop offset="60%" stopColor="rgba(79,209,197,0.12)" /><stop offset="100%" stopColor="rgba(79,209,197,0)" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="1000" height="470" fill="url(#ra-wall)" />
    <rect x="0" y="470" width="1000" height="170" fill="url(#ra-floor)" />
    {/* soft teal device glow */}
    <ellipse cx="760" cy="380" rx="260" ry="220" fill="url(#ra-glow)" />
    {/* window, blinds closed, faint moonlight */}
    <rect x="80" y="90" width="240" height="180" rx="6" fill="#1c2949" />
    <rect x="92" y="102" width="216" height="156" fill="#22325a" opacity="0.7" />
    {[0,1,2,3,4].map(i => <line key={i} x1="92" y1={102+i*32} x2="308" y2={102+i*32} stroke="#16203c" strokeWidth="8" />)}
    {/* a few stars through gap */}
    {[[120,120],[180,140],[250,118],[290,150]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="1.6" fill="#cfe0ff" opacity="0.8" />))}
    {/* bed */}
    <rect x="120" y="360" width="520" height="150" rx="14" fill="#1a2440" />
    <rect x="120" y="330" width="520" height="60" rx="14" fill="#223054" />
    <rect x="150" y="345" width="150" height="70" rx="14" fill="#2c3c66" />
    {/* settled sleeper — smooth blanket, calm figure */}
    <path d="M300 470 Q420 452 560 470 L560 510 L300 510 Z" fill="#2c3c66" />
    <circle cx="330" cy="392" r="30" fill="#3d5180" />
    {/* gentle 'z z z' */}
    <g fill="#7fe3d6" opacity="0.85" fontFamily="monospace" fontWeight="700">
      <text x="372" y="330" fontSize="18">z</text>
      <text x="392" y="312" fontSize="22">z</text>
      <text x="416" y="290" fontSize="28">Z</text>
    </g>
    {/* nightstand + the Sleep Architect robot */}
    <rect x="680" y="400" width="120" height="110" rx="8" fill="#16203a" />
    <g>
      <ellipse cx="740" cy="402" rx="48" ry="10" fill="rgba(79,209,197,0.18)" />
      <rect x="710" y="320" width="60" height="86" rx="30" fill="#1d2740" stroke="rgba(255,255,255,0.12)" />
      <rect x="716" y="350" width="48" height="20" rx="10" fill="#0A0E1A" />
      <circle cx="740" cy="360" r="6" fill="#4FD1C5" />
      <rect x="726" y="396" width="28" height="4" rx="2" fill="#4FD1C5" opacity="0.8" />
    </g>
    {/* sensor waves from robot */}
    <g stroke="#4FD1C5" fill="none" opacity="0.5" strokeLinecap="round">
      <path d="M706 318 Q740 300 774 318" strokeWidth="2" />
      <path d="M696 304 Q740 280 784 304" strokeWidth="2" opacity="0.5" />
    </g>
    {/* clock showing deep-sleep hour, calm color */}
    <rect x="600" y="300" width="84" height="40" rx="6" fill="#0c1322" />
    <text x="642" y="327" fill="#4FD1C5" fontSize="22" fontFamily="monospace" textAnchor="middle">3:48</text>
  </svg>
);

const CMP_TOOLTIPS = [
  { id: 't1', x: 28, y: 66, text: '협탁 위 로봇이 호흡·뒤척임을 비접촉 추적' },
  { id: 't2', x: 40, y: 22, text: '블라인드·조명을 단계에 맞춰 소등' },
  { id: 't3', x: 62, y: 58, text: '깊은 수면 구간엔 더 서늘하고 조용하게' },
  { id: 't4', x: 30, y: 56, text: '협탁 무드등으로 은은한 야간 조도 유지' },
];

const BedroomCompare = () => {
  const [pos, setPos] = useState(52);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  const [secRef, seen] = useReveal({ threshold: 0.3 });

  const setFromClient = useCallback((clientX) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const mm = (e) => setFromClient(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => setDragging(false);
    document.addEventListener('mousemove', mm);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', mm, { passive: false });
    document.addEventListener('touchend', up);
    return () => {
      document.removeEventListener('mousemove', mm);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('touchmove', mm);
      document.removeEventListener('touchend', up);
    };
  }, [dragging, setFromClient]);

  return (
    <section id="compare" className="cmp" data-screen-label="03 Before / After">
      <div className="hp-container">
        <div ref={secRef} className={`cmp__head ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">A NIGHT, COMPARED</p>
          <h2 className="hp-h2">같은 방, 같은 사람.<br />로봇 하나의 차이.</h2>
          <p className="hp-sub">슬라이더를 좌우로 끌어 제품이 있는 밤과 없는 밤을 비교해 보세요.</p>
        </div>

        <div
          ref={ref}
          className="cmp__frame"
          onMouseDown={(e) => { setDragging(true); setFromClient(e.clientX); }}
          onTouchStart={(e) => { setDragging(true); setFromClient(e.touches[0].clientX); }}
          role="slider"
          aria-label="제품 유무 비교 슬라이더"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setPos((p) => Math.max(2, p - 4));
            if (e.key === 'ArrowRight') setPos((p) => Math.min(98, p + 4));
          }}
        >
          {/* BEFORE (full, underneath) */}
          <div className="cmp__layer">
            <img className="cmp__img" src="sa-pk/img/room-before.webp" alt="제품 없는 밤 — 따뜻하고 밝은 침실, 새벽 3:48" />
            <span className="cmp__tag cmp__tag--before">WITHOUT · 제품 없음</span>
          </div>

          {/* AFTER (clipped to slider) */}
          <div className="cmp__layer cmp__layer--after" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <img className="cmp__img" src="sa-pk/img/room-after.webp" alt="제품 있는 밤 — 서늘하고 어두운 침실, 협탁 위 로봇" />
            <span className="cmp__tag cmp__tag--after">WITH · Sleep Architect</span>
            {CMP_TOOLTIPS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="cmp__marker"
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                onMouseEnter={() => setHover(t.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(t.id)}
                onBlur={() => setHover(null)}
                aria-label={t.text}
              >
                <span aria-hidden="true">+</span>
                {hover === t.id && <span className="cmp__pop">{t.text}</span>}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="cmp__divider" style={{ left: `${pos}%` }}>
            <span className="cmp__handle" aria-hidden="true">
              <span className="cmp__arrow">‹</span>
              <span className="cmp__arrow">›</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { BedroomCompare });

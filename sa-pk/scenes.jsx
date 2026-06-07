/* eslint-disable */
/* sa-pk/scenes.jsx — 5 papercraft scene compositions for Awake / N1 / N2 / N3 / REM.

   Each scene is a layered inline SVG sized 1440×1080. Layers stack from
   distant (top) to near (bottom) with `drop-shadow` giving a paper-cutout
   feel. The dominant hue is the corresponding `--color-stage-*` token.

   Users can drop a custom papercraft image into the per-scene <image-slot>
   to override the SVG entirely — perfect for real photographs of paper
   dioramas.

   No external image assets are required; all visuals are inline SVG/CSS. */

/* ── Shared celestial bodies & textures ── */

const Sun = ({ cx, cy, r, color, glow }) => (
  <g>
    <circle cx={cx} cy={cy} r={r * 2} fill={`url(#glow-${color.replace('#','')})`} opacity="0.55" />
    <circle cx={cx} cy={cy} r={r} fill={color} className="paper" />
  </g>
);

const Moon = ({ cx, cy, r, color }) => (
  <g>
    <defs>
      <filter id="moon-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    <circle cx={cx} cy={cy} r={r * 1.8} fill={color} opacity="0.18" filter="url(#moon-blur)" />
    <circle cx={cx} cy={cy} r={r} fill="#F5F7FA" className="paper" />
    {/* Craters */}
    <circle cx={cx - r * 0.3} cy={cy - r * 0.1} r={r * 0.12} fill="rgba(0,0,0,0.08)" />
    <circle cx={cx + r * 0.2} cy={cy + r * 0.25} r={r * 0.08} fill="rgba(0,0,0,0.08)" />
    <circle cx={cx + r * 0.35} cy={cy - r * 0.3} r={r * 0.06} fill="rgba(0,0,0,0.08)" />
  </g>
);

const StarField = ({ count = 60, seed = 1, opacityMin = 0.4 }) => {
  // Deterministic pseudo-random star positions
  const stars = useMemo(() => {
    const out = [];
    let s = seed * 9301 + 49297;
    const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < count; i++) {
      out.push({
        x: r() * 1440,
        y: r() * 700,
        radius: 0.6 + r() * 1.6,
        opacity: opacityMin + r() * (1 - opacityMin),
      });
    }
    return out;
  }, [count, seed, opacityMin]);
  return (
    <g className="scene__stars">
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.radius} opacity={st.opacity} />
      ))}
    </g>
  );
};

/* ── Scene 01 — Awake (amber sunset) ── */
const SceneAwake = ({ active }) => (
  <svg className="scene__svg" viewBox="0 0 1440 1080" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="awake-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#1A1428" />
        <stop offset="40%" stopColor="#3D2A2A" />
        <stop offset="75%" stopColor="#7C4A2E" />
        <stop offset="100%" stopColor="#C77B3D" />
      </linearGradient>
      <radialGradient id="glow-FBBF24" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Sky band */}
    <rect x="0" y="0" width="1440" height="780" fill="url(#awake-sky)" />
    {/* Distant clouds (horizontal slabs) */}
    <g opacity="0.5">
      <rect x="60"   y="540" width="380" height="6" rx="3" fill="#F8B860" />
      <rect x="640"  y="558" width="280" height="5" rx="3" fill="#F8B860" />
      <rect x="1080" y="580" width="320" height="6" rx="3" fill="#F8B860" />
      <rect x="220"  y="610" width="220" height="4" rx="2" fill="#FFD89B" />
      <rect x="820"  y="620" width="180" height="4" rx="2" fill="#FFD89B" />
    </g>
    {/* Setting sun — moved lower so it doesn't overlap title */}
    <Sun cx={720} cy={760} r={110} color="#FBBF24" />
    {/* Distant ridge */}
    <path
      d="M 0 820 Q 200 780 380 810 T 720 790 Q 920 780 1100 810 T 1440 790 L 1440 1080 L 0 1080 Z"
      fill="#3A2820" className="paper"
    />
    {/* Mid ridge */}
    <path
      d="M 0 890 Q 180 850 360 880 T 700 870 Q 940 860 1120 890 T 1440 880 L 1440 1080 L 0 1080 Z"
      fill="#241612" className="paper"
    />
    {/* Foreground bedroom silhouette — bedside lamp + headboard */}
    <g className="paper--deep">
      <rect x="0" y="960" width="1440" height="120" fill="#0F0A0A" />
      {/* lamp post on right */}
      <rect x="1200" y="870" width="6" height="90" fill="#0F0A0A" />
      <ellipse cx="1203" cy="860" rx="44" ry="20" fill="#1A1010" />
      <ellipse cx="1203" cy="858" rx="30" ry="12" fill="#FBBF24" opacity="0.6" />
      {/* window pane on left */}
      <rect x="100" y="880" width="120" height="80" fill="#1A1010" />
      <line x1="160" y1="880" x2="160" y2="960" stroke="#0F0A0A" strokeWidth="3" />
      <line x1="100" y1="920" x2="220" y2="920" stroke="#0F0A0A" strokeWidth="3" />
    </g>
  </svg>
);

/* ── Scene 02 — N1 (drift, light blue dusk) ── */
const SceneN1 = ({ active }) => (
  <svg className="scene__svg" viewBox="0 0 1440 1080" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="n1-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#0E1B2E" />
        <stop offset="50%" stopColor="#1E3050" />
        <stop offset="100%" stopColor="#3B5A82" />
      </linearGradient>
      <radialGradient id="glow-93C5FD" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.65" />
        <stop offset="60%" stopColor="#93C5FD" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="1440" height="780" fill="url(#n1-sky)" />
    {/* Wispy clouds — pushed up so they don't crowd title */}
    <g opacity="0.55">
      <ellipse cx="180"  cy="180" rx="220" ry="22" fill="#93C5FD" />
      <ellipse cx="980"  cy="160" rx="180" ry="16" fill="#93C5FD" />
      <ellipse cx="1280" cy="240" rx="160" ry="20" fill="#93C5FD" />
      <ellipse cx="440"  cy="280" rx="200" ry="14" fill="#BFDBFE" opacity="0.6" />
      <ellipse cx="1100" cy="320" rx="160" ry="12" fill="#BFDBFE" opacity="0.6" />
    </g>
    {/* Soft dusk orb — moved lower */}
    <Sun cx={720} cy={740} r={80} color="#93C5FD" />
    {/* Three layered horizon ridges, getting darker */}
    <path
      d="M 0 760 Q 220 720 420 750 T 780 745 Q 1010 730 1200 760 T 1440 755 L 1440 1080 L 0 1080 Z"
      fill="#1E3A5F" className="paper"
    />
    <path
      d="M 0 850 Q 200 810 400 840 T 760 835 Q 1000 820 1200 850 T 1440 845 L 1440 1080 L 0 1080 Z"
      fill="#142940" className="paper"
    />
    <path
      d="M 0 940 Q 180 910 380 935 T 740 930 Q 980 920 1200 940 T 1440 935 L 1440 1080 L 0 1080 Z"
      fill="#091828" className="paper--deep"
    />
  </svg>
);

/* ── Scene 03 — N2 (sinking, blue with first stars) ── */
const SceneN2 = ({ active }) => (
  <svg className="scene__svg" viewBox="0 0 1440 1080" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="n2-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#070C1A" />
        <stop offset="60%" stopColor="#0F1E3A" />
        <stop offset="100%" stopColor="#1E3A6B" />
      </linearGradient>
      <radialGradient id="glow-60A5FA" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="1440" height="780" fill="url(#n2-sky)" />
    {/* First stars appearing */}
    <StarField count={42} seed={2} opacityMin={0.3} />
    {/* Soft cool orb — moved lower */}
    <Sun cx={720} cy={720} r={70} color="#60A5FA" />
    {/* Mountain layers — also lower */}
    <path
      d="M 0 760 L 140 700 L 260 730 L 380 660 L 540 720 L 700 670 L 860 730 L 1000 680 L 1180 740 L 1340 690 L 1440 740 L 1440 1080 L 0 1080 Z"
      fill="#0F2240" className="paper"
    />
    <path
      d="M 0 860 L 180 800 L 340 850 L 500 780 L 680 840 L 860 790 L 1020 850 L 1200 800 L 1360 860 L 1440 820 L 1440 1080 L 0 1080 Z"
      fill="#081530" className="paper"
    />
    <path
      d="M 0 940 L 200 900 L 400 930 L 600 890 L 800 930 L 1000 900 L 1200 940 L 1440 910 L 1440 1080 L 0 1080 Z"
      fill="#040B1F" className="paper--deep"
    />
  </svg>
);

/* ── Scene 04 — N3 (deep stillness, navy + many stars) ── */
const SceneN3 = ({ active }) => (
  <svg className="scene__svg" viewBox="0 0 1440 1080" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="n3-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#020512" />
        <stop offset="70%" stopColor="#070F2A" />
        <stop offset="100%" stopColor="#0D1E40" />
      </linearGradient>
      <radialGradient id="glow-1E3A8A" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3B5BB8" stopOpacity="0.55" />
        <stop offset="60%" stopColor="#3B5BB8" stopOpacity="0.10" />
        <stop offset="100%" stopColor="#3B5BB8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lake-shine" cx="50%" cy="0%" r="60%">
        <stop offset="0%"  stopColor="#3B5BB8" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#3B5BB8" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="1440" height="780" fill="url(#n3-sky)" />
    <StarField count={140} seed={3} opacityMin={0.35} />
    {/* Faint distant glow — moved lower */}
    <ellipse cx="720" cy="700" rx="280" ry="80" fill="url(#glow-1E3A8A)" />
    {/* Distant mountains */}
    <path
      d="M 0 760 L 140 680 L 280 720 L 420 640 L 580 700 L 720 620 L 860 700 L 1020 640 L 1180 720 L 1320 660 L 1440 720 L 1440 860 L 0 860 Z"
      fill="#0A1632" className="paper"
    />
    {/* Lake (reflective band) */}
    <rect x="0" y="860" width="1440" height="120" fill="url(#lake-shine)" />
    <rect x="0" y="860" width="1440" height="120" fill="#06102A" opacity="0.6" />
    {/* Foreground silhouette */}
    <path
      d="M 0 980 L 200 960 L 400 975 L 600 955 L 800 975 L 1000 960 L 1200 980 L 1440 965 L 1440 1080 L 0 1080 Z"
      fill="#020A1E" className="paper--deep"
    />
  </svg>
);

/* ── Scene 05 — REM (dream, purple nebula + moon) ── */
const SceneREM = ({ active }) => (
  <svg className="scene__svg" viewBox="0 0 1440 1080" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="rem-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#160728" />
        <stop offset="50%"  stopColor="#2E1448" />
        <stop offset="100%" stopColor="#4B2272" />
      </linearGradient>
      <radialGradient id="rem-bloom" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.55" />
        <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rem-bloom-2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F472B6" stopOpacity="0.45" />
        <stop offset="60%" stopColor="#EC4899" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="1440" height="780" fill="url(#rem-sky)" />
    <StarField count={90} seed={5} opacityMin={0.3} />
    {/* Two nebula blooms — pushed sides, well below title area */}
    <ellipse cx="280" cy="640" rx="360" ry="200" fill="url(#rem-bloom)" />
    <ellipse cx="1160" cy="700" rx="320" ry="180" fill="url(#rem-bloom-2)" />
    {/* Moon — lower so it sits BELOW the title */}
    <Moon cx={720} cy={720} r={75} color="#8B5CF6" />
    {/* Floating abstract shapes — paper cutouts drifting */}
    <g className="paper" opacity="0.85">
      <circle cx="180" cy="850" r="28" fill="#8B5CF6" />
      <rect x="1220" y="820" width="56" height="56" rx="14" fill="#F472B6" transform="rotate(15 1248 848)" />
      <polygon points="380,920 416,884 452,920 416,956" fill="#A78BFA" />
      <circle cx="1040" cy="900" r="22" fill="#C4B5FD" />
    </g>
    {/* Distant horizon */}
    <path
      d="M 0 950 Q 220 920 420 945 T 780 940 Q 1010 925 1200 950 T 1440 945 L 1440 1080 L 0 1080 Z"
      fill="#1A0935" className="paper--deep"
    />
  </svg>
);

const SCENE_COMPONENTS = {
  awake: SceneAwake,
  n1: SceneN1,
  n2: SceneN2,
  n3: SceneN3,
  rem: SceneREM,
};

/* SceneStack — renders all 5 scenes; only the active one is visible (fade).
   Opacity is set via INLINE style (not class) so React forces the value each
   render — the preview iframe sometimes refuses to apply CSS opacity
   transitions, which left scenes stuck at stale opacity. */
const SceneStack = ({ step, enableImageSlots = true }) => {
  return (
    <div className="scene-stack" style={{ position: 'absolute', inset: 0 }}>
      {STAGES.map((stage, i) => {
        const Comp = SCENE_COMPONENTS[stage.id];
        const isActive = step === i + 1;
        return (
          <div
            key={stage.id}
            className={`scene ${isActive ? 'is-active' : ''}`}
            data-stage={stage.id}
            data-screen-label={`${stage.num} ${stage.short}`}
            aria-hidden={!isActive}
            style={{
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none',
              transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Color flow blob behind everything (uses stage color) */}
            <div className="flow-blob" />
            {/* Scene SVG */}
            <Comp active={isActive} />
            {/* User image slot — drop a custom papercraft photo here to override */}
            {enableImageSlots && React.createElement('image-slot', {
              id: `sa-pk-scene-${stage.id}`,
              shape: 'rect',
              placeholder: `${stage.short} — drop a papercraft scene image`,
              class: 'scene__slot',
            })}
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, {
  SceneAwake, SceneN1, SceneN2, SceneN3, SceneREM,
  SCENE_COMPONENTS, SceneStack, StarField,
});

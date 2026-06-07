/* eslint-disable */
/* sa-pk/hero.jsx — The auto-cycling orbital hero, extracted as a reusable
   <Hero/> component so both the standalone file and the full homepage can mount it.
   Self-contained: owns its own step engine. Auto-advance pauses when the hero is
   scrolled out of view (perf + politeness on a long-scroll page). */

const Hero = ({ autoAdvanceMs = 5500, showDragHint = true, embedded = false }) => {
  const layout = useViewportScale();
  const { s, cW, cH, vw, vh, isMobile } = layout;

  const [hoverPaused, setHoverPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const paused = hoverPaused || offscreen || userPaused;
  const setPaused = setHoverPaused;

  const { step, progress, goNext, goPrev, goTo } = useStepEngine({
    autoAdvanceMs,
    paused,
    setPaused,
  });

  const swipeRef = useSwipe(goNext, goPrev, isMobile ? 30 : 50);
  const rootRef = useRef(null);

  // Pause auto-advance when hero scrolled out of view
  useEffect(() => {
    if (!embedded || !rootRef.current) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setOffscreen(!e.isIntersecting)),
      { threshold: 0.15 }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [embedded]);

  const stage = STAGES[step - 1];

  const stageColors = {
    awake: { color: '#FBBF24', soft: 'rgba(251, 191, 36, 0.45)' },
    n1:    { color: '#93C5FD', soft: 'rgba(147, 197, 253, 0.45)' },
    n2:    { color: '#60A5FA', soft: 'rgba(96, 165, 250, 0.45)' },
    n3:    { color: '#93C5FD', soft: 'rgba(147, 197, 253, 0.45)' },
    rem:   { color: '#A78BFA', soft: 'rgba(167, 139, 250, 0.45)' },
  };
  const sc = stageColors[stage.id];

  const titleSize = isMobile ? 36 : layout.isTablet ? 56 : 80;
  const subSize   = isMobile ? 22 : layout.isTablet ? 32 : 44;

  return (
    <div
      ref={rootRef}
      className={`stage ${embedded ? 'stage--embedded' : ''}`}
      data-drag-hint={showDragHint ? 'on' : 'off'}
      data-stage={stage.id}
      data-screen-label="00 Hero — Journey of Sleep"
      onMouseEnter={() => !isMobile && setPaused(true)}
      onMouseLeave={() => !isMobile && setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Sleep Architect — Journey of Sleep, 5 stages"
      id="hero"
      style={{ '--stage-color': sc.color, '--stage-glow': sc.soft }}
    >
      {/* Full-bleed scene background — fills the whole viewport (no letterbox).
          The 1440×1080 scenes use preserveAspectRatio slice so they always cover. */}
      <div className="hero-scene-bg">
        <SceneStack step={step} enableImageSlots={false} />
      </div>

      {/* Autonomous aurora ribbon roaming over the night sky (screen blend) */}
      {typeof CursorAurora !== 'undefined' && <CursorAurora contained />}

      {/* Scaled UI canvas (transparent) — keeps title/nav/meta legibly centered */}
      <div
        ref={swipeRef}
        className="stage__canvas"
        style={{
          transform: `scale(${s})`,
          left:  `${(vw - cW) / 2}px`,
          top:   `${(vh - cH) / 2}px`,
          touchAction: 'pan-y',
        }}
      >
        <p className="wordmark" aria-label="Sleep Architect">SLEEP&nbsp;ARCHITECT</p>

        <div className="meta" aria-label="현재 단계 환경 지표">
          <div className="meta__row">
            <span className="meta__dot" />
            <span>{stage.num} · {stage.short.toUpperCase()}</span>
          </div>
          <div className="meta__row">{stage.meta.temp} · {stage.meta.humi}</div>
          <div className="meta__row">{stage.meta.lux} · {stage.meta.noise}</div>
        </div>

        <div className="hero-title" key={step} style={{ top: '38%' }}>
          <div className="hero-title__main" style={{ fontSize: titleSize }}>
            <SplitText
              text={stage.title}
              animationKey={step}
              perCharDelay={45}
              duration={520}
              startDelay={120}
              ariaLabel={`${stage.short}: ${stage.title}`}
            />
          </div>
          <div className="hero-title__sub" style={{ fontSize: subSize }}>
            <SplitText
              segments={stage.sub}
              accentLast
              animationKey={step}
              perCharDelay={45}
              duration={500}
              startDelay={520 + stage.title.length * 45}
              ariaLabel={stage.sub.join('')}
            />
          </div>
          <p className="hero-title__korean">{stage.korean}</p>
        </div>

        <button
          type="button"
          className="hint hint--toggle"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? '자동 재생 시작' : '자동 재생 일시정지'}
          aria-pressed={userPaused}
        >
          <span className="hint__icon" aria-hidden="true">{userPaused ? '▶' : '❚❚'}</span>
          <span className="hint__bar" style={{ '--progress': `${(progress * 100).toFixed(1)}%` }} />
          <span>{String(step).padStart(2, '0')} / 0{STAGE_COUNT}</span>
        </button>

        <div className="drag-hint" aria-hidden="true">
          <kbd>←</kbd><kbd>→</kbd>
          <span>· drag · click</span>
        </div>

        <Navbar
          step={step}
          onSelect={goTo}
          onHoverStart={() => !isMobile && setPaused(true)}
          onHoverEnd={() => !isMobile && setPaused(false)}
        />
      </div>

      {embedded && (
        <a href="#device" className="hero-scrollcue" aria-label="아래로 스크롤하여 제품 보기">
          <span>SCROLL</span>
          <span className="hero-scrollcue__arrow" aria-hidden="true">↓</span>
        </a>
      )}
    </div>
  );
};

Object.assign(window, { Hero });

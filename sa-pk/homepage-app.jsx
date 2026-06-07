/* eslint-disable */
/* sa-pk/homepage-app.jsx — Long-scroll homepage: auto-cycling hero + scroll narrative */

const HomepageApp = () => {
  const [t, setTweak] = useTweaks(window.__TWEAK_DEFAULTS || {
    auto_advance: 3500,
    show_drag_hint: true,
    sensor_pace: 'medium',
  });

  return (
    <React.Fragment>
      {/* First-load intro motion */}
      <Intro />
      {/* Site-wide scroll reveals */}
      <ScrollFX />
      {/* Floating section-nav rail */}
      <SideNav />

      {/* Skip link + page-level H1 for SEO/a11y heading hierarchy */}
      <a href="#hero" className="sa-skip">본문 바로가기</a>
      <h1 className="sa-vh">Sleep Architect Robot — 수면 단계별로 침실 환경을 자동 조정하는 베드사이드 로봇</h1>

      {/* One continuous night sky behind everything */}
      <PageBackdrop />

      {/* Site navigation header */}
      <SiteHeader />

      {/* Sticky top progress bar */}
      <ScrollProgressBar />

      <main>
        <Hero
          autoAdvanceMs={t.auto_advance}
          showDragHint={t.show_drag_hint}
          embedded={true}
        />
        <ProductReveal />
        <Concepts />
        <SpecSheet />
        <DataFlow />
        <Benefits />
        <Privacy />
        <BedroomCompare />
        <Gallery />
        <Pricing />
        <Faq />
        <CTA />
      </main>
      <Footer />
      <LegalModal />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero motion" />
        <TweakSlider
          label="Auto-advance"
          value={t.auto_advance}
          min={2500} max={12000} step={500} unit="ms"
          onChange={(v) => setTweak('auto_advance', v)}
        />
        <TweakToggle
          label="Drag hint"
          value={t.show_drag_hint}
          onChange={(v) => setTweak('show_drag_hint', v)}
        />
        <TweakSection label="Jump to" />
        <div className="twk-jump">
          {[
            ['hero', 'Hero'], ['device', '센서'],
            ['how', '작동'], ['benefits', '효과'], ['privacy', '프라이버시'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="twk-jump__btn"
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              {label}
            </button>
          ))}
        </div>
      </TweaksPanel>
    </React.Fragment>
  );
};

/* Thin scroll-progress bar pinned to the very top of the page */
const ScrollProgressBar = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setP(max > 0 ? h.scrollTop / max : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="hp-progress" aria-hidden="true">
      <span className="hp-progress__fill" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HomepageApp />);

window.__sa_pk_home = { HomepageApp };

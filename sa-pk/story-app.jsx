/* eslint-disable */
/* sa-pk/story-app.jsx — Standalone Project Story page: backdrop + minimal header
   (links back to home) + the Reflection section + a small footer. */

const StoryHeader = () => {
  useEffect(() => {
    // Project Story is dark-only now (light/invert mode removed).
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);
  return (
    <header className="site-nav is-scrolled">
      <div className="site-nav__inner">
        <a className="site-nav__logo story-logo" href="index.html" aria-label="Sleep Architect 홈으로">
          <svg className="story-logo__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="15" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.5" />
            <path d="M9 19c3 0 4-6 7-6s4 6 7 6" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="11" r="2" fill="var(--color-accent)" />
          </svg>
          <span className="story-logo__word">SLEEP&nbsp;ARCHITECT</span>
        </a>
        <div className="site-nav__right" style={{ marginLeft: 'auto' }}>
          <a
            href="index.html"
            className="story-back-btn"
          >
            <span className="story-back-btn__arrow" aria-hidden="true">←</span>
            홈페이지로 돌아가기
          </a>
        </div>
      </div>
    </header>
  );
};

const StoryApp = () => (
  <React.Fragment>
    <a href="#reflection" className="sa-skip">본문 바로가기</a>
    <PageBackdrop />
    <StoryHeader />
    <main className="story-main">
      <Reflection />
    </main>
    <footer className="hp-footer">
      <div className="hp-container hp-footer__legal">
        <p>본 페이지는 로봇소프트웨어과 포트폴리오 프로젝트의 회고입니다. 제품은 컨셉 단계이며 의료기기가 아닙니다.</p>
        <p className="hp-footer__copy">© 2026 Sleep Architect · 학생 포트폴리오 프로젝트</p>
      </div>
    </footer>
  </React.Fragment>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StoryApp />);

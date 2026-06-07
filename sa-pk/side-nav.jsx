/* eslint-disable */
/* sa-pk/side-nav.jsx — floating section-dots rail fixed on the right that
   follows scroll, highlights the current section, and jumps on click.
   Hidden under the intro and on narrow screens. */

const SIDE_SECTIONS = [
  { id: 'hero',      label: 'Top' },
  { id: 'device',    label: '센서' },
  { id: 'concepts',  label: '제품' },
  { id: 'how',       label: '작동' },
  { id: 'benefits',  label: '효과' },
  { id: 'privacy',   label: '프라이버시' },
  { id: 'compare',   label: '비교' },
  { id: 'gallery',   label: '갤러리' },
  { id: 'pricing',   label: '가격' },
  { id: 'faq',       label: 'FAQ' },
];

const SideNav = () => {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const ids = SIDE_SECTIONS.map((s) => s.id);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.4;
        let current = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= mid) current = id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <nav className="sidenav" aria-label="섹션 바로가기">
      <ul className="sidenav__list">
        {SIDE_SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`sidenav__dot ${active === s.id ? 'is-active' : ''}`}
              onClick={() => go(s.id)}
              aria-label={s.label}
              aria-current={active === s.id ? 'true' : undefined}
            >
              <span className="sidenav__label">{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Object.assign(window, { SideNav });

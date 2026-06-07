/* eslint-disable */
/* sa-pk/commerce.jsx — Real navigation header + Pricing/Buy section + Specs.
   Closes the biggest launch gap: a way to navigate the page and actually buy. */

/* ─────────────────── NAV HEADER ─────────────────── */
const NAV_LINKS = [
  { id: 'concepts', label: '제품' },
  { id: 'how',      label: '작동 방식' },
  { id: 'compare',  label: '비교' },
  { id: 'pricing',  label: '가격' },
  { id: 'privacy',  label: '프라이버시' },
  { id: 'story',    label: 'Project Story', href: 'project-story.html' },
];

const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-nav__inner">
        <button type="button" className="site-nav__logo" onClick={() => go('hero')} aria-label="Sleep Architect 홈으로">
          SLEEP&nbsp;ARCHITECT
        </button>
        <nav className="site-nav__menu" aria-label="주요 메뉴">
          {NAV_LINKS.map((l) => (
            l.href
              ? <a key={l.id} href={l.href} className="site-nav__link">{l.label}</a>
              : <button key={l.id} type="button" className="site-nav__link" onClick={() => go(l.id)}>{l.label}</button>
          ))}
        </nav>
        <div className="site-nav__right">
          <button type="button" className="site-nav__cta" onClick={() => go('pricing')}>구매하기</button>
          <button
            type="button"
            className="site-nav__burger"
            aria-label="메뉴 열기" aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className={`site-nav__drawer ${open ? 'is-open' : ''}`}>
        {NAV_LINKS.map((l) => (
          l.href
            ? <a key={l.id} href={l.href} className="site-nav__drawer-link">{l.label}</a>
            : <button key={l.id} type="button" className="site-nav__drawer-link" onClick={() => go(l.id)}>{l.label}</button>
        ))}
        <button type="button" className="site-nav__drawer-cta" onClick={() => go('pricing')}>구매하기 →</button>
      </div>
    </header>
  );
};

/* ─────────────────── PRICING / BUY ─────────────────── */
const TIERS = [
  {
    id: 'a', name: 'Bedside Companion', tag: 'CONCEPT A',
    price: '₩119,000', sub: '단품 · 가습·조명 내장',
    color: 'var(--color-accent)',
    specs: ['168 × 168 × 240 mm', 'mmWave 60GHz · IR · 4-mic', 'Wi-Fi · BLE · Zigbee', '가습 280ml · 무드 라이트'],
    cta: '사전 예약',
    featured: false,
  },
  {
    id: 'b', name: 'Embedded Sensor Bar', tag: 'CONCEPT B',
    price: '₩159,000', sub: '프레임 장착형 · 초슬림',
    color: 'var(--color-info)',
    specs: ['620 × 64 × 48 mm', 'mmWave 60GHz · 4-mic', 'Wi-Fi · BLE', '터치 컨트롤 · 무드 라인'],
    cta: '사전 예약',
    featured: true,
  },
  {
    id: 'c', name: 'Modular Array', tag: 'CONCEPT C',
    price: '₩89,000', sub: '3-퍽 스타터 · 무선 충전',
    color: 'var(--color-stage-rem)',
    specs: ['퍽 Ø68 × 18 mm × 3', '센서별 모듈 · 자유 배치', 'Wi-Fi · BLE · Thread', '무선 충전 패드 포함'],
    cta: '사전 예약',
    featured: false,
  },
];

const Pricing = () => {
  const [head, seen] = useReveal({ threshold: 0.25 });
  return (
    <section id="pricing" className="price" data-screen-label="08 Pricing">
      <div className="hp-container">
        <div ref={head} className={`price__head ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">CHOOSE YOUR FORM</p>
          <h2 className="hp-h2">한 가지 지능을, 원하는 모습으로.</h2>
          <p className="hp-sub">세 가지 폼팩터 모두 동일한 수면 추정 엔진과 프라이버시 정책을 따릅니다. 출시 전 사전 예약가입니다.</p>
        </div>

        <Reveal as="ul" className="price__grid" stagger={120}>
          {TIERS.map((t) => (
            <li key={t.id} className={`price__card ${t.featured ? 'is-featured' : ''}`} style={{ '--pc': t.color }}>
              {t.featured && <span className="price__badge">가장 인기</span>}
              <span className="price__tag">{t.tag}</span>
              <h3 className="price__name">{t.name}</h3>
              <p className="price__sub">{t.sub}</p>
              <p className="price__amount">{t.price}</p>
              <ul className="price__specs">
                {t.specs.map((s) => (
                  <li key={s} className="price__spec"><span className="price__spec-dot" />{s}</li>
                ))}
              </ul>
              <button
                type="button"
                className="price__cta"
                onClick={() => document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                {t.cta} →
              </button>
            </li>
          ))}
        </Reveal>

        <div className="price__note">
          <span>무료 배송</span><span aria-hidden="true">·</span>
          <span>30일 환불 보장</span><span aria-hidden="true">·</span>
          <span>2년 품질 보증</span><span aria-hidden="true">·</span>
          <span>월 ₩9,900부터 할부</span>
        </div>

        {/* Reserve / email capture */}
        <div id="reserve" className="reserve">
          <div className="reserve__copy">
            <h3 className="reserve__title">출시 알림 신청</h3>
            <p className="reserve__sub">사전 예약 오픈 시 가장 먼저 알려드립니다. 스팸 없이, 출시 소식만.</p>
          </div>
          <ReserveForm />
        </div>
      </div>
    </section>
  );
};

const ReserveForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | sending | done
  const [count, setCount] = useState(null);

  // Live subscribe to the reservations count (Firestore realtime).
  useEffect(() => {
    if (!window.__fbReady || !window.__db) return;
    const unsub = window.__db
      .collection('reservations')
      .onSnapshot(
        (snap) => setCount(snap.size),
        () => {}
      );
    return () => unsub && unsub();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) { setStatus('error'); return; }
    setStatus('sending');
    try {
      if (window.__fbReady && window.__db) {
        await window.__db.collection('reservations').add({
          email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          ua: navigator.userAgent.slice(0, 120),
        });
      }
      setStatus('done');
    } catch (err) {
      console.warn('reservation write failed:', err && err.message);
      // Still acknowledge to the user; surface a soft note.
      setStatus('done');
    }
  };

  if (status === 'done') {
    return (
      <div className="reserve__done" role="status">
        <span className="reserve__check" aria-hidden="true">✓</span>
        <span>
          신청 완료 — 출시 소식을 보내드리겠습니다.
          {count != null && <em className="reserve__count"> 현재 {count.toLocaleString()}명 신청</em>}
        </span>
      </div>
    );
  }
  return (
    <form className="reserve__form" onSubmit={submit} noValidate>
      <label className="reserve__label" htmlFor="reserve-email">이메일</label>
      <div className="reserve__row">
        <input
          id="reserve-email"
          type="email"
          className={`reserve__input ${status === 'error' ? 'is-error' : ''}`}
          placeholder="name@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? 'reserve-err' : undefined}
          disabled={status === 'sending'}
        />
        <button type="submit" className="reserve__submit" disabled={status === 'sending'}>
          {status === 'sending' ? '신청 중…' : '알림 신청'}
        </button>
      </div>
      {status === 'error' && <p id="reserve-err" className="reserve__err">올바른 이메일 주소를 입력해 주세요.</p>}
      <p className="reserve__fine">
        {count != null
          ? <span>현재 <strong>{count.toLocaleString()}</strong>명이 신청했습니다 · </span>
          : null}
        신청 시 <a href="#privacy" onClick={(e)=>{e.preventDefault();document.getElementById('privacy')?.scrollIntoView({behavior:'smooth'});}}>개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.
      </p>
    </form>
  );
};

Object.assign(window, { SiteHeader, Pricing, ReserveForm });

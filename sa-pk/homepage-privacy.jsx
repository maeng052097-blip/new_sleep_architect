/* eslint-disable */
/* sa-pk/homepage-privacy.jsx — Privacy trust cards (Twelve Labs style) + CTA + Footer */

const TRUST = [
  {
    id: 'cam', k: 'NO CAMERA', t: '카메라 미사용',
    d: '영상은 어떤 형태로도 수집하지 않습니다. 호흡과 뒤척임은 mmWave 레이더로만 측정합니다.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9h4l2-2h6l1 1M27 9v14a1 1 0 0 1-1 1H13" />
        <path d="M5 14v9a1 1 0 0 0 1 1h2" />
        <circle cx="16" cy="16" r="4" />
        <path d="M4 4 28 28" stroke="var(--color-danger)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'audio', k: 'AUDIO DISCARDED', t: '오디오 1초 폐기',
    d: '소리는 1초 윈도우로 분류한 뒤 즉시 폐기합니다. 원본 오디오는 저장되지 않습니다.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 16v0M11 11v10M16 7v18M21 11v10M26 16v0" />
      </svg>
    ),
  },
  {
    id: 'cloud', k: 'LABELS ONLY', t: 'Cloud엔 라벨만',
    d: '클라우드로는 30초 단위 단계 라벨과 5분 단위 집계만 전송합니다. 원시 신호는 기기를 떠나지 않습니다.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 22a5 5 0 0 1 0-10 7 7 0 0 1 13.5-2A5.5 5.5 0 0 1 23 22Z" />
        <path d="M13 26h6" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'retain', k: '90-DAY ERASE', t: 'Firestore 90일 삭제',
    d: '저장된 단계 라벨과 집계는 90일 후 자동 삭제됩니다. 요청 시 즉시 삭제 API가 호출됩니다.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10h18M13 10V7h6v3M9 10l1.5 16h11L23 10" />
      </svg>
    ),
  },
  {
    id: 'medical', k: 'NOT A MEDICAL DEVICE', t: '의료기기 아님',
    d: '본 기기는 의료기기가 아니며 진단·치료·예방에 사용할 수 없습니다. 면책 고지는 제품·앱·문서 3곳에 명시됩니다.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="12" />
        <path d="M16 10v8M16 22v0" />
      </svg>
    ),
  },
];

const Privacy = () => (
  <section id="privacy" className="priv" data-screen-label="05 Privacy">
    <div className="hp-container">
      <Reveal className="priv__head" stagger={70}>
        <p className="eyebrow">PRIVACY BY DEFAULT</p>
        <h2 className="hp-h2">신뢰는 기능이 아니라 기본값입니다.</h2>
        <p className="hp-sub">데이터를 적게 모으는 것이 가장 강력한 보안입니다.</p>
        <div className="priv__docs">
          <a href="#" className="priv__doc" onClick={(e)=>{e.preventDefault(); window.__openLegal && window.__openLegal('privacy');}}>개인정보 처리방침 전문 →</a>
          <a href="#" className="priv__doc" onClick={(e)=>{e.preventDefault(); window.__openLegal && window.__openLegal('terms');}}>이용약관 →</a>
        </div>
      </Reveal>
      <Reveal as="ul" className="priv__grid" stagger={120}>
        {TRUST.map((c, i) => (
          <li key={c.id} className={`priv__card ${c.id === 'medical' ? 'priv__card--wide' : ''}`} style={{ '--pi': i }}>
            <span className="priv__icon" aria-hidden="true">{c.icon}</span>
            <div className="priv__body">
              <span className="priv__k">{c.k}</span>
              <h3 className="priv__t">{c.t}</h3>
              <p className="priv__d">{c.d}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </div>
  </section>
);

const CTA = () => {
  const [ref, seen] = useReveal({ threshold: 0.4 });
  return (
    <section id="cta" className={`cta ${seen ? 'is-in' : ''}`} data-screen-label="06 CTA" ref={ref}>
      <span className="cta__bloom" aria-hidden="true" />
      <span className="cta__rays" aria-hidden="true" />
      <div className="hp-container">
        <div className="cta__wrap">
          <p className="cta__eyebrow">SEE A FULL NIGHT</p>
          <h2 className="cta__title">
            <span className="cta__line cta__line--1"><span className="cta__big cta__big--from">8시간</span>의 밤을,</span>
            <span className="cta__line cta__line--2">단 <span className="cta__big cta__big--accent">1분</span>으로 봅니다.</span>
          </h2>
          <p className="cta__sub">하룻밤의 수면 여정을 따라 환경이 어떻게 움직이는지, 지금 바로 직접 확인하세요.</p>
          <div className="cta__btns">
            <a href="#hero" className="cta__btn cta__btn--primary">수면 여정 다시 보기 →</a>
            <a href="#device" className="cta__btn cta__btn--ghost">제품 자세히 보기</a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="hp-footer" data-screen-label="07 Footer">
    <div className="hp-container hp-footer__inner">
      <div className="hp-footer__brand">
        <p className="hp-footer__mark">SLEEP&nbsp;ARCHITECT</p>
        <p className="hp-footer__line">침실 환경을 수면 단계에 맞춰 자동으로 조정하는 베드사이드 로봇.</p>
      </div>
      <div className="hp-footer__cols">
        <div className="hp-footer__col">
          <span className="hp-footer__h">제품</span>
          <a href="#concepts">제품 라인업</a>
          <a href="#pricing">가격</a>
          <a href="#specs">스펙</a>
        </div>
        <div className="hp-footer__col">
          <span className="hp-footer__h">지원</span>
          <a href="#faq">FAQ</a>
          <a href="mailto:hello@sleeparchitect.example">문의</a>
        </div>
        <div className="hp-footer__col">
          <span className="hp-footer__h">신뢰</span>
          <a href="#privacy">프라이버시</a>
          <a href="#" onClick={(e)=>{e.preventDefault(); window.__openLegal && window.__openLegal('privacy');}}>처리방침·약관</a>
        </div>
      </div>
    </div>
    <div className="hp-container hp-footer__legal">
      <p>
        본 기기는 의료기기가 아닙니다. 수면 관련 질환이 의심되는 경우 전문의와 상담하십시오.
        진단·치료·예방을 목적으로 사용할 수 없습니다.
      </p>
      <p className="hp-footer__copy">© 2026 Sleep Architect · 학생 포트폴리오 프로젝트</p>
    </div>
  </footer>
);

Object.assign(window, { Privacy, CTA, Footer, TRUST });

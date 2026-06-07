/* eslint-disable */
/* sa-pk/reflection.jsx — Student portfolio reflection: role, concrete results,
   real troubleshooting, stack, and lessons. First-person, specific. */

const ROLE = [
  { k: '담당', v: '기획 · 디자인 · 프론트엔드 개발 1인 전담' },
  { k: '기간', v: '컨셉 정의 → 구현 → 반복 개선 (단독 진행)' },
  { k: '범위', v: '13개 섹션 long-scroll · 실시간 DB · 모달 · 반응형' },
];

const RESULTS = [
  { n: '13', u: '개 섹션', d: '히어로부터 갤러리까지 단일 페이지 내러티브' },
  { n: '6', u: '종 센서', d: '추상적 AI 파이프라인을 시각화한 인터랙션' },
  { n: '0', u: '외부 의존 백엔드', d: 'Firebase Firestore로 사전예약 실시간 등록·집계' },
  { n: '100%', u: 'WebP', d: '이미지 전량 최적화로 로딩 지연 최소화' },
];

const JOURNEY = [
  {
    n: '01', t: '문제 정의',
    d: '가정 내 기기가 수면 단계를 모른 채 시간표로만 동작한다는 점에서 출발해, "단계별 환경 자동 제어"라는 한 문장으로 제품을 정의했습니다. 이 문장이 전체 정보 구조의 기준이 됐습니다.',
  },
  {
    n: '02', t: '정보 구조 설계',
    d: '스펙 나열 대신 잠드는 순간부터 깨는 순간까지의 흐름을 따라가도록 13개 섹션의 순서를 직접 설계하고, 사용자 피드백을 받아 스펙·비교·프라이버시 섹션 위치를 여러 차례 재배치했습니다.',
  },
  {
    n: '03', t: '인터랙션 구현',
    d: '센서 콜아웃·Before/After 슬라이더·AI 데이터 플로우·스크롤 스크럽 로봇 등으로 보이지 않는 기술을 눈에 보이게 만들었습니다. 모든 모션은 transform·opacity 기반으로 성능을 고려했습니다.',
  },
  {
    n: '04', t: '실시간 기능 연동',
    d: 'Firebase Firestore를 붙여 사전예약 이메일을 실제로 등록하고, onSnapshot으로 신청 인원을 실시간 집계해 표시했습니다. 정규식 검증·전송 상태·에러 처리까지 폼 UX를 완성했습니다.',
  },
];

const TROUBLE = [
  {
    p: '영상이 스크롤에 반응하지 않음',
    s: 'MP4가 탐색 불가(seekable 범위 0) 상태로 로드되는 문제를 발견. 파일을 blob URL로 불러와 전 구간 탐색이 가능하게 바꿔 스크롤 스크럽을 구현했습니다.',
  },
  {
    p: '밤하늘 별이 보이지 않음',
    s: '여러 변수를 좁혀가며 진단한 결과, 별 SVG는 정상 렌더링되지만 음수 z-index가 body 배경 뒤로 묻히는 CSS 함정이 원인임을 확인. z-index 레이어링을 명시적으로 재설계해 해결했습니다.',
  },
  {
    p: '섹션 사이 경계선·별의 카드 통과',
    s: '섹션별 배경 농도 차이가 만든 단차와, 반투명 카드로 별이 비치던 문제를 각각 배경 투명화·카드 불투명화로 분리 해결했습니다.',
  },
];

const STACK = [
  { k: 'Frontend', v: 'React 18 · 컴포넌트 기반 long-scroll UI' },
  { k: '실시간 DB', v: 'Firebase Firestore (사전예약 등록·실시간 집계)' },
  { k: '모션', v: 'IntersectionObserver · rAF 스크롤 스크럽 · CSS 트랜지션' },
  { k: '디자인', v: '디자인 토큰 · Pretendard · 반응형 clamp 타이포' },
  { k: '접근성', v: 'WCAG 키보드 내비 · prefers-reduced-motion · 캐러셀 일시정지' },
  { k: 'SEO·성능', v: 'Open Graph · JSON-LD(Product·FAQ) · WebP 최적화' },
];

const LEARNED = [
  '추상적인 AI 기능을 사용자가 "느낄 수 있는" 시각 언어로 번역하는 과정이 가장 어려웠고, 가장 많이 배웠습니다.',
  '버그는 추측이 아니라 변수를 하나씩 좁히는 진단으로 풀린다는 것 — 별 z-index 문제를 통해 체득했습니다.',
  '실시간 DB·접근성·SEO처럼 "보이지 않는" 요소가 완성도를 좌우한다는 것을 직접 구현하며 이해했습니다.',
];

const Reflection = () => {
  const [head, seen] = useReveal({ threshold: 0.25 });
  return (
    <section id="reflection" className="refl" data-screen-label="12 Reflection">
      <div className="hp-container">
        <div ref={head} className={`refl__head ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">PROJECT STORY</p>
          <h2 className="hp-h2">만들면서 배운 것.</h2>
          <p className="hp-sub">로봇소프트웨어과 포트폴리오 프로젝트로, 기획·디자인·개발을 1인 전담했습니다. 아래는 실제로 맡은 역할과 성과, 그리고 직접 해결한 문제들입니다.</p>
        </div>

        {/* Role + result metrics */}
        <Reveal className="refl__top" stagger={80}>
          <ul className="refl__role">
            {ROLE.map((r) => (
              <li key={r.k} className="refl__role-row">
                <span className="refl__role-k">{r.k}</span>
                <span className="refl__role-v">{r.v}</span>
              </li>
            ))}
          </ul>
          <ul className="refl__metrics">
            {RESULTS.map((m, i) => (
              <li key={i} className="refl__metric">
                <span className="refl__metric-n">{m.n}<em>{m.u}</em></span>
                <span className="refl__metric-d">{m.d}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="refl__grid">
          {/* Journey timeline */}
          <Reveal as="ol" className="refl__journey" stagger={90}>
            {JOURNEY.map((j) => (
              <li key={j.n} className="refl__step">
                <span className="refl__step-n">{j.n}</span>
                <div>
                  <h3 className="refl__step-t">{j.t}</h3>
                  <p className="refl__step-d">{j.d}</p>
                </div>
              </li>
            ))}
          </Reveal>

          {/* Stack */}
          <div className="refl__side">
            <Reveal className="refl__stack" stagger={60}>
              <h3 className="refl__side-h">사용 기술</h3>
              <ul className="refl__stack-list">
                {STACK.map((s) => (
                  <li key={s.k} className="refl__stack-row">
                    <span className="refl__stack-k">{s.k}</span>
                    <span className="refl__stack-v">{s.v}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Troubleshooting — concrete problem → solution */}
        <Reveal className="refl__trouble" stagger={90}>
          <h3 className="refl__side-h">직접 해결한 문제</h3>
          <ul className="refl__trouble-list">
            {TROUBLE.map((t, i) => (
              <li key={i} className="refl__trouble-item">
                <div className="refl__trouble-p"><span className="refl__trouble-tag">문제</span>{t.p}</div>
                <div className="refl__trouble-s"><span className="refl__trouble-tag refl__trouble-tag--ok">해결</span>{t.s}</div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};

Object.assign(window, { Reflection });

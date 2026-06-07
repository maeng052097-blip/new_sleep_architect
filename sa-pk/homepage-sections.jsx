/* eslint-disable */
/* sa-pk/homepage-sections.jsx — narrative sections part 1:
   ProductReveal (sticky, callouts one-by-one) · Problem · HowItWorks · Benefits */

/* ─────────────────── PRODUCT REVEAL (sticky scroll) ─────────────────── */
const SENSORS = [
  { id: 'temp',  side: 'left',  y: 10, k: '온도',   v: '21.8 °C', color: 'var(--color-warning)',     desc: '단계별 최적 체온 곡선에 맞춰 미세 조정' },
  { id: 'humi',  side: 'left',  y: 42, k: '습도',   v: '55 %',    color: 'var(--color-info)',        desc: '코골이를 줄이는 습도 범위 유지' },
  { id: 'lux',   side: 'left',  y: 74, k: '조도',   v: '0 lx',    color: 'var(--color-stage-awake)', desc: '입면·기상 단계에 맞춰 색온도 전환' },
  { id: 'noise', side: 'right', y: 10, k: '소음',   v: '24 dB',   color: 'var(--color-stage-rem)',   desc: '백색소음을 단계에 맞춰 자동 가감' },
  { id: 'breath', side: 'right', y: 42, k: '호흡',   v: '12 /min', color: 'var(--color-accent)',      desc: 'mmWave로 호흡·뒤척임을 비접촉 추적' },
  { id: 'toss',  side: 'right', y: 74, k: '뒤척임', v: 'LOW',     color: 'var(--color-stage-n2)',    desc: '미세 움직임으로 단계 전환 시점 추정' },
];

const Callout = ({ sensor, shown }) => {
  // Position by row: top sensor anchors to stage top, middle to center,
  // bottom to stage bottom — so the three always span the full stage height
  // and never overlap, regardless of how short the pinned viewport is.
  const row = sensor.y < 25 ? 'start' : sensor.y < 60 ? 'mid' : 'end';
  return (
    <div
      className={`callout callout--${sensor.side} callout--${row} ${shown ? 'is-shown' : ''}`}
      style={{ '--callout-color': sensor.color }}
      aria-hidden={!shown}
    >
      <span className="callout__line" />
      <span className="callout__node" />
      <div className="callout__card">
        <div className="callout__head">
          <span className="callout__dot" />
          <span className="callout__k">{sensor.k}</span>
          <span className="callout__v">{sensor.v}</span>
        </div>
        <p className="callout__desc">{sensor.desc}</p>
      </div>
    </div>
  );
};

const ProductReveal = () => {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);

  // Stage callouts one by one. First 18% of scroll = intro; then 6 callouts
  // across the remaining range; last bit = hold.
  const revealStart = 0.16;
  const revealEnd = 0.84;
  const shownCount = (() => {
    if (progress <= revealStart) return 0;
    if (progress >= revealEnd) return SENSORS.length;
    const t = (progress - revealStart) / (revealEnd - revealStart);
    return Math.min(SENSORS.length, Math.ceil(t * SENSORS.length));
  })();

  // Preload handled by the <video preload="auto"> element.

  // Scroll-driven robot motion is now a scroll-scrubbed video (true smooth
  // rotation). currentTime tracks scroll progress through the pinned section.
  const deviceScale = 0.94 + Math.min(1, progress * 1.4) * 0.08;
  const activeSensor = SENSORS[Math.max(0, Math.min(SENSORS.length - 1, shownCount - 1))];
  const glow = shownCount > 0 ? activeSensor.color : 'var(--color-accent)';
  const deviceTransform = `scale(${deviceScale.toFixed(3)})`;

  return (
    <section
      ref={sectionRef}
      id="device"
      className="pr"
      data-screen-label="01 Product — Sensors"
    >
      <div className="pr__pin">
        <div className="pr__head">
          <p className="eyebrow">THE DEVICE</p>
          <h2 className="pr__title">
            여섯 개의 감각이<br />한 번에 깨어납니다.
          </h2>
          <p className="pr__sub">
            침실의 온도·습도·조도·소음과 당신의 호흡·뒤척임을 동시에 추적합니다.
          </p>
        </div>

        <div className="pr__stage" aria-hidden="false">
          <div className="pr__device" style={{ transform: deviceTransform, '--dev-glow': glow }}>
            <span className="pr__device-glow" aria-hidden="true" />
            <span className="pr__device-float">
              <ScrubVideo
                className="pr__device-img pr__device-video"
                src="sa-pk/img/robot-spin2.mp4"
                poster="sa-pk/img/device-companion.webp"
                progress={progress}
                alt="Sleep Architect Robot — 스크롤에 따라 회전"
              />
            </span>
          </div>
          {SENSORS.map((s, i) => (
            <Callout key={s.id} sensor={s} shown={i < shownCount} />
          ))}
        </div>

        <div className="pr__progress" aria-hidden="true">
          <span className="pr__progress-bar" style={{ '--p': `${(progress * 100).toFixed(1)}%` }} />
          <span className="pr__progress-label">{shownCount} / {SENSORS.length} 센서</span>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────── PROBLEM ─────────────────── */
const Problem = () => {
  const [ref, seen] = useReveal({ threshold: 0.4 });
  return (
    <section id="problem" className="prob" data-screen-label="02 Problem">
      <div className="hp-container">
        <div ref={ref} className={`prob__wrap ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">THE PROBLEM</p>
          <h2 className="prob__statement">
            수면 단계마다 다른 환경이 필요한데,<br />
            집 안의 기기는 <span className="prob__strike">시간표</span>만 보고 움직입니다.
          </h2>
          <div className="prob__cols">
            <div className="prob__col prob__col--bad">
              <span className="prob__tag">기존 방식</span>
              <p className="prob__line">밤 11시에 끄고, 아침 7시에 켠다.</p>
              <p className="prob__note">단계는 모른 채, 정해진 스케줄로만 동작</p>
            </div>
            <div className="prob__arrow" aria-hidden="true">→</div>
            <div className="prob__col prob__col--good">
              <span className="prob__tag prob__tag--accent">Sleep Architect</span>
              <p className="prob__line">단계를 실시간으로 읽고, 환경을 따라 바꾼다.</p>
              <p className="prob__note">깊은 수면엔 더 서늘하게, 기상 전엔 서서히 밝게</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────── HOW IT WORKS ─────────────────── */
const FLOW = [
  { n: '01', k: 'SENSE',    t: '감지', d: '비접촉 센서가 환경 4종과 신체 신호 2종을 30초마다 측정합니다.' },
  { n: '02', k: 'ESTIMATE', t: '추정', d: '온디바이스 모델이 수면 단계를 실시간으로 추정합니다.' },
  { n: '03', k: 'ADJUST',   t: '제어', d: '추정된 단계에 맞춰 조명·온도·습도·소리를 자동 조정합니다.' },
];

const STAGE_MAP = [
  { id: 'awake', short: 'Awake', env: '따뜻한 호박빛 · 24°C', color: '#FBBF24' },
  { id: 'n1',    short: 'Drift', env: '조명 소등 · 22.4°C',   color: '#93C5FD' },
  { id: 'n2',    short: 'Sink',  env: '백색소음 ↓ · 21.8°C',  color: '#60A5FA' },
  { id: 'n3',    short: 'Still', env: '최저 온도 · 무음',      color: '#93C5FD' },
  { id: 'rem',   short: 'Dream', env: '미세 환기 · 21.6°C',    color: '#A78BFA' },
];

const HowItWorks = () => {
  return (
    <section id="how" className="how" data-screen-label="03 How It Works">
      <div className="hp-container">
        <Reveal className="how__head" stagger={70}>
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 className="hp-h2">읽고, 추정하고, 바꿉니다.</h2>
          <p className="hp-sub">세 단계가 30초마다 끊임없이 반복됩니다.</p>
        </Reveal>

        <Reveal as="ol" className="how__flow" stagger={110}>
          {FLOW.map((f) => (
            <li key={f.n} className="how__step">
              <span className="how__step-n">{f.n}</span>
              <span className="how__step-k">{f.k}</span>
              <h3 className="how__step-t">{f.t}</h3>
              <p className="how__step-d">{f.d}</p>
            </li>
          ))}
        </Reveal>

        <Reveal className="how__map" stagger={60}>
          <p className="how__map-label">단계 → 환경 매핑</p>
          <div className="how__map-grid">
            {STAGE_MAP.map((m) => (
              <div key={m.id} className="how__map-row" style={{ '--mc': m.color }}>
                <span className="how__map-dot" />
                <span className="how__map-stage">{m.short}</span>
                <span className="how__map-env">{m.env}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ─────────────────── BENEFITS ─────────────────── */
const BENEFITS = [
  {
    id: 'onset', k: 'FALL ASLEEP', t: '입면 시간 단축',
    d: '입면 단계에 맞춰 조명과 온도를 먼저 낮춰, 잠드는 시간을 줄입니다.',
    basis: '근거 · 멜라토닌 분비와 심부 체온 하강이 입면을 촉진한다는 수면 생리학에 기반',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 8v6M24 34v6M8 24h6M34 24h6M13 13l4 4M31 31l4 4M35 13l-4 4M17 31l-4 4" opacity="0.5" />
        <circle cx="24" cy="24" r="7" />
      </svg>
    ),
  },
  {
    id: 'snore', k: 'BREATHE EASY', t: '코골이 완화',
    d: '호흡 패턴 변화를 감지하면 습도와 자세 유도 환경을 조정합니다.',
    basis: '근거 · 적정 습도 유지가 상기도 점막 건조와 코골이를 줄인다는 연구에 기반',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 28 Q16 18 24 28 T40 28" />
        <path d="M8 36 Q16 30 24 36 T40 36" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'wake', k: 'STAY ASLEEP', t: '새벽 각성 감소',
    d: '깊은 수면 구간을 보호해, 새벽에 깨는 횟수를 줄입니다.',
    basis: '근거 · 소음·빛 자극이 수면 분절(각성)을 유발한다는 수면 환경 연구에 기반',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 10a13 13 0 1 0 8 18 10 10 0 0 1-8-18Z" />
      </svg>
    ),
  },
];

const Benefits = () => (
  <section id="benefits" className="ben" data-screen-label="04 Benefits">
    <div className="hp-container">
      <Reveal className="ben__head" stagger={70}>
        <p className="eyebrow">DESIGN GOALS</p>
        <h2 className="hp-h2">우리가 목표로 하는 변화.</h2>
        <p className="hp-sub">아래는 제품이 지향하는 설계 목표입니다. 효과와 정도는 개인·환경에 따라 다르며, 현재 자체 베타에서 검증을 진행하고 있습니다.</p>
      </Reveal>
      <Reveal as="ul" className="ben__grid" stagger={160}>
        {BENEFITS.map((b, i) => (
          <li key={b.id} className="ben__card">
            <span className="ben__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="ben__icon" aria-hidden="true">{b.icon}</span>
            <span className="ben__k">{b.k}</span>
            <h3 className="ben__t">{b.t}</h3>
            <span className="ben__rule" aria-hidden="true" />
            <p className="ben__d">{b.d}</p>
            <p className="ben__basis">{b.basis}</p>
            <span className="ben__status">목표 · 검증 진행 중</span>
          </li>
        ))}
      </Reveal>
      <div className="ben__method">
        <span className="ben__method-tag">검증 방법</span>
        <p>각 목표는 공개된 수면 생리학·환경 연구의 메커니즘에 근거해 설계했으며, 실제 효과·정도는 자체 베타에서 30초 단위 수면 단계 라벨과 환경 로그를 수집해 사용자별로 측정·검증하고 있습니다. 효과는 개인·환경에 따라 다릅니다.</p>
      </div>
      <p className="ben__foot">
        ※ 본 내용은 임상적으로 입증된 효능이 아니라 설계 목표입니다. 본 기기는 의료기기가 아니며 진단·치료·예방 목적으로 사용할 수 없습니다. 수면 관련 질환이 의심되면 전문의와 상담하십시오.
      </p>
    </div>
  </section>
);

Object.assign(window, { ProductReveal, Problem, HowItWorks, Benefits, SENSORS, STAGE_MAP });

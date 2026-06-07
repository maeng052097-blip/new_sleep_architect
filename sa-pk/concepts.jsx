/* eslint-disable */
/* sa-pk/concepts.jsx — "Three Forms" section using REAL product photos.
   Each concept shows a studio hero shot that swaps to the in-room lifestyle
   shot on hover, plus size/format options so the buyer picks the robot that
   fits their space. */

const CONCEPTS = [
  {
    id: 'a', tag: 'CONCEPT A', name: 'Bedside Companion',
    ko: '협탁 위 컴패니언',
    desc: '협탁에 두는 단독형 본체. 가습 미스트와 무드 라이트를 갖춘 올인원. 표정 디스플레이로 상태를 보여줍니다.',
    studio: 'sa-pk/img/concept-a-companion.webp',
    room:   'sa-pk/img/concept-a-companion-room.webp',
    sizes: ['컴팩트 · 원룸', '스탠다드 · 침실'],
    finish: ['샌드 화이트', '웜 그레이'],
    color: 'var(--color-accent)',
  },
  {
    id: 'b', tag: 'CONCEPT B', name: 'Embedded Sensor Bar',
    ko: '임베디드 센서 바',
    desc: '침대 프레임에 장착하는 슬림 바. 메탈 보디와 터치 컨트롤로 가구처럼 녹아듭니다.',
    studio: 'sa-pk/img/concept-b-bar.webp',
    room:   'sa-pk/img/concept-b-bar-room.webp',
    sizes: ['싱글·슈퍼싱글', '퀸·킹'],
    finish: ['티타늄 실버', '그래파이트'],
    color: 'var(--color-info)',
  },
  {
    id: 'c', tag: 'CONCEPT C', name: 'Modular Sensor Array',
    ko: '모듈형 센서 어레이',
    desc: '용도별 퍽을 무선 충전 패드에 올려 쓰는 분산형. 필요한 센서만 골라 침대 곳곳에 자유 배치.',
    studio: 'sa-pk/img/concept-c-array.webp',
    room:   'sa-pk/img/concept-c-array-room.webp',
    sizes: ['3-퍽 스타터', '6-퍽 풀세트'],
    finish: ['브론즈 레더', '샴페인 메탈'],
    color: 'var(--color-stage-rem)',
  },
];

const ConceptCard = ({ c }) => {
  const [hover, setHover] = useState(false);
  return (
    <li
      className="cc__card"
      style={{ '--cc': c.color }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="cc__media">
        <img className="cc__img cc__img--studio" src={c.studio} alt={`${c.name} 제품 사진`} loading="lazy" />
        <img className={`cc__img cc__img--room ${hover ? 'is-shown' : ''}`} src={c.room} alt={`${c.name} 침실 설치 모습`} loading="lazy" aria-hidden={!hover} />
        <span className="cc__media-hint" aria-hidden="true">{hover ? '설치 예시' : '제품'}</span>
      </div>

      <span className="cc__tag">{c.tag}</span>
      <h3 className="cc__name">{c.name}</h3>
      <p className="cc__ko">{c.ko}</p>
      <p className="cc__desc">{c.desc}</p>

      <div className="cc__opt">
        <span className="cc__opt-label">크기 / 타입</span>
        <div className="cc__chips">
          {c.sizes.map((s, i) => (
            <span key={s} className={`cc__chip ${i === 0 ? 'is-default' : ''}`}>{s}</span>
          ))}
        </div>
      </div>
      <div className="cc__opt">
        <span className="cc__opt-label">마감 / 컬러</span>
        <div className="cc__chips">
          {c.finish.map((f) => (
            <span key={f} className="cc__chip cc__chip--finish">{f}</span>
          ))}
        </div>
      </div>
    </li>
  );
};

const Concepts = () => {
  const [head, seen] = useReveal({ threshold: 0.3 });
  return (
    <section id="concepts" className="cc" data-screen-label="02 Three Concepts">
      <div className="hp-container">
        <div ref={head} className={`cc__head ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">THREE FORMS · ONE BRAIN</p>
          <h2 className="hp-h2">한 가지 지능, 세 가지 모습.</h2>
          <p className="hp-sub">같은 수면 추정 엔진을 세 가지 폼팩터로 만나보세요. 공간과 크기, 형태에 맞춰 원하는 로봇을 고를 수 있습니다.</p>
        </div>

        <Reveal as="ul" className="cc__grid" stagger={120}>
          {CONCEPTS.map((c) => <ConceptCard key={c.id} c={c} />)}
        </Reveal>

        <p className="cc__foot">세 컨셉 모두 카메라 미사용 · 동일한 프라이버시 정책을 따릅니다. 카드 위에 마우스를 올리면 실제 설치 예시가 보입니다.</p>
      </div>
    </section>
  );
};

Object.assign(window, { Concepts });

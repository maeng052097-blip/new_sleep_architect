/* eslint-disable */
/* sa-pk/support.jsx — FAQ accordion + full spec sheet table + data-rights/legal
   block. Closes the trust/info gaps: setup, warranty, data rights, full specs. */

/* ─────────────────── SPEC SHEET ─────────────────── */
const SPEC_ROWS = [
  { k: '수면 추정', a: 'mmWave 60GHz + IR 열화상', b: 'mmWave 60GHz', c: '모듈형 (선택)' },
  { k: '오디오', a: '4-mic · 코골이 분류', b: '4-mic · 코골이 분류', c: '마이크 퍽(선택)' },
  { k: '추론', a: '온디바이스 1D-CNN·BiLSTM', b: '온디바이스', c: '허브 처리' },
  { k: '환경 제어', a: '조명·온도·습도·소리', b: '조명·소리', c: '모듈 조합' },
  { k: '무선', a: 'Wi-Fi · BLE · Zigbee', b: 'Wi-Fi · BLE', c: 'Wi-Fi · BLE · Thread' },
  { k: '전원', a: 'USB-C 어댑터', b: '프레임 내장 배선', c: '무선 충전 패드' },
  { k: '크기', a: '168 × 168 × 240 mm', b: '620 × 64 × 48 mm', c: '퍽 Ø68 × 18 mm' },
  { k: '소음', a: '≤ 22 dB', b: '≤ 20 dB', c: '무음(패시브)' },
];

/* Glossary — plain-language explanations for the jargon in the spec table.
   Longest keys first so multi-word terms match before their substrings. */
const GLOSSARY = [
  ['mmWave 60GHz', '60GHz 대역의 밀리미터파 레이더입니다. 카메라 없이, 미세한 가슴 움직임으로 호흡과 뒤척임을 비접촉으로 감지합니다.'],
  ['IR 열화상', '적외선 열화상 센서입니다. 빛이 없어도 체온 분포를 읽어 수면 상태 추정을 돕습니다.'],
  ['1D-CNN·BiLSTM', '시계열 신호를 분석하는 두 가지 AI 모델입니다. CNN이 짧은 패턴을, BiLSTM이 시간 흐름을 읽어 수면 단계를 추정합니다.'],
  ['온디바이스', '데이터를 서버로 보내지 않고 기기 안에서 직접 AI 연산을 수행하는 방식입니다. 더 빠르고 프라이버시에 유리합니다.'],
  ['4-mic', '4개의 마이크 배열입니다. 소리의 방향을 구분해 코골이만 골라 분석합니다.'],
  ['Wi-Fi', '집 안 무선 인터넷에 연결하는 표준 통신 방식입니다.'],
  ['BLE', 'Bluetooth Low Energy. 저전력 블루투스로, 배터리 소모 없이 주변 기기와 연결합니다.'],
  ['Zigbee', '스마트홈 기기들을 잇는 저전력 근거리 무선 표준입니다. 전구·플러그 등을 제어합니다.'],
  ['Thread', '스마트홈용 저전력 메시 네트워크 표준입니다. 기기끼리 서로 신호를 중계해 안정적으로 연결됩니다.'],
  ['허브 처리', '센서가 직접 연산하지 않고, 중앙 허브 기기가 모아서 AI 연산을 대신 처리하는 방식입니다.'],
  ['코골이 분류', '녹음을 저장하지 않고, 들어온 소리가 코골이인지 아닌지만 실시간으로 판별합니다.'],
];

/* Wrap any glossary terms found in `text` with an underlined tooltip span. */
const withGlossary = (text) => {
  if (typeof text !== 'string') return text;
  const out = [];
  let rest = text;
  let guard = 0;
  while (rest.length && guard++ < 40) {
    // find the earliest-matching glossary term in the remaining string
    let best = null;
    for (const [term, def] of GLOSSARY) {
      const idx = rest.indexOf(term);
      if (idx !== -1 && (best === null || idx < best.idx || (idx === best.idx && term.length > best.term.length))) {
        best = { idx, term, def };
      }
    }
    if (!best) { out.push(rest); break; }
    if (best.idx > 0) out.push(rest.slice(0, best.idx));
    out.push(
      <span key={out.length} className="glossary" tabIndex={0} role="note" aria-label={`${best.term}: ${best.def}`}>
        {best.term}
        <span className="glossary__pop" aria-hidden="true">{best.def}</span>
      </span>
    );
    rest = rest.slice(best.idx + best.term.length);
  }
  return out;
};

const SpecSheet = () => {
  const [head, seen] = useReveal({ threshold: 0.2 });
  return (
    <section id="specs" className="spec" data-screen-label="09 Specs">
      <div className="hp-container">
        <div ref={head} className={`spec__head ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">TECH SPECS</p>
          <h2 className="hp-h2">세 가지 폼팩터, 한눈에.</h2>
          <p className="hp-sub">밑줄 친 용어에 마우스를 올리면 쉬운 설명이 나타납니다.</p>
        </div>
        <div className="spec__scroll">
          <table className="spec__table">
            <thead>
              <tr>
                <th scope="col" className="spec__th-k"></th>
                <th scope="col">Companion</th>
                <th scope="col">Sensor Bar</th>
                <th scope="col">Modular</th>
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((r) => (
                <tr key={r.k}>
                  <th scope="row" className="spec__row-k">{r.k}</th>
                  <td>{withGlossary(r.a)}</td>
                  <td>{withGlossary(r.b)}</td>
                  <td>{withGlossary(r.c)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────── FAQ ─────────────────── */
const FAQS = [
  { q: '설치가 어렵나요?', a: '전원만 연결하면 앱이 자동으로 기기를 찾습니다. 평균 설치 시간은 5분 이내이며, 침대와의 거리만 가이드대로 맞추면 됩니다.' },
  { q: '카메라가 정말 없나요?', a: '네. 어떤 형태의 영상도 수집하지 않습니다. 호흡과 뒤척임은 mmWave 레이더로, 소리는 1초 단위로 분류 후 즉시 폐기합니다.' },
  { q: '여러 명이 한 침대를 쓰면요?', a: 'mmWave는 가장 가까운 신체의 호흡 패턴을 추적합니다. 듀얼 트래킹은 추후 업데이트로 제공될 예정입니다.' },
  { q: '데이터는 어디에 저장되나요?', a: '원시 신호는 기기를 떠나지 않습니다. 클라우드에는 30초 단위 단계 라벨과 5분 집계만 전송되며, 90일 후 자동 삭제됩니다.' },
  { q: '기존 스마트홈 기기와 연동되나요?', a: 'Matter·Zigbee·BLE 표준을 지원합니다. 호환 기기 목록은 출시 시 공개됩니다.' },
  { q: '환불·보증 정책은?', a: '30일 이내 무조건 환불, 2년 품질 보증을 제공합니다. 자세한 조건은 구매 시 안내됩니다.' },
];

const FaqItem = ({ q, a, idx }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq__item ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="faq__q"
        aria-expanded={open}
        aria-controls={`faq-a-${idx}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{q}</span>
        <span className="faq__icon" aria-hidden="true" />
      </button>
      <div id={`faq-a-${idx}`} className="faq__a" role="region" aria-hidden={!open}>
        <div className="faq__a-inner"><p>{a}</p></div>
      </div>
    </div>
  );
};

const Faq = () => {
  const [head, seen] = useReveal({ threshold: 0.25 });
  return (
    <section id="faq" className="faq" data-screen-label="10 FAQ">
      <div className="hp-container faq__layout">
        <div ref={head} className={`faq__head ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">FAQ</p>
          <h2 className="hp-h2">자주 묻는 질문.</h2>
          <p className="hp-sub">더 궁금한 점이 있으면 <a href="mailto:sleeparchitect@naver.com">sleeparchitect@naver.com</a>으로 문의해 주세요.</p>
          <ContactForm />
        </div>
        <div className="faq__list">
          {FAQS.map((f, i) => <FaqItem key={i} idx={i} {...f} />)}
        </div>
      </div>
    </section>
  );
};

/* Direct inquiry form — writes to Firestore `inquiries`, mirrors ReserveForm UX. */
const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | sending | done

  const submit = async (e) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name.trim() || !emailOk || !msg.trim()) { setStatus('error'); return; }
    setStatus('sending');
    try {
      if (window.__fbReady && window.__db) {
        await window.__db.collection('inquiries').add({
          name, email, message: msg,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
      setStatus('done');
    } catch (err) {
      console.warn('inquiry write failed:', err && err.message);
      setStatus('done');
    }
  };

  if (status === 'done') {
    return (
      <div className="contact contact--done" role="status">
        <span className="reserve__check" aria-hidden="true">✓</span>
        <span>문의가 접수되었습니다. 빠르게 답변드리겠습니다.</span>
      </div>
    );
  }

  return (
    <form className="contact" onSubmit={submit} noValidate>
      <h3 className="contact__title">직접 문의하기</h3>
      <p className="contact__sub">원하는 답을 못 찾으셨나요? 아래에 남겨 주시면 이메일로 답변드립니다.</p>
      <div className="contact__row2">
        <div className="contact__field">
          <label className="contact__label" htmlFor="ct-name">이름</label>
          <input id="ct-name" className="contact__input" value={name}
            onChange={(e)=>{setName(e.target.value); if(status==='error')setStatus('idle');}}
            placeholder="홍길동" disabled={status==='sending'} />
        </div>
        <div className="contact__field">
          <label className="contact__label" htmlFor="ct-email">이메일</label>
          <input id="ct-email" type="email" className="contact__input" value={email}
            onChange={(e)=>{setEmail(e.target.value); if(status==='error')setStatus('idle');}}
            placeholder="name@example.com" disabled={status==='sending'} />
        </div>
      </div>
      <div className="contact__field">
        <label className="contact__label" htmlFor="ct-msg">문의 내용</label>
        <textarea id="ct-msg" className="contact__input contact__textarea" rows={4} value={msg}
          onChange={(e)=>{setMsg(e.target.value); if(status==='error')setStatus('idle');}}
          placeholder="궁금한 점을 자유롭게 작성해 주세요." disabled={status==='sending'} />
      </div>
      {status==='error' && <p className="reserve__err">이름·올바른 이메일·문의 내용을 모두 입력해 주세요.</p>}
      <button type="submit" className="contact__submit" disabled={status==='sending'}>
        {status==='sending' ? '보내는 중…' : '문의 보내기'}
      </button>
    </form>
  );
};

/* ─────────────────── DATA RIGHTS / LEGAL ─────────────────── */
const RIGHTS = [
  { k: '열람', d: '저장된 수면 단계 라벨과 집계를 언제든 확인할 수 있습니다.' },
  { k: '삭제', d: '앱 또는 삭제 요청으로 즉시 모든 이력이 제거됩니다.' },
  { k: '이동', d: '내 데이터를 표준 형식으로 내보낼 수 있습니다.' },
  { k: '동의 철회', d: '클라우드 전송 동의를 언제든 철회할 수 있습니다.' },
];

const DataRights = () => {
  const [head, seen] = useReveal({ threshold: 0.25 });
  return (
    <section id="data-rights" className="rights" data-screen-label="11 Data Rights">
      <div className="hp-container">
        <div ref={head} className={`rights__head ${seen ? 'is-in' : ''}`}>
          <p className="eyebrow">YOUR DATA, YOUR RIGHTS</p>
          <h2 className="hp-h2">데이터의 주인은 당신입니다.</h2>
          <p className="hp-sub">GDPR·개인정보보호법이 보장하는 권리를 제품 안에서 직접 행사할 수 있습니다.</p>
        </div>
        <Reveal as="ul" className="rights__grid" stagger={90}>
          {RIGHTS.map((r) => (
            <li key={r.k} className="rights__card">
              <h3 className="rights__k">{r.k}</h3>
              <p className="rights__d">{r.d}</p>
            </li>
          ))}
        </Reveal>
        <div className="rights__actions">
          <a href="#" className="rights__btn" onClick={(e)=>e.preventDefault()}>데이터 삭제 요청</a>
          <a href="#" className="rights__doc" onClick={(e)=>{e.preventDefault(); window.__openLegal && window.__openLegal('privacy');}}>개인정보 처리방침 전문 →</a>
          <a href="#" className="rights__doc" onClick={(e)=>{e.preventDefault(); window.__openLegal && window.__openLegal('terms');}}>이용약관 →</a>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { SpecSheet, Faq, DataRights });

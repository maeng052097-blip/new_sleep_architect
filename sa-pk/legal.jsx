/* eslint-disable */
/* sa-pk/legal.jsx — Privacy Policy & Terms full text shown in an on-page modal.
   Exposes window.__openLegal('privacy'|'terms') and a <LegalModal/> mounted once. */

const PRIVACY_DOC = {
  title: '개인정보 처리방침',
  updated: '시행일 2026년 1월 1일',
  sections: [
    { h: '1. 수집하는 정보', b: [
      '본 서비스는 영상을 일절 수집하지 않습니다. 호흡·뒤척임은 mmWave 레이더로, 소리는 1초 단위로 분류한 뒤 즉시 폐기합니다.',
      '클라우드로 전송되는 정보는 30초 단위 수면 단계 라벨과 5분 단위 환경 집계에 한합니다. 원시 센서 신호는 기기를 떠나지 않습니다.',
      '사전 예약·문의 시 입력한 이메일, 이름, 문의 내용을 수집합니다.',
    ]},
    { h: '2. 이용 목적', b: [
      '수집한 정보는 수면 단계 추정과 침실 환경 자동 제어, 일일 리포트 생성에만 사용됩니다.',
      '이메일은 출시 알림·문의 응답 목적으로만 이용하며, 동의 없이 마케팅에 활용하지 않습니다.',
    ]},
    { h: '3. 보관 및 파기', b: [
      'Firestore에 저장된 단계 라벨과 집계는 90일 후 자동 삭제됩니다.',
      '사용자가 삭제를 요청하면 즉시 삭제 API가 호출되어 모든 이력이 제거됩니다.',
    ]},
    { h: '4. 제3자 제공', b: [
      '법령에 의한 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다.',
      '리포트 생성을 위한 처리는 위탁 계약을 맺은 클라우드 사업자 내에서만 이루어집니다.',
    ]},
    { h: '5. 이용자 권리', b: [
      '이용자는 언제든 자신의 데이터에 대한 열람·삭제·이동·동의 철회를 요청할 수 있습니다.',
      '권리 행사는 앱 내 메뉴 또는 sleeparchitect@naver.com을 통해 접수됩니다.',
    ]},
    { h: '6. 문의처', b: [
      '개인정보 보호 책임자: Sleep Architect 팀 · sleeparchitect@naver.com',
    ]},
  ],
};

const TERMS_DOC = {
  title: '이용약관',
  updated: '시행일 2026년 1월 1일',
  sections: [
    { h: '제1조 (목적)', b: [
      '본 약관은 Sleep Architect(이하 "회사")가 제공하는 기기 및 관련 서비스의 이용 조건과 절차, 권리·의무를 규정합니다.',
    ]},
    { h: '제2조 (서비스의 성격)', b: [
      '본 기기는 의료기기가 아니며, 질병의 진단·치료·예방을 목적으로 하지 않습니다.',
      '제공되는 수면 정보는 참고용이며, 건강상 우려가 있는 경우 전문의와 상담해야 합니다.',
    ]},
    { h: '제3조 (사전 예약)', b: [
      '사전 예약은 구매를 확정하는 계약이 아니며, 출시 알림 수신을 위한 신청입니다.',
      '가격·사양·출시 일정은 사정에 따라 변경될 수 있습니다.',
    ]},
    { h: '제4조 (이용자의 의무)', b: [
      '이용자는 타인의 정보를 도용하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.',
    ]},
    { h: '제5조 (책임의 한계)', b: [
      '회사는 천재지변, 이용자 과실 등 회사의 합리적 통제를 벗어난 사유로 인한 손해에 대해 책임을 지지 않습니다.',
      '환불·보증은 구매 시 안내되는 별도 정책을 따릅니다.',
    ]},
    { h: '제6조 (약관의 변경)', b: [
      '회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 시행일을 명시해 공지합니다.',
    ]},
  ],
};

const LegalModal = () => {
  const [doc, setDoc] = useState(null); // 'privacy' | 'terms' | null
  const closeRef = useRef(null);

  useEffect(() => {
    window.__openLegal = (which) => setDoc(which);
    return () => { delete window.__openLegal; };
  }, []);

  useEffect(() => {
    if (!doc) return;
    const onKey = (e) => { if (e.key === 'Escape') setDoc(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [doc]);

  if (!doc) return null;
  const data = doc === 'privacy' ? PRIVACY_DOC : TERMS_DOC;

  return (
    <div className="legal" role="dialog" aria-modal="true" aria-label={data.title}
         onClick={(e) => { if (e.target === e.currentTarget) setDoc(null); }}>
      <div className="legal__panel">
        <header className="legal__head">
          <div>
            <p className="legal__eyebrow">LEGAL</p>
            <h2 className="legal__title">{data.title}</h2>
            <p className="legal__updated">{data.updated}</p>
          </div>
          <button ref={closeRef} type="button" className="legal__close" aria-label="닫기" onClick={() => setDoc(null)}>✕</button>
        </header>
        <div className="legal__body">
          {data.sections.map((s, i) => (
            <section key={i} className="legal__sec">
              <h3 className="legal__h">{s.h}</h3>
              {s.b.map((p, j) => <p key={j} className="legal__p">{p}</p>)}
            </section>
          ))}
        </div>
        <footer className="legal__foot">
          <button type="button" className="legal__done" onClick={() => setDoc(null)}>닫기</button>
        </footer>
      </div>
    </div>
  );
};

Object.assign(window, { LegalModal });

# Sleep Architect — 홈페이지

수면 단계별로 침실 환경을 자동 조정하는 베드사이드 로봇 **Sleep Architect**의 단일 페이지 포트폴리오 사이트입니다.

## 구성 파일
| 파일 | 설명 |
|---|---|
| `index.html` | 메인 홈페이지 (이미지·영상·CSS·JS 모두 내장된 자체 포함 파일) |
| `board.html` | 자유 게시판 — Firebase Firestore 연동(글·추천·댓글·삭제). `tokens.css` 필요 |
| `project-story.html` | Project Story 페이지 (자체 포함) |
| `tokens.css` | 디자인 토큰(색·타이포·간격). `board.html`이 참조 |

## GitHub에 올리기
1. 이 폴더의 **4개 파일을 그대로** 저장소 루트에 업로드(드래그&드롭 또는 commit)합니다.
2. 저장소 **Settings → Pages → Branch: main / root** 선택 후 저장.
3. 잠시 뒤 `https://<사용자명>.github.io/<저장소명>/` 에서 사이트가 열립니다.
   - 첫 화면은 `index.html`이며, 하단 FAQ의 **자유 게시판 입장** 버튼으로 게시판에 들어갑니다.

## 자유 게시판 (Firebase)
- 누구나 글을 쓰는 공개 게시판이라, Firestore 보안 규칙에서 `board_posts` 컬렉션의 읽기/쓰기가 허용되어야 합니다.
- 서버에 연결되지 않으면 자동으로 **오프라인 데모 모드**(브라우저 저장)로 동작합니다.

## 폰트
`Pretendard`·`JetBrains Mono`·`Bruno Ace`는 CDN에서 자동 로드됩니다. 별도 폰트 파일 업로드가 필요 없습니다.

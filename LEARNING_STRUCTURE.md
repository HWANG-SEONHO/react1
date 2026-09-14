# PKNU AI Campus 학습용 코드 구조

## 1. 수업에서 먼저 볼 코드

- `src/App.jsx` : URL과 페이지 연결 (`Routes`, `Route`)
- `src/pages/` : 각 기능의 state / event / axios / navigate 흐름
- `src/utils/auth.js` : 로그인 토큰 저장/조회/삭제
- `src/utils/chat.js` : MQTT 연결/토픽
- `src/reducers/loggedSlice.jsx` : Redux 로그인 상태
- `src/store.jsx` : Redux store 등록

## 2. 디자인만 볼 때

- `src/design/site/` : 공통 상단바, 공통 페이지 틀, 알림, 로그아웃 팝업
- `src/design/board/BoardHeader.jsx` : 게시판 전용 상단바
- `src/styles/` : 색상, 크기, 정렬, 투명도, 하이라이트 등 CSS
- `src/assets/` : 현재 화면에서 실제 사용하는 이미지

## 3. 페이지별 기능 흐름

### Home
`검색 submit -> navigate('/item/list?text=검색어')`

### ItemList
`URL text -> state -> useEffect -> axios GET -> rows -> map -> 카드 출력`

### ItemInsert
`input/file -> state -> FormData -> axios POST -> 결과 표시`

### Board
`검색/page -> axios GET -> table 출력`, 인기글은 전체 목록을 모아 조회수 정렬

### BoardWrite
`입력 state -> 유효성 검사 -> axios POST -> 게시판 이동`

### BoardContent
`URL no -> 상세 GET -> 출력`, 전체 목록에서 이전/다음 글 계산

### Login
`아이디/암호 -> POST -> token 확인 -> 저장소 + Redux -> 이동`

### Join
`입력 -> 프론트 검증 -> POST -> 로그인 이동`

### MyPage
`?account=info/password -> 조건부 ChangeInfo/ChangePW 출력`

### ChangeInfo
`GET 현재정보 -> input 수정 -> PUT 저장`

### ChangePW
`현재/새 암호 검증 -> PUT /api/member/updatepw.json`

### Chat
`MQTT connect -> subscribe -> message 수신`, `submit -> publish`

## 4. 정리한 오류/중복

- `App.jsx`가 존재하지 않는 `Mypage` 파일을 import하던 오류 제거
- `src/pages/MyPage.jsx`가 자기 자신을 다시 export하던 순환 오류 제거
- 옛 Ant Design 헤더/Footer가 새 `SiteShell`과 동시에 렌더링되던 구조 제거
- `/mypage` query 방식과 예전 nested route 방식이 섞여 있던 문제 통일
- 홈 검색어가 물품목록 URL에만 붙고 실제 검색 state로 반영되지 않던 문제 수정
- 암호변경은 수업 소스에서 확인된 `/api/member/updatepw.json` 방식으로 정리
- root의 `pages/`, `styles/`, `design/`, `assets/` 등 중복 사본 제거
- 사용하지 않는 Board1/old Footer/old Logout/실험용 board 컴포넌트와 CSS 제거
- 물품목록/물품등록에 같은 배경 이미지가 중복 저장되어 있던 것을 `item-campus.png` 하나로 통합

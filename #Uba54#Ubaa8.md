### 화면 공유
http://10.174.96.119/class303

### nodejs설치 확인
```
node -v
npm -v
```

### react1 프로젝트 생성
```
npm create vite@latest react1
```

### 프로젝트 구동
```
cd react1
npm install
npm run dev
```

### 라이브러리 설치
```
npm i react-router-dom
npm i axios
npm i antd

npm i @reduxjs/toolkit react-redux
npm i mqtt

```

### 개발 서버 구동
```
npm run dev
```

### 단축키 모음
자동정렬
alt + shift  + f

현재라인 복사
alt + shift + 방향키(아래로)

---

### router
|url|파일명|
|---|---|
|/         |  Home.jsx |
|/board  |  Board.jsx
|/board/write  | BoardWrite.jsx
|/login   |  Login.jsx
|/join     |  Join.jsx

### git ###
git add .
git commit -m "update"
git push

### 파일로바꿔줌
npm run build

### 집가는 버전 기본 작업
- 스타일 분리: inline style 제거, 디자인은 `src/styles/design.css`로 이동
- 공부용 주석: 학습 핵심 / 고정 이름·임의 이름 / 기능 흐름 구분
- 코드 정리: 짧은 코드는 가로형, 불필요한 빈줄·중복 제거
- 검증: build + lint + ZIP 무결성 확인


/**
 * 파일명: main.jsx
 *
 * =========================================================
 * [수업 코드 영역: React 앱 시작점]
 * 1) createRoot  : index.html의 <div id="root">에 React를 연결한다.
 * 2) BrowserRouter: App 안에서 Route / navigate / Link를 사용할 수 있게 한다.
 * 3) Provider    : Redux store를 App 아래 모든 컴포넌트에서 사용할 수 있게 한다.
 *
 * [디자인 영역]
 * 전역 기본값만 index.css에서 불러온다.
 * 페이지 디자인 CSS는 각 디자인 컴포넌트/페이지가 필요한 파일만 직접 import한다.
 * =========================================================
 */

import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"

import App from "./App.jsx"
import store from "./store.jsx"
import "./index.css"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)

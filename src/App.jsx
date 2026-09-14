/**
 * 파일명: App.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * App의 역할은 "URL -> 페이지 컴포넌트" 연결만 담당한다.
 * - Routes: 여러 Route를 묶는 라우팅 컨테이너
 * - Route : path(URL)와 element(화면)를 연결
 *
 * [디자인 영역 분리 원칙]
 * 상단바, 배경, 패널, 버튼 모양은 App에서 만들지 않는다.
 * 각 페이지가 SiteShell / BoardHeader 같은 디자인 컴포넌트를 사용하고,
 * 실제 색상/크기/정렬은 src/styles/*.css에서 관리한다.
 *
 * 이렇게 분리하면 수업 시간에는 이 파일에서 "라우팅"만 보면 되고,
 * 디자인 수정 때문에 라우팅 코드가 복잡해지는 것을 막을 수 있다.
 * =========================================================
 */

import { Route, Routes } from "react-router-dom"

import Board from "./pages/Board"
import BoardContent from "./pages/BoardContent"
import BoardWrite from "./pages/BoardWrite"
import Chat from "./pages/Chat"
import Home from "./pages/Home"
import ItemInsert from "./pages/ItemInsert"
import ItemList from "./pages/ItemList"
import Join from "./pages/Join"
import Login from "./pages/Login"
import MyPage from "./pages/MyPage"

export default function App() {
  return (
    <Routes>
      {/* ===== 수업 코드: 기본 페이지 ===== */}
      <Route path="/" element={<Home />} />

      {/* ===== 수업 코드: 물품 기능 ===== */}
      <Route path="/item/list" element={<ItemList />} />
      <Route path="/item/insert" element={<ItemInsert />} />

      {/* ===== 수업 코드: 게시판 기능 ===== */}
      <Route path="/board" element={<Board />} />
      <Route path="/board/write" element={<BoardWrite />} />
      <Route path="/board/content" element={<BoardContent />} />

      {/* ===== 수업 코드: 회원 기능 ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/mypage" element={<MyPage />} />

      {/* ===== 수업 코드: MQTT 채팅 ===== */}
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
}

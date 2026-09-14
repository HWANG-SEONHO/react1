/**
 * [디자인 컴포넌트 영역]
 * 공통 상단바 UI. 이동/로그아웃/알림 열기처럼 헤더 자체에 필요한 이벤트만 가진다.
 * 페이지별 API 로직은 넣지 않는다.
 */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import logoMark from "../../assets/pknu-ai-mark-approved.png"
import { clearAuth, getAuth, subscribeAuth } from "../../utils/auth"
import { logout } from "../../reducers/loggedSlice"
import LogoutConfirm from "./LogoutConfirm"
import NotificationPanel from "./NotificationPanel"

// ===== 디자인 표시 1: 상단 메뉴 아이콘 =====
function HomeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.2 12 3l8.5 7.2v9.3a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1Z"/></svg>
}
function BoxIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 7 8-4 8 4v10l-8 4-8-4Z"/><path d="m4 7 8 4 8-4M12 11v10"/></svg>
}
function PlusBoxIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 7 8-4 8 4v10l-8 4-8-4Z"/><path d="M12 8v8M8 12h8"/></svg>
}
function BoardIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>
}
function ChatIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.8A2.8 2.8 0 0 1 6.8 3h10.4A2.8 2.8 0 0 1 20 5.8v6.4a2.8 2.8 0 0 1-2.8 2.8H10l-4.8 4v-4.3A2.8 2.8 0 0 1 4 12.2Z"/></svg>
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 10.2c0-3.6 2.2-6.2 5.5-6.2s5.5 2.6 5.5 6.2v3.5l1.6 2.2H4.9l1.6-2.2Z"/><path d="M9.5 19h5"/></svg>
}

// ===== 디자인 표시 2: 상단 메뉴 구성 =====
const navItems = [
  ["홈", HomeIcon, "/"],
  ["물품목록", BoxIcon, "/item/list"],
  ["물품등록", PlusBoxIcon, "/item/insert"],
  ["게시판", BoardIcon, "/board"],
  ["채팅", ChatIcon, "/chat"],
]

// ===== 헤더 자체 기능: 인증상태/알림/로그아웃 + 화면 표시 =====
export default function SiteHeader({ active = "홈", userLabel = "로그인", userRoute = "/login" }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [auth, setAuth] = useState(() => getAuth())
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notificationUnread, setNotificationUnread] = useState(0)

  useEffect(() => subscribeAuth(() => setAuth(getAuth())), [])

  const resolvedUserLabel = auth.loggedIn ? "마이페이지" : "로그인"
  const resolvedUserRoute = auth.loggedIn ? "/mypage?account=info" : "/login"

  const handleLogout = () => setLogoutOpen(true)

  const confirmLogout = () => {
    dispatch(logout())
    clearAuth()
    setLogoutOpen(false)
    navigate("/login", { replace: true })
  }

  return (
    <>
    <header className="site-brandbar">
      <button type="button" className="site-brandbar__brand" onClick={() => navigate("/")} aria-label="홈으로 이동">
        <img src={logoMark} alt="" className="site-brandbar__mark" />
        <div className="site-brandbar__text">
          <strong>PKNU AI Campus</strong>
          <span>AI · PEOPLE · TOMORROW</span>
        </div>
      </button>

      <nav className="site-brandbar__nav" aria-label="주요 메뉴">
        {navItems.map(([label, Icon, path]) => (
          <button
            key={label}
            type="button"
            className={`site-brandbar__nav-btn ${label === active ? "is-active" : ""}`}
            onClick={() => navigate(path)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="site-brandbar__right">
        <button
          type="button"
          className={`site-brandbar__bell ${notificationOpen ? "is-open" : ""}`}
          aria-label="알림 보기"
          aria-expanded={notificationOpen}
          onClick={() => setNotificationOpen((open) => !open)}
        >
          <BellIcon />
          {notificationUnread > 0 && <span className="site-brandbar__badge">{notificationUnread > 99 ? "99+" : notificationUnread}</span>}
        </button>
        <span className="site-brandbar__divider" />
        <button type="button" className="site-brandbar__user" onClick={() => navigate(resolvedUserRoute)}>{resolvedUserLabel}</button>
        {auth.loggedIn && (
          <>
            <span className="site-brandbar__divider site-brandbar__divider--account" />
            <button type="button" className="site-brandbar__logout" onClick={handleLogout}>로그아웃</button>
          </>
        )}
      </div>
    </header>
    <NotificationPanel
      open={notificationOpen}
      onClose={() => setNotificationOpen(false)}
      onUnreadChange={setNotificationUnread}
    />
    <LogoutConfirm open={logoutOpen} onCancel={() => setLogoutOpen(false)} onConfirm={confirmLogout} />
    </>
  )
}

/**
 * [디자인 컴포넌트 영역]
 * 모든 일반 페이지가 공통 배경/veil/상단바를 재사용하기 위한 껍데기다.
 * API/state 학습 로직은 넣지 않는다.
 */

import { useEffect } from "react"
import SiteHeader from "./SiteHeader"
import "../../styles/site-brand.css"

export default function SiteShell({
  active,
  background,
  backgroundPosition = "center",
  veil = "default",
  userLabel = "로그인",
  userRoute = "/login",
  className = "",
  children,
}) {
  useEffect(() => {
    document.body.classList.add("board-topbar-only-mode")
    return () => document.body.classList.remove("board-topbar-only-mode")
  }, [])

  return (
    <main className={`site-brand-page ${className}`.trim()}>
      <img className="site-brand-page__bg" src={background} alt="" style={{ objectPosition: backgroundPosition }} />
      <div className={`site-brand-page__veil site-brand-page__veil--${veil}`} aria-hidden="true" />
      <div className="site-brand-page__header">
        <SiteHeader active={active} userLabel={userLabel} userRoute={userRoute} />
      </div>
      <div className="site-brand-page__content">{children}</div>
    </main>
  )
}

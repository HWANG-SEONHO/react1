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

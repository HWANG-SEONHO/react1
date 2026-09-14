import { useEffect } from "react"
import "../../styles/logout-confirm.css"

export default function LogoutConfirm({ open, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === "Escape") onCancel?.()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="logout-confirm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel?.()}>
      <section className="logout-confirm__panel" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
        <div className="logout-confirm__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M10 4H6.8A2.8 2.8 0 0 0 4 6.8v10.4A2.8 2.8 0 0 0 6.8 20H10" />
            <path d="M14 8l4 4-4 4M18 12H9" />
          </svg>
        </div>
        <p className="logout-confirm__eyebrow">PKNU AI CAMPUS</p>
        <h2 id="logout-confirm-title">로그아웃하시겠습니까?</h2>
        <p className="logout-confirm__copy">현재 로그인 세션을 종료하고 로그인 화면으로 이동합니다.</p>
        <div className="logout-confirm__actions">
          <button type="button" className="logout-confirm__cancel" onClick={onCancel}>취소</button>
          <button type="button" className="logout-confirm__ok" onClick={onConfirm}>로그아웃</button>
        </div>
      </section>
    </div>
  )
}

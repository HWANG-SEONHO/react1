/**
 * 파일명: ChangePW.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 암호변경은 현재 수업 소스에서 사용하던 API를 그대로 사용한다.
 *
 * 1) 현재 암호 / 새 암호 / 새 암호 확인을 state로 관리
 * 2) 빈 값과 새 암호 일치 여부를 프론트에서 먼저 검사
 * 3) 로그인 토큰을 Authorization 헤더에 넣음
 * 4) PUT /api/member/updatepw.json 호출
 *    - password  : 현재 암호
 *    - password1 : 변경할 새 암호
 * 5) 성공하면 입력값 초기화
 * 이름 구분: useState/axios는 정해진 이름, form/onChange/onSubmit/onCancel은 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * className만 여기서 연결하고 실제 디자인은 site-brand.css에서 관리한다.
 * =========================================================
 */

import { useState } from "react"
import axios from "axios"
import { getAuthToken } from "../utils/auth"

const initialForm = { current: "", next: "", confirm: "" }

const errorMessage = (error, fallback) => {
  const message = error?.response?.data?.message
    ?? error?.response?.data?.detail
    ?? error?.response?.data?.error
  return typeof message === "string" && message.trim() ? message : fallback
}

export default function ChangePW() {
  // ===== 수업 코드 1: 입력값 + 요청상태 =====
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" })

  // 여러 password input을 name 값으로 한 번에 처리한다.
  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (status.text) setStatus({ type: "", text: "" })
  }

  // ===== 수업 코드 2: 유효성 검사 -> API 요청 =====
  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: "", text: "" })

    if (!form.current || !form.next || !form.confirm) {
      setStatus({ type: "error", text: "현재 암호와 새 암호를 모두 입력해주세요." })
      return
    }
    if (form.next !== form.confirm) {
      setStatus({ type: "error", text: "새 암호와 암호 확인이 일치하지 않습니다." })
      return
    }
    if (form.current === form.next) {
      setStatus({ type: "error", text: "현재 암호와 다른 새 암호를 입력해주세요." })
      return
    }

    setSaving(true)
    try {
      const token = getAuthToken()
      const body = {
        password: form.current,
        password1: form.next,
      }

      const { data } = await axios.put("/api/member/updatepw.json", body, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      // 기존 수업 API는 status === 200을 성공 기준으로 사용한다.
      if (Number(data?.status) !== 200) {
        throw new Error(data?.message || "PASSWORD_UPDATE_FAILED")
      }

      setForm(initialForm)
      setStatus({ type: "success", text: "암호가 변경되었습니다." })
    } catch (error) {
      console.error("암호 변경 실패", error)
      setStatus({ type: "error", text: errorMessage(error, "현재 암호를 확인하거나 잠시 후 다시 시도해주세요.") })
    } finally {
      setSaving(false)
    }
  }

  // ===== 수업 코드 3: 취소 =====
  const onCancel = () => {
    setForm(initialForm)
    setStatus({ type: "", text: "" })
  }

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <form className="mypage-editor" onSubmit={onSubmit}>
      <div className="mypage-editor__intro">
        <p className="mypage-editor__kicker">SECURITY PASSWORD</p>
        <h3>암호 변경</h3>
        <p>현재 암호를 확인한 뒤 새 암호로 변경합니다.</p>
      </div>

      <div className="mypage-editor__grid mypage-editor__grid--password">
        <div className="item-field item-field--full">
          <label htmlFor="pw-current">현재 암호</label>
          <input id="pw-current" type="password" name="current" value={form.current} onChange={onChange} disabled={saving} autoComplete="current-password" placeholder="현재 암호를 입력하세요." />
        </div>
        <div className="item-field">
          <label htmlFor="pw-next">새 암호</label>
          <input id="pw-next" type="password" name="next" value={form.next} onChange={onChange} disabled={saving} autoComplete="new-password" placeholder="새 암호를 입력하세요." />
        </div>
        <div className="item-field">
          <label htmlFor="pw-confirm">새 암호 확인</label>
          <input id="pw-confirm" type="password" name="confirm" value={form.confirm} onChange={onChange} disabled={saving} autoComplete="new-password" placeholder="새 암호를 한 번 더 입력하세요." />
        </div>
      </div>

      {status.text && <p className={`mypage-editor__status is-${status.type}`} role="status">{status.text}</p>}

      <div className="mypage-editor__actions">
        <button type="button" className="brand-secondary" onClick={onCancel} disabled={saving}>취소</button>
        <button type="submit" className="brand-primary" disabled={saving}>{saving ? "변경 중..." : "암호 변경"}</button>
      </div>
    </form>
  )
}

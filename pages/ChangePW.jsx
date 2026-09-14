import { useState } from "react"
import axios from "axios"
import { getAuth, getAuthToken } from "../utils/auth"

const initialForm = { current: "", next: "", confirm: "" }

const sourceOf = (data) => data?.result ?? data?.data ?? data?.member ?? data ?? {}

const errorMessage = (error, fallback) => {
  const message = error?.response?.data?.message
    ?? error?.response?.data?.detail
    ?? error?.response?.data?.error
  return typeof message === "string" && message.trim() ? message : fallback
}

export default function ChangePW() {
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" })

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (status.text) setStatus({ type: "", text: "" })
  }

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
      const auth = getAuth()
      const { data: profileData } = await axios.get("/api/member/selectone.json", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const profile = sourceOf(profileData)
      const email = profile?.email ?? auth?.user?.email ?? ""

      if (!email) throw new Error("MEMBER_EMAIL_NOT_FOUND")

      // 이미 사용 중인 로그인 API로 현재 암호를 먼저 확인한다.
      await axios.post("/api/member/login.json", {
        email,
        password: form.current,
      })

      // 회원정보 수정 API에 기존 정보와 새 암호를 함께 전달한다.
      await axios.put("/api/member/update.json", {
        name: profile?.name ?? "",
        age: Number(profile?.age ?? 0),
        email,
        password: form.next,
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      setForm(initialForm)
      setStatus({ type: "success", text: "암호가 변경되었습니다." })
    } catch (error) {
      console.error("암호 변경 실패", error)
      const fallback = error?.message === "MEMBER_EMAIL_NOT_FOUND"
        ? "회원 이메일을 확인할 수 없습니다. 정보 변경 화면에서 이메일을 먼저 확인해주세요."
        : "현재 암호를 확인하거나 잠시 후 다시 시도해주세요."
      setStatus({ type: "error", text: errorMessage(error, fallback) })
    } finally {
      setSaving(false)
    }
  }

  const onCancel = () => {
    setForm(initialForm)
    setStatus({ type: "", text: "" })
  }

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

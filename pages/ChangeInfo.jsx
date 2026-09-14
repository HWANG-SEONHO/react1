import { useEffect, useState } from "react"
import axios from "axios"
import { getAuthToken } from "../utils/auth"

const emptyForm = { name: "", age: "", email: "" }

const normalizeMember = (data) => {
  const source = data?.result ?? data?.data ?? data?.member ?? data ?? {}
  return {
    name: source?.name ?? "",
    age: source?.age ?? "",
    email: source?.email ?? "",
  }
}

const errorMessage = (error, fallback) => {
  const message = error?.response?.data?.message
    ?? error?.response?.data?.detail
    ?? error?.response?.data?.error
  return typeof message === "string" && message.trim() ? message : fallback
}

export default function ChangeInfo() {
  const [form, setForm] = useState(emptyForm)
  const [saved, setSaved] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" })

  const loadInfo = async () => {
    setLoading(true)
    setStatus({ type: "", text: "" })
    try {
      const token = getAuthToken()
      const { data } = await axios.get("/api/member/selectone.json", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const next = normalizeMember(data)
      setForm(next)
      setSaved(next)
    } catch (error) {
      console.error("회원정보 조회 실패", error)
      setStatus({ type: "error", text: errorMessage(error, "회원정보를 불러오지 못했습니다.") })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadInfo() }, [])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (status.text) setStatus({ type: "", text: "" })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: "", text: "" })

    if (!form.name.trim() || !form.age || !form.email.trim()) {
      setStatus({ type: "error", text: "이름, 나이, 이메일을 모두 입력해주세요." })
      return
    }

    setSaving(true)
    try {
      const token = getAuthToken()
      const payload = {
        name: form.name.trim(),
        age: Number(form.age),
        email: form.email.trim(),
      }
      await axios.put("/api/member/update.json", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const next = { ...payload, age: String(payload.age) }
      setForm(next)
      setSaved(next)
      setStatus({ type: "success", text: "회원정보가 변경되었습니다." })
    } catch (error) {
      console.error("회원정보 수정 실패", error)
      setStatus({ type: "error", text: errorMessage(error, "회원정보 변경에 실패했습니다.") })
    } finally {
      setSaving(false)
    }
  }

  const onCancel = () => {
    if (saved) setForm(saved)
    else loadInfo()
    setStatus({ type: "", text: "" })
  }

  return (
    <form className="mypage-editor" onSubmit={onSubmit}>
      <div className="mypage-editor__intro">
        <p className="mypage-editor__kicker">PROFILE INFORMATION</p>
        <h3>정보 변경</h3>
        <p>가입할 때 입력한 이름, 나이, 이메일을 확인하고 수정합니다.</p>
      </div>

      <div className="mypage-editor__grid">
        <div className="item-field">
          <label htmlFor="profile-name">이름</label>
          <input id="profile-name" name="name" value={form.name} onChange={onChange} disabled={loading || saving} placeholder="이름을 입력하세요." />
        </div>
        <div className="item-field">
          <label htmlFor="profile-age">나이</label>
          <input id="profile-age" name="age" type="number" min="1" max="120" value={form.age} onChange={onChange} disabled={loading || saving} placeholder="나이를 입력하세요." />
        </div>
        <div className="item-field item-field--full">
          <label htmlFor="profile-email">이메일</label>
          <input id="profile-email" name="email" type="email" value={form.email} onChange={onChange} disabled={loading || saving} placeholder="이메일을 입력하세요." />
        </div>
      </div>

      {status.text && <p className={`mypage-editor__status is-${status.type}`} role="status">{status.text}</p>}

      <div className="mypage-editor__actions">
        <button type="button" className="brand-secondary" onClick={onCancel} disabled={loading || saving}>취소</button>
        <button type="submit" className="brand-primary" disabled={loading || saving}>{saving ? "저장 중..." : "정보 변경"}</button>
      </div>
    </form>
  )
}

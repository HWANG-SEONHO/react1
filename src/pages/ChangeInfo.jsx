/**
 * 파일명: ChangeInfo.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 회원정보 수정의 전체 흐름을 한 파일에서 복습한다.
 *
 * 1) useEffect가 화면 최초 진입 때 loadInfo() 실행
 * 2) GET /api/member/selectone.json 으로 현재 회원정보 조회
 * 3) 조회값을 state(form)에 넣고 input value와 연결
 * 4) 사용자가 input을 수정하면 onChange가 state 변경
 * 5) submit 시 PUT /api/member/update.json 으로 서버에 수정 요청
 * 6) 성공하면 화면의 기준값(saved)도 최신값으로 교체
 * 7) 취소 버튼은 saved 값으로 되돌린다.
 * 이름 구분: useState/useEffect/axios는 정해진 이름, form/saved/loadInfo/onSubmit은 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 이 파일에서는 className만 지정한다.
 * 입력창/패널/버튼의 크기·색상·정렬은 src/styles/site-brand.css가 담당한다.
 * =========================================================
 */

import { useEffect, useState } from "react"
import axios from "axios"
import { getAuthToken } from "../utils/auth"

// ===== 수업 코드: 폼의 기본 state 구조 =====
const emptyForm = { name: "", age: "", email: "" }

// 서버 응답 모양이 result/data/member 중 어느 형태여도 사용할 수 있게 한 곳에서 정리한다.
const normalizeMember = (data) => {
  const source = data?.result ?? data?.data ?? data?.member ?? data ?? {}
  return {
    name: source?.name ?? "",
    age: source?.age ?? "",
    email: source?.email ?? "",
  }
}

// 서버 에러 메시지가 있으면 우선 사용하고, 없으면 화면용 기본 문구를 사용한다.
const errorMessage = (error, fallback) => {
  const message = error?.response?.data?.message
    ?? error?.response?.data?.detail
    ?? error?.response?.data?.error
  return typeof message === "string" && message.trim() ? message : fallback
}

export default function ChangeInfo() {
  // ===== 수업 코드 1: 화면 state =====
  const [form, setForm] = useState(emptyForm)
  const [saved, setSaved] = useState(null) // 서버에서 마지막으로 확인된 값: 취소 시 복원용
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" })

  // ===== 수업 코드 2: 현재 회원정보 GET =====
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

  // 컴포넌트가 처음 화면에 나타날 때 회원정보를 한 번 읽는다.
  useEffect(() => {
    loadInfo()
  }, [])

  // ===== 수업 코드 3: controlled input =====
  // input의 name 속성(name/age/email)을 key로 사용해서 한 함수로 여러 입력값을 처리한다.
  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (status.text) setStatus({ type: "", text: "" })
  }

  // ===== 수업 코드 4: 회원정보 PUT =====
  const onSubmit = async (event) => {
    event.preventDefault() // form 기본 새로고침 방지
    setStatus({ type: "", text: "" })

    // 서버 요청 전에 프론트에서 빈 값 검증
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

      // 수정 성공 후 현재 입력값을 새 기준값으로 저장한다.
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

  // ===== 수업 코드 5: 취소 =====
  // 서버에서 마지막으로 읽거나 저장한 값으로 input을 되돌린다.
  const onCancel = () => {
    if (saved) setForm(saved)
    else loadInfo()
    setStatus({ type: "", text: "" })
  }

  // =========================================================
  // [디자인 연결 영역]
  // 아래 JSX는 화면 구조와 className만 담당한다.
  // 실제 시각 디자인은 site-brand.css의 .mypage-* 규칙에서 관리한다.
  // =========================================================
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

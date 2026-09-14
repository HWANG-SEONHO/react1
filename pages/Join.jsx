import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import SiteShell from "../design/site/SiteShell"
import loginBg from "../src/assets/brand/login-campus-clean.png"

const initialForm = {
  userid: "",
  name: "",
  age: "",
  email: "",
  password: "",
  passwordConfirm: "",
}

export default function Join() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState("")

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errorText) setErrorText("")
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setErrorText("")

    if (!form.userid.trim() || !form.name.trim() || !form.age || !form.email.trim() || !form.password) {
      setErrorText("아이디, 이름, 나이, 이메일, 비밀번호를 모두 입력해주세요.")
      return
    }
    if (form.password !== form.passwordConfirm) {
      setErrorText("비밀번호 확인이 일치하지 않습니다.")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/member/join.json", {
        id: form.userid.trim(),
        age: form.age,
        email: form.email.trim(),
        name: form.name.trim(),
        password: form.password,
      })
      navigate("/login", { replace: true, state: { joined: true, userid: form.userid.trim() } })
    } catch (error) {
      console.error("회원가입 실패", error)
      const message = error?.response?.data?.message ?? error?.response?.data?.detail
      setErrorText(typeof message === "string" ? message : "회원가입에 실패했습니다. 입력 정보를 확인해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteShell active="홈" background={loginBg} backgroundPosition="center" veil="default" className="login-brand-page join-brand-page">
      <section className="brand-panel login-brand-page__card join-brand-page__card">
        <div className="brand-heading login-brand-page__heading">
          <div>
            <p className="brand-heading__eyebrow">JOIN PKNU AI CAMPUS</p>
            <h1>회원가입</h1>
            <p>캠퍼스 서비스를 이용할 기본 정보를 입력합니다.</p>
          </div>
        </div>

        <form className="login-form join-form" onSubmit={onSubmit}>
          <div className="join-form__grid">
            <div className="login-field join-field join-field--userid">
              <label htmlFor="join-userid">아이디</label>
              <input
                id="join-userid"
                name="userid"
                value={form.userid}
                onChange={onChange}
                autoComplete="username"
                placeholder="아이디를 입력하세요."
              />
            </div>

            <div className="login-field join-field join-field--name">
              <label htmlFor="join-name">이름</label>
              <input id="join-name" name="name" value={form.name} onChange={onChange} autoComplete="name" placeholder="이름을 입력하세요." />
            </div>

            <div className="login-field join-field join-field--age">
              <label htmlFor="join-age">나이</label>
              <input id="join-age" name="age" type="number" min="1" max="120" value={form.age} onChange={onChange} inputMode="numeric" placeholder="나이를 입력하세요." />
            </div>

            <div className="login-field join-field join-field--email">
              <label htmlFor="join-email">이메일</label>
              <input id="join-email" name="email" type="email" value={form.email} onChange={onChange} autoComplete="email" placeholder="이메일을 입력하세요." />
            </div>

            <div className="login-field join-field join-field--password">
              <label htmlFor="join-password">비밀번호</label>
              <input id="join-password" name="password" type="password" value={form.password} onChange={onChange} autoComplete="new-password" placeholder="비밀번호를 입력하세요." />
            </div>

            <div className="login-field join-field join-field--password-confirm">
              <label htmlFor="join-password-confirm">비밀번호 확인</label>
              <input id="join-password-confirm" name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={onChange} autoComplete="new-password" placeholder="비밀번호를 한 번 더 입력하세요." />
            </div>
          </div>

          {errorText && <p className="login-error" role="alert">{errorText}</p>}

          <button type="submit" className="join-submit" disabled={loading}>
            {loading ? "가입 처리 중..." : "회원가입 완료"}
          </button>
        </form>

        <div className="login-join-area">
          <span>이미 계정이 있으신가요?</span>
          <button type="button" className="login-back-link" onClick={() => navigate("/login")}>로그인으로</button>
        </div>
      </section>
    </SiteShell>
  )
}

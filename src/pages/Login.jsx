/**
 * 파일명: Login.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 로그인 흐름: input state -> 유효성 검사 -> axios POST -> token 확인
 * -> 브라우저 저장소(local/session) 선택 -> Redux 로그인 상태 갱신 -> navigate.
 *
 * - 아이디 저장: localStorage에 아이디 문자열만 저장한다.
 * - 로그인 상태 유지: token을 localStorage에 저장할지 sessionStorage에 저장할지 결정한다.
 * - HTTP 200만으로 로그인 성공 처리하지 않고 실제 token 존재를 확인한다.
 * 이름 구분: useState/useEffect/useDispatch/useNavigate/axios는 정해진 이름, identifier/keepLogin/handleSubmit은 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 로그인 카드/입력창/버튼/배경은 SiteShell + site-brand.css에서 관리한다.
 * =========================================================
 */

import { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import SiteShell from "../design/site/SiteShell"
import loginBg from "../assets/brand/login-campus-clean.png"
import { getAuth, saveAuth } from "../utils/auth"
import { login } from "../reducers/loggedSlice"

const loginErrorText = (error) => {
  const message = error?.response?.data?.message
    ?? error?.response?.data?.detail
    ?? error?.response?.data?.error
  return typeof message === "string" && message.trim()
    ? message
    : "아이디 또는 비밀번호를 확인해주세요."
}

async function loginRequest(id, password) {
  return axios.post("/api/member/login.json", { id, password })
}

export default function Login() {
  // ===== 학습용 1: 라우팅/Redux 연결 + 로그인 state =====
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [saveId, setSaveId] = useState(false)
  const [keepLogin, setKeepLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState("")

  // ===== 학습용 2: 기존 로그인/저장 아이디 복원 =====
  useEffect(() => {
    const auth = getAuth()
    if (auth.loggedIn) {
      navigate("/", { replace: true })
      return
    }

    const joinedId = location.state?.userid || ""
    const savedId = window.localStorage.getItem("pknuSavedLoginId")
      || window.localStorage.getItem("pknuSavedEmail")
      || ""

    if (joinedId) setIdentifier(joinedId)
    else if (savedId) setIdentifier(savedId)

    if (savedId) setSaveId(true)
  }, [navigate, location.state])

  // ===== 학습용 3: form submit -> POST -> token 저장 -> Redux 갱신 =====
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!identifier.trim() || !password) {
      setErrorText("아이디와 비밀번호를 모두 입력해주세요.")
      return
    }

    setLoading(true)
    setErrorText("")

    try {
      const loginId = identifier.trim()
      const { data } = await loginRequest(loginId, password)

      if (data?.success === false || data?.status === false || data?.result === false) {
        throw new Error(data?.message || "LOGIN_FAILED")
      }

      const token = data?.token ?? data?.access_token ?? data?.accessToken ?? data?.data?.token ?? ""
      if (!token || !String(token).trim()) {
        // 서버가 200을 돌려도 인증 토큰이 없으면 로그인 성공으로 처리하지 않는다.
        throw new Error("LOGIN_NOT_AUTHENTICATED")
      }

      const user = data?.user ?? data?.member ?? data?.data?.user ?? (loginId.includes("@") ? { email: loginId } : { userid: loginId })

      if (saveId) {
        window.localStorage.setItem("pknuSavedLoginId", loginId)
        window.localStorage.removeItem("pknuSavedEmail")
      } else {
        window.localStorage.removeItem("pknuSavedLoginId")
        window.localStorage.removeItem("pknuSavedEmail")
      }

      const saved = saveAuth({ token, user }, keepLogin)
      if (!saved) throw new Error("LOGIN_NOT_AUTHENTICATED")
      dispatch(login({ token: String(token).trim(), remember: keepLogin }))

      const next = location.state?.from
      navigate(typeof next === "string" && next.startsWith("/") ? next : "/", { replace: true })
    } catch (error) {
      console.error("로그인 실패", error)
      setErrorText(loginErrorText(error))
    } finally {
      setLoading(false)
    }
  }

  // =========================================================
  // [디자인 연결 영역] 기능 로직과 분리된 JSX/className 영역
  // =========================================================
  return (
    <SiteShell active="홈" background={loginBg} backgroundPosition="center" veil="default" className="login-brand-page">
      <section className="brand-panel login-brand-page__card">
        <div className="brand-heading login-brand-page__heading">
          <div>
            <p className="brand-heading__eyebrow">WELCOME BACK</p>
            <h1>로그인</h1>
            <p>PKNU AI Campus의 모든 기능을 한 흐름으로 이어갑니다.</p>
          </div>
        </div>

        {location.state?.joined && (
          <div className="login-notice">회원가입이 완료되었습니다. 로그인해주세요.</div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-id">아이디</label>
            <input
              id="login-id"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="아이디를 입력하세요."
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">비밀번호</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요."
            />
          </div>

          <div className="login-option-row">
            <label className="login-remember">
              <input type="checkbox" checked={saveId} onChange={(e) => setSaveId(e.target.checked)} />
              <span>아이디 저장</span>
            </label>
            <label className="login-remember">
              <input type="checkbox" checked={keepLogin} onChange={(e) => setKeepLogin(e.target.checked)} />
              <span>로그인 상태 유지</span>
            </label>
          </div>

          {errorText && <p className="login-error" role="alert">{errorText}</p>}

          <button type="submit" className="login-submit" disabled={loading}>
            <span>{loading ? "로그인 중..." : "로그인"}</span>
          </button>
        </form>

        <div className="login-join-area">
          <span>아직 회원이 아니신가요?</span>
          <button type="button" className="login-join-link" onClick={() => navigate("/join")}>회원가입</button>
        </div>
      </section>
    </SiteShell>
  )
}

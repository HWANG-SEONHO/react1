/**
 * 파일명: MyPage.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 마이페이지에서 복습할 핵심은 "URL query -> state -> 조건부 컴포넌트" 흐름이다.
 *
 * /mypage?account=info     -> 정보 변경 화면
 * /mypage?account=password -> 암호 변경 화면
 *
 * 1) useLocation으로 현재 주소의 ?account 값을 읽는다.
 * 2) accountView state에 현재 탭을 저장한다.
 * 3) 탭 버튼을 누르면 navigate()로 query를 바꾼다.
 * 4) accountView 값에 따라 ChangeInfo / ChangePW 중 하나만 렌더링한다.
 * 5) 로그인 토큰이 없으면 로그인 화면으로 보낸다.
 * 이름 구분: useLocation/useNavigate/useEffect는 정해진 이름, accountView/openAccount/viewFromSearch는 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 배경, 계정관리 패널, 탭, 입력폼 디자인은 SiteShell + site-brand.css가 담당한다.
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import SiteShell from "../design/site/SiteShell"
import campusBg from "../assets/brand/login-campus-clean.png"
import { getAuth } from "../utils/auth"
import ChangeInfo from "./ChangeInfo"
import ChangePW from "./ChangePW"

// ===== 수업 코드 1: URL query를 화면 state 값으로 변환 =====
const viewFromSearch = (search) => {
  const account = new URLSearchParams(search).get("account")
  return account === "password" ? "password" : "info"
}

export default function MyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [accountView, setAccountView] = useState(() => viewFromSearch(location.search))

  // ===== 수업 코드 2: 로그인 보호 + 주소 변화 감지 =====
  useEffect(() => {
    if (!getAuth().loggedIn) {
      navigate("/login", { replace: true, state: { from: "/mypage?account=info" } })
      return
    }

    // 브라우저 뒤로가기 등으로 query가 바뀌어도 탭 화면을 주소와 맞춘다.
    setAccountView(viewFromSearch(location.search))
  }, [location.search, navigate])

  // ===== 수업 코드 3: 버튼 클릭 -> state + URL 변경 =====
  const openAccount = (view) => {
    const nextView = view === "password" ? "password" : "info"
    setAccountView(nextView)
    navigate(`/mypage?account=${nextView}`)
  }

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <SiteShell
      active="홈"
      background={campusBg}
      backgroundPosition="center 38%"
      veil="default"
      className="mypage-brand-page"
    >
      <section className="mypage-brand-page__hero">
        <div className="brand-heading">
          <div>
            <p className="brand-heading__eyebrow">MY PKNU AI CAMPUS</p>
            <h1>마이페이지</h1>
            <p>나의 정보와 보안을 한곳에서 관리합니다.</p>
          </div>
        </div>
      </section>

      <section className="mypage-brand-page__dashboard mypage-brand-page__dashboard--single">
        <section className="brand-panel mypage-main mypage-main--outlet mypage-main--solo">
          <div className="mypage-account-head">
            <div className="brand-heading">
              <div>
                <p className="brand-heading__eyebrow">ACCOUNT CENTER</p>
                <h2>계정 관리</h2>
                <p className="mypage-account-copy">이름, 나이, 이메일과 비밀번호를 이곳에서 바로 변경합니다.</p>
              </div>
            </div>

            <div className="mypage-account-tabs" aria-label="계정 관리 메뉴">
              <button type="button" className={accountView === "info" ? "is-active" : ""} onClick={() => openAccount("info")}>정보 변경</button>
              <button type="button" className={accountView === "password" ? "is-active" : ""} onClick={() => openAccount("password")}>암호 변경</button>
            </div>
          </div>

          <div className="mypage-outlet">
            {/* 수업 포인트: 삼항연산자로 현재 탭에 필요한 컴포넌트 하나만 출력 */}
            {accountView === "info" ? <ChangeInfo /> : <ChangePW />}
          </div>
        </section>
      </section>
    </SiteShell>
  )
}

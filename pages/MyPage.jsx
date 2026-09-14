import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import SiteShell from "../design/site/SiteShell"
import campusBg from "../src/assets/brand/login-campus-clean.png"
import { getAuth } from "../utils/auth"
import ChangeInfo from "./ChangeInfo"
import ChangePW from "./ChangePW"

const viewFromSearch = (search) => {
  const account = new URLSearchParams(search).get("account")
  return account === "password" ? "password" : "info"
}

export default function MyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [accountView, setAccountView] = useState(() => viewFromSearch(location.search))

  useEffect(() => {
    if (!getAuth().loggedIn) {
      navigate("/login", { replace: true, state: { from: "/mypage?account=info" } })
      return
    }
    setAccountView(viewFromSearch(location.search))
  }, [location.search, navigate])

  const openAccount = (view) => {
    const nextView = view === "password" ? "password" : "info"
    setAccountView(nextView)
    navigate(`/mypage?account=${nextView}`)
  }

  return (
    <SiteShell
      active="홈"
      background={campusBg}
      backgroundPosition="center 38%"
      veil="default"
      userLabel="마이페이지"
      userRoute="/mypage?account=info"
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
            {accountView === "info" ? <ChangeInfo /> : <ChangePW />}
          </div>
        </section>
      </section>
    </SiteShell>
  )
}

/**
 * 파일명: Home.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 홈에서 실제로 공부할 기능은 두 가지다.
 * 1) navigate()로 각 메뉴 페이지 이동
 * 2) 검색어를 FormData로 읽어 /item/list?text=검색어 형태로 전달
 * 이름 구분: useNavigate/FormData/encodeURIComponent는 정해진 이름, actions/handleSearch/iconName은 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 배경 이미지, 타이틀 위치, 검색창, 네 개의 심볼 카드는
 * SiteShell + src/styles/site-brand.css가 담당한다.
 * SVG 아이콘은 버튼의 시각 요소일 뿐 별도 기능은 없다.
 * =========================================================
 */

import { useNavigate } from "react-router-dom"
import SiteShell from "../design/site/SiteShell"
import HomeActionIcon from "../design/home/HomeActionIcon"
import homeHero from "../assets/brand/home-campus-people-clean.png"

// ===== 학습용 1: 빠른이동 데이터 =====
// path는 이동 기능, iconName/desc는 표시용 값이다. 실제 SVG는 design/home으로 분리했다.
const actions = [
  { title: "물품등록", desc: "나눔으로 이어지는 대학", path: "/item/insert", iconName: "insert" },
  { title: "물품목록", desc: "필요한 것을 한 곳에서", path: "/item/list", iconName: "items" },
  { title: "커뮤니티", desc: "함께하는 이야기", path: "/board", iconName: "board" },
  { title: "채팅", desc: "같은 캠퍼스에서 바로 대화", path: "/chat", iconName: "chat" },
]

export default function Home() {
  const navigate = useNavigate()

  // ===== 수업 코드 2: 홈 검색 -> 물품목록으로 검색어 전달 =====
  const handleSearch = (event) => {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get("query")?.toString().trim()

    // 검색어가 있으면 query string으로 넘기고, 없으면 전체 물품목록으로 이동한다.
    navigate(query ? `/item/list?text=${encodeURIComponent(query)}` : "/item/list")
  }

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <SiteShell active="홈" background={homeHero} backgroundPosition="center center" veil="home-clean" className="home-brand-page home-brand-page--people">
      <section className="home-brand-page__hero" aria-label="홈 소개">
        <p className="home-brand-page__eyebrow">PKNU AI CAMPUS</p>
        <h1><span className="home-brand-page__ai">AI</span>와 함께,<br /><span className="home-brand-page__headline-line">더 넓은 가능성을 엽니다.</span></h1>
        <p className="home-brand-page__copy">사람과 캠퍼스를 연결하는 물품 거래와 커뮤니티를 한곳에서 이용하세요.</p>
      </section>

      <section className="home-brand-page__search-wrap" aria-label="물품 검색">
        <form className="brand-searchbar home-brand-page__search" onSubmit={handleSearch} role="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4.2-4.2" /></svg>
          <input name="query" placeholder="캠퍼스 물품 검색" aria-label="캠퍼스 물품 검색" />
          <button type="submit" className="brand-primary home-search-highlight">검색</button>
        </form>
      </section>

      <section className="home-brand-page__dock" aria-label="빠른 이동">
        <div className="home-brand-page__actions">
          {actions.map(({ title, desc, path, iconName }) => (
            <button key={title} type="button" className="home-action" onClick={() => navigate(path)}>
              <span className="home-action__icon" aria-hidden="true"><HomeActionIcon name={iconName} /></span>
              <strong>{title}</strong>
              <span className="home-action__desc">{desc}</span>
            </button>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}

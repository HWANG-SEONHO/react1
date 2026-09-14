import { useNavigate } from "react-router-dom"
import SiteShell from "../design/site/SiteShell"
import homeHero from "../src/assets/brand/home-hero.png"

const actions = [
  {
    title: "물품등록",
    desc: "나눔으로 이어지는 대학",
    path: "/item/insert",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.2 4.2h7.6L18.8 9v10a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 19V6a1.8 1.8 0 0 1 1-1.8Z" />
        <path d="M13.8 4.2V9h5" />
        <path d="M12 10.4v5.6" />
        <path d="M9.2 13.2h5.6" />
      </svg>
    ),
  },
  {
    title: "물품목록",
    desc: "필요한 것을 한 곳에서",
    path: "/item/list",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.6 7.2H19.4v10.6a1.8 1.8 0 0 1-1.8 1.8H6.4a1.8 1.8 0 0 1-1.8-1.8Z" />
        <path d="M8.4 7.2V5.8a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2v1.4" />
        <path d="M4.6 11.2h14.8" />
      </svg>
    ),
  },
  {
    title: "커뮤니티",
    desc: "함께하는 이야기",
    path: "/board",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5.1h12a1.9 1.9 0 0 1 1.9 1.9v7a1.9 1.9 0 0 1-1.9 1.9h-7.2L6 19v-3.1A1.9 1.9 0 0 1 4.1 14V7A1.9 1.9 0 0 1 6 5.1Z" />
        <path d="M8.1 9.5h7.8" />
        <path d="M8.1 12.5h5.4" />
      </svg>
    ),
  },
  {
    title: "마이페이지",
    desc: "나의 활동과 성장",
    path: "/mypage?account=info",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 11.8a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
        <path d="M4.8 18.8a7.1 7.1 0 0 1 14.2 0" />
        <path d="M18.8 6.5v-1.8" />
        <path d="M17.9 5.6h1.8" />
      </svg>
    ),
  },
]

export default function Home() {
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get("query")?.toString().trim()
    navigate(query ? `/item/list?text=${encodeURIComponent(query)}` : "/item/list")
  }

  return (
    <SiteShell
      active="홈"
      background={homeHero}
      backgroundPosition="center center"
      veil="home"
      className="home-brand-page"
    >
      <h1 className="home-brand-page__sr-title">PKNU AI Campus</h1>

      <section className="home-brand-page__search-wrap" aria-label="물품 검색">
        <form className="brand-searchbar home-brand-page__search" onSubmit={handleSearch} role="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4.2-4.2" /></svg>
          <input name="query" placeholder="캠퍼스 물품 검색" aria-label="캠퍼스 물품 검색" />
          <button type="submit" className="brand-primary">검색</button>
        </form>
      </section>

      <section className="home-brand-page__dock" aria-label="빠른 이동">
        <div className="home-brand-page__actions">
          {actions.map(({ title, desc, path, icon }) => (
            <button key={title} type="button" className="home-action" onClick={() => navigate(path)}>
              <span className="home-action__icon" aria-hidden="true">{icon}</span>
              <strong>{title}</strong>
              <span>{desc}</span>
            </button>
          ))}
        </div>
      </section>
    </SiteShell>
  )
}

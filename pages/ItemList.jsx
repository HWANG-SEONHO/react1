import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import SiteShell from "../design/site/SiteShell"
import campusBg from "../src/assets/brand/globe-campus.png"
import logoMark from "../src/assets/pknu-ai-mark-approved.png"

const categories = ["전체", "전자기기", "생활용품", "도서", "스포츠·취미"]

const normalize = (item, index) => ({
  id: item?._id ?? item?.id ?? item?.no ?? index,
  name: item?.name ?? item?.title ?? item?.item ?? "물품명 없음",
  price: Number(item?.price ?? 0),
  category: item?.category ?? item?.cate ?? "기타",
  image: item?.imageurl ?? item?.image ?? item?.img ?? "",
  hit: Number(item?.hit ?? item?.views ?? 0),
  quantity: Number(item?.quantity ?? 1),
})

export default function ItemList() {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [text, setText] = useState("")
  const [searchText, setSearchText] = useState("")
  const [category, setCategory] = useState("전체")

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/item/select.json?page=${page}&text=${encodeURIComponent(searchText)}&cnt=8`)
        if (cancelled) return
        const list = Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : []
        setRows(list.map(normalize))
      } catch (error) {
        if (!cancelled) {
          console.error("물품목록 조회 실패", error)
          setRows([])
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [page, searchText])

  const filtered = useMemo(() => {
    if (category === "전체") return rows
    return rows.filter((item) => item.category === category)
  }, [rows, category])

  const displayRows = useMemo(() => {
    const list = filtered.slice(0, 8)
    while (list.length < 8) list.push(null)
    return list
  }, [filtered])

  const onSearch = (event) => {
    event.preventDefault()
    setPage(1)
    setSearchText(text.trim())
  }

  return (
    <SiteShell active="물품목록" background={campusBg} veil="dark" className="item-list-page">
      <section className="item-list-page__hero">
        <div className="brand-heading">
          <div>
            <p className="brand-heading__eyebrow">PKNU CAMPUS MARKET</p>
            <h1>필요한 물품을<br />더 빠르게 찾습니다.</h1>
          </div>
        </div>
        <form className="brand-searchbar" onSubmit={onSearch} role="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="상품명, 키워드로 검색하세요." />
          <button type="submit" className="brand-primary">검색</button>
        </form>
      </section>

      <section className="item-list-page__cockpit">
        <aside className="brand-panel item-list-page__filter">
          <h2>카테고리</h2>
          <div className="item-category-list">
            {categories.map((item) => (
              <button key={item} type="button" className={item === category ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
        </aside>

        <section className="brand-panel item-list-page__products">
          <div className="brand-heading">
            <div>
              <p className="brand-heading__eyebrow">ITEM LIST</p>
              <h2>캠퍼스 물품</h2>
            </div>
            <div className="brand-pill-row">
              <button type="button" className="brand-pill is-active">최신순</button>
              <button type="button" className="brand-pill">인기순</button>
            </div>
          </div>

          <div className="item-grid">
            {displayRows.map((item, index) => (
              item ? (
                <article className="item-card" key={item.id}>
                  <div className="item-card__image">
                    {item.image ? <img src={item.image} alt="" /> : <img className="item-card__fallback" src={logoMark} alt="" />}
                  </div>
                  <div className="item-card__body">
                    <div className="item-card__name">{item.name}</div>
                    <div className="item-card__price">₩ {item.price.toLocaleString()}</div>
                    <div className="item-card__meta"><span>{item.category}</span><span>조회 {item.hit}</span></div>
                  </div>
                </article>
              ) : <div className="item-card" key={`empty-${index}`} aria-hidden="true" />
            ))}
          </div>

          <div className="item-pagination">
            {[1, 2, 3, 4, 5].map((num) => <button key={num} type="button" className={num === page ? "is-active" : ""} onClick={() => setPage(num)}>{num}</button>)}
          </div>
        </section>

        <aside className="brand-panel item-list-page__side">
          <h2>오늘의 마켓</h2>
          <p className="brand-copy">게시판과 같은 디자인 언어를 유지하되 물품은 가격과 이미지가 먼저 보이도록 구성했습니다.</p>
          <div className="item-side-stat">
            <div><strong>{rows.length}</strong><span>현재 목록</span></div>
            <div><strong>{rows.reduce((sum, item) => sum + item.quantity, 0)}</strong><span>등록 수량</span></div>
          </div>
          <div className="item-side-list">
            <div className="brand-list-hover">전자기기 인기 물품 보기</div>
            <div className="brand-list-hover">오늘 새로 등록된 물품</div>
            <div className="brand-list-hover">안전거래 체크리스트</div>
            <div className="brand-list-hover">내 관심 물품 바로가기</div>
          </div>
        </aside>
      </section>
    </SiteShell>
  )
}

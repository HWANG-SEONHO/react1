/**
 * 파일명: ItemList.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 물품목록에서 복습할 핵심 흐름:
 *
 * 1) state(page, query, searchText)에 현재 화면 상태 저장
 * 2) useEffect가 page/searchText 변화를 감지
 * 3) axios GET으로 서버 목록 요청
 * 4) 응답을 normalizeItem()으로 화면용 구조로 통일
 * 5) rows를 map()으로 카드 반복 출력
 * 6) total / cnt로 전체 페이지 수 계산
 * 7) 검색하면 page를 1로 되돌리고 searchText 갱신
 *
 * 홈 검색과의 연결:
 * Home.jsx가 /item/list?text=노트북처럼 검색어를 넘기면
 * useLocation()으로 query string을 읽어 처음부터 해당 검색어로 조회한다.
 * 이름 구분: useState/useEffect/useMemo/useLocation/axios는 정해진 이름, rows/query/searchText/normalizeItem은 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 배경/카드/검색창/페이지버튼은 site-brand.css에서 관리한다.
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useLocation } from "react-router-dom"
import SiteShell from "../design/site/SiteShell"
import campusBg from "../assets/brand/item-campus.png"
import logoMark from "../assets/pknu-ai-mark-approved.png"

// ===== 수업 코드 1: 서버 물품 데이터를 화면에서 쓰기 쉬운 이름으로 통일 =====
const normalizeItem = (item, index) => ({
  id: item?._id ?? item?.id ?? item?.no ?? index,
  name: item?.name ?? "물품명 없음",
  price: Number(item?.price ?? 0),
  content: item?.content ?? "",
  quantity: Number(item?.quantity ?? 0),
  regdate: item?.regdate1 ?? item?.regdate ?? "",
  image: item?.img ?? item?.imageurl ?? item?.image ?? "",
})

// 화면에 페이지번호를 최대 5개만 보여주기 위한 계산 함수
const pageWindow = (page, pageCount) => {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const start = Math.min(Math.max(1, page - 2), pageCount - 4)
  return Array.from({ length: 5 }, (_, i) => start + i)
}

export default function ItemList() {
  const location = useLocation()

  // 홈 화면이 넘긴 ?text= 값을 처음 검색어로 사용한다.
  const initialText = new URLSearchParams(location.search).get("text")?.trim() ?? ""

  // ===== 수업 코드 2: 목록/검색/페이지 state =====
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState(initialText)      // input에 보이는 문자열
  const [searchText, setSearchText] = useState(initialText) // 실제 API에 사용하는 검색어
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const cnt = 8

  // 홈에서 다른 검색어로 다시 들어오는 경우 주소와 검색 state를 다시 맞춘다.
  useEffect(() => {
    const nextText = new URLSearchParams(location.search).get("text")?.trim() ?? ""
    setQuery(nextText)
    setSearchText(nextText)
    setPage(1)
  }, [location.search])

  // ===== 수업 코드 3: 물품목록 GET =====
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const url = `/api/item/selectlist.json?page=${page}&text=${encodeURIComponent(searchText)}&cnt=${cnt}`
        const { data } = await axios.get(url)
        if (cancelled) return

        // 현재 소스에서 확인되는 응답 후보(result / rows)를 모두 처리한다.
        const list = Array.isArray(data?.result)
          ? data.result
          : Array.isArray(data?.rows)
            ? data.rows
            : []

        setRows(list.map(normalizeItem))
        setTotal(Number(data?.total ?? list.length))
      } catch (error) {
        if (!cancelled) {
          console.error("물품목록 조회 실패", error)
          setRows([])
          setTotal(0)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    // 페이지를 떠난 뒤 늦게 도착한 응답이 state를 바꾸지 못하게 막는다.
    return () => { cancelled = true }
  }, [page, searchText])

  // ===== 수업 코드 4: 파생값 계산 =====
  const pageCount = Math.max(1, Math.ceil(total / cnt))
  const pages = useMemo(() => pageWindow(page, pageCount), [page, pageCount])

  // input값(query)을 실제 검색어(searchText)로 확정하는 시점
  const onSearch = (event) => {
    event.preventDefault()
    setPage(1)
    setSearchText(query.trim())
  }

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <SiteShell active="물품목록" background={campusBg} backgroundPosition="center center" veil="item" className="item-list-page">
      <section className="item-runtime-title item-runtime-title--list">
        <p className="item-runtime-title__eyebrow">PKNU CAMPUS MARKET</p>
        <h1>물품목록</h1>
        <p>등록된 물품을 검색하고 확인합니다.</p>
        <form className="brand-searchbar item-runtime-search" onSubmit={onSearch} role="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.2-4.2"/></svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="물품명으로 검색하세요." aria-label="물품 검색" />
          <button type="submit" className="item-search-highlight">검색</button>
        </form>
      </section>

      <section className="item-list-runtime" aria-label="물품 목록">
        <section className="item-runtime-panel item-list-runtime__main">
          <div className="item-runtime-panel__head">
            <div>
              <p>ITEM LIST</p>
              <h2>캠퍼스 물품</h2>
            </div>
            <span>{loading ? "불러오는 중" : `${page} / ${pageCount} 페이지`}</span>
          </div>

          <div className="item-runtime-grid">
            {rows.length === 0 && !loading ? (
              <div className="item-runtime-empty">표시할 물품이 없습니다.</div>
            ) : rows.map((item) => (
              <article className="item-runtime-card" key={item.id}>
                <div className="item-runtime-card__image">
                  <img src={item.image || logoMark} alt="" className={item.image ? "" : "is-fallback"} />
                </div>
                <div className="item-runtime-card__body">
                  <strong>{item.name}</strong>
                  <b>₩ {item.price.toLocaleString()}</b>
                  <div><span>수량 {item.quantity}</span><span>{item.regdate || "-"}</span></div>
                  {item.content && <p>{item.content}</p>}
                </div>
              </article>
            ))}
          </div>

          <div className="item-runtime-pagination" aria-label="물품목록 페이지">
            {pages.map((num) => (
              <button key={num} type="button" className={num === page ? "is-active" : ""} onClick={() => setPage(num)}>{num}</button>
            ))}
          </div>
        </section>

        <aside className="item-runtime-panel item-list-runtime__side">
          <p className="item-runtime-side__eyebrow">LIST STATUS</p>
          <h2>목록 정보</h2>
          <div className="item-runtime-stats">
            <div><strong>{total}</strong><span>전체 물품</span></div>
            <div><strong>{rows.length}</strong><span>현재 페이지</span></div>
          </div>
          <div className="item-runtime-summary">
            <div><span>페이지당 표시</span><strong>{cnt}개</strong></div>
            <div><span>검색어</span><strong>{searchText || "전체"}</strong></div>
          </div>
        </aside>
      </section>
    </SiteShell>
  )
}

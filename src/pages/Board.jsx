/**
 * 파일명: Board.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 게시판 핵심: 검색어/page state -> axios GET -> rows/total 저장 -> table map 출력.
 * 인기글은 전체 페이지 데이터를 모은 뒤 hit/views 기준으로 정렬해 TOP 10을 만든다.
 * useMemo는 페이지번호와 표시용 행처럼 state에서 계산 가능한 값을 재사용한다.
 * 이름 구분: useEffect/useMemo/useState/useNavigate는 라이브러리 이름, rows/popularRows/hitOf/menuItems는 이 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 게시판 전용 배경/헤더/좌측메뉴/목록/인기글 디자인은 main-hero.css가 담당한다.
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import BoardHeader from "../design/board/BoardHeader"
import { BoardTitleIcon, ChatIcon, IdeaIcon, ListIcon, NoticeIcon, QuestionIcon } from "../design/board/BoardIcons"
import heroImage from "../assets/main-hero.png"
import "../styles/main-hero.css"

// 디자인 전용 SVG는 BoardIcons.jsx로 분리했다. 이 파일에서는 게시판 기능 흐름만 따라간다.
const menuItems = [
  ["전체", ListIcon, "all", "/board"],
  ["자유게시판", ChatIcon, "free", "/board?section=free"],
  ["공지사항", NoticeIcon, "notice", "/board?section=notice"],
  ["Q&A", QuestionIcon, "qna", "/board?section=qna"],
  ["정보공유", IdeaIcon, "info", "/board?section=info"],
]

const medalEmoji = ["🥇", "🥈", "🥉"]

const authorOf = (item) => item?.writer ?? item?.userid ?? item?.name ?? item?.user ?? "-"
const dateOf = (item) => item?.regdate2 ?? item?.regdate ?? item?.date ?? "-"
const titleOf = (item) => item?.title ?? "(제목 없음)"
const idOf = (item, index = 0) => item?._id ?? item?.no ?? item?.id ?? index
const hitOf = (item) => Number(item?.hit ?? item?.views ?? 0)


export default function Board() {
  // ===== 학습용 1: URL + 화면 state =====
  const navigate = useNavigate()
  const location = useLocation()
  const activeSection = new URLSearchParams(location.search).get("section") ?? "all"
  const [text, setText] = useState("")
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const [cnt] = useState(10)
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [popularRows, setPopularRows] = useState([])

  // ===== 기타 연결: 게시판 전용 body 모드 =====
  useEffect(() => {
    document.body.classList.add("board-topbar-only-mode")
    return () => document.body.classList.remove("board-topbar-only-mode")
  }, [])

  // ===== 학습용 2: page/searchText가 바뀔 때 현재 게시글 목록 GET =====
  useEffect(() => {
    let cancelled = false

    const loadBoard = async () => {
      try {
        const url = `/api/board/select.json?page=${page}&text=${encodeURIComponent(searchText)}&cnt=${cnt}`
        const { data } = await axios.get(url)
        if (cancelled) return
        setRows(Array.isArray(data?.rows) ? data.rows : [])
        setTotal(Number(data?.total ?? 0))
      } catch (error) {
        if (cancelled) return
        console.error("게시판 목록 조회 실패", error)
        setRows([])
        setTotal(0)
      }
    }

    loadBoard()
    return () => { cancelled = true }
  }, [page, searchText, cnt])

  // ===== 학습용 3: 전체 게시글을 모아 조회수 TOP 10 계산 =====
  useEffect(() => {
    let cancelled = false

    const loadPopularAcrossAllPages = async () => {
      try {
        const requestedCnt = 100
        const firstUrl = `/api/board/select.json?page=1&text=&cnt=${requestedCnt}`
        const { data: firstData } = await axios.get(firstUrl)
        if (cancelled) return

        const firstRows = Array.isArray(firstData?.rows) ? firstData.rows : []
        const boardTotal = Number(firstData?.total ?? firstRows.length)

        // 서버가 cnt를 제한하는 경우 실제 응답 행 수를 페이지 크기로 사용한다.
        const effectiveCnt = boardTotal > firstRows.length && firstRows.length > 0 && firstRows.length < requestedCnt
          ? firstRows.length
          : requestedCnt
        const pageCountForPopular = Math.max(1, Math.ceil(boardTotal / effectiveCnt))

        let allRows = [...firstRows]
        if (pageCountForPopular > 1) {
          const rest = await Promise.all(
            Array.from({ length: pageCountForPopular - 1 }, (_, index) => {
              const p = index + 2
              return axios.get(`/api/board/select.json?page=${p}&text=&cnt=${effectiveCnt}`)
            }),
          )
          if (cancelled) return
          rest.forEach(({ data }) => {
            if (Array.isArray(data?.rows)) allRows.push(...data.rows)
          })
        }

        // 페이지별 순위가 아니라 전체 게시글을 합친 뒤 조회수 기준 TOP 10을 계산한다.
        allRows.sort((a, b) => hitOf(b) - hitOf(a))
        setPopularRows(allRows.slice(0, 10))
      } catch (error) {
        if (cancelled) return
        console.error("전체 인기글 조회 실패", error)
        setPopularRows([])
      }
    }

    loadPopularAcrossAllPages()
    return () => { cancelled = true }
  }, [])

  // ===== 학습용 4: 검색 submit -> 1페이지부터 다시 조회 =====
  const handleSearch = (event) => {
    event.preventDefault()
    setPage(1)
    setSearchText(text.trim())
  }

  // ===== 학습용 5: state에서 계산되는 페이지번호 / 표시행 =====
  const pageCount = Math.max(1, Math.ceil(total / cnt))
  const visiblePages = useMemo(() => {
    const start = Math.max(1, Math.min(page - 2, Math.max(1, pageCount - 4)))
    return Array.from({ length: Math.min(5, pageCount) }, (_, index) => start + index)
      .filter((value) => value <= pageCount)
  }, [page, pageCount])

  const displayRows = useMemo(() => {
    const normalized = rows.slice(0, 10).map((item, index) => ({ item, key: `row-${idOf(item, index)}`, placeholder: false }))
    while (normalized.length < 10) {
      normalized.push({ item: null, key: `placeholder-${normalized.length}`, placeholder: true })
    }
    return normalized
  }, [rows])

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <main className="board-header-only board-main-screen">
      <img
        className="board-main-screen__image"
        src={heroImage}
        alt="부경대학교 AI Campus 야간 메인 배경"
      />
      <div className="board-main-screen__shade" aria-hidden="true" />

      <div className="board-main-screen__header">
        <BoardHeader active="게시판" userLabel="로그인" unreadCount={0} />
      </div>

      <section className="board-main-hero" aria-labelledby="board-main-title">
        <p className="board-main-hero__eyebrow">AI · PEOPLE · TOMORROW</p>
        <h1 id="board-main-title">커뮤니티 게시판</h1>
        <p className="board-main-hero__copy">
          함께하는 이야기가, 더 나은 내일을 만듭니다.<br />
          부경대의 오늘이, 더 넓은 가능성의 미래로 이어집니다.
        </p>

        <form className="board-main-search" onSubmit={handleSearch} role="search">
          <svg className="board-main-search__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input
            type="search"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="게시글을 검색해보세요. (제목, 내용, 작성자)"
            aria-label="게시글 검색"
          />
          <button type="submit">검색</button>
        </form>
      </section>

      <aside className="board-side-panel" aria-label="게시판 메뉴">
        <div className="board-side-panel__title">
          <BoardTitleIcon />
          <h2>게시판</h2>
        </div>

        <nav className="board-side-panel__nav">
          {menuItems.map(([label, Icon, section, path]) => (
            <button
              key={label}
              type="button"
              className={`board-side-panel__item ${section === activeSection ? "is-active" : ""}`}
              onClick={() => navigate(path)}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="board-list-panel" aria-label="게시판 목록">
        <div className="board-list-panel__table-wrap">
          <table className="board-list-panel__table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map(({ item, key, placeholder }, index) => {
                if (placeholder) {
                  return <tr key={key} className="is-placeholder"><td colSpan="5">&nbsp;</td></tr>
                }

                const no = idOf(item, index)
                return (
                  <tr key={key} onClick={() => navigate(`/board/content?no=${no}`)}>
                    <td>{no}</td>
                    <td className="board-list-panel__title-cell">{titleOf(item)}</td>
                    <td>{authorOf(item)}</td>
                    <td>{dateOf(item)}</td>
                    <td>{hitOf(item)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="board-list-panel__footer">
          <div className="board-list-panel__pagination" aria-label="게시판 페이지">
            <button type="button" aria-label="이전 페이지" disabled={page <= 1} onClick={() => page > 1 && setPage(page - 1)}>‹</button>
            {visiblePages.map((p) => (
              <button key={p} type="button" className={p === page ? "is-active" : ""} onClick={() => setPage(p)}>{p}</button>
            ))}
            {pageCount > 5 && !visiblePages.includes(pageCount) && (
              <>
                <span>···</span>
                <button type="button" onClick={() => setPage(pageCount)}>{pageCount}</button>
              </>
            )}
            <button type="button" aria-label="다음 페이지" disabled={page >= pageCount} onClick={() => page < pageCount && setPage(page + 1)}>›</button>
          </div>
          <button type="button" className="board-list-panel__write" onClick={() => navigate('/board/write')}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>
            <span>글쓰기</span>
          </button>
        </div>
      </section>

      <aside className="board-popular-panel" aria-label="인기글 TOP 10">
        <div className="board-popular-panel__head">
          <h2><span className="board-popular-panel__fire">🔥</span> 인기글 TOP 10</h2>
        </div>

        <ol className="board-popular-panel__list">
          {Array.from({ length: 10 }, (_, index) => popularRows[index] ?? null).map((item, index) => (
            <li
              key={item ? `popular-${idOf(item, index)}` : `popular-empty-${index}`}
              className={`board-popular-panel__row ${item ? "" : "is-placeholder"}`}
              onClick={() => item && navigate(`/board/content?no=${idOf(item, index)}`)}
            >
              <span className={`board-popular-panel__rank ${index < 3 ? "is-medal" : "is-number"}`}>
                {index < 3 ? medalEmoji[index] : index + 1}
              </span>
              <span className="board-popular-panel__text">{item ? titleOf(item) : ""}</span>
              <span className="board-popular-panel__hit">{item ? hitOf(item) : ""}</span>
            </li>
          ))}
        </ol>
      </aside>
    </main>
  )
}

/**
 * 파일명: BoardContent.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 상세보기 흐름: URL의 ?no= 읽기 -> 상세 GET -> 화면 출력.
 * 이전/다음 글 번호는 전체 게시글 순서를 별도로 읽어 현재 글의 양옆 ID를 계산한다.
 * useMemo는 본문 줄바꿈 표시용 배열을 계산한다.
 * 이름 구분: useSearchParams/useMemo는 라이브러리 이름, normalizeDetail/idOf/detail은 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 상세 패널/메타정보/이전·다음/목록 버튼은 board-content.css에서 관리한다.
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useNavigate, useSearchParams } from "react-router-dom"
import BoardHeader from "../design/board/BoardHeader"
import { ArrowIcon, BoardIcon, CalendarIcon, EyeIcon, ListIcon, UserIcon } from "../design/board/BoardIcons"
import heroImage from "../assets/main-hero.png"
import "../styles/board-content.css"

// 디자인 전용 SVG는 BoardIcons.jsx로 분리했다.
const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== "")
const idOf = (item, index = 0) => firstDefined(item?._id, item?.no, item?.id, index)

const normalizeDetail = (data) => {
  const source = data?.result ?? data?.row ?? data?.item ?? data?.data ?? data ?? {}

  return {
    no: firstDefined(source?._id, source?.no, source?.id, data?.no, "-"),
    title: firstDefined(source?.title, "제목 없음"),
    writer: firstDefined(source?.writer, source?.userid, source?.name, source?.user, "-"),
    content: firstDefined(source?.content, source?.contents, source?.text, ""),
    date: firstDefined(source?.regdate2, source?.regdate, source?.date, source?.createdAt, "-"),
    hit: Number(firstDefined(source?.hit, source?.views, source?.view, 0)),
    prevNo: firstDefined(data?.prevNo, source?.prevNo, data?.prev, source?.prev, null),
    nextNo: firstDefined(data?.nextNo, source?.nextNo, data?.next, source?.next, null),
  }
}

async function fetchBoardOrder() {
  const requestedCnt = 100
  const { data: firstData } = await axios.get(`/api/board/select.json?page=1&text=&cnt=${requestedCnt}`)
  const firstRows = Array.isArray(firstData?.rows) ? firstData.rows : []
  const boardTotal = Number(firstData?.total ?? firstRows.length)

  const effectiveCnt = boardTotal > firstRows.length && firstRows.length > 0 && firstRows.length < requestedCnt
    ? firstRows.length
    : requestedCnt

  const pageCount = Math.max(1, Math.ceil(boardTotal / effectiveCnt))
  let allRows = [...firstRows]

  if (pageCount > 1) {
    const rest = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, index) => {
        const page = index + 2
        return axios.get(`/api/board/select.json?page=${page}&text=&cnt=${effectiveCnt}`)
      }),
    )
    rest.forEach(({ data }) => {
      if (Array.isArray(data?.rows)) allRows.push(...data.rows)
    })
  }

  return allRows.map((item, index) => String(idOf(item, index)))
}

export default function BoardContent() {
  // ===== 학습용 1: URL의 no + 상세 화면 state =====
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const no = searchParams.get("no")

  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ===== 기타 연결: 게시판 전용 body 모드 =====
  useEffect(() => {
    document.body.classList.add("board-topbar-only-mode")
    return () => document.body.classList.remove("board-topbar-only-mode")
  }, [])

  // ===== 학습용 2: URL no -> 상세 GET + 전체 순서로 이전/다음 계산 =====
  useEffect(() => {
    let cancelled = false

    const loadDetail = async () => {
      if (!no) {
        setDetail(null)
        setError("게시글 번호가 없습니다.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")

        const [{ data }, order] = await Promise.all([
          axios.get(`/api/board/selectonehit.json?no=${encodeURIComponent(no)}`),
          fetchBoardOrder(),
        ])
        if (cancelled) return

        const normalized = normalizeDetail(data)
        const currentNo = String(normalized.no)
        const currentIndex = order.findIndex((value) => value === currentNo)

        // 전체 목록에서 현재 글을 찾은 경우에는 목록 경계를 절대 우선한다.
        // 첫 글의 PREV / 마지막 글의 NEXT에서 서버가 잘못된 번호를 주더라도
        // 다시 fallback 하지 않아 존재하지 않는 글로 이동하는 오류가 생기지 않는다.
        const hasOrderPosition = currentIndex >= 0
        // 게시판 목록 자체가 최신글 → 오래된 글 순서다.
        // 따라서 "이전 글"은 목록에서 아래쪽(더 오래된 글), "다음 글"은 위쪽(더 최신 글)로 이동한다.
        const resolvedPrevNo = hasOrderPosition && currentIndex < order.length - 1 ? order[currentIndex + 1] : null
        const resolvedNextNo = hasOrderPosition && currentIndex > 0 ? order[currentIndex - 1] : null

        setDetail({
          ...normalized,
          prevNo: hasOrderPosition ? resolvedPrevNo : (normalized.prevNo ?? null),
          nextNo: hasOrderPosition ? resolvedNextNo : (normalized.nextNo ?? null),
        })
      } catch (err) {
        if (cancelled) return
        console.error("게시글 상세 조회 실패", err)
        setDetail(null)
        setError("게시글을 불러오지 못했습니다.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDetail()
    return () => { cancelled = true }
  }, [no])

  // ===== 학습용 3: 본문 줄바꿈 표시용 파생값 =====
  const bodyLines = useMemo(() => {
    if (!detail?.content) return [""]
    return String(detail.content).replace(/\r\n/g, "\n").split("\n")
  }, [detail])

  // ===== 학습용 4: 이전/다음 글 번호를 URL query로 전달 =====
  const moveTo = (targetNo) => {
    if (targetNo === undefined || targetNo === null || targetNo === "") return
    navigate(`/board/content?no=${targetNo}`)
  }

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <main className="board-content-page">
      <img
        className="board-content-page__image"
        src={heroImage}
        alt="부경대학교 AI Campus 야간 메인 배경"
      />
      <div className="board-content-page__shade" aria-hidden="true" />

      <div className="board-content-page__header">
        <BoardHeader active="게시판" userLabel="로그인" unreadCount={0} />
      </div>

      <section className="board-content-hero" aria-labelledby="board-content-hero-title">
        <p>AI · PEOPLE · TOMORROW</p>
        <h1 id="board-content-hero-title">게시글 상세보기</h1>
        <span>함께 나눈 이야기를 천천히 확인해보세요.</span>
      </section>

      <section className="board-content-panel" aria-live="polite">
        <div className="board-content-panel__topline">
          <div className="board-content-panel__heading">
            <span className="board-content-panel__heading-icon"><BoardIcon /></span>
            <div>
              <strong>게시글 상세보기</strong>
              <small>COMMUNITY BOARD</small>
            </div>
          </div>
          <div className="board-content-panel__crumb">게시판 <span>/</span> 상세보기</div>
        </div>

        {loading && (
          <div className="board-content-state">
            <span className="board-content-state__spinner" aria-hidden="true" />
            <strong>게시글을 불러오는 중입니다.</strong>
          </div>
        )}

        {!loading && error && (
          <div className="board-content-state board-content-state--error">
            <strong>{error}</strong>
            <button type="button" className="board-content-btn board-content-btn--primary" onClick={() => navigate("/board")}>
              <ListIcon />
              <span>목록으로</span>
            </button>
          </div>
        )}

        {!loading && !error && detail && (
          <>
            <article className="board-content-article">
              <header className="board-content-article__header">
                <div className="board-content-article__number">NO. {detail.no}</div>
                <h2>{detail.title}</h2>

                <div className="board-content-article__meta">
                  <span><UserIcon /> <b>작성자</b> {detail.writer}</span>
                  <span><CalendarIcon /> <b>작성일</b> {detail.date}</span>
                  <span><EyeIcon /> <b>조회수</b> {detail.hit}</span>
                </div>
              </header>

              <div className="board-content-article__body">
                {bodyLines.map((line, index) => (
                  <p key={`${index}-${line.slice(0, 12)}`}>{line || " "}</p>
                ))}
              </div>
            </article>

            <footer className="board-content-panel__footer">
              <div className="board-content-panel__pager">
                <button
                  type="button"
                  className="board-content-pager-btn"
                  disabled={detail.prevNo === undefined || detail.prevNo === null || detail.prevNo === ""}
                  onClick={() => moveTo(detail.prevNo)}
                >
                  <ArrowIcon direction="left" />
                  <span><small>PREV</small>이전 글</span>
                </button>

                <button
                  type="button"
                  className="board-content-pager-btn board-content-pager-btn--next"
                  disabled={detail.nextNo === undefined || detail.nextNo === null || detail.nextNo === ""}
                  onClick={() => moveTo(detail.nextNo)}
                >
                  <span><small>NEXT</small>다음 글</span>
                  <ArrowIcon direction="right" />
                </button>
              </div>

              <button type="button" className="board-content-btn board-content-btn--primary" onClick={() => navigate("/board")}>
                <ListIcon />
                <span>목록으로</span>
              </button>
            </footer>
          </>
        )}
      </section>
    </main>
  )
}

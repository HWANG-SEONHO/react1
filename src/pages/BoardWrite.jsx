/**
 * 파일명: BoardWrite.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * 글쓰기 흐름: title/writer/content state -> 빈 값 검사 -> axios POST
 * /api/board/insert.json -> 성공 시 navigate('/board').
 * form onSubmit에서 preventDefault()로 브라우저 기본 새로고침을 막는다.
 * 이름 구분: useState/useNavigate/axios는 라이브러리 이름, title/content/writer/handleInsert는 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 글쓰기 배경/입력폼/하이라이트 버튼은 board-write.css에서 관리한다.
 * =========================================================
 */

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import BoardHeader from "../design/board/BoardHeader"
import { BackIcon, BoardIcon, WriteIcon } from "../design/board/BoardIcons"
import heroImage from "../assets/main-hero.png"
import "../styles/board-write.css"

// 디자인 전용 SVG는 BoardIcons.jsx로 분리했다.
export default function BoardWrite() {
  // ===== 학습용 1: 입력값 + 요청상태 =====
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [writer, setWriter] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  // ===== 기타 연결: 게시판 전용 body 모드 =====
  useEffect(() => {
    document.body.classList.add("board-topbar-only-mode")
    return () => document.body.classList.remove("board-topbar-only-mode")
  }, [])

  // ===== 학습용 2: form submit -> 검증 -> POST -> 목록 이동 =====
  const handleInsert = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !writer.trim()) {
      setMessage("제목, 작성자, 내용을 모두 입력해주세요.")
      return
    }

    try {
      setSubmitting(true)
      setMessage("")

      const body = {
        title: title.trim(),
        content: content.trim(),
        writer: writer.trim(),
      }

      const { data } = await axios.post("/api/board/insert.json", body)

      if (Number(data?.status) === 200) {
        navigate("/board")
        return
      }

      setMessage("게시글 등록에 실패했습니다. 다시 확인해주세요.")
    } catch (error) {
      console.error("게시글 등록 실패", error)
      setMessage("게시글 등록 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <main className="board-write-page">
      <img
        className="board-write-page__image"
        src={heroImage}
        alt="부경대학교 AI Campus 야간 메인 배경"
      />
      <div className="board-write-page__shade" aria-hidden="true" />

      <div className="board-write-page__header">
        <BoardHeader active="게시판" userLabel="로그인" unreadCount={0} />
      </div>

      <section className="board-write-hero" aria-labelledby="board-write-title">
        <p>AI · PEOPLE · TOMORROW</p>
        <h1 id="board-write-title">새 이야기 작성</h1>
        <span>부경대 커뮤니티에 새로운 이야기를 남겨보세요.</span>
      </section>

      <form className="board-write-panel" onSubmit={handleInsert}>
        <div className="board-write-panel__topline">
          <div className="board-write-panel__heading">
            <span className="board-write-panel__heading-icon"><BoardIcon /></span>
            <div>
              <strong>게시글 작성</strong>
              <small>COMMUNITY BOARD</small>
            </div>
          </div>
          <div className="board-write-panel__crumb">게시판 <span>/</span> 새 글</div>
        </div>

        <div className="board-write-panel__form-grid">
          <label className="board-write-field board-write-field--title">
            <span className="board-write-field__label">제목</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요."
              autoFocus
            />
          </label>

          <label className="board-write-field board-write-field--writer">
            <span className="board-write-field__label">작성자</span>
            <input
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
              placeholder="작성자"
            />
          </label>

          <label className="board-write-field board-write-field--content">
            <span className="board-write-field__label">내용</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요."
            />
          </label>
        </div>

        <div className="board-write-panel__footer">
          <div className="board-write-panel__status" aria-live="polite">
            {message || "제목과 내용을 확인한 뒤 등록해주세요."}
          </div>

          <div className="board-write-panel__actions">
            <button
              type="button"
              className="board-write-btn board-write-btn--cancel"
              onClick={() => navigate("/board")}
            >
              <BackIcon />
              <span>취소</span>
            </button>
            <button
              type="submit"
              className="board-write-btn board-write-btn--submit"
              disabled={submitting}
            >
              <WriteIcon />
              <span>{submitting ? "등록 중" : "글쓰기"}</span>
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}

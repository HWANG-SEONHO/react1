import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import BoardHeader from "../design/board/BoardHeader"
import heroImage from "../src/assets/main-hero.png"
import "../styles/board-write.css"

function WriteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  )
}

function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  )
}

export default function BoardWrite() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [writer, setWriter] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    document.body.classList.add("board-topbar-only-mode")
    return () => document.body.classList.remove("board-topbar-only-mode")
  }, [])

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

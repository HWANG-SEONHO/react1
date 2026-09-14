import "../../styles/board-hero.css"
import boardMain from "../../assets/board-main-locked.png"

export default function BoardHero() {
  return (
    <section className="board-hero" aria-label="PKNU AI Campus 커뮤니티 메인 비주얼">
      {/* STAGE 3 LOCK: 승인된 100점 게시판 메인이미지를 원본 그대로 표시한다. */}
      <img
        className="board-hero__image"
        src={boardMain}
        alt="부경대학교 야경과 커뮤니티 그래픽"
      />
    </section>
  )
}

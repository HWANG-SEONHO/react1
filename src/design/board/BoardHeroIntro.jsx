
import "../../styles/board-main-stage.css"

export default function BoardHeroIntro(){
  return (
    <div className="board-hero-intro" aria-label="게시판 소개 및 검색">
      <div className="board-hero-intro__eyebrow">AI · PEOPLE · TOMORROW</div>
      <h1 className="board-hero-intro__title">커뮤니티 게시판</h1>
      <p className="board-hero-intro__text">함께하는 이야기가, 더 나은 내일을 만듭니다.</p>
      <p className="board-hero-intro__text">부경대의 오늘이, 더 넓은 가능성의 미래로 이어집니다.</p>
      <form className="board-hero-intro__search" onSubmit={(e)=>e.preventDefault()}>
        <input type="text" placeholder="게시글을 검색해보세요. (제목, 내용, 작성자)" aria-label="게시글 검색" />
        <button type="submit">검색</button>
      </form>
    </div>
  )
}

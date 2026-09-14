import "../../styles/board-rightbar.css"

const posts = [
  ["부경대 야경이 정말 예쁘네요 ✨", 320],
  ["AI 공모전 같이 나가실 분 모집합니다!", 156],
  ["유용한 AI 도구를 정리해봤어요", 612],
  ["파이썬 추천 강의 있을까요?", 278],
  ["도서관 스터디 같이 하실 분!", 198],
  ["오늘 캠퍼스 노을 최고였네요", 163],
  ["프론트엔드 포트폴리오 피드백 부탁드려요", 149],
  ["백엔드 세미나 참가 후기 공유", 131],
  ["이번 주 과제 같이 정리하실 분", 117],
  ["취업 준비 루틴 공유합니다", 104],
]

function FireIcon(){
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.1 2.8c.4 2.3-.8 3.7-1.8 4.9-1.1 1.4-2.1 2.6-1.7 4.8.2 1.4 1 2.6 2.2 3.4-2.8.1-5.5-1.9-5.8-5.4-.2-2.4.8-4.2 2.6-6.2.8-.9 1.7-1.9 2.4-3.2.6.3 1.5.9 2.1 1.7Zm2.3 4.4c3.3 2.2 5 5 5 8 0 4-3 6.8-7.2 6.8S5 19.2 5 15.5c0-1.6.6-3.3 1.7-4.7.2 4 2.6 5.8 5.2 5.8 2.8 0 4.6-1.8 4.6-4.4 0-1.8-.7-3.3-2.1-5Z"/>
  </svg>
}

export default function BoardRightbar(){
  return (
    <aside className="board-rightbar" aria-label="인기글">
      <div className="board-rightbar__header">
        <div className="board-rightbar__title-wrap">
          <FireIcon />
          <strong>인기글 TOP 10</strong>
        </div>
        <button type="button" className="board-rightbar__more">더보기</button>
      </div>

      <ol className="board-rightbar__list">
        {posts.map(([title, count], index) => {
          const rank = index + 1
          const medalClass = rank <= 3 ? `is-medal medal-${rank}` : ""
          return (
            <li key={title} className="board-rightbar__item">
              <span className={`board-rightbar__rank ${medalClass}`}>{rank}</span>
              <span className="board-rightbar__text">{title}</span>
              <span className="board-rightbar__count">{count}</span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}

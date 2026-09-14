import "../../styles/board-center.css"

const rows = [
  [125, "자유게시판", "부경대 야경이 정말 예쁘네요 ✨", "바다좋아", "2025.05.29", 320],
  [124, "정보공유", "AI 공모전 같이 나가실 분 모집합니다!", "AI러버", "2025.05.29", 156],
  [123, "Q&A", "파이썬 추천 강의 있을까요?", "코딩초보", "2025.05.28", 278],
  [122, "자유게시판", "도서관 스터디 같이 하실 분!", "부경인", "2025.05.27", 198],
  [121, "정보공유", "유용한 AI 도구를 정리해봤어요", "지식나눔", "2025.05.26", 612],
  [120, "자유게시판", "오늘 캠퍼스 노을 최고였네요", "달빛바다", "2025.05.26", 263],
]

export default function BoardCenterPanel(){
  return (
    <section className="board-center" aria-label="게시판 목록">
      <div className="board-center__table-wrap">
        <table className="board-center__table">
          <thead>
            <tr>
              <th>번호</th>
              <th>분류</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([num, category, title, writer, date, views]) => (
              <tr key={num}>
                <td>{num}</td>
                <td>{category}</td>
                <td className="board-center__subject">{title}</td>
                <td>{writer}</td>
                <td>{date}</td>
                <td>{views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="board-center__footer">
        <div className="board-center__pagination" aria-label="페이지 이동">
          <button type="button" aria-label="이전">‹</button>
          <button type="button" className="is-active">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button">4</button>
          <button type="button">5</button>
          <span>…</span>
          <button type="button">13</button>
          <button type="button" aria-label="다음">›</button>
        </div>

        <button type="button" className="board-center__write board-ui-highlight-btn">글쓰기</button>
      </div>
    </section>
  )
}

/**
 * [디자인 전용 아이콘]
 * 홈 빠른이동 버튼의 SVG만 담당한다.
 * navigate / 검색 / state 같은 학습 기능 로직은 넣지 않는다.
 */

export default function HomeActionIcon({ name }) {
  if (name === "insert") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 4.2h7.6L18.8 9v10a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 19V6a1.8 1.8 0 0 1 1-1.8Z" /><path d="M13.8 4.2V9h5" /><path d="M12 10.4v5.6M9.2 13.2h5.6" /></svg>
  }

  if (name === "items") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.6 7.2h14.8v10.6a1.8 1.8 0 0 1-1.8 1.8H6.4a1.8 1.8 0 0 1-1.8-1.8Z" /><path d="M8.4 7.2V5.8a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2v1.4M4.6 11.2h14.8" /></svg>
  }

  if (name === "board") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5.1h12a1.9 1.9 0 0 1 1.9 1.9v7a1.9 1.9 0 0 1-1.9 1.9h-7.2L6 19v-3.1A1.9 1.9 0 0 1 4.1 14V7A1.9 1.9 0 0 1 6 5.1Z" /><path d="M8.1 9.5h7.8M8.1 12.5h5.4" /></svg>
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 5h13A1.5 1.5 0 0 1 20 6.5v7A1.5 1.5 0 0 1 18.5 15H10l-4.5 3.5V15A1.5 1.5 0 0 1 4 13.5v-7A1.5 1.5 0 0 1 5.5 5Z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
}

import "../../styles/board-sidebar.css"

function ListIcon(){
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 6h11M8 12h11M8 18h11"/>
    <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>
  </svg>
}
function ChatBubbleIcon(){
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 5.8A2.8 2.8 0 0 1 6.8 3h10.4A2.8 2.8 0 0 1 20 5.8v6.4A2.8 2.8 0 0 1 17.2 15H10l-4.8 4v-4.3A2.8 2.8 0 0 1 4 12.2Z"/>
  </svg>
}
function QuestionIcon(){
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5"/>
    <path d="M9.8 9.5a2.35 2.35 0 0 1 4.5 1c0 1.85-2.3 2.1-2.3 3.55M12 17.35h.01"/>
  </svg>
}
function InfoIcon(){
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5"/>
    <path d="M12 10.6v5M12 7.5h.01"/>
  </svg>
}
function BoardTitleIcon(){
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2.6"/>
    <path d="M8 9h8M8 13h8M8 17h5"/>
  </svg>
}

const menuItems = [
  ["전체", ListIcon],
  ["자유게시판", ChatBubbleIcon],
  ["Q&A", QuestionIcon],
  ["정보공유", InfoIcon],
]

export default function BoardSidebar({ active="전체" }){
  return (
    <aside className="board-sidebar" aria-label="게시판 메뉴">
      <div className="board-sidebar__title">
        <BoardTitleIcon/>
        <strong>게시판</strong>
      </div>

      <div className="board-sidebar__menu">
        {menuItems.map(([label, Icon]) => (
          <button
            key={label}
            type="button"
            className={`board-sidebar__item ${label === active ? "is-active" : ""}`}
          >
            <Icon/>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

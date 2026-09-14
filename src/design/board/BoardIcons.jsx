/**
 * [디자인 전용 아이콘]
 * 게시판 페이지에서 쓰는 SVG 모양만 모아 둔다.
 * state / API / navigate 같은 학습 기능 로직은 넣지 않는다.
 */

export function ListIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></svg>
}

export function ChatIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.8A2.8 2.8 0 0 1 6.8 3h10.4A2.8 2.8 0 0 1 20 5.8v6.4a2.8 2.8 0 0 1-2.8 2.8H10l-4.8 4v-4.3A2.8 2.8 0 0 1 4 12.2Z" /></svg>
}

export function NoticeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12v-1.5c0-1 .6-1.9 1.5-2.3l8.5-3.7v15l-8.5-3.7A2.5 2.5 0 0 1 4 13.5Z" /><path d="M14 8h2.5a3.5 3.5 0 0 1 0 7H14" /></svg>
}

export function QuestionIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.6 9.2a2.5 2.5 0 1 1 3.8 2.1c-.9.5-1.4 1.1-1.4 2.2" /><path d="M12 17h.01" /></svg>
}

export function IdeaIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8.6 15.4c-1.2-1-2.1-2.6-2.1-4.4A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 17.5 11c0 1.8-.9 3.4-2.1 4.4-.7.6-1.1 1.2-1.3 1.9h-4.2c-.2-.7-.6-1.3-1.3-1.9Z" /></svg>
}

export function BoardIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>
}

export function BoardTitleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z" /><path d="M8 9h8M8 13h8M8 17h4" /></svg>
}

export function WriteIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>
}

export function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg>
}

export function ArrowIcon({ direction = "left" }) {
  const right = direction === "right"
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={right ? "M5 12h14" : "M19 12H5"} /><path d={right ? "m13 6 6 6-6 6" : "m11 18-6-6 6-6"} /></svg>
}

export function EyeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.6" /></svg>
}

export function UserIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></svg>
}

export function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2.2" /><path d="M8 3.5v4M16 3.5v4M4 10h16" /></svg>
}

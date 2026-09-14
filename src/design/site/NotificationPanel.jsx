/**
 * [공통 기능 + 디자인 컴포넌트]
 * 게시판 새 글과 MQTT 채팅 메시지를 공통 알림 저장소(localStorage)에 보관한다.
 * 어느 페이지에서 열어도 같은 저장소를 읽기 때문에 게시판/채팅 알림을 함께 보여준다.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { CHAT_RECV_TOPIC, CHAT_SEND_TOPIC, connectChatClient, senderFromTopic } from "../../utils/chat"
import "../../styles/notification-panel.css"

// ===== 공통 기능 1: 저장소 key / 최대 보관 개수 =====
const STORE_KEY = "pknuNotificationStoreV4"
const READ_KEY = "pknuNotificationReadV4"
const BOARD_SEEN_KEY = "pknuNotificationBoardSeenV4"
const MAX_NOTIFICATIONS = 80
const MAX_BOARD_SEEN = 500

// ===== 공통 기능 2: localStorage 읽기/쓰기 + 데이터 정규화 =====
const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== "")

function loadStoredItems() {
  if (typeof window === "undefined") return []
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORE_KEY) || "[]")
    return Array.isArray(saved)
      ? saved.filter((item) => item?.id && (item?.kind === "board" || item?.kind === "chat") && item?.title)
      : []
  } catch {
    return []
  }
}

function saveStoredItems(items) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORE_KEY, JSON.stringify(items.slice(0, MAX_NOTIFICATIONS)))
}

function loadReadIds() {
  if (typeof window === "undefined") return new Set()
  try {
    const saved = JSON.parse(window.localStorage.getItem(READ_KEY) || "[]")
    return new Set(Array.isArray(saved) ? saved.map(String) : [])
  } catch {
    return new Set()
  }
}

function saveReadIds(ids) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(READ_KEY, JSON.stringify([...ids]))
}

function hasBoardBaseline() {
  return typeof window !== "undefined" && window.localStorage.getItem(BOARD_SEEN_KEY) !== null
}

function loadBoardSeenIds() {
  if (typeof window === "undefined") return new Set()
  try {
    const saved = JSON.parse(window.localStorage.getItem(BOARD_SEEN_KEY) || "[]")
    return new Set(Array.isArray(saved) ? saved.map(String) : [])
  } catch {
    return new Set()
  }
}

function saveBoardSeenIds(ids) {
  if (typeof window === "undefined") return
  const values = [...ids].slice(-MAX_BOARD_SEEN)
  window.localStorage.setItem(BOARD_SEEN_KEY, JSON.stringify(values))
}

function boardIdOf(item, index = 0) {
  return String(firstDefined(item?._id, item?.no, item?.id, index))
}

function normalizeBoard(item, index) {
  const no = boardIdOf(item, index)
  const writer = firstDefined(item?.writer, item?.userid, item?.name, "작성자 미상")
  const date = firstDefined(item?.regdate2, item?.regdate, item?.date, "")

  return {
    id: `board:${no}`,
    type: "게시판",
    kind: "board",
    title: firstDefined(item?.title, "새 게시글"),
    meta: [writer, date].filter(Boolean).join(" · "),
    path: `/board/content?no=${encodeURIComponent(no)}`,
    createdAt: Date.now(),
  }
}

function normalizeChat(topic, payloadText, retained = false) {
  const text = String(payloadText || "").trim()
  const sender = topic === CHAT_SEND_TOPIC ? "나" : senderFromTopic(topic)
  const now = Date.now()
  const retainedId = `${topic}:${text}`.replace(/[^a-zA-Z0-9가-힣:_-]/g, "_").slice(0, 160)

  return {
    id: retained ? `chat:retained:${retainedId}` : `chat:${now}:${Math.random().toString(16).slice(2)}`,
    type: "채팅",
    kind: "chat",
    title: text || "새 채팅 메시지",
    meta: `${sender} · ${new Date(now).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`,
    path: "/chat",
    createdAt: now,
  }
}

function mergeItems(current, incoming) {
  const byId = new Map(current.map((item) => [String(item.id), item]))

  incoming.forEach((item) => {
    const key = String(item.id)
    if (!byId.has(key)) byId.set(key, item)
  })

  return [...byId.values()]
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
    .slice(0, MAX_NOTIFICATIONS)
}

// ===== 디자인 표시 1: 종류별 알림 목록 렌더링 =====
function NotificationGroup({ title, kind, items, readIds, onOpen }) {
  const unread = items.reduce((count, item) => count + (readIds.has(String(item.id)) ? 0 : 1), 0)

  return (
    <section className={`notification-group notification-group--${kind}`} aria-label={`${title} 알림`}>
      <div className="notification-group__head">
        <strong>{title}</strong>
        <span>{unread > 0 ? `새 알림 ${unread}` : "새 알림 없음"}</span>
      </div>

      <div className="notification-group__list">
        {items.length === 0 ? (
          <div className="notification-group__empty">표시할 {title} 알림이 없습니다.</div>
        ) : items.map((item) => {
          const isRead = readIds.has(String(item.id))
          return (
            <button
              key={item.id}
              type="button"
              className={`notification-item notification-item--${item.kind} ${isRead ? "is-read" : "is-unread"}`}
              onClick={() => onOpen(item)}
            >
              <span className="notification-item__dot" aria-hidden="true" />
              <span className="notification-item__body">
                <span className="notification-item__type">{item.type}</span>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

// ===== 공통 기능 3: 게시판 polling + MQTT 수신 + 읽음 처리 =====
export default function NotificationPanel({ open, onClose, onUnreadChange }) {
  const navigate = useNavigate()
  const panelRef = useRef(null)
  const [items, setItems] = useState(() => loadStoredItems())
  const [readIds, setReadIds] = useState(() => loadReadIds())
  const [boardLoading, setBoardLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let timer = null

    const loadBoardNotifications = async () => {
      try {
        const { data } = await axios.get("/api/board/select.json?page=1&text=&cnt=50")
        if (cancelled) return

        const rows = Array.isArray(data?.rows) ? data.rows : []
        const baselineReady = hasBoardBaseline()
        const seenIds = loadBoardSeenIds()
        const currentIds = rows.map((item, index) => boardIdOf(item, index))

        // 최초 실행은 현재 목록을 기준점으로만 저장한다. 기존 글 전체를 새 알림으로 만들지 않는다.
        if (!baselineReady) {
          saveBoardSeenIds(new Set(currentIds))
          return
        }

        const incoming = rows
          .map((item, index) => ({ item, id: boardIdOf(item, index), index }))
          .filter(({ id }) => !seenIds.has(id))
          .map(({ item, index }) => normalizeBoard(item, index))

        const nextSeen = new Set([...seenIds, ...currentIds])
        saveBoardSeenIds(nextSeen)

        if (incoming.length > 0) {
          setItems((prev) => {
            const next = mergeItems(prev, incoming)
            saveStoredItems(next)
            return next
          })
        }
      } catch (error) {
        if (!cancelled) console.error("게시판 알림 조회 실패", error)
      } finally {
        if (!cancelled) setBoardLoading(false)
      }
    }

    loadBoardNotifications()
    timer = window.setInterval(loadBoardNotifications, 15000)

    return () => {
      cancelled = true
      if (timer) window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const client = connectChatClient("pknu_notification")

    client.on("connect", () => {
      client.subscribe(CHAT_RECV_TOPIC, (error) => {
        if (error) console.error("채팅 알림 구독 실패", error)
      })
    })

    client.on("message", (topic, payload, packet) => {
      // 과거 retained 메시지만 제외하고, 테스트를 위해 내가 보낸 메시지도 알림에 포함한다.
      if (packet?.retain) return

      const text = payload.toString().trim()
      if (!text) return

      const notification = normalizeChat(topic, text, false)
      setItems((prev) => {
        const next = mergeItems(prev, [notification])
        saveStoredItems(next)
        return next
      })
    })

    client.on("error", (error) => {
      console.error("채팅 알림 연결 실패", error)
    })

    return () => client.end(true)
  }, [])

  const boardItems = useMemo(() => items.filter((item) => item.kind === "board"), [items])
  const chatItems = useMemo(() => items.filter((item) => item.kind === "chat"), [items])

  const unreadCount = useMemo(
    () => items.reduce((count, item) => count + (readIds.has(String(item.id)) ? 0 : 1), 0),
    [items, readIds],
  )

  useEffect(() => {
    onUnreadChange?.(unreadCount)
  }, [unreadCount, onUnreadChange])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.()
    }

    const onPointerDown = (event) => {
      const target = event.target
      if (panelRef.current?.contains(target)) return
      if (target?.closest?.(".site-brandbar__bell")) return
      onClose?.()
    }

    window.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open, onClose])

  const markRead = (id) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      next.add(String(id))
      saveReadIds(next)
      return next
    })
  }

  const markAllRead = () => {
    const next = new Set(readIds)
    items.forEach((item) => next.add(String(item.id)))
    saveReadIds(next)
    setReadIds(next)
  }

  const openNotification = (item) => {
    markRead(item.id)
    onClose?.()
    navigate(item.path)
  }

  if (!open) return null

  return (
    <div ref={panelRef} className="notification-popover" role="dialog" aria-label="알림 목록">
      <div className="notification-popover__head">
        <div>
          <strong>알림</strong>
          <span>{unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : "새 알림을 모두 확인했습니다."}</span>
        </div>
        <button type="button" onClick={markAllRead} disabled={!items.length || unreadCount === 0}>모두 읽음</button>
      </div>

      <div className="notification-popover__groups">
        {boardLoading && boardItems.length === 0 ? (
          <section className="notification-group notification-group--board">
            <div className="notification-group__head"><strong>게시판</strong><span>확인 중</span></div>
            <div className="notification-group__empty">게시판 새 글을 확인하는 중입니다.</div>
          </section>
        ) : (
          <NotificationGroup title="게시판" kind="board" items={boardItems} readIds={readIds} onOpen={openNotification} />
        )}

        <NotificationGroup title="채팅" kind="chat" items={chatItems} readIds={readIds} onOpen={openNotification} />
      </div>
    </div>
  )
}

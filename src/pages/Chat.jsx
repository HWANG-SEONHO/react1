/**
 * 파일명: Chat.jsx
 *
 * =========================================================
 * [수업 코드 영역]
 * MQTT 채팅 흐름:
 * connectChatClient() -> connect 이벤트 -> subscribe -> message 이벤트 수신
 * -> messages state 누적 -> submit 시 publish.
 *
 * clientRef는 MQTT client 객체를 렌더링과 무관하게 보관한다.
 * useEffect cleanup에서 client.end(true)를 호출해 페이지 이탈 시 연결을 정리한다.
 * 이름 구분: useRef/useEffect/useMemo는 React 이름, clientRef/messages/submit은 프로젝트에서 정한 이름이다.
 *
 * [디자인 영역]
 * 채팅 3개 패널/메시지/보내기 버튼/배경은 site-brand.css에서 관리한다.
 * =========================================================
 */

import { useEffect, useMemo, useRef, useState } from "react"
import SiteShell from "../design/site/SiteShell"
import campusBg from "../assets/brand/chat-campus.png"
import { CHAT_RECV_TOPIC, CHAT_SEND_TOPIC, connectChatClient, senderFromTopic } from "../utils/chat"

const MAX_MESSAGES = 100

export default function Chat() {
  // ===== 학습용 1: MQTT client 참조 + 화면 state =====
  const clientRef = useRef(null)
  const [status, setStatus] = useState("연결 중...")
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")

  // ===== 학습용 2: 연결 -> 구독 -> 메시지 수신 -> cleanup =====
  useEffect(() => {
    const client = connectChatClient("pknu_chat")
    clientRef.current = client

    client.on("connect", () => {
      setStatus("연결 성공")
      client.subscribe(CHAT_RECV_TOPIC, (error) => {
        if (error) setStatus("구독 실패")
      })
    })

    client.on("reconnect", () => setStatus("재연결 중..."))
    client.on("offline", () => setStatus("연결 끊김"))
    client.on("error", (error) => {
      console.error("채팅 연결 실패", error)
      setStatus("연결 실패")
    })

    client.on("message", (topic, payload) => {
      const text = payload.toString()
      const receivedAt = Date.now()
      const sender = topic === CHAT_SEND_TOPIC ? "나" : senderFromTopic(topic)

      setMessages((prev) => [
        ...prev,
        { id: `${receivedAt}-${Math.random().toString(16).slice(2)}`, topic, sender, text, me: topic === CHAT_SEND_TOPIC, receivedAt },
      ].slice(-MAX_MESSAGES))
    })

    return () => {
      clientRef.current = null
      client.end(true)
    }
  }, [])

  // ===== 학습용 3: state에서 계산되는 화면용 값 =====
  const connected = status === "연결 성공"
  const recentMessages = useMemo(() => messages.slice(-40), [messages])

  // ===== 학습용 4: form submit -> MQTT publish =====
  const submit = (event) => {
    event.preventDefault()
    const value = message.trim()
    const client = clientRef.current
    if (!client || !connected || !value) return

    client.publish(CHAT_SEND_TOPIC, value, (error) => {
      if (error) {
        console.error("채팅 전송 실패", error)
        setStatus("전송 실패")
        return
      }
      setMessage("")
    })
  }

  // =========================================================
  // [디자인 연결 영역]
  // =========================================================
  return (
    <SiteShell active="채팅" background={campusBg} veil="chat" userLabel="마이페이지" userRoute="/mypage?account=info" className="chat-brand-page">
      <section className="chat-brand-page__title">
        <div className="brand-heading">
          <div>
            <p className="brand-heading__eyebrow">CONNECTED CAMPUS</p>
            <h1>채팅</h1>
            <p>같은 채널에 접속한 사용자와 메시지를 주고받습니다.</p>
          </div>
        </div>
      </section>

      <section className="chat-brand-page__cockpit chat-brand-page__cockpit--real">
        <aside className="brand-panel chat-live-panel">
          <div className="brand-heading"><div><h2>채널</h2></div></div>
          <div className="chat-live-channel is-active">
            <span className="chat-avatar">303</span>
            <span>
              <strong>class303</strong>
              <small>공용 채팅 채널</small>
            </span>
          </div>
          <div className={`chat-connection-state ${connected ? "is-connected" : ""}`}>
            <span className="chat-connection-state__dot" />
            <div><strong>서버 상태</strong><span>{status}</span></div>
          </div>
        </aside>

        <section className="brand-panel chat-conversation">
          <div className="brand-heading">
            <div><p className="brand-heading__eyebrow">CAMPUS CHAT</p><h2>실시간 채팅</h2></div>
            <span className="brand-meta">{status}</span>
          </div>

          <div className="chat-messages chat-messages--real">
            {recentMessages.length === 0 ? (
              <div className="chat-empty">아직 수신된 메시지가 없습니다.</div>
            ) : recentMessages.map((item) => (
              <article className={`chat-message ${item.me ? "is-me" : ""}`} key={item.id}>
                <strong>{item.sender}</strong>
                <p>{item.text}</p>
                <small>{new Date(item.receivedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</small>
              </article>
            ))}
          </div>

          <form className="chat-composer" onSubmit={submit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={connected ? "메시지를 입력하세요." : "서버 연결 후 메시지를 보낼 수 있습니다."}
              disabled={!connected}
            />
            <button type="submit" className="brand-primary chat-send-highlight" disabled={!connected || !message.trim()}>보내기</button>
          </form>
        </section>

        <aside className="brand-panel chat-info-panel">
          <div className="brand-heading"><div><h2>연결 정보</h2></div></div>
          <dl className="chat-connection-info">
            <div><dt>수신 토픽</dt><dd>{CHAT_RECV_TOPIC}</dd></div>
            <div><dt>발신 토픽</dt><dd>{CHAT_SEND_TOPIC}</dd></div>
            <div><dt>수신 메시지</dt><dd>{messages.length}개</dd></div>
          </dl>
          <p className="chat-info-note">온라인 인원과 참여자 목록은 표시되지 않습니다.</p>
        </aside>
      </section>
    </SiteShell>
  )
}

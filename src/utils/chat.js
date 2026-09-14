/**
 * [수업 코드 영역 - MQTT 연결 유틸]
 * broker 주소와 토픽 이름, 연결 함수를 한 곳에 모아 Chat/NotificationPanel에서 공통 사용한다.
 */

import mqtt from "mqtt"

export const CHAT_BROKER_URL = "ws://ihongss.com:31884"
export const CHAT_RECV_TOPIC = "pknu/class303/#"
export const CHAT_SEND_TOPIC = "pknu/class303/uid_05"

export const CHAT_CONNECT_OPTIONS = {
  username: "aaa",
  password: "bbb",
}

export function connectChatClient(prefix = "pknu_web") {
  return mqtt.connect(CHAT_BROKER_URL, {
    ...CHAT_CONNECT_OPTIONS,
    clientId: `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
  })
}

export function senderFromTopic(topic = "") {
  const parts = String(topic).split("/").filter(Boolean)
  return parts.at(-1) || "채팅"
}

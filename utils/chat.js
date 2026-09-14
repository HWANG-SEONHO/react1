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

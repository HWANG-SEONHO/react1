const TOKEN_KEY = "TOKEN"
const LEGACY_TOKEN_KEY = "token"
const USER_KEY = "pknuUser"
const LOGIN_KEY = "isLogin"
const AUTH_EVENT = "pknu-auth-change"

function parseUser(value) {
  if (!value) return null
  try { return JSON.parse(value) } catch { return null }
}

function readStorage(storage) {
  if (!storage) return null
  const token = storage.getItem(TOKEN_KEY) || storage.getItem(LEGACY_TOKEN_KEY) || ""
  const user = parseUser(storage.getItem(USER_KEY))
  if (!token) return null
  return { token, user, loggedIn: true, storage }
}

export function getAuth() {
  if (typeof window === "undefined") return { token: "", user: null, loggedIn: false }
  return readStorage(window.localStorage)
    || readStorage(window.sessionStorage)
    || { token: "", user: null, loggedIn: false }
}

export function getAuthToken() {
  return getAuth().token || ""
}

export function saveAuth({ token = "", user = null } = {}, remember = false) {
  if (typeof window === "undefined") return false
  const cleanToken = String(token || "").trim()
  if (!cleanToken) return false

  clearAuth(false)
  const storage = remember ? window.localStorage : window.sessionStorage
  storage.setItem(TOKEN_KEY, cleanToken)
  storage.setItem(LOGIN_KEY, "true")
  if (user) storage.setItem(USER_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event(AUTH_EVENT))
  return true
}

export function clearAuth(notify = true) {
  if (typeof window === "undefined") return
  ;[window.localStorage, window.sessionStorage].forEach((storage) => {
    storage.removeItem(TOKEN_KEY)
    storage.removeItem(LEGACY_TOKEN_KEY)
    storage.removeItem(USER_KEY)
    storage.removeItem(LOGIN_KEY)
  })
  if (notify) window.dispatchEvent(new Event(AUTH_EVENT))
}

export function subscribeAuth(callback) {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(AUTH_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(AUTH_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

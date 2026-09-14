/**
 * [수업 코드 영역 - Redux 로그인 상태]
 * isLogin/token을 전역 state로 관리한다. 실제 브라우저 저장소와 Redux state를 함께 맞춘다.
 */

import { createSlice } from "@reduxjs/toolkit"

const TOKEN_KEY = "TOKEN"

const getInitialState = () => {
  if (typeof window === "undefined") return { isLogin: false, token: null }
  const token = window.sessionStorage.getItem(TOKEN_KEY) || window.localStorage.getItem(TOKEN_KEY)
  return { isLogin: Boolean(token), token: token || null }
}

export const loggedSlice = createSlice({
  name: "logged",
  initialState: getInitialState(),
  reducers: {
    login: (state, action) => {
      const token = action.payload?.token || ""
      const remember = Boolean(action.payload?.remember)
      state.token = token || null
      state.isLogin = Boolean(token)

      window.sessionStorage.removeItem(TOKEN_KEY)
      window.localStorage.removeItem(TOKEN_KEY)
      if (token) {
        const storage = remember ? window.localStorage : window.sessionStorage
        storage.setItem(TOKEN_KEY, token)
      }
    },
    logout: (state) => {
      state.token = null
      state.isLogin = false
      window.sessionStorage.removeItem(TOKEN_KEY)
      window.localStorage.removeItem(TOKEN_KEY)
    },
  },
})

export const { login, logout } = loggedSlice.actions
export default loggedSlice.reducer

/**
 * [수업 코드 영역 - Redux store]
 * logged reducer를 state.logged라는 이름으로 등록한다.
 */

// 파일명 : store.jsx
// 역할 : 여러 컴포넌트가 함께 사용할 Redux 상태들을 한 곳에 등록하는 공용 저장소
// 이름 구분 : configureStore/reducer는 Redux가 정한 이름, store/logged/loggedReducer는 프로젝트에서 정한 이름

import { configureStore } from "@reduxjs/toolkit";
import loggedReducer from "./reducers/loggedSlice";

// ===== 학습용 기능 영역 =====
// logged라는 이름으로 loggedSlice의 reducer를 등록한다.
// Provider가 이 store를 받으면 App 전체에서 state.logged로 접근할 수 있다.
export const store = configureStore({
    reducer: { logged: loggedReducer }
});

export default store;

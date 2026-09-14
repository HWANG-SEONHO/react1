// 파일명 : pages/mypage/ChangePW.jsx
// 학습 핵심 : useState -> input 연결 -> 유효성 검사 -> axios PUT -> 암호변경 API 연결
// 이름 구분 : useState/useRef/useSelector는 라이브러리 기능,
//             oldpw/newpw/newpw1, oldRef/newRef/new1Ref 등은 프로젝트에서 정한 변수명
// 기능 핵심 : 입력값이 비어 있거나 새 암호가 서로 다르면 API 호출 전에 return으로 중단
// API 핵심 : 현재 암호는 password, 변경 암호는 password1 이름으로 백엔드에 전달
// 디자인 핵심 : 회원정보 수정 화면과 같은 폼 폭/입력창/버튼 규격을 styles/design.css에서 공통 관리
// 추가 기능 : placeholder로 입력 안내문 표시, 취소 버튼을 누르면 입력값 전체 초기화

import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const ChangePW = () => {

    // ===== Redux 영역 =====
    // 로그인 정보에서 token만 가져옴
    const { token } = useSelector((state) => state.logged);

    // ===== ref 영역 =====
    // 유효성 검사 실패 시 해당 input으로 커서를 이동시키기 위해 사용
    const oldRef = useRef(null);
    const newRef = useRef(null);
    const new1Ref = useRef(null);

    // ===== state 영역 =====
    // 입력한 암호값을 각각 보관
    const [oldpw, setOldpw] = useState('');
    const [newpw, setNewpw] = useState('');
    const [newpw1, setNewpw1] = useState('');

    // ===== 암호변경 처리 =====
    const handleSubmit = async (e) => {

        // form의 기본 새로고침 기능 방지
        e.preventDefault();

        // ===== 유효성 검사 =====

        // 현재 암호가 비어 있는 경우
        if (oldpw.length <= 0) {
            alert('암호를 입력하세요.');
            oldRef.current.focus();
            return;
        }

        // 변경 암호가 비어 있는 경우
        if (newpw.length <= 0) {
            alert('변경 암호를 입력하세요.');
            newRef.current.focus();
            return;
        }

        // 변경 암호 확인이 비어 있는 경우
        if (newpw1.length <= 0) {
            alert('변경 암호를 한번 더 입력하세요.');
            new1Ref.current.focus();
            return;
        }

        // 변경 암호와 변경 암호 확인이 서로 다른 경우
        if (newpw !== newpw1) {
            alert('변경할 암호가 일치 하지 않습니다.');
            new1Ref.current.focus();
            return;
        }

        // ===== 백엔드 연동 =====

        // 암호변경 API 주소
        const url = `/api/member/updatepw.json`;

        // token 전달
        const headers = {
            "Authorization": `Bearer ${token}`
        };

        // 백엔드가 요구하는 변수명
        // password  = 현재 암호
        // password1 = 변경할 암호
        const body = {
            "password": oldpw,
            "password1": newpw
        };

        // PUT 방식으로 백엔드에 암호변경 요청
        const { data } = await axios.put(url, body, { headers });

        // 백엔드 결과 확인
        console.log(data);

        // 암호변경 성공
        if (data.status === 200) {
            alert('암호변경 되었습니다.');

            // 변경 성공 후 입력창 초기화
            setOldpw('');
            setNewpw('');
            setNewpw1('');
        }
    };

    // ===== 취소 버튼 =====
    // 입력된 암호값 3개를 모두 빈 문자열로 초기화
    const handleCancel = () => {
        setOldpw('');
        setNewpw('');
        setNewpw1('');

        // 초기화 후 현재암호 input으로 커서 이동
        oldRef.current.focus();
    };

    return (
        <div>
            {/* ===== 제목 영역 ===== */}
            <div className="mypage-sub-banner">
                <div className="mypage-sub-title">암호 변경</div>
                <div className="mypage-sub-description">회원님의 암호를 변경할 수 있습니다.</div>
            </div>

            {/* ===== 암호변경 Form : 정보변경 Form과 같은 폭/입력창 크기 ===== */}
            <form className="changepw-form" onSubmit={handleSubmit}>

                <div className="changepw-row">
                    <label htmlFor="oldpw">현재암호</label>
                    <input
                        id="oldpw"
                        type="password"
                        value={oldpw}
                        onChange={(e) => setOldpw(e.target.value)}
                        ref={oldRef}
                        placeholder="현재 암호를 입력하세요"
                        autoComplete="current-password"
                        autoFocus
                    />
                </div>

                <div className="changepw-row">
                    <label htmlFor="newpw">변경암호</label>
                    <input
                        id="newpw"
                        type="password"
                        value={newpw}
                        onChange={(e) => setNewpw(e.target.value)}
                        ref={newRef}
                        placeholder="새 암호를 입력하세요"
                        autoComplete="new-password"
                    />
                </div>

                <div className="changepw-row">
                    <label htmlFor="newpw1">변경암호확인</label>
                    <input
                        id="newpw1"
                        type="password"
                        value={newpw1}
                        onChange={(e) => setNewpw1(e.target.value)}
                        ref={new1Ref}
                        placeholder="새 암호를 한번 더 입력하세요"
                        autoComplete="new-password"
                    />
                </div>

                {/* 정보변경 화면과 같은 버튼 스타일 사용 */}
                <div className="changeinfo-actions">
                    <button type="submit" className="changeinfo-submit">암호변경</button>
                    <button type="button" className="changeinfo-cancel" onClick={handleCancel}>취소</button>
                </div>

            </form>
        </div>
    );
};

export default ChangePW;

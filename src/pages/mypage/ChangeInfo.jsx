// 파일명 : pages/mypage/ChangeInfo.jsx
// 학습 핵심 : Redux token 읽기 -> 회원정보 GET -> controlled input 수정 -> axios PUT -> 성공 Modal
// 이름 구분 : useSelector/useEffect/axios/Modal은 정해진 기능, name/age/email/handleData/handleUpdate는 내가 정한 이름
// 디자인 핵심 : 폼/버튼/팝업 모양은 styles/design.css에서 관리

import { Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ChangeInfo = () => {
    // ===== 학습용 기능 영역 1 : Redux 토큰 + 입력값 state =====
    const { token } = useSelector((state) => state.logged);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');

    // ===== 학습용 기능 영역 2 : 현재 회원정보 GET =====
    const handleData = async () => {
        const url = '/api/member/selectone.json';
        const headers = { "Authorization": `Bearer ${token}` };
        const { data } = await axios.get(url, { headers });
        console.log(data);

        setName(data.result.name);
        setAge(data.result.age);
        setEmail(data.result.email);
    };

    // ===== 학습용 기능 영역 3 : 수정된 회원정보 PUT =====
    const handleUpdate = async (e) => {
        e.preventDefault();

        const url = '/api/member/update.json';
        const headers = { "Authorization": `Bearer ${token}` };
        const body = { "name": name, "age": age, "email": email };
        const { data } = await axios.put(url, body, { headers });
        console.log(data);

        if (data.status === 200) {
            Modal.success({
                title: '회원정보 수정 완료',
                content: '회원정보가 정상적으로 변경되었습니다.',
                okText: '확인',
                centered: true,
                className: 'changeinfo-modal',
                okButtonProps: { className: 'modal-ok-button' }
            });
        }
    };

    // token이 준비되거나 바뀌면 현재 회원정보를 다시 가져온다.
    useEffect(() => { handleData(); }, [token]);

    // ===== 디자인/화면 영역 : 모양은 design.css =====
    return (
        <div>
            <div className="mypage-sub-banner">
                <div className="mypage-sub-title">회원 정보 수정</div>
                <div className="mypage-sub-description">회원님의 정보를 수정할 수 있습니다.</div>
            </div>

            <form className="changeinfo-form" onSubmit={handleUpdate}>
                <div className="changeinfo-row">
                    <label>이름</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                </div>
                <div className="changeinfo-row">
                    <label>나이</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
                <div className="changeinfo-row">
                    <label>이메일</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="changeinfo-actions">
                    <button type="submit" className="changeinfo-submit">수정하기</button>
                    <button type="button" className="changeinfo-cancel" onClick={handleData}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default ChangeInfo;

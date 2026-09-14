// 파일명 : pages/Logout.jsx
// 학습 핵심 : 화면 진입 -> useEffect 1회 -> 확인 시 dispatch(logout) -> sessionStorage TOKEN 삭제
// 디자인 핵심 : Modal/PageBanner 모양은 Ant Design + styles/design.css에서 관리

import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/loggedSlice.jsx';
import PageBanner from '../components/PageBanner';

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ===== 학습용 기능 영역 : Logout 페이지가 처음 열릴 때 1회 실행 =====
    useEffect(() => {
        Modal.confirm({
            title: '로그아웃', content: '로그아웃 할까요?', okText: '확인', cancelText: '취소', centered: true, className: 'logout-modal',
            okButtonProps: { className: 'modal-ok-button' }, cancelButtonProps: { className: 'modal-cancel-button' },
            // 확인 : Redux logout 실행 후 홈으로 이동
            onOk: () => { dispatch(logout()); navigate("/"); },
            // 취소 : 로그아웃하지 않고 직전에 보던 페이지로 돌아감
            onCancel: () => { navigate(-1); }
        });
    }, []);

    // ===== 디자인/화면 영역 =====
    return <div><PageBanner eyebrow="LOGOUT" title="PKNU AI Campus 로그아웃" description="로그아웃 화면입니다." /></div>;
};

export default Logout;

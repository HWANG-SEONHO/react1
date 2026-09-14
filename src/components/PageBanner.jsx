// 파일명 : components/PageBanner.jsx
// 디자인 전용 공통 컴포넌트 : 각 페이지 상단 배너 모양을 한 곳에서 재사용한다.
// API/state/navigate 같은 학습 기능은 없으므로 기능 복습 때는 이 파일을 건너뛰어도 된다.
// BorderBeam의 color/duration/size 같은 값은 이 디자인 전용 컴포넌트 안에서만 관리한다.

import React from 'react';
import { BorderBeam, Typography } from 'antd';

const PageBanner = ({ eyebrow, title, description }) => {
    return (
        <BorderBeam color={[{ color: "#1677ff", percent: 0 }, { color: "#69b1ff", percent: 55 }, { color: "#91caff", percent: 100 }]} duration={8} size={110} lineWidth={2} outset={0}>
            <div className="page-banner">
                <Typography.Text className="page-banner__eyebrow">{eyebrow}</Typography.Text>
                <Typography.Title level={2} className="page-banner__title">{title}</Typography.Title>
                <Typography.Text className="page-banner__description">{description}</Typography.Text>
            </div>
        </BorderBeam>
    );
};

export default PageBanner;

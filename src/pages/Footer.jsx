// 파일명 : pages/Footer.jsx
// 디자인 전용 공통 컴포넌트 : title prop으로 받은 문구만 Footer에 표시한다.
// 별도 state/API 기능이 없으므로 수업에서 기능 흐름을 볼 때는 건너뛰어도 된다.

import React from 'react';
import { Typography } from 'antd';

const Footer = ({ title }) => {
    return <footer className="site-footer"><Typography.Text className="site-footer__text">{title}</Typography.Text></footer>;
};

export default Footer;

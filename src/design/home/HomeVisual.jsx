// 디자인 전용 Home 화면
// - 사용자가 승인한 기존 홈 시안의 레이아웃을 그대로 기준으로 재구성한다.
// - 시안 스크린샷 자체를 통이미지로 사용하지 않고 실제 JSX/CSS 요소로 만든다.
// - 학습용 API/state 코드는 pages/Home.jsx에 남겨둔다.

import { Link } from 'react-router-dom';
import homeNight from '../../assets/board-campus-night.png';
import '../../styles/home.css';
import PknuAiLogo from './PknuAiLogo';

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.6" cy="10.6" r="6.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="m15.5 15.5 4.2 4.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
);

const BellIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.3 10.2a4.7 4.7 0 0 1 9.4 0v3.4l1.6 2.2H5.7l1.6-2.2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10.2 18.2c.4 1 1 1.5 1.8 1.5s1.4-.5 1.8-1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const QuickIcon = ({ type }) => {
    if (type === 'insert') {
        return (
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <defs>
                    <linearGradient id="homeIconInsert" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#e8ffff" />
                        <stop offset=".5" stopColor="#68d8ff" />
                        <stop offset="1" stopColor="#7180ff" />
                    </linearGradient>
                </defs>
                <path d="M14 20 31 12l19 8-18 9Z" fill="url(#homeIconInsert)" opacity=".96" />
                <path d="M14 20v22l18 9V29Z" fill="#71b9ff" opacity=".92" />
                <path d="M50 20v22l-18 9V29Z" fill="#b8f9ff" opacity=".9" />
                <path d="M32 29v22" stroke="#fff" strokeWidth="2" opacity=".85" />
            </svg>
        );
    }

    if (type === 'list') {
        return (
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <defs>
                    <linearGradient id="homeIconList" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#c9ffff" />
                        <stop offset=".55" stopColor="#67d6ff" />
                        <stop offset="1" stopColor="#6078ff" />
                    </linearGradient>
                </defs>
                <rect x="15" y="22" width="34" height="31" rx="8" fill="url(#homeIconList)" opacity=".95" />
                <path d="M22 22v-5c0-7 4-11 10-11s10 4 10 11v5" fill="none" stroke="#dfffff" strokeWidth="4" strokeLinecap="round" />
                <circle cx="32" cy="36" r="4" fill="#244ea9" opacity=".9" />
                <path d="M32 40v5" stroke="#244ea9" strokeWidth="3" strokeLinecap="round" />
            </svg>
        );
    }

    if (type === 'board') {
        return (
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <defs>
                    <linearGradient id="homeIconBoard" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#f2ffff" />
                        <stop offset=".48" stopColor="#76ddff" />
                        <stop offset="1" stopColor="#7282ff" />
                    </linearGradient>
                </defs>
                <path d="M10 15h44a6 6 0 0 1 6 6v27a6 6 0 0 1-6 6H30l-10 6 2-6H10a6 6 0 0 1-6-6V21a6 6 0 0 1 6-6Z" fill="url(#homeIconBoard)" opacity=".94" />
                <path d="M17 29h30M17 38h22" stroke="#315bb8" strokeWidth="3" strokeLinecap="round" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
            <defs>
                <linearGradient id="homeIconMy" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#edffff" />
                    <stop offset=".5" stopColor="#72dcff" />
                    <stop offset="1" stopColor="#6b7cff" />
                </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="10" fill="url(#homeIconMy)" />
            <circle cx="42" cy="24" r="10" fill="url(#homeIconMy)" opacity=".94" />
            <path d="M7 54c2-12 8-18 17-18s15 6 17 18" fill="url(#homeIconMy)" opacity=".95" />
            <path d="M27 54c2-12 7-18 15-18 9 0 14 6 15 18" fill="url(#homeIconMy)" opacity=".9" />
        </svg>
    );
};

const HomeVisual = ({ itemCount = 0 }) => {
    const itemSubtitle = itemCount > 0 ? `최신 물품 ${itemCount}개 확인` : '필요한 것을 한 곳에서';

    return (
        <section className="home-hero-page" aria-label="PKNU AI Campus 홈">
            <div className="home-hero-page__canvas">
                <img className="home-hero-page__backdrop" src={homeNight} alt="부경대학교 야간 캠퍼스와 수변 야경" />
                <div className="home-hero-page__shade" aria-hidden="true" />

                {/* ===== 디자인 영역 1 : 시안과 같은 가로형 상단 메뉴 ===== */}
                <header className="home-topbar">
                    <Link to="/" className="home-topbar__brand" aria-label="홈으로 이동">
                        <PknuAiLogo compact />
                    </Link>

                    <nav className="home-topbar__nav" aria-label="주요 메뉴">
                        <Link to="/" className="home-topbar__nav-link home-topbar__nav-link--active">홈</Link>
                        <Link to="/item/list" className="home-topbar__nav-link">물품거래</Link>
                        <Link to="/board" className="home-topbar__nav-link">게시판</Link>
                        <Link to="/chat" className="home-topbar__nav-link">채팅</Link>
                        <Link to="/mypage" className="home-topbar__nav-link">마이페이지</Link>
                    </nav>

                    <div className="home-topbar__mini-search" aria-hidden="true">
                        <SearchIcon />
                        <span>무엇을 찾고 계신가요?</span>
                    </div>

                    <div className="home-topbar__actions">
                        <Link to="/login" className="home-mini-button home-mini-button--login">로그인</Link>
                        <Link to="/join" className="home-mini-button home-mini-button--join">회원가입</Link>
                    </div>
                </header>

                {/* ===== 디자인 영역 2 : 메인 카피 ===== */}
                <div className="home-copy">
                    <h1>
                        AI와 함께,<br />
                        더 넓은 가능성의<br />
                        미래를 열어갑니다.
                    </h1>
                    <p className="home-copy__eyebrow">PKNU AI CAMPUS</p>
                    <p className="home-copy__sub">PEOPLE × AI × A BRIGHTER TOMORROW</p>
                </div>

                {/* ===== 디자인 영역 3 : 흰색 검색창 + 한 바퀴 네온 테두리 ===== */}
                <form className="home-search" onSubmit={(event) => event.preventDefault()}>
                    <span className="home-search__icon" aria-hidden="true"><SearchIcon /></span>
                    <input aria-label="물품 검색" placeholder="무엇을 찾고 계신가요?" />
                    <Link to="/item/list" className="home-search__go" aria-label="물품목록으로 이동">→</Link>
                </form>

                {/* ===== 디자인 영역 4 : 승인 시안 그대로 하단 4개 카드 ===== */}
                <div className="home-quick-grid">
                    <Link to="/item/insert" className="home-quick-card">
                        <span className="home-quick-card__icon"><QuickIcon type="insert" /></span>
                        <strong>물품등록</strong>
                        <small>나눔으로 이어지는 대학</small>
                    </Link>

                    <Link to="/item/list" className="home-quick-card">
                        <span className="home-quick-card__icon"><QuickIcon type="list" /></span>
                        <strong>물품목록</strong>
                        <small>{itemSubtitle}</small>
                    </Link>

                    <Link to="/board" className="home-quick-card">
                        <span className="home-quick-card__icon"><QuickIcon type="board" /></span>
                        <strong>커뮤니티</strong>
                        <small>함께하는 이야기</small>
                    </Link>

                    <Link to="/mypage" className="home-quick-card">
                        <span className="home-quick-card__icon"><QuickIcon type="mypage" /></span>
                        <strong>마이페이지</strong>
                        <small>나의 활동과 성장</small>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeVisual;

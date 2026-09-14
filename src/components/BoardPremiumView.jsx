import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/board-premium-vnext.css';
import boardBg from '../assets/board-campus-night.png';
import boardHeroArt from '../assets/board-main-locked.png';
import boardLogo from '../assets/board-logo-lock.png';

const Icon = ({ name }) => {
  const common = { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/></>,
    box: <><path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z"/><path d="M4 7.5V17l8 4 8-4V7.5"/><path d="M12 12v9"/></>,
    board: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    chat: <><path d="M4 5.5h16v11H9l-5 4v-15Z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    pencil: <><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/><path d="m13.5 7 3.5 3.5"/></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></>,
    question: <><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 1 1 4.5 1.5c-.9 1-2.2 1.2-2.2 2.8"/><path d="M12 17h.01"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

const rankColors = ['#ffd54a','#69e4ff','#ff73c8','#9d8cff','#55e6a5','#ff9b56','#71b8ff','#d88cff','#65efcc','#d5defa'];

const BoardPremiumView = ({
  rows = [],
  total = 0,
  page = 1,
  pageSize = 10,
  text = '',
  onTextChange,
  onSearch,
  onPage,
  onOpen,
  popularRows = [],
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visiblePages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.min(Math.max(1, page - 2), Math.max(1, totalPages - 4));
    return start + i;
  });

  return (
    <div className="pknu-board-page">
      <section className="pknu-board-frame" style={{ '--board-bg': `url(${boardBg})` }}>
        <div className="pknu-board-frame__scene" aria-hidden="true" />
        <div className="pknu-board-frame__lowerShade" aria-hidden="true" />
        <div className="pknu-board-heroArt" style={{ '--board-art': `url(${boardHeroArt})` }} aria-hidden="true" />

        <header className="pknu-board-header">
          <Link to="/" className="pknu-board-brand" aria-label="홈으로 이동">
            <img src={boardLogo} alt="PKNU AI Campus" />
          </Link>

          <nav className="pknu-board-topnav" aria-label="주요 메뉴">
            <Link to="/" className="pknu-board-topnav__item"><Icon name="home"/><span>홈</span></Link>
            <Link to="/item/list" className="pknu-board-topnav__item"><Icon name="box"/><span>물품목록</span></Link>
            <Link to="/board" className="pknu-board-topnav__item is-active"><Icon name="board"/><span>게시판</span></Link>
            <Link to="/chat" className="pknu-board-topnav__item"><Icon name="chat"/><span>채팅</span></Link>
          </nav>

          <div className="pknu-board-headerRight">
            <button className="pknu-board-notice" type="button" aria-label="알림">
              <Icon name="bell"/><span className="pknu-board-notice__badge">3</span>
            </button>
            <Link to="/mypage" className="pknu-board-profile">
              <span className="pknu-board-profile__avatar">P</span>
              <span className="pknu-board-profile__label">마이페이지</span>
            </Link>
          </div>
        </header>

        <section className="pknu-board-hero">
          <div className="pknu-board-hero__copy">
            <span className="pknu-board-hero__eyebrow">AI · PEOPLE · TOMORROW</span>
            <h1>커뮤니티 게시판</h1>
            <p>함께하는 이야기가, 더 나은 내일을 만듭니다.<br/>부경대의 오늘이, 더 넓은 가능성의 미래로 이어집니다.</p>
          </div>

          <form className="pknu-board-search" onSubmit={onSearch}>
            <span className="pknu-board-search__icon"><Icon name="search"/></span>
            <input value={text} onChange={onTextChange} placeholder="게시글을 검색해보세요. (제목, 내용, 작성자)" />
            <button type="submit">검색</button>
          </form>
        </section>

        <main className="pknu-board-layout">
          <aside className="pknu-board-side pknu-board-side--left">
            <div className="pknu-board-side__title"><Icon name="board"/><span>게시판</span></div>
            <button className="pknu-board-side__item is-active" type="button"><Icon name="list"/><span>전체</span></button>
            <button className="pknu-board-side__item" type="button"><Icon name="chat"/><span>자유게시판</span></button>
            <button className="pknu-board-side__item" type="button"><Icon name="question"/><span>Q&amp;A</span></button>
            <button className="pknu-board-side__item" type="button"><Icon name="info"/><span>정보공유</span></button>
          </aside>

          <section className="pknu-board-center">
            <div className="pknu-board-center__toolbar">
              <div className="pknu-board-tabs" aria-label="게시판 분류">
                <button className="pknu-board-tab is-active" type="button">전체 ({total})</button>
                <button className="pknu-board-tab" type="button">자유게시판</button>
                <button className="pknu-board-tab" type="button">Q&amp;A</button>
                <button className="pknu-board-tab" type="button">정보공유</button>
              </div>
              <Link to="/board/write" className="pknu-board-write"><Icon name="pencil"/><span>글쓰기</span></Link>
            </div>

            <div className="pknu-board-tableWrap">
              <table className="pknu-board-table">
                <thead>
                  <tr><th className="no">번호</th><th>제목</th><th className="writer">작성자</th><th className="date">작성일</th><th className="hit">조회수</th></tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item._id} onClick={() => onOpen(item._id)}>
                      <td>{item._id}</td>
                      <td className="title">{item.title}</td>
                      <td>{item.writer ?? '-'}</td>
                      <td>{item.regdate2}</td>
                      <td>{item.hit}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr className="empty"><td colSpan="5">게시글을 불러오는 중입니다.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="pknu-board-pagination" aria-label="페이지 이동">
              <button type="button" onClick={() => page > 1 && onPage(page - 1, pageSize)} disabled={page <= 1}><Icon name="chevronLeft"/></button>
              {visiblePages.map((n) => <button type="button" key={n} className={n === page ? 'is-active' : ''} onClick={() => onPage(n, pageSize)}>{n}</button>)}
              {totalPages > 6 && <span>···</span>}
              {totalPages > 5 && !visiblePages.includes(totalPages) && <button type="button" onClick={() => onPage(totalPages, pageSize)}>{totalPages}</button>}
              <button type="button" onClick={() => page < totalPages && onPage(page + 1, pageSize)} disabled={page >= totalPages}><Icon name="chevronRight"/></button>
            </div>
          </section>

          <aside className="pknu-board-side pknu-board-side--right">
            <div className="pknu-board-popularTitle"><span>🔥</span><strong>인기글 TOP 10</strong></div>
            <ol className="pknu-board-popular">
              {popularRows.slice(0, 10).map((item, idx) => (
                <li key={`${item._id}-${idx}`} onClick={() => onOpen(item._id)}>
                  <span className="rank" style={{ color: rankColors[idx] }}>{idx + 1}</span>
                  <span className="popular-title">{item.title}</span>
                  <span className="popular-hit">{item.hit}</span>
                </li>
              ))}
            </ol>
          </aside>
        </main>
      </section>
    </div>
  );
};

export default BoardPremiumView;

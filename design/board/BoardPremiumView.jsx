import React from 'react';
import { Link } from 'react-router-dom';
import logoMark from '../../src/assets/pknu-ai-logo-mark.png';
import mainImage from '../../assets/board-main-locked.png';
import './board-premium.css';

const Icon = ({ name, size = 22 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 7 8 4 8-4"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></>,
    board: <><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    chat: <><path d="M21 14a4 4 0 0 1-4 4H9l-5 3 1.4-4.1A7 7 0 1 1 21 14Z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    file: <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></>,
    bubble: <><path d="M21 12a8 8 0 0 1-8 8H7l-4 2 1.3-4A8 8 0 1 1 21 12Z"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    pen: <><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/><path d="m13.5 7 3.5 3.5"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
  };
  return <svg {...common}>{paths[name] ?? null}</svg>;
};

const leftMenus = [
  ['전체', 'file'],
  ['자유게시판', 'bubble'],
  ['Q&A', 'info'],
  ['정보공유', 'board'],
];

const rankClass = (index) => {
  if (index === 0) return 'is-gold';
  if (index === 1) return 'is-silver';
  if (index === 2) return 'is-bronze';
  return 'is-neutral';
};

const BoardPremiumView = ({ rows, total, page, pageSize, text, popularRows, onTextChange, onSearch, onPage, onOpen }) => {
  const maxPage = Math.max(1, Math.ceil(Number(total || 0) / Number(pageSize || 10)));
  const pageList = [];
  const start = Math.max(1, Math.min(page - 2, maxPage - 4));
  for (let i = start; i <= Math.min(maxPage, start + 4); i += 1) pageList.push(i);

  return (
    <div className="board-page">
      <section className="board-stage" style={{ '--board-main-image': `url("${mainImage}")` }}>
        <header className="board-topbar">
          <Link to="/" className="board-brand" aria-label="PKNU AI Campus 홈">
            <img src={logoMark} className="board-brand__mark" alt="" />
            <span className="board-brand__copy">
              <strong>PKNU AI Campus</strong>
              <small>AI · PEOPLE · TOMORROW</small>
            </span>
          </Link>

          <nav className="board-topnav" aria-label="주요 메뉴">
            <Link to="/" className="board-topnav__item"><Icon name="home" />홈</Link>
            <Link to="/item/list" className="board-topnav__item"><Icon name="box" />물품목록</Link>
            <Link to="/board" className="board-topnav__item is-active"><Icon name="board" />게시판</Link>
            <Link to="/chat" className="board-topnav__item"><Icon name="chat" />채팅</Link>
          </nav>

          <div className="board-topbar__actions">
            <button className="board-bell" type="button" aria-label="알림"><Icon name="bell" /><span className="board-bell__dot" /></button>
            <Link to="/mypage" className="board-profile"><span className="board-profile__avatar">P</span><span>마이페이지</span></Link>
          </div>
        </header>

        <div className="board-hero" aria-label="커뮤니티 게시판 메인 이미지">
          <div className="board-hero__title">
            <span>AI · PEOPLE · TOMORROW</span>
            <h1>커뮤니티 게시판</h1>
            <p>함께하는 이야기가, 더 나은 내일을 만듭니다.<br />부경대의 오늘이, 더 넓은 가능성의 미래로 이어집니다.</p>
          </div>

          <form className="board-search" onSubmit={onSearch}>
            <Icon name="search" size={24} />
            <input value={text} onChange={onTextChange} placeholder="게시글을 검색해보세요. (제목, 내용, 작성자)" />
            <button type="submit" className="premium-action premium-action--search">검색</button>
          </form>
        </div>

        <div className="board-body">
          <aside className="board-side board-side--left">
            <div className="board-side__heading"><Icon name="board" /><strong>게시판</strong></div>
            <div className="board-leftmenu">
              {leftMenus.map(([label, icon], index) => (
                <button key={label} type="button" className={`board-leftmenu__item${index === 0 ? ' is-active' : ''}`} aria-pressed={index === 0}>
                  <Icon name={icon} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="board-center">
            <div className="board-tableWrap">
              <table className="board-table">
                <thead>
                  <tr>
                    <th className="col-no">번호</th>
                    <th>제목</th>
                    <th className="col-writer">작성자</th>
                    <th className="col-date">작성일</th>
                    <th className="col-hit">조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length > 0 ? rows.map((item) => (
                    <tr key={item._id} onClick={() => onOpen(item._id)}>
                      <td>{item._id}</td>
                      <td className="board-table__title">{item.title}</td>
                      <td>{item.writer ?? item.name ?? '-'}</td>
                      <td>{item.regdate2 ?? item.regdate ?? '-'}</td>
                      <td>{item.hit ?? 0}</td>
                    </tr>
                  )) : (
                    <tr className="board-table__empty"><td colSpan="5">게시글을 불러오는 중입니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="board-center__bottom">
              <div className="board-pagination" aria-label="게시판 페이지 이동">
                <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="이전 페이지"><span>‹</span></button>
                {pageList.map((p) => <button type="button" key={p} className={p === page ? 'is-active' : ''} onClick={() => onPage(p)}>{p}</button>)}
                {maxPage > 6 && pageList[pageList.length - 1] < maxPage - 1 && <span className="board-pagination__dots">…</span>}
                {maxPage > 5 && pageList[pageList.length - 1] < maxPage && <button type="button" onClick={() => onPage(maxPage)}>{maxPage}</button>}
                <button type="button" disabled={page >= maxPage} onClick={() => onPage(page + 1)} aria-label="다음 페이지"><span>›</span></button>
              </div>
              <Link to="/board/write" className="premium-action premium-action--write"><Icon name="pen" size={21} />글쓰기</Link>
            </div>
          </main>

          <aside className="board-side board-side--right">
            <div className="board-popular__heading"><span className="board-fire">🔥</span><strong>인기글 TOP 10</strong></div>
            <ol className="board-popular">
              {popularRows.map((item, index) => (
                <li key={`${item._id}-${index}`} onClick={() => onOpen(item._id)}>
                  <span className={`board-rank ${rankClass(index)}`}>{index + 1}</span>
                  <span className="board-popular__title">{item.title}</span>
                  <span className="board-popular__hit">{item.hit ?? 0}</span>
                </li>
              ))}
              {popularRows.length === 0 && <li className="board-popular__empty">인기글을 불러오는 중입니다.</li>}
            </ol>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default BoardPremiumView;

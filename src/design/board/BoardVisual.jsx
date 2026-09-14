// 게시판 디자인 전용 컴포넌트
// 서버조회/페이지이동 같은 학습 기능은 pages/Board.jsx에 남기고, 이 파일은 화면만 담당한다.

import React from 'react';
import logoMark from '../../assets/pknu-ai-logo-mark.png';
import campusNight from '../../assets/board-campus-night.png';

const Icon = ({ name, size = 22 }) => {
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></>,
    board: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 8h10M7 12h7M7 16h9"/></>,
    chat: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.6-4.8A7 7 0 0 1 3 13V9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6Z"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    write: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    free: <path d="M4 5h16v11H9l-5 4Z"/>,
    qa: <><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.6 2.6 0 1 1 3.7 2.4c-.9.4-1.4 1-1.4 2.1"/><path d="M12 17h.01"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7h.01"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></>,
  };
  return <svg className="bp-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const NeonButton = ({ children, onClick, className = '', icon, locked = false }) => (
  <button type="button" onClick={onClick} className={`bp-btn ${locked ? 'bp-btn--locked' : 'bp-btn--motion'} ${className}`}>
    {icon && <Icon name={icon} size={20} />}
    <span>{children}</span>
  </button>
);

const authorOf = (item) => item?.writer ?? item?.userid ?? item?.name ?? item?.user ?? '-';
const dateOf = (item) => item?.regdate2 ?? item?.regdate ?? item?.date ?? '-';
const titleOf = (item) => item?.title ?? '(제목 없음)';
const idOf = (item, index) => item?._id ?? item?.no ?? index;
const hitOf = (item) => Number(item?.hit ?? 0);
const noticeOf = (item) => item?.notice === true || item?.isNotice === true || item?.notice === 1;

const BoardVisual = ({
  page, cnt, total, rows, popularRows, text,
  onTextChange, onSearch, onPageChange, onOpenContent, onWrite,
  onHome, onItems, onChat, onMyPage,
}) => {
  const pageCount = Math.max(1, Math.ceil(total / cnt));
  const visiblePages = [];
  const start = Math.max(1, Math.min(page - 2, Math.max(1, pageCount - 4)));
  for (let p = start; p <= Math.min(pageCount, start + 4); p += 1) visiblePages.push(p);

  const submitSearch = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="board-premium-page">
      <section className="bp-frame">
        <img className="bp-stage-image" src={campusNight} alt="부경대학교 야간 캠퍼스와 수변 광장" />
        <div className="bp-stage-tint" />

        <header className="bp-header">
          <button className="bp-brand" type="button" onClick={onHome} aria-label="홈으로 이동">
            <img src={logoMark} alt="" className="bp-brand__mark" />
            <span className="bp-brand__text"><strong>PKNU AI Campus</strong><small>AI · PEOPLE · TOMORROW</small></span>
          </button>

          <nav className="bp-main-nav" aria-label="주요 메뉴">
            <button type="button" onClick={onHome}><Icon name="home" />홈</button>
            <button type="button" onClick={onItems}><Icon name="box" />물품목록</button>
            <button type="button" className="is-active"><Icon name="board" />게시판</button>
            <button type="button" onClick={onChat}><Icon name="chat" />채팅</button>
          </nav>

          <div className="bp-account">
            <button type="button" className="bp-alert" aria-label="알림"><Icon name="bell"/><span className="bp-alert__dot" /></button>
            <button type="button" className="bp-user" onClick={onMyPage}><span className="bp-user__avatar">P</span><span>마이페이지</span></button>
          </div>
        </header>

        <div className="bp-hero-copy">
          <div className="bp-eyebrow">AI · PEOPLE · TOMORROW</div>
          <h1>커뮤니티 게시판</h1>
          <p>함께하는 이야기가, 더 나은 내일을 만듭니다.<br/>부경대의 오늘이 더 넓은 가능성의 미래로 이어집니다.</p>
        </div>

        {/* 메인 이미지 안에 옛 로고/PC를 넣지 않는다. 커뮤니티 그래픽은 HTML/CSS로 만든다. */}
        <div className="bp-hologram" aria-hidden="true">
          <div className="bp-holo-ring bp-holo-ring--one" />
          <div className="bp-holo-ring bp-holo-ring--two" />
          <div className="bp-holo-main">
            <span className="bp-holo-avatar" />
            <span className="bp-holo-line bp-holo-line--1" />
            <span className="bp-holo-line bp-holo-line--2" />
            <span className="bp-holo-line bp-holo-line--3" />
            <span className="bp-holo-line bp-holo-line--4" />
          </div>
          <div className="bp-holo-card bp-holo-card--left">•••</div>
          <div className="bp-holo-card bp-holo-card--right"><span>●</span><span className="bp-mini-lines"/></div>
          <div className="bp-holo-card bp-holo-card--bottom"><span>≡</span></div>
          <div className="bp-holo-pen" />
        </div>

        <form className="bp-search" onSubmit={submitSearch}>
          <Icon name="search" size={24}/>
          <input value={text} onChange={(e) => onTextChange(e.target.value)} placeholder="게시글을 검색해보세요. (제목, 내용, 작성자)" />
          <NeonButton locked className="bp-search__button">검색</NeonButton>
        </form>

        <main className="bp-content-grid">
          <aside className="bp-side-menu bp-glass-panel">
            <h2><Icon name="board"/>게시판</h2>
            <NeonButton className="is-active" icon="list">전체</NeonButton>
            <NeonButton icon="free">자유게시판</NeonButton>
            <NeonButton icon="qa">Q&amp;A</NeonButton>
            <NeonButton icon="info">정보공유</NeonButton>
          </aside>

          <section className="bp-board-panel bp-glass-panel">
            <div className="bp-board-topline">
              <div className="bp-tabs">
                <NeonButton className="is-active">전체 ({total})</NeonButton>
                <NeonButton>자유게시판</NeonButton>
                <NeonButton>Q&amp;A</NeonButton>
                <NeonButton>정보공유</NeonButton>
              </div>
              <NeonButton locked icon="write" onClick={onWrite} className="bp-write-btn">글쓰기</NeonButton>
            </div>

            <div className="bp-table-wrap">
              <table className="bp-table">
                <thead><tr><th>번호</th><th>제목</th><th>작성자</th><th>작성일</th><th>조회수</th></tr></thead>
                <tbody>
                  {rows.map((item, index) => {
                    const id = idOf(item, index);
                    return (
                      <tr key={id} onClick={() => onOpenContent(id)}>
                        <td>{id}</td>
                        <td className="bp-title-cell">{noticeOf(item) && <span className="bp-notice-badge">공지</span>}{titleOf(item)}</td>
                        <td>{authorOf(item)}</td>
                        <td>{dateOf(item)}</td>
                        <td>{hitOf(item).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && <tr className="bp-empty"><td colSpan="5">게시글이 없습니다.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="bp-pagination" aria-label="게시판 페이지">
              <button disabled={page <= 1} onClick={() => page > 1 && onPageChange(page - 1, cnt)}>‹</button>
              {visiblePages.map((p) => <button key={p} className={p === page ? 'is-active' : ''} onClick={() => onPageChange(p, cnt)}>{p}</button>)}
              {pageCount > 6 && <span>···</span>}
              {pageCount > 5 && !visiblePages.includes(pageCount) && <button onClick={() => onPageChange(pageCount, cnt)}>{pageCount}</button>}
              <button disabled={page >= pageCount} onClick={() => page < pageCount && onPageChange(page + 1, cnt)}>›</button>
            </div>
          </section>

          <aside className="bp-ranking bp-glass-panel">
            <h2><span>🔥</span> 인기글 TOP 10</h2>
            <ol>
              {popularRows.map((item, index) => (
                <li key={idOf(item, index)} onClick={() => onOpenContent(idOf(item, index))}>
                  <span className={`bp-rank bp-rank--${index + 1}`}>{index + 1}</span>
                  <span className="bp-rank-title">{titleOf(item)}</span>
                  <span className="bp-rank-hit">{hitOf(item).toLocaleString()}</span>
                </li>
              ))}
              {popularRows.length === 0 && <li className="bp-ranking-empty">표시할 게시글이 없습니다.</li>}
            </ol>
          </aside>
        </main>
      </section>
    </div>
  );
};

export default BoardVisual;

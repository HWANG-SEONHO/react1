// 디자인 전용 공통 로고
// 확정된 "PKNU = AI" 방향을 코드 SVG로 고정한다.
// 페이지마다 새 로고를 다시 만들지 않고 이 컴포넌트만 공통 사용한다.

const CampusAiLogo = () => {
    return (
        <div className="campus-ai-logo" aria-label="PKNU AI Campus">
            <svg className="campus-ai-logo__mark" viewBox="0 0 110 82" aria-hidden="true">
                <defs>
                    <linearGradient id="campusAiChromeA" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="0.18" stopColor="#a9fbff" />
                        <stop offset="0.48" stopColor="#53b9ff" />
                        <stop offset="0.72" stopColor="#675cff" />
                        <stop offset="1" stopColor="#d17cff" />
                    </linearGradient>
                    <linearGradient id="campusAiChromeB" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#faffff" />
                        <stop offset="0.32" stopColor="#6cecff" />
                        <stop offset="0.7" stopColor="#4e78ff" />
                        <stop offset="1" stopColor="#7f5fff" />
                    </linearGradient>
                    <filter id="campusAiGlow" x="-70%" y="-70%" width="240%" height="240%">
                        <feGaussianBlur stdDeviation="2.4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* AI 기둥 / P 내부 축 */}
                <path d="M50 12h14v47c0 10-6 16-16 16h-6V61h5c3 0 4-1 4-4Z" fill="url(#campusAiChromeB)" filter="url(#campusAiGlow)" />

                {/* 위쪽 P 리본 */}
                <path d="M56 10h16c18 0 29 9 29 23S90 56 71 56H58V42h13c10 0 15-3 15-9 0-6-5-9-15-9H56Z" fill="url(#campusAiChromeA)" filter="url(#campusAiGlow)" />

                {/* 아래쪽 파도 / 두 번째 P */}
                <path d="M51 68C31 79 10 70 10 52c0-15 12-27 34-31v14c-12 3-19 9-19 17 0 8 9 13 20 7Z" fill="url(#campusAiChromeA)" filter="url(#campusAiGlow)" />

                {/* AI 연결 궤도 */}
                <path d="M12 44C22 20 42 8 72 12" fill="none" stroke="#8ff8ff" strokeWidth="1.8" strokeLinecap="round" opacity=".9" />
                <path d="M19 62C46 75 78 58 99 30" fill="none" stroke="#78a8ff" strokeWidth="1.5" strokeLinecap="round" opacity=".72" />
                <circle cx="14" cy="40" r="3.2" fill="#9cfaff" />
                <circle cx="24" cy="25" r="2.4" fill="#77eaff" />
                <circle cx="36" cy="16" r="1.8" fill="#e2ffff" />
                <circle cx="99" cy="30" r="3" fill="#c29bff" />
            </svg>

            <div className="campus-ai-logo__copy">
                <strong>PKNU AI Campus</strong>
                <span>AI · PEOPLE · TOMORROW</span>
            </div>
        </div>
    );
};

export default CampusAiLogo;

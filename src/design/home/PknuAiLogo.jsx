// 디자인 전용 : 확정한 PKNU = AI 계열 로고를 코드(SVG)로 고정한다.
// 페이지마다 새로 그리지 않고 이 컴포넌트 하나를 공통 사용한다.

const PknuAiLogo = ({ compact = false }) => {
    return (
        <div className={`pknu-ai-logo${compact ? ' pknu-ai-logo--compact' : ''}`} aria-label="PKNU AI Campus">
            <svg className="pknu-ai-logo__mark" viewBox="0 0 96 96" aria-hidden="true">
                <defs>
                    <linearGradient id="pknuLogoChromeA" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="0.2" stopColor="#bffcff" />
                        <stop offset="0.48" stopColor="#63d9ff" />
                        <stop offset="0.7" stopColor="#4b7cff" />
                        <stop offset="1" stopColor="#b06dff" />
                    </linearGradient>
                    <linearGradient id="pknuLogoChromeB" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="0.26" stopColor="#7cf6ff" />
                        <stop offset="0.55" stopColor="#4aa8ff" />
                        <stop offset="0.82" stopColor="#6659ed" />
                        <stop offset="1" stopColor="#42d9ff" />
                    </linearGradient>
                    <filter id="pknuLogoGlow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="2.1" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 오른쪽 위 P 리본 */}
                <path
                    d="M47 14h13c17 0 27 8 27 21 0 13-10 22-28 22H48V44h11c9 0 14-3 14-9 0-5-4-8-13-8H47Z"
                    fill="url(#pknuLogoChromeA)"
                    filter="url(#pknuLogoGlow)"
                />

                {/* 중앙 AI 기둥 */}
                <path
                    d="M39 19h14v55c0 5-4 9-9 9h-5Z"
                    fill="url(#pknuLogoChromeB)"
                    filter="url(#pknuLogoGlow)"
                />

                {/* 왼쪽 아래에서 감아 올라오는 두 번째 P/파도 */}
                <path
                    d="M42 78C24 84 9 74 9 59c0-14 11-27 31-31v14c-11 3-17 9-17 16 0 8 8 12 19 8Z"
                    fill="url(#pknuLogoChromeA)"
                    filter="url(#pknuLogoGlow)"
                />

                {/* AI network orbit */}
                <path d="M13 48C17 24 34 11 61 13" fill="none" stroke="#7cf4ff" strokeWidth="1.8" strokeLinecap="round" opacity=".88" />
                <path d="M17 61C35 75 61 67 84 39" fill="none" stroke="#6aa7ff" strokeWidth="1.6" strokeLinecap="round" opacity=".72" />
                <circle cx="16" cy="41" r="3.1" fill="#9dfaff" />
                <circle cx="22" cy="29" r="2.2" fill="#74e9ff" />
                <circle cx="31" cy="20" r="1.7" fill="#d5ffff" />
                <circle cx="84" cy="39" r="2.7" fill="#a491ff" />
            </svg>

            <div className="pknu-ai-logo__text">
                <strong>PKNU AI Campus</strong>
                <span>AI · PEOPLE · TOMORROW</span>
            </div>
        </div>
    );
};

export default PknuAiLogo;

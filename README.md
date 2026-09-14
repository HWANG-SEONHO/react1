# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## 집가는 버전 기본 작업

`집가는 버전`을 만들 때는 현재 기능을 유지한 채 아래 정리를 기본으로 수행한다.

- 디자인 값은 `src/styles/design.css`로 분리하고 기능 JSX의 inline style을 제거한다.
- 학습용 기능 파일에는 `학습 핵심 / 이름 구분 / 디자인 핵심` 주석과 필요한 기능 구간 주석을 유지한다.
- 짧은 JSX/객체는 가로형으로 정리하고 불필요한 빈줄·중복 CSS/중복 코드를 제거한다.
- 변경 후 `npm run build`, `npm run lint`, ZIP 재검사를 수행하고 검증 범위를 기록한다.
- 당일 사용자가 직접 지정한 UI 변경을 포함하되, 요청하지 않은 기능은 새로 구현하지 않는다.


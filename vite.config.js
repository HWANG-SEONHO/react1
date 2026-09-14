// 파일명 : vite.config.js
// 학습 핵심 : Vite 개발서버에서 /api 요청을 강사 백엔드 서버로 전달하는 proxy 설정
// 이름 구분 : defineConfig/server/proxy/target/changeOrigin/secure는 정해진 설정 이름, /api와 서버 주소는 현재 프로젝트에서 정한 값

import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],

    server: {
        proxy: {
            // 프론트에서 /api/... 로 요청하면 target 서버로 전달한다.
            '/api': { target: "http://ihongss.com:13000", changeOrigin: true, secure: false }
        }
    }
});

import axios from "axios";

export const SERVER_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// 서버 주소를 한 곳에 모아두고, 요청할 때 '/products' 부분만 적음
const api = axios.create({
    baseURL: `${SERVER_URL}/api`,
    withCredentials: true   //세션 쿠키(session.sid)를 함께 보냄
});

export default api;
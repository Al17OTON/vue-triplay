import axios from "axios";

const { VITE_API_URL, VITE_KAKAO_API_URL, VITE_KAKAO_APIKEY } = import.meta.env;

function Axios() {
  const instance = axios.create({
    baseURL: VITE_API_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  return instance;
}

function Kakao() { // kakao map 관련 API 호출 시 사용
    const instance = axios.create({
      baseURL: VITE_KAKAO_API_URL,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": VITE_KAKAO_APIKEY
      },
    });
    return instance;
  }

export { Axios, Kakao };

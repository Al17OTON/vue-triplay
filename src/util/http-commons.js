import axios from "axios";
import { login } from "@/util/login.js";
import { useMemberStore } from "@/stores/memberStore.js";

const { VITE_API_URL, VITE_KAKAO_API_URL, VITE_KAKAO_APIKEY } = import.meta.env;

function Axios() {
  const instance = axios.create({
    baseURL: VITE_API_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  instance.interceptors.response.use(
    (response) => {
      if (response.status === 404) {
        console.log("404");
      }
      return response;
    },
    async (error) => {
      if (error.response.status === 401) {
        await login();

        const memberStore = useMemberStore();

        error.config.headers = {
          'Content-Type': 'application/json',
          access_token: memberStore.token,
        };
        //에러난 요청을 토큰 갱신 후 다시 요청
        const response = await axios.request(error.config);
        return response;
      }
      return Promise.reject(error);
    }
  )

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

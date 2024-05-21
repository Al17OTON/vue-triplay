import { Kakao, KakaoId } from "@/util/http-commons.js";
import axios from "axios";
const kakao = Kakao();
const kakaoId = KakaoId();

function searchKeywordApi(param, success, fail){
    kakao.get('/v2/local/search/keyword.json', {params: param})
    .then(success).catch(fail)
}

function createListFromSeedApi(seedInfo, locations){
    const ids = seedInfo.split(" ");
    const gameList = [];
    for (var id of ids) {
        for (var location of locations) { // 15
            if (location.id === id) {
                let place = {};
                place.id = location.id;
                place.address_name = location.address_name;
                place.place_name = location.place_name;
                place.location = { x: location.x, y: location.y };
                gameList.push(place);
            }
        }
    }
    console.log(gameList)
    return gameList;
}

function searchIdApi(seed, success, fail) {
    // 186032184
    // kakaoId.get(`/${seed}`).then(success).catch(fail)
    axios.get(`${seed}`).then(success).catch(fail)
    // http://place.map.kakao.com/
    // 1. 아이디 string 받아 위 주소로 검색
    // 2. html 파일에서 metadata 추출(place_name, address_name)
    // 3. address_name를 이용해 좌표 찾기(api) 사용
    // 4. 최종 gameList(placeList) 반환

}

export { searchKeywordApi, createListFromSeedApi, searchIdApi };

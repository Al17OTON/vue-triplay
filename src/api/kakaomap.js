import { Kakao } from "@/util/http-commons.js";
const kakao = Kakao();

function searchKeywordApi(param, success, fail){
    kakao.get('/v2/local/search/keyword.json', {params: param})
    .then(success).catch(fail)
}

export { searchKeywordApi };

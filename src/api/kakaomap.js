import { Kakao } from "@/util/http-commons.js";
const kakao = Kakao();

function searchKeywordApi(param, success, fail){
    kakao.get('/v2/local/search/keyword.json', {params: param})
    .then(success).catch(fail)
}

function createListFromSeedApi(seedInfo, locations){
    const ids = seedInfo.split(" ");
    const gameList = [];
    for (var location of locations) {
        for (var id of ids) {
            if (location.id === id) {
                let place = {};
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


export { searchKeywordApi, createListFromSeedApi };

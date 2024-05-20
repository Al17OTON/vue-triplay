import { Axios } from "@/util/http-commons.js";
const http = Axios();

function getSidoApi(success, fail){    
    http.get('location/sido').then(success).catch(fail);
}

function getGugunApi(param, success, fail){
    http.get(`location/gugun?sidoCode=${param}`).then(success).catch(fail);
}

function saveSeedApi(value, success, fail) {
    http.post('seed', value).then(success).catch(fail)
}

function getSeedApi(seedId, success, fail) {
    http.get(`seed/${seedId}`).then(success).catch(fail)
}

function saveGameApi(value, success, fail) {
    http.post('game', value).then(success).catch(fail)
}

function getGameApi(gameId, success, fail) {
    http.get(`game/${gameId}`).then(success).catch(fail)
}

function getGameListApi(success, fail) {
    http.get('game').then(success).catch(fail)
}

function updateScoreApi(token, param, success, fail){
    http.put('member/addScore', {}, {
        headers: {
            access_token: token
        },
        params: param
    }).then(success).catch(fail)
}

export {
    getSidoApi, getGugunApi, saveSeedApi, getSeedApi, saveGameApi, getGameApi, getGameListApi, updateScoreApi
};

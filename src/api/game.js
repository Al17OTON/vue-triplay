import { Axios } from "@/util/http-commons.js";
const http = Axios();

function getSidoApi(success, fail){    
    http.get('location/sido').then(success).catch(fail);
}

function getGugunApi(param, success, fail){
    http.get(`location/gugun?sidoCode=${param}`).then(success).catch(fail);
}

export { getSidoApi, getGugunApi };

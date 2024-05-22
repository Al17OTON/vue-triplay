import { Axios, AxiosMulti } from "@/util/http-commons.js";
const httpMulti = AxiosMulti();
const http = Axios();

function insertPlanApi(data, success, fail){
    httpMulti.post('plan', data).then(success).catch(fail);
}

function getPlanListApi(success, fail){
    http.get('plan').then(success).catch(fail);
}

function getPlanApi(planId, success, fail){
    return http.get(`plan/${planId}`).then(success).catch(fail);
}

function deletePlanApi(planId, success, fail){
    http.delete(`plan/${planId}`).then(success).catch(fail);
}

function updateHitApi(planId, success, fail){
    http.put(`plan/hit/${planId}`).then(success).catch(fail);
}
export { insertPlanApi, getPlanListApi, getPlanApi, deletePlanApi, updateHitApi };

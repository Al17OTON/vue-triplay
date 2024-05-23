import { Axios, AxiosMulti } from "@/util/http-commons.js";
const httpMulti = AxiosMulti();
const http = Axios();

async function insertPlanApi(data, success, fail){
    await httpMulti.post('plan', data).then(success).catch(fail);
}

async function getPlanListApi(success, fail){
    await http.get('plan').then(success).catch(fail);
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

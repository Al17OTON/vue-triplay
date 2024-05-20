import { Axios } from "@/util/http-commons.js";
import { useMemberStore } from '@/stores/memberStore.js';
export const getMemoList = async (plan_id) => {
    return await Axios().get(`/memo/getMemoList/${plan_id}`).then((res) => {
        return res.data.resdata.sort((a, b) => a.step - b.step);    //정렬하기
    });
}

export const addMemo = async (plan_id, member_id, comment, parent_step, parent_depth) => {
    const memberStore = useMemberStore();
    console.log(comment);
    return await Axios().post(`/memo/add/${plan_id}`,
        {
            member_id: member_id,
            comment: comment,
            parent_step: parent_step,
            parent_depth: parent_depth,
        },
        {
            headers: {
                access_token: memberStore.token,
            }
        },
    )
        .then((res) => {
            console.log(res);
    })
}

export const deleteMemo = async (memo_id) => {
    const memberStore = useMemberStore();
    return await Axios().delete(`/memo/delete/${memo_id}`).then((res) => { console.log(res) });
}

export const modifyMemo = async (memo_id, comment) => {
    return await Axios().put('/memo/modify', {
        memo_id: memo_id,
        comment: comment
    });
}
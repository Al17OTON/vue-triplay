<script setup>
import { getMemoList, addMemo, deleteMemo, modifyMemo } from '@/util/memo.js';
import { watch, onMounted, ref, onUpdated } from "vue";
import MemoItem from '@/components/plan/MemoItem.vue';
import { useMemberStore } from "@/stores/memberStore";

const props = defineProps({
    plan_id: Number,
    update: Boolean,
    setRoot: Boolean,
});

const memberStore = useMemberStore();
const memoList = ref([]);
const inputId = ref(-1);
const commentTable = ref({});
const isModify = ref(false);

watch(() => props.update, async () => {
    memoList.value = await getMemoList(props.plan_id);
    console.log(memoList.value);
});

watch(() => props.setRoot, () => {
    onClick(0);
});

const onClick = (memo_id) => {
    isModify.value = false;
    inputId.value = memo_id;
    commentTable.value['id' + memo_id] = "";
}

const submitMemo = async (memo) => {
    if (isModify.value) {
        console.log("수정");
        await modifyMemo(inputId.value, commentTable.value['id' + inputId.value]);
    } else {
        console.log("삭제");
        await addMemo(
            props.plan_id,
            memberStore.member_id,
            commentTable.value['id' + inputId.value],
            memo ? memo.step : -1,
            memo ? memo.depth : -1
        );
    }
    memoList.value = await getMemoList(props.plan_id);
    onClick(-1);
}

const deleteM = async (memo_id) => {
    console.log("삭제 " + memo_id);
    await deleteMemo(memo_id);
    memoList.value = await getMemoList(props.plan_id);
}

const modifyM = async (memo_id) => {
    console.log("수정 " + memo_id);
    isModify.value = true;
    inputId.value = memo_id;
    commentTable.value['id' + memo_id] = "";
}


</script>

<template>
    <div class="container">
        <div class="row justify-content-md-center">
            <div class="col-lg-10">
                <div v-show="inputId===0" id="commentDiv" class="mt-3">
                    <form @submit.prevent="submitMemo()" class="input-group mb-3">
                            <input v-model="commentTable['id0']" type="text" class="form-control" placeholder="댓글" aria-label="Memo" aria-describedby="basic-addon1" required>
                            <button type="submit" class="btn btn-success">등록</button>
                    </form>
                    <div :style="{'clear' : 'both'}"></div>
                </div>
                <div id="comment-area">
                    <div v-for="memo in memoList" :key="memo.memo_id" :style="{'margin' : '5px 0 0 ' + (memo.depth * 5) + '%'}">
                        <MemoItem :memo="memo" @deleteMemo="deleteM" @modifyMemo="modifyM" @writeMemo="onClick"/>
                        <form @submit.prevent="submitMemo(memo)" v-show="inputId===memo.memo_id" id="commentDiv" class="input-group mb-3">
                            <!-- 댓글 작성 Form -->
                            <input v-model="commentTable['id'+memo.memo_id]" id="commentArea" class="form-control" type="text" placeholder="댓글" required />
                            <button class="btn btn-success" type="submit">등록</button>
                        </form>
                        <div :style="{'clear' : 'both'}"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<style scoped>

</style>
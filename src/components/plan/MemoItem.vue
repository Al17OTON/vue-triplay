<script setup>
import { useMemberStore } from "@/stores/memberStore";

const props = defineProps({
    memo: Object,
});
const memberStore = useMemberStore();

const emit = defineEmits([
    'deleteMemo', 'modifyMemo', 'writeMemo'
])

const deleteMemo = () => {
    emit('deleteMemo', props.memo.memo_id);
}

const modifyMemo = () => {
    emit('modifyMemo', props.memo.memo_id);
}

const writeMemo = () => {
    emit('writeMemo', props.memo.memo_id);
}
</script>  


<template>
    <div class="comment-container">
        <div class="comment-author">{{memo.member_id}}</div>
        <div class="comment-date">{{memo.memo_time}}</div>
        <div class="comment-content">{{memo.comment}}</div>

        <div class="d-flex justify-content-end" id="comment-button-group">
            <button v-if="memberStore.member_id===memo.member_id"  @click="modifyMemo" type="button" id="btn-comment-update" class="btn btn-outline-primary mb-3">
				    수정
			</button>
	        <button v-if="memberStore.member_id===memo.member_id"  @click="deleteMemo" type="button" id="btn-comment-delete" class="btn btn-outline-danger mb-3 ms-1 ">
	                삭제
	        </button>
            <button v-if="memo.depth <= 5" @click="writeMemo" type="button" id="btn-comment" class="btn btn-outline-success mb-3 ms-1">
	                답글
	        </button>
        </div>
        
    </div>
</template>

<style scoped>
.comment-container {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
}

.comment-author {
  font-weight: bold;
  color: #333;
}
.comment-date {
  color: #666;
  font-size: smaller;
}
.comment-content {
  margin-top: 5px;
}
</style>
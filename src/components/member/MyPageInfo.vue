<script setup>
import { Axios } from "@/util/http-commons.js";
import { useMemberStore } from "@/stores/memberStore.js";
import { ref, onMounted } from "vue";

const emit = defineEmits(['needPassword']);
const api = Axios();
const memberStore = useMemberStore();
const info = ref(null);
const getInfo = () => {
    api.get("/member/getMember?member_id=" + memberStore.member_id, {
        headers: {
            access_token: `${memberStore.token}`
        }
    })
    .then((res) => info.value = res.data);
}

onMounted(() => {
    getInfo();
})

const remove = () => {
    emit('needPassword', 'remove');
}
const modify = () => {
    emit('needPassword', 'modify');
}

</script>

<template>
    <div>
        <h1>마이페이지</h1>
        <div>
            {{ info }}

            <button @click="remove" type="button" class="btn btn-danger">탈퇴</button>
            <button @click="modify" type="button" class="btn btn-warning">수정</button>
        </div>
    </div>
</template>

<style scoped>

</style>
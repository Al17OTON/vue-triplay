<script setup>
import { onMounted } from 'vue';
import { useMemberStore } from '@/stores/memberStore.js';
import { Axios } from "@/util/http-commons.js";
import { oops } from "@/util/sweetAlert.js";
import { useRouter } from "vue-router";

const router = useRouter();
const memberStore = useMemberStore();
const api = Axios();

const removeMember = () => {
    api.put("/member/remove?member_id=" + memberStore.member_id, {
        headers: {
            access_token: `${memberStore.token}`
        }
    })
    .then((res) => {
        if (res.status != 200) oops("삭제 실패");
    })
    .catch((err) => oops("삭제 실패"));
}

onMounted(() => {
    removeMember();
})

const home = () => {
    router.replace({ name: "main" });
}
</script>

<template>
    <div>
        <h1>삭제되었습니다!</h1>
        <button @click="home" type="button" class="btn btn-success">홈으로</button>
    </div>
</template>

<style scoped>

</style>
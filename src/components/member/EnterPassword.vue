<script setup>
import { ref } from "vue";
import { Axios } from "@/util/http-commons.js";
import { useMemberStore } from "@/stores/memberStore.js";
import { oops } from "@/util/sweetAlert.js";
import { useRouter } from "vue-router";

defineProps({
    method : String,
})

const router = useRouter();
const memberStore = useMemberStore();
const pw = ref("");
const api = Axios();
const checkPassword = (method) => {
    api.post("/member/login", {
        member_id: memberStore.member_id,
        member_pw: pw.value
    })
    .then((res) => {
        if (res.status == 200) {
            memberStore.token = res.data.access_token;
            console.log(method);
            router.replace({ name: method });
        } else oops("잘못된 비밀번호입니다.");
    })
}

</script>

<template>
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-lg-6">
                <div class="text-center"> <!-- 수평 가운데 정렬을 위한 text-center 클래스 추가 -->
                    <h4>본인확인을 위해 비밀번호를 입력해주세요.</h4>
                    <div class="input-group-lg mt-3 mb-3">
                        <input v-model="pw" type="password" class="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" required>
                    </div>
                    <button @click="checkPassword(method)" type="button" class="btn btn-success">확인</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
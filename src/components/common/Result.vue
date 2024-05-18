/**
결과 화면 출력하는 컴포넌트

다음과 같이 호출하면 된다.
<Result msg="화면에 출력할 문자" to="이동할 라우터 name (replace로 호출됨)" toName="버튼 메세지"/>
*/

<script setup>

import { useRouter } from "vue-router";

defineProps({
    to: String,
    msg: String,
    toName: String
})

const router = useRouter();
const go = (to) => {
    router.replace({ name: to });
}

</script>

<template>
    <div class="wrap">
        <div>
            <h1>{{msg}}</h1>
            <br>
            <input @click="go(to)" class="btn btn-primary" type="button" :value="toName">
        </div>
    </div>
</template>

<style scoped>
.wrap {
  padding-top: 10%;
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
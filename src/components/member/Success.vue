<script setup>

import { useRouter } from "vue-router";

const router = useRouter();
const home = () => {
    router.replace({ name: 'main' });
}

</script>

<template>
    <div class="wrap">
        <div>
            <h1>회원가입 성공!</h1>
            <br>
            <input @click="home" class="btn btn-primary" type="button" value="홈으로">
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
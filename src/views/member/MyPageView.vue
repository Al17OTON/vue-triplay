<script setup>
import MyPageInfoVue from "@/components/member/MyPageInfo.vue";
import EnterPassword from "@/components/member/EnterPassword.vue";
import { ref } from "vue";

const needPassword = ref(false);
const propMsg = ref("");

const setPasswordView = (method) => {
    needPassword.value = true;
    propMsg.value = method;
}

</script>

<template>
    <div>
        <MyPageInfoVue v-show="!needPassword" @needPassword="(res) => setPasswordView(res)"/>
        <EnterPassword v-show="needPassword" :method="propMsg"/>
    </div>
</template>

<style scoped>

</style>
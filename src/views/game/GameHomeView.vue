<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

</script>

<template>
  <div>
    <button class="btn btn-primary btn-md me-3" @click="router.push({name: 'gameinfo'})">게임하기</button>
    <button class="btn btn-primary btn-md me-3" @click="router.push({name: 'gamemake'})">게임 만들기</button>
    <button class="btn btn-primary btn-md" @click="router.push({name: 'gamelist'})">게임 찾아보기</button>
  </div>
</template>

<style scoped>

</style>

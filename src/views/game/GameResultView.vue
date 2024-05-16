<script setup>
import { useGameStore } from "@/stores/gameStore";
const store = useGameStore();

const saveGame = () => {
  var gameSeed = {
    keyword: store.keyword,
    count: store.count,
    seedInfo: store.gameSeed,
  };
  console.log(gameSeed);
};
</script>

<template>
  <div>
    <h3>게임 최종 결과!</h3>
    <h1>{{ store.score }}</h1>
    <h1>{{ store.gameSeed }}</h1>
    <button class="btn btn-primary btn-md me-3" @click="saveGame">게임 저장하기</button>
    <button class="btn btn-primary btn-md">여행 계획하기</button>
  </div>
</template>

<style scoped></style>

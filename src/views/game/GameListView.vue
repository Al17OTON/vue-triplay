<script setup>
import { ref, onMounted } from "vue";
import { getGameListApi } from "@/api/game.js";
import VGameItem from "@/components/game/VGameItem.vue";

const gameList = ref();
onMounted(() => {
  getGameListApi(
    ({ data }) => {
      console.log(data);
      gameList.value = data.resdata;
    },
    (error) => console.log(error)
  );
});
</script>

<template>
  <div>
    <VGameItem class="mb-3" :game="game" v-for="game in gameList" :key="game.gameId" />
  </div>
</template>

<style scoped></style>

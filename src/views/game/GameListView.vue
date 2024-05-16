<script setup>
import { ref, onMounted } from "vue";
import { getGameListApi } from "@/api/game.js";
import VGameItem from "@/components/game/VGameItem.vue";
// import { useRouter } from "vue-router";
// const router = useRouter();

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
    <VGameItem v-for="game in gameList" :key="game.gameId" />
  </div>
</template>

<style scoped></style>

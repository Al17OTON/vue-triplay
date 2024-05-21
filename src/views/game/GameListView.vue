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
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-6">
        <div class="mb-3">
          <h1 class="mb-3">게임 둘러보기</h1>
          <h5>사용자들이 추천한 다양한 게임을 경험해보세요</h5>
          사용자 정의 게임은 <span style="font-size: 20px; font-weight: bold">초록색</span> ,
          사용자가 공유한 게임은 <span style="font-size: 20px; font-weight: bold">파란색</span>을
          선택해주세요
        </div>

        <VGameItem class="mb-3" :game="game" v-for="game in gameList" :key="game.gameId" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

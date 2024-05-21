<script setup>
import { ref, onMounted } from "vue";
import { getGameListApi } from "@/api/game.js";
import VGameItem from "@/components/game/VGameItem.vue";

const gameList = ref();
const column = ref({
  gameTitle: "제목",
  keyword: "키워드",
  member_id: "작성자",
  difficulty: "난이도",
  column: true,
});
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
        <div class="mb-3 text-center">
          <h1 class="mb-3">게임 둘러보기</h1>
          <h5>사용자들이 추천한 다양한 게임을 경험해보세요</h5>
          사용자 정의 게임은 <span style="font-size: 20px; font-weight: bold">초록색</span> ,
          사용자가 공유한 게임은 <span style="font-size: 20px; font-weight: bold">파란색</span>을
          선택해주세요
        </div>
        <div class="column">
          제목 &nbsp;&nbsp;&nbsp;&nbsp; 키워드 &nbsp;&nbsp;&nbsp;&nbsp; 작성자
          &nbsp;&nbsp;&nbsp;&nbsp; 난이도
        </div>
        <VGameItem class="mb-3" :game="game" v-for="game in gameList" :key="game.gameId" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.column {
  background-color: rgb(240, 240, 240);
  padding: 8px 15px;
  border-radius: 10px;
  box-shadow: -1px 1px 3px 1px #cfcfcf;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 13px;
  font-weight: bold;
}
</style>

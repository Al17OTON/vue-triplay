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
        <div class="mb-5 text-center">
          <h1 class="title mb-3">게임 둘러보기</h1>
          <span style="font-size: 18px;">사용자들이 추천한 다양한 게임을 경험해보세요!<br>
          사용자 정의 게임은 <b>초록색</b>,
          사용자가 공유한 게임은 <b>파란색</b>을
          선택해주세요</span>
        </div>
        <div class="column row">
          <div class="col-4">제목</div>
          <div class="col-2">키워드</div>
          <div class="col-2">작성자</div>
          <div class="col-2">난이도</div>
          <div class="col-2"></div>
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

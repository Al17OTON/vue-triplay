<script setup>
import { ref } from "vue";
import { searchKeywordApi, createListFromSeedApi } from "@/api/kakaomap.js";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
const router = useRouter();
const store = useGameStore();
const props = defineProps({
  game: Object,
});
// s.keyword, s.count, s.seedInfo, g.member_id, g.difficulty, g.game_title

const locations = ref();
const searchQuery = {
  // category_group_code: "AT4",
  query: "",
  size: "15",
};

const startGame = () => {
  searchQuery.query = props.game.keyword;
  searchQuery.page = props.game.seedInfo[0];
  searchKeywordApi(
    searchQuery,
    ({ data }) => {
      const gameList = createListFromSeedApi(props.game.seedInfo.substring(2), data.documents);

      store.newGame = false;
      store.id = 0;
      store.gameList = gameList;
      store.score = props.game.count * 1000;
      store.difficulty = props.game.difficulty;
      store.seedInfo = {
        keyword: props.game.keyword,
        seedInfo: props.game.seedInfo,
        count: props.game.count,
      };
      console.log("게임에 사용하는 게임 리스트!");
      console.log(store.gameList);

      router.push({ name: "gamemap" });
    },
    (error) => console.log(error)
  );
};
</script>

<template>
  <div class="game-item">
    {{ game.gameTitle }} / {{ game.keyword }} / {{ game.memberId }} /
    {{ game.difficulty }}

    <button
      @click="startGame"
      class="btn start"
      :class="{ 'btn-primary': game.difficulty, 'btn-success': !game.difficulty }"
    >
      시작하기
    </button>
    <!-- <button @click="startGame" style="float: right" class="btn btn-primary">시작하기</button> -->
  </div>
</template>

<style scoped>
.game-item {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: -3px 3px 5px 3px #cfcfcf;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.start {
  display: inline-block;
}
</style>

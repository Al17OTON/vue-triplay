<script setup>
import { ref } from "vue";
import { searchKeywordApi } from "@/api/kakaomap.js";
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
  page: "1",
  size: "15",
};

const startGame = () => {
  searchQuery.query = props.game.keyword;
  searchKeywordApi(
    searchQuery,
    ({ data }) => {
      locations.value = data.documents;
      const ids = props.game.seedInfo.split(" ");
      const gameList = [];
      for (var location of locations.value) {
        for (var id of ids) {
          if (location.id === id) {
            let place = {};
            place.address_name = location.address_name;
            place.place_name = location.place_name;
            place.location = { x: location.x, y: location.y };
            gameList.push(place);
          }
        }
      }

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
  <div>
    {{ game.gameTitle }} / {{ game.keyword }} / {{ game.memberId }} /
    {{ game.difficulty }}
    <button @click="startGame" class="btn btn-primary btn-sm">시작하기</button>
  </div>
</template>

<style scoped></style>

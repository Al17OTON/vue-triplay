<script setup>
import { ref } from "vue";
import { searchKeywordApi, createListFromSeedApi } from "@/api/kakaomap.js";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import { PlaceFindById, KakaoAddress2Coord } from "@/util/http-commons";

const router = useRouter();
const store = useGameStore();
const props = defineProps({
  game: Object,
});
// s.keyword, s.count, s.seedInfo, g.member_id, g.difficulty, g.game_title

const locations = ref();
const address2Coord = KakaoAddress2Coord();
const searchQuery = {
  // category_group_code: "AT4",
  query: "",
  size: "15",
};
const places = ref([]);

const startGame = async () => {
  // searchQuery.query = props.game.keyword;
  // searchQuery.page = props.game.seedInfo[0];
  // searchKeywordApi(
  //   searchQuery,
  //   ({ data }) => {
  //     const gameList = createListFromSeedApi(props.game.seedInfo.substring(2), data.documents);

  //     store.newGame = false;
  //     store.id = 0;
  //     store.gameList = gameList;
  //     store.score = props.game.count * 1000;
  //     store.difficulty = props.game.difficulty;
  //     store.seedInfo = {
  //       keyword: props.game.keyword,
  //       seedInfo: props.game.seedInfo,
  //       count: props.game.count,
  //     };
  //     console.log("게임에 사용하는 게임 리스트!");
  //     console.log(store.gameList);

  //     router.push({ name: "gamemap" });
  //   },
  //   (error) => console.log(error)
  // );

  store.newGame = false;
  store.id = 0;
  const seeds = props.game.seedInfo.split(' ');
  console.log(seeds);
  for (var i = 0; i < seeds.length; i++) {
    if (!seeds[i]) continue;
    places.value.push(await PlaceFindById(seeds[i]));
    console.log(places.value[i]);
  }

  setTimeout(delayedFunction, 200);
};

const delayedFunction = () => {
  getPlace(0, () => {
    store.gameList = places.value;
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
  });
}

const getPlace = (idx, end) => {
// address2Coord.get(`address?query=${places.value[idx].address}`)
  address2Coord.get(`keyword?query=${places.value[idx].title}`)
  .then((res) => {
    // places.value[idx].
    const pos = { 'x': res.data.documents[0].x, 'y': res.data.documents[0].y };
    updatePlaceLocation(idx, pos);
    updatePlaceId(idx, res.data.documents[0].id);
    console.log(places.value);
    if (idx < places.value.length - 1)
      getPlace(idx + 1, end);
    else end();
  })
}
function updatePlaceLocation(index, newLocation) {
  places.value[index] = {
    ...places.value[index],
    location: newLocation
  };
}

function updatePlaceId(index, newId) {
  places.value[index] = {
    ...places.value[index],
    id: newId
  };
}

</script>

<template>
  <div class="game-item row">
    <div class="col-3">
      <b>{{ game.gameTitle }}</b>
    </div>
    <div class="col-2">{{ game.keyword }}</div>
    <div class="col-2">{{ game.memberId }}</div>
    <div class="col-2">{{ game.difficulty }}</div>
    <div class="col-2 d-flex justify-content-center">
      <button
        @click="startGame"
        class="btn start"
        :class="{ 'btn-primary': game.difficulty, 'btn-success': !game.difficulty }"
      >
        START
      </button>
    </div>
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

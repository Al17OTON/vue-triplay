<script setup>
import VSelect from "/src/components/common/VSelect.vue";
import { ref, onMounted } from "vue";
import { searchKeywordApi } from "@/api/kakaomap.js";
import { getSidoApi, getGugunApi } from "@/api/game.js";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
const store = useGameStore();
const router = useRouter();

onMounted(() => {
  getSido();
  for (let i = 3; i <= 10; i++) {
    countList.value.push({ text: i, value: i });
  }
});

const sidoList = ref();
const gugunList = ref();
const countList = ref([]);
const gameList = ref([]);
const seedInfo = ref("");
const classGroup = "form-select mb-3";
const labelClass = "fw-bold mb-3";

const searchQuery = ref({
  // category_group_code: "AT4",
  query: "",
  page: "1",
  size: "15",
});

const gameSetting = ref({
  query: "",
});

const selectRandom = (count) => {
  let idx = [];
  for (var i = 0; i < count; i++) {
    var randomNum = Math.floor(Math.random() * 15);
    if (idx.indexOf(randomNum) === -1) {
      idx.push(randomNum);
    } else {
      i--;
    }
  }
  return idx;
};
const createSeed = (locations) => {
  let idx = selectRandom(gameSetting.value.count);
  for (var i of idx) {
    let place = {};
    place.id = locations[i].id;
    place.address_name = locations[i].address_name;
    place.place_name = locations[i].place_name;
    place.location = { x: locations[i].x, y: locations[i].y };
    gameList.value.push(place);
    seedInfo.value += `${locations[i].id} `;
  }

  store.newGame = true;
  store.id = 0;
  store.score = gameSetting.value.count * 1000;
  store.gameList = gameList.value;
  store.difficulty = gameSetting.value.difficulty;
  store.seedInfo = {
    keyword: searchQuery.value.query,
    seedInfo: seedInfo.value,
    count: gameSetting.value.count,
  };
  console.log(gameList.value);
};
const searchKeyword = () => {
  console.log(gameSetting.value);
  if (
    searchQuery.value.query[0] != "" &&
    gameSetting.value.difficulty &&
    gameSetting.value.count != ""
  ) {
    gameSetting.value.query = searchQuery.value.query[1];
    searchQuery.value.query = gameSetting.value.query;
    searchKeywordApi(
      searchQuery.value,
      ({ data }) => {
        console.log(data.documents);
        createSeed(data.documents);
        router.push({ name: "gamemap" });
      },
      (error) => {
        console.log(error);
        alert("선택지를 모두 골라주세요.");
      }
    );
  } else {
    alert("선택지를 모두 골라주세요.");
  }
};

const getSido = () => {
  getSidoApi(
    ({ data }) => {
      sidoList.value = data.resdata.map((item) => {
        return { value: item.sidoCode, text: item.sidoName };
      });
    },
    (error) => console.log(error)
  );
};

const selectSido = (key, text) => {
  searchQuery.value.query = [key, text];
  if (key >= 10) {
    getGugunApi(key, ({ data }) => {
      gugunList.value = data.resdata.map((item) => {
        return { value: item.gugunCode, text: item.gugunName };
      });
    });
  } else {
    gugunList.value = [];
  }
};

const selectGugun = (key, text) => {
  searchQuery.value.query = [key, text];
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-6">
        <div class="mb-5">
          <h4 :class="labelClass">지역을 선택해주세요</h4>
          <VSelect
            :selectId="'sido'"
            :selectOption="sidoList"
            :defaultValue="'여행할 지역 선택'"
            :classGroup="classGroup"
            @on-key-select="selectSido"
          />

          <VSelect
            :selectId="'gugun'"
            :selectOption="gugunList"
            :defaultValue="'시/군 선택'"
            :classGroup="classGroup"
            @on-key-select="selectGugun"
          />
        </div>
        <div class="mb-5">
          <h4 class="fw-bold">난이도를 선택해주세요</h4>
          <div class="mb-3">난이도에 따라 힌트 제공 범위가 달라집니다.</div>
          <input
            v-model="gameSetting.difficulty"
            value="EASY"
            type="radio"
            class="btn-check"
            name="options-outlined"
            id="easyRadio"
            autocomplete="off"
          />
          <label class="btn btn-outline-primary me-3" for="easyRadio">EASY</label>

          <input
            v-model="gameSetting.difficulty"
            value="HARD"
            type="radio"
            class="btn-check"
            name="options-outlined"
            id="hardRadio"
            autocomplete="off"
          />
          <label class="btn btn-outline-danger" for="hardRadio">HARD</label>
        </div>
        <div>
          <h4 :class="labelClass">여행지 개수를 선택해주세요</h4>
          <VSelect
            v-model="gameSetting.count"
            :selectId="'count'"
            :selectOption="countList"
            :defaultValue="'여행지 개수'"
            :classGroup="classGroup"
          />
        </div>
        <div class="d-flex justify-content-center">
          <button class="btn mt-3 btn-primary btn-lg" @click="searchKeyword">게임 시작</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

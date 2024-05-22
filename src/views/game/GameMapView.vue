<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import VRoadMap from "@/components/game/VRoadMap.vue";
import VMap from "@/components/game/VMap.vue";
const store = useGameStore();
const router = useRouter();

const submitFlag = ref(false);
const resetFlag = ref(true);
const targetFlag = ref(false);
const hintFlag = ref(false);
const distance = ref();
const curScore = ref();
// x: 경도(long), y: 위도(lati)
// LatLng(y, x)
const nextPlace = () => {
  targetFlag.value = false;
  hintFlag.value = false;
  resetFlag.value = true;
  submitFlag.value = false;

  store.gameList[store.id].distance = distance.value;
  store.gameList[store.id].score = curScore.value;
  if (store.id == store.gameList.length - 1) {
    router.replace({ name: "gameresult" });
  } else {
    store.increment();
  }
};

const setHint = () => {
  if (store.difficulty === "HARD") hintFlag.value = true;
  else targetFlag.value = true;
  // hintFlag.value = true;
  // targetFlag.value = true;
};

onMounted(() => {
  console.log(store.page);
  console.log(store.seedInfo);
});

const getDistance = (dis) => {
  distance.value = dis;
  var cur = 0;
  if (dis <= 1000) {
    cur = 1000 - dis;
  } else if (dis <= 5000) {
    cur = -Math.floor(dis / 5);
  } else if (dis <= 10000) {
    cur = -1000;
  } else {
    cur = -1100;
  }

  store.score += cur;
  curScore.value = 1000 + cur;
  if (hintFlag.value) {
    store.score -= 100;
    curScore.value -= 100;
  }
  console.log("거리: " + dis);
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-12">
        <!-- reset: {{ resetFlag }} submit: {{ submitFlag }} <br /> -->
        <button class="btn btn-primary btn-md me-3" @click="setHint">힌트</button>
        <button
          v-show="!resetFlag"
          style="float: right"
          class="btn btn-primary btn-md mb-3"
          @click="nextPlace"
        >
          다음
        </button>
        <button
          v-show="!submitFlag"
          style="float: right"
          class="btn btn-primary btn-md mb-3"
          data-bs-toggle="modal"
          data-bs-target="#resultModal"
          @click="
            submitFlag = true;
            resetFlag = false;
          "
        >
          제출
        </button>
        <!-- {{ store.id }} -->
        <div v-if="hintFlag" style="display: inline">
          플레이스 이름 > <span class="fw-bold"> {{ store.gameList[store.id].place_name }}{{ store.gameList[store.id].title }} </span>
        </div>

        <div></div>
        <div class="mt-3" style="display: flex">
          <VRoadMap
            style="height: 500px"
            class="flex-fill me-3"
            :key="store.gameList[store.id].location"
            :location="store.gameList[store.id].location"
          />
          <VMap
            class="flex-fill"
            :target="targetFlag"
            :submit="submitFlag"
            :reset="resetFlag"
            @get-distance="getDistance"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 결과 모달 -->
  <div class="modal fade" id="resultModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="d-flex justify-content-center">
          <h3 class="fw-bold">결과</h3>
        </div>
        <hr />
        <div class="modal-body">
          <div class="mb-3">
            <h5>플레이스</h5>
            <span style="font-size: 18pt; font-weight: bold">{{
              store.gameList[store.id].place_name
            }}</span>
          </div>
          <div class="mb-3">
            <h5>거리</h5>
            <span style="font-size: 18pt; font-weight: bold">{{ distance }} m</span>
          </div>
          <div class="mb-3">
            <h5>점수</h5>
            <span style="font-size: 18pt; font-weight: bold">{{ curScore }} point 💰💵</span>
          </div>
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-success me-2" data-bs-dismiss="modal">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 결과 모달 끝 -->
</template>

<style scoped></style>

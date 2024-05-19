<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import VRoadMap from "@/components/game/VRoadMap.vue";
import VMap from "@/components/game/VMap.vue";
const store = useGameStore();
const router = useRouter();

const submitFlag = ref(false);
const resetFlag = ref(true);
const targetFlag = ref(false);
const distance = ref();
const curScore = ref();
// x: 경도(long), y: 위도(lati)
// LatLng(y, x)
const nextPlace = () => {
  targetFlag.value = false;
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

const getDistance = (dis) => {
  distance.value = dis;
  var dif = 1000 - dis;
  store.score += dif;
  curScore.value = dif;
  console.log("거리: " + dis);
};

</script>

<template>
  <div>
    reset: {{ resetFlag }} submit: {{ submitFlag }} <br />
    <button class="btn btn-primary btn-md mb-3 me-3" @click="targetFlag = true">
      범위
    </button>
    <button v-show="!resetFlag" class="btn btn-primary btn-md mb-3 me-3" @click="nextPlace">
      다음
    </button>
    <button
      v-show="!submitFlag"
      class="btn btn-primary btn-md mb-3"
      data-bs-toggle="modal"
      data-bs-target="#resultModal"
      @click="submitFlag = true; resetFlag = false"
    >
      제출
    </button>
    {{ store.id }}
    {{ store.gameList[store.id].place_name }}
    <div style="display: flex">
      <VRoadMap
        style="height: 500px"
        class="flex-fill me-3"
        :key="store.gameList[store.id].location"
        :location="store.gameList[store.id].location"
      />
      <VMap class="flex-fill" :target="targetFlag" :submit="submitFlag" :reset="resetFlag" @get-distance="getDistance" />
    </div>
    
  </div>

  <!-- 결과 모달 -->
  <div class="modal fade" id="resultModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="d-flex justify-content-center">
          <h3 class="fw-bold">결과</h3>
        </div>
        <hr>
        <div class="modal-body">
          <div class="mb-3">
            <h5>거리</h5>
            <span style="font-size: 18pt; font-weight:bold">{{ distance }} m</span>
            
          </div>
          <div class="mb-3">
            <h5>점수</h5>
            <span style="font-size: 18pt; font-weight:bold">{{ curScore }} point 💰💵</span>
          </div>
          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-outline-success me-2"
              data-bs-dismiss="modal">
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

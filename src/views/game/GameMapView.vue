<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import VRoadView from "@/components/game/VRoadMap.vue";
import VMap from "@/components/game/VMap.vue";
const store = useGameStore();
const router = useRouter();

const submitFlag = ref(false);
const resetFlag = ref(true);
const distance = ref();
const curScore = ref();
// x: 경도(long), y: 위도(lati)
// LatLng(y, x)
const nextPlace = () => {
  console.log(store.id + " " + store.gameList.length);
  resetFlag.value = true;
  submitFlag.value = false;
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
    <button v-show="!resetFlag" class="btn btn-primary btn-md mb-3 me-3" @click="nextPlace">
      다음
    </button>
    <button
      v-show="!submitFlag"
      class="btn btn-primary btn-md mb-3"
      data-bs-toggle="modal"
      data-bs-target="#resultModal"
      @click="submitFlag = true"
    >
      제출
    </button>
    {{ store.id }}
    {{ store.gameList[store.id].place_name }}
    <VRoadView
      :key="store.gameList[store.id].location"
      :location="store.gameList[store.id].location"
    />
    <br />
    <VMap :submit="submitFlag" :reset="resetFlag" @get-distance="getDistance" />
  </div>

  <!-- 로그인 모달 -->
  <div class="modal fade" id="resultModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="d-flex justify-content-center">
          <div>
            <h2 class="fw-bold">결과</h2>
          </div>
        </div>

        <!-- 입력 폼 -->
        <div class="modal-body">
          <div class="mb-3">
            <h5>거리</h5>
            {{ distance }} m
          </div>
          <div class="mb-3">
            <h5>점수</h5>
            {{ curScore }} point 💰💵
          </div>
          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-outline-success me-2"
              data-bs-dismiss="modal"
              @click="
                submitFlag = true;
                resetFlag = false;
              "
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 로그인 모달 끝 -->
</template>

<style scoped></style>

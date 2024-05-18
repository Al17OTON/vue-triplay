<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import { saveGameApi, saveSeedApi } from "@/api/game.js";
const router = useRouter();
const store = useGameStore();

const seedId = ref();
const gameTitle = ref();
const saveSeed = () => {
  console.log("결과에서 seedInfo: ");
  console.log(store.seedInfo);
  saveSeedApi(
    store.seedInfo,
    ({ data }) => {
      console.log(data);
      seedId.value = data.resdata;
      saveGame()
      // TODO: seed가 겹친다면 그 seedId를 찾아 넣어주기
    },
    (error) => console.log(error)
  );
};

const saveGame = () => {
  var gameInfo = {
    seedId: seedId.value,
    memberId: "ewq",
    difficulty: store.difficulty,
    gameTitle: gameTitle.value,
  };
  console.log("결과에서 gameInfo: ");
  console.log(gameInfo);
  saveGameApi(
    gameInfo,
    ({ data }) => {
      console.log(data);
      router.push({ name: "gamelist" });
    },
    (error) => console.log(error)
  );
};
</script>

<template>
  <div>
    <h3>게임 최종 결과!</h3>
    <h1>{{ store.score }}</h1>
    <h1>{{ store.gameSeed }}</h1>
    <button
      v-show="store.newGame"
      class="btn btn-primary btn-md me-3"
      data-bs-toggle="modal"
      data-bs-target="#gameSaveModal"
    >
      게임 저장하기
    </button>
    <button class="btn btn-primary btn-md me-3">여행 계획하기</button>
    <button class="btn btn-primary btn-md" @click="router.push({ name: 'gamehome' })">
      홈으로
    </button>
  </div>

  <!-- 게임 저장 모달 -->
  <div class="modal fade" id="gameSaveModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="d-flex justify-content-center">
          <h2 class="fw-bold">게임 저장</h2>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <h5>제목을 입력해주세요.</h5>
            <input v-model="gameTitle" class="form-control" type="text" />
          </div>

          <div class="d-flex justify-content-center">
            <button
              type="button"
              @click="saveSeed"
              data-bs-dismiss="modal"
              class="btn btn-outline-success me-2"
            >
              확인
            </button>
            <button type="button" data-bs-dismiss="modal" class="btn btn-outline-success me-2">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 결과 모달 끝 -->
</template>

<style scoped></style>

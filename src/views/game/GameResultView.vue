<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import { useMemberStore } from "@/stores/memberStore";
import { saveGameApi, saveSeedApi, updateScoreApi } from "@/api/game.js";
const router = useRouter();
const memberStore = useMemberStore();
const store = useGameStore();

onMounted(() => {
  console.log(store.seedInfo);
  updateScoreApi(
    memberStore.token,
    {
      member_id: memberStore.member_id,
      amount: store.score,
    },
    ({ data }) => console.log(data),
    (error) => console.log(error)
  );
});

const seedId = ref();
const gameTitle = ref();
const saveSeed = () => {
  saveSeedApi(
    store.seedInfo,
    ({ data }) => {
      console.log(data);
      seedId.value = data.resdata;
      saveGame();
      // TODO: seed가 겹친다면 그 seedId를 찾아 넣어주기
    },
    (error) => console.log(error)
  );
};

const saveGame = () => {
  var gameInfo = {
    seedId: seedId.value,
    memberId: memberStore.member_id,
    difficulty: store.difficulty,
    gameTitle: gameTitle.value,
  };

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
  <div class="container d-flex" style="height: 600px">
    <div class="row justify-content-center align-self-center w-100">
      <div class="col-lg-6 text-center">
        <h2>게임 최종 결과!</h2>
        <div class="result-score">{{ store.score }}</div>
        <h1>{{ store.gameSeed }}</h1>
        <button
          v-show="store.newGame"
          class="btn btn-primary btn-md me-3"
          data-bs-toggle="modal"
          data-bs-target="#gameSaveModal"
        >
          게임 저장하기
        </button>
        <button class="btn btn-primary btn-md me-3" @click="router.push({ name: 'planwrite' })">
          여행 계획하기
        </button>
        <button class="btn btn-primary btn-md" @click="router.push({ name: 'gamehome' })">
          홈으로
        </button>
      </div>
    </div>
  </div>
  <img class="confetti confetti1" src="/src/assets/img/icn/icn_confetti.png" />
  <img class="confetti confetti2" src="/src/assets/img/icn/icn_confetti2.png" />
  <!-- <img class="confetti3" src="/src/assets/img/icn/icn_confetti3.png" /> -->

  <!-- 게임 저장 모달 -->
  <div class="modal fade" id="gameSaveModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="d-flex justify-content-center">
          <h1 class="fw-bold">게임 저장</h1>
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

<style scoped>
.result-score {
  font-size: 75px;
  font-weight: bold;
}
.confetti {
  position: absolute;
  width: 200px;
  opacity: 0;
  animation: confettiAnimation 1s ease-in-out forwards;
}
.confetti1 {
  top: 40%;
  right: 25%;
}
.confetti2 {
  top: 20%;
  left: 28%;
}
.confetti3 {
  top: 50%;
  left: 25%;
}
@keyframes confettiAnimation {
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import { useMemberStore } from "@/stores/memberStore";
import { saveGameApi, saveSeedApi } from "@/api/game.js";
import VMakeMap from "/src/components/game/VMakeMap.vue";
const memberStore = useMemberStore();
const store = useGameStore();
const router = useRouter();

const seedId = ref();
const gameTitle = ref();
const saveSeed = () => {
  console.log("결과에서 seedInfo: ");
  console.log(store.seedInfo);
  saveSeedApi(
    store.seedInfo,
    ({ data }) => {
      seedId.value = data.resdata;
      // TODO: seed가 겹친다면 그 seedId를 찾아 넣어주기
      saveGame();
    },
    (error) => console.log(error)
  );
};

const saveGame = () => {
  var gameInfo = {
    seedId: seedId.value,
    memberId: memberStore.member_id,
    gameTitle: gameTitle.value,
  };
  console.log("결과에서 gameInfo: ");
  console.log(gameInfo);
  saveGameApi(
    gameInfo,
    () => {
      router.push({ name: "gamelist" });
    },
    (error) => console.log(error)
  );
};
</script>

<template>
  <div>
    <h1 class="d-inline">게임 만들기</h1>
    <button @click="saveSeed" style="float: right" class="btn btn-primary btn-md me-3 p-1">
      게임 저장
    </button>
    <input
      v-model="gameTitle"
      type="text"
      class="mt-3 form-control mb-3"
      placeholder="게임 제목을 입력해주세요."
    />
    <VMakeMap />
  </div>
</template>

<style scoped></style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import { useMemberStore } from "@/stores/memberStore";
import { saveGameApi, saveSeedApi } from "@/api/game.js";
import VMakeMap from "@/components/game/VMakeMap.vue";
import { oops } from "@/util/sweetAlert.js";

const memberStore = useMemberStore();
const store = useGameStore();
const router = useRouter();

const seedId = ref();
const gameTitle = ref();
const saveSeed = () => {
  console.log("결과에서 seedInfo: ");
  console.log(store.seedInfo);

  if (store.seedInfo.count < 3) {
    oops("장소를 3개 이상 10개 이하 선택해주세요!");
    return;
  }

  if(!gameTitle.value){
    oops("게임 제목을 입력해주세요.")
  }else{
    saveSeedApi(
      store.seedInfo,
      ({ data }) => {
        seedId.value = data.resdata;
        // TODO: seed가 겹친다면 그 seedId를 찾아 넣어주기
        saveGame();
      },
      (error) => console.log(error)
    );
  }
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
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-10">
        <input
          v-model="gameTitle"
          type="text"
          class="mt-3 form-control mb-3 input-title"
          placeholder="게임 제목을 입력해주세요."
        />
        <hr>
        <VMakeMap/>
        <!-- <CustomPlan :isGame="true" style="height: 600px;"/> -->
        <button @click="saveSeed" class="btn btn-outline-success mt-3 p-2 align-center ">
          게임 저장
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-title{
  border-width: 0; 
  font-size: 18pt;
}
.align-center{
  display: block; 
  margin: 0 auto
}
</style>

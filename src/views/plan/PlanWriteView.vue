<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import { useMemberStore } from "@/stores/memberStore.js";
import { insertPlanApi } from "@/api/plan.js";
import { saveSeedApi } from "@/api/game";
import PlanMap from "@/components/plan/PlanMap.vue";
import { oops } from "@/util/sweetAlert.js";
import { Axios } from "@/util/http-commons.js";

const api = Axios();
const memberStore = useMemberStore();
const gameStore = useGameStore();
const router = useRouter();

const file = ref();
const planInfo = ref({})
// planInfo : title, content, memberId, distance, estimatedTime, seedInfo

onMounted(() => {
  console.log(gameStore.gameList)
})
const submitSeed = async () => {
  return await api.post("/seed", {
          keyword: gameStore.seedInfo.keyword,
          count: gameStore.seedInfo.count,
          seedInfo: gameStore.seedInfo.seedInfo
        },
        {
          headers: {
            access_token: memberStore.access_token
          }
        }
      )
      .then((res) => {
        if(res.status == 200) {
          return res.data.resdata;
        }
        oops("시드를 저장하는데 문제가 발생했습니다.");
      })
}

const submit = async () => {
  if(!gameStore.seedInfo.isOk) {
    oops("길찾기 버튼을 눌러주세요");
    return;
  }
  const seedId = await submitSeed();
  console.log(seedId);

  planInfo.value.estimateTime = gameStore.seedInfo.duration;
  planInfo.value.distance = gameStore.seedInfo.distance;
  planInfo.value.seedId = seedId;
  planInfo.value.memberId = memberStore.member_id;

  const formData = new FormData();
  formData.append("file", file.value.files[0])
  formData.append("data", new Blob([JSON.stringify(planInfo.value)], { type: "application/json" }))

  // saveSeedApi(seedInfo, ({data}) => {
  //    insertPlanApi()
  // }, error => alert(error))
  
  insertPlanApi(formData, ({data}) => {
    console.log(data)
    router.push({name: 'plan'})
  }, (error) => {
    console.log(error)
    alert("에러가 발생했습니다. 다시 시도해주세요.")
  })
}
</script>

<template>
   <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-10">
        <div>
          <input 
            v-model="planInfo.planTitle" 
            placeholder="제목을 입력해주세요" 
            class="form-control mb-3 title" 
            type="text">
        </div>
        
        <hr>
        <PlanMap :is-detail="false" :gameList="gameStore.gameList" style="height: 600px"/>
        
        <input class="form-control mt-3 mb-3" @change="addFile" ref="file" type="file">
        <textarea placeholder="본문을 입력해주세요" rows="10" class="form-control " v-model="planInfo.planContent"></textarea>
        <button @click="submit" class="btn btn-outline-success btn-md mt-3 align-center">작성하기</button>

      </div>
    </div>
  </div>
</template>

<style scoped>
.title{
  border-width: 0; 
  font-size: 18pt;
}
.align-center{
  display: block; 
  margin: 0 auto
}
</style>

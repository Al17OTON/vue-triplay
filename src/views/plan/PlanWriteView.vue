<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/gameStore";
import { insertPlanApi } from "@/api/plan.js";
import { saveSeedApi } from "@/api/game";
const store = useGameStore();
const router = useRouter();

const file = ref();
const planInfo = ref({})
// planInfo : title, content, memberId, distance, estimatedTime, seedInfo

const addFile = () => {
  console.log(file.value.files)
}

const submit = () => {
  planInfo.value.estimateTime = "1시간"
  planInfo.value.distance = "143km"
  planInfo.value.seedId = 6
  planInfo.value.memberId = "ewq"

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
  <div class="container mt-5">
    <h1>PLAN WRITE</h1>
    <button @click="submit" class="btn btn-primary btn-md mb-3">작성하기</button>
    <input v-model="planInfo.planTitle" placeholder="제목을 입력해주세요" class="form-control mb-3" type="text">
    <textarea class="form-control mb-3" v-model="planInfo.planContent"></textarea>
    <input class="form-control" @change="addFile" ref="file" type="file">
  </div>
</template>

<style scoped>

</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { getPlanApi, deletePlanApi, updateHitApi     } from '@/api/plan';
import { searchKeywordApi, createListFromSeedApi } from '@/api/kakaomap';
import { useGameStore } from '@/stores/gameStore';
import PlanMap from '@/components/plan/PlanMap.vue';
import VPlanPlaceItem from '@/components/plan/VPlanPlaceItem.vue';
const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();

const plan = ref({})
onMounted(() => {
  console.log(route.query.planId)
  updateHitApi(route.query.planId, ({data}) => {
    console.log(data)
  }, error => console.log(error))
  getPlanApi(route.query.planId, ({data}) => {
    console.log(data)
    plan.value = data.resdata
    // seed n : {x : 127.11024293202674, y : 37.394348634049784}
    searchKeywordApi(
      {query: plan.value.keyword},
      ({data}) => {
        console.log(data)
        plan.value.placeList = createListFromSeedApi(plan.value.seedInfo, data.documents)
        gameStore.gameList = plan.value.placeList 
        console.log(plan.value.placeList)
      }, error => console.log(error))
  }, (error) => console.log(error))
})

const deletePlan = () => {
  deletePlanApi(plan.value.planId, ({data}) => {
    console.log(data)
    router.push({name: 'planlist'})
  }, (error) => console.log(error))
}
</script>
<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-10"> 
        <h1 class="fw-bold">{{plan.planTitle}}</h1> 
        
        <div class="mt-3 mb-3">
          {{ plan.registerTime }}
          <span class="p-3">|</span>
          {{ plan.memberId }}
          <span class="p-3">|</span>
          조회수 &nbsp; &nbsp;{{ plan.hit }}
        </div>
        
        <div class="d-flex mb-4 mt-4">
          <PlanMap :is-detail="true" :gameList="plan.placeList " class="flex-fill" style="width: 100%; height: 500px"/>
          <div class="ps-3" style="width: 500px">
            예상 소요 시간 : {{plan.estimateTime }} <br>
            이동 거리 : {{ plan.distance }}
            <VPlanPlaceItem :place="place" v-for="place in plan.placeList" :key="place.id"/>
          </div>
        </div>
        <div>
          {{ plan.planContent }}
        </div>
        <div>
          <button @click="router.push({name: 'plan'})" class="btn btn-outline-secondary" style="float:right">목록으로</button>
          <button 
            data-bs-toggle="modal"
            data-bs-target="#deleteModal" 
            class="btn btn-outline-danger me-1" 
            style="float:right">삭제</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 삭제 모달 -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-4">
        <div class="modal-body ">
          <div class="mb-3 d-flex flex-column align-items-center">
            <h5><b>삭제된 글은 복구할 수 없습니다.</b></h5>
            <h5>삭제하시겠습니까?</h5>
          </div>
          
          <div class="d-flex justify-content-center">
            <button
              @click="deletePlan"
              type="button"
              class="btn btn-outline-primary me-2"
              data-bs-dismiss="modal">
              확인
            </button>
            <button data-bs-dismiss="modal" type="button" class="btn btn-outline-danger">취소</button>

          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 삭제 모달 끝 -->
</template>

<style scoped>

</style>

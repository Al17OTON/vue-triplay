<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPlanApi, deletePlanApi, updateHitApi     } from '@/api/plan';
import { searchKeywordApi, createListFromSeedApi } from '@/api/kakaomap';
import { useGameStore } from '@/stores/gameStore';
import { addMemo } from '@/util/memo.js';
import PlanMap from '@/components/plan/PlanMap.vue';
import MemoList from '@/components/plan/MemoList.vue';
import VPlanPlaceItem from '@/components/plan/VPlanPlaceItem.vue';
const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();

const memoSwitch = ref(false);
const rootSwitch = ref(false);
const planId = ref();
const plan = ref({})
onMounted(() => {
  memoSwitch.value = true;  //댓글 컴포넌트의 watch를 활성화하기위해 이렇게 해주기
  planId.value = route.query.planId;
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

const setRoot = () => {
  rootSwitch.value = !rootSwitch.value;
}

</script>
<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-10">
        <h1 class="fw-bold">{{ plan.planTitle }}</h1>

        <div class="mt-3 mb-3">
          {{ plan.registerTime }}
          <span class="p-3">|</span>
          {{ plan.memberId }}
          <span class="p-3">|</span>
          조회수 &nbsp; &nbsp;{{ plan.hit }}
        </div>

        <div class="d-flex mb-4 mt-4">
          <PlanMap
            :is-detail="true"
            :gameList="plan.placeList"
            class="flex-fill"
            style="width: 100%; height: 550px"
          />
          <div class="left-info ps-3" style="width: 500px; height: 100%">
            <div class="mb-3">
              <table>
                <tr>
                  <td>예상 소요 시간 🕒</td>
                  <td>
                    <b>{{ plan.estimateTime }}</b>
                  </td>
                </tr>
                <tr>
                  <td>이동 거리 📍🚗</td>
                  <td>
                    <b>{{ plan.distance }}</b>
                  </td>
                </tr>
              </table>
            </div>

            <div class="scroll-wrapper">
              <VPlanPlaceItem
                :index="index"
                :place="place"
                v-for="(place, index) in plan.placeList"
                :key="place.id"
              />
            </div>
          </div>
        </div>
        <div>
          {{ plan.planContent }}
        </div>
        <div>
          <button
            @click="router.push({ name: 'plan' })"
            class="btn btn-outline-secondary"
            style="float: right"
          >
            목록으로
          </button>
          <button
            data-bs-toggle="modal"
            data-bs-target="#deleteModal" 
            class="btn btn-outline-danger me-1" 
            style="float:right">삭제</button>
            <button 
            @click="setRoot"
            class="btn btn-outline-secondary me-1" 
            style="float:right">댓글</button>

        </div>
      </div>
    </div>
  </div>

  <MemoList :plan_id="planId" :update="memoSwitch" :setRoot="rootSwitch"/>

  <!-- 삭제 모달 -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-4">
        <div class="modal-body">
          <div class="mb-3 d-flex flex-column align-items-center">
            <h5><b>삭제된 글은 복구할 수 없습니다.</b></h5>
            <h5>삭제하시겠습니까?</h5>
          </div>

          <div class="d-flex justify-content-center">
            <button
              @click="deletePlan"
              type="button"
              class="btn btn-outline-primary me-2"
              data-bs-dismiss="modal"
            >
              확인
            </button>
            <button data-bs-dismiss="modal" type="button" class="btn btn-outline-danger">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 삭제 모달 끝 -->
</template>

<style scoped>
td {
  padding: 8px;
}
.left-info {
  border-radius: 5px;
  /* background-color: #e7e8e9; */
  padding: 5px;
}
.scroll-wrapper {
  width: 100%;
  height: 450px;
  padding: 10px;
  overflow-y: auto; /* 세로 스크롤만 허용 */
  /* border: 1px solid #ccc;*/
}
</style>

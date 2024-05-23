<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPlanApi, deletePlanApi, updateHitApi } from "@/api/plan";
import { useGameStore } from "@/stores/gameStore";
import { useMemberStore } from "@/stores/memberStore";
import { addMemo } from "@/util/memo.js";
import PlanMap from "@/components/plan/PlanMap.vue";
import MemoList from "@/components/plan/MemoList.vue";
import VPlanPlaceItem from "@/components/plan/VPlanPlaceItem.vue";
import VGptModal from "@/components/plan/VGptModal.vue";
import { OpenApiUtil } from "@/assets/js/OpenApiUtil";
import { PlaceFindById } from "@/util/http-commons.js";

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const memberStore = useMemberStore();

const memoSwitch = ref(false);
const rootSwitch = ref(false);
const planId = ref();
const plan = ref({});
const gptPlace = ref({
  place_name: "",
});
const gptInfo = ref("...");

onMounted(async () => {
  // searchIdApi(
  //   "186032184",
  //   (res) => {
  //     console.log(res);
  //     console.log(res.data);
  //   },
  //   (error) => console.log(error)
  // );
  memoSwitch.value = true; //댓글 컴포넌트의 watch를 활성화하기위해 이렇게 해주기
  planId.value = route.query.planId;
  console.log(route.query.planId);
  updateHitApi(
    route.query.planId,
    ({ data }) => {},
    (error) => console.log(error)
  );

  gameStore.gameList = await getPlace();
  // console.log(gameStore.gameList);
  // getPlanApi(
  //   route.query.planId,
  //   ({ data }) => {
  //     console.log(data);
  //     plan.value = data.resdata;
  //     // seed n : {x : 127.11024293202674, y : 37.394348634049784}
  //     searchKeywordApi(
  //       { query: plan.value.keyword, page: plan.value.seedInfo[0] },
  //       ({ data }) => {
  //         plan.value.placeList = createListFromSeedApi(
  //           plan.value.seedInfo.substring(2),
  //           data.documents
  //         );
  //         gameStore.gameList = plan.value.placeList;
  //       },
  //       (error) => console.log(error)
  //     );
  //   },
  //   (error) => console.log(error)
  // );
});

const getPlace = async () => {
  return await getPlanApi(route.query.planId, async ({ data }) => {
    // console.log(data);
    plan.value = data.resdata;
    const ids = plan.value.seedInfo.split(" ");
    // console.log(ids);
    let placeInfo = [];
    plan.value.placeList = [];
    for (var i = 0; i < ids.length; i++) {
      if (i == ids.length - 1) break;
      const place = await PlaceFindById(ids[i]);
      place.id = ids[i];
      // place.location = {x:0, y:0};
      placeInfo.push(place);
      plan.value.placeList.push(place);
    }
    return placeInfo;
  });
};

const deletePlan = () => {
  deletePlanApi(
    plan.value.planId,
    ({ data }) => {
      console.log(data);
      router.push({ name: "planlist" });
    },
    (error) => console.log(error)
  );
};

const setRoot = () => {
  rootSwitch.value = !rootSwitch.value;
};

const clickPlace = async (place) => {
  gptPlace.value = place.place_name ? place.place_name : place.title;
  gptInfo.value = "...";
  gptInfo.value = await OpenApiUtil.prompt(
    `${place.address_name ? place.address_name : place.address}에 위치한 ${
      gptPlace.value
    }에 대한 설명 3줄 요약해줘`
  );
};
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
          <div class="left-info ps-3" style="width: 550px; height: 100%">
            <div>
              <table>
                <tr>
                  <td>예상 소요 시간 🕒</td>
                  <td>
                    <b style="font-size: 20px">{{ plan.estimateTime }}</b>
                  </td>
                </tr>
                <tr>
                  <td>이동 거리 📍🚗</td>
                  <td>
                    <b style="font-size: 20px">{{ plan.distance }}</b>
                  </td>
                </tr>
              </table>
            </div>

            <div class="scroll-wrapper">
              <VPlanPlaceItem
                @click="clickPlace(place)"
                :index="index"
                :place="place"
                v-for="(place, index) in plan.placeList"
                :key="place.place_name"
              />
            </div>
          </div>
        </div>
        <div>
          {{ plan.planContent }}
        </div>
        <VGptModal :place="gptPlace" :info="gptInfo" />
        <div class="mb-2">
          <button
            @click="router.push({ name: 'plan' })"
            class="btn btn-outline-secondary"
            style="float: right"
          >
            목록으로
          </button>
          <button
            v-if="plan.memberId === memberStore.member_id"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
            class="btn btn-outline-danger me-1"
            style="float: right"
          >
            삭제
          </button>
          <button @click="setRoot" class="btn btn-outline-secondary me-1" style="float: right">
            댓글
          </button>
        </div>
      </div>
    </div>
  </div>

  <MemoList :plan_id="planId" :update="memoSwitch" :setRoot="rootSwitch" />

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
  padding: 8px;
  overflow-y: auto; /* 세로 스크롤만 허용 */
  /* border: 1px solid #ccc;*/
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { getPlanListApi } from "@/api/plan";
import { useRouter } from "vue-router";
import axios from "axios";
import VPlanListItem from "/src/components/plan/VPlanListItem.vue";
const planList = ref();
const router = useRouter();

onMounted(async () => {
  await getPlanListApi(
    ({ data }) => {
      console.log(data);
      planList.value = data.resdata;
    },
    (error) => console.log(error)
  );
});

const loadingImg = ref("");
// 요청 인터셉터
axios.interceptors.request.use(
  function (config) {
    loadingImg.value = "loading.png";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axios.interceptors.response.use(
  function (response) {
    loadingImg.value = "";
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
</script>

<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-10">
        <h1 class="title">여행 계획 게시판</h1>
        <button
          @click="router.push({ name: 'plancustom' })"
          style="float: right"
          class="row btn btn-outline-success"
        >
          작성하기
        </button>
        <div class="row" v-if="loadingImg !== ''">
          <img src="/src/assets/img/icn/loading.gif" alt="" />
        </div>
        <div class="row row-cols-1 row-cols-md-2 mt-5 g-4" v-else>
          <VPlanListItem
            style="cursor: pointer"
            v-for="plan in planList"
            :key="plan.planId"
            :plan="plan"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  display: flex;
  justify-content: center;
}
</style>

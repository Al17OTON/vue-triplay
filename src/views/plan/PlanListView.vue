<script setup>
import { ref, onMounted } from "vue";
import { getPlanListApi } from "@/api/plan";
import VPlanListItem from "/src/components/plan/VPlanListItem.vue";
const planList = ref();

onMounted(() => {
  getPlanListApi(
    ({ data }) => {
      console.log(data);
      planList.value = data.resdata;
    },
    (error) => console.log(error)
  );
});
</script>

<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-lg-10">
        <h1 class="title">여행 계획 게시판</h1>
        <div class="row row-cols-1 row-cols-md-2 mt-3 g-4">
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

<script setup>
import { useRouter } from "vue-router";
import VKeywordItem from "./VKeywordItem.vue";
const router = useRouter();
defineProps({
  plan: Object,
});

const thumbnail = "/src/assets/img/darksky.jpg";
const fileUrl = import.meta.env.VITE_API_URL + "plan";

const getImageUrl = (file) => {
  if (file && file.saveFolder && file.saveFile) {
    return fileUrl + `/${file.saveFolder}/${file.saveFile}`;
  }
  return thumbnail;
};

const moveDetail = (planId) => {
  router.push({ name: "plandetail", query: { planId: planId } });
};
</script>
<template>
  <div>
    <div @click="moveDetail(plan.planId)" class="card mb-3" style="max-width: 540px">
      <div class="row g-0">
        <div class="col-md-4">
          <img :src="getImageUrl(plan.file)" style="height: 100%" class="rounded-start img-fluid" />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{{ plan.planTitle }}</h5>
            <p class="card-text">
              <small class="text-muted">작성자 &nbsp;|&nbsp;{{ plan.memberId }}</small>
            </p>
            <p class="card-text">
              <VKeywordItem :keyword="plan.keyword" />
            </p>
            <p class="card-text">
              {{ plan.planContent }}
            </p>
            <p class="card-text">
              <small class="text-muted">{{ plan.registerTime }}</small>
              <small class="text-muted" style="float: right">조회수 &nbsp;{{ plan.hit }}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

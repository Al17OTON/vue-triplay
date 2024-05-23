<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import VKeywordItem from "./VKeywordItem.vue";
const router = useRouter();
const props = defineProps({
  plan: Object,
});

// const fileUrl = import.meta.env.VITE_API_URL + "plan";
const fileUrl = import.meta.env.VITE_FILE_PATH;
const thumbnail = computed(() => {
  console.log(props.plan.file)
  return props.plan.file ? getImageUrl(props.plan.file) : "/src/assets/img/bg/bg_default.jpg";
}) 

const getImageUrl = (file) => {
  if (file && file.saveFolder && file.saveFile) {
    return fileUrl + `/${file.saveFolder}/${file.saveFile}`;
  }
  return "/src/assets/img/bg/bg_default.jpg";
};

const moveDetail = (planId) => {
  router.push({ name: "plandetail", query: { planId: planId } });
};
</script>
<template>
  <div>
    <div @click="moveDetail(plan.planId)" class="card mb-3" style="height: 230px">
      <div class="row g-0">
        <div class="col-6">
          <img
            :src="thumbnail"
            style="height: 230px; width: 270px"
            class="rounded-start img-fluid"
          />
        </div>
        <div class="col-6">
          <div class="card-body">
            <h5 class="card-title fw-bold">{{ plan.planTitle }}</h5>
            <p class="card-text">
              <p class="text-muted">작성자 &nbsp;|&nbsp; {{ plan.memberId }}</p>
            </p>
            <p class="card-text">
              <VKeywordItem :keyword="plan.keyword" />
            </p>
            <p class="card-text truncate ">
              {{ plan.planContent }}
            </p>
            <p class="card-text truncate bottom-container">
              <small class="text-muted">{{ plan.registerTime }}</small>
              <small class="text-muted" style="float: right">조회수 &nbsp;{{ plan.hit }}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.truncate {
  width: 100%; /* 원하는 너비로 설정 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bottom-container{
  display: flex;
  justify-content: space-between;
  align-items: center; /* 수직 정렬을 위해 추가 */
  width: 100%; /* 필요에 따라 조정 */
}
</style>

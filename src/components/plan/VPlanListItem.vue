<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
defineProps({
    plan: Object
})

const thumbnail = "/src/assets/img/darksky.jpg"
const fileUrl = import.meta.env.VITE_API_URL + "plan"

const getImageUrl = ((file) => {
    if (file && file.saveFolder && file.saveFile) {
        return fileUrl + `/${file.saveFolder}/${file.saveFile}`;
    }
    return thumbnail;
});

const moveDetail = (planId) => {
  router.push({name: 'plandetail', query: {planId: planId}})
}

</script>
<template>
  <div @click="moveDetail(plan.planId)">
    <img :src="getImageUrl(plan.file)" style="width: 100px; height:100px">
    {{plan.planTitle}}
    {{plan.memberId}}
    {{plan.keyword}}
    {{plan.planContent}}
    {{plan.registerTime}}
    {{plan.hit}}
  </div>
</template>

<style scoped>

</style>

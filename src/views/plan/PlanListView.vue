<script setup>
import { ref, onMounted } from 'vue';
import { getPlanListApi } from '@/api/plan';
import VPlanListItem from "/src/components/plan/VPlanListItem.vue";
const planList = ref();

onMounted(()=>{
  getPlanListApi(({data})=> {
    console.log(data)
    planList.value = data.resdata
  }, (error) => console.log(error))
})

</script>

<template>
  <div class="container">
    <h1>PLAN LIST</h1>
    <div >
      <VPlanListItem 
      style="cursor: pointer"
      v-for="plan in planList" 
      :key="plan.planId" 
      :plan="plan"/>
    </div>
  </div>
</template>

<style scoped>

</style>

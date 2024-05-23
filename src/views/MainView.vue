<script setup>
import LeaderBoard from "@/components/main/LeaderBoard.vue";
import MainCarousel from "@/components/main/MainCarousel.vue";
</script>

<template>
  <div class="container">
    <div class="split-animation">
      <MainCarousel />
    </div>
    <div class="split-animation">
      <LeaderBoard />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.split-animation {
  animation: slide-up 1s ease forwards;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px); /* 시작 위치 */
  }
  to {
    opacity: 1;
    transform: translateY(0); /* 최종 위치 */
  }
}
</style>

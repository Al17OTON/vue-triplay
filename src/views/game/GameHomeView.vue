<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

</script>

<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
        <div class="col">
          <div
            class="clickable card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card1"
          >
            <div 
              @click="router.push({name: 'gameinfo'})" 
              class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h2 class=" pt-5 mt-5 mb-4 display-6 lh-1 fw-bold" value="1">게임하기</h2>
            </div>
          </div>
        </div>

        <div class="col">
          <div
            class="clickable card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card2"
          >
            <div
              @click="router.push({name: 'gamemake'})"  
              class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h2 class=" pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">게임 만들기</h2>
            </div>
          </div>
        </div>

        <div class="col">
          <div
            class="clickable card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card3"
          >
            <div
              @click="router.push({name: 'gamelist'})"   
              class="d-flex flex-column h-100 p-5 pb-3 text-shadow-1">
              <h2 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">게임 둘러보기</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clickable{
  cursor: pointer
}
</style>

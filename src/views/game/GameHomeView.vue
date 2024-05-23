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
            id="game1"
          >
            <div
              @click="router.push({ name: 'gameinfo' })"
              class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1"
            >
              <h2 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold" value="1">게임하기</h2>
            </div>
          </div>
        </div>

        <div class="col">
          <div
            class="clickable card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="game2"
          >
            <div
              @click="router.push({ name: 'gamemake' })"
              class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1"
            >
              <h2 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">게임 만들기</h2>
            </div>
          </div>
        </div>

        <div class="col">
          <div
            class="clickable card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="game3"
          >
            <div
              @click="router.push({ name: 'gamelist' })"
              class="d-flex flex-column h-100 p-5 pb-3 text-shadow-1"
            >
              <h2 class="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">게임 둘러보기</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#game1 {
  background-image: url("@/assets/img/bg/bg_btn1.jpg");
}
#game2 {
  background-image: url("@/assets/img/bg/bg_btn2.jpg");
}
#game3 {
  background-image: url("@/assets/img/bg/bg_btn3.jpg");
}
.clickable {
  cursor: pointer;
}

.clickable div:hover{ /* img 마우스 오버시*/
  cursor:pointer;
  transform:scale(1.1); /* 마우스 오버시 이미지 크기를 1.1 배만큼 확대시킨다. */
  -o-transform:scale(1.1); -moz-transform:scale(1.1);
  -webkit-transform:scale(1.1);
  transition: transform .35s;    
  -o-transition: transform .35s;-moz-transition: transform .35s;-webkit-transition: transform .35s; /* 마우스 오버시 이미지가 즉시 커지지않고 30.5 second 의 시간에 걸쳐 커진다 애니메이션 효과*/
}
</style>

<script setup></script>

<template>
  <div>
    <div class="container px-4 py-5" id="custom-cards">
      <h2 class="pb-2 border-bottom top">국내 인기 여행지 TOP 3</h2>

      <div class="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
        <div class="col best">
          <div
            class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card1"
          >
            <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h2 class="bestinfo pt-5 mt-5 mb-4 display-6 lh-1 fw-bold" value="1">서울</h2>
            </div>
          </div>
        </div>

        <div class="col best">
          <div
            class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card2"
          >
            <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h2 class="bestinfo pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">부산</h2>
            </div>
          </div>
        </div>

        <div class="col best">
          <div
            class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card3"
          >
            <div class="d-flex flex-column h-100 p-5 pb-3 text-shadow-1">
              <h2 class="bestinfo pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">제주</h2>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container px-4 py-5" id="custom-cards">
      <h2 class="pb-2 border-bottom text-end top">인기 키워드 BEST 3</h2>

      <div class="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
        <div class="col best">
          <div
            class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card4"
          >
            <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h2 class="bestinfo pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">관광지</h2>
            </div>
          </div>
        </div>

        <div class="col best">
          <div
            class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card5"
          >
            <div class="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
              <h2 class="bestinfo pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">숙박</h2>
            </div>
          </div>
        </div>

        <div class="col best">
          <div
            class="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg"
            id="card6"
          >
            <div class="d-flex flex-column h-100 p-5 pb-3 text-shadow-1">
              <h2 class="bestinfo pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">쇼핑</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#card1 {
  background-image: url("@/assets/img/1.png");
}
#card2 {
  background-image: url("@/assets/img/2.png");
}
#card3 {
  background-image: url("@/assets/img/3.png");
}
#card4 {
  background-image: url("@/assets/img/4.png");
}
#card5 {
  background-image: url("@/assets/img/5.png");
}
#card6 {
  background-image: url("@/assets/img/6.png");
}
</style>

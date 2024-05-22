<script setup></script>

<template>
  <div>
    <div id="carouselExampleFade" class="carousel slide carousel-fade pics" data-bs-ride="carousel">
      <div class="carousel-inner" style="border-radius: 10px">
        <div class="carousel-item active">
          <img src="@/assets/img/bg/bg_map4.jpg" class="d-block w-100 h-50" alt="..." />
          <div class="text-overlay title">
            <span style="font-family: 'SokchoBadaDotum', sans-serif; font-size: 45px"
              >여행 계획을 더 재미있게!</span
            >
            <br />
            <span style="font-size: 25px">게임을 통해 여행 계획을 세워보세요</span>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@/assets/img/bg/bg_map3.jpg" class="d-block w-100" alt="..." />
          <div class="text-overlay title">
            <span style="font-family: 'SokchoBadaDotum', sans-serif; font-size: 45px"
              >여행 계획을 더 재미있게!</span
            >
            <br />
            <span style="font-size: 27px">게임을 통해 여행 계획을 세워보세요</span>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@/assets/img/bg/bg_map2.jpg" class="d-block w-100" alt="..." />
          <div class="text-overlay title">
            <span style="font-family: 'SokchoBadaDotum', sans-serif; font-size: 45px"
              >여행 계획을 더 재미있게!</span
            >
            <br />
            <span style="font-size: 27px">게임을 통해 여행 계획을 세워보세요</span>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.carousel-item {
  max-width: 100%;
  max-height: 500px;
  height: auto;
  position: relative;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  /* font-weight: bold; */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  z-index: 10;
  pointer-events: none; /* 마우스 이벤트가 이미지로 전달되도록 */
  text-align: center;
  font-family: "SokchoBadaDotum", sans-serif;
}
</style>

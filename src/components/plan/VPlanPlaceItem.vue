<script setup>
defineProps({
  index: Number,
  place: Object,
});
</script>

<template>
  <div class="item">
    <div class="d-flex">
      <h3>{{ index + 1 }}</h3>
      <div class="flex-fill ms-2 vertical-container">
        <span class="place-name">{{ place.place_name }}</span>
        {{ place.address_name }}
      </div>
      <button
        data-bs-toggle="modal" data-bs-target="#gptModal"
        class="ms-2 btn btn-success" 
        style="margin: auto 0">
        🤖💬
      </button>
    </div>
  </div>
</template>

<style scoped>
.inline {
  display: inline-block;
}
.item {
  /* border: 1px solid black; */
  border-radius: 20px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #ffffff;
  box-shadow: -3px 3px 5px 3px rgba(0, 0, 0, 0.3);
}
.place-name {
  font-size: 20px;
  font-weight: bold;
}
.vertical-container {
  display: flex;
  flex-direction: column; /* 세로 방향으로 쌓기 */
  justify-content: center; /* 수직 중앙 정렬 */
  gap: 5px; /* 요소 간의 간격 조정 */
}
</style>

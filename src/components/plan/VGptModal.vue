<script setup>
defineProps({
  place: Object,
});
</script>

<template>
  <!-- 게임 저장 모달 -->
  <div class="modal fade" id="gptModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-4">
        <div>
          <img src="/src/assets/img/icn/icn_close.svg" data-bs-dismiss="modal" class="close" />
          <h5 class="fw-bold">chatGPT가 알려드립니다!</h5>
        </div>
        <hr />
        <div>
          <div class="chat client">{{ place.place_name }}에 대해서 알려줘</div>

          <div class="chat gpt">
            한밭수목원은 대전의 대표적인 자연 공원으로, 다양한 종류의 나무와 식물이 있는 아름다운
            환경을 제공합니다. 이곳은 산책로와 휴식 공간을 갖추어 방문객들에게 자연 속에서의 즐거운
            시간을 선사합니다.
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 결과 모달 끝 -->
</template>

<style scoped>
.close {
  float: right;
  cursor: pointer;
}
.chat {
  padding: 8px;
  border-radius: 10px;
  display: inline;
  margin-bottom: 8px;
}
.client {
  background-color: #32f061;
  float: right;
}
.gpt {
  float: left;
  background-color: #e9e9eb;
  width: 280px;
}
</style>

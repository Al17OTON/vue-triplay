<script setup>
const props = defineProps({
  place: String,
  info: String
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
          <div class="chat client">{{ place }}에 대해 알려줘</div>

          <div class="chat gpt">
            {{info}}
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
  min-width: 180px;
  background-color: #32f061;
  float: right;
}
.gpt {
  float: left;
  background-color: #e9e9eb;
  width: 280px;
}
</style>

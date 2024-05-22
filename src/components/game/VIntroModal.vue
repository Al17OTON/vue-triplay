<script setup>
</script>

<template>
  <!-- 게임 저장 모달 -->
  <div class="modal fade" id="introModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content p-4 rounded">
      <div class="d-flex justify-content-end">
        <img src="/src/assets/img/icn/icn_close.svg" data-bs-dismiss="modal" class="close" alt="Close" />
      </div>
      <div>
        <h3 class="fw-bold text-center mb-3">게임 설명 🎮</h3>
        <hr class="my-3">
        <div class="mb-3">
          <div class="fw-bold mb-1 fs-4">< 게임 방법 ></div>
          <p>1. 지역, 난이도, 여행지 개수를 선택합니다.</p>
          <p>2. 로드뷰에서 여행지의 위치를 확인한 후, 지도에서 마커를 찍습니다.</p>
          <p>3. 선택한 여행지 개수만큼 위 과정을 반복합니다.</p>
        </div>
        <div>
          <div class="fw-bold mb-1 fs-4">< 점수 기준 ></div>
          <p>* 각 문제당 기본 점수는 1000점이며, 여행지와의 거리에 따라 점수가 결정됩니다.</p>
          <p>1. 1km 이내의 거리는 기본 점수에 추가 점수가 부여됩니다.</p>
          <p>2. 1km 초과 5km 이내일 경우 거리에 따라 점수가 차감됩니다.</p>
          <p>3. 5km를 초과한 거리는 기본 점수 없이 0점이 부여됩니다.</p>
          <p>4. 힌트 사용 시 기본 점수가 500점으로 감소합니다. (아직 처리 안함)</p>
          <p class="mb-0">⚠️ 주의! 목표지와 10km 이상 차이나면 기본점수 없이 100점이 페널티로 차감됩니다.</p>
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

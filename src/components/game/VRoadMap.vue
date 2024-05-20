<script setup>
import { onMounted } from "vue";

const props = defineProps({
  location: Object,
});

const appKey = import.meta.env.VITE_KAKAO_APPKEY;
const loadScript = () => {
  const script = document.createElement("script");
  /* global kakao */
  script.onload = () => kakao.maps.load(initMap);
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services,clusterer,drawing`;
  document.head.appendChild(script);
};

const initMap = () => {
  var roadviewContainer = document.getElementById("roadview"); //로드뷰를 표시할 div
  var roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
  var roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

  // var position = new kakao.maps.LatLng(33.450701, 126.570667);
  var position = new kakao.maps.LatLng(props.location.y, props.location.x);

  // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
  roadviewClient.getNearestPanoId(position, 800, function (panoId) {
    roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
  });
};

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    loadScript();
  }
});
</script>

<template>
  <div>
    <div id="roadview" style="width: 100%; height: 100%"></div>
  </div>
</template>

<style scoped></style>

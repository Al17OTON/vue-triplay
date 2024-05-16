<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import { useGameStore } from "@/stores/gameStore";
const store = useGameStore();
const emit = defineEmits(["moveLocation", "getDistance", "setReset"]);
const props = defineProps({
  submit: Boolean,
  reset: Boolean,
});

let map = null;
var marker = null;
var drawLine = null;
var targetMarker = null;
var defaultLocation = null;
const appKey = import.meta.env.VITE_KAKAO_APPKEY;
const currentLocation = {};

const loadScript = () => {
  const script = document.createElement("script");
  /* global kakao */
  script.onload = () => kakao.maps.load(initMap);
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services,clusterer,drawing`;
  document.head.appendChild(script);
};

const initMap = () => {
  defaultLocation = new kakao.maps.LatLng(36.35559977190671, 127.29859991863871);
  const container = document.getElementById("map");
  const options = {
    center: defaultLocation,
    level: 13, // 1~14
  };
  map = new kakao.maps.Map(container, options);

  const zoomControl = new kakao.maps.ZoomControl();
  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  var mapTypeControl = new kakao.maps.MapTypeControl();
  map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  marker = new kakao.maps.Marker({
    position: map.getCenter(), // 지도 중심좌표에 마커를 생성
  });

  marker.setMap(map); // 지도에 마커를 표시
  kakao.maps.event.addListener(map, "click", moveMarker);
};

// 제출 시 마커 지도 표시
watch(
  () => props.submit,
  (submit) => {
    if (submit) {
      // 마커 찍고 거리 구하기!
      var currentLatLng = new kakao.maps.LatLng(currentLocation.y, currentLocation.x);
      var targetLatLng = new kakao.maps.LatLng(
        store.gameList[store.id].location.y,
        store.gameList[store.id].location.x
      );

      targetMarker = new kakao.maps.Marker({
        position: targetLatLng,
      });
      targetMarker.setMap(map);

      var linePath = [currentLatLng, targetLatLng];
      var lineLine = new kakao.maps.Polyline();
      lineLine.setPath(linePath);

      drawLine = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 3,
        strokeColor: "#db4040",
        strokeOpacity: 1,
        strokeStyle: "sold",
      });

      drawLine.setMap(map);
      var distance = Math.round(lineLine.getLength()); // 거리 단위는 m(미터)
      emit("getDistance", distance);
    }
  }
);

watch(
  () => props.reset,
  (reset) => {
    if (reset) {
      console.log("?");
      drawLine.setMap(null);
      targetMarker.setMap(null);
      marker.position = new kakao.maps.LatLng(36.35559977190671, 127.29859991863871);
      marker.setMap(map);
      emit("setReset");
    }
  }
);

const moveMarker = (mouseEvent) => {
  var latlng = mouseEvent.latLng; // 클릭한 위도, 경도 정보
  marker.setPosition(latlng); // 마커 위치를 클릭한 위치로 옮김

  currentLocation.x = latlng.getLng();
  currentLocation.y = latlng.getLat();
  emit("moveLocation", latlng.getLat(), latlng.getLng());
};

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    loadScript();
  }
});

onUpdated(() => {});
</script>

<template>
  <div>
    {{ submit }}
    <div id="map" style="height: 600px"></div>
  </div>
</template>

<style scoped></style>

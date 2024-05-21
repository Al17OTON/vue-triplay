<script setup>
import { onMounted, onUpdated, watch } from "vue";
import { useGameStore } from "@/stores/gameStore";
const store = useGameStore();
const emit = defineEmits(["moveLocation", "getDistance", "setReset"]);
const props = defineProps({
  submit: Boolean,
  reset: Boolean,
  target: Boolean,
});

let map = null;
var circle = null;
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

      // var imageSrc = "/src/assets/img/icn/icn_marker.png";
      var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
      var imageSize = new kakao.maps.Size(24, 35);
      var targetMarkerImg = new kakao.maps.MarkerImage(imageSrc, imageSize);
      targetMarker = new kakao.maps.Marker({
        position: targetLatLng,
        image: targetMarkerImg,
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

// 0.01도 = 1.1km
watch(
  () => props.target,
  (target) => {
    if (target) {
      console.log(store.gameList[store.id].location);
      var targetLatLng = new kakao.maps.LatLng(
        store.gameList[store.id].location.y,
        store.gameList[store.id].location.x
      );
      var randomLatLng = getRandomLocation(targetLatLng, 5000);
      // var randomMarker = new kakao.maps.Marker({
      //   position: randomLatLng,
      // });
      // randomMarker.setMap(map);

      circle = new kakao.maps.Circle({
        center: randomLatLng, // 원의 중심좌표 입니다
        radius: 10000, // 미터 단위의 원의 반지름입니다
        strokeWeight: 2, // 선의 두께입니다
        strokeColor: "#0dd65a", // 선의 색깔입니다
        strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        fillColor: "#a3f0c0", // 채우기 색깔입니다
        fillOpacity: 0.5, // 채우기 불투명도 입니다
      });

      circle.setMap(map);
    }
  }
);

// 위도(y, Ma = 36), 경도(x, La = 127)
const getRandomLocation = (c, radius) => {
  const d2r = Math.PI / 180;
  const r2d = 180 / Math.PI;
  const earth_rad = 6378000; // Earth's radius in meters

  const r = Math.random() * radius;
  const rlat = (r / earth_rad) * r2d;
  const rlng = rlat / Math.cos(c.La * d2r);

  const theta = Math.PI * (Math.floor(Math.random() * 2) + Math.random());
  const y = c.Ma + rlng * Math.cos(theta);
  const x = c.La + rlat * Math.sin(theta);
  return new kakao.maps.LatLng(y, x);
};
watch(
  () => props.reset,
  (reset) => {
    if (reset) {
      if (circle) circle.setMap(null);

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
    <div id="map" style="width: 100%; height: 100%"></div>
  </div>
</template>

<style scoped></style>

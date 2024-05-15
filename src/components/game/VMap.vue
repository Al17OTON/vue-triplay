<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";

const props = defineProps({ 
  keyword: String,
  places: Object
});

const appKey = import.meta.env.VITE_KAKAO_APPKEY;
var markers = [];
var overlays = [];
var positions = [];
let map = null;

const loadScript = () => {
  const script = document.createElement("script");
  /* global kakao */
  script.onload = () => kakao.maps.load(initMap);
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services,clusterer,drawing`;
  document.head.appendChild(script);
};

const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(36.35559977190671, 127.29859991863871),
    level: 1,
  };
  map = new kakao.maps.Map(container, options);

  const zoomControl = new kakao.maps.ZoomControl();
  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  var mapTypeControl = new kakao.maps.MapTypeControl();
  map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
};

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    loadScript();
  }
});

onUpdated(() => {
});

</script>

<template>
  <div>
    <div id="map" style="height: 600px;"></div>
  </div>
 
</template>

<style scoped>

</style>

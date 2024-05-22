<script setup>
import { onMounted, watch, ref, nextTick } from "vue";
import { useGameStore } from "@/stores/gameStore";
import { useMemberStore } from "@/stores/memberStore";
import { KakaoPathFinder } from "@/util/http-commons.js";
import { Container, Draggable } from "vue3-smooth-dnd";
import { applyDrag, generateItems } from "@/util/dragHelper.js";
import { oops } from "@/util/sweetAlert.js";

const gameStore = useGameStore();
const memberStore = useMemberStore();
const pathFinder = KakaoPathFinder();
const emit = defineEmits([]);
const props = defineProps({
  isGame: Boolean,
});

const keyword = ref("");
const imrich = ref(false); //변경사항이 있을때마다 API호출 여부를 저장하는 변수
/**
gameStore
gameList: 플레이스 배열
-> place 객체(id, address_name, place_name, location 객체(x, y), 점수, 거리)
 */
let ps = null; //kakao 검색
let distanceOverlay = null;
let polyline = null;
let polylineDash = null;
const searchList = ref([]);
const places = ref([]);
var infowindow = null;
let map = null;
let searchMarker = [];
let placeMarker = [];
var defaultLocation = null;
const appKey = import.meta.env.VITE_KAKAO_APPKEY;
const pathResult = ref();

const loadScript = () => {
  console.log("load");
  const script = document.createElement("script");
  /* global kakao */
  script.onload = () => kakao.maps.load(initMap);
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services,clusterer,drawing`;
  document.head.appendChild(script);
};

const initMap = () => {
  console.log("init");
  defaultLocation = new kakao.maps.LatLng(36.35559977190671, 127.29859991863871);
  const container = document.getElementById("map");
  const options = {
    center: defaultLocation,
    level: 13, // 1~14
  };
  map = new kakao.maps.Map(container, options);
  ps = new kakao.maps.services.Places();
  infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
  //   const zoomControl = new kakao.maps.ZoomControl();
  //   map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  //   var mapTypeControl = new kakao.maps.MapTypeControl();
  //   map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
};

const searchKeyword = () => {
  if (!keyword.value) {
    oops("검색어를 입력해주세요.");
    return;
  }
  if (!keyword.value.replace(/^\s+|\s+$/g, "")) {
    alert("키워드를 입력해주세요!");
    return false;
  }

  searchList.value = [];
  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword.value, placesSearchCB);
};

function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    searchList.value = data;
    const kword = keyword.value.replace(" ", "_");

    for (var i = 0; i < searchList.value.length; i++) {
      searchList.value[i].keyword = kword;
    }
    // 0522 원래 코드
    // console.log(searchList.value);
    // drawMarker(searchList.value, searchMarker, false);

    // displayPlaces(data); // 검색 목록, 마커
    // displayPagination(pagination); // 페이지 번호
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    oops("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    oops("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}

//Smooth 버튼에서 사용
//지도를 부드럽게 이동 시키기, 초반에 미적 요소로 사용되기 위해 작성됨. 불안정함...
const smoothLevel = () => {
  if (places.value.length === 0) return;

  let bounds = new kakao.maps.LatLngBounds();
  for (var i = 0; i < places.value.length; i++) {
    bounds.extend(new kakao.maps.LatLng(places.value[i].y, places.value[i].x));
  }

  //위도 경도의 차를 이용해서 최적의 지도 확대 레벨을 구하기
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const subLng = ne.getLng() - sw.getLng();
  const subLat = ne.getLat() - sw.getLat();
  const center = new kakao.maps.LatLng(
    (sw.getLat() + ne.getLat()) / 2,
    (sw.getLng() + ne.getLng()) / 2
  );

  let level = 14;
  let maxLng = 4.0; //8
  let maxLat = 11.0; //20

  //적당한 레벨 구하기
  // 6 - 14
  // 3 - 13
  // 1.5 - 12
  //0.8 - 11
  //0.4 - 10
  //... 1/2 씩 줄어든다.

  // 20 - 14
  // 10 - 13
  for (; level > 0; level--) {
    if (maxLng <= subLng || maxLng <= subLat) break;
    maxLng /= 2;
    maxLat /= 2;
  }

  // zoomInChain(center, level);
  map.panTo(center);

  const panToCallback = () => {
    map.panTo(center);
    kakao.maps.event.removeListener(map, "idle", panToCallback);
  };

  const levelCallback = () => {
    map.setLevel(level, {
      animate: {
        duration: 200,
      },
    });
    kakao.maps.event.removeListener(map, "idle", levelCallback);
    kakao.maps.event.addListener(map, "idle", panToCallback);
    // setTimeout(kakao.maps.event.removeListener(map, 'idle', panToCallback), 1000);
  };

  kakao.maps.event.addListener(map, "idle", levelCallback);
};

const performPostRenderActions = (list, marker, flag) => {
  nextTick(() => {
    // dom 다 생성 후 실행
    console.log("in nextTick!" + flag);
    console.log(list);
    drawMarker(list, marker, flag);
    // drawMarker(searchList.value, searchMarker, false);
  });
};
watch(
  () => searchList.value,
  (n, o) => {
    performPostRenderActions(searchList.value, searchMarker, false);
  }
);

watch(
  () => places.value,
  (n, o) => {
    performPostRenderActions(places.value, placeMarker, true);
  }
);
// 마커에 번호를 부여하고 표시
const drawMarker = (list, marker, type) => {
  deleteMarker(marker);

  var imageSrc = type
      ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png"
      : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = type ? new kakao.maps.Size(36, 37) : new kakao.maps.Size(24, 35); // 마커 이미지의 크기
  let idx = 0;
  // console.log(list);
  for (var i = 0; i < list.length; i++) {
    var imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx++ * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    };
    var markerImage = type
        ? new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions)
        : new kakao.maps.MarkerImage(imageSrc, imageSize),
      m = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(list[i].y, list[i].x),
        title: list[i].id,
        map: map,
        image: markerImage,
      });
    marker.push(m);

    var itemEl = null;
    if (!type) {
      // element가 그려진 후에 marker를 찍어야함
      itemEl = document.getElementById(`place${i}`);
    }

    (function (marker, title) {
      kakao.maps.event.addListener(marker, "mouseover", function () {
        displayInfowindow(marker, title);
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        infowindow.close();
      });

      if (!type) {
        console.log(title);
        itemEl.onmouseover = function () {
          displayInfowindow(marker, title);
        };

        itemEl.onmouseout = function () {
          infowindow.close();
        };
      }
    })(m, list[i].place_name);
  }
};

function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

//맵에 존재하는 마커 전부 제거
const deleteMarker = (marker) => {
  for (var i = 0; i < marker.length; i++) {
    marker[i].setMap(null);
  }
  marker = [];
};

//선택된 장소들을 가지고 경로를 찾는다. 2개 이상의 장소가 선택되어야만 사용가능
const findPath = () => {
  if (places.value.length < 2) {
    oops("최소 두개 이상의 장소를 선택해야합니다.");
    if (imrich.value) imrich.value = false; //경로 자동 업데이트가 켜져있다면 끄기
    removePath();
    return;
  }

  if (places.value.length > 10) {
    oops("장소는 최대 10개만 선택 가능합니다.");
    if (imrich.value) imrich.value = false; //경로 자동 업데이트가 켜져있다면 끄기
    removePath();
    return;
  }

  let selectedPlace = places.value;

  let body = {
    origin: {
      x: selectedPlace[0].x,
      y: selectedPlace[0].y,
    },
    destination: {
      x: selectedPlace[selectedPlace.length - 1].x,
      y: selectedPlace[selectedPlace.length - 1].y,
    },
  };
  let waypoints = [];
  for (var i = 1; i < selectedPlace.length - 1; i++) {
    waypoints[i - 1] = {
      x: selectedPlace[i].x,
      y: selectedPlace[i].y,
    };
  }
  body.waypoints = waypoints;

  pathFinder
    .post("", body)
    .then((res) => {
      pathResult.value = res.data;
    })
    .then(() => drawPath())
    .catch((err) => {
      console.log(err);
      if (err.response.data.code === -2) {
        oops("최대 경유지 거리를 초과했습니다... 장소를 줄여서 다시 시도해주세요 (5개 추천)");
        return;
      }
      oops("경로를 찾는데 문제가 발생했습니다.");
    });
};

//위에 findPath로부터 결과를 받아 경로를 그린다.
//미적 요소를 위해 polyLine을 두개 사용하여 렌더링
const drawPath = () => {
  removePath();

  // let bounds = new kakao.maps.LatLngBounds();
  //토탈 시간과 거리 구하기 (sec, meter)
  const distance = pathResult.value.routes[0].summary.distance;
  const duration = pathResult.value.routes[0].summary.duration;

  const sections = pathResult.value.routes[0].sections;
  const path = []; //초기화

  // let idx = 0;
  for (var i = 0; i < sections.length; i++) {
    const roads = sections[i].roads;
    for (var j = 0; j < roads.length; j++) {
      const vertexes = roads[j].vertexes;
      for (var k = 0; k < vertexes.length; k += 2) {
        path.push(new kakao.maps.LatLng(vertexes[k + 1], vertexes[k]));
        // bounds.extend(path[idx++]);
      }
    }
  }

  //디자인 개선을 위한 이중 폴리라인... Java에서는 RouteLine을 쓸수있는데 JS는 제공X...
  polylineDash = new kakao.maps.Polyline({
    path: path, // 선을 구성하는 좌표배열 입니다
    strokeWeight: 3, // 선의 두께 입니다
    strokeColor: "#FFFFFF", // 선의 색깔입니다
    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: "longdash", // 선의 스타일입니다
    zIndex: 5,
  });

  polyline = new kakao.maps.Polyline({
    path: path, // 선을 구성하는 좌표배열 입니다
    strokeWeight: 8, // 선의 두께 입니다
    strokeColor: "#2068EF", // 선의 색깔입니다
    strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: "solid", // 선의 스타일입니다
    // endArrow: true,
    zIndex: 4,
  });

  // console.log(polyline);
  // console.log(map);

  // 지도에 선을 표시합니다
  polyline.setMap(map);
  polylineDash.setMap(map);
  smoothLevel();

  let distanceText = "";
  let durationText = "";

  const hour = Math.floor(duration / 3600); //1시간은 60초 * 60분 = 3600초
  const min = Math.floor((duration % 3600) / 60); //분은 남은 시간 중 60으로 나누어 계산
  if (distance > 1000) distanceText = (distance / 1000).toFixed(1) + "km";
  else distanceText = Math.floor((distance / 10) * 10) + "m";

  if (hour > 0) durationText = hour + "시간 ";
  durationText += min + "분";

  showDistance(getTimeHTML(distance, duration), path[path.length - 1]);
  savePlaces2Pinia(distance, duration);
  // map.setBounds(bounds);
};

//맵에 존재하는 경로 제거
const removePath = () => {
  if (polyline) polyline.setMap(null);
  if (polylineDash) polylineDash.setMap(null);
  deleteDistnce();
  gameStore.seedInfo.isOk = false;
};

// 드래그앤드랍시 이벤트
const onDrop = (num, dropResult) => {
  if (num === 1) places.value = applyDrag(places.value, dropResult);
  else searchList.value = applyDrag(searchList.value, dropResult);

  if (num === 1) drawMarker(places.value, placeMarker, true);
  else drawMarker(searchList.value, searchMarker, false);

  removePath();
};

const getChildPayload1 = (idx) => {
  return searchList.value[idx];
};
const getChildPayload2 = (idx) => {
  return places.value[idx];
};

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    loadScript();
  }
});

// 마우스 우클릭 하여 선 그리기가 종료됐을 때 호출하여
// 그려진 선의 총거리 정보와 거리에 대한 도보, 자전거 시간을 계산하여
// HTML Content를 만들어 리턴하는 함수입니다
// distance는 meter, duration은 sec
function getTimeHTML(distance, duration) {
  const hour = Math.floor(duration / 3600); //1시간은 60초 * 60분 = 3600초
  const min = Math.floor((duration % 3600) / 60); //분은 남은 시간 중 60으로 나누어 계산

  let contentHour = "";
  let distanceContent = "";
  if (hour > 0) {
    contentHour = '<span class="number">' + hour + "</span>시간 ";
  }
  let contentMin = '<span class="number">' + min + "</span>분";

  //km 단위로 표시하기
  if (distance > 1000) distanceContent = "약 " + (distance / 1000).toFixed(1) + "km";
  else distanceContent = "약 " + Math.floor((distance / 10) * 10) + "m";

  // 거리와 시간을 가지고 HTML Content를 만들어 리턴합니다
  var content = '<ul class="dotOverlay distanceInfo" ';
  content +=
    '   style="position:relative;bottom:10px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;font-size:12px;padding:5px;background: #fff;background-color:#fff;';
  content += '   top:5px;left:5px;list-style:none;margin:0;">';
  content += "    <li>";
  content +=
    '        <span class="label" style="display:inline-block;width:50px;">총거리</span><span class="number">' +
    distanceContent +
    "</span>";
  content += "    </li>";
  content += "    <li>";
  content +=
    '        <span class="label" style="display:inline-block;width:50px;">이동시간</span>' +
    contentHour +
    contentMin;
  content += "    </li>";
  content += "</ul>";

  return content;
}

function showDistance(content, position) {
  if (distanceOverlay) {
    // 커스텀오버레이가 생성된 상태이면

    // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
    distanceOverlay.setPosition(position);
    distanceOverlay.setContent(content);
  } else {
    // 커스텀 오버레이가 생성되지 않은 상태이면

    // 커스텀 오버레이를 생성하고 지도에 표시합니다
    distanceOverlay = new kakao.maps.CustomOverlay({
      map: map, // 커스텀오버레이를 표시할 지도입니다
      content: content, // 커스텀오버레이에 표시할 내용입니다
      position: position, // 커스텀오버레이를 표시할 위치입니다.
      xAnchor: 0,
      yAnchor: 0,
      zIndex: 3,
    });
  }
}

// 그려지고 있는 선의 총거리 정보와
// 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
function deleteDistnce() {
  if (distanceOverlay) {
    distanceOverlay.setMap(null);
    distanceOverlay = null;
  }
}

const savePlaces2Pinia = (distance, duration) => {
  // let seed = `${gameStore.page} `;
  let seed = "";
  let cnt = 0;
  for (var i = 0; i < places.value.length; i++) {
    seed += `${places.value[i].id} `;
    cnt++;
  }
  console.log(places.value);
  console.log(seed);
  gameStore.seedInfo.isOk = true;
  gameStore.seedInfo.seedInfo = seed;
  gameStore.seedInfo.count = cnt;
  gameStore.seedInfo.distance = distance;
  gameStore.seedInfo.duration = duration;
};
</script>

<template>
  <div>
    <div class="map_wrap">
      <!--카카오맵이 표시되는 영역-->
      <div id="map" style="width: 100%; height: 100%; position: relative; overflow: hidden"></div>

      <!--카카오 맵에 표시되는 관광정보 리스트 view-->
      <div id="menu_wrap" class="menu_wrap">
        <div class="input-group mb-3">
          <input
            v-model="keyword"
            type="text"
            class="form-control p-2"
            placeholder="검색어 입력"
            aria-label="KeyWord"
            aria-describedby="button-addon2"
          />
          <button
            @click="searchKeyword"
            class="btn btn-secondary p-2"
            type="button"
            id="button-addon2"
          >
            검색
          </button>
        </div>
        <div class="option custom-container-height">
          <Container
            group-name="1"
            :get-child-payload="getChildPayload1"
            @drop="onDrop(2, $event)"
            style="height: 100%"
          >
            <Draggable v-for="(item, idx) in searchList" :key="item.id">
              <div
                :id="`place${idx}`"
                :class="{ 'draggable-item': true }"
                style="padding: 10px; margin-bottom: 8px"
                class="place-item"
              >
                <div class="fw-bold">{{ item.place_name }}</div>
                <div style="font-size: 13px">{{ item.address_name }}</div>
              </div>
            </Draggable>
          </Container>
        </div>
        <hr />
        <ul id="placesList"></ul>
        <div id="pagination"></div>
      </div>

      <div id="menu_wrap_second" class="menu_wrap">
        <div class="option custom-container-height">
          <Container
            group-name="1"
            :get-child-payload="getChildPayload2"
            @drop="onDrop(1, $event)"
            style="height: 100%"
          >
            <Draggable v-for="item in places" :key="item.id">
              <div
                :class="{ 'draggable-item': true }"
                style="padding: 10px; margin-bottom: 8px"
                class="place-item"
              >
                <div class="fw-bold">{{ item.place_name }}</div>
                <div style="font-size: 13px">{{ item.address_name }}</div>
              </div>
            </Draggable>
          </Container>
        </div>
        <hr />
        <ul id="placesList"></ul>
        <div id="pagination"></div>
      </div>

      <div id="button_wrap">
        <div>
          <button @click="smoothLevel" type="button" class="btn btn-success p-2">Smooth</button>
        </div>
        <!-- <div class="form-check form-switch custom_switch">
                    <input v-model="imrich" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                    <label class="form-check-label" for="flexSwitchCheckDefault">경로 자동 갱신</label>
                </div> -->
        <div v-if="!isGame">
          <button
            @click="findPath"
            type="button"
            class="btn btn-success p-2"
            style="margin-left: 15px"
          >
            길찾기
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- <div id="infoOverlay" :class="{'dotOverlay' : false, 'distanceInfo' : true}" v-show="pathInfo.isShow">
    <span>{{ pathInfo.d }}</span>
</div> -->
</template>

<style scoped>
.place-item {
  background: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 5px;
}
/*카카오 맵에서 사용하는 CSS - start*/
.map_wrap,
.map_wrap * {
  margin: 0;
  padding: 0;
}
.map_wrap a,
.map_wrap a:hover,
.map_wrap a:active {
  color: #000;
  text-decoration: none;
}
.map_wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

#button_wrap {
  position: absolute;
  left: 43%;
  bottom: 0;
  margin-bottom: 10px;
  z-index: 1;
  display: flex;
}

.menu_wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20%;
  margin: 10px 0 20px 10px;
  padding: 8px;
  overflow-y: auto;
  z-index: 1;
  border-radius: 10px;
}
#menu_wrap {
  left: 0;
  background: rgba(255, 255, 255, 0.7);
}
#menu_wrap_second {
  right: 0;
  margin: 10px 10px 20px 10px;
  background: rgba(255, 255, 255, 0.7);
}

#menu_wrap hr {
  display: block;
  height: 1px;
  border: 0; /*border-top: 2px solid #5F5F5F;*/
  margin: 3px 0;
}
#menu_wrap .option {
  text-align: center;
}
#menu_wrap .option p {
  margin: 10px 0;
}
#menu_wrap .option button {
  margin-left: 5px;
}
#menu_wrap_second hr {
  display: block;
  height: 1px;
  border: 0; /*border-top: 2px solid #5F5F5F;*/
  margin: 3px 0;
}
#menu_wrap_second .option {
  text-align: center;
}
#menu_wrap_second .option p {
  margin: 10px 0;
}
#menu_wrap_second .option button {
  margin-left: 5px;
}
#placesList li {
  list-style: none;
}
#placesList .item {
  position: relative;
  border-bottom: 1px solid #888;
  overflow: hidden;
  cursor: pointer;
  min-height: 65px;
}
#placesList .item span {
  display: block;
  margin-top: 4px;
}
#placesList .item h5,
#placesList .item .info {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
#placesList .item .info {
  padding: 10px 0 10px 55px;
}
#placesList .info .gray {
  color: #8a8a8a;
}
#placesList .info .jibun {
  padding-left: 26px;
  background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png)
    no-repeat;
}
#placesList .info .tel {
  color: #009900;
}
#placesList .item .markerbg {
  float: left;
  position: absolute;
  width: 36px;
  height: 37px;
  margin: 10px 0 0 10px;
  background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png)
    no-repeat;
}
#pagination {
  margin: 10px auto;
  text-align: center;
}
#pagination a {
  display: inline-block;
  margin-right: 10px;
}
#pagination .on {
  font-weight: bold;
  cursor: default;
  color: #777;
}

.custom-container-height {
  /**드래그앤드랍 범위를 지정 */
  height: 400px;
}

.custom_selected {
  background-color: lightgreen;
}
.custom_unselected {
  background-color: rgb(142, 143, 142);
}
.custom-button-container {
  /* position: abolute;
  right: 50%;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center; */
}
.custom_switch {
  padding-left: 0px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
}

.dot {
  overflow: hidden;
  float: left;
  width: 12px;
  height: 12px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/mini_circle.png");
}
.dotOverlay {
  position: relative;
  bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  float: left;
  font-size: 12px;
  padding: 5px;
  background: #fff;
  background-color: #fff;
}
.dotOverlay:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}
.number {
  font-weight: bold;
  color: #ee6152;
}
.dotOverlay:after {
  content: "";
  position: absolute;
  margin-left: -6px;
  left: 50%;
  bottom: -8px;
  width: 11px;
  height: 8px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white_small.png");
}
.distanceInfo {
  position: relative;
  top: 5px;
  left: 5px;
  list-style: none;
  margin: 0;
  background-color: #fff;
}
.distanceInfo .label {
  display: inline-block;
  width: 50px;
}
.distanceInfo:after {
  content: none;
}
/*카카오 맵에서 사용하는 CSS - end*/
</style>

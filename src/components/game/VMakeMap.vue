<script setup>
import VRoadMap from "@/components/game/VRoadMap.vue";
import VPlaceItem from "@/components/game/VPlaceItem.vue";
import { useGameStore } from "@/stores/gameStore";
import { onMounted, ref } from "vue";
const store = useGameStore();
const appKey = import.meta.env.VITE_KAKAO_APPKEY;

let map = null;
var ps = null;
var infowindow = null;
var markers = [];
var searchResult = ref();
const location = ref({
  y: 36.35559977190671,
  x: 127.29859991863871,
});

const searchQuery = ref({
  category_group_code: "AT4",
  query: "",
  page: "1",
  size: "15",
});

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
    level: 5,
  };
  //지도 객체를 등록합니다.
  //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
  map = new kakao.maps.Map(container, options);
  //map.addOverlayMapTypeId(kakao.maps.MapTypeId.ROADVIEW);
  //map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
  // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
  const zoomControl = new kakao.maps.ZoomControl();
  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

  ps = new kakao.maps.services.Places();
  infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
};

function searchPlaces() {
  var keyword = document.getElementById("keyword").value;
  store.placeList = [];
  store.seedInfo = {
    keyword: keyword,
    seedInfo: "",
    count: 0,
  };

  if (!keyword.replace(/^\s+|\s+$/g, "")) {
    alert("키워드를 입력해주세요!");
    return false;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB);
}

function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    searchResult.value = data;
    console.log(searchResult.value);
    displayPlaces(data); // 검색 목록, 마커
    displayPagination(pagination); // 페이지 번호
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}

function displayPlaces(places) {
  var listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu_left"),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = "";

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (var i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i, places[i]),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, title, x, y) {
      kakao.maps.event.addListener(marker, "mouseover", function () {
        displayInfowindow(marker, title);
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };

      itemEl.onmouseout = function () {
        infowindow.close();
      };

      itemEl.onclick = function () {
        // 서치아이템 클릭
        location.value.x = x;
        location.value.y = y;
      };
    })(marker, places[i].place_name, places[i].x, places[i].y);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

function getListItem(index, places) {
  // style="float: both"
  var el = document.createElement("li"),
    itemStr =
      '<div class="info" > ' +
      "   <h5 class='mb-1'>" +
      (index + 1) +
      ". " +
      places.place_name +
      "</h5>";

  const btn = document.createElement("button");

  btn.style.cssText = "float:right";
  btn.className = "btn btn-primary p-1 m-1";
  btn.setAttribute("data-bs-toggle", "modal");
  btn.setAttribute("data-bs-target", "#roadModal");
  btn.innerText = "로드뷰";
  el.appendChild(btn);

  itemStr += "";
  if (places.road_address_name) {
    itemStr += "    <span>" + places.road_address_name + "</span></div>";
  } else {
    itemStr += "    <span>" + places.address_name + "</span></div>";
  }

  el.innerHTML += itemStr;
  el.className = "item";
  el.style.cssText = "border-bottom:1px solid #888; cursor: pointer; padding: 8px";

  return el;
}

function addMarker(position, idx, place) {
  var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    });

  // 마커 클릭 이벤트
  kakao.maps.event.addListener(marker, "click", (e) => {
    // 게임 만들 때 필요한 정보
    // 시드 + 게임
    // 시드: (seedId), keyword, count, seedInfo
    // 게임: (gameId, seedId, memberId), difficulty, gameTitle

    if (store.placeList.length > 10) {
      alert("플레이스 추가는 최대 10개까지 가능합니다.");
    } else {
      store.addPlace(place);
    }
  });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function displayPagination(pagination) {
  var paginationEl = document.getElementById("pagination"),
    fragment = document.createDocumentFragment(),
    i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;
    el.style.cssText = "margin-right: 10px;";

    if (i === pagination.current) {
      el.className = "on";
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

onMounted(() => {
  store.placeList = [];
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    loadScript();
  }
});
</script>

<template>
  <div class="map_wrap">
    <div id="map" style="width: 100%; height: 600px; position: relative; overflow: hidden"></div>
    <div id="menu_left" class="bg_white">
      <div class="option">
        <div>
          <form @submit.prevent="searchPlaces">
            <input
              type="text"
              v-model="searchQuery.query"
              placeholder="검색어를 입력하세요."
              class="form-control p-1"
              id="keyword"
              size="15"
            />
            <button class="btn btn-primary btn-md me-3 p-1" type="submit">검색하기</button>
          </form>
        </div>
      </div>
      <hr />
      <ul id="placesList"></ul>
      <div id="pagination"></div>
    </div>

    <div id="menu_right" class="bg_white">
      <div></div>
      <VPlaceItem :place="place" v-for="place in store.placeList" :key="place.id" />
    </div>
  </div>

  <!-- 결과 모달 -->
  <div class="modal fade" id="roadModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <div class="d-flex justify-content-center">
          <div>
            <h2 class="fw-bold">로드맵</h2>
          </div>
        </div>

        <div class="modal-body">
          <VRoadMap :key="location.x" :location="location" />
          <div class="d-flex justify-content-center">
            <button type="button" class="mt-3 btn btn-outline-success me-2" data-bs-dismiss="modal">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 결과 모달 끝 -->
</template>

<style scoped>
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
  height: 500px;
}
#menu_left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 300px;
  height: 580px;
  margin: 10px 0 30px 10px;
  padding: 5px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  font-size: 12px;
  border-radius: 10px;
}

#menu_right {
  position: absolute;
  top: 0;
  right: 40px;
  bottom: 0;
  width: 300px;
  height: 580px;
  margin: 10px 0 30px 10px;
  padding: 5px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  font-size: 12px;
  border-radius: 10px;
  text-align: center;
}
/* .bg_white {
  background: #fff;
} */
#menu_left hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 2px solid #5f5f5f;
  margin: 3px 0;
}
#menu_left .option {
  text-align: center;
}
#menu_left .option p {
  margin: 10px 0;
}
#menu_left .option button {
  margin-left: 5px;
}
#pagination {
  margin: 10px auto;
  text-align: center;
}
</style>

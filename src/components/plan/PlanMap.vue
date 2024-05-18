<script setup>
import { onMounted, onUpdated, watch, ref} from "vue";
import { useGameStore } from "@/stores/gameStore";
import { useMemberStore } from "@/stores/memberStore";
import { KakaoPathFinder } from "@/util/http-commons.js";
import { Container, Draggable } from "vue3-smooth-dnd";
import { applyDrag, generateItems } from '@/util/dragHelper.js';

const memberStore = useMemberStore();
const store = useGameStore();
const pathFinder = KakaoPathFinder();
const emit = defineEmits([

]);
const props = defineProps({
    gameResult : Array
});

/**
gameStore 
gameList: 플레이스 배열
-> place 객체(id, address_name, place_name, location 객체(x, y), 점수, 거리)
 */

let places = [
    {
        id: 1,
        address_name: '1',
        place_name: '1',
        location : {x : 127.11024293202674, y : 37.394348634049784},
        score : 100,
        distance : "100m"
    },
    {
        id: 2,
        address_name: '2',
        place_name: '2',
        location : {x : 127.11341936045922, y : 37.39639094915999},
        score : 200,
        distance : "200m"
    },
    {
        id: 3,
        address_name: '3',
        place_name: '3',
        location : {x : 127.10860518470294, y : 37.401999820065534},
        score : 300,
        distance : "300m"
    },
]

// 카카오 길찾기 예제
const temp = '{"origin": {' +
        '"x": "127.11024293202674",' +
        '"y": " 37.394348634049784"' +
    ' },' +
    '"destination": {' +
        '"x": "127.10860518470294",' +
        '"y": "37.401999820065534"' +
    '},' +
    '"waypoints": [' +
        '{ "name": "name0",' +
            '"x": 127.11341936045922,' +
            '"y": 37.39639094915999 }' +
        
    '], "priority": "RECOMMEND",' +
   ' "car_fuel": "GASOLINE",' +
    '"car_hipass": false,' +
    '"alternatives": false,' +
    '"road_details": false }';

let map = null;
var marker = null;
var drawLine = null;
var targetMarker = null;
var defaultLocation = null;
const appKey = import.meta.env.VITE_KAKAO_APPKEY;
const currentLocation = {};
const path = ref();

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

};

const findPath = () => {

    let body = {
        origin: {
            x: places[0].location.x,
            y: places[0].location.y,
        },
        destination: {
            x: places[places.length - 1].location.x,
            y: places[places.length - 1].location.y,
        }
    };
    let waypoints = [];
    for(var i = 1; i < places.length - 1; i++) {
        waypoints[i - 1] = {
            x: places[i].location.x,
            y: places[i].location.y
        }
    }
    body.waypoints = waypoints;

    console.log(body);

    pathFinder.post("", body)
    .then((res) => console.log(res));
}

// 드래그앤드랍시 이벤트
const onDrop = ((dropResult) => {
    console.log(dropResult);
    places = applyDrag(places, dropResult);
})

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
  <div class="map-view" id="map-mo">
        <div class="map_wrap">
            <!--카카오맵이 표시되는 영역-->
            <div id="map" style="width: 100%; height: 600px; position: relative; overflow: hidden"></div>
        
            <div class="custom_submit">
                <button @click="findPath" type="button" class="btn btn-success custom_btn">길찾기</button>
            </div>
            <!--카카오 맵에 표시되는 관광정보 리스트 view-->
            <div id="menu_wrap" class="bg_white">
                <div class="option">
                    <Container @drop="onDrop" lock-axis="y">
                        <Draggable v-for="place in places" :key="place.id">
                            <div class="draggable-item">
                                <div>{{ place.id }}</div>
                                <div>{{ place.name }}</div>
                                <div>{{ place.location }}</div>
                                <div>{{ place.score }}</div>
                                <div>{{ place.distance }}</div>
                            </div>
                            <br/>
                        </Draggable>
                    </Container>
                </div>
                <hr>
                <ul id="placesList"></ul>
                <div id="pagination"></div>
            </div>
        </div>
    </div>  
</template>

<style scoped>
/*카카오 맵에서 사용하는 CSS - start*/
.map_wrap, .map_wrap * {margin:0;padding:0;font-family:'Malgun Gothic',dotum,'돋움',sans-serif;font-size:12px;}
        .map_wrap a, .map_wrap a:hover, .map_wrap a:active{color:#000;text-decoration: none;}
        .map_wrap {position:relative;width:100%;height:500px;}
        #menu_wrap {position:absolute;top:0;left:0;bottom:0;width:15%;margin:10px 0 10px 10px;padding:5px;overflow-y:auto;background:rgba(255, 255, 255, 0.7);z-index: 1;font-size:12px;border-radius: 10px;}
        .bg_white {background:#fff;}
        #menu_wrap hr {display: block; height: 1px;border: 0; border-top: 2px solid #5F5F5F;margin:3px 0;}
        #menu_wrap .option{text-align: center;}
        #menu_wrap .option p {margin:10px 0;}  
        #menu_wrap .option button {margin-left:5px;}
        #placesList li {list-style: none;}
        #placesList .item {position:relative;border-bottom:1px solid #888;overflow: hidden;cursor: pointer;min-height: 65px;}
        #placesList .item span {display: block;margin-top:4px;}
        #placesList .item h5, #placesList .item .info {text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
        #placesList .item .info{padding:10px 0 10px 55px;}
        #placesList .info .gray {color:#8a8a8a;}
        #placesList .info .jibun {padding-left:26px;background:url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png) no-repeat;}
        #placesList .info .tel {color:#009900;}
        #placesList .item .markerbg {float:left;position:absolute;width:36px; height:37px;margin:10px 0 0 10px;background:url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png) no-repeat;}
        #pagination {margin:10px auto;text-align: center;}
        #pagination a {display:inline-block;margin-right:10px;}
        #pagination .on {font-weight: bold; cursor: default;color:#777;}
    
        .custom_submit {position:absolute;right:10px;bottom:-90px;overflow:hidden;z-index:1;}        
        .custom_btn {width: 80px; height: 30px;}

        /*카카오 맵에서 사용하는 CSS - end*/
</style>

<script setup>
import { onMounted, onUpdated, ref, watch} from "vue";
import { useGameStore } from "@/stores/gameStore";
import { useMemberStore } from "@/stores/memberStore";
import { KakaoPathFinder } from "@/util/http-commons.js";
import { Container, Draggable } from "vue3-smooth-dnd";
import { applyDrag, generateItems } from '@/util/dragHelper.js';``
import { oops } from "@/util/sweetAlert.js";

const memberStore = useMemberStore();
const gameStore = useGameStore();
const pathFinder = KakaoPathFinder();
const emit = defineEmits([

]);
const props = defineProps({
    isDetail : Boolean,
    gameList: Object
});
const imrich = ref(false);  //변경사항이 있을때마다 API호출 여부를 저장하는 변수
const selectedCnt = ref(0); //선택된 장소가 몇개인지 카운트
/**
gameStore 
gameList: 플레이스 배열
-> place 객체(id, address_name, place_name, location 객체(x, y), 점수, 거리)
 */
let distanceOverlay = null;
let polyline = null;
let polylineDash = null;
const selected = ref({});
const places = ref([]);

let map = null;
let marker = [];
var defaultLocation = null;
const appKey = import.meta.env.VITE_KAKAO_APPKEY;
const pathResult = ref();

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


  if(!props.isDetail){
    places.value = props.gameList;
    //   전부 선택으로 할당
    for(var i = 0; i < places.value.length; i++) {
        selected.value[places.value[i].id + ''] = true;
    }
    selectedCnt.value = places.value.length;
    drawMarker();
  }
};

watch(()=> props.gameList, (gameList) => {
    console.log(gameList)
    places.value = gameList
    for(var i = 0; i < places.value.length; i++) {
        selected.value[places.value[i].id + ''] = true;
    }
    selectedCnt.value = places.value.length;
    drawMarker();
    findPath();
})

//Smooth 버튼에서 사용
//지도를 부드럽게 이동 시키기, 초반에 미적 요소로 사용되기 위해 작성됨. 불안정함...
const smoothLevel = () => {
    if(selectedCnt.value === 0) return;

    let bounds = new kakao.maps.LatLngBounds();
    for(var i = 0; i < places.value.length; i++) {
        if(!selected.value[places.value[i].id+'']) continue;
        bounds.extend(new kakao.maps.LatLng(places.value[i].location.y, places.value[i].location.x));
    }

    //위도 경도의 차를 이용해서 최적의 지도 확대 레벨을 구하기
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const subLng = ne.getLng() - sw.getLng();
    const subLat = ne.getLat() - sw.getLat();
    const center = new kakao.maps.LatLng((sw.getLat() + ne.getLat()) / 2, (sw.getLng() + ne.getLng()) / 2);
    
    let level = 14;
    let maxLng = 4.0;     //8
    let maxLat = 11.0;    //20

    //적당한 레벨 구하기
    // 6 - 14
    // 3 - 13
    // 1.5 - 12
    //0.8 - 11
    //0.4 - 10
    //... 1/2 씩 줄어든다.

    // 20 - 14
    // 10 - 13
    for(; level > 0; level--) {
        if(maxLng <= subLng || maxLng <= subLat) break;
        maxLng /= 2;
        maxLat /= 2;
    }

    // zoomInChain(center, level);
    map.panTo(center);

    const panToCallback = () => {
        map.panTo(center);
        kakao.maps.event.removeListener(map, 'idle', panToCallback);
    }

    const levelCallback = () => {
        map.setLevel(level, {
            animate: {
                duration : 200
            },
        });
        kakao.maps.event.removeListener(map, 'idle', levelCallback);
        kakao.maps.event.addListener(map, 'idle', panToCallback);
        
    }

    kakao.maps.event.addListener(map, 'idle', levelCallback);
}

//1단계씩 줌인하면서 원하는 좌표로 이동하기... 너무 이상함
const zoomInChain = (center, level) => {
    let curLev = map.getLevel();
    const panToCallback = () => {
        map.panTo(center);
        kakao.maps.event.removeListener(map, 'idle', panToCallback);
        if(curLev > level) kakao.maps.event.addListener(map, 'idle', levelCallback);
    }
    const levelCallback = () => {
        map.setLevel(curLev - 1, {
            animate: {
                duration : 10
            },
        });
        curLev -= 2;
        kakao.maps.event.removeListener(map, 'idle', levelCallback);
        kakao.maps.event.addListener(map, 'idle', panToCallback);
    }

    map.panTo(center);
    kakao.maps.event.addListener(map, 'idle', levelCallback);
}

// 마커에 번호를 부여하고 표시
const drawMarker = () => {
    deleteMarker();
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37);  // 마커 이미지의 크기
    let idx = 0;
    for(var i = 0; i < places.value.length; i++) {
        if(!selected.value[places.value[i].id+'']) continue;
        var imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (idx++*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        };
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        marker.push(
            new kakao.maps.Marker({
                position: new kakao.maps.LatLng(places.value[i].location.y, places.value[i].location.x),
                title: places.value[i].id,
                map: map,
                image: markerImage
            })
        );
    }
}

//맵에 존재하는 마커 전부 제거
const deleteMarker = () => {
    for(var i = 0; i < marker.length; i++){
        marker[i].setMap(null);
    }
    marker = [];
}

//선택된 장소들을 가지고 경로를 찾는다. 2개 이상의 장소가 선택되어야만 사용가능
const findPath = () => {
    if(selectedCnt.value < 2) {
        oops("최소 두개 이상의 장소를 선택해야합니다.");
        if(imrich.value) imrich.value = false;  //경로 자동 업데이트가 켜져있다면 끄기
        removePath();
        return;
    }

    let selectedPlace = [];
    for(var i = 0; i < places.value.length; i++) {
        if(selected.value[places.value[i].id+'']) {
            selectedPlace.push(places.value[i]);
        }
    }

    let body = {
        origin: {
            x: selectedPlace[0].location.x,
            y: selectedPlace[0].location.y,
        },
        destination: {
            x: selectedPlace[selectedPlace.length - 1].location.x,
            y: selectedPlace[selectedPlace.length - 1].location.y,
        }
    };
    let waypoints = [];
    for(var i = 1; i < selectedPlace.length - 1; i++) {
        waypoints[i - 1] = {
            x: selectedPlace[i].location.x,
            y: selectedPlace[i].location.y
        }
    }
    body.waypoints = waypoints;

    pathFinder.post("", body)
    .then((res) => {
        pathResult.value = res.data;
    })
    .then(() => drawPath());
}

//위에 findPath로부터 결과를 받아 경로를 그린다.
//미적 요소를 위해 polyLine을 두개 사용하여 렌더링
const drawPath = () => {
    removePath();

    // let bounds = new kakao.maps.LatLngBounds();
    //토탈 시간과 거리 구하기 (sec, meter)
    const distance = pathResult.value.routes[0].summary.distance;
    const duration = pathResult.value.routes[0].summary.duration;

    const sections = pathResult.value.routes[0].sections;
    const path = [];    //초기화

    // let idx = 0;
    for(var i = 0; i < sections.length; i++) {
        const roads = sections[i].roads;
        for(var j = 0; j < roads.length; j++) {
            const vertexes = roads[j].vertexes;
            for(var k = 0; k < vertexes.length; k+=2) {
                path.push(new kakao.maps.LatLng(vertexes[k + 1], vertexes[k]));
                // bounds.extend(path[idx++]);
            }
        }
    }

    //디자인 개선을 위한 이중 폴리라인... Java에서는 RouteLine을 쓸수있는데 JS는 제공X...
    polylineDash = new kakao.maps.Polyline({
        path: path, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 3, // 선의 두께 입니다
        strokeColor: '#FFFFFF', // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'longdash', // 선의 스타일입니다
        zIndex: 5 
    })

    polyline = new kakao.maps.Polyline({
        path: path, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 8, // 선의 두께 입니다
        strokeColor: '#2068EF', // 선의 색깔입니다
        strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid', // 선의 스타일입니다
        // endArrow: true,
        zIndex: 4
    });

    // console.log(polyline);
    // console.log(map);

    // 지도에 선을 표시합니다 
    polyline.setMap(map); 
    polylineDash.setMap(map);
    smoothLevel();

    let distanceText = "";
    let durationText = '';

    const hour = Math.floor(duration / 3600);   //1시간은 60초 * 60분 = 3600초
    const min = Math.floor((duration % 3600) / 60); //분은 남은 시간 중 60으로 나누어 계산
    if(distance > 1000) distanceText = (distance / 1000).toFixed(1) + "km";
    else distanceText = Math.floor(((distance / 10) * 10)) + "m";
    
    if(hour > 0) durationText = hour + "시간 ";
    durationText += min +"분";

    showDistance(getTimeHTML(distance, duration), path[path.length-1]);
    savePlaces2Pinia(distanceText, durationText);
    // map.setBounds(bounds);
}

//맵에 존재하는 경로 제거
const removePath = () => {
    if(polyline) polyline.setMap(null);
    if(polylineDash) polylineDash.setMap(null);
    deleteDistnce();
    gameStore.seedInfo.isOk = false;
}

// 드래그앤드랍시 이벤트
const onDrop = ((dropResult) => {
    if(props.isDetail) return;
    // console.log(dropResult);
    // dropResult.payload = places[dropResult.removedIndex];
    places.value = applyDrag(places.value, dropResult);
    drawMarker();
    if(imrich.value) findPath();
    else removePath();
    // console.log(places.value);
})

//선택된 id값을 탐색하여 선택 여부를 반전. 마커는 최대 10개이므로 O(n)으로 충분히 해결가능
const onClick = (id, isDetail) => {
    if(isDetail) return;
    for(var i = 0; i < places.value.length; i++) {
        if(places.value[i].id === id) {
            selected.value[id+''] = !selected.value[id+''];
            if(selected.value[id+'']) selectedCnt.value++;
            else selectedCnt.value--;
            break;
        }
    }
    console.log(id);
    drawMarker();
    if(imrich.value) findPath();
    else removePath();
}

const savePlaces2Pinia = (distance, duration) => {
    let seed = '';
    let cnt = 0;
    for(var i = 0; i < places.value.length; i++) {
        if(selected.value[places.value[i].id + '']) {
            seed += `${places.value[i].id} `;
            cnt++;
        }
    }
    console.log(seed)
    gameStore.seedInfo.isOk = true;
    gameStore.seedInfo.seedInfo = seed;
    gameStore.seedInfo.count = cnt;
    gameStore.seedInfo.distance = distance;
    gameStore.seedInfo.duration = duration;
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    loadScript();
  }
});

onUpdated(() => {});


// 마우스 우클릭 하여 선 그리기가 종료됐을 때 호출하여 
// 그려진 선의 총거리 정보와 거리에 대한 도보, 자전거 시간을 계산하여
// HTML Content를 만들어 리턴하는 함수입니다
// distance는 meter, duration은 sec
function getTimeHTML(distance, duration) {

    const hour = Math.floor(duration / 3600);   //1시간은 60초 * 60분 = 3600초
    const min = Math.floor((duration % 3600) / 60); //분은 남은 시간 중 60으로 나누어 계산

    let contentHour = "";
    let distanceContent = "";
    if (hour > 0) {
        contentHour = '<span class="number">' + hour + '</span>시간 '
    }
    let contentMin = '<span class="number">' + min + '</span>분'

    //km 단위로 표시하기
    if(distance > 1000) distanceContent = "약 " + (distance / 1000).toFixed(1) + "km";
    else distanceContent = "약 " + Math.floor(((distance / 10) * 10)) + "m";

    // 거리와 시간을 가지고 HTML Content를 만들어 리턴합니다
    var content = '<ul class="dotOverlay distanceInfo" ';
    content += '   style="position:relative;bottom:10px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;font-size:12px;padding:5px;background: #fff;background-color:#fff;';
    content += '   top:5px;left:5px;list-style:none;margin:0;">';
    content += '    <li>';
    content += '        <span class="label" style="display:inline-block;width:50px;">총거리</span><span class="number">' + distanceContent + '</span>';
    content += '    </li>';
    content += '    <li>';
    content += '        <span class="label" style="display:inline-block;width:50px;">이동시간</span>' + contentHour + contentMin;
    content += '    </li>';
    content += '</ul>'

    return content;
}

function showDistance(content, position) {
    
    if (distanceOverlay) { // 커스텀오버레이가 생성된 상태이면
        
        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
        distanceOverlay.setPosition(position);
        distanceOverlay.setContent(content);
        
    } else { // 커스텀 오버레이가 생성되지 않은 상태이면
        
        // 커스텀 오버레이를 생성하고 지도에 표시합니다
        distanceOverlay = new kakao.maps.CustomOverlay({
            map: map, // 커스텀오버레이를 표시할 지도입니다
            content: content,  // 커스텀오버레이에 표시할 내용입니다
            position: position, // 커스텀오버레이를 표시할 위치입니다.
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 3  
        });      
    }
}

// 그려지고 있는 선의 총거리 정보와 
// 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
function deleteDistnce () {
    if (distanceOverlay) {
        distanceOverlay.setMap(null);
        distanceOverlay = null;
    }
}
</script>

<template>

  <div class="map-view" id="map-mo">
        <div class="map_wrap">
            <!--카카오맵이 표시되는 영역-->
            <div id="map" style="width: 100%; height: 600px; position: relative; overflow: hidden"></div>
            
            <div v-if="!isDetail">
                <button @click="smoothLevel" type="button" class="btn btn-success custom_btn custom_smooth">Smooth</button>
                <div class="form-check form-switch custom_switch">
                    <input v-model="imrich" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                    <label class="form-check-label" for="flexSwitchCheckDefault">I'M RICH!</label>
                </div>
                <div class="custom_submit">
                    <button @click="findPath" type="button" class="btn btn-success custom_btn">길찾기</button>
                </div>
            </div>
            <!--카카오 맵에 표시되는 관광정보 리스트 view-->
            <div id="menu_wrap" class="bg_white">
                <div class="option">
                    <Container @drop="onDrop" :lock-axis="isDetail?'xy':'y'">
                        <Draggable v-for="item in places" :key="item.id">
                            <div :class="{'draggable-item' : !isDetail, 'custom_selected': selected[item.id+''], 'custom_unselected' : !selected[item.id+'']}" @click="onClick(item.id, isDetail)">
                                <div>{{ item.id }}</div>
                                <div>{{ item.place_name }}</div>
                                <div>{{ item.location }}</div>
                                <div>{{ item.score }}</div>
                                <div>{{ item.distance }}</div>
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

<!-- <div id="infoOverlay" :class="{'dotOverlay' : false, 'distanceInfo' : true}" v-show="pathInfo.isShow">
    <span>{{ pathInfo.d }}</span>
</div> -->

</template>

<style scoped>
/*카카오 맵에서 사용하는 CSS - start*/
        .map_wrap, .map_wrap * {margin:0;padding:0;font-family:'Malgun Gothic',dotum,'돋움',sans-serif;font-size:12px;}
        .map_wrap a, .map_wrap a:hover, .map_wrap a:active{color:#000;text-decoration: none;}
        .map_wrap {position:relative;width:100%;height:500px;}
        #menu_wrap {position:absolute;top:0;left:0;bottom:0;width:20%;margin:10px 0 10px 10px;padding:5px;overflow-y:auto;background:rgba(255, 255, 255, 0.7);z-index: 1;font-size:12px;border-radius: 10px;}
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

        .custom_switch {position:absolute;right:10px;bottom:-50px;z-index:1;display: flex; flex-direction: column-reverse; align-items: center; text-align: center;}   
        .custom_switch input {
            width: 60px;
            height: 30px;
        }
        .custom_switch label {
            position: relative;
            padding-right: 20px;
        }
        .custom_smooth {
            position:absolute;right:10px;bottom:10px;overflow:hidden;z-index:1;
        }

        .custom_selected {
            background-color: lightgreen;
        }
        .custom_unselected {
            background-color: rgb(142, 143, 142);
        }
        .dot {overflow:hidden;float:left;width:12px;height:12px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/mini_circle.png');}    
        .dotOverlay { position:relative;bottom:10px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;font-size:12px;padding:5px;background: #fff;background-color:#fff;}
        .dotOverlay:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}    
        .number {font-weight:bold;color:#ee6152;}
        .dotOverlay:after {content:'';position:absolute;margin-left:-6px;left:50%;bottom:-8px;width:11px;height:8px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white_small.png')}
        .distanceInfo {position:relative;top:5px;left:5px;list-style:none;margin:0;background-color: #fff;}
        .distanceInfo .label {display:inline-block;width:50px;}
        .distanceInfo:after {content:none;}
        /*카카오 맵에서 사용하는 CSS - end*/
</style>

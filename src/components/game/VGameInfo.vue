<script setup>
import VSelect from '/src/components/common/VSelect.vue';
import { ref, onMounted } from "vue";  
import { searchKeywordApi } from "@/api/kakaomap.js";
import { getSidoApi, getGugunApi } from "@/api/game.js"
import { useRouter } from "vue-router";
import { useGameStore } from '@/stores/gameStore'
const store = useGameStore()
const router = useRouter();

onMounted(() => {
    getSido();
    for(let i = 3; i<=10; i++){
        countList.value.push({text: i, value: i})
    }
})

const sidoList = ref()
const gugunList = ref()
const countList = ref([])
const gameList = ref([])
const gameSeed = ref("")
const classGroup = 'form-select mb-3'
const labelClass = 'fw-bold mb-3'

const searchQuery = ref({ 
    "category_group_code": "AT4",
    "query" : "",
    "page" : "1",
    "size" : "15",
})
const gameSetting = ref({ 
    "query" : "",
})

const selectRandom = (count) => {
    let idx = []
    for (var i=0; i<count; i++) {   
        var randomNum = Math.floor(Math.random() * 15)
        if (idx.indexOf(randomNum) === -1) {
            idx.push(randomNum)
        } else {
            i--
        }
    }
    return idx
}
const createSeed = (locations) => {
    let idx = selectRandom(gameSetting.value.count)
    console.log(idx);
    for(var i of idx){
        let place = {}
        place.address_name = locations[i].address_name
        place.place_name = locations[i].place_name
        place.location = {'x': locations[i].x, 'y': locations[i].y}
        gameList.value.push(place)
        gameSeed.value += `${locations[i].id} `
    }
    console.log(gameList.value)
    console.log(gameSeed.value)
    store.gameList = gameList.value
    store.gameSeed = gameSeed.value
    store.keyword = searchQuery.value.query
}
const searchKeyword = () => {
    gameSetting.value.query = searchQuery.value.query
    console.log(searchQuery.value)
    console.log(gameSetting.value)
    searchKeywordApi(searchQuery.value, ({data})=> {
        console.log(data.documents)
        // seed 생성 후 pinia에 넘겨두기?
        createSeed(data.documents)
        router.push({name: 'gamemap'})
    }, (error) => console.log(error))
}

const getSido = () => {
    getSidoApi(({data}) => {
        console.log(data.data)
        sidoList.value = data.data.map((item)=>{
            return {"value": item.sidoCode, 'text': item.sidoName}
        })
    }, (error) => console.log(error))
}

const selectSido = (key, text) => {
    // searchItem.value.sidoCode = option
    console.log(key + " " + text)
    searchQuery.value.query = text
    if(key >= 10){
        getGugunApi(key, ({data}) => {
            console.log(data)
            gugunList.value = data.data.map((item)=>{
                return {"value": item.gugunCode, 'text': item.gugunName}
            })
        })
    }else{
        // gugunList.value = []
    }
}

const selectGugun = (key, text) => {
    searchQuery.value.query = text
}

</script>

<template>
  <div>
    <div>
        <div :class="labelClass">지역</div>
        <VSelect 
            :selectId="'sido'"
            :selectOption="sidoList" 
            :defaultValue="'여행할 지역 선택'"
            :classGroup="classGroup"
            @on-key-select="selectSido"
        />

        <VSelect 
            :selectId="'gugun'"
            :selectOption="gugunList" 
            :defaultValue="'시/군 선택'"
            :classGroup="classGroup"
            @on-key-select="selectGugun"
        />
    </div>
    <div class="mb-3">
        <div :class="labelClass">난이도</div>
        <input v-model="gameSetting.difficulty" value="EASY" type="radio" class="btn-check" name="options-outlined" id="easyRadio" autocomplete="off">
        <label class="btn btn-outline-primary me-3" for="easyRadio">EASY</label>

        <input v-model="gameSetting.difficulty" value="HARD" type="radio" class="btn-check" name="options-outlined" id="hardRadio" autocomplete="off">
        <label class="btn btn-outline-danger" for="hardRadio">HARD</label>
    </div>
    <div>
        <div :class="labelClass">개수</div>
        <VSelect 
            v-model="gameSetting.count"
            :selectId="'count'"
            :selectOption="countList" 
            :defaultValue="'여행지 개수'"
            :classGroup="classGroup"
        />
    </div>
    <button class="btn btn-primary btn-lg" @click="searchKeyword">버튼</button>
</div>
</template>

<style scoped>

</style>

<script setup>
import { ref, onMounted } from "vue";
import { useGameStore } from '@/stores/gameStore'
import VRoadView from '@/components/game/VRoadView.vue';
import VMap from '@/components/game/VMap.vue';
const store = useGameStore()

onMounted(()=>{
    console.log(store.gameList[store.id]);
})
// x: 경도, y: 위도
// LatLng(y, x)
const nextPlace = () => {
    store.increment()
}

</script>

<template>
  <div>
    <button class="btn btn-primary btn-md mb-3" @click="nextPlace">다음</button>
    {{store.id}}
    <VRoadView :key="store.gameList[store.id].location" :location="store.gameList[store.id].location"/>
    <br>
    <VMap/>
  </div>
</template>

<style scoped>

</style>

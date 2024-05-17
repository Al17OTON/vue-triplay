<script setup>
import { useGameStore } from "@/stores/gameStore";
const store = useGameStore();
defineProps({
  place: Object,
});
</script>

<template>
  <div>
    <div style="border-bottom: 1px solid rgb(136, 136, 136); cursor: pointer; padding: 8px">
      <button @click="store.removePlace(place.id)" class="btn btn-primary p-1" style="float: right">
        삭제
      </button>
      <div>
        <h5>{{ place.place_name }}</h5>
        <span>{{ place.road_address_name ? place.road_address_name : place.address_name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

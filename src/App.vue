<script setup>
import { RouterLink, RouterView } from 'vue-router'
import VHeader from './components/common/VHeader.vue';
import VGameInfo from '@/components/game/VGameInfo.vue';

</script>

<template>
 <header>
  <VHeader/>
 </header>
  
  <RouterView />
</template>

<style scoped>

</style>

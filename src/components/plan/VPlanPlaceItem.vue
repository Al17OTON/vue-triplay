<script setup>
defineProps({
    place: Object
})
</script>

<template>
  <div>
    <h1>{{place.index}}</h1>
    {{place}}
  </div>
</template>

<style scoped>

</style>

<script setup>
defineProps({
  keyword: String,
});
</script>

<template>
  <div class="tag"># {{ keyword }}</div>
</template>

<style scoped>
.tag {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 10px;
  color: white;
  background-color: #12af29;
  /* border: 1px solid black; */
}
</style>

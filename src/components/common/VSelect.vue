<script setup>
import { ref, onMounted } from "vue"
const props = defineProps({ 
  selectId: String,
  selectOption: Array,
  defaultValue: String,
  classGroup: String
})
const emit = defineEmits(["onKeySelect"])

const key = ref("")

onMounted(()=> {
  console.log(props.selectOption)
})

const onSelect = () => {
  console.log(key.value);
  var select = document.getElementById(props.selectId)
  var text = select.options[select.selectedIndex].text
  emit("onKeySelect", key.value, text)
}
</script>

<template>
  <select :id="selectId" v-model="key" :class="classGroup" @change="onSelect">
    <option value="" selected>{{ defaultValue }}</option>
    <option
      v-for="option in selectOption"
      :key="option.value"
      :value="option.value"
      :disabled="option.value === '' ? true : false"
    >
      {{ option.text }}
    </option>
  </select>
</template>

<style scoped></style>

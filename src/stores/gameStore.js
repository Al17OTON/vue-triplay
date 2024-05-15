import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const id = ref(0)
  
  // seed table
  const keyword = ref("")
  const gameSeed = ref("")

  // game에 쓰일 지역 정보
  const gameList = ref([])

  const increment = () => {
    id.value++
  }

  return { id, keyword, gameSeed, gameList, increment }
})

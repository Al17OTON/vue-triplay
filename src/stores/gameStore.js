import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const id = ref(0)
  const score = ref(0)
  
  // seed table
  const keyword = ref("")
  const gameSeed = ref("")
  const count = ref(0)

  // game에 쓰일 지역 정보
  const gameList = ref([])

  const increment = () => {
    id.value++
  }

  return { id, score, keyword, gameSeed, count, gameList, increment }
})

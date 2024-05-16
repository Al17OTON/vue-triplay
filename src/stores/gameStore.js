import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const id = ref(0)
  const score = ref(0)
  
  // seed table
  const seedInfo = ref({})
  const keyword = ref("")
  const gameSeed = ref("")
  const count = ref(0)

  // game table
  const difficulty = ref("")

  // game에 쓰일 지역 정보
  const gameList = ref([])

  const increment = () => {
    id.value++
  }

  return { id, score, seedInfo, keyword, gameSeed, count, difficulty, gameList, increment }
})

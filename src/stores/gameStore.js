import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const id = ref(0)
  const score = ref(0)
  const newGame = ref(true)
  const submitFlag = ref(false)
  
  // seed table
  const page = ref(1);
  const seedInfo = ref({}) // keyword count seed
  // game table
  const difficulty = ref("")
  // game에 쓰일 지역 정보
  const gameList = ref([])

  // game 만들 때 쓰일 placeList
  const placeList = ref([])
  const addPlace = (place) => {
    placeList.value.push(place)
    console.log(placeList.value)
    createSeedInfo();
  }
  const removePlace = (id) => {
    placeList.value = placeList.value.filter((place) => place.id !== id)
    createSeedInfo();
  }

  // watch로 바꾸기?
  const createSeedInfo = () => {
    // page.value = 1;
    // seedInfo.value.seedInfo = `${page.value} `
    seedInfo.value.seedInfo = '';
    console.log(seedInfo.value.seedInfo);
    for (var place of placeList.value) {
      seedInfo.value.seedInfo += place.id + " "
    }
    seedInfo.value.count = placeList.value.length
  }

  const increment = () => {
    id.value++
  }

  return { id, score, newGame, submitFlag, seedInfo, difficulty, gameList, placeList, addPlace, removePlace, increment }
},{persist: true})

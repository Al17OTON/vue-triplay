import VGameInfo from '@/components/game/VGameInfo.vue'
import VGameMap from '@/components/game/VGameMap.vue'

export default[{
  path: '/game',
  name: 'game',
  redirect: {name: 'info'}, // 임시로 넣어둠
  children: [
    {
      path: 'info',
      name: 'gameinfo',
      component: VGameInfo
    },
    {
      path: 'map',
      name: 'gamemap',
      component: VGameMap
    },
  ]
}]
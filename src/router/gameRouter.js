import VGameInfo from '@/views/game/GameInfoView.vue'
import VGameMap from '@/views/game/GameMapView.vue'
import VGameResult from '@/views/game/GameResultView.vue'

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
    {
      path: 'result',
      name: 'gameresult',
      component: VGameResult
    },
  ]
}]
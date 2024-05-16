import GameInfoView from '@/views/game/GameInfoView.vue'
import GameMapView from '@/views/game/GameMapView.vue'
import GameResultView from '@/views/game/GameResultView.vue'
import GameListView from '@/views/game/GameListView.vue'

export default[{
  path: '/game',
  name: 'game',
  redirect: {name: 'info'}, // 임시로 넣어둠
  children: [
    {
      path: 'info',
      name: 'gameinfo',
      component: GameInfoView
    },
    {
      path: 'map',
      name: 'gamemap',
      component: GameMapView
    },
    {
      path: 'result',
      name: 'gameresult',
      component: GameResultView
    },
    {
      path: 'list',
      name: 'gamelist',
      component: GameListView
    },
  ]
}]
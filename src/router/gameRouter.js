import GameInfoView from '@/views/game/GameInfoView.vue'
import GameMapView from '@/views/game/GameMapView.vue'
import GameResultView from '@/views/game/GameResultView.vue'
import GameListView from '@/views/game/GameListView.vue'
import GameHomeView from '@/views/game/GameHomeView.vue'
import GameMakeView from '@/views/game/GameMakeView.vue'

export default[{
  path: '/game',
  name: 'game',
  redirect: {name: 'gamehome'},
  children: [
    {
      path: 'home',
      name: 'gamehome',
      component: GameHomeView
    },
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
      component: GameResultView,
    },
    {
      path: 'list',
      name: 'gamelist',
      component: GameListView
    },
    {
      path: 'make',
      name: 'gamemake',
      component: GameMakeView
    },
  ]
}]
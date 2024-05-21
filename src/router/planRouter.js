import PlanListView from '@/views/plan/PlanListView.vue'
import PlanDetailView from '@/views/plan/PlanDetailView.vue'
import PlanWriteView from '@/views/plan/PlanWriteView.vue'

export default[{
  path: '/plan',
  name: 'plan',
  redirect: {name: 'planlist'},
  children: [
    {
      path: 'list',
      name: 'planlist',
      component: PlanListView
    },
    {
      path: 'detail',
      name: 'plandetail',
      component: PlanDetailView
    },
    {
      path: 'write',
      name: 'planwrite',
      component: PlanWriteView,
      props: {isCustom: false}
    },
    {
      path: 'custom',
      name: 'plancustom',
      component: PlanWriteView,
      props: {isCustom: true}
    },
    {
        path: '/planner',
        name: 'planner',
        component: () => import('@/views/plan/PlanView.vue'),
        //meta: { requiresAuth: true } 디버깅 편의를 위해 주석처리
    }          
  ]
}]
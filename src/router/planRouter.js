export default [{
  path: '/plan',
  name: 'plan',
  redirect: {name: 'main'}, // 일단 main
  children: [
    {
        path: '/planner',
        name: 'planner',
        component: () => import('@/views/plan/PlanView.vue'),
        //meta: { requiresAuth: true } 디버깅 편의를 위해 주석처리
    },
  ]
}]
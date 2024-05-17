import { useMemberStore } from "@/stores/memberStore.js";


export default [{
  path: '/member',
  name: 'member',
  redirect: {name: 'main'}, // 일단 main
  children: [
    {
        path: '/signup',
        name: 'signup',
        component: () => import('@/views/member/SignupView.vue'),
        beforeEnter: (to, from) => {
            const memberStore = useMemberStore();
            // if (memberStore.isLogin) next('/'); //로그인 되어있다면 회원가입 진입 불가
            // else next();
            return !memberStore.isLogin;
        }
    },
    {
        path: '/mypage',
        name: 'mypage',
        component: () => import('@/views/member/MyPageView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/modify',
        name: 'modify',
        component: () => import('@/views/member/ModifyView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/remove',
        name: 'remove',
        component: () => import('@/views/member/RemoveView.vue'),
        meta: { requiresAuth: true }
    }
  ]
}]
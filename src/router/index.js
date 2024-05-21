import { createRouter, createWebHistory } from "vue-router";
import gameRouter from "./gameRouter";
import memberRouter from "./memberRouter";
import planRouter from "./planRouter";
import MainView from "@/views/MainView.vue";
import { useMemberStore } from "@/stores/memberStore.js";
import { login } from "@/util/login.js";
import PlanView from '@/views/plan/PlanView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }

    ...gameRouter,
    ...memberRouter,
    ...planRouter,
    {
      path: "/",
      name: "main",
      component: MainView,
    },
  ],
});

// 인증이 필요한 경우 로그인 모달 띄우기
router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    // console.log("권한 필요없음");
    next();
    return;
  }
  const memberStore = useMemberStore();

  if (memberStore.isLogin) {
    // console.log("로그인 됨");
    next();
  }
  else {
    // console.log("로그인안됨");
    await login();
    if (memberStore.isLogin) next();
    else next('/');
  }
}); 

export default router;

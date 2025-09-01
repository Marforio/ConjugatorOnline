import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
import LoginView from "../views/Login.vue";
import DashboardView from "../views/Dashboard.vue";
import { getAccessToken } from "@/services/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", name: "login", component: LoginView },
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: "/conjugator",
      name: "conjugator",
      component: () => import("../views/Conjugator.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/Dashboard.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/exercises",
      name: "exercises",
      component: () => import("../views/Exercises.vue"),
      meta: { requiresAuth: true}
    },
    {
      path: "/exercises/:errorCode",
      name: "exercise-detail",
      component: () => import("../views/ExerciseDetail.vue"),
      meta: { requiresAuth: true }
    }
  ],
});

router.beforeEach((to, _, next) => {
  const isAuthenticated = !!getAccessToken();
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: "/login",
      query: { redirect: to.fullPath } // Save intended page
    });
  } else {
    next();
  }
});

export default router;

import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Manage from '@/views/Manage.vue'
import useUserStore from '@/stores/user'

const routes = [
  // name property allows you to change the path easily
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'manage',
    path: '/manage',
    component: Manage,
    meta: {
      requiresAuth: true
    }
  },
  {
    // if user visit old path, redirect to new path
    path: '/manage-music',
    redirect: { name: 'manage' }
  },
  {
    // https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E6%8D%95%E8%8E%B7%E6%89%80%E6%9C%89%E8%B7%AF%E7%94%B1%E6%88%96-404-Not-found-%E8%B7%AF%E7%94%B1
    // catchAll is just a custom name, you can change it as needed
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  // https://cn.vitejs.dev/guide/env-and-mode#env-variables
  // https://router.vuejs.org/zh/guide/essentials/history-mode.html#HTML5-%E6%A8%A1%E5%BC%8F
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // https://router.vuejs.org/zh/api/interfaces/RouterOptions.html#Properties-linkExactActiveClass
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  // if route record doesn't have meta.requiresAuth, it doesn't require authentication
  if (!to.meta.requiresAuth) {
    next()
    return
  }
  // authenticate routes have meta.requiresAuth
  const store = useUserStore()
  if (store.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router

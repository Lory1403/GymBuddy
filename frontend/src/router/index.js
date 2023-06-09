import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'paginaApertura',
      component: () => import('../views/paginaApertura.vue')
    },

    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Login.vue')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/Registration.vue')
    },
    {
      path: '/palestra',
      name: 'palestra',
      component: () => import('../views/Palestra.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue')
    }
  ]
})

export default router
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Login.vue'),
    meta: {
      title: '登录页'
    }
  },
  {
    path: '/Home',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Home.vue'),
    meta: {
      title: '首页'
    },
    redirect: '/Welcome',
    children: [
      {
        path: '/Welcome',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/user/Users.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    if (to.fullPath === '/login') {
      next(false)
    } else {
      next()
    }
  } else {
    if (to.fullPath === '/login') {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  }
})
export default router

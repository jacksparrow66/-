import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 这个是路由的懒加载
const login = () => import('@/components/login.vue')
const home = () => import('@/components/views/home/home.vue')
const welcome = () => import('@/components/welcome.vue')
const user = () => import('@/components/views/User/user.vue')
const right = () => import('@/components/views/power/Rights/rights.vue')
const roles = () => import ('@/components/views/power/roles/roles.vue')
const categories = () => import ('@/components/views/commodity/categories/categories.vue')
const params = () => import('@/components/views/commodity/params/params.vue')
const goods = () => import('@/components/views/commodity/goods/goods.vue')
const goodsadd = () => import('@/components/views/commodity/goods/goodsadd/goodsadd.vue')
const order = () => import('@/components/views/order/Order.vue') 
const reports = () => import('@/components/views/reports/reports.vue')
const routes = [{
    path: '/',
    component: login
  },
  {
    path: '/home',
    component: home,
    // 当进入到home组件的时候，重定向到welcome路由上,
    // welcome组件是属于home组件中的一个部分
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: welcome,
    },{
      path:'/users',
      component:user
    },{
      path:'/rights',
      component:right
    },{
      path:'/roles',
      component:roles
    },{
      path:'/categories',
      component:categories
    },{
      path:'/params',
      component:params
    },{
      path:'/goods',
      component:goods
    },{
      path:'/goods/add',
      component:goodsadd
    },{
      path:'/orders',
      component:order
    },{
      path:'/reports',
      component:reports
    }]
  },{
    path: '/login',
    component: login
  }
]


const router = new VueRouter({
  routes,
  mode: 'history'
})



router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token,只有登入过，才会有token值使用的是浏览器的本地存储。
  // 这个本地存储只会在浏览器没有关闭菜可以，关闭了数据就会丢失
  const tokenstr = window.sessionStorage.getItem('token')
  // 如果tokenstr是空，就运行这个
  if (!tokenstr) return next('/login')
  next()
})

export default router

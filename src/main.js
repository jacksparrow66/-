import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import ZkTable from 'vue-table-with-tree-grid'
// 导入全部样式
import './assets/css/global.css'
// 导入富文本编辑器
import Vuequilleditor from 'vue-quill-editor'

// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'



// 注册axios
Vue.prototype.$http = axios
// 拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})

Vue.config.productionTip = false

// 注册富文本编辑器
Vue.use(Vuequilleditor)

// 注册treetable为全局组件
Vue.component('tree-table', ZkTable)

// 注册$bus,用于非父子组件之间的交互
Vue.prototype.$bus = new Vue();

Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d}-${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

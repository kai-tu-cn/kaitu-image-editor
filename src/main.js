import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'

import '@/assets/iconfont/iconfont.js'
import '@/assets/style/index.scss'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueGitHubButtons from 'vue-github-buttons'
import 'vue-github-buttons/dist/vue-github-buttons.css'

Vue.use(VueRouter)
Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(VueGitHubButtons)

Vue.config.productionTip = false

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'editor',
      component: () => import('@/views/ktEditor.vue')
    }
  ]
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

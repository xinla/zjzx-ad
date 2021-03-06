import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 引用功能函数
import Tool from '@/utils/methods'
Vue.use(Tool);

// 图片/视频上传
import Upload from '@/components/Upload/singleImage3'
Vue.component('upload', Upload)
// 编辑器
import Tinymce from '@/components/Tinymce'
Vue.component('tinymce', Tinymce)
/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
 
// import '../mock' // simulation data

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  created() {
  	window.GoTruth = this;
  },
  render: h => h(App)
})

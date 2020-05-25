import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap'

// Bootstrap css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import router from './router'
import store from './store'

import VueJWT from 'vuejs-jwt'
Vue.use(VueJWT)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

Vue.filter('currency', function (value) {
  return 'Rs.' + parseFloat(value).toFixed(2)
})

new Vue({
  router,
  store,
  props: ['currency'],
  render: h => h(App)
}).$mount('#app')

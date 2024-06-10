import Vue from 'vue'
import App from './App.vue'
import router from './router' // Import the router

import '@/assets/styles/global.less'
import quasarConfig from './Quasar' // Assuming Quasar is imported correctly

Vue.use(...quasarConfig)

new Vue({
  el: '#app',
  router, // Add the router to the Vue instance
  render: h => h(App)
})

import Vue from 'vue'
import App from './App.vue'
import router from './router' // Import the router

import '@/assets/styles/global.less'
import quasarConfig from './Quasar' // Assuming Quasar is imported correctly

import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Import CKEditor

Vue.use(...quasarConfig)

new Vue({
  el: '#app',
  router, // Add the router to the Vue instance
  render: h => h(App),
  mounted() {
    ClassicEditor
      .create(document.querySelector('#editor'))
      .then(editor => {
        console.log(editor);
      })
      .catch(error => {
        console.error(error);
      });
  }
})

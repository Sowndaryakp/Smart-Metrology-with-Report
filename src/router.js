// router.js
import Vue from 'vue'
import Router from 'vue-router'
import HomePage from './HomePage.vue'
import DxfHome from './DxfHome.vue'
import PdfHome from './PdfHome.vue'
import PdfHome2 from './PdfHome2.vue'
import ReportPage from './ReportPage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: HomePage },
    { path: '/dxf', component: DxfHome },
    { path: '/pdf', component: PdfHome },
    { path: '/pdf2', component: PdfHome2 },
    { path: '/report', component: ReportPage}
  ]
})

import 'lib-flexible'
import Vue from 'vue'
import App from './App.vue'
import 'public/gomesmart.js'
import './components/mint-ui/style.css'
import 'public/css/iconfont.css'
import './assets/app.less'
import { TabContainer, TabContainerItem, Header, Button, Navbar, TabItem, Cell, CellSwipe, Switch, Popup, Range, MessageBox, Checklist, Toast, Spinner, Picker } from './components/mint-ui/index.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/component/tooltip'
import VueScroller from 'vue-scroller'
import ElementUI from 'element-ui'

// import FastClick from 'fastclick'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/index.css'
// 添加gomesmart实例
/* eslint-disable no-new */

Vue.prototype.$gomesmart = new window.GS.Device()
Vue.prototype.$messagebox = MessageBox
Vue.prototype.$toast = (options) => {
  Toast({
    message: typeof options === 'string' ? options : options.message,
    className: 'ac-mint-toast',
    duration: 2000
  })
}
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Navbar.name, Navbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Cell.name, Cell)
Vue.component(Switch.name, Switch)
Vue.component(Popup.name, Popup)
Vue.component(Range.name, Range)
Vue.component(CellSwipe.name, CellSwipe)
Vue.component(Picker.name, Picker)
Vue.component(Checklist.name, Checklist)
Vue.use(Spinner)
Vue.use(VueScroller)
Vue.component('v-chart', ECharts)

// 解决移动端300毫秒延迟
// if ('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded', function () {
//     FastClick.attach(document.body)
//   }, false)
// }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

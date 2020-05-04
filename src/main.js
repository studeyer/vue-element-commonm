import Vue from 'vue'
import App from './App'
import ElementUis from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import elementCommon from "./index.js";

Vue.config.productionTip = false
Vue.use(ElementUis);
Vue.use(elementCommon)


new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

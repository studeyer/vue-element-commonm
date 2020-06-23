import Vue from 'vue'
import App from './App'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import elementCommon from "./index.js";

Vue.config.productionTip = false
Vue.use(ElementUi);
Vue.use(elementCommon)


new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

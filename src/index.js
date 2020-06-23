import tableCommon from "./components/table/index";
import paginationCommon from "./components/pagination/index";
import dialogCommon from "./components/dialog/index";
import searceCommon from "./components/search/index";
const components = [
  searceCommon,
  tableCommon,
  paginationCommon,
  dialogCommon
 // ...如果还有的话继续添加
]
 
const install = function (Vue, opts = {}) {
  components.map(component => {
 	Vue.component(component.name, component);
  })
}
 
/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
	install.use(window.Vue);
}
 
export default {
  install
}
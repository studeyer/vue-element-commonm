import Vue from "vue";
import dialogCommon from './dialogCommon';
import paginationCommon from './paginationCommon';
import searchCommon from './searchCommon';
import tableCommon from './tableCommon';

 
const Components = {
  dialogCommon,
  paginationCommon,
  searchCommon,
  tableCommon
};
 
Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});
 
export default Components;
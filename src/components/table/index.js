import tableCommon from './tableCommon';

/* istanbul ignore next */
tableCommon.install = function(Vue) {
  Vue.component(tableCommon.name, tableCommon);
};

export default tableCommon;
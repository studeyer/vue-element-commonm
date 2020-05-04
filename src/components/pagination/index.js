import paginationCommon from './paginationCommon';

/* istanbul ignore next */
paginationCommon.install = function(Vue) {
  Vue.component(paginationCommon.name, paginationCommon);
};

export default paginationCommon;
import searchCommon from './searchCommon';

/* istanbul ignore next */
searchCommon.install = function(Vue) {
  Vue.component(searchCommon.name, searchCommon);
};

export default searchCommon;
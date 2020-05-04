import dialogCommon from './dialogCommon';

/* istanbul ignore next */
dialogCommon.install = function(Vue) {
  Vue.component(dialogCommon.name, dialogCommon);
};

export default dialogCommon;
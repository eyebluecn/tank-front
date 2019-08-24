import CopyPlguinLayout from "./CopyPlguinLayout"

export default class CopyPlugin {

  constructor() {
    this.$vm = null;
  }

  install(Vue, options) {

    const CopyPlguinComponent = Vue.extend(CopyPlguinLayout)
    if (!this.$vm) {
      this.$vm = new CopyPlguinComponent({
        el: document.createElement('div'),
        propsData: {}
      })
      document.body.appendChild(this.$vm.$el)
    }

    Vue.$copyPlguin = this;

    Vue.mixin({
      created: function () {
        this.$copyPlguin = Vue.$copyPlguin
      }
    })
  }

  copy(text, successCallback) {
    this.$vm.copy(text, successCallback);
  }
}

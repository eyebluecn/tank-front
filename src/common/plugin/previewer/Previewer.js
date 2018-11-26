import PreviewerLayout from "./PreviewerLayout"

export default class Previewer {

  constructor() {
    this.$vm = null;
  }

  install(Vue, options) {

    const PreviewerComponent = Vue.extend(PreviewerLayout)
    if (!this.$vm) {
      this.$vm = new PreviewerComponent({
        el: document.createElement('div'),
        propsData: {}
      })
      document.body.appendChild(this.$vm.$el)
    }

    Vue.$previewer = this;

    Vue.mixin({
      created: function () {
        this.$previewer = Vue.$previewer
      }
    })
  }

  previewPdf(name, url, successCallback) {
    this.$vm.previewPdf(name, url, successCallback);
  }

}

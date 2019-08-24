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

  previewPdf(name, url, size) {
    this.$vm.previewPdf(name, url, size);
  }

  previewText(name, url, size) {
    this.$vm.previewText(name, url, size);
  }

  previewOffice(name, url, size) {
    this.$vm.previewOffice(name, url, size);
  }

  previewAudio(name, url, size) {
    this.$vm.previewAudio(name, url, size);
  }

  previewVideo(name, url, size) {
    this.$vm.previewVideo(name, url, size);
  }

}

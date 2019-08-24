<template>
  <button ref="clipboardBtn"
          class="copy-plugin-clipboard-btn"
          data-clipboard-text="textToCopy"
          style="position: absolute;opacity:0;">
    {{textToCopy}}
  </button>
</template>

<script>
  import Clipboard from 'clipboard';
  import {safeCallback} from "../../common/util/Utils";

  let nop = () => {
  };
  //这个组件主要用于提供dom元素。
  export default {
    data() {
      return {
        textToCopy: "",
        clipboardBtn: null,
        successCallback: null,
        errorCallback: null
      }
    },
    computed: {},
    props: {},
    watch: {},
    methods: {
      copy(text, successCallback, errorCallback) {

        let that = this;

        this.successCallback = successCallback
        this.errorCallback = errorCallback

        this.textToCopy = text;

        //这里不用延迟设置，否则backyard会出错
        that.$refs.clipboardBtn.setAttribute("data-clipboard-text", text)
        that.$refs.clipboardBtn.click()

      }
    },
    mounted() {
      let that = this;
      this.clipboardBtn = new Clipboard(this.$refs.clipboardBtn);

      this.clipboardBtn.on('success', function (e) {
        console.info('clipboard success');
        safeCallback(that.successCallback)()
      });

      this.clipboardBtn.on('error', function (e) {
        console.error('clipboard error:', e);
        safeCallback(that.errorCallback)()
      });

    }
  }
</script>

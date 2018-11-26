<template>
  <div></div>
</template>

<script>
  import PdfPanel from "./panels/PdfPanel"


  let CLASS_NAME = " previewer-mode"
  //这个组件主要用于提供dom元素。
  export default {
    data() {
      return {}
    },
    computed: {},
    props: {},
    watch: {},
    methods: {

      bodyAddClass() {
        document.body.className += CLASS_NAME
      },
      bodyRemoveClass() {
        let bodyClassName = document.body.className
        let position = bodyClassName.indexOf(CLASS_NAME);

        if (position !== -1) {
          document.body.className = bodyClassName.substr(0, position) + bodyClassName.substr(position + bodyClassName.length)
        }

      },
      previewPdf(name, url, successCallback) {
        let that = this;
        const h = this.$createElement;

        let dom = h(PdfPanel, {
          props: {
            name: name,
            url: url
          }
        });

        that.bodyAddClass()

        that.$msgbox({
          title: name,
          message: dom,
          center: true,
          showCancelButton: false,
          showConfirmButton: false,
          confirmButtonText: '确定',
          beforeClose: (action, instance, done) => {

            that.bodyRemoveClass()
            done();
          }
        }).then(action => {
          console.log("then method ")
        }).catch((e) => {
          console.log("catch method ")
          //关闭了对话框
          that.bodyRemoveClass()
        });

      }
    },
    mounted() {


    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../assets/css/global/variables";

  //弹出框出现时会在body中添加这个类
  .previewer-mode {

    .el-message-box {
      width: 95%;

    }

  }
</style>


<template>

  <iframe :src='finalUrl'
          class="previewer-doc-panel" width="100%" height="100%">
    This is an embedded
    <a target='_blank' href='http://office.com'>Microsoft Office</a>
    document, powered by
    <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
  </iframe>

</template>

<script>

  export default {
    data() {
      return {}
    },
    computed: {
      finalUrl() {
        return "https://view.officeapps.live.com/op/embed.aspx?src=" + this.url;
      }
    },
    props: {
      //寻找该用户的合适文件夹
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    watch: {},
    methods: {},
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../assets/css/global/variables";

  .previewer-doc-panel {
    border: 1px solid #eeeeee;
  }
</style>



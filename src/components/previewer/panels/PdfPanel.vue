<template>

  <iframe class="previewer-pdf-panel" width="100%" height="100%" :src="url"></iframe>

</template>

<script>

  export default {
    data() {
      return {}
    },
    computed: {},
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
  @import "../../../assets/css/global/variables";

  .previewer-pdf-panel {
    border: 1px solid #eeeeee;
  }
</style>


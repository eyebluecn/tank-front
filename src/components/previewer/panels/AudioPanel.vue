<template>

  <div class="previewer-audio-panel" v-if="showFlag">
    <iframe width="100%" height="100%" :src="url"></iframe>
  </div>

</template>

<script>

  export default {
    data() {
      return {
        showFlag: true
      }
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
    methods: {
      show() {
        this.showFlag = true
      },
      close() {
        this.showFlag = false
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../assets/css/global/variables";

  .previewer-audio-panel {
    width: 100%;
    height: 100%;

    iframe {
      border: 1px solid #eeeeee;
    }

  }
</style>



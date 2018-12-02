<template>
  <div class="backyard-image-cache-list animated fadeIn">
    <div class="pedia-navigation">
      <span class="item active">缓存图片列表</span>
    </div>

    <ImageCacheList/>
  </div>
</template>

<script>

  import ImageCacheList from "./widget/ImageCacheList"



  export default {

    data() {
      return {}
    },
    components: {
      ImageCacheList
    },
    methods: {},
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-image-cache-list {

  }
</style>

<template>
  <div class="backyard-share-list animated fadeIn">

    <ShareList/>

  </div>
</template>

<script>

  import ShareList from "./widget/ShareList"

  export default {
    data() {
      return {}
    },
    components: {
      ShareList
    },
    methods: {},
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-share-list {

  }
</style>

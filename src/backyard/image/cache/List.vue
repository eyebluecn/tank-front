<template>
  <div class="backyard-image-cache-list animated fadeIn">
    <div class="row">

      <div class="col-md-12">
        <div class="pedia-navigation">
          <span class="item active">缓存图片列表</span>
        </div>
      </div>

      <div class="col-md-12">
        <NbFilter :filters="pager.filters" @change="search"></NbFilter>
      </div>

      <div class="col-md-12" v-for="(imageCache,index) in pager.data">
        {{imageCache.uri}}
      </div>

      <div class="col-md-12 mt20">
        <NbPager :pager="pager" :callback="refresh"></NbPager>
      </div>

    </div>
  </div>
</template>

<script>
  import NbFilter from '../../../common/widget/filter/NbFilter.vue'
  import NbPager from '../../../common/widget/NbPager.vue'
  import Pager from '../../../common/model/base/Pager'
  import ImageCache from "../../../common/model/image/cache/ImageCache";

  export default {

    data() {
      return {
        pager: new Pager(ImageCache),
        user: this.$store.state.user
      }
    },
    components: {
      NbFilter,
      NbPager
    },
    methods: {
      search() {
        this.pager.page = 0
        this.refresh()
      },
      refresh() {
        this.pager.httpFastPage()
      },
      changeStatus(user) {
        let that = this
        user.httpChangeStatus(function () {
          that.refresh()
        })
      }
    },
    mounted() {
      this.pager.enableHistory()
      this.refresh()
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-image-cache-list {

  }
</style>

<template>
  <div class="page-share-list animated fadeIn">

    <div class="pedia-navigation">
      <span class="item active">我的分享</span>
    </div>

    <div class="row">

      <div class="col-md-12" v-for="(share,index) in pager.data">
        <SharePanel
          :share="share"
          @deleteSuccess="refresh"
        />
      </div>

      <div class="col-md-12 mt20">
        <NbPager :pager="pager" :callback="refresh"></NbPager>
      </div>

    </div>
  </div>
</template>

<script>
  import NbFilter from '../../common/widget/filter/NbFilter.vue'
  import NbPager from '../../common/widget/NbPager.vue'
  import Pager from '../../common/model/base/Pager'
  import Share from "../../common/model/share/Share";
  import SharePanel from "./widget/SharePanel"
  import {MessageBox, Message} from "element-ui"

  export default {

    data() {
      return {
        pager: new Pager(Share, Pager.MAX_PAGE_SIZE),
        user: this.$store.state.user,
        selectedShares: []
      }
    },
    props: {

    },
    components: {
      NbFilter,
      NbPager,
      SharePanel
    },
    methods: {
      search() {
        this.pager.page = 0
        this.refresh()
      },
      refresh() {

        this.pager.httpFastPage()
      }
    },
    mounted() {
      this.pager.enableHistory()
      this.refresh()
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .page-share-list {

  }
</style>

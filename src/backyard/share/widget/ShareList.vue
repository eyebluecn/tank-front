<template>
  <div class="widget-share-list animated fadeIn">
    <div class="row">
      <div class="col-md-12 pb10">
        <button class="btn btn-primary btn-sm " v-if="selectedShares.length !== pager.data.length"
                @click.stop.prevent="checkAll">
          <i class="fa fa-check-square"></i>
          全选
        </button>
        <button class="btn btn-primary btn-sm "
                v-if="pager.data.length && selectedShares.length === pager.data.length"
                @click.stop.prevent="checkNone">
          <i class="fa fa-square-o"></i>
          取消全选
        </button>
        <button class="btn btn-primary btn-sm " v-if="selectedShares.length" @click.stop.prevent="deleteBatch">
          <i class="fa fa-trash"></i>
          删除
        </button>
      </div>

      <div class="col-md-12" v-for="(share,index) in pager.data">
        <SharePanel
          :share="share"
          @deleteSuccess="refresh"
          @checkShare="checkShare"
          @previewShare="previewShare"
        />
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
  import Share from "../../../common/model/share/Share";
  import SharePanel from "./SharePanel"
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
      initFilter: {
        type: Object,
        required: false
      }
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

        if (this.initFilter) {
          for (let key in this.initFilter) {
            this.pager.setFilterValue(key, this.initFilter[key]);
          }
        }
        this.pager.httpFastPage()
      },
      checkShare(share) {

        let that = this
        //统计所有的勾选
        this.selectedShares.splice(0, this.selectedShares.length)
        this.pager.data.forEach(function (share, index) {
          if (share.check) {
            that.selectedShares.push(share)
          }
        })


      },
      //全选
      checkAll() {
        this.pager.data.forEach(function (i, index) {
          i.check = true
        })
        this.checkShare()
      },
      //取消全选
      checkNone() {
        this.pager.data.forEach(function (i, index) {
          i.check = false
        })

        this.checkShare()
      },
      previewShare(share) {

        let that = this;

        //从matter开始预览图片
        let imageArray = []
        let startIndex = -1;
        this.pager.data.forEach(function (item, index) {
          imageArray.push(item.getResizeUrl())
          if (item.uuid === share.uuid) {
            startIndex = imageArray.length - 1
          }
        })

        that.$photoSwipePlugin.showPhotos(imageArray, startIndex)

      },
      deleteBatch() {
        let that = this
        MessageBox.confirm('此操作将永久删除这些分享，删除后其他人将不可访问, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              let uuids = ""
              that.selectedShares.forEach(function (item, index) {
                if (index === 0) {
                  uuids = item.uuid
                } else {
                  uuids = uuids + "," + item.uuid
                }
              })
              let share = new Share()
              share.httpDeleteBatch(uuids, function (response) {
                Message.success('删除成功！')
                that.refresh()
              })
            }
          }
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
  .widget-share-list {

  }
</style>

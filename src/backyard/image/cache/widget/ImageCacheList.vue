<template>
  <div class="widget-image-cache-list animated fadeIn">
    <div class="row">
      <div class="col-md-12 text-right pb10">
        <button class="btn btn-primary btn-sm mr5" v-if="selectedImageCaches.length" @click.stop.prevent="deleteBatch">
          <i class="fa fa-trash"></i>
          {{ $t('delete') }}
        </button>
        <button class="btn btn-primary btn-sm mr5" v-if="selectedImageCaches.length !== pager.data.length"
                @click.stop.prevent="checkAll">
          <i class="fa fa-check-square"></i>
          {{ $t('selectAll') }}
        </button>
        <button class="btn btn-primary btn-sm mr5"
                v-if="pager.data.length && selectedImageCaches.length === pager.data.length"
                @click.stop.prevent="checkNone">
          <i class="fa fa-square-o"></i>
          {{ $t('cancel') }}
        </button>

      </div>

      <div class="col-md-12" v-for="(imageCache,index) in pager.data">
        <ImageCachePanel
          :imageCache="imageCache"
          @deleteSuccess="refresh"
          @checkImageCache="checkImageCache"
          @previewImageCache="previewImageCache"
        />
      </div>

      <div class="col-md-12 mt20">
        <NbPager :pager="pager" :callback="refresh"></NbPager>
      </div>

    </div>
  </div>
</template>

<script>
  import NbFilter from '../../../../common/widget/filter/NbFilter.vue'
  import NbPager from '../../../../common/widget/NbPager.vue'
  import Pager from '../../../../common/model/base/Pager'
  import ImageCache from "../../../../common/model/image/cache/ImageCache";
  import ImageCachePanel from "./ImageCachePanel"
  import {MessageBox, Message} from "element-ui"

  export default {

    data() {
      return {
        pager: new Pager(ImageCache, Pager.MAX_PAGE_SIZE),
        user: this.$store.state.user,
        selectedImageCaches: []
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
      ImageCachePanel
    },
    methods: {
      search() {
        this.pager.page = 0
        this.refresh()
      },
      refresh() {

        if (this.initFilter) {
          for (let key in this.initFilter) {
            if (this.initFilter.hasOwnProperty(key)) {
              this.pager.setFilterValue(key, this.initFilter[key]);
            }
          }
        }
        this.pager.httpFastPage()
      },
      checkImageCache(imageCache) {

        let that = this
        //统计所有的勾选
        this.selectedImageCaches.splice(0, this.selectedImageCaches.length)
        this.pager.data.forEach(function (imageCache, index) {
          if (imageCache.check) {
            that.selectedImageCaches.push(imageCache)
          }
        })


      },
      //全选
      checkAll() {
        this.pager.data.forEach(function (i, index) {
          i.check = true
        })
        this.checkImageCache()
      },
      //取消全选
      checkNone() {
        this.pager.data.forEach(function (i, index) {
          i.check = false
        })

        this.checkImageCache()
      },
      previewImageCache(imageCache) {

        let that = this;

        //从matter开始预览图片
        let imageArray = []
        let startIndex = -1;
        this.pager.data.forEach(function (item, index) {
          imageArray.push(item.getResizeUrl())
          if (item.uuid === imageCache.uuid) {
            startIndex = imageArray.length - 1
          }
        })

        that.$photoSwipePlugin.showPhotos(imageArray, startIndex)

      },
      deleteBatch() {
        let that = this
        MessageBox.confirm(that.$t("actionCanNotRevertConfirm"), that.$t("prompt"), {
          confirmButtonText: that.$t("confirm"),
          cancelButtonText: that.$t("cancel"),
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              let uuids = ""
              that.selectedImageCaches.forEach(function (item, index) {
                if (index === 0) {
                  uuids = item.uuid
                } else {
                  uuids = uuids + "," + item.uuid
                }
              })
              let imageCache = new ImageCache()
              imageCache.httpDeleteBatch(uuids, function (response) {
                Message.success(that.$t("operationSuccess"))
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
  .widget-image-cache-list {

  }
</style>

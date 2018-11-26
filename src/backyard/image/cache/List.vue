<template>
  <div class="backyard-image-cache-list animated fadeIn">
    <div class="row">

      <div class="col-md-12">
        <div class="pedia-navigation">
          <span class="item active">缓存图片列表</span>
        </div>
      </div>

      <div class="col-md-12">
        <NbFilter :filters="pager.filters" @change="search">
          <button class="btn btn-primary btn-sm " v-if="selectedImageCaches.length !== pager.data.length"
                  @click.stop.prevent="checkAll">
            <i class="fa fa-check-square"></i>
            全选
          </button>
          <button class="btn btn-primary btn-sm "
                  v-if="pager.data.length && selectedImageCaches.length === pager.data.length"
                  @click.stop.prevent="checkNone">
            <i class="fa fa-square-o"></i>
            取消全选
          </button>
          <button class="btn btn-primary btn-sm " v-if="selectedImageCaches.length" @click.stop.prevent="deleteBatch">
            <i class="fa fa-trash"></i>
            删除
          </button>
        </NbFilter>
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
  import NbFilter from '../../../common/widget/filter/NbFilter.vue'
  import NbPager from '../../../common/widget/NbPager.vue'
  import Pager from '../../../common/model/base/Pager'
  import ImageCache from "../../../common/model/image/cache/ImageCache";
  import ImageCachePanel from "./widget/ImageCachePanel"
  import {MessageBox, Message} from "element-ui"

  export default {

    data() {
      return {
        pager: new Pager(ImageCache),
        user: this.$store.state.user,
        selectedImageCaches: []
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
        MessageBox.confirm('此操作将永久删除这些文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
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
  .backyard-image-cache-list {

  }
</style>

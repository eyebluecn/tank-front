<template>
  <div class="widget-image-cache-panel">

    <div @click.stop.prevent="clickRow">

      <div class="media">

        <div class="pull-left">
          <div class="left-part">
            <span class="basic-span">
              <NbCheckbox v-model="imageCache.check"/>
            </span>
            <span class="basic-span">
              <img class="image-cache-icon" :src="handleImageUrl(imageCache.getOriginUrl(),false,100,100)"/>
            </span>
          </div>
        </div>

        <!--在大屏下的操作栏-->
        <div class="pull-right hidden-sm hidden-xs">
          <div class="right-part" v-if="imageCache.uuid">

            <span class="image-cache-operation">
              <i class="fa fa-trash btn-action text-danger" :title="$t('delete')" @click.stop.prevent="deleteImageCache"></i>
            </span>
            <span class="image-cache-size">
              {{imageCache.size | humanFileSize}}
            </span>

            <span class="image-cache-date">
              {{imageCache.updateTime | simpleDateHourMinute}}
            </span>

          </div>
        </div>

        <!--在小屏幕下的操作栏-->
        <div class="pull-right hidden-lg hidden-md">
          <span class="more-btn" @click.stop.prevent="showMore = !showMore">
            <i class="fa fa-ellipsis-h btn-action" :title="$t('showMore')"></i>
          </span>
        </div>

        <div class="media-body">

          <div class="middle-part">

            <span class="image-cache-name">
              {{imageCache.name}}
            </span>

          </div>
        </div>
      </div>

    </div>

    <NbExpanding>
      <div class="hidden-lg hidden-md more-panel" v-if="showMore">
        <div class="cell-btn" style="border: none">
          <span>
            {{imageCache.updateTime | simpleDateHourMinute}}
          </span>

          <span v-if="!imageCache.dir">
              {{imageCache.size | humanFileSize}}
          </span>
        </div>

        <div class="cell-btn text-danger" :title="$t('delete')" @click.stop.prevent="deleteImageCache">
          <i class="fa fa-trash"></i>
        </div>

      </div>
    </NbExpanding>

  </div>

</template>
<script>
  import ImageCache from '../../../../model/image/cache/ImageCache'
  import NbCheckbox from '../../../../components/NbCheckbox'
  import NbExpanding from '../../../../components/NbExpanding'
  import {Message, MessageBox} from 'element-ui'
  import {handleImageUrl} from "../../../../common/util/ImageUtil";

  export default {
    data() {
      return {
        //正在向服务器提交rename的请求
        renamingLoading: false,
        showMore: false
      }
    },
    components: {
      NbExpanding,
      NbCheckbox
    },
    props: {
      imageCache: {
        type: ImageCache,
        required: true
      }

    },
    watch: {
      'imageCache.check'(newVal, oldVal) {
        this.$emit('checkImageCache', this.imageCache)
      }
    },
    methods: {
      handleImageUrl,
      clickRow() {
        let that = this
        this.$emit('previewImageCache', this.imageCache)
      },
      deleteImageCache() {
        let that = this
        MessageBox.confirm(that.$t("actionCanNotRevertConfirm"), that.$t("prompt"), {
          confirmButtonText: that.$t("confirm"),
          cancelButtonText: that.$t("cancel"),
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              that.imageCache.httpDelete(function (response) {
                Message.success(that.$t("operationSuccess"))
                that.$emit('deleteSuccess', that.imageCache)
              })
            }

          }
        })
      },

      finishCreateDirectory() {
        let that = this
        that.imageCache.httpCreateDirectory(function () {
          that.director.createMode = false
          that.editMode = false

          that.imageCache.render(new ImageCache())

          that.$emit('createDirectorySuccess', that.imageCache)

        }, function (errorMessage) {
          that.director.createMode = false
          that.editMode = false
          Message.error(errorMessage)
        })
      }
    },
    created() {
    },
    mounted() {

    }
  }

</script>
<style lang="less" rel="stylesheet/less">

  @import "../../../../assets/css/global/variables";

  @base-height: 48px;
  @inner-cell-height: 36px;

  .basic-span {
    display: inline-block;
    vertical-align: middle;
    line-height: @base-height;
    margin-right: 5px;
  }

  .widget-image-cache-panel {

    border-top: 1px solid #eee;
    background-color: white;

    .media {
      > .pull-left {
        padding-right: 1px;
      }
    }

    .image-cache-icon {
      width: 24px;
    }

    .left-part {
      margin-left: 10px;
    }
    .middle-part {

      height: @base-height;
      overflow: hidden;

      .image-cache-name-edit {
        .basic-span;

        width: 90%;
        input {
          width: 100%;
          height: 26px;
          display: inline-block;
          padding: 6px;
        }
      }

      .image-cache-name {
        .basic-span;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .right-part {

      .image-cache-operation {
        .basic-span;
        display: none;
        i {
          font-size: 16px;
          margin-right: 5px;

          &:hover {

          }
        }
      }
      .image-cache-size {
        .basic-span;
        display: inline-block;
        width: 80px;
        text-align: left;
        margin-left: 20px;
      }
      .image-cache-date {
        .basic-span;
      }
    }

    .more-btn {
      display: inline-block;
      vertical-align: middle;
      line-height: @base-height;
      padding: 0 15px;
    }

    &:hover {
      background-color: aliceblue;
      cursor: pointer;

      .image-cache-operation {
        display: inline-block;
      }
    }

    .more-panel {
      border-top: 1px solid #eee;
      padding-left: 35px;
      .info {
      }
      .cell-btn {
        border-top: 1px solid #eee;
        line-height: @inner-cell-height;
        vertical-align: middle;
      }
    }
  }

</style>

<template>
  <div class="widget-share-matter-panel">

    <div @click.stop.prevent="clickRow">

      <div class="media">

        <div class="pull-left">
          <div class="left-part">
            <span class="basic-span">
              <img class="matter-icon" :src="getIcon()"/>
            </span>
          </div>
        </div>

        <!--在大屏下的操作栏-->
        <div class="pull-right hidden-sm hidden-xs">
          <div class="right-part" v-if="matter.uuid">

            <span class="matter-operation">

              <i class="fa fa-download btn-action text-primary" title="下载"
                 @click.stop.prevent="download()"></i>

            </span>
            <span class="matter-size">
              {{matter.size | humanFileSize}}
            </span>

            <span class="matter-date">
              {{matter.updateTime | simpleDateHourMinute}}
            </span>

          </div>
        </div>

        <!--在小屏幕下的操作栏-->
        <div class="pull-right hidden-lg hidden-md">
          <span class="more-btn" @click.stop.prevent="showMore = !showMore">
            <i class="fa fa-ellipsis-h btn-action" :title="$t('share.more')"></i>
          </span>
        </div>

        <div class="media-body">

          <div class="middle-part">

            <span class="matter-name"
                  :title="matter.name">
                {{matter.name}}
              </span>

          </div>
        </div>
      </div>

    </div>

    <NbExpanding>
      <div class="hidden-lg hidden-md more-panel" v-if="showMore">
        <div class="cell-btn" style="border: none">
          <span>
            {{matter.updateTime | simpleDateHourMinute}}
          </span>

          <span v-if="!matter.dir">
              {{matter.size | humanFileSize}}
          </span>
        </div>

        <div class="cell-btn" :title="$t('download')" v-if="!matter.dir"
             @click.stop.prevent="matter.download()">
          <i class="fa fa-download"></i>
          {{$t('download')}}
        </div>

      </div>
    </NbExpanding>

  </div>

</template>
<script>
  import Matter from '../../../model/matter/Matter'
  import NbExpanding from '../../../components/NbExpanding'
  import {handleImageUrl} from "../../../common/util/ImageUtil";
  import Share from "../../../model/share/Share";

  export default {
    data() {
      return {
        showMore: false
      }
    },
    components: {
      NbExpanding
    },
    props: {
      matter: {
        type: Matter,
        required: true
      },
      share: {
        type: Share,
        required: true
      }
    },
    watch: {},
    methods: {
      clickRow() {
        let that = this

        if (this.matter.dir) {
          this.$emit('goToDirectory', that.matter)
        } else {

          that.matter.preview(that.matter.getSharePreviewUrl(this.share.uuid, this.share.code, this.share.rootUuid))
        }
      },

      getIcon() {

        if (this.matter.isImage()) {

          return handleImageUrl(this.matter.getSharePreviewUrl(this.share.uuid, this.share.code, this.share.rootUuid), false, 100, 100)

        } else {
          return this.matter.getIcon()
        }
      },
      download() {

        this.matter.download(this.matter.getShareDownloadUrl(this.share.uuid, this.share.code, this.share.rootUuid))
      }

    },
    created() {
    },
    mounted() {

    }
  }

</script>
<style lang="less" rel="stylesheet/less">

  @import "../../../assets/css/global/variables";

  @base-height: 48px;
  @inner-cell-height: 36px;

  .basic-span {
    display: inline-block;
    vertical-align: middle;
    line-height: @base-height;
    margin-right: 5px;
  }

  .widget-share-matter-panel {

    border-top: 1px solid #eee;
    background-color: white;

    .media {
      > .pull-left {
        padding-right: 1px;
      }
    }

    .matter-icon {
      width: 24px;
    }

    .left-part {
      margin-left: 10px;
    }

    .middle-part {

      height: @base-height;
      overflow: hidden;

      .matter-name-edit {
        .basic-span;

        width: 90%;

        input {
          width: 100%;
          height: 26px;
          display: inline-block;
          padding: 6px;
        }
      }

      .matter-name {
        .basic-span;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        &.alien {
          color: @brand-primary;
          font-weight: bold;
        }
      }
    }

    .right-part {

      .matter-operation {
        .basic-span;
        display: none;

        i {
          font-size: 16px;
          margin-right: 5px;

          &:hover {

          }
        }
      }

      .matter-size {
        .basic-span;
        display: inline-block;
        width: 80px;
        text-align: left;
        margin-left: 20px;
      }

      .matter-date {
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

      .matter-operation {
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

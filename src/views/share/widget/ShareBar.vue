<template>
  <div class="widget-share-bar">

    <div @click.stop.prevent="$router.push('/share/detail/'+share.uuid)">

      <div class="media">

        <div class="pull-left">
          <div class="left-part">
            <span class="basic-span">
              <img class="share-icon" :src="share.getIcon()"/>
            </span>
          </div>
        </div>

        <!--在大屏下的操作栏-->
        <div class="pull-right hidden-sm hidden-xs">
          <div class="right-part" v-if="share.uuid">

            <span class="share-operation">
              <i class="fa fa-info-circle btn-action text-primary"
                 :title="$t('share.shareDetail')"
                 @click.stop.prevent="shareDialogVisible = true"></i>
            </span>

            <span class="share-operation">
              <i class="fa fa-trash btn-action text-danger"
                 :title="$t('delete')"
                 @click.stop.prevent="deleteShare"></i>
            </span>

            <span class="share-date" :title="$t('share.shareTime')">
              {{share.updateTime | simpleDateHourMinute}}
            </span>

            <span class="share-date w110 text-center" :title="$t('share.expireTime')"  v-if="share.expireInfinity">
              {{$t('share.noExpire')}}
            </span>

            <span class="share-date w110 text-center" :title="$t('share.expireTime')"  v-if="!share.expireInfinity">
              {{share.expireTime | simpleDateHourMinute}}
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

            <span class="share-name">
              {{share.name}}
              <span class="text-danger" v-if="share.hasExpired()">{{$t('share.expired')}}</span>
            </span>

          </div>
        </div>
      </div>
    </div>


    <NbExpanding>
      <div class="hidden-lg hidden-md more-panel" v-if="showMore">
        <div class="cell-btn" style="border: none">

          <span :title="$t('share.shareTime')">
            {{$t('share.shareTime')}}:{{share.createTime | simpleDateHourMinute}}
          </span>

          <span :title="$t('share.expireTime')" v-if="share.expireInfinity">
            {{$t('share.noExpire')}}
          </span>
          <span :title="$t('share.expireTime')" v-if="!share.expireInfinity">
            {{$t('share.expireTime')}}:{{share.expireTime | simpleDateHourMinute}}
          </span>
        </div>

        <div class="cell-btn" :title="$t('share.shareDetail')" @click.stop.prevent="shareDialogVisible = true">
          <i class="fa fa-info-circle"></i>
          {{$t('share.shareDetail')}}
        </div>

        <div class="cell-btn text-danger" :title="$t('delete')" @click.stop.prevent="deleteShare">
          <i class="fa fa-trash"></i>
          {{$t('delete')}}
        </div>

      </div>
    </NbExpanding>

    <el-dialog
      :title="$t('share.shareDetail')"
      :visible.sync="shareDialogVisible"
      :append-to-body="true">
      <ShareDialogPanel :share="share"/>
      <span slot="footer" class="dialog-footer">
                <button class="btn btn-primary btn-sm mr5" @click="share.copyLinkAndCode()">{{$t('share.copyLinkAndCode')}}</button>
                <button class="btn btn-default btn-sm mr5" @click="shareDialogVisible = false">{{$t('close')}}</button>
              </span>
    </el-dialog>

  </div>

</template>
<script>
  import Share from '../../../model/share/Share'
  import NbCheckbox from '../../../components/NbCheckbox'
  import NbExpanding from '../../../components/NbExpanding'
  import {Message, MessageBox} from 'element-ui'
  import {handleImageUrl} from "../../../common/util/ImageUtil";
  import ShareDialogPanel from "./ShareDialogPanel"

  export default {
    data() {
      return {
        shareDialogVisible: false,
        showMore: false
      }
    },
    components: {
      NbExpanding,
      NbCheckbox,
      ShareDialogPanel
    },
    props: {
      share: {
        type: Share,
        required: true
      }

    },
    watch: {},
    methods: {
      handleImageUrl,
      deleteShare() {
        let that = this
        MessageBox.confirm(that.$t("actionCanNotRevertConfirm"), that.$t("prompt"), {
          confirmButtonText: that.$t("confirm"),
          cancelButtonText: that.$t("cancel"),
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              that.share.httpDelete(function (response) {
                Message.success(that.$t("operationSuccess"))
                that.$emit('deleteSuccess', that.share)
              })
            }

          }
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

  @import "../../../assets/css/global/variables";

  @base-height: 48px;
  @inner-cell-height: 36px;

  .basic-span {
    display: inline-block;
    vertical-align: middle;
    line-height: @base-height;
    margin-right: 5px;
  }

  .widget-share-bar {

    border-top: 1px solid #eee;
    background-color: white;

    .media {
      > .pull-left {
        padding-right: 1px;
      }
    }

    .share-icon {
      width: 24px;
    }

    .left-part {
      margin-left: 10px;
    }

    .middle-part {

      height: @base-height;
      overflow: hidden;

      .share-name-edit {
        .basic-span;

        width: 90%;

        input {
          width: 100%;
          height: 26px;
          display: inline-block;
          padding: 6px;
        }
      }

      .share-name {
        .basic-span;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .right-part {

      .share-operation {
        .basic-span;
        display: none;

        i {
          font-size: 16px;
          margin-right: 5px;

          &:hover {

          }
        }
      }

      .share-size {
        .basic-span;
        display: inline-block;
        width: 80px;
        text-align: left;
        margin-left: 20px;
      }

      .share-date {
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

      .share-operation {
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

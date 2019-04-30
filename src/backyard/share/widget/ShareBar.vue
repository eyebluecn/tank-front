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
              <i class="fa fa-trash btn-action text-danger" title="删除" @click.stop.prevent="deleteShare"></i>
            </span>

            <span class="share-date" title="分享时间">
              {{share.updateTime | simpleDateHourMinute}}
            </span>

            <span class="share-date w110 text-center" title="到期时间" v-if="share.expireInfinity">
              永久有效
            </span>

            <span class="share-date w110 text-center" title="到期时间" v-if="!share.expireInfinity">
              {{share.expireTime | simpleDateHourMinute}}
            </span>

          </div>
        </div>


        <!--在小屏幕下的操作栏-->
        <div class="pull-right hidden-lg hidden-md">
          <span class="more-btn" @click.stop.prevent="showMore = !showMore">
            <i class="fa fa-ellipsis-h btn-action" title="显示更多"></i>
          </span>
        </div>

        <div class="media-body">

          <div class="middle-part">

            <span class="share-name">
              {{share.name}}
            </span>

          </div>
        </div>
      </div>
    </div>


    <NbExpanding>
      <div class="hidden-lg hidden-md more-panel" v-if="showMore">
        <div class="cell-btn" style="border: none">

          <span title="分享时间">
            分享时间：{{share.createTime | simpleDateHourMinute}}
          </span>

          <span title="到期时间" v-if="share.expireInfinity">
            永久有效
          </span>
          <span title="到期时间" v-if="!share.expireInfinity">
            到期时间：{{share.expireTime | simpleDateHourMinute}}
          </span>


        </div>

        <div class="cell-btn text-danger" title="删除" @click.stop.prevent="deleteShare">
          <i class="fa fa-trash"></i>
          删除
        </div>

      </div>
    </NbExpanding>

  </div>

</template>
<script>
  import Share from '../../../common/model/share/Share'
  import NbCheckbox from '../../../common/widget/NbCheckbox'
  import NbExpanding from '../../../common/widget/NbExpanding'
  import {Message, MessageBox} from 'element-ui'
  import {handleImageUrl} from "../../../common/util/ImageUtil";

  export default {
    data() {
      return {
        showMore: false
      }
    },
    components: {
      NbExpanding,
      NbCheckbox
    },
    props: {
      share: {
        type: Share,
        required: true
      }

    },
    watch: {

    },
    methods: {
      handleImageUrl,
      deleteShare() {
        let that = this
        MessageBox.confirm('此操作将永久删除该分享, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              that.share.httpDelete(function (response) {
                Message.success('删除成功！')
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

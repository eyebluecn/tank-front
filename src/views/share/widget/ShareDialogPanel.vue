<template>
  <div class="widget-share-dialog-panel">
    <div class="share-block">
      <div>
        <img class="share-icon" :src="share.getIcon()"/>
        <span class="name">{{share.name}}</span>
        <span class="italic" v-if="showSuccessHint"> {{$t('share.shareSuccess')}} <i
          class="fa fa-check text-success"></i></span>
      </div>
      <div class="mt15">
        <span class="inline-block mr10">
          {{$t('share.sharer')}}:{{share.username}}
        </span>
        <span class="inline-block mr10" v-if="!share.expireInfinity">
          {{$t('share.expireTime')}}:{{share.expireTime | simpleDateHourMinute}}
        </span>
        <span class="inline-block mr10" v-if="share.expireInfinity">
          {{$t('share.noExpire')}}
        </span>
      </div>
      <div class="mt15">
        {{$t('share.link')}}:
        <span>{{share.getLink()}}</span>
        <a class="mr15" :title="$t('share.copyLink')"
           @click.stop.prevent="copyText(share.getLink())">
          <i class="fa fa-copy"></i>
        </a>
      </div>
      <div class="mt15">
        {{$t('share.code')}}:
        <span>{{share.code}}</span>
        <a class="mr15" :title="$t('share.copyCode')"
           @click.stop.prevent="copyText(share.code)">
          <i class="fa fa-copy"></i>
        </a>
      </div>

    </div>
  </div>
</template>

<script>
  import Share from "../../../model/share/Share";

  export default {
    data() {
      return {}
    },
    watch: {},
    props: {
      share: {
        type: Share,
        required: true
      },
      showSuccessHint: {
        type: Boolean,
        "default": false,
        required: false
      }
    },
    components: {},
    methods: {
      copyText(text) {
        let that = this;
        that.$copyPlguin.copy(text, function () {
          that.$message.success({
            message: text + that.$t('share.copySuccess'),
            center: true
          })
        })
      }
    },
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .widget-share-dialog-panel {

    .share-block {

      .share-icon {
        width: 30px;
        height: 30px;
      }

      .name {
        font-size: 18px;
        margin-left: 10px;
        line-height: 30px;
      }

    }

  }
</style>

<template>
  <div class="widget-share-panel">

    <div class="row" v-if="!share.uuid">
      <label class="col-md-4 control-label mt5">有效期</label>
      <div class="col-md-8">
        <select class="form-control" v-model="share.expireOption">
          <option v-for="item in ShareExpireOptionList" :value="item.value">{{item.name}}</option>
        </select>
      </div>
    </div>

    <div class="share-block" v-if="share.uuid">

      <div>
        <img class="share-icon" :src="share.getIcon()"/>
        <span class="name">{{share.name}}</span>
        <span class="italic">分享成功 <i class="fa fa-check text-success"></i></span>
      </div>
      <div class="mt15">
        <span class="inline-block mr10">
          分享者：{{share.username}}
        </span>
        <span class="inline-block mr10" v-if="!share.expireInfinity">
          失效时间：{{share.expireTime | simpleDateHourMinute}}
        </span>
        <span class="inline-block mr10" v-if="share.expireInfinity">
          永久有效
        </span>
      </div>
      <div class="mt15">
        链接：
        <span>{{share.getLink()}}</span>
        <a class="mr15" title="复制链接"
           @click.stop.prevent="copyText(share.getLink())">
          <i class="fa fa-copy"></i>
        </a>
      </div>
      <div class="mt15">
        提取码：
        <span>{{share.code}}</span>
        <a class="mr15" title="复制提取码"
           @click.stop.prevent="copyText(share.code)">
          <i class="fa fa-copy"></i>
        </a>
      </div>

    </div>

    <div class="text-right mt10">

      <button class="btn btn-primary btn-sm" @click.stop.prevent="copyLinkAndCode" v-if="share.uuid">
        复制链接+提取码
      </button>
      <button class="btn btn-primary btn-sm" @click.stop.prevent="submit" v-if="!share.uuid">
        分享
      </button>

      <button class="btn btn-default btn-sm" @click.stop.prevent="close">
        关闭
      </button>
    </div>

  </div>
</template>

<script>
  import {ShareExpireOptionList} from "../../../common/model/share/ShareExpireOption";
  import Share from "../../../common/model/share/Share";
  import {currentHost} from "../../../common/util/Utils";

  export default {
    data() {
      return {
        ShareExpireOptionList,
        share: new Share()
      }
    },
    watch: {
      matters(newVal, oldVal) {
        console.log("matters变化了", newVal, oldVal)
        this.share.render(new Share())
      }
    },
    props: {
      matters: {
        type: Array,
        required: true
      }
    },
    components: {},
    methods: {

      currentHost,
      submit() {

        let that = this

        let uuids = []

        that.matters.forEach(function (item, index) {
          uuids.push(item.uuid)
        })

        that.share.httpCreate(uuids, function (response) {

        }, function (errorMessage, response) {
          that.$message.error(errorMessage)
        })

      },
      copyText(text) {
        let that = this;
        that.$copyPlguin.copy(text, function () {
          that.$message.success({
            message: text + " 复制成功!",
            center: true
          })
        })
      },
      copyLinkAndCode() {
        let that = this;
        let text = "链接：" + that.share.getLink() + " 提取码：" + that.share.code
        that.$copyPlguin.copy(text, function () {
          that.$message.success({
            message: "链接+提取码 复制成功!",
            center: true
          })
        })
      },

      close() {
        this.$emit("close")
      }
    },
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .widget-share-panel {

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

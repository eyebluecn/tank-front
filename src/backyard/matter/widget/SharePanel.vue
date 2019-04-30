<template>
  <div class="widget-share-panel">

    <div class="row mt10">
      <label class="col-md-4 control-label mt5">有效期</label>
      <div class="col-md-8">
        <select class="form-control" v-model="share.expireOption">
          <option v-for="item in ShareExpireOptionList" :value="item.value">{{item.name}}</option>
        </select>
      </div>
    </div>

  </div>
</template>

<script>
  import {ShareExpireOptionList} from "../../../common/model/share/ShareExpireOption";
  import Share from "../../../common/model/share/Share";

  export default {
    data() {
      return {
        ShareExpireOptionList
      }
    },
    watch: {},
    props: {
      //选择了一个时间后的回调。
      share: {
        type: Share,
        required: true
      }
    },
    components: {},
    methods: {

      submit() {
        console.log("开始提交", this.share.shareType)
      }
    },
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .widget-share-panel {

  }
</style>

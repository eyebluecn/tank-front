<template>
  <div class="backyard-preference">

    <div class="preference-block tank-box">
      <div class="row">
        <div class="col-md-12 form-info">
          <span>网站名称：</span>
          <span class="bold">{{preference.name}}</span>
        </div>

        <div class="col-md-12 form-info">
          <span>logo：</span>
          <span>
            <img v-if="preference.logoUrl" :src="preference.logoUrl" alt="logo" class="max-height-100">
          </span>
        </div>

        <div class="col-md-12 form-info">
          <span>favicon：</span>
          <span>
            <img v-if="preference.faviconUrl" :src="preference.faviconUrl" alt="favicon" class="max-height-100">
          </span>
        </div>

        <div class="col-md-12 form-info">
          <span>版权信息：</span>
          <span v-html="preference.copyright"></span>
        </div>

        <div class="col-md-12 form-info">
          <span>备案信息：</span>
          <span v-html="preference.record"></span>
        </div>

        <div class="col-md-12 form-info">
          <span>zip下载数量限制：</span>
          <span v-html="preference.downloadDirMaxNum"></span>
        </div>

        <div class="col-md-12 form-info">
          <span>是否允许用户自主注册：</span>
          <span>{{preference.allowRegister?'是':'否'}}</span>
        </div>

        <div class="col-md-12 form-info">
          <span>zip下载大小限制：</span>
          <span>
            <span class="mr10">
                    <span v-if="preference.downloadDirMaxSize >= 0">
                            {{preference.downloadDirMaxSize | humanFileSize}}
                          </span>
                    <span v-else>
                            无限制
                          </span>
                </span>
          </span>
        </div>

        <div class="col-md-12 form-info">
          <span>用户默认总大小限制：</span>
          <span>
            <span class="mr10">
                    <span v-if="preference.defaultTotalSizeLimit >= 0">
                            {{preference.defaultTotalSizeLimit | humanFileSize}}
                          </span>
                    <span v-else>
                            无限制
                          </span>
                </span>
          </span>
        </div>

      </div>
    </div>

    <div class="text-right">
      <button class="btn btn-sm btn-primary" @click.stop.prevent="systemCleanup" title="重置系统将清空除管理员账号外所有数据">
        <i class="fa fa-warning"></i>
        重置系统
      </button>
      <router-link class="btn btn-sm btn-primary" to="/preference/edit">
        <i class="fa fa-pencil"></i>
        修改
      </router-link>
    </div>

  </div>
</template>

<script>
  import NbSwitcher from "../../common/widget/NbSwitcher"

  export default {
    data() {
      return {
        preference: this.$store.state.preference
      }
    },
    methods: {
      systemCleanup() {

        let that = this
        let preference = this.preference

        this.$prompt('重置系统将清空除管理员账号外所有数据，事关重大，请输入登录密码', '提示', {
          inputValue: null,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,45}$/,
          inputErrorMessage: '必填，不超过45个字'
        }).then(({value}) => {

          preference.httpSystemCleanup(value, function () {
            that.$message.success("重置系统成功！");
          })
        }).catch(() => {

        });

      }
    },
    components: {
      NbSwitcher
    },
    mounted() {
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-preference {
    .max-height-100 {
      max-height: 100px;
    }

    .preference-block {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
</style>

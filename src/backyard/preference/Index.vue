<template>
  <div class="backyard-preference">

    <div class="preference-block tank-box">
      <div class="row">
        <div class="col-md-12 form-info">
          <span>{{$t('preference.websiteName')}}: </span>
          <span class="bold">{{preference.name}}</span>
        </div>

        <div class="col-md-12 form-info">
          <span>{{$t('preference.logo')}}: </span>
          <span>
            <img v-if="preference.logoUrl" :src="preference.logoUrl" alt="logo" class="max-height-100">
          </span>
        </div>

        <div class="col-md-12 form-info">
          <span>favicon: </span>
          <span>
            <img v-if="preference.faviconUrl" :src="preference.faviconUrl" alt="favicon" class="max-height-100">
          </span>
        </div>

        <div class="col-md-12 form-info">
          <span>{{$t('preference.copyright')}}: </span>
          <span v-html="preference.copyright"></span>
        </div>

        <div class="col-md-12 form-info">
          <span>{{$t('preference.extraInfo')}}: </span>
          <span v-html="preference.record"></span>
        </div>

        <div class="col-md-12 form-info">
          <span>{{$t('preference.zipMaxNumLimit')}}: </span>
          <span v-html="preference.downloadDirMaxNum"></span>
        </div>

        <div class="col-md-12 form-info">
          <span>{{$t('preference.allowRegister')}}: </span>
          <span>{{preference.allowRegister?$t('yes'):$t('no')}}</span>
        </div>

        <div class="col-md-12 form-info">
          <span>{{$t('preference.zipMaxSizeLimit')}}: </span>
          <span>
            <span class="mr10">
                    <span v-if="preference.downloadDirMaxSize >= 0">
                            {{preference.downloadDirMaxSize | humanFileSize}}
                          </span>
                    <span v-else>
                            {{$t('preference.noLimit')}}
                          </span>
                </span>
          </span>
        </div>

        <div class="col-md-12 form-info">
          <span>{{$t('preference.userDefaultSizeLimit')}}: </span>
          <span>
            <span class="mr10">
                    <span v-if="preference.defaultTotalSizeLimit >= 0">
                            {{preference.defaultTotalSizeLimit | humanFileSize}}
                          </span>
                    <span v-else>
                            {{$t('preference.noLimit')}}
                          </span>
                </span>
          </span>
        </div>

        <div class="col-md-12 form-info">
          <span>{{$t('preference.docLink')}}: </span>
          <span>
            <a :href="$t('preference.tankDocLink')" target="_blank">{{$t('preference.tankDocLink')}}</a>
          </span>
        </div>

      </div>
    </div>

    <div class="text-right">
      <button class="btn btn-sm btn-danger mr5"
              @click.stop.prevent="systemCleanup"
              :title="$t('preference.systemCleanupDescription')">
        <i class="fa fa-warning"></i>
        {{$t('preference.systemCleanup')}}
      </button>
      <router-link class="btn btn-sm btn-primary mr5" to="/preference/edit">
        <i class="fa fa-pencil"></i>
        {{$t('edit')}}
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

        this.$prompt(that.$t("preference.systemCleanupPrompt"), that.$t("prompt"), {
          inputValue: null,
          confirmButtonText: that.$t("confirm"),
          cancelButtonText: that.$t("cancel"),
          inputPattern: /^.{1,45}$/,
          inputErrorMessage: that.$t("required")
        }).then(({value}) => {

          preference.httpSystemCleanup(value, function () {
            that.$message.success(that.$t("operationSuccess"));
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

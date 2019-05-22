<template>
  <div class="backyard-preference-edit animated fadeIn">

    <div class="tank-box bg-white br4 p20 mt10">
      <div class="row" v-validator="preference.validatorSchema.name.error">
        <label class="col-md-2 control-label mt5 compulsory">
          {{$t('preference.websiteName')}}
        </label>
        <div class="col-md-10 validate">
          <input type="text" class="form-control" v-model="preference.name">
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">
          {{$t('preference.logo')}}
        </label>
        <div class="col-md-10">
          <MatterImage v-model="preference.logoUrl" :uploadHint="$t('preference.logoSquare')"/>
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">favicon</label>
        <div class="col-md-10">
          <MatterImage v-model="preference.faviconUrl" filter=".ico"
                       :uploadHint="$t('preference.onlyAllowIco')"
                       :previewWidth="60"/>
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">{{$t('preference.copyright')}}</label>
        <div class="col-md-10">
          <input type="text" class="form-control" v-model="preference.copyright">
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">{{$t('preference.extraInfo')}}</label>
        <div class="col-md-10">
          <input type="text" class="form-control" v-model="preference.record">
        </div>
      </div>


      <div class="row mt10">
        <label class="col-md-2 control-label mt5">{{$t('preference.zipMaxNumLimit')}}</label>
        <div class="col-md-10">
          <input type="text" class="form-control" v-model="preference.downloadDirMaxNum">
        </div>
      </div>


      <div class="row mt10">
        <label class="col-md-2 control-label mt5">{{$t('preference.zipMaxSizeLimit')}} </label>
        <div class="col-md-10">
          <div class="row">
            <div class="col-xs-6">
              <input type="number" class="form-control" v-model="preference.downloadDirMaxSize">
            </div>
            <div class="col-xs-6" style="line-height:30px;">
              {{$t('preference.current')}}:
              <span v-if="preference.downloadDirMaxSize < 0">{{$t('preference.noLimit')}}</span>
              <span v-else>{{preference.downloadDirMaxSize | humanFileSize}}</span>
            </div>
          </div>

        </div>

      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">{{$t('preference.userDefaultSizeLimit')}}</label>
        <div class="col-md-10">
          <div class="row">
            <div class="col-xs-6">
              <input type="number" class="form-control" v-model="preference.defaultTotalSizeLimit">
            </div>
            <div class="col-xs-6" style="line-height:30px;">
              {{$t('preference.current')}}:
              <span v-if="preference.defaultTotalSizeLimit < 0">{{$t('preference.noLimit')}}</span>
              <span v-else>{{preference.defaultTotalSizeLimit | humanFileSize}}</span>
            </div>
          </div>

        </div>

      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">{{$t('preference.allowRegister')}}</label>
        <div class="col-md-10">
          <NbSwitcher v-model="preference.allowRegister"/>
        </div>
      </div>

    </div>

    <div class="row mt10">
      <div class="col-md-12">
        <div>
          <CreateSaveButton :entity="preference" :callback="save"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CreateSaveButton from '../widget/CreateSaveButton'
  import MatterImage from '../matter/widget/MatterImage'
  import Preference from '../../common/model/preference/Preference'
  import NbSwitcher from "../../common/widget/NbSwitcher"

  export default {
    name: 'edit',
    data() {
      return {
        globalPreference: this.$store.state.preference,
        preference: new Preference()
      }
    },
    components: {
      MatterImage,
      CreateSaveButton,
      NbSwitcher
    },
    methods: {
      save() {
        let that = this;
        this.preference.httpSave(function (response) {

          that.$message.success({
            message: that.$t('operationSuccess')
          });

          that.globalPreference.render(response.data.data);

          that.preference.updateTitleAndFavicon();

          that.$router.go(-1);
        })
      }
    },
    mounted() {
      let that = this;
      //为了让按钮的文字显示为“保存”
      this.preference.editMode = true
      this.preference.httpFetch()
    }
  }
</script>

<style lang="less" rel="stylesheet/less">

</style>

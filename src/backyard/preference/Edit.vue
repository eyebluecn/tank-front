<template>
  <div class="backyard-preference-edit animated fadeIn">
    <div class="row">
      <div class="col-md-12">
        <div class="pedia-navigation">
					<span class="item active">
						偏好设置
					</span>
        </div>
      </div>
    </div>
    <div class="bg-white br4 p20 mt10">
      <div class="row" v-validator="preference.validatorSchema.name.error">
        <label class="col-md-2 control-label mt5 compulsory">网盘名称</label>
        <div class="col-md-10 validate">
          <input type="text" class="form-control" v-model="preference.name">
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">云盘logo</label>
        <div class="col-md-10">
          <MatterImage v-model="preference.logoUrl" uploadHint="logo请使用正方形图片，否则在显示时会裁剪成正方形"/>
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">favicon</label>
        <div class="col-md-10">
          <MatterImage v-model="preference.faviconUrl" filter=".ico" uploadHint="只允许上传.ico图标" :previewWidth="60"/>
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">底部第一行文字(可使用html)</label>
        <div class="col-md-10">
          <input type="text" class="form-control" v-model="preference.footerLine1">
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">底部第二行文字(可使用html)</label>
        <div class="col-md-10">
          <input type="text" class="form-control" v-model="preference.footerLine2">
        </div>
      </div>

      <div class="row mt10">
        <label class="col-md-2 control-label mt5">是否显示应用数据</label>
        <div class="col-md-10">
          <NbSwitcher v-model="preference.showAlien"/>
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
            message: '修改偏好成功！'
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

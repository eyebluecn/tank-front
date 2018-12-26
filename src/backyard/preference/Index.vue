<template>
  <div class="backyard-preference">

    <div class="pedia-navigation">
      <span class="item active">网站偏好</span>
      <span class="tool">
        <router-link class="btn btn-sm btn-primary" to="/preference/edit">
          <i class="fa fa-pencil"></i>
          修改
        </router-link>
      </span>
    </div>


    <div class="preference-block">
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
            <img v-if="preference.logoUrl" :src="preference.logoUrl" alt="logo" class="max-height-100">
          </span>
        </div>

        <div class="col-md-12 form-info">
          <span>底部第一行文字：</span>
          <span v-html="preference.footerLine1"></span>
        </div>

        <div class="col-md-12 form-info">
          <span>底部第二行文字：</span>
          <span v-html="preference.footerLine2"></span>
        </div>

        <div class="col-md-12 form-info">
          <span>是否显示应用数据：</span>
          <NbSwitcher :disabled="true" v-model="preference.showAlien"/>
        </div>

      </div>
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
    methods: {},
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
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      border-radius: 5px;
      padding: 20px 15px 10px 15px;
      margin-top: 10px;
      margin-bottom: 30px;
    }
  }
</style>

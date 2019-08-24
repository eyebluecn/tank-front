<template>
  <div class="bottom-navigation text-center">
		<span class="item">
			<span v-html="preference.copyright"></span>
		</span>
    <span class="item">
			<span v-html="preference.record"></span>
		</span>
    <span class="item">
			<a href="javascript:void(0)" @click.stop.prevent="changeLang">
        {{Vue.store.state.lang==='zh'?'English':'中文'}}
      </a>
		</span>
    <!-- 版本号：cn.eyeblue.tank:3.0.0 -->
    <!-- 开源不易，请不要移除掉这里的代码，蓝眼云盘谢谢您 ^_^ -->
    <span class="brand">
			Powered by <a target="_blank" href="https://github.com/eyebluecn/tank">
      <img class="w30" src="../../assets/img/logo.png"/>
      {{ Vue.i18n.t("eyeblueTank") }}</a>
		</span>
  </div>
</template>

<script>
  import Cookies from "js-cookie"
  import Vue from "vue"

  export default {
    data() {
      return {
        Vue,
        preference: Vue.store.state.preference
      }
    },
    methods: {
      changeLang() {
        if (Vue.store.state.lang === 'zh') {
          Vue.store.state.lang = 'en'
        } else {
          Vue.store.state.lang = 'zh'
        }

        Cookies.set('_lang', Vue.store.state.lang);
        Vue.i18n.locale = Vue.store.state.lang
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../assets/css/global/variables";

  .bottom-navigation {

    //大屏幕
    @media (min-width: @screen-sm-min) {

      position: fixed;
      height: @power-footer-height;
      line-height: @power-footer-height;
      background-color: white;
      bottom: 0;
      right: 0;
      left: @sidebar-width;
      padding: 0 20px;
      border-top: 1px solid #eee;
      .item {
        margin-right: 10px;
      }

    }
    //小屏幕
    @media (max-width: @screen-xs-max) {
      .item {
        display: block;
      }
    }

    &.show-drawer {
      //大屏幕
      @media (min-width: @screen-sm-min) {
        position: fixed;
        height: @power-footer-height;
        line-height: @power-footer-height;
        background-color: white;
        bottom: 0;
        right: 0;
        left: @sidebar-width;
        padding: 0 20px;
        border-top: 1px solid #eee;

        .item {
          margin-right: 10px;
        }
      }

      //小屏幕
      @media (max-width: @screen-xs-max) {
        .item {
          display: block;
        }
      }
    }

    .brand {
    }
  }
</style>

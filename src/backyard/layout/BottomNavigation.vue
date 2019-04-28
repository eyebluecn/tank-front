<template>
  <div class="bottom-navigation text-center">
		<span class="mr10">
			<span v-html="preference.copyright"></span>
		</span>
    <span class="mr10">
			<span v-html="preference.record"></span>
		</span>
    <!-- 版本号：cn.eyeblue.tank:2.0.0 -->
    <!-- 开源不易，请不要移除掉这里的代码，蓝眼云盘谢谢您 ^_^ -->
    <span>
			Powered by <a target="_blank" href="https://github.com/eyebluecn/tank">
      <img class="w30" src="../../assets/img/logo.png"/>
      蓝眼云盘{{$store.state.version.versionName}}</a>
		</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        preference: this.$store.state.preference
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../assets/css/global/variables";

  .bottom-navigation {
    position: fixed;
    height: @power-footer-height;
    line-height: @power-footer-height;
    background-color: white;
    bottom: 0;
    right: 0;
    left: @sidebar-width;
    padding: 0 20px;
    border-top: 1px solid #eee;
    //大屏幕
    @media (min-width: @screen-sm-min) {
      left: @sidebar-width;
    }
    //小屏幕
    @media (max-width: @screen-xs-max) {
      left: 0;
      display: none;
    }

    &.show-drawer {
      //大屏幕
      @media (min-width: @screen-sm-min) {
        left: @sidebar-width;
      }

      //小屏幕
      @media (max-width: @screen-xs-max) {
        left: 0;
        display: none;
      }
    }
  }
</style>

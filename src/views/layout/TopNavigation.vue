<template>
  <div class="top-navigation-bar">
    <nav class="navbar">

      <div class="navbar-title">

        <router-link to="/">
          <img class="logo" :src="logoUrl"/>
          <span class="title">{{preference.name?preference.name: $t('eyeblueTank') }}</span>
        </router-link>

      </div>

      <button class="drawer-trigger btn btn-primary btn-sm mr5"
              @click.stop.prevent="$store.state.config.showDrawer=!$store.state.config.showDrawer">
        <i class="fa fa-bars"></i>
      </button>


    </nav>
  </div>
</template>
<script>

  let defaultLogoPath = require("../../assets/img/logo.png");

  export default {
    data() {
      return {
        preference: this.$store.state.preference,
        user: this.$store.state.user
      }
    },
    computed: {
      //logo可以使用自定义的。
      logoUrl() {
        if (this.preference.logoUrl) {
          return this.preference.logoUrl + "?ir=fill_" + 200 + "_" + 200
        } else {
          return defaultLogoPath
        }
      }
    },
    components: {},
    methods: {}
  }
</script>


<style lang="less" rel="stylesheet/less">

  @import "../../assets/css/global/variables";

  //上方的导航栏
  .top-navigation-bar {

    height: @top-navigation-height;
    background-color: white;
    border-bottom: 1px solid #eeeeee;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding-left: @sidebar-width;

    .navbar {
      border: none;
    }

    //手机屏幕
    @media (max-width: @screen-xs-max) {
      padding-left: 0;
    }

    .navbar-title {
      float: left;
      cursor: pointer;
      margin-left: 10px;

      .logo {
        height: @top-navigation-height;

      }

      .title {
        margin-left: 10px;
        font-size: 18px;
        color: black;
        font-weight: bold;
        display: inline-block;
        line-height: @top-navigation-height;
        vertical-align: middle;
      }

    }

    .login-trigger {
      float: right;
      margin-right: 10px;

      .login-span, .register-span {
        color: #888;
        cursor: pointer;
        font-size: 14px;
        line-height: 40px;

        &:hover {
          color: black;
          text-decoration: underline;
        }
      }
    }



    .drawer-trigger {
      float: right;
      margin-top: 5px;
      margin-right: 5px;
    }

    .navbar-right {

      > li {
        display: inline-block;

        &:last-child {
          margin-right: 5px;
        }

        a {
          color: #999c9e;
          font-size: 14px;
          padding: 6px 12px;
        }

      }

      @media (min-width: 768px) {
        float: right !important;
        margin-right: 0;
      }

      .message-info {
        position: relative;

        .label {

          line-height: 12px;
          padding: 2px 5px;
          position: absolute;
          left: 10%;
          bottom: 50%;

        }
      }
    }

    //小屏幕
    @media (min-width: @screen-sm-min) {
      .drawer-trigger {
        display: none;
      }
    }
    //手机屏幕
    @media (max-width: @screen-xs-max) {

      .navbar-right {
        display: none;
      }
    }

  }


</style>

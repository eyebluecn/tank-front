<template>
  <nav ref="menuNav" class="side-navigation" :class="{'show-drawer':showDrawer}" @click.stop.prevent="eatClick">
    <div class="sidebar-collapse">

      <div class="menu-header" @click="goToProfile" v-if="$store.state.installed">
        <div class="logo-area">
          <img alt="image" class="img-circle w80"
               :src="user.getAvatarUrl()"/>
        </div>
        <div class="text-area">
          <div class="nickname">
            {{user.role === 'GUEST' ? '请登录' : user.username}}
          </div>
        </div>
      </div>

      <ul class="nav mt20" v-if="$store.state.installed">

        <li v-if="user.role === UserRole.GUEST">
          <router-link to="/user/login">
            <i class="w14 fa fa-user-circle-o"></i>
            <span>{{ $t('login') }}</span>
          </router-link>
        </li>

        <li v-if="user.role !== UserRole.GUEST">
          <router-link to="/" :class="{'custom-active':isCustomActive('/')}">
            <i class="w14 fa fa fa-th"></i>
            <span>{{ $t('layout.allFiles') }}</span>
          </router-link>
        </li>


        <li v-if="user.role !== UserRole.GUEST">
          <router-link to="/share/list" :class="{'custom-active':isCustomActive('/share/list')}">
            <i class="w14 fa fa fa-share-alt"></i>
            <span>{{ $t('layout.myShare') }}</span>
          </router-link>
        </li>

        <li v-if="user.role === UserRole.ADMINISTRATOR">
          <router-link to="/preference" :class="{'custom-active':isCustomActive('/preference')}">
            <i class="w14 fa fa-cog"></i>
            <span>{{ $t('layout.setting') }}</span>
          </router-link>
        </li>

        <li v-if="user.role === UserRole.ADMINISTRATOR">
          <router-link to="/dashboard/index" :class="{'custom-active':isCustomActive('/dashboard/index')}">
            <i class="w14 fa fa-dashboard"></i>
            <span>{{ $t('layout.dashboard') }}</span>
          </router-link>
        </li>

        <li v-if="user.role === UserRole.ADMINISTRATOR">
          <router-link to="/user/list" :class="{'custom-active':isCustomActive('/user/list')}">
            <i class="w14 fa fa-user"></i>
            <span>{{ $t('layout.users') }}</span>
          </router-link>
        </li>

        <li v-if="user.role !== UserRole.GUEST">
          <router-link to="/user/login" :class="{'custom-active':isCustomActive('/user/login')}">
            <i class="w14 fa fa-power-off"></i>
            <span>{{ $t('layout.logout') }}</span>
          </router-link>
        </li>

        <li class="about-menu">
          <a href="javascript:void(0)" @click.stop.prevent="showAbout($createElement)">
            <i class="w14 fa fa-info-circle"></i>
            <span>{{ $t('layout.about') }}</span>
          </a>
        </li>
      </ul>

      <div class="menu-header" v-if="!$store.state.installed">
        <div class="logo-area">
          <img alt="image" class="img-circle w80" src="../../assets/img/logo.png"/>
        </div>
      </div>

      <ul class="nav mt20" v-if="!$store.state.installed">
        <li>
          <router-link to="/install/index" :class="{'custom-active':isCustomActive('/install/index')}">
            <i class="w14 fa fa-cogs"></i>
            <span>{{ $t('layout.install') }}</span>
          </router-link>
        </li>
      </ul>

    </div>
  </nav>
</template>
<script>
  import {MessageBox} from 'element-ui'
  import {UserRole} from "../../common/model/user/UserRole";
  import {handleImageUrl} from "../../common/util/ImageUtil";
  import BottomNavigation from "./BottomNavigation";

  let logoPath = require("../../assets/img/logo.png")

  export default {

    data() {
      return {
        UserRole,
        user: this.$store.state.user,
        preference: this.$store.state.preference
      }
    },
    computed: {
      showDrawer() {
        return this.$store.state.config.showDrawer;
      },
      mobile() {
        return this.$store.state.config.mobile;
      }

    },

    components: {},
    methods: {
      handleImageUrl,
      isCustomActive(path) {
        return this.$route.path === path
      },
      goToProfile() {

        if (this.user.role === UserRole.GUEST) {
          this.$router.push("/user/login");
        } else {
          this.$router.push("/user/detail/" + this.user.uuid);
        }

      },
      eatClick() {

      },
      showAbout(createElement) {


        let that = this

        let targetMatterUuid = null
        let dom = createElement(BottomNavigation, {
          props: {

          }
        })

        MessageBox({
          title: that.$t('layout.about'),
          message: dom,
          confirmButtonText: that.$t("confirm"),
          showCancelButton: false,
          callback: (action, instance) => {

          }
        })


      }
    },
    watch: {},
    mounted() {
      let that = this;
    }
  }
</script>

<style lang="less" rel="stylesheet/less">

  @import "../../assets/css/global/variables";

  @nav-bg: #3A3F51;
  @nav-text-color: white;
  @font-highlight-color: #ddd;
  @left-border-color: @brand-primary;

  //手机屏幕
  @media (max-width: @screen-xs-max) {

  }

  //左侧菜单block.
  .side-navigation {

    //overflow: auto;

    -webkit-transition: all 0.4s;
    -moz-transition: all 0.4s;
    -o-transition: all 0.4s;
    transition: all 0.4s;

    position: fixed;
    width: @sidebar-width;

    left: -@sidebar-width;
    top: 0;
    bottom: 0;
    z-index: 1000;

    background: darken(@nav-bg, 3%);

    &.show-drawer {
      left: 0;
    }

    .sidebar-collapse {
      padding-bottom: 40px;
    }

    .app-name-box {
      text-align: center;
      vertical-align: middle;
      display: table-cell;
      width: @sidebar-width;
      background-color: @brand-primary;
      height: @top-navigation-height;

      a {
        font-size: 16px;
        color: white;
      }
    }

    //放头像和用户名的地方。
    .menu-header {
      cursor: pointer;

      .logo-area {

        text-align: center;
        padding: 20px 0;
      }

      .text-area {
        .nickname {
          text-align: center;
          color: @nav-text-color;
          font-weight: bold;
        }

        .role {
          text-align: center;
          color: @nav-text-color;
        }
      }

    }

    //分割线
    .separate-line {
      margin-top: 20px;
      padding-bottom: 5px;
      border-bottom: 1px solid #666666;

      span {
        margin-left: 20px;
        color: #777;
      }
    }

    .nav {
      li {

        a {

          color: @nav-text-color;

          padding: 12px 20px;

          &:hover, &:focus {
            color: @font-highlight-color;
            background-color: transparent;
            outline: none;
          }

          i {
            margin-right: 6px;
          }

          //为什么要用custom-active? 因为 is-link-exact-active 不能匹配 /user/list 和 /user/list?page=0
          // is-link-active 会将 / 和 /preference 进行匹配。
          //所以用 is-link-exact-active 的话就会出现刷新列表页面时不高亮
          //用 is-link-active 时会两个高亮。
          &.custom-active {
            background-color: black;
          }
        }
      }

    }

    .about-menu {
      //大屏幕
      @media (min-width: @screen-sm-min) {
        display: none;
      }
      //手机屏幕
      @media (max-width: @screen-xs-max) {

      }

    }
  }


</style>

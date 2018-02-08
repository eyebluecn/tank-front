<template>
  <nav ref="menuNav" class="side-navigation" :class="{'show-drawer':showDrawer}" @click.stop.prevent="eatClick">
    <div class="sidebar-collapse">


      <div class="menu-header" @click="goToProfile">
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

      <ul class="nav mt20">

        <li v-if="user.role === 'GUEST'">
          <router-link to="/user/login">
            <i class="w14 fa fa-user-circle-o"></i>
            <span>登录</span>
          </router-link>
        </li>

        <li v-if="user.role !== 'GUEST'">
          <router-link to="/" :class="{'custom-active':isCustomActive('/')}">
            <i class="w14 fa fa fa-th"></i>
            <span>全部文件</span>
          </router-link>
        </li>

        <li v-if="user.role === 'ADMINISTRATOR'">
          <router-link to="/preference" :class="{'custom-active':isCustomActive('/preference')}">
            <i class="w14 fa fa-dashboard"></i>
            <span>网站偏好</span>
          </router-link>
        </li>

        <li v-if="user.role === 'ADMINISTRATOR'">
          <router-link to="/user/list" :class="{'custom-active':isCustomActive('/user/list')}">
            <i class="w14 fa fa-user"></i>
            <span>用户列表</span>
          </router-link>
        </li>

        <li v-if="user.role !== 'GUEST'">
          <router-link to="/user/login" :class="{'custom-active':isCustomActive('/user/login')}">
            <i class="w14 fa fa-power-off"></i>
            <span>退出登录</span>
          </router-link>
        </li>

        <li class="about-menu">
          <a href="javascript:void(0)" @click.stop.prevent="showAbout">
            <i class="w14 fa fa-info-circle"></i>
            <span>关于</span>
          </a>
        </li>


      </ul>

    </div>
  </nav>
</template>
<script>
  import {Message, MessageBox, Notification} from 'element-ui'

  let logoPath = require("../../assets/img/logo.png")

  export default {

    data() {
      return {
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
      isCustomActive(path) {
        return this.$route.path === path
      },
      goToProfile() {

        if (this.user.role === 'GUEST') {
          this.$router.push("/user/login");
        } else {
          this.$router.push("/user/detail/" + this.user.uuid);
        }

      },
      eatClick() {

      },
      showAbout() {

        let html = '<div class="text-center">' + this.preference.footerLine1 + "<br/>" + this.preference.footerLine2 + "<br/>" + 'Powered by <a target="_blank" href="https://github.com/eyebluecn/tank"><img class="w30" src="' + logoPath + '"/> 蓝眼云盘</a>' + '</div>'
        MessageBox({
          title: '关于',
          message: html,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          showCancelButton: false,
          cancelButtonText: '关闭',
          callback: (action, instance) => {
            if (action === 'confirm') {

            }
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

    overflow: auto;

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

    //放头像和昵称的地方。
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

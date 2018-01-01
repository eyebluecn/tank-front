<template>
  <nav ref="menuNav" class="side-navigation" :class="{'show-drawer':showDrawer}" @click.stop.prevent="eatClick">
    <div class="sidebar-collapse">


      <div class="menu-header" @click="goToProfile">
        <div class="logo-area">
          <img alt="image" class="img-circle w80" :src="user.avatarUrl ? user.getAvatarUrl() + '?imageProcess=resize&imageResizeM=fill&imageResizeW=100&imageResizeH=100'  : user.getAvatarUrl()"/>
        </div>
        <div class="text-area">
          <div class="nickname">
            {{user.role === 'GUEST' ? '请登录' : user.username}}
          </div>
        </div>
      </div>


      <ul class="nav mt20">
        <SideMenu v-for="(menu,index) in user.menus" :key="index" :menu="menu"/>

      </ul>

    </div>
  </nav>
</template>
<script>
  import SideMenu from "./SideMenu.vue"



  export default {

    data() {
      return {
        user: this.$store.state.user
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

    components: {
      SideMenu
    },
    methods: {
      goToProfile() {

        if (this.user.role === 'GUEST') {
          this.$router.push("/user/login");
        } else {
          this.$router.push("/user/detail/" + this.user.uuid);
        }


      },
      eatClick() {

      },
      updateBody() {
        if (this.showDrawer && this.mobile) {
        } else {
        }
      }
    },
    watch: {
      "showDrawer"(newVal, oldVal) {
        this.updateBody();
      },
      "mobile"(newVal, oldVal) {
        this.updateBody();
      }

    },
    mounted() {
      let that = this;
      this.updateBody();
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
    z-index: 2000;

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

        &.active {

          //只有紧接的这一层a才会高亮。
          > a {
            color: @font-highlight-color;
          }
        }

        a {

          color: @nav-text-color;

          padding: 12px 20px;
          &:hover, &:focus {
            color: @font-highlight-color;
            background-color: transparent;
          }

          i {
            margin-right: 6px;
          }
        }
      }

      .nav-first-level {
        &.active {
        }
        &.current {
          background-color: black;
        }
      }
      &.nav-second-level {

        > li {

          > a {
            padding-left: 43px;
          }
          &.active {
            border: none;
          }
          &.current {
            background-color: black;
          }
        }
      }
      &.nav-third-level {

        > li {
          > a {
            padding-left: 57px;
          }
          &.current {
            background-color: black;
          }
        }
      }
    }
  }


</style>

<template>

  <div id="body">

    <div>
      <SideNavigation/>
      <div id="page-wrapper" :class="{'show-drawer':$store.state.config.showDrawer}" @click="blankClick">
        <div>

          <div class="mb10">

            <router-link to="/" v-if="$store.state.breadcrumbs && $store.state.breadcrumbs.length">
              <i class="fa fa-home f16"></i>
            </router-link>

            <span v-for="b in $store.state.breadcrumbs">
              <span>/</span>
							<router-link v-if="(b.name || b.path) && b.name !== $store.state.route.name" :to="b">
                {{b.title}}
              </router-link>
							<span v-else>
								{{b.title}}
							</span>

            </span>

          </div>
          <router-view></router-view>

        </div>


        <TopNavigation/>
      </div>

    </div>
  </div>


</template>

<script>
  import {Notification} from 'element-ui'
  import SideNavigation from './layout/SideNavigation.vue'
  import TopNavigation from './layout/TopNavigation.vue'
  import enquire from 'enquire.js/dist/enquire'

  export default {
    data() {
      return {
        member: this.$store.state.member
      }
    },
    computed: {
      config() {
        return this.$store.state.config
      }
    },
    components: {
      SideNavigation,
      TopNavigation
    },
    methods: {
      blankClick() {
        if (this.config.mobile) {
          if (this.config.showDrawer) {
            this.$store.state.config.showDrawer = false
          }
        }
      },
      listenResponsiveEvent() {
        let that = this
        enquire.register('(max-width: 768px)', {
          match: function () {
            that.$store.state.config.mobile = true
          },
          unmatch: function () {
            that.$store.state.config.showDrawer = true
            that.$store.state.config.mobile = false
          }
        })
      }
    },
    created() {

    },
    mounted() {
      let that = this
      this.$store.state.environment = 'backyard'
      this.listenResponsiveEvent()
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../assets/css/global/variables";

  #page-wrapper {

    position: fixed;
    left: @sidebar-width;
    top: @top-navigation-height;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;

    padding: 10px;

    -webkit-transition: all 0.4s;
    -moz-transition: all 0.4s;
    -o-transition: all 0.4s;
    transition: all 0.4s;

    background-color: #f3f3f4;

    //大屏幕
    @media (min-width: @screen-sm-min) {
      left: @sidebar-width;
    }
    //小屏幕
    @media (max-width: @screen-xs-max) {
      left: 0;
    }

    &.show-drawer {
      //大屏幕
      @media (min-width: @screen-sm-min) {
        left: @sidebar-width;
      }

      //小屏幕
      @media (max-width: @screen-xs-max) {
        left: 0;
      }
    }
  }

</style>

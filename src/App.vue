<template>
  <div class="nb-app">

    <NprogressContainer/>
    <router-view/>

  </div>
</template>

<script>
  import NprogressContainer from 'vue-nprogress/src/NprogressContainer'


  export default {
    data() {
      return {
        preference: this.$store.state.preference
      }
    },
    computed: {},
    components: {
      NprogressContainer
    },
    mounted() {

      let that = this;
      this.preference.httpFetch()


    }
  }
</script>


<style lang="less" rel="stylesheet/less">

  @import "~font-awesome/css/font-awesome.css";
  @import "./assets/css/app.less";

  .nb-app {

    height: 100%;

    .nprogress-container {
      position: fixed !important;
      width: 100%;
      height: 150px;
      z-index: 2048;
      pointer-events: none;

      #nprogress {
        //@color: #48e79a;
        @color: #1ab394;

        .bar {
          background: @color;
        }
        .peg {
          box-shadow: 0 0 10px @color, 0 0 5px @color;
        }

        .spinner-icon {
          border-top-color: @color;
          border-left-color: @color;
        }
      }
    }

    //所有的滚动条样式
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track-piece {
      background-color: #eee;
      margin: -2px;
    }
    ::-webkit-scrollbar-thumb {
      background: #aaa;
      min-height: 150px;
      min-width: 150px;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:vertical:hover {
      background: #555555
    }
    ::-webkit-scrollbar-thumb:horizontal:hover {
      background: #555555
    }

  }


</style>

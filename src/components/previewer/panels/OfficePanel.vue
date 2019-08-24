<template>

  <div class="previewer-doc-panel">
    <iframe v-if="canPreview" :src='finalUrl'
            width="100%" height="100%">
      This is an embedded
      <a target='_blank' href='http://office.com'>Microsoft Office</a>
      document, powered by
      <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
    </iframe>
    <div class="fallback" v-else>
      <h3>
        Cannot preview
      </h3>
      <p>
        Office Preview is powered by <a target='_blank' href='http://office.com'>Microsoft Office Online Preview</a>，
        Because Microsoft server cannot get <a target="_blank" :href="url">{{name}}</a>, so url with localhost(127.0.0.1) cannot preview office files.
      </p>
    </div>
  </div>


</template>

<script>

  import {startWith} from "../../../common/filter/str";

  export default {
    data() {
      return {}
    },
    computed: {
      canPreview() {
        return !startWith(this.url, "http://localhost") &&
          !startWith(this.url, "https://localhost") &&
          !startWith(this.url, "http://127.0.0.1") &&
          !startWith(this.url, "https://127.0.0.1")
      },
      finalUrl() {
        return "https://view.officeapps.live.com/op/embed.aspx?src=" + this.url;
      }
    },
    props: {
      //寻找该用户的合适文件夹
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    watch: {},
    methods: {},
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../assets/css/global/variables";

  .previewer-doc-panel {
    width: 100%;
    height: 100%;

    iframe {
      border: 1px solid #eeeeee;
    }

    .fallback {
      border: 1px solid #eeeeee;
      padding: 20px;
    }

  }
</style>



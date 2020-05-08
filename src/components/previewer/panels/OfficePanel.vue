<template>

  <div class="previewer-doc-panel">
    <iframe v-if="!useMicrosoft || (useMicrosoft && canPreview )" :src='finalUrl'
            width="100%" height="100%">
      This is an embedded
      <a target='_blank' href='http://office.com'>Microsoft Office</a>
      document, default powered by
      <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
    </iframe>
    <div class="fallback" v-else>
      <div v-if="useMicrosoft">
        <h3>
          Cannot preview
        </h3>
        <p>
          Office Preview is powered by <a target='_blank' href='http://office.com'>Microsoft Office Online Preview</a>，
          Because Microsoft server cannot get <a target="_blank" :href="url">{{name}}</a>, so url with
          localhost(127.0.0.1) cannot preview office files.
        </p>
      </div>
      <div v-else>
        Cannot preview with custom office url.
      </div>
    </div>
  </div>


</template>

<script>

  import {startWith} from "../../../common/filter/str";
  import Vue from "vue";

  export default {
    data() {
      return {
        preference: Vue.store.state.preference
      }
    },
    computed: {
      canPreview() {
        return !startWith(this.url, "http://localhost") &&
          !startWith(this.url, "https://localhost") &&
          !startWith(this.url, "http://127.0.0.1") &&
          !startWith(this.url, "https://127.0.0.1")
      },
      finalUrl() {
        if (this.preference.officeUrl) {
          return this.preference.officeUrl + this.url;
        } else {
          return "https://view.officeapps.live.com/op/embed.aspx?src=" + this.url;
        }
      },
      useMicrosoft() {
        if (this.preference.officeUrl) {
          return this.preference.officeUrl.startsWith("https://view.officeapps.live.com");
        } else {
          return true
        }
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

      console.log("preview url:" + this.finalUrl)
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



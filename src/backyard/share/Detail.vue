<template>
  <div class="share-detail">

    <h1>
      {{share.name}}
    </h1>

    <div v-for="matter in share.matters">
      <ShareMatterPanel
        :matter="matter"
        @goToDirectory="goToDirectory"
        @previewImage="previewImage"
      />
    </div>

  </div>
</template>

<script>

  import Share from "../../common/model/share/Share";
  import ShareMatterPanel from "../matter/widget/ShareMatterPanel"

  export default {
    data() {
      return {
        share: new Share(),
        preference: this.$store.state.preference
      }
    },
    computed: {},
    methods: {
      goToDirectory(dirMatter) {
        console.log("准备前往目录", dirMatter)
      },
      previewImage(matter) {
        console.log("预览图片", matter)
      }
    },
    components: {
      ShareMatterPanel
    },
    mounted() {
      let that = this;
      this.share.uuid = this.$store.state.route.params.uuid
      if (this.share.uuid) {
        this.share.httpBrowse(function () {

        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .share-detail {


  }
</style>

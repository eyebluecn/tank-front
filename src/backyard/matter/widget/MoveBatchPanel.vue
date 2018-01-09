<template>
  <div class="move-batch-panel h300">
    <FolderTree ref="folderTree" :matter="matter" :targetMatter="targetMatter" :deepFolderInit="true"/>
  </div>
</template>

<script>
  import FolderTree from '../widget/FolderTree'
  import Matter from '../../../common/model/matter/Matter'

  export default {
    name: 'move-batch-panel',
    data() {
      return {
        //当前matter
        matter: new Matter()
      }
    },
    watch: {
      'targetMatter.userUuid'(newVal, oldVal) {

        console.log("move-batch-panel 听到变化")
        console.log(oldVal + "=>" + newVal)

        this.$refs.folderTree.refresh()

      }
    },
    props: {
      targetMatter: {
        type: Matter,
        required: true
      }
    },
    components: {
      FolderTree
    },
    mounted() {

      console.log("MoveBatchPanel mounted.")

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .move-batch-panel {
    overflow-y: scroll;
  }
</style>

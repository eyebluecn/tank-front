<template>
  <div class="move-batch-panel h300">
    <FolderTree ref="folderTree" :matter="matter" :targetMatter="targetMatter" :userUuid="userUuid" :version="version"
                :callback="callback"
                :showSubFolderInit="true"/>
  </div>
</template>

<script>
  import FolderTree from '../widget/FolderTree'
  import Matter from '../../../model/matter/Matter'

  export default {
    data() {
      return {
        //当前matter，这一级为 root.
        matter: new Matter(),
        //最终选择的那个matter
        targetMatter: new Matter()
      }
    },
    watch: {},
    props: {
      //寻找该用户的合适文件夹
      userUuid: {
        type: String,
        required: true
      },
      //为了让Tree在每次点开的时候都更新
      version: {
        type: Number,
        required: true
      },
      //选择了一个文件夹后回掉，参数matter
      callback: {
        type: Function,
        required: true
      }
    },
    components: {
      FolderTree
    },
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .move-batch-panel {
    overflow-y: scroll;
  }
</style>

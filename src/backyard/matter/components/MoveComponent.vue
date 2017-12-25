<template>
	<div class="move-component h300">
		<FolderTree :matter="matter" :currentCallback="currentDestCallback" :activeUuid="destUuid"></FolderTree>
	</div>
</template>
<script>
  import FolderTree from '../widget/FolderTree.vue'
  import Matter from '../../../common/model/matter/Matter'

  export default {
    data () {
      return {
        matter: new Matter(),
        destUuid:''
      }
    },
    props: {
      destMatter: {
        type: Matter,
        required: true
      }
    },
    components: {
      FolderTree
    },
    watch: {
      'destUuid'(newVal,oldVal){
        this.destMatter.uuid = newVal
      }
    },
    methods: {
      currentDestCallback (matter) {
        this.destUuid = matter.uuid
      }
    },
    mounted () {

    }
  }

</script>
<style lang="less" rel="stylesheet/less">
	.move-component{
		overflow-y: scroll;
	}
</style>

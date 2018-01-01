<template>
	<div class="move-batch-panel h300">
		<FolderTree :matter="matter" :targetMatter="targetMatter" :deepFolderInit="true"/>
	</div>
</template>

<script>
	import FolderTree from '../widget/FolderTree'
  import Matter from '../../../common/model/matter/Matter'
  export default {
    name: 'move-batch-panel',
	  data(){
      return{
        //当前matter
        matter: new Matter()
      }
	  },

	  props:{
      targetMatter:{
        type: Matter,
	      required: true
      }
	  },
	  components:{
      FolderTree
	  },
	  mounted(){

	  }
  }
</script>

<style lang="less" rel="stylesheet/less">
	.move-batch-panel{
		overflow-y: scroll;
	}
</style>
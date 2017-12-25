<template>
	<div class="matter-all-photo">
		<TypeMatterComponent :matterType="matterType"></TypeMatterComponent>
	</div>
</template>
<script>
	import TypeMatterComponent from '../components/TypeMatterComponent.vue'

	export default {
	  data(){
	    return{
		    matterType:'PHOTO'
	    }
	  },
		components:{
      TypeMatterComponent
		},
		mounted(){

		}
	}
</script>
<style lang="less" rel="stylesheet/less">
	.matter-all-photo{

	}
</style>
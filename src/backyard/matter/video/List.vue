<template>
	<div class="matter-all-video">
		<TypeMatterComponent :matterType="matterType"></TypeMatterComponent>
	</div>
</template>
<script>
  import TypeMatterComponent from '../components/TypeMatterComponent.vue'

  export default {
    data(){
      return{
        matterType:'VIDEO'
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
	.matter-all-video{

	}
</style>
<template>
	<div class="matter-all-word">
		<TypeMatterComponent :matterType="matterType"></TypeMatterComponent>
	</div>
</template>
<script>
  import TypeMatterComponent from '../components/TypeMatterComponent.vue'

  export default {
    data(){
      return{
        matterType:'WORD'
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
	.matter-all-word{

	}
</style>
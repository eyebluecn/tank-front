<template>
	<div class="matter-all-music">
		<TypeMatterComponent :matterType="matterType"></TypeMatterComponent>
	</div>
</template>
<script>
  import TypeMatterComponent from '../components/TypeMatterComponent.vue'

  export default {
    data(){
      return{
        matterType:'MUSIC'
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
	.matter-all-music{

	}
</style>
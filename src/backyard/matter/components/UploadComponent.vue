<template>
	<div class="matter-upload-component">
		<el-button size="small" class="pull-right" @click.stop.prevent="clearList">清空列表</el-button>
		<NbTanks :tanks="tankList" :maxNum="6" :templateTank="templateTank" :success="successCallback"/>
	</div>
</template>
<script>
  import Tank from '../../../common/model/tank/Tank'
  import NbTanks from '../../../common/widget/NbTanks.vue'
  import Matter from '../../../common/model/matter/Matter'
  import User from '../../../common/model/user/User'

  export default {
    data () {
      return {
        tankList: [],
        templateTank: new Tank('*', false, 1024 * 1024 * 1024, '每个文件大小不超过1G', this.currentUser.uuid , this.matter.uuid)
      }
    },
    props: {
      currentUser: {
        type: User,
	      required: true
      },
      matter: {
        type: Matter,
        required: true
      },
	    successCallback:{
        type: Function,
		    required: false
	    }
    },
    components: {
      NbTanks
    },
	  watch:{
			'matter.uuid'(newVal,oldVal){
			  if(newVal){
          this.templateTank.puuid = newVal
			  }else{
          this.templateTank.puuid = 'root'
			  }
			},
		  'currentUser.uuid'(newVal,oldVal){
			  this.templateTank.userUuid = newVal
		  }
	  },
	  created(){
			if(!this.matter.uuid){
			  this.matter.uuid = 'root'
			}
	  },
    methods: {
      clearList(){
        this.tankList.splice(0,this.tankList.length)
      }
    },
    mounted () {

    }
  }
</script>
<style lang="less" rel="stylesheet/less">

</style>

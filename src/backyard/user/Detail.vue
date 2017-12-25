<template>
	<div class="backyard-user-detail animated fadeIn ">
		<div class="row">
			<div class="col-md-12">
				<div class="pedia-navigation">
					<span class="item active" v-if="userLoaded">
						<span v-if="currentUser.uuid === user.uuid">个人详情</span>
						<span v-else>他的详情</span>
					</span>
				</div>
			</div>

			<div class="col-md-12 mt10">
        这里修改用户
			</div>

		</div>


	</div>
</template>

<script>
  import User from '../../common/model/user/User'
  import { MessageBox,Notification } from 'element-ui'
	import { FeatureType } from '../../common/model/feature/FeatureType'

  export default {
    name: 'detail',
	  data(){
      return{
        FeatureType,
	      userLoaded: false,
        currentUser: this.$store.state.user,
        user: new User()
      }
	  },
	  components:{

	  },
	  methods:{
		  refresh(){
		    let that = this
			  this.user.uuid = this.$store.state.route.params.uuid
			  if(this.user.uuid){
		      this.user.httpDetail(function (response) {
            that.userLoaded = true
          })
			  }
		  },
		  resetPwd(){
        let that = this
        MessageBox.prompt('输入新密码','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '新密码必填'
        }).then(({value}) => {
          that.user.httpUserResetPassword(value,function (response) {
            Notification.success({
              message:'重置密码成功！'
            })
          })
        }).catch(() => {
        })
		  }
	  },
	  mounted(){
		  this.refresh()
	  }
  }
</script>

<style lang="less" rel="stylesheet/less">

</style>

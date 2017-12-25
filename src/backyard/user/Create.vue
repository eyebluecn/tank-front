<template>
	<div class="animated fadeIn backyard-user-edit">

		<div class="row">
			<div class="col-md-12">
				<div class="pedia-navigation">
					<span class="item active">
						<span v-show="!user.editMode">创建用户</span>
						<span v-show="user.editMode">编辑用户</span>
					</span>
				</div>
			</div>

			<div class="col-md-12">
        这里创建用户
			</div>

		</div>

	</div>
</template>

<script>
  import { Notification } from 'element-ui'
  import { FeatureType } from '../../common/model/feature/FeatureType'
  import NbRadio from '../../common/widget/NbRadio.vue'
  import NbTank from '../../common/widget/NbTank.vue'
  import CreateSaveButton from '../widget/CreateSaveButton'
  import User from '../../common/model/user/User'

  export default {
    name: 'create',
    data () {
      return {
        FeatureType,
        repassword: null,
        currentUser: this.$store.state.user,
        user: new User()
      }
    },
    components: {
      NbRadio,
      NbTank,
      CreateSaveButton
    },
    methods: {
      save () {
        let that = this
        if (!this.user.editMode && this.user.password !== this.repassword) {
          Notification.error('两次密码输入不一致')
          return
        }

        this.user.httpSave(function (response) {
          Notification.success({
            message: that.user.editMode ? '修改用户成功！' : '创建用户成功！'
          })
          that.$router.go(-1)
        })
      }
    },
    mounted () {
      let that = this
      this.user.errorMessage = null
      this.user.uuid = this.$store.state.route.params.uuid
      if (this.user.uuid) {
        this.user.httpDetail()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
	.backyard-user-edit {

	}
</style>

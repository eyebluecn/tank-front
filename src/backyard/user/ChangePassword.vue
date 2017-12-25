<template>
	<div class="backyard-user-change-password animated fadeIn">
		<div class="row">
			<div class="col-md-12">
				<div class="pedia-navigation">
					<span class="item active">
						<span>修改密码</span>
					</span>
				</div>
			</div>
		</div>

		<div class="bg-white br4 border p10">
			<div>

				<div class="row mt10">
					<label class="col-md-2 control-label mt5 compulsory">旧密码</label>
					<div class="col-md-10">
						<input type="password" class="form-control" v-model="oldPassword">
					</div>
				</div>


				<div class="row mt10">
					<label class="col-md-2 control-label mt5 compulsory">新密码</label>
					<div class="col-md-10">
						<input type="password" class="form-control" v-model="password">
					</div>
				</div>

				<div class="row mt10">
					<label class="col-md-2 control-label mt5 compulsory">再输一次</label>
					<div class="col-md-10">
						<input type="password" class="form-control" v-model="repeatPassword">
					</div>
				</div>

			</div>
		</div>

		<div class="row">
			<div class="col-md-12">
				<div class="mt10">
					<button class="btn btn-sm btn-primary" @click.stop.prevent="$router.go(-1)">
						<span class="fa fa-reply"></span>
						返回
					</button>
					<button class="btn btn-sm btn-primary pull-right" @click.stop.prevent="save">保存</button>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
  import { Message, MessageBox, Notification } from 'element-ui'
  import CreateSaveButton from '../../backyard/widget/CreateSaveButton'

  export default {
    data () {
      return {
        user: this.$store.state.user,
        oldPassword: '',
        password: '',
        repeatPassword: ''
      }
    },
    components: {
      CreateSaveButton
    },
    methods: {
      save () {
        let that = this
        if (!this.oldPassword || !this.password || !this.repeatPassword) {
          Notification.error({
            message: '不能为空！'
          })
          return
        }

        if (this.repeatPassword !== this.password) {
          Notification.error({
            message: '两次输入不一致！'
          })
          return
        }

        this.user.httpUserChangePassword(this.oldPassword, this.password, function (response) {
          Notification.success({
            message: '修改密码成功！'
          })
          that.$router.go(-1)
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">

</style>
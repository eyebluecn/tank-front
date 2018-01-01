<template>
	<div class="row">

		<div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 mt100">
			<div class="text-primary f25 text-center mb20">欢迎登录</div>
			<!--输入框开始-->
			<div class="input-group mb15">
				<span class="input-group-addon"><i class="fa fa-user w14"></i></span>
				<input type="email" class="form-control" placeholder="邮箱" v-model="user.email"
				       @keyup.enter="login">
			</div>
			<div class="input-group mb15">
				<span class="input-group-addon"><i class="fa fa-unlock-alt w14"></i></span>
				<input type="password" class="form-control" placeholder="密码" v-model="user.localPassword"
				       @keyup.enter="login">
			</div>

			<div class="mb15">
				<button class="btn btn-primary button full-width" @click.prevent.stop="login" :disabled="user.loading">
          <span v-if="user.loading">
            <i class="fa fa-spinner fa-spin"></i>
            正在登录...
          </span>
					<span v-else>
            <i class="fa fa-user-circle-o"></i>
            登录
          </span>

				</button>

			</div>


			<div class="mb15" v-show="user.errorMessage">
				<div class="alert alert-danger">
					{{user.errorMessage}}
				</div>
			</div>

		</div>

	</div>
</template>

<script>
  import { startWith } from '../../common/filter/str'
  import { Notification } from 'element-ui'

  export default {
    data () {
      return {
        user: this.$store.state.user,
        captchaValue: null,
        redirect: this.$route.query.redirect
      }
    },
    props: {},
    watch: {},
    computed: {},
    components: {},
    methods: {
      login () {
        let that = this
        this.user.httpLogin(function () {


          //自动跳转到之前的页面中去。
          if (that.redirect) {

            if (startWith(that.redirect, '/')) {
              that.$router.push(that.redirect)
            } else {
              location.href = that.redirect
            }
          } else {
            //自动进入到首页。
            that.$router.push('/')
          }

          //登录成功啦。
        }, function (err) {

          Notification.error({
            title: '错误',
            message: err.data.msg
          })

        })

      },
      logout () {

        if (this.user.role !== 'GUEST') {
          this.user.httpLogout(function () {

          }, function () {
            console.error('退出失败！')
          })
        }

      }
    },
    mounted () {
      //到登录页面了需要先做一次退出操作。因为退出就是直接跳转到登录页面的。
      this.logout()
    }

  }

</script>

<style lang="less" rel="stylesheet/less">

</style>



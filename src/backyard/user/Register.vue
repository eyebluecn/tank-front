<template>
  <div class="row animated fadeIn backyard-user-register">

    <div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 mt100">
      <div class="text-primary f25 text-center mb20">{{$t('user.welcomeRegister')}}</div>
      <!--输入框开始-->
      <div class="input-group mb15">
        <span class="input-group-addon"><i class="fa fa-user w14"></i></span>
        <input type="text" class="form-control" :placeholder="$t('user.username')" v-model="username"
               @keyup.enter="register">
      </div>

      <div class="input-group mb15">
        <span class="input-group-addon"><i class="fa fa-unlock-alt w14"></i></span>
        <input type="password" class="form-control" :placeholder="$t('user.password')" v-model="password"
               @keyup.enter="register">
      </div>

      <div class="input-group mb15">
        <span class="input-group-addon"><i class="fa fa-unlock-alt w14"></i></span>
        <input type="password" class="form-control" :placeholder="$t('user.confirmPassword')" v-model="rePassword"
               @keyup.enter="register">
      </div>

      <div class="mb15">
        <button class="btn btn-primary button full-width" @click.prevent.stop="register" :disabled="user.loading">
          <span v-if="user.loading">
            <i class="fa fa-spinner fa-spin"></i>
            {{$t('user.registering')}}
          </span>
          <span v-else>
            <i class="fa fa-user-circle-o"></i>
            {{$t('user.register')}}
          </span>
        </button>
      </div>
      <div class="mb15 text-right">
        <router-link to="/user/login">{{$t('user.goToLogin')}}</router-link>
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
  import {startWith} from '../../common/filter/str'

  export default {
    data() {
      return {
        username: null,
        password: null,
        rePassword: null,
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
      register() {
        let that = this

        this.user.httpRegister(that.username, that.password, that.rePassword, function () {
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
        }, function (errMsg) {

          that.$message.error(errMsg)

        })

      },
      logout() {
        let that = this
        if (this.user.role !== 'GUEST') {
          this.user.httpLogout(function () {

          }, function (errMsg) {

            that.$message.error(errMsg)

          })
        }

      }
    },
    mounted() {
      //到登录页面了需要先做一次退出操作。因为退出就是直接跳转到登录页面的。
      this.logout()
    }

  }

</script>

<style lang="less" rel="stylesheet/less">
  .backyard-user-register {

  }
</style>



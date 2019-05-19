<template>
  <div class="backyard-user-change-password animated fadeIn">

    <div class="password-block tank-box">
      <div>
        <div class="row mt10">
          <label class="col-md-3 control-label mt5 compulsory">
            {{$t('user.oldPassword')}}
          </label>
          <div class="col-md-9">
            <input type="password" class="form-control" v-model="oldPassword">
          </div>
        </div>

        <div class="row mt10">
          <label class="col-md-3 control-label mt5 compulsory">{{$t('user.newPassword')}}</label>
          <div class="col-md-9">
            <input type="password" class="form-control" v-model="password">
          </div>
        </div>

        <div class="row mt10">
          <label class="col-md-3 control-label mt5 compulsory">{{$t('user.confirmNewPassword')}}</label>
          <div class="col-md-9">
            <input type="password" class="form-control" v-model="repeatPassword">
          </div>
        </div>

      </div>
    </div>

    <div class="mt10 text-right">
      <button class="btn btn-sm btn-primary pull-right" @click.stop.prevent="save">
        <i class="fa fa-save"></i>
        {{$t('submit')}}
      </button>
    </div>


  </div>
</template>
<script>

  import CreateSaveButton from '../../backyard/widget/CreateSaveButton'

  export default {
    data() {
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
      save() {
        let that = this
        if (!this.oldPassword || !this.password || !this.repeatPassword) {
          that.$message.error({
            message: that.$t('user.cannotBeNull')
          })
          return
        }

        if (this.repeatPassword !== this.password) {
          that.$message.error({
            message: that.$t('user.passwordNotSame')
          })
          return
        }

        this.user.httpUserChangePassword(this.oldPassword, this.password, function (response) {
          that.$message.success({
            message: that.$t('operationSuccess')
          })
          that.$router.go(-1)
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-user-change-password {
    .password-block {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }

</style>

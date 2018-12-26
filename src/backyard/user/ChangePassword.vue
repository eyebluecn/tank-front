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

    <div class="password-block">
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
          <label class="col-md-2 control-label mt5 compulsory">确认新密码</label>
          <div class="col-md-10">
            <input type="password" class="form-control" v-model="repeatPassword">
          </div>
        </div>

        <div class="mt10 text-right">
          <button class="btn btn-sm btn-primary mr10" @click.stop.prevent="$router.go(-1)">
            <span class="fa fa-reply"></span>
            返回
          </button>
          <button class="btn btn-sm btn-primary pull-right" @click.stop.prevent="save">
            <i class="fa fa-save"></i>
            保存
          </button>
        </div>
      </div>
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
            message: '不能为空！'
          })
          return
        }

        if (this.repeatPassword !== this.password) {
          that.$message.error({
            message: '两次输入不一致！'
          })
          return
        }

        this.user.httpUserChangePassword(this.oldPassword, this.password, function (response) {
          that.$message.success({
            message: '修改密码成功！'
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
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      border-radius: 5px;
      padding: 20px 15px 10px 15px;
      margin-top: 10px;
      margin-bottom: 30px;
    }
  }

</style>

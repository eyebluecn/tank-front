<template>
  <div class="backyard-install">

    <div class="pedia-navigation">
      <span class="item active">安装系统</span>
    </div>

    <div class="install-block">

      <div class="row" v-validator="install.validatorSchema.mysqlHost.error">
        <label class="col-md-2 control-label mt5 compulsory">MySQL Host</label>
        <div class="col-md-10 validate">
          <input type="text" class="form-control" v-model="install.mysqlHost">
        </div>
      </div>

      <div class="row mt10" v-validator="install.validatorSchema.mysqlPort.error">
        <label class="col-md-2 control-label mt5 compulsory">MySQL 端口</label>
        <div class="col-md-10 validate">
          <input type="number" class="form-control" v-model="install.mysqlPort">
        </div>
      </div>


      <div class="row mt10" v-validator="install.validatorSchema.mysqlSchema.error">
        <label class="col-md-2 control-label mt5 compulsory">MySQL 库名</label>
        <div class="col-md-10 validate">
          <input type="text" class="form-control" v-model="install.mysqlSchema">
        </div>
      </div>


      <div class="row mt10" v-validator="install.validatorSchema.mysqlUsername.error">
        <label class="col-md-2 control-label mt5 compulsory">MySQL 用户名</label>
        <div class="col-md-10 validate">
          <input type="text" class="form-control" v-model="install.mysqlUsername">
        </div>
      </div>

      <div class="row mt10" v-validator="install.validatorSchema.mysqlPassword.error">
        <label class="col-md-2 control-label mt5 compulsory">MySQL 密码</label>
        <div class="col-md-10 validate">
          <input type="text" class="form-control" v-model="install.mysqlPassword">
        </div>
      </div>

      <div class="row mt20">
        <div class="col-md-12 text-right">
          <button class="btn btn-primary btn-sm" @click.stop.prevent="verify">
            <i class="fa fa-check"></i>
            验证MySQL连接
          </button>
        </div>
      </div>


    </div>

  </div>
</template>

<script>
  import Install from "../../common/model/install/Install";

  export default {
    data() {
      return {
        install: new Install()
      }
    },
    methods: {
      verify() {
        this.install.httpVerify(function () {

        })
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-install {

    .install-block {
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      border-radius: 5px;
      padding: 20px 15px 10px 15px;
      margin-top: 10px;
      margin-bottom: 30px;
    }
  }
</style>

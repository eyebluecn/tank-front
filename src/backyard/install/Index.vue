<template>
  <div class="backyard-install">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="配置MySQL" name="first">
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
              <input type="password" class="form-control" v-model="install.mysqlPassword">
            </div>
          </div>

          <div class="row mt20">
            <div class="col-md-12 text-right">
              <button class="btn btn-success btn-sm" v-if="verified">
                <i class="fa fa-check"></i>
                MySQL连接测试通过
              </button>
              <button class="btn btn-info btn-sm" @click.stop.prevent="verify" v-if="!verified">
                <i class="fa fa-unlink"></i>
                测试MySQL连接
              </button>

              <button class="btn btn-primary btn-sm" @click.stop.prevent="goTo('second')">
                <i class="fa fa-arrow-right"></i>
                下一步
              </button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="创建表" name="second" :disabled="!verified">
        <div class="install-block">

          <h1>这里安装数据库表</h1>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设置管理员" name="third" :disabled="!tableCreated">
        <div class="install-block">

          <h1>这里配置管理员</h1>
        </div>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
  import Install from "../../common/model/install/Install";

  export default {
    data() {
      return {
        activeName: 'first',
        verified: false,
        tableCreated: false,
        install: new Install()
      }
    },
    computed: {
      mysqlUrl() {
        return this.install.mysqlUsername + ":" + this.install.mysqlPassword + "@tcp(" + this.install.mysqlHost + ":" + this.install.mysqlPort + ")/" + this.install.mysqlSchema + "?charset=utf8&parseTime=True&loc=Local"
      }
    },
    watch: {
      mysqlUrl(newVal, oldVal) {
        this.verified = false
      }
    },
    methods: {
      verify() {
        let that = this;
        this.install.httpVerify(function () {
          that.verified = true
          that.$message.success("数据库连接可用！")
        })
      },
      fetchTableInfoList() {
        let that = this;
        this.install.httpTableInfoList(function (response) {
          console.log("获取到待安装表", response.data.data)
        })
      },
      handleClick(tab, event) {

        let paneName = tab.paneName;

      },
      goTo(tabName) {
        if (tabName === "second") {

          if (!this.verified) {
            this.$message.error("请首先验证数据库连接")
            return
          }

          this.fetchTableInfoList();

        } else if (tabName === "third") {
          if (!this.tableCreated) {
            this.$message.error("请首先创建数据库表")
            return
          }
        }
        this.activeName = tabName
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
      margin-bottom: 30px;
    }
  }
</style>

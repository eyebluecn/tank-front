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
              <input type="password" class="form-control" :value="install.mysqlPassword" @input="mysqlPasswordChange">
            </div>
          </div>

          <div class="row mt20">
            <div class="col-md-12">
              <div class="alert alert-info">
                <div><i class="fa fa-bullhorn"></i> 注意：</div>
                <ol class="pl30 m0">
                  <li>如果数据库和蓝眼云盘安装在同一台服务器，Host可以直接填写 127.0.0.1。</li>
                  <li>数据库账户的权限要求要能够创建表，否则第二步"创建表"操作会出错</li>
                </ol>

              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 text-right">
              <button class="btn btn-success btn-sm" v-if="install.verified">
                <i class="fa fa-link"></i>
                MySQL连接测试通过
              </button>
              <button class="btn btn-info btn-sm" @click.stop.prevent="verify" v-if="!install.verified">
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
      <el-tab-pane label="创建表" name="second" :disabled="!install.verified">
        <div class="install-block">

          <div class="mb15 border-bottom" v-for="(tableInfo,index) in install.tableInfoList">
            <div class="f16">
              {{tableInfo.name}}

              <span class="label label-success" v-if="tableInfo.tableExist && !tableInfo.missingFields.length">
                已安装
              </span>
              <span class="label label-danger" v-if="tableInfo.tableExist && tableInfo.missingFields.length">
                已安装,字段缺失
              </span>
              <span class="label label-warning" v-if="!tableInfo.tableExist">
                待安装
              </span>

            </div>

            <div class="mt10">
              所有字段: <span class="label label-default mr5 inline-block mb10" v-for="field in tableInfo.allFields">{{field.DBName}}</span>
            </div>
            <div class="mt10" v-if="tableInfo.tableExist && tableInfo.missingFields.length">
              缺失字段: <span class="label label-default mr5 inline-block mb10"
                          v-for="field in tableInfo.missingFields">{{field.DBName}}</span>
            </div>

          </div>

          <div class="row mt20">
            <div class="col-md-12">
              <div class="alert alert-info">
                <div><i class="fa fa-bullhorn"></i> 点击"一键建表"后会按照以下逻辑执行操作：</div>
                <ol class="pl30 m0">
                  <li>如果某表不存在，则直接创建表。</li>
                  <li>如果某表存在并且字段齐全，那么不会对该表做任何操作</li>
                  <li>如果某表存在但是部分字段缺失，那么会在该表中增加缺失字段。</li>
                  <li>如果表中有多余的字段(多余字段即不是蓝眼云盘需要的字段)，不会做删除处理，而会维持原样。</li>
                </ol>

              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 text-right">

              <button class="btn btn-info btn-sm" v-if="!install.tableCreated()" @click.stop.prevent="createTable()">
                <i class="fa fa-gavel"></i>
                一键建表
              </button>

              <button class="btn btn-success btn-sm" v-if="install.tableCreated()">
                <i class="fa fa-check"></i>
                建表完成
              </button>

              <button class="btn btn-primary btn-sm" @click.stop.prevent="goTo('first')">
                <i class="fa fa-arrow-left"></i>
                上一步
              </button>

              <button class="btn btn-primary btn-sm" @click.stop.prevent="goTo('third')">
                <i class="fa fa-arrow-right"></i>
                下一步
              </button>

            </div>
          </div>

        </div>
      </el-tab-pane>
      <el-tab-pane label="设置管理员" name="third" :disabled="!install.tableCreated()">
        <div class="install-block">

          <div class="text-center" v-show="phase===-1">
            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </div>

          <NbExpanding>
            <div v-show="phase===0">
              <div>
                检测到系统中已经存在有以下管理员：
              </div>
              <div class="mv10 bold" v-for="admin in install.adminList">
                {{admin.email}}
              </div>
              <div>
                你可以使用其中一位管理员的邮箱密码进行验证，或者创建一位个的管理员账户
              </div>

              <div>
                <div class="text-right">

                  <button class="btn btn-primary btn-sm" @click.stop.prevent="phase = 1">
                    <i class="fa fa-user-o"></i>
                    验证管理员账户
                  </button>

                  <button class="btn btn-primary btn-sm" @click.stop.prevent="phase = 2">
                    <i class="fa fa-user-plus"></i>
                    创建管理员账户
                  </button>


                  <button class="btn btn-primary btn-sm" @click.stop.prevent="goTo('second')">
                    <i class="fa fa-arrow-left"></i>
                    上一步
                  </button>

                </div>
              </div>
            </div>
          </NbExpanding>


          <NbExpanding>
            <div v-show="phase===1">


              <div class="bold f20 text-center">
                验证管理员账号
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminEmail.error">
                <label class="col-md-2 control-label mt5 compulsory">管理员邮箱</label>
                <div class="col-md-10 validate">
                  <input type="text" class="form-control" v-model="install.adminEmail">
                </div>
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminPassword.error">
                <label class="col-md-2 control-label mt5 compulsory">管理员密码</label>
                <div class="col-md-10 validate">
                  <input type="password" class="form-control" v-model="install.adminPassword">
                </div>
              </div>

              <div class="row mt10">
                <div class="col-md-12 text-right">

                  <button class="btn btn-primary btn-sm" @click.stop.prevent="phase = 0">
                    <i class="fa fa-arrow-left"></i>
                    上一步
                  </button>


                  <button class="btn btn-primary btn-sm" @click.stop.prevent="validateAdmin()">
                    <i class="fa fa-send"></i>
                    提交
                  </button>

                </div>
              </div>
            </div>
          </NbExpanding>


          <NbExpanding>
            <div v-show="phase===2">

              <div class="bold f20 text-center">
                创建管理员账号
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminUsername.error">
                <label class="col-md-2 control-label mt5 compulsory">管理员昵称</label>
                <div class="col-md-10 validate">
                  <input type="text" class="form-control" v-model="install.adminUsername">
                </div>
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminEmail.error">
                <label class="col-md-2 control-label mt5 compulsory">管理员邮箱</label>
                <div class="col-md-10 validate">
                  <input type="text" class="form-control" v-model="install.adminEmail">
                </div>
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminPassword.error">
                <label class="col-md-2 control-label mt5 compulsory">管理员密码</label>
                <div class="col-md-10 validate">
                  <input type="password" class="form-control" v-model="install.adminPassword">
                </div>
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminRepassword.error">
                <label class="col-md-2 control-label mt5 compulsory">再次输入密码</label>
                <div class="col-md-10 validate">
                  <input type="password" class="form-control" v-model="install.adminRepassword">
                </div>
              </div>


              <div class="row mt20">
                <div class="col-md-12">
                  <div class="alert alert-info">
                    <div><i class="fa fa-bullhorn"></i> 注意：</div>
                    <ol class="pl30 m0">
                      <li>由于昵称将作为文件上传的目录，因此只允许字母数字以及"_"。</li>
                      <li>管理员邮箱将作为登录的用户名。</li>
                    </ol>

                  </div>
                </div>
              </div>


              <div class="row">
                <div class="col-md-12 text-right">

                  <button class="btn btn-primary btn-sm" @click.stop.prevent="preStep">
                    <i class="fa fa-arrow-left"></i>
                    上一步
                  </button>

                  <button class="btn btn-primary btn-sm" @click.stop.prevent="createAdmin()">
                    <i class="fa fa-send"></i>
                    提交
                  </button>

                </div>
              </div>


            </div>
          </NbExpanding>

        </div>
      </el-tab-pane>
      <el-tab-pane label="完成" name="forth" :disabled="!install.adminConfigured">
        <div class="install-block">

          <div class="text-center">
            <img src="../../assets/img/success.svg" class="w50"/>
          </div>
          <div class="text-center mt10">
            恭喜，安装成功！
          </div>
          <div class="text-center mv20">
            <button class="btn btn-primary btn-sm" @click.stop.prevent="finish">
              <i class="fa fa-home">
                点击进入首页
              </i>
            </button>
          </div>

        </div>
      </el-tab-pane>

    </el-tabs>


  </div>
</template>

<script>
  import Install from "../../common/model/install/Install";
  import NbExpanding from "../../common/widget/NbExpanding";

  export default {
    data() {
      return {

        //用来决定该如何验证管理员
        phase: -1,
        activeName: 'first',
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
        this.install.verified = false
      }
    },
    components: {
      NbExpanding
    },
    methods: {
      mysqlPasswordChange(e) {
        //这么做主要是为了防止浏览器自动填充
        //只有在第一个tab的时候才能变化
        if (this.activeName === "first") {
          this.install.mysqlPassword = e.target.value
        } else {
          console.log("只有first的tab才能改变mysqlPassword", e.target.value)
        }
      },
      verify() {
        let that = this;
        this.install.httpVerify(function () {
          that.install.verified = true
          that.$message.success("数据库连接可用！")
        })
      },
      fetchTableInfoList() {
        let that = this;
        this.install.httpTableInfoList()
      },

      handleClick(tab, event) {

        let paneName = tab.paneName;

      },
      createTable() {
        //开始建表
        let that = this;
        this.install.httpCreateTable(function (response) {
          that.$message.success("建表成功！")

        })
      },
      goTo(tabName) {
        if (tabName === "second") {

          if (!this.install.verified) {
            this.$message.error("请首先验证数据库连接")
            return
          }

          this.fetchTableInfoList();

        } else if (tabName === "third") {
          if (!this.install.tableCreated()) {
            this.$message.error("请首先点击'一键建表'")
            return
          }

          //获取管理员列表
          this.adminList()

        } else if (tabName === "forth") {
          if (!this.install.adminConfigured) {
            this.$message.error("请首先配置管理员信息")
            return
          }
        }
        this.activeName = tabName
      },
      adminList() {
        //开始创建管理员
        let that = this;
        this.install.httpAdminList(function (response) {
          if (that.install.adminList.length) {
            that.phase = 0
          } else {
            that.phase = 2
          }
        })
      },
      createAdmin() {
        //开始创建管理员
        let that = this;
        this.install.httpCreateAdmin(function (response) {
          that.$message.success("创建管理员成功！")
          that.goTo("forth")
        })
      },
      validateAdmin() {
        //开始创建管理员
        let that = this;
        this.install.httpValidateAdmin(function (response) {
          that.$message.success("验证管理员成功！")

          that.goTo("forth")
        })
      },
      //创建管理员时的上一步
      preStep() {
        let that = this
        if (that.install.adminList.length) {
          that.phase = 0
        } else {
          that.goTo("second")
        }

      },
      finish() {
        let that = this;

        that.install.httpFinish(function (response) {

          that.$store.state.installed = true
          that.$store.state.preference.httpFetch(function () {
            that.$router.push("/")
          })


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
      margin-bottom: 30px;
    }
  }
</style>

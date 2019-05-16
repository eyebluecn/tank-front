<template>
  <div class="backyard-install">

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label=" $t('install.configMysql')" name="first">
        <div class="install-block">

          <div class="row" v-validator="install.validatorSchema.mysqlHost.error">
            <label class="col-md-2 control-label mt5 compulsory">MySQL Host</label>
            <div class="col-md-10 validate">
              <input type="text" class="form-control" v-model="install.mysqlHost">
            </div>
          </div>

          <div class="row mt10" v-validator="install.validatorSchema.mysqlPort.error">
            <label class="col-md-2 control-label mt5 compulsory">MySQL {{ $t('install.port') }}</label>
            <div class="col-md-10 validate">
              <input type="number" class="form-control" v-model="install.mysqlPort">
            </div>
          </div>

          <div class="row mt10" v-validator="install.validatorSchema.mysqlSchema.error">
            <label class="col-md-2 control-label mt5 compulsory">MySQL {{ $t('install.schema') }}</label>
            <div class="col-md-10 validate">
              <input type="text" class="form-control" v-model="install.mysqlSchema">
            </div>
          </div>

          <div class="row mt10" v-validator="install.validatorSchema.mysqlUsername.error">
            <label class="col-md-2 control-label mt5 compulsory">MySQL {{ $t('username') }}</label>
            <div class="col-md-10 validate">
              <input type="text" class="form-control" v-model="install.mysqlUsername">
            </div>
          </div>

          <div class="row mt10" v-validator="install.validatorSchema.mysqlPassword.error">
            <label class="col-md-2 control-label mt5 compulsory">MySQL {{ $t('password') }}</label>
            <div class="col-md-10 validate">
              <input type="password" class="form-control" :value="install.mysqlPassword" @input="mysqlPasswordChange">
            </div>
          </div>

          <div class="row mt20">
            <div class="col-md-12">
              <div class="alert alert-info">
                <div><i class="fa fa-bullhorn"></i> {{ $t('install.notice') }}</div>
                <ol class="pl30 m0">
                  <li>{{ $t('install.mysqlNotice1') }}</li>
                  <li>{{ $t('install.mysqlNotice2') }}</li>
                </ol>

              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 text-right">
              <button class="btn btn-success btn-sm mr5" v-if="install.verified">
                <i class="fa fa-link"></i>
                {{ $t('install.mysqlConnectionPass') }}
              </button>
              <button class="btn btn-info btn-sm mr5" @click.stop.prevent="verify" v-if="!install.verified">
                <i class="fa fa-unlink"></i>
                {{ $t('install.testMysqlConnection') }}
              </button>

              <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="goTo('second')">
                <i class="fa fa-arrow-right"></i>
                {{ $t('install.nextStep') }}
              </button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('install.createTable')" name="second" :disabled="!install.verified">
        <div class="install-block">

          <div class="mb15 border-bottom" v-for="(tableInfo,index) in install.tableInfoList">
            <div class="f16">
              {{tableInfo.name}}

              <span class="label label-success" v-if="tableInfo.tableExist && !tableInfo.missingFields.length">
                {{ $t('install.installed') }}
              </span>
              <span class="label label-danger" v-if="tableInfo.tableExist && tableInfo.missingFields.length">
                {{ $t('install.installedButMissing') }}
              </span>
              <span class="label label-warning" v-if="!tableInfo.tableExist">
                {{ $t('install.toBeInstalled') }}
              </span>

            </div>

            <div class="mt10">
              {{ $t('install.allFields') }}: <span class="label label-default mr5 inline-block mb10"
                                                   v-for="field in tableInfo.allFields">{{field.DBName}}</span>
            </div>
            <div class="mt10" v-if="tableInfo.tableExist && tableInfo.missingFields.length">
              {{ $t('install.missingFields') }}: <span class="label label-default mr5 inline-block mb10"
                                                       v-for="field in tableInfo.missingFields">{{field.DBName}}</span>
            </div>

          </div>

          <div class="row mt20">
            <div class="col-md-12">
              <div class="alert alert-info">
                <div><i class="fa fa-bullhorn"></i>{{ $t('install.tableNotice') }}</div>
                <ol class="pl30 m0">
                  <li>{{ $t('install.tableNotice1') }}</li>
                  <li>{{ $t('install.tableNotice2') }}</li>
                  <li>{{ $t('install.tableNotice3') }}</li>
                  <li>{{ $t('install.tableNotice4') }}</li>
                </ol>

              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 text-right">

              <button class="btn btn-info btn-sm mr5" v-if="!install.tableCreated()" @click.stop.prevent="createTable()">
                <i class="fa fa-gavel"></i>
                {{ $t('install.oneKeyCreate') }}
              </button>

              <button class="btn btn-success btn-sm mr5" v-if="install.tableCreated()">
                <i class="fa fa-check"></i>
                {{ $t('install.oneKeyCreate') }}
              </button>

              <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="goTo('first')">
                <i class="fa fa-arrow-left"></i>
                {{ $t('install.preStep') }}
              </button>

              <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="goTo('third')">
                <i class="fa fa-arrow-right"></i>
                {{ $t('install.nextStep') }}
              </button>

            </div>
          </div>

        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('install.setAdministrator')" name="third" :disabled="!install.tableCreated()">
        <div class="install-block">

          <div class="text-center" v-show="phase===-1">
            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
          </div>

          <NbExpanding>
            <div v-show="phase===0">
              <div>
                {{ $t('install.detectAdministrator') }}
              </div>
              <div class="mv10 bold" v-for="admin in install.adminList">
                {{admin.username}}
              </div>
              <div>
                {{ $t('install.useOrCreateAdministrator') }}
              </div>

              <div>
                <div class="text-right">

                  <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="phase = 1">
                    <i class="fa fa-user-o"></i>
                    {{ $t('install.validateAdministrator') }}
                  </button>

                  <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="phase = 2">
                    <i class="fa fa-user-plus"></i>
                    {{ $t('install.createAdministrator') }}
                  </button>

                  <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="goTo('second')">
                    <i class="fa fa-arrow-left"></i>
                    {{ $t('install.preStep') }}
                  </button>

                </div>
              </div>
            </div>
          </NbExpanding>


          <NbExpanding>
            <div v-show="phase===1">


              <div class="bold f20 text-center">
                {{ $t('install.validateAdministrator') }}
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminUsername.error">
                <label class="col-md-2 control-label mt5 compulsory">{{ $t('install.administratorUsername') }}</label>
                <div class="col-md-10 validate">
                  <input type="text" class="form-control" v-model="install.adminUsername">
                </div>
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminPassword.error">
                <label class="col-md-2 control-label mt5 compulsory">{{ $t('install.administratorPassword') }}</label>
                <div class="col-md-10 validate">
                  <input type="password" class="form-control" v-model="install.adminPassword">
                </div>
              </div>

              <div class="row mt10">
                <div class="col-md-12 text-right">

                  <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="phase = 0">
                    <i class="fa fa-arrow-left"></i>
                    {{ $t('install.preStep') }}
                  </button>


                  <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="validateAdmin()">
                    <i class="fa fa-send"></i>
                    {{ $t('submit') }}
                  </button>

                </div>
              </div>
            </div>
          </NbExpanding>


          <NbExpanding>
            <div v-show="phase===2">

              <div class="bold f20 text-center">
                {{ $t('install.createAdministrator') }}
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminUsername.error">
                <label class="col-md-2 control-label mt5 compulsory">{{ $t('install.administratorUsername') }}</label>
                <div class="col-md-10 validate">
                  <input type="text" class="form-control" v-model="install.adminUsername">
                </div>
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminPassword.error">
                <label class="col-md-2 control-label mt5 compulsory">{{ $t('install.administratorPassword') }}</label>
                <div class="col-md-10 validate">
                  <input type="password" class="form-control" v-model="install.adminPassword">
                </div>
              </div>

              <div class="row mt10" v-validator="install.adminValidatorSchema.adminRepassword.error">
                <label class="col-md-2 control-label mt5 compulsory">{{ $t('install.administratorRePassword') }}</label>
                <div class="col-md-10 validate">
                  <input type="password" class="form-control" v-model="install.adminRepassword">
                </div>
              </div>


              <div class="row mt20">
                <div class="col-md-12">
                  <div class="alert alert-info">
                    <div><i class="fa fa-bullhorn"></i> {{ $t('install.notice') }}</div>
                    <ol class="pl30 m0">
                      <li>{{ $t('install.usernameRule') }}</li>
                    </ol>

                  </div>
                </div>
              </div>


              <div class="row">
                <div class="col-md-12 text-right">

                  <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="preStep">
                    <i class="fa fa-arrow-left"></i>
                    {{ $t('install.preStep') }}
                  </button>

                  <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="createAdmin()">
                    <i class="fa fa-send"></i>
                    {{ $t('submit') }}
                  </button>

                </div>
              </div>

            </div>
          </NbExpanding>

        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('finish') " name="forth" :disabled="!install.adminConfigured">
        <div class="install-block">

          <div class="text-center">
            <img src="../../assets/img/success.svg" class="w50"/>
          </div>
          <div class="text-center mt10">
            {{ $t('install.congratulationInstall') }}
          </div>
          <div class="text-center mv20">
            <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="finish">
              <i class="fa fa-home">
                {{ $t('install.enterHome') }}
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
        }
      },
      verify() {
        let that = this;
        this.install.httpVerify(function () {
          that.install.verified = true
          that.$message.success(that.$t("install.mysqlConnectionPass"))
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
          that.$message.success(that.$t("install.createTableSuccess"))

        })
      },
      goTo(tabName) {
        let that = this
        if (tabName === "second") {

          if (!this.install.verified) {
            this.$message.error(that.$t("install.validateMysqlFirst"))
            return
          }

          this.fetchTableInfoList();

        } else if (tabName === "third") {
          if (!this.install.tableCreated()) {
            this.$message.error(that.$t("install.crateTableFirst"))
            return
          }

          //获取管理员列表
          this.adminList()

        } else if (tabName === "forth") {
          if (!this.install.adminConfigured) {
            this.$message.error(that.$t("install.configAdminFirst"))
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
          that.$message.success(that.$t("install.createAdminSuccess"))
          that.goTo("forth")
        })
      },
      validateAdmin() {
        //开始创建管理员
        let that = this;
        this.install.httpValidateAdmin(function (response) {
          that.$message.success(that.$t("install.validateAdminSuccess"))

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

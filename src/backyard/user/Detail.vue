<template>
  <div class="backyard-user-detail animated fadeIn ">

    <div class="user-block tank-box">
      <div class="media">

        <div class="mr20" :class="{'pull-left':!$store.state.config.mobile}">
          <img class="img-container cursor img-circle"
               :class="{'img-blg':!$store.state.config.mobile,'img-lg':$store.state.config.mobile}"
               @click="$photoSwipePlugin.showPhoto(currentUser.getAvatarUrl())"
               :src="currentUser.getAvatarUrl()">
        </div>

        <div class="media-body">
          <div class="cell-title">
            <h1 class="mt10">{{currentUser.username}}</h1>
          </div>
          <div>
            <div class="row">

              <div class="col-md-12 form-info">
                <span>角色：</span>
                <span>
                      {{UserRoleMap[currentUser.role].name}}
                    </span>
              </div>

              <div class="col-md-12 form-info">
                <span>单文件限制：</span>
                <span v-if="currentUser.sizeLimit >= 0">
                            {{currentUser.sizeLimit | humanFileSize}}
                          </span>
                <span v-else>
                            无限制
                          </span>
              </div>
              <div class="col-md-12 form-info">
                <span>总文件限制：</span>
                <span v-if="currentUser.totalSizeLimit >= 0">
                            {{currentUser.totalSizeLimit | humanFileSize}}
                          </span>
                <span v-else>
                  无限制
                </span>
              </div>

              <div class="col-md-12 form-info">
                <span>总文件大小：</span>
                <span>
                 {{currentUser.totalSize | humanFileSize}}
                </span>
              </div>

              <div class="col-md-12 form-info">
                <span>状态：</span>
                <span>
                     {{UserStatusMap[currentUser.status].name}}
                    </span>
              </div>


              <div class="col-md-12 form-info">
                <span>上次登录IP：</span>
                <span>
                     {{currentUser.lastIp}}
                    </span>
              </div>


              <div class="col-md-12 form-info">
                <span>上次登录时间：</span>
                <span>
                     {{currentUser.lastTime | simpleDateTime}}
                    </span>
              </div>

            </div>


          </div>
        </div>

      </div>
    </div>


    <div class="text-right" v-if="user.username!=='demo'">
      <button class="btn btn-sm btn-primary mb5" v-if="user.role === UserRole.ADMINISTRATOR"
              @click.stop.prevent="resetPassword">
        <i class="fa fa-lock"></i>
        重置密码
      </button>
      <button class="btn btn-sm btn-primary mb5" v-if="user.role === UserRole.ADMINISTRATOR"
              @click.stop.prevent="currentUser.transfiguration()">
        <i class="fa fa-user-secret"></i>
        变身
      </button>
      <button class="btn btn-sm btn-primary mb5" v-if="currentUser.uuid === user.uuid"
              @click.stop.prevent="changePassword">
        <i class="fa fa-lock"></i>
        修改密码
      </button>
      <button class="btn btn-sm btn-primary mb5"
              @click.stop.prevent="$router.push('/user/edit/' + currentUser.uuid)">
        <i class="fa fa-pencil"></i>
        编辑资料
      </button>
    </div>


  </div>
</template>

<script>
  import NbExpanding from '../../common/widget/NbExpanding.vue'
  import User from '../../common/model/user/User'
  import {MessageBox} from 'element-ui'
  import {UserRole, UserRoleList, UserRoleMap} from "../../common/model/user/UserRole";
  import {UserStatus, UserStatusList, UserStatusMap} from "../../common/model/user/UserStatus";
  import {handleImageUrl} from "../../common/util/ImageUtil";
  import {currentHost} from "../../common/util/Utils";

  export default {
    data() {
      return {
        UserRole,
        UserRoleList,
        UserRoleMap,
        UserStatus,
        UserStatusList,
        UserStatusMap,
        user: this.$store.state.user,
        currentUser: new User(),
        breadcrumbs: this.$store.state.breadcrumbs
      }
    },
    components: {
      NbExpanding
    },
    methods: {
      handleImageUrl,
      currentUserUpdate(uuid) {
        if (uuid) {
          this.currentUser.uuid = uuid
          this.currentUser.httpDetail()
        } else {
          this.currentUser.uuid = this.user.uuid
          this.currentUser.httpDetail()
        }
      },
      changePassword() {
        this.$router.push('/user/change/password')
      },
      resetPassword() {
        let that = this
        MessageBox.prompt('输入新密码', '提示', {
          confirmButtonText: that.$t("confirm"),
          cancelButtonText: that.$t("cancel"),
          inputPattern: /.+/,
          inputErrorMessage: '新密码必填'
        }).then(({value}) => {
          that.currentUser.httpUserResetPassword(value, function (response) {
            that.$message.success({
              message: '重置密码成功！'
            })
          })
        }).catch(() => {
        })
      }
    },
    watch: {
      '$store.state.route.params.uuid'(newVal, oldVal) {
        this.currentUserUpdate(newVal)
      }
    },
    created() {
      if (this.user.role !== UserRole.ADMINISTRATOR) {
        this.breadcrumbs.splice(0, this.breadcrumbs.length)
        this.breadcrumbs.push({
          title: '个人详情'
        })
      }
    },
    mounted() {
      this.currentUserUpdate(this.$store.state.route.params.uuid)

    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  .backyard-user-detail {

    .user-block {
      margin-top: 10px;
      margin-bottom: 10px;
    }

  }
</style>

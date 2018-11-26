<template>
  <div class="backyard-user-detail animated fadeIn ">
    <div class="row">
      <div class="col-md-12">
        <div class="pedia-navigation">
					<span class="item active">
						<span>用户详情</span>
					</span>
        </div>
      </div>

      <div class="col-md-10 col-md-offset-1">
        <div class="bg-white br4 p10">
          <div class="media">

            <div class="mr20" :class="{'pull-left':!$store.state.config.mobile}">
              <img class="img-container"
                   :class="{'img-blg':!$store.state.config.mobile,'img-lg':$store.state.config.mobile}"
                   :src="handleImageUrl(currentUser.avatarUrl)">
            </div>
            <div class="media-body">
              <div class="cell-title">
                <h1 class="mt10">{{currentUser.username}}</h1>
              </div>


              <div>

                <div class="row f14">
                  <div class="mt5 col-md-12">
                    <div>
                      <span class="bold">角色：</span>{{currentUser.getRoleName()}}
                    </div>
                  </div>
                  <div class="mt5 col-md-12">
                    <div>
                      <span class="bold">邮箱：</span>{{currentUser.email}}
                    </div>
                  </div>

                  <div class="mt5 col-md-12">
                    <div class="row">
                      <div class="col-md-12">
                        <div>
                          <span class="bold">手机号：</span>{{currentUser.phone}}
                        </div>
                      </div>
                      <div class="mt5 col-md-12">
                        <div>
                          <span class="bold">性别：</span>{{currentUser.getGenderName()}}
                        </div>
                      </div>
                      <div class="mt5 col-md-12" v-if="currentUser.city">
                        <div>
                          <span class="bold">城市：</span>{{currentUser.city}}
                        </div>
                      </div>

                      <div class="mt5 col-md-12">
                        <div>
                          <span class="bold">单文件限制：</span>

                          <span v-if="currentUser.sizeLimit >= 0">
                            {{currentUser.sizeLimit | humanFileSize}}
                          </span>
                          <span v-else>
                            无限制
                          </span>
                        </div>
                      </div>

                      <div class="mt5 col-md-12">
                        <div>
                          <span class="bold">状态：</span>{{currentUser.getStatusName()}}
                        </div>
                      </div>

                      <div class="mt5 col-md-12" v-if="currentUser.lastIp">
                        <div>
                          <span class="bold">上次登录IP：</span>{{currentUser.lastIp}}
                        </div>
                      </div>
                      <div class="mt5 col-md-12" v-if="currentUser.lastTime">
                        <div>
                          <span class="bold">上次登录时间：</span>{{currentUser.lastTime | simpleDateTime}}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div class="row">

                  <div class="col-md-12 text-right" v-if="user.username!=='demo'">
                    <button class="btn btn-sm btn-primary mb5" v-if="user.role === UserRole.ADMINISTRATOR"
                            @click.stop.prevent="resetPassword">
                      重置密码
                    </button>
                    <button class="btn btn-sm btn-primary mb5" v-if="currentUser.uuid === user.uuid"
                            @click.stop.prevent="changePassword">
                      修改密码
                    </button>
                    <button class="btn btn-sm btn-primary mb5"
                            @click.stop.prevent="$router.push('/?userUuid=' + currentUser.uuid)">
                      {{currentUser.uuid === user.uuid ? '我的文件' : '他的文件'}}
                    </button>
                    <button class="btn btn-sm btn-primary mb5"
                            @click.stop.prevent="$router.push('/user/edit/' + currentUser.uuid)">
                      {{currentUser.uuid === user.uuid ? '编辑个人资料' : '编辑他的资料'}}
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
  import NbExpanding from '../../common/widget/NbExpanding.vue'
  import User from '../../common/model/user/User'
  import {MessageBox, Notification} from 'element-ui'
  import {UserGender, UserGenderList, UserGenderMap} from "../../common/model/user/UserGender";
  import {UserRole, UserRoleList, UserRoleMap} from "../../common/model/user/UserRole";
  import {UserStatus, UserStatusList, UserStatusMap} from "../../common/model/user/UserStatus";
  import {handleImageUrl} from "../../common/util/ImageUtil";

  export default {
    data() {
      return {
        UserGender,
        UserGenderList,
        UserGenderMap,
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
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '新密码必填'
        }).then(({value}) => {
          that.currentUser.httpUserResetPassword(value, function (response) {
            Notification.success({
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
  .user-profile {

  }
</style>

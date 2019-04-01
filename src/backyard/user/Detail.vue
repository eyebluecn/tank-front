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

      <div class="col-md-12">
        <div class="user-block">
          <div class="media">

            <div class="mr20" :class="{'pull-left':!$store.state.config.mobile}">
              <img class="img-container cursor img-circle"
                   :class="{'img-blg':!$store.state.config.mobile,'img-lg':$store.state.config.mobile}"
                   @click="$photoSwipePlugin.showPhoto(currentUser.avatarUrl)"
                   :src="handleImageUrl(currentUser.avatarUrl)">
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
                    <span>邮箱：</span>
                    <span>
                      {{currentUser.email}}
                    </span>
                  </div>

                  <div class="col-md-12 form-info">
                    <span>手机号：</span>
                    <span>
                      {{currentUser.phone}}
                    </span>
                  </div>

                  <div class="col-md-12 form-info">
                    <span>性别：</span>
                    <span>
                      {{UserGenderMap[currentUser.gender].name}}
                    </span>
                  </div>


                  <div class="col-md-12 form-info">
                    <span>城市：</span>
                    <span>
                     {{currentUser.city}}
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

                <div class="row">

                  <div class="col-md-12 text-right" v-if="user.username!=='demo'">
                    <button class="btn btn-sm btn-primary mb5" v-if="user.role === UserRole.ADMINISTRATOR"
                            @click.stop.prevent="resetPassword">
                      <i class="fa fa-lock"></i>
                      重置密码
                    </button>
                    <button class="btn btn-sm btn-primary mb5" v-if="currentUser.uuid === user.uuid"
                            @click.stop.prevent="changePassword">
                      <i class="fa fa-lock"></i>
                      修改密码
                    </button>
                    <button class="btn btn-sm btn-primary mb5"
                            @click.stop.prevent="$router.push('/?userUuid=' + currentUser.uuid)">
                      <i class="fa fa-file-word-o"></i>
                      {{currentUser.uuid === user.uuid ? '我的文件' : '他的文件'}}
                    </button>
                    <button class="btn btn-sm btn-primary mb5"
                            @click.stop.prevent="$router.push('/user/edit/' + currentUser.uuid)">
                      <i class="fa fa-pencil"></i>
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
  import {MessageBox} from 'element-ui'
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
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      border-radius: 5px;
      padding: 20px 15px 10px 15px;
      margin-top: 10px;
      margin-bottom: 30px;
    }

  }
</style>

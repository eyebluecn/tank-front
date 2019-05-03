<template>
  <div class="animated fadeIn backyard-user-edit">

    <div class="row">
      <div class="col-md-12">
        <div class="pedia-navigation">
					<span class="item active">
						<span v-show="!currentUser.editMode">创建用户</span>
						<span v-show="currentUser.editMode">编辑用户</span>
					</span>
        </div>
      </div>

      <div class="col-md-12">
        <div class="user-block">
          <div>

            <div class="row mt10">
              <label class="col-md-2 control-label mt5">头像</label>
              <div class="col-md-10">

                <input
                  v-show="manualFillAvatar"
                  type="text"
                  placeholder="请填写头像http链接，可以使用一张公有图片链接" class="form-control"
                  v-model="currentUser.avatarUrl">

                <div v-show="!manualFillAvatar">
                  <MatterImage v-model="currentUser.avatarUrl" uploadHint=""/>
                </div>

              </div>
            </div>


            <div class="row mt10" v-validator="currentUser.validatorSchema.username.error">
              <label class="col-md-2 control-label mt5 compulsory">用户名</label>
              <div class="col-md-10 validate">
                <input type="text" class="form-control"
                       :disabled="currentUser.editMode"
                       v-model="currentUser.username">
              </div>
            </div>

            <div class="row mt10" v-if="!currentUser.editMode" v-validator="currentUser.validatorSchema.password.error">
              <label class="col-md-2 control-label mt5 compulsory">密码</label>
              <div class="col-md-10 validate">
                <input type="password" class="form-control" v-model="currentUser.password">
              </div>
            </div>

            <div class="row mt10" v-if="!currentUser.editMode">
              <label class="col-md-2 control-label mt5 compulsory">确认密码</label>
              <div class="col-md-10">
                <input type="password" class="form-control" v-model="rePassword">
              </div>
            </div>

            <div class="row mt10">
              <label class="col-md-2 control-label mt5">文件限制(B) </label>
              <div class="col-md-10">
                <div class="row">
                  <div class="col-xs-6">
                    <input type="number" class="form-control"
                           :disabled="user.role !== UserRole.ADMINISTRATOR"
                           v-model="currentUser.sizeLimit">
                  </div>
                  <div class="col-xs-6" style="line-height:30px;">
                    当前值：
                    <span v-if="currentUser.sizeLimit < 0">无限制</span>
                    <span v-else>{{currentUser.sizeLimit | humanFileSize}}</span>
                  </div>
                </div>

              </div>

            </div>

            <div class="alert alert-info mt20">
              <div class="bold">
                <i class="fa fa-bullhorn"></i> 说明
              </div>
              <div>
                <ol>
                  <li>登录时，使用用户名和密码进行登录</li>
                  <li>因为用户名会作为用户上传文件的存储目录，因此只能使用数字和字母</li>
                  <li>文件限制指用户上传的每个文件的最大值，-1表示对上传大小不做任何限制</li>
                </ol>
              </div>

            </div>
          </div>


          <div class="mt10 text-right">
            <button class="btn btn-sm btn-primary mr10" @click.stop.prevent="$router.go(-1)">
              <span class="fa fa-reply"></span>
              返回
            </button>
            <button
              class="btn btn-sm btn-primary mr10"
              @click.stop.prevent="manualFillAvatar = !manualFillAvatar">
              <span class="fa fa-image"></span>
              {{manualFillAvatar?'头像上传模式':'头像填写模式'}}
            </button>
            <CreateSaveButton :entity="currentUser" :callback="save"></CreateSaveButton>
          </div>

        </div>
      </div>


    </div>

  </div>
</template>

<script>
  import {Notification} from 'element-ui'
  import {FeatureType} from '../../common/model/feature/FeatureType'
  import NbRadio from '../../common/widget/NbRadio.vue'
  import MatterImage from '../matter/widget/MatterImage'
  import CreateSaveButton from '../widget/CreateSaveButton'
  import User from '../../common/model/user/User'
  import {UserRole, UserRoleList, UserRoleMap} from "../../common/model/user/UserRole";
  import {UserStatus, UserStatusList, UserStatusMap} from "../../common/model/user/UserStatus";

  export default {

    data() {
      return {
        FeatureType,
        UserRole,
        UserRoleList,
        UserRoleMap,
        UserStatus,
        UserStatusList,
        UserStatusMap,
        manualFillAvatar: false,
        rePassword: null,
        user: this.$store.state.user,
        currentUser: new User(),
        breadcrumbs: this.$store.state.breadcrumbs
      }
    },
    components: {
      NbRadio,
      MatterImage,
      CreateSaveButton
    },
    methods: {
      save() {
        let that = this
        if (!this.currentUser.editMode && this.currentUser.password !== this.rePassword) {
          that.$message.error('两次密码输入不一致')
          return
        }

        this.currentUser.httpSave(function (response) {
          that.$message.success({
            message: that.currentUser.editMode ? '修改用户成功！' : '创建用户成功！'
          })

          if (that.user.uuid === that.currentUser.uuid) {
            that.user.innerLogin(response)
          }

          that.$router.go(-1)
        })
      }
    },
    created() {
      if (this.user.role !== UserRole.ADMINISTRATOR) {
        this.breadcrumbs.splice(0, this.breadcrumbs.length)
        this.breadcrumbs.push({
          title: '个人详情',
          path: '/user/detail/' + this.user.uuid
        }, {
          title: '编辑资料'
        })
      }
    },
    mounted() {
      let that = this
      this.currentUser.errorMessage = null
      this.currentUser.uuid = this.$store.state.route.params.uuid
      if (this.currentUser.uuid) {
        this.currentUser.httpDetail()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-user-edit {

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

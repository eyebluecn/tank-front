<template>
  <div class="animated fadeIn backyard-user-edit">

    <div class="user-block tank-box">
      <div>
        <div class="row mt10" v-if="user.uuid === currentUser.uuid">
          <label class="col-md-2 control-label mt5">{{$t('user.avatar')}}</label>
          <div class="col-md-10">
            <div>
              <MatterImage v-model="currentUser.avatarUrl" uploadHint=""/>
            </div>
          </div>
        </div>

        <div class="row mt10" v-validator="currentUser.validatorSchema.username.error">
          <label class="col-md-2 control-label mt5 compulsory">{{$t('user.username')}}</label>
          <div class="col-md-10 validate">
            <input type="text" class="form-control"
                   :disabled="!createMode"
                   v-model="currentUser.username">
          </div>
        </div>

        <div class="row mt10" v-if="createMode">
          <label class="col-md-2 control-label mt5 compulsory">{{$t('user.password')}}</label>
          <div class="col-md-10 validate">
            <input type="password" class="form-control"
                   v-model="currentUser.password">
          </div>
        </div>

        <div class="row mt10" v-if="createMode">
          <label class="col-md-2 control-label mt5 compulsory">{{$t('user.confirmPassword')}}</label>
          <div class="col-md-10 validate">
            <input type="password" class="form-control"
                   v-model="confirmPassword">
          </div>
        </div>

        <div class="row mt10" v-if="user.role === UserRole.ADMINISTRATOR">
          <label class="col-md-2 control-label mt5 compulsory">{{$t('user.role')}}</label>
          <div class="col-md-10">
            <select class="form-control" v-model="currentUser.role">
              <option v-for="item in UserRoleList" v-if="item.value !== UserRole.GUEST" :value="item.value">
                {{$t(item.name)}}
              </option>
            </select>
          </div>
        </div>

        <div class="row mt10">
          <label class="col-md-2 control-label mt5">{{$t('user.singleFileSizeLimit')}}(B) </label>
          <div class="col-md-10">
            <div class="row">
              <div class="col-xs-6">
                <input type="number" class="form-control"
                       :disabled="user.role !== UserRole.ADMINISTRATOR"
                       v-model="currentUser.sizeLimit">
              </div>
              <div class="col-xs-6" style="line-height:30px;">
                {{$t('user.current')}}:
                <span v-if="currentUser.sizeLimit < 0">{{$t('user.noLimit')}}</span>
                <span v-else>{{currentUser.sizeLimit | humanFileSize}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt10">
          <label class="col-md-2 control-label mt5">{{$t('user.totalFileSizeLimit')}}(B) </label>
          <div class="col-md-10">
            <div class="row">
              <div class="col-xs-6">
                <input type="number" class="form-control"
                       :disabled="user.role !== UserRole.ADMINISTRATOR"
                       v-model="currentUser.totalSizeLimit">
              </div>
              <div class="col-xs-6" style="line-height:30px;">
                {{$t('user.current')}}:
                <span v-if="currentUser.totalSizeLimit < 0">{{$t('user.noLimit')}}</span>
                <span v-else>{{currentUser.totalSizeLimit | humanFileSize}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt10 text-right">
      <CreateSaveButton :entity="currentUser" :callback="save"></CreateSaveButton>
    </div>

  </div>
</template>

<script>
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
        createMode: false,
        confirmPassword: null,
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

        if (this.createMode) {
          if (this.confirmPassword !== this.currentUser.password) {
            this.$message.error(that.$t("user.passwordNotSame"))
            return
          }
        }

        this.currentUser.httpSave(function (response) {
          that.$message.success({
            message: that.$t('operationSuccess')
          })

          if (!that.createMode && that.user.uuid === that.currentUser.uuid) {
            that.user.innerLogin(response)
          }

          that.$router.go(-1)
        })
      }
    },
    created() {
      let that = this
      if (this.user.role !== UserRole.ADMINISTRATOR) {
        this.breadcrumbs.splice(0, this.breadcrumbs.length)
        this.breadcrumbs.push({
          displayDirect: true,
          title: that.$t('user.profile'),
          path: '/user/detail/' + this.user.uuid
        }, {
          displayDirect: true,
          title: that.$t('edit')
        })
      }
    },
    mounted() {
      let that = this
      this.currentUser.errorMessage = null
      this.currentUser.uuid = this.$store.state.route.params.uuid
      if (this.currentUser.uuid) {
        this.createMode = false
        this.currentUser.httpDetail()
      } else {
        this.createMode = true
        this.currentUser.role = UserRole.USER
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-user-edit {

    .user-block {
      margin-top: 10px;
      margin-bottom: 10px;
    }

  }
</style>

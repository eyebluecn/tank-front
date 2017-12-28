<template>
  <div class="animated fadeIn backyard-user-edit">

    <div class="row">
      <div class="col-md-12">
        <div class="pedia-navigation">
					<span class="item active">
						<span v-show="!user.editMode">创建用户</span>
						<span v-show="user.editMode">编辑用户</span>
					</span>
        </div>
      </div>

      <div class="col-md-12">
        <div class="bg-white br4 border p10">
          <div>

            <div class="row mt10">
              <label class="col-md-2 control-label mt5 compulsory">头像</label>
              <div class="col-md-10">
                <MatterImage v-model="user.avatarUrl"/>
              </div>
            </div>


            <div class="row mt10" v-if="!user.editMode" v-validator="user.validatorSchema.email.error">
              <label class="col-md-2 control-label mt5 compulsory">邮箱</label>
              <div class="col-md-10 validate">
                <input type="text" class="form-control" v-model="user.email">
              </div>
            </div>

            <div class="row mt10" v-validator="user.validatorSchema.username.error">
              <label class="col-md-2 control-label mt5 compulsory">用户名</label>
              <div class="col-md-10 validate">
                <input type="text" class="form-control" v-model="user.username">
              </div>
            </div>

            <div class="row mt10" v-if="!user.editMode" v-validator="user.validatorSchema.password.error">
              <label class="col-md-2 control-label mt5 compulsory">密码</label>
              <div class="col-md-10 validate">
                <input type="password" class="form-control" v-model="user.password">
              </div>
            </div>

            <div class="row mt10" v-if="!user.editMode">
              <label class="col-md-2 control-label mt5 compulsory">确认密码</label>
              <div class="col-md-10">
                <input type="password" class="form-control" v-model="rePassword">
              </div>
            </div>

            <div class="row mt10">
              <label class="col-md-2 control-label mt5">手机号</label>
              <div class="col-md-10">
                <input type="text" class="form-control" v-model="user.phone">
              </div>
            </div>

            <div class="row mt10">
              <label class="col-md-2 control-label mt5">性别</label>
              <div class="col-md-10">

            <span v-for="gender in user.getGenderList()" class="mr10">
              <NbRadio v-model="user.gender" :val="gender.value" name="gender"></NbRadio>
              <label>{{gender.name}}</label>
            </span>

              </div>
            </div>

            <div class="row mt10">
              <label class="col-md-2 control-label mt5">城市</label>
              <div class="col-md-10">
                <input type="text" class="form-control" v-model="user.city">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <div class="mt10">
          <button class="btn btn-sm btn-primary" @click.stop.prevent="$router.go(-1)">
            <span class="fa fa-reply"></span>
            返回
          </button>
          <CreateSaveButton :entity="user" :callback="save"></CreateSaveButton>
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

  export default {
    name: 'create',
    data() {
      return {
        FeatureType,
        rePassword: null,
        currentUser: this.$store.state.user,
        user: new User()
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
        if (!this.user.editMode && this.user.password !== this.rePassword) {
          Notification.error('两次密码输入不一致')
          return
        }

        this.user.httpSave(function (response) {
          Notification.success({
            message: that.user.editMode ? '修改用户成功！' : '创建用户成功！'
          })
          that.$router.go(-1)
        })
      }
    },
    mounted() {
      let that = this
      this.user.errorMessage = null
      this.user.uuid = this.$store.state.route.params.uuid
      if (this.user.uuid) {
        this.user.httpDetail()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-user-edit {

  }
</style>

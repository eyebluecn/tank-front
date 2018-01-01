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
				<div class="bg-white br4 border p10">
					<div>

						<div class="row mt10">
							<label class="col-md-2 control-label mt5 compulsory">头像</label>
							<div class="col-md-10">
								<MatterImage v-model="currentUser.avatarUrl"/>
							</div>
						</div>


						<div class="row mt10" v-if="!currentUser.editMode" v-validator="currentUser.validatorSchema.email.error">
							<label class="col-md-2 control-label mt5 compulsory">邮箱</label>
							<div class="col-md-10 validate">
								<input type="text" class="form-control" v-model="currentUser.email">
							</div>
						</div>

						<div class="row mt10" v-validator="currentUser.validatorSchema.username.error">
							<label class="col-md-2 control-label mt5 compulsory">用户名</label>
							<div class="col-md-10 validate">
								<input type="text" class="form-control" v-model="currentUser.username">
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
							<label class="col-md-2 control-label mt5">单文件限制(单位：byte，负数表示无限制) 当前大小：{{currentUser.sizeLimit | humanFileSize}} </label>
							<div class="col-md-10">
								<input type="number" class="form-control" v-model="currentUser.sizeLimit">
							</div>
						</div>

            <div class="row mt10">
							<label class="col-md-2 control-label mt5">手机号</label>
							<div class="col-md-10">
								<input type="text" class="form-control" v-model="currentUser.phone">
							</div>
						</div>


						<div class="row mt10">
							<label class="col-md-2 control-label mt5">性别</label>
							<div class="col-md-10">

                <span v-for="gender in currentUser.getGenderList()" class="mr10">
                  <NbRadio v-model="currentUser.gender" :val="gender.value" name="gender"></NbRadio>
                  <label>{{gender.name}}</label>
                </span>

							</div>
						</div>

						<div class="row mt10">
							<label class="col-md-2 control-label mt5">城市</label>
							<div class="col-md-10">
								<input type="text" class="form-control" v-model="currentUser.city">
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
					<CreateSaveButton :entity="currentUser" :callback="save"></CreateSaveButton>
				</div>
			</div>

		</div>

	</div>
</template>

<script>
  import { Notification } from 'element-ui'
  import { FeatureType } from '../../common/model/feature/FeatureType'
  import NbRadio from '../../common/widget/NbRadio.vue'
  import MatterImage from '../matter/widget/MatterImage'
  import CreateSaveButton from '../widget/CreateSaveButton'
  import User from '../../common/model/user/User'

  export default {
    name: 'create',
    data () {
      return {
        FeatureType,
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
      save () {
        let that = this
        if (!this.currentUser.editMode && this.currentUser.password !== this.rePassword) {
          Notification.error('两次密码输入不一致')
          return
        }

        this.currentUser.httpSave(function (response) {
          Notification.success({
            message: that.currentUser.editMode ? '修改用户成功！' : '创建用户成功！'
          })

          if (that.user.uuid === that.currentUser.uuid) {
            that.user.innerLogin(response)
          }

          that.$router.go(-1)
        })
      }
    },
    created () {
      if(this.user.role !== 'ADMINISTRATOR'){
        this.breadcrumbs.splice(0, this.breadcrumbs.length)
        this.breadcrumbs.push({
          title: '个人详情',
          path: '/user/detail/' + this.user.uuid
        },{
          title: '编辑资料'
        })
      }
    },
    mounted () {
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

	}
</style>

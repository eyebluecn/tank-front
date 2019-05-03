<template>
  <div class="backyard-user-list animated fadeIn">
    <div class="row">

      <div class="col-md-12">
        <div class="pedia-navigation">
          <span class="item active">用户列表</span>
          <span class="tool">
            <router-link class="btn btn-primary btn-sm" to="/user/create">
              <i class="fa fa-plus"></i>
              创建用户
            </router-link>
          </span>
        </div>
      </div>

      <div class="col-md-12">
        <NbPlainFilter :filters="pager.filters" @change="search"/>
      </div>

      <div class="col-md-12" v-for="(userItem,index) in pager.data">
        <div class="bg-white border br4 p10 mb10">
          <div class="media">
            <div class="pull-left">
              <router-link :to="'/user/detail/'+userItem.uuid">
                <img class="img-circle img-md" :src="userItem.getAvatarUrl()">
              </router-link>
            </div>
            <div class="media-body">
              <div>
							<span class="f16">
								<router-link class="black" :to="'/user/detail/'+userItem.uuid">
                  <span>
                    {{userItem.username}}
                    <span v-if="userItem.status === UserStatus.DISABLED"
                          class="label label-danger">已禁用</span>
                  </span>

										<span v-if="userItem.uuid === user.uuid"
                          class="text-danger">(It's you)</span>
								</router-link>
							</span>
              </div>
              <div>
                <div class="mt5">
                  {{UserRoleMap[userItem.role].name}}
                </div>
              </div>
              <div class="mv5 text-muted one-line">
                {{userItem.description}}
              </div>
              <div>
                <span class="mr10">
                  文件限制:
                    <span v-if="userItem.sizeLimit >= 0">
                            {{userItem.sizeLimit | humanFileSize}}
                          </span>
                    <span v-else>
                            无限制
                          </span>
                </span>
                <span class="mr10">上次登录: {{userItem.lastTime | humanTime}}</span>
                <span class="mr10">上次IP: {{userItem.lastIp}}</span>

                <span class="pull-right action-buttons">
									<router-link :to="'/?userUuid=' + userItem.uuid" title="TA的文件">
										<i class="fa fa-file-word-o text-success f18"></i>
									</router-link>

                  <router-link :to="'/user/edit/'+userItem.uuid" title="修改用户资料">
										<i class="fa fa-pencil text-info f18"></i>
									</router-link>

									<a href="javascript:void(0)" v-if="userItem.status === UserStatus.OK && user.uuid!==userItem.uuid"
                     title="禁用该用户" @click.stop.prevent="changeStatus(userItem)">
                    <i class="fa fa-close text-danger f18"></i>
									</a>
                  <a href="javascript:void(0)"
                     v-if="userItem.status === UserStatus.DISABLED && user.uuid!==userItem.uuid"
                     title="激活该用户" @click.stop.prevent="changeStatus(userItem)">
                    <i class="fa fa-check text-success f18"></i>
									</a>

							</span>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-12 mt20">
        <NbPager :pager="pager" :callback="refresh"></NbPager>
      </div>

    </div>
  </div>
</template>

<script>
  import NbPlainFilter from '../../common/widget/filter/NbPlainFilter.vue'
  import NbPager from '../../common/widget/NbPager.vue'
  import Pager from '../../common/model/base/Pager'
  import User from '../../common/model/user/User'
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

        pager: new Pager(User),
        user: this.$store.state.user
      }
    },
    components: {
      NbPlainFilter,
      NbPager
    },
    methods: {
      handleImageUrl,
      search() {
        this.pager.page = 0
        this.refresh()
      },
      refresh() {
        this.pager.httpFastPage()
      },
      changeStatus(user) {
        let that = this
        user.httpChangeStatus(function () {
          that.refresh()
        })
      }
    },
    mounted() {
      this.pager.enableHistory()
      this.refresh()
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-user-list {

  }
</style>

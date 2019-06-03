<template>
  <div class="backyard-user-list animated fadeIn">
    <div class="row">

      <div class="col-md-8">
        <NbPlainFilter :filters="pager.filters" @change="search"/>
      </div>
      <div class="col-md-4 text-right" v-if="user.role === UserRole.ADMINISTRATOR">
        <router-link class="btn btn-primary btn-sm" to="/user/create">
          <i class="fa fa-plus"></i>
          创建用户
        </router-link>
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
                          class="label label-danger">{{$t('user.disabled')}}</span>
                  </span>

										<span v-if="userItem.uuid === user.uuid"
                          class="text-danger">(It's you)</span>
								</router-link>
							</span>
              </div>
              <div>
                <div :class="'mt5 text-'+UserRoleMap[userItem.role].style">
                  {{$t(UserRoleMap[userItem.role].name)}}
                </div>
              </div>
              <div class="mv5 text-muted one-line">
                {{userItem.description}}
              </div>
              <div class="mv5">
                <span class="mr10">
                  {{$t('user.singleFileSizeLimit')}}:
                    <span v-if="userItem.sizeLimit >= 0">
                            {{userItem.sizeLimit | humanFileSize}}
                          </span>
                    <span v-else>
                            {{$t('user.noLimit')}}
                          </span>
                </span>
                <span class="mr10">
                  {{$t('user.totalFileSizeLimit')}}:
                    <span v-if="userItem.totalSizeLimit >= 0">
                            {{userItem.totalSizeLimit | humanFileSize}}
                          </span>
                    <span v-else>
                            {{$t('user.noLimit')}}
                          </span>
                </span>
                <span class="mr10">
                  {{$t('user.totalFileSize')}}:
                    <span>
                            {{userItem.totalSize | humanFileSize}}
                          </span>
                </span>

              </div>
              <div class="mv5">
                <span class="mr10">{{$t('user.lastLoginTime')}}: {{userItem.lastTime | humanTime}}</span>
                <span class="mr10">{{$t('user.lastLoginIp')}}: {{userItem.lastIp}}</span>

                <span class="pull-right action-buttons">

                  <router-link :to="'/user/edit/'+userItem.uuid" :title="$t('edit')">
										<i class="fa fa-pencil text-info f18"></i>
									</router-link>

									<a href="javascript:void(0)"
                     :title="$t('user.transfiguration')" @click.stop.prevent="userItem.transfiguration()">
                    <i class="fa fa-user-secret f18"></i>
									</a>

									<a href="javascript:void(0)"
                     v-if="user.role === UserRole.ADMINISTRATOR && userItem.status === UserStatus.OK && user.uuid!==userItem.uuid"
                     :title="$t('user.disableUser')" @click.stop.prevent="toggleStatus(userItem)">
                    <i class="fa fa-close text-danger f18"></i>
									</a>
                  <a href="javascript:void(0)"
                     v-if="user.role === UserRole.ADMINISTRATOR && userItem.status === UserStatus.DISABLED && user.uuid!==userItem.uuid"
                     :title="$t('user.activeUser')" @click.stop.prevent="toggleStatus(userItem)">
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
  import {UserRole, UserRoleList, UserRoleMap} from "../../common/model/user/UserRole";
  import {UserStatus, UserStatusList, UserStatusMap} from "../../common/model/user/UserStatus";
  import {handleImageUrl} from "../../common/util/ImageUtil";
  import {SortDirection} from "../../common/model/base/SortDirection";

  export default {

    data() {
      return {
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
      toggleStatus(user) {
        let that = this
        user.httpToggleStatus(function () {
          that.refresh()
        })
      }
    },
    mounted() {
      this.pager.enableHistory()
      this.pager.setFilterValue("orderLastTime", SortDirection.DESC)
      this.refresh()
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .backyard-user-list {

  }
</style>

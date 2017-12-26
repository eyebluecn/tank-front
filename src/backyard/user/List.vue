<template>
	<div class="backyard-user-list animated fadeIn">
		<div class="row">
			<div class="col-md-12">
				<div class="pedia-navigation">
					<span class="item active">文章列表</span>
				</div>
			</div>


			<div class="col-md-12">
				<NbFilter :pager="pager" :callback="search">
					<router-link class="btn btn-primary btn-sm" to="/user/create">
						<i class="fa fa-plus"></i>
						创建用户
					</router-link>
				</NbFilter>
			</div>

			<div class="col-md-12" v-for="(user,index) in pager.data">
				<div class="bg-white border br4 p10 mb10">
					<div class="media">
						<div class="pull-left">
							<router-link :to="'/user/detail/'+user.uuid">
								<img class="img-circle img-md" :src="user.getAvatarUrl()">
							</router-link>
						</div>
						<div class="media-body">
							<div>
							<span class="f16">
								<router-link class="black" :to="'/user/detail/'+user.uuid">
											{{user.username}}
										<span v-if="user.uuid === currentUser.uuid"
										      class="text-danger">(It's you)</span>
								</router-link>
							</span>
							</div>
							<div>
								<div class="mt5">
									{{user.getRoleName()}}
								</div>
								<div class="mt5">
									<i class="fa fa-envelope text-success" v-if="user.email"></i>
									{{user.email}}

									<i class="fa fa-phone text-info" v-if="user.phone"></i>
									{{user.phone}}
								</div>
							</div>
							<div class="mv5 text-muted one-line">
								{{user.description}}
							</div>
							<div>
								<span class="mr10">上次登录: {{user.lastTime | humanTime}}</span>
								<span class="mr10">上次IP: {{user.lastIp}}</span>

								<span class="pull-right action-buttons">
									<router-link :to="'/user/edit/'+user.uuid">
										<i class="fa fa-pencil text-info f18"></i>
									</router-link>
									<a href="javascript:void(0)" title="删除" @click.stop.prevent="user.confirmDel(refresh)">
                    <i class="fa fa-trash text-danger f18"></i>
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
  import NbFilter from '../../common/widget/filter/NbFilter.vue'
  import NbPager from '../../common/widget/NbPager.vue'
  import Pager from '../../common/model/base/Pager'
  import User from '../../common/model/user/User'

  export default {
    name: 'list',
    data () {
      return {
        pager: new Pager(User),
        currentUser: this.$store.state.user
      }
    },
    components: {
      NbFilter,
      NbPager
    },
    methods: {
      search () {
        this.pager.page = 0
        this.refresh()
      },
      refresh () {
        this.pager.httpFastPage()
      }
    },
    mounted () {
      this.pager.enableHistory()
      this.refresh()
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
	.backyard-user-list {

	}
</style>

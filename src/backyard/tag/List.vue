<template>
	<div class="animated fadeIn">
		<div class="row">
			<div class="col-md-12">
				<div class="pedia-navigation">
					<span class="item active">标签列表</span>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-md-12">
				<NbFilter :pager="pager" :callback="search">
					<router-link class="btn btn-primary btn-sm" to="/tag/create">
						<i class="fa fa-plus"></i>
						创建标签
					</router-link>
				</NbFilter>
			</div>

			<div class="col-md-6" v-for="(tag,index) in pager.data">

				<div class="bg-white border br4 p10 mb10">
					<div class="media">
						<div class="pull-left">
							<span v-if="tag.logoUrl">
								<img class="img-circle img-md" :src="tag.logoUrl" alt="">
							</span>
							<span v-else>
								<img class="img-circle img-md" src="../../assets/img/tag.png" alt="">
							</span>
						</div>

						<div class="media-body">
							<div class="cell-title cursor">
								<span class="ln64 ml10">{{tag.name}}</span>
							</div>
						</div>
						<div>

							<span class="pull-right action-buttons">
								<router-link :to="'/tag/edit/'+tag.uuid">
									<i class="fa fa-pencil text-info f18"></i>
								</router-link>
								<a href="javascript:void(0)" title="删除" @click.stop.prevent="tag.confirmDel(refresh)">
									<i class="fa fa-trash text-danger f18"></i>
                </a>
							</span>

						</div>
					</div>


				</div>
			</div>


			<div class="col-md-12 mt20">
				<NbPager :pager="pager" :callback="refresh"/>
			</div>

		</div>

	</div>
</template>

<script>
  import NbFilter from '../../common/widget/filter/NbFilter.vue'
  import NbPager from '../../common/widget/NbPager.vue'
  import { MessageBox, Notification } from 'element-ui'
  import Pager from '../../common/model/base/Pager'
  import Tag from '../../common/model/tag/Tag'

  export default {
    name: 'list',
    data () {
      return {
        pager: new Pager(Tag),
        user: this.$store.state.user
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

<style>

</style>

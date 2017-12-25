<template>
	<div class="nb-filter-http-selection" v-show="filter.visible">

		<div class="title-area clearfix">
			<span>
				<span>
					{{activeItem.name ? activeItem.name : "请选择..."}}
				</span>
				<a class="btn-action f18 color-555" v-show="activeItem.uuid" @click.stop.prevent="clear">
					<i class="fa fa-times-circle-o pager-selection-close"></i>
				</a>
			</span>
			<button class="btn btn-default btn-sm ml15" @click="show=!show">
				<span v-if="show">
            <i class="fa fa-angle-up"></i>
				收起
          </span>
				<span v-else>
            <i class="fa fa-angle-down"></i>
				选择
        </span>

			</button>
		</div>
		<NbExpanding>
			<div v-show="show">
				<div class="content-area">
					<div class="row">

						<div class="col-xs-12">
							<div class="mb10 p10 cursor br4 border" v-for="item in pager.getList()"
							     @click.stop.prevent="clickItem(item)"
							     :class="{'bg-white':item.uuid !== activeItem.uuid,'bg-azure':item.uuid === activeItem.uuid}">
								<div>
									<span class="f15">{{item.name}}</span>
								</div>
							</div>
						</div>


						<div class="col-xs-12 mt20">
							<NbPager :pager="pager" :callback="refresh"></NbPager>
						</div>

					</div>
				</div>
			</div>

		</NbExpanding>


	</div>

</template>

<script>
  import Filter from '../../model/base/Filter'
  import Pager from '../../model/base/Pager'
  import NbExpanding from '../NbExpanding.vue'
  import NbPager from '../NbPager.vue'

  export default {
    data () {
      return {
        show: false,
        pager: new Pager(this.filter.Clazz),
        activeItem: new (this.filter.Clazz)()
      }
    },
    props: {
      filter: {
        type: Filter,
        required: true,
        validator: function (value) {

          if (value['type'] !== 'HTTP_SELECTION') {
            console.error('type must be `HTTP_SELECTION`.')
            return false
          }

          return true
        }
      },
      callback: {
        type: Function,
        required: false
      }
    },
    components: {
      NbExpanding,
      NbPager
    },
    computed: {},
    methods: {
      clear () {
        this.activeItem.render(new (this.filter.Clazz)())

        this.filter.value = null

        this.callback && this.callback()

      },
      clickItem (item) {
        this.activeItem.render(item)

        this.filter.value = this.activeItem.uuid

        this.show = false

        this.callback && this.callback()
      },
      search () {
        this.pager.page = 0
        this.refresh()
      },
      refresh () {

        if (this.filter.initFilter) {

          for (let key in this.filter.initFilter) {
            if (this.filter.initFilter.hasOwnProperty(key)) {
              this.pager.setFilterValue(key, this.filter.initFilter[key])
            }
          }

        }

        this.pager.httpFastPage()
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>

<style lang="less" rel="stylesheet/less">

	.nb-filter-http-selection {

		.title-area {

		}
		.content-area {
			margin-top: 10px;
			padding: 10px;
			border: 1px dashed #1167a9;
		}

	}

</style>
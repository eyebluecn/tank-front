<template>

	<div class="clearfix">
		<div class="text-right mb10">
			<slot></slot>
			<button class="btn btn-sm btn-primary" @click="show=!show">
				<i class="fa fa-filter"></i>
				<span v-if="show">
            收起筛选
          </span>
				<span v-else>
            打开筛选
        </span>
			</button>
		</div>
		<NbExpanding>
			<div v-show="show" class="col-md-12 bg-aliceblue border-dash mb10">

				<div class="form-horizontal pt10 pb10">

					<div class="form-group" v-for="filter in filters" v-if="filter.type === filter.Type.INPUT && filter.visible">
						<label class="col-md-2 control-label pt5">{{filter.name}}</label>
						<div class="col-md-10">
							<div class="row">
								<div class="col-md-4">
									<input type="text" :placeholder="filter.name" v-model="filter.value" class="form-control"
									       @keyup.enter="search">
								</div>
							</div>
						</div>
					</div>

					<div class="form-group" v-if="hasSortType">
						<label class="col-md-2 control-label pt5">排序</label>
						<div class="col-md-10">

							<span v-for="filter in filters" v-if="filter.type === filter.Type.SORT && filter.visible">
								<NbFilterSort :filter="filter" :callback="search"/>
							</span>

						</div>
					</div>

					<div class="form-group" v-if="hasCheckType">
						<label class="col-md-2 control-label pt5">勾选</label>
						<div class="col-md-10">

							<span v-for="filter in filters" v-if="filter.type === filter.Type.CHECK && filter.visible">
								<NbFilterCheck :filter="filter" :callback="search"/>
							</span>

						</div>
					</div>

					<div class="form-group" v-for="filter in filters" v-if="filter.type === filter.Type.SELECTION && filter.visible">
						<label class="col-md-2 control-label pt5">{{filter.name}}</label>
						<div class="col-md-10">
							<NbFilterSelection :filter="filter" :callback="search"/>
						</div>
					</div>

					<div class="form-group" v-for="filter in filters" v-if="filter.type === filter.Type.MULTI_SELECTION && filter.visible">
						<label class="col-md-2 control-label pt5">{{filter.name}}</label>
						<div class="col-md-10">
							<NbFilterMultiSelection :filter="filter" :callback="search"/>
						</div>
					</div>

					<div class="form-group" v-for="filter in filters" v-if="filter.type === filter.Type.HTTP_SELECTION && filter.visible">
						<label class="col-md-2 control-label pt5">{{filter.name}}</label>
						<div class="col-md-10">
							<NbFilterHttpSelection :filter="filter" :callback="search"/>
						</div>
					</div>

					<div class="form-group" v-for="filter in filters" v-if="filter.type === filter.Type.HTTP_INPUT_SELECTION && filter.visible">
						<label class="col-md-2 control-label pt5">{{filter.name}}</label>
						<div class="col-md-10">
							<div class="row">
								<div class="col-md-5">
									<NbFilterHttpInputSelection :filter="filter" :callback="search"/>
								</div>
							</div>

						</div>
					</div>

					<div class="form-group" v-for="filter in filters" v-if="filter.type === filter.Type.DATE_TIME_SELECTION && filter.visible">
						<label class="col-md-2 control-label pt5">{{filter.name}}</label>
						<div class="col-md-10">
							<NbFilterDateTime :filter="filter" :callback="search"/>
						</div>
					</div>



					<div class="text-right">
						<button class="btn btn-sm btn-primary" @click.stop.prevent="search">
							<i class="fa fa-search"></i>
							搜索
						</button>
					</div>

				</div>
			</div>
		</NbExpanding>
	</div>

</template>

<script>

	import NbExpanding from '../NbExpanding'
	import Pager from "../../model/base/Pager";
	import Filter from "../../model/base/Filter";
	import NbFilterSort from "./NbFilterSort";
	import NbFilterCheck from "./NbFilterCheck";
	import NbFilterDateTime from "./NbFilterDateTime.vue";
	import NbFilterSelection from "./NbFilterSelection";
	import NbFilterHttpInputSelection from "./NbFilterHttpInputSelection";
	import NbFilterMultiSelection from "./NbFilterMultiSelection";
	import NbFilterHttpSelection from "./NbFilterHttpSelection";

	export default {
		data () {
			return {
				show: false
			}
		},
		components: {
			NbExpanding,
			NbFilterSort,
			NbFilterCheck,
			NbFilterDateTime,
			NbFilterSelection,
      NbFilterHttpInputSelection,
			NbFilterMultiSelection,
			NbFilterHttpSelection
		},
		props: {
			pager: {
				type: Pager,
				required: true,
				validator: function (value) {
					return true;
				}
			},
			callback: {
				type: Function,
				required: false
			},
			showFilter: {
			  type: Boolean,
				required: false
			}
		},
		computed: {
			filters(){
				return this.pager.FILTERS;
			},
			hasSortType(){
				for (let i = 0; i < this.filters.length; i++) {
					let filter = this.filters[i];
					if (filter.type === Filter.prototype.Type.SORT && filter.visible) {
						return true;
					}
				}
				return false;
			},
			hasCheckType(){
				for (let i = 0; i < this.filters.length; i++) {
					let filter = this.filters[i];
					if (filter.type === Filter.prototype.Type.CHECK && filter.visible) {
						return true;
					}

				}
				return false;
			}

		},
		watch: {},
		methods: {
			search(){
				this.callback && this.callback();
			}
		},
		mounted(){
			if(this.showFilter){
			  this.show = true
			}
		}
	}
</script>

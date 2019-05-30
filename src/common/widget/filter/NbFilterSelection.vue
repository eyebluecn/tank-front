<template>

	<NbBtnDropdown :name="$t(current.name)" size="sm" :color="currentStyle" v-show="filter.visible">
		<ul>
			<li>
				<a href="javascript:void(0)" @click="select(-1)">{{$t("all")}}</a>
			</li>
			<li v-for="(option, index) in filter.options">
				<a href="javascript:void(0)" @click="select(index)">{{$t(option.name)}}</a>
			</li>
		</ul>
	</NbBtnDropdown>

</template>


<script>
	import Filter from "../../model/base/Filter";
	import NbBtnDropdown from "../NbBtnDropdown.vue";

	export default {
		data () {
			return {
				all: {
					name: "all",
					value: null,
					style: "default"
				}
			}
		},
		props: {
			filter: {
				type: Filter,
				required: true,
				validator: function (value) {

					if (value["type"] !== "SELECTION" && value["type"] !== "HTTP_SELECTION") {
						console.error("type must be `SELECTION` or `HTTP_SELECTION`.");
						return false;
					}

					return true;
				}
			},
      //TODO:完成禁用状态。
      disabled: {
        type: Boolean,
        required: false,
        "default": false
      }
		},
		computed: {
			current(){
				if (this.filter.active === -1) {
					return this.all;
				}
				return this.filter.options[this.filter.active];
			},
			currentStyle(){
				if (this.current.style) {
					return this.current.style;
				} else {
					return "default";
				}
			}
		},
		components: {
			NbBtnDropdown
		},
		methods: {

			select(index){
				this.filter.active = index;
				this.filter.value = this.current.value;
        this.$emit("change");

			}
		}
	}
</script>


<style lang="less" rel="stylesheet/less">

</style>


<template>
  <span class="nb-filter-datetime" v-show="filter.visible">
    <el-date-picker
	    v-model="date"
	    type="datetime"
	    placeholder="选择日期时间">
		</el-date-picker>
  </span>
</template>

<script>
	import Filter from "../../model/base/Filter";
	import {simpleDateTime, str2Date} from "../../filter/time";
	export default {
		data(){
			return {
				//饿了么时间控件有重大bug，此处不能设置为null，只能是空字符串，否则出错。
				date: ""
			}
		},
		computed: {},
		props: {
			filter: {
				type: Filter,
				required: true,
				validator: function (value) {

					if (!value["name"]) {
						console.error("name is required.");
						return false;
					}

					if (value["value"]) {

					}
					return true;
				}
			},
			callback: {
				type: Function,
				required: false
			}
		},
		watch: {
			"date"(newVal, oldVal){

				if (newVal) {

					//自己主动变化
					if (this.filter.value !== simpleDateTime(newVal)) {
						this.filter.value = simpleDateTime(newVal);

						if (typeof this.callback === "function") {
							this.callback();
						}
					}
				} else {

					//自己主动变化
					if (this.filter.value) {
						this.filter.value = null;
						if (typeof this.callback === "function") {
							this.callback();
						}
					}
				}

			},
			"filter.value"(newVal, oldVal){
				if (this.filter.value) {
					this.date = str2Date(this.filter.value);

				} else {
					this.date = "";
				}

			}
		},
		methods: {
			clear(){
				this.filter.value = null;


				if (typeof this.callback === "function") {
					this.callback();
				}
			}
		},
		mounted(){

		}
	}
</script>

<style lang="less" rel="stylesheet/less">


</style>


<template>
  <span class="nb-filter-datetime" v-show="filter.visible">
    <el-date-picker
	    v-model="date"
	    type="date"
	    placeholder="选择日期">
		</el-date-picker>
  </span>
</template>

<script>
	import Filter from "../../model/base/Filter";
  import {simpleDate, simpleDateTime, str2Date} from "../../common/filter/time";
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
      //TODO:不可选择时，需要良好的展现。
      disabled: {
        type: Boolean,
        required: false,
        "default": false
      }
		},
		watch: {
			"date"(newVal, oldVal){

				if (newVal) {

					//自己主动变化
					if (this.filter.value !== simpleDate(newVal)) {
						this.filter.value = simpleDate(newVal);

            this.$emit("change");
					}
				} else {

					//自己主动变化
					if (this.filter.value) {
						this.filter.value = null;
            this.$emit("change");
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


        this.$emit("change");
			}
		},
		mounted(){

		}
	}
</script>

<style lang="less" rel="stylesheet/less">


</style>


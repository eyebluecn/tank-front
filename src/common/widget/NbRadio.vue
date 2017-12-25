<template>
	<div class="nb-check-radio">
		<input ref="check" type="radio" :name="name" :value="val">
	</div>
</template>

<script>



	import $ from "jquery"
	import iCheck from "../fork/icheck/icheck-vue"
	//css
	import "icheck/skins/square/green.css";

	iCheck($);

	export default {
		data(){
			return {}
		},
		props: {
			value: {
				type: [String, Number, Boolean],
				required: false,
				"default": null
			},
			val: {
				type: [String, Number, Boolean],
				required: true,
				"default": null
			},
			name: {
				type: String,
				required: true,
				"default": null
			}
		},
		computed: {
			$check(){
				return $(this.$refs.check);
			}
		},
		watch: {
			"value"(){
				this.refresh();
			}
		},
		methods: {
			refresh(){
				let state = this.value === this.val ? "check" : "uncheck";
				this.$check.iCheck(state);
			}
		},
		mounted(){
			let that = this;
			this.$check.iCheck({
				checkboxClass: 'icheckbox_square-green',
				radioClass: 'iradio_square-green'
			});
			this.refresh();

			this.$check.on('ifChecked', function (event) {

				that.$emit('input', that.val);
			});


		}
	}
</script>

<style lang="less" rel="stylesheet/less">



	.nb-check-radio{
		display: inline-block;
		vertical-align: middle;
		margin: 0;
		padding: 0;
		width: 22px;
		height: 22px;
		border: none;
	}
</style>





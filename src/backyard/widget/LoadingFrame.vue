<template>

	<div>

		<div class="text-center" v-show="loading">
			<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
		</div>
		<div v-show="!loading">
			<slot></slot>
		</div>
	</div>

</template>
<script>

	/**
	 * 该控件是提供用户的超链接的。
	 */


	export default{
		data(){
			return {}
		},
		watch: {},
		props: {
			loading: {
				type: Boolean,
				required: false,
				"default": false
			}
		},
		methods: {},
		components: {},
		mounted(){

		}
	}
</script>

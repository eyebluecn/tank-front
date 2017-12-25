<template>
	<div class="we-attachment">
		<div class="panel-tab">
			<div class="tab-container">
				<a href="javascript:void(0)" class="tab selected">上传附件</a>
			</div>
		</div>
		<div class="content-container">

			<div class="content upload-content">
				<div>
					<NbTank ref="nbTank" :tank="tank" :preview="false"/>
				</div>
				<div class="text-right" v-show="tank.exist()">
					<button class="gray" @click.stop.prevent="cancelFunc">取消</button>
					<button class="" @click.stop.prevent="insertFunc">插入</button>
				</div>

			</div>

		</div>

	</div>

</template>

<script>

	import NbTank from "../../widget/NbTank.vue";
	import Tank from "../../model/tank/Tank";
	export default {
		data(){
			return {
				tank: new Tank("*", false, 1024 * 1024 * 1024)
			}
		},
		computed: {
			nbTank(){
				return this.$refs["nbTank"];
			}
		},
		props: {
			//在这种模式下不能使用大写。非常奇怪
			insertcallback: {
				type: Function,
				required: true
			},
			cancelcallback: {
				type: Function,
				required: true
			}
		},

		components: {
			NbTank
		},
		watch: {},
		methods: {
			insertFunc(){
				this.insertcallback(this.tank.fileIcon(true), this.tank.name, this.tank.url);
				this.nbTank.clear();
			},
			cancelFunc(){
				this.cancelcallback();
			}
		},
		mounted(){

		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	.we-attachment {

		.upload-content {
			padding: 10px;
		}

	}

</style>





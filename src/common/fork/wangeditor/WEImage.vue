<template>
	<div class="we-image">
		<div class="panel-tab">
			<div class="tab-container">
				<a href="javascript:void(0)" class="tab" :class="{'selected':uploadTab}"
				   @click.stop.prevent="uploadTab=true">上传图片</a>
				<a href="javascript:void(0)" class="tab" :class="{'selected':!uploadTab}"
				   @click.stop.prevent="uploadTab=false">网络图片</a>
			</div>
		</div>
		<div class="content-container">

			<div class="content upload-content" v-show="uploadTab">
				<div>
					<NbTank ref="nbTank" :tank="tank" :preview="false"/>
				</div>
				<div class="text-right" v-show="tank.exist()">
					<button class="gray" @click.stop.prevent="cancelFunc">取消</button>
					<button class="" @click.stop.prevent="insertFunc">插入</button>
				</div>

			</div>
			<div class="content network-content" v-show="!uploadTab">
				<div class="input-block">
					<input type="text" class="block url-input" v-model="handurl" placeholder="http://">
				</div>
				<div class="text-right">
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
				handurl: null,
				uploadTab: true,
				tank: new Tank("image", false, 20 * 1024 * 1024, "建议使用小于1M的图片。")
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
				if (this.uploadTab) {
					let url = this.tank.url;
					this.nbTank.clear();
					this.insertcallback(url);
				} else {

					this.insertcallback(this.handurl);
					this.handurl = null;
				}
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
	.we-image {

		.upload-content {
			padding: 10px;
		}
		.network-content {
			.input-block {
				margin: 20px 10px 10px 10px;
			}
		}

	}

</style>





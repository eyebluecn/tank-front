<template>
	<label class="nb-switch" :class="switcherClass">
		<input type="checkbox" :disabled="disabled" v-model="checked">
		<span class="slider" :class="type">
			<span class="small"></span>
		</span>
	</label>
</template>

<script>
	export default{
		//这个值代表的是开或者关的状态。
		model: {
			prop: 'toggle',
			event: 'toggle'
		},
		data(){
			return {
				checked: this.toggle
			}
		},

		props: {
			toggle: {
				type: Boolean,
				required: false,
				"default": false
			},
			type: {
				type: String,
				required: false,
				"default": "primary"
			},
			size: {
				type: String,
				required: false,
				"default": "md"
			},
			disabled: {
				type: Boolean,
				required: false,
				"default": false
			},
			callback: {
				type: Function,
				required: false
			}
		},
		computed: {
			switcherClass(){
				return "nb-switch-" + this.size + (this.disabled ? " disabled" : "");
			}
		},
		components: {},
		watch: {
			"checked"(newVal, oldVal){
				this.$emit('toggle', newVal);

				if (typeof this.callback === "function") {
					this.callback(newVal);
				}
			},
			"toggle"(newVal, oldVal){
				if (newVal === this.checked) {
					//Event from inner.
				} else {
					//Event from outer
					this.checked = newVal;
				}
			}
		},
		methods: {},
		mounted(){
		}
	}


</script>

<style lang="less" rel="stylesheet/less">

	@import "../assets/css/global/variables.less";

	.nb-switch {

		@switch-default-color: @brand-gray;
		@switch-close-color: #fff;
		@switch-disable-color: #CECECE;
		@switch-width: 48;
		@switch-height: 28;
		@switch-padding: 0.5;
		@switch-slider-diameter: @switch-height - 2 * @switch-padding;
		@switch-width-px: unit(@switch-width, px);
		@switch-height-px: unit(@switch-height, px);
		@switch-padding-px: unit(@switch-padding, px);
		@switch-slider-diameter-px: unit(@switch-slider-diameter, px);
		@switch-slider-transform: @switch-width - 2 * @switch-padding - @switch-slider-diameter;
		@switch-slider-transform-px: unit(@switch-slider-transform, px);

		position: relative;
		display: inline-block;
		width: @switch-width-px;
		height: @switch-height-px;
		margin: 0;
		vertical-align: middle;
		opacity: 1;
		cursor: pointer;

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}


		input {
			display: none;
		}

		input:checked {

			& + .slider {

				transition: border 0.4s, box-shadow 0.4s, background-color 1.2s;
				border-color: @switch-default-color;
				box-shadow: @switch-default-color 0 0 0 16px inset;
				background-color: @switch-default-color;

				&.primary {
					border-color: @brand-primary;
					box-shadow: @brand-primary 0 0 0 16px inset;
					background-color: @brand-primary;
				}
				&.info {
					border-color: @brand-info;
					box-shadow: @brand-info 0 0 0 16px inset;
					background-color: @brand-info;
				}
				&.success {
					border-color: @brand-success;
					box-shadow: @brand-success 0 0 0 16px inset;
					background-color: @brand-success;
				}
				&.warning {
					border-color: @brand-warning;
					box-shadow: @brand-warning 0 0 0 16px inset;
					background-color: @brand-warning;
				}
				&.danger {
					border-color: @brand-danger;
					box-shadow: @brand-danger 0 0 0 16px inset;
					background-color: @brand-danger;
				}

				& > .small {
					-webkit-transform: translateX(@switch-slider-transform-px);
					-ms-transform: translateX(@switch-slider-transform-px);
					transform: translateX(@switch-slider-transform-px);
				}
			}

		}

		/* The slider */
		.slider {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: @switch-height-px;

			background-color: @switch-close-color;
			border: 1px solid rgb(223, 223, 223);
			box-sizing: content-box;
			box-shadow: rgb(223, 223, 223) 0 0 0 0 inset;
			transition: border 0.4s, box-shadow 0.4s;

			.small {
				position: absolute;
				height: @switch-slider-diameter-px;
				width: @switch-slider-diameter-px;
				left: @switch-padding-px;
				bottom: @switch-padding-px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
				background-color: white;
				-webkit-transition: .4s;
				transition: .4s;
				border-radius: 100%;
				box-sizing: border-box;
			}

		}

		&.nb-switch-sm {
			@switch-width: 40;
			@switch-height: 22;
			@switch-padding: 0.5;
			@switch-slider-diameter: @switch-height - 2 * @switch-padding;
			@switch-width-px: unit(@switch-width, px);
			@switch-height-px: unit(@switch-height, px);
			@switch-padding-px: unit(@switch-padding, px);
			@switch-slider-diameter-px: unit(@switch-slider-diameter, px);
			@switch-slider-transform: @switch-width - 2 * @switch-padding - @switch-slider-diameter;
			@switch-slider-transform-px: unit(@switch-slider-transform, px);
			width: @switch-width-px;
			height: @switch-height-px;
			input:checked {
				& + .slider {
					& > .small {
						-webkit-transform: translateX(@switch-slider-transform-px);
						-ms-transform: translateX(@switch-slider-transform-px);
						transform: translateX(@switch-slider-transform-px);
					}
				}
			}
			/* The slider */
			.slider {
				border-radius: @switch-height-px;
				.small {
					height: @switch-slider-diameter-px;
					width: @switch-slider-diameter-px;
					left: @switch-padding-px;
					bottom: @switch-padding-px;
				}

			}

		}

		&.nb-switch-lg {
			@switch-width: 56;
			@switch-height: 32;
			@switch-padding: 0.5;
			@switch-slider-diameter: @switch-height - 2 * @switch-padding;
			@switch-width-px: unit(@switch-width, px);
			@switch-height-px: unit(@switch-height, px);
			@switch-padding-px: unit(@switch-padding, px);
			@switch-slider-diameter-px: unit(@switch-slider-diameter, px);
			@switch-slider-transform: @switch-width - 2 * @switch-padding - @switch-slider-diameter;
			@switch-slider-transform-px: unit(@switch-slider-transform, px);
			width: @switch-width-px;
			height: @switch-height-px;
			input:checked {
				& + .slider {
					& > .small {
						-webkit-transform: translateX(@switch-slider-transform-px);
						-ms-transform: translateX(@switch-slider-transform-px);
						transform: translateX(@switch-slider-transform-px);
					}
				}
			}
			/* The slider */
			.slider {
				border-radius: @switch-height-px;
				.small {
					height: @switch-slider-diameter-px;
					width: @switch-slider-diameter-px;
					left: @switch-padding-px;
					bottom: @switch-padding-px;
				}

			}

		}

	}

</style>

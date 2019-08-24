<template>
	<transition
		v-on:before-enter="beforeEnter"
		v-on:enter="enter"
		v-on:leave="leave"
		v-bind:css="false"
	>
		<slot></slot>
	</transition>
</template>

<script>
	import Velocity from "velocity-animate";
	export default {
		methods: {
			beforeEnter: function (el) {

			},
			enter: function (el, done) {

				Velocity(el, "slideDown", {duration: 377})

			},
			leave: function (el, done) {

				Velocity(el, "slideUp", {duration: 377})

			}
		}
	}
</script>


<style lang="less" rel="stylesheet/less">



</style>



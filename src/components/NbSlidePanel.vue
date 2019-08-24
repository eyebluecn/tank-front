<template>
  <div class="panel" :class="'panel-'+type">
    <div class="panel-heading cursor" @click.stop.prevent="show = !show" :class="'font-color-'+colorType">
      <span v-if="title">{{title}}</span>
      <slot name="heading"></slot>
      <span class="pull-right">
				<slot name="actions"></slot>
				<span class="ml5">
					<i class="fa fa-angle-up" v-show="show"></i>
					<i class="fa fa-angle-down" v-show="!show"></i>
				</span>
			</span>
    </div>
    <NbExpanding>
      <div class="panel-body" v-show="show">
        <slot name="body"></slot>
        <slot></slot>
      </div>
    </NbExpanding>
  </div>
</template>

<script>
  import NbExpanding from './NbExpanding.vue'

  export default {
    data () {
      return {
        show: true
      }
    },
    components: {
      NbExpanding
    },
    props: {
      title: {
        type: String,
        required: false
      },
      type: {
        type: String,
        required: false,
        'default' () {
          return 'default'
        }
      },
      colorType: {
        type: String,
        required: false,
        'default' () {
          return 'default'
        }
      },
      initShow: {
        type: Boolean,
        required: false,
        'default' () {
          return true
        }
      }
    },
    methods: {},
    mounted () {
      this.show = this.initShow
    }
  }
</script>


<style lang="less" rel="stylesheet/less">

  @import "../assets/css/global/variables";

  .font-color-primary {
    color: @brand-primary !important;
  }
  .font-color-info {
    color: @brand-info !important;
  }
  .font-color-danger {
    color: @brand-danger !important;
  }
  .font-color-warning {
    color: @brand-warning !important;
  }
  .font-color-success {
    color: @brand-success !important;
  }
</style>



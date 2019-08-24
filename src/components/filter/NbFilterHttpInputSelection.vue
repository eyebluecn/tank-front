<template>
  <div class="nb-filter-http-input-selection" v-show="filter.visible">

    <component v-bind:is="filter.component" :activeItem="activeItem"/>

  </div>

</template>

<script>
  import Filter from '../../model/base/Filter'
  import Pager from '../../model/base/Pager'
  import NbExpanding from '../NbExpanding.vue'
  import NbPager from '../NbPager.vue'

  export default {
    data() {
      return {
        show: false,
        activeItem: new (this.filter.Clazz)()
      }
    },
    props: {
      filter: {
        type: Filter,
        required: true,
        validator: function (value) {

          if (value['type'] !== 'HTTP_INPUT_SELECTION') {
            console.error('type must be `HTTP_INPUT_SELECTION`.')
            return false
          }

          return true
        }
      },
      callback: {
        type: Function,
        required: false
      }
    },
    components: {
      NbExpanding,
      NbPager
    },
    watch: {
      'activeItem.uuid'(newVal, oldVal) {

        if (newVal) {
          this.filter.value = this.activeItem.uuid

          this.callback && this.callback()
        } else {
          this.filter.value = null

          this.callback && this.callback()
        }
      },
      'filter.value'(newVal, oldVal) {

        if (newVal && newVal === this.activeItem.uuid) {
          //inner change. ignore
        } else {
          //outer change.
          this.activeItem.uuid = newVal
        }
      }
    },
    computed: {},
    methods: {},
    mounted() {
    }
  }
</script>

<style lang="less" rel="stylesheet/less">

  .nb-filter-http-input-selection {

  }

</style>

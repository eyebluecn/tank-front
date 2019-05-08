<template>
  <span class="widget-rate-panel">
    <span class="name">{{name}}</span>

    <span class="infinite" v-if="infinite">∞</span>
    <span class="no-data" v-else-if="noData"> - </span>
    <span v-else>{{value>0?'+':''}}{{value}}%</span>

    <i class="fa fa-arrow-down text-success" v-if="!noData && value<0"></i>
    <i class="fa fa-arrow-up text-danger" v-if="!noData && (infinite || value>=0)"></i>
  </span>
</template>

<script>

  export default {
    data: function () {
      return {}
    },
    computed: {
      noData() {
        return this.standardValue === 0 && this.compareValue === 0
      },
      infinite() {
        return this.standardValue === 0 && this.compareValue > 0
      },
      value() {
        if (this.standardValue === 0) {
          if (this.compareValue === 0) {
            return 0;
          } else {
            return 100;
          }
        } else {
          let v1 = this.compareValue - this.standardValue
          let v2 = v1 / this.standardValue
          return (v2 * 100).toFixed(0)
        }
      }
    },
    props: {
      name: {
        type: String,
        required: false,
        'default': ""
      },
      standardValue: {
        type: Number,
        required: true,
        'default': 0
      },
      compareValue: {
        type: Number,
        required: true,
        'default': 0
      }
    },
    components: {},
    methods: {},
    mounted() {
      let that = this;
    }
  }

</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../assets/css/global/variables";

  .widget-rate-panel {
    margin-right: 5px;
    .infinite {

    }
    .no-data {
    }

  }
</style>

<template>

  <div class="nb-filter-sort" v-show="filter.visible">

    <select :title="filter.name" class="form-control" v-model="filter.value">
      <option :value="null">所有</option>
      <option :value="true">是</option>
      <option :value="false">否</option>
    </select>
  </div>

</template>

<script>
  import Filter from '../../model/base/Filter'
  import {FilterType} from "../../model/base/FilterType";

  export default {
    data() {
      return {
      }
    },
    props: {
      filter: {
        type: Filter,
        required: true,
        validator: function (value) {
          if (value.type !== FilterType.CHECK) {
            console.error('type must be `CHECK`.')
            return false
          }
          return true
        }
      }
    },
    watch: {
      "filter.value"() {
        this.$emit("change");
      }
    },
    components: {

    },
    computed: {},
    methods: {

    },
    mounted() {
    }
  }

</script>

<style lang="less" rel="stylesheet/less">

  .nb-filter-sort {
    display: inline-block;
    width: 120px;
  }

</style>

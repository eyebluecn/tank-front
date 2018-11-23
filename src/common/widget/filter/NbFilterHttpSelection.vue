<template>

  <div class="nb-filter-http-selection" v-show="filter.visible">

    <select :title="filter.name" class="form-control" v-model="filter.value">
      <option :value="null">所有</option>
      <option v-for="(item,index) in pager.data" :key="index" :value="item.uuid">
        {{item.getDisplayName()}}
      </option>
    </select>
  </div>

</template>

<script>
  import Filter from '../../model/base/Filter'
  import Pager from '../../model/base/Pager'
  import NbPager from '../NbPager.vue'
  import {FilterType} from "../../model/base/FilterType";

  export default {
    data() {
      return {
        pager: new Pager(this.filter.Clazz, Pager.MAX_PAGE_SIZE)
      }
    },
    props: {
      filter: {
        type: Filter,
        required: true,
        validator: function (value) {
          if (value.type !== FilterType.HTTP_SELECTION) {
            console.error('type must be `HTTP_SELECTION`.')
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
      NbPager
    },
    computed: {},
    methods: {
      search() {
        this.pager.page = 0
        this.refresh()
      },
      refresh() {

        if (this.filter.initFilter) {

          for (let key in this.filter.initFilter) {
            if (this.filter.initFilter.hasOwnProperty(key)) {
              this.pager.setFilterValue(key, this.filter.initFilter[key])
            }
          }

        }

        this.pager.httpFastPage()
      }
    },
    mounted() {
      this.refresh()
    }
  }

</script>

<style lang="less" rel="stylesheet/less">

  .nb-filter-http-selection {
    display: inline-block;
    width: 120px;
  }

</style>

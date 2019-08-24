<template>

  <div class="widget-plain-filter">

    <span class="filter-block" v-for="filter in filters">

      <span class="filter-cell" v-if="filter.type === FilterType.INPUT && filter.visible">
            <span class="filter-name">{{filter.name}}：</span>
        <span class="filter-body">
          <input type="text" :placeholder="filter.name" v-model="filter.value" class="form-control inline-block w120"
                 @keyup="search">
        </span>

      </span>

      <span class="filter-cell" v-if="filter.type === FilterType.CHECK && filter.visible">
            <span class="filter-name">{{filter.name}}：</span>
        <span class="filter-body">
        <NbFilterCheck :filter="filter" @change="search"/>
        </span>
      </span>

      <span class="filter-cell" v-if="filter.type === FilterType.SELECTION && filter.visible">
            <span class="filter-name">{{filter.name}}：</span>
        <span class="filter-body">
        <NbFilterSelection :filter="filter" @change="search"/>
        </span>
          </span>

      <span class="filter-cell" v-if="filter.type === FilterType.MULTI_SELECTION && filter.visible">
            <span class="filter-name">{{filter.name}}：</span>
        <span class="filter-body">
        <NbFilterMultiSelection :filter="filter" @change="search"/>
        </span>
          </span>


      <span class="filter-cell" v-if="filter.type === FilterType.HTTP_SELECTION && filter.visible">
            <span class="filter-name">{{filter.name}}：</span>
        <span class="filter-body">
        <NbFilterHttpSelection :filter="filter" @change="search"/>
        </span>
          </span>


      <span class="filter-cell" v-if="filter.type === FilterType.DATE_TIME_SELECTION && filter.visible">
            <span class="filter-name">{{filter.name}}：</span>
        <span class="filter-body">
        <NbFilterDateTime :filter="filter" @change="search"/>
        </span>
      </span>

      <span class="filter-cell" v-if="filter.type === FilterType.DATE_SELECTION && filter.visible">
            <span class="filter-name">{{filter.name}}：</span>
        <span class="filter-body">
        <NbFilterDate :filter="filter" @change="search"/>
        </span>
          </span>

    </span>


  </div>

</template>

<script>

  import NbExpanding from '../NbExpanding'
  import NbSwitcher from '../NbSwitcher'
  import NbFilterSort from "./NbFilterSort";
  import NbFilterCheck from "./NbFilterCheck";
  import NbFilterDateTime from "./NbFilterDateTime.vue";
  import NbFilterDate from "./NbFilterDate.vue";
  import NbFilterSelection from "./NbFilterSelection";
  import NbFilterMultiSelection from "./NbFilterMultiSelection";
  import NbFilterHttpSelection from "./NbFilterHttpSelection";
  import {FilterType} from "../../model/base/FilterType";

  export default {
    data() {
      return {
        FilterType
      }
    },
    components: {
      NbExpanding,
      NbSwitcher,
      NbFilterSort,
      NbFilterCheck,
      NbFilterDateTime,
      NbFilterDate,
      NbFilterSelection,
      NbFilterMultiSelection,
      NbFilterHttpSelection
    },
    props: {
      //过滤器列表
      filters: {
        type: Array,
        required: true,
        validator: function (value) {
          return true;
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      search() {
        this.$emit("change")
      }
    },
    mounted() {

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .widget-plain-filter {
    .filter-block {
      display: inline-block;

      .filter-cell {
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 10px;

        .filter-name {
          font-weight: bold;

        }

        .filter-body {

        }
      }

    }

  }


</style>


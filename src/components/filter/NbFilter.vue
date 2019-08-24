<template>

  <div class="clearfix">
    <div class="text-right mb10" v-if="showTrigger">
      <slot></slot>
      <button class="btn btn-sm btn-primary" @click="show=!show">
        <i class="fa fa-filter"></i>
        <span v-if="show">
            收起筛选
        </span>
        <span v-else>
            打开筛选
        </span>
      </button>
    </div>
    <NbExpanding>
      <div v-show="show" class="col-md-12 bg-aliceblue border-dash mb10">

        <div class="form-horizontal pt10 pb10">

          <div class="form-group" v-for="filter in filters" v-if="filter.type === FilterType.INPUT && filter.visible">
            <label class="col-md-2 control-label pt5">
              {{filter.name}}
              <span v-if="showOverwriteSwitcher">
                <NbSwitcher size="sm" v-model="filter.overwrite" :disabled="!editable || !overwrite"/>
              </span>
            </label>
            <div class="col-md-10">
              <div class="row">
                <div class="col-md-4">
                  <input type="text" :placeholder="filter.name" v-model="filter.value" class="form-control"
                         @keyup.enter="search" :disabled="!editable">
                </div>
              </div>
            </div>
          </div>

          <div class="form-group" v-if="hasSortType">
            <label class="col-md-2 control-label pt5">排序</label>
            <div class="col-md-10">

							<span v-for="filter in filters" v-if="filter.type === FilterType.SORT && filter.visible">
								<NbFilterSort :filter="filter" @change="search" :disabled="!editable"/>

                <span class="mr30" v-if="showOverwriteSwitcher">
                  <NbSwitcher size="sm" v-model="filter.overwrite" :disabled="!editable || !overwrite"/>
                </span>
							</span>

            </div>
          </div>

          <div class="form-group" v-if="hasCheckType">
            <label class="col-md-2 control-label pt5">勾选</label>
            <div class="col-md-10">

							<span v-for="filter in filters" v-if="filter.type === FilterType.CHECK && filter.visible">
								<NbFilterCheck :filter="filter" @change="search"/>
                <span class="mr30" v-if="showOverwriteSwitcher">
                  <NbSwitcher size="sm" v-model="filter.overwrite" :disabled="!editable || !overwrite"/>
                </span>
							</span>

            </div>
          </div>

          <div class="form-group" v-for="filter in filters"
               v-if="filter.type === FilterType.SELECTION && filter.visible">
            <label class="col-md-2 control-label pt5">
              {{filter.name}}
              <span v-if="showOverwriteSwitcher">
                <NbSwitcher size="sm" v-model="filter.overwrite" :disabled="!editable || !overwrite"/>
              </span>
            </label>
            <div class="col-md-10">
              <NbFilterSelection :filter="filter" @change="search" :disabled="!editable"/>

            </div>
          </div>

          <div class="form-group" v-for="filter in filters"
               v-if="filter.type === FilterType.MULTI_SELECTION && filter.visible">
            <label class="col-md-2 control-label pt5">
              {{filter.name}}
              <span v-if="showOverwriteSwitcher">
                <NbSwitcher size="sm" v-model="filter.overwrite" :disabled="!editable || !overwrite"/>
              </span>
            </label>
            <div class="col-md-10">
              <NbFilterMultiSelection :filter="filter" @change="search" :disabled="!editable"/>

            </div>
          </div>

          <div class="form-group" v-for="filter in filters"
               v-if="filter.type === FilterType.HTTP_SELECTION && filter.visible">
            <label class="col-md-2 control-label pt5">
              {{filter.name}}
              <span v-if="showOverwriteSwitcher">
                <NbSwitcher size="sm" v-model="filter.overwrite" :disabled="!editable || !overwrite"/>
              </span>
            </label>
            <div class="col-md-10">
              <NbFilterHttpSelection :filter="filter" @change="search" :disabled="!editable"/>
            </div>
          </div>



          <div class="form-group" v-for="filter in filters"
               v-if="filter.type === FilterType.DATE_TIME_SELECTION && filter.visible">
            <label class="col-md-2 control-label pt5">
              {{filter.name}}
              <span v-if="showOverwriteSwitcher">
                <NbSwitcher size="sm" v-model="filter.overwrite" :disabled="!editable || !overwrite"/>
              </span>
            </label>
            <div class="col-md-10">
              <NbFilterDateTime :filter="filter" @change="search" :disabled="!editable"/>
            </div>
          </div>

          <div class="form-group" v-if="showOverwriteSwitcher">
            <div class="italic p20">提示：每个选项后面的开关表示是否允许用户通过传递参数来改变这项值。如排序的开关打开，表示用户可以自己指定该页面中列表的排序方式。</div>
          </div>

          <div class="text-right" v-if="showSearchBtn">
            <button class="btn btn-sm btn-primary" @click.stop.prevent="search">
              <i class="fa fa-search"></i>
              搜索
            </button>
          </div>

        </div>
      </div>
    </NbExpanding>
  </div>

</template>

<script>

  import NbExpanding from '../NbExpanding'
  import NbSwitcher from '../NbSwitcher'
  import NbFilterSort from "./NbFilterSort";
  import NbFilterCheck from "./NbFilterCheck";
  import NbFilterDateTime from "./NbFilterDateTime.vue";
  import NbFilterSelection from "./NbFilterSelection";
  import NbFilterMultiSelection from "./NbFilterMultiSelection";
  import NbFilterHttpSelection from "./NbFilterHttpSelection";
  import {FilterType} from "../../model/base/FilterType";

  export default {
    data() {
      return {
        FilterType,
        show: false
      }
    },
    components: {
      NbExpanding,
      NbSwitcher,
      NbFilterSort,
      NbFilterCheck,
      NbFilterDateTime,
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
      },
      //是否直接将NbExpanding的内容展开
      showFilter: {
        type: Boolean,
        required: false
      },
      //是否显示“打开筛选/关闭筛选”的按钮(在配置专题页面搜索项时管用。)
      showTrigger: {
        type: Boolean,
        required: false,
        "default": true
      },
      //暴露给父组件来控制筛选框。
      showPanel: {
        type: Boolean,
        required: false,
        "default": false
      },
      //是否显示“搜索”按钮(在配置专题页面搜索项时管用。)
      showSearchBtn: {
        type: Boolean,
        required: false,
        "default": true
      },
      //是否显示可覆盖的开关(在配置专题页面搜索项时管用。)
      showOverwriteSwitcher: {
        type: Boolean,
        required: false,
        "default": false
      },
      //是否可编辑的状态(在配置专题页面时管用。)
      editable: {
        type: Boolean,
        required: false,
        "default": true
      },
      //是否可以自定义其中的overwrite属性
      overwrite: {
        type: Boolean,
        required: false,
        "default": true
      }
    },
    computed: {

      hasSortType() {
        for (let i = 0; i < this.filters.length; i++) {
          let filter = this.filters[i];
          if (filter.type === FilterType.SORT && filter.visible) {
            return true;
          }
        }
        return false;
      },
      hasCheckType() {
        for (let i = 0; i < this.filters.length; i++) {
          let filter = this.filters[i];
          if (filter.type === FilterType.CHECK && filter.visible) {
            return true;
          }

        }
        return false;
      }

    },
    watch: {
      "overwrite"(newVal, oldVal) {
        if (!newVal) {
          for (let i = 0; i < this.filters.length; i++) {
            let filter = this.filters[i];
            filter.overwrite = false
          }
        }
      },
      "showPanel"(newVal, oldVal) {
        this.show = newVal
      }
    },
    methods: {
      search() {
        this.$emit("change")
      }
    },
    mounted() {
      if (this.showFilter) {
        this.show = true
      }
    }
  }
</script>

<template>
  <div>

    <div>
      <Multiselect v-model="selectedOptions"
                   tag-placeholder="选择用户"
                   placeholder="搜索或选择用户"
                   selectedLabel="已选"
                   deselectLabel="点击移除"
                   selectLabel="点击选择"
                   label="username"
                   track-by="uuid"
                   @search-change="inputChange"
                   @select="select"
                   :loading="pager.loading"
                   :internal-search="false"
                   :hide-selected="true"
                   :options="options"
                   :multiple="true"
                   :max="1"
      >

				<span class="italic" slot="maxElements">
					最多只能选择1项
				</span>
        <span class="italic" slot="noResult">
					没有符合条件的条目
				</span>
      </Multiselect>
    </div>

  </div>
</template>
<script>
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import Pager from '../../../common/model/base/Pager'
  import User from '../../../common/model/user/User'

  export default {
    data() {
      return {
        selectedOptions: [],
        options: [],
        pager: new Pager(User, 20)
      }
    },
    props: {
      activeItem: {
        type: User,
        required: true
      },
      initFilter: {
        type: Object,
        required: false
      }
    },
    watch: {
      "selectedOptions"(newVal, oldVal) {
        if (this.selectedOptions) {
          if (this.selectedOptions.length > 0) {
            for (let i = 0; i < this.options.length; i++) {
              if (this.options[i].uuid === this.selectedOptions[0].uuid) {
                this.activeItem.render(this.options[i])
              }
            }

          } else {
            this.activeItem.render(new User())
          }
        }
      },
      "activeItem.uuid"(newVal, oldVal) {
        let that = this
        if (newVal) {
          if (this.activeItem.username) {
            //inner change
          } else {
            //outer change.

            this.activeItem.httpDetail(function () {
              that.selectedOptions.push(that.activeItem)
            })
          }
        }


      }

    },
    methods: {

      refresh() {
        let that = this;
        this.pager.httpFastPage(function () {
          let list = that.pager.getList();
          if (list && list.length > 0) {
            that.options.splice(0, that.options.length);
            list.forEach(item => {
              that.options.push(item);
            })
          }
        });
      },
      inputChange(value, id) {
        this.pager.setFilterValue("username", value);
        this.refresh();
      },
      select(selectedOption, id) {
      }
    },
    components: {
      Multiselect
    },
    created() {

    },
    mounted() {
      if (this.initFilter) {
        for (let key in this.initFilter) {
          this.pager.setFilterValue(key, this.initFilter[key]);
        }
      }

    }

  }

</script>
<style></style>

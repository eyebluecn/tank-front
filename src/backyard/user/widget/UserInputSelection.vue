<template>
  <div>

    <div>
      <Multiselect v-model="users"
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
        users: [],
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
      "users"(newVal, oldVal) {
        console.log("oldValue => ", oldVal, "newValue => ", newVal)
        if (this.users) {
          /*console.log(this.users[0])*/
          if (this.users.length > 0) {

            this.activeItem.render(this.users[0])
            /*console.log(this.activeItem)*/
          } else {
            this.activeItem.render(new User())
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
      //用tags的元素去装填users
      fillUsers() {

        if (this.users[0] && this.users[0].uuid === this.activeItem.uuid) {
          //Event from inner.

        } else {

          //Event from outer

          //清空users
          this.users.splice(0, this.users.length);
          //把tags中所有的item追加过来
          if (this.activeItem.uuid) {
            this.users.push(this.activeItem)
          }

        }
      },
      inputChange(value, id) {
        this.pager.setFilterValue("username", value);
        this.refresh();
      },
      select(selectedOption, id) {
        console.log("selectedOption:")
        console.log(selectedOption)
      }
    },
    components: {
      Multiselect
    },
    created() {

    },
    mounted() {
      /*this.fillUsers();*/
      if (this.initFilter) {
        for (let key in this.initFilter) {
          this.pager.setFilterValue(key, this.initFilter[key]);
        }
      }

    }

  }

</script>
<style></style>

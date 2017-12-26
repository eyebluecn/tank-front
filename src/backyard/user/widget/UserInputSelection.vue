<template>
	<div>

		<div v-if="!pager.loading">
			<Multiselect v-model="innerTags"
			             tag-placeholder="选择用户"
			             placeholder="搜索或选择用户"
			             selectedLabel="已选"
			             deselectLabel="点击移除"
			             selectLabel="点击选择"
			             label="username"
			             track-by="uuid"
			             :options="options"
			             :custom-label="customLabel"
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
		<div v-if="pager.loading">
			<i class="fa fa-spinner fa-spin fa-fw"></i>
		</div>

	</div>
</template>
<script>
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import Pager from '../../../common/model/base/Pager'
  import User from '../../../common/model/user/User'

  export default {
    model: {
      prop: 'tag',
      event: 'option'
    },
    data () {
      return {
        innerTags: [],
        options: [],
        pager: new Pager(User, 20)/*,
        isLoading: false*/
      }
    },
    props: {
      /*initUser: {
        type: User,
        required: true
      }*/
      tag: {
        type: User,
        "default": null
      },
      initFilter: {
        type: Object,
        required: false
      }
    },
    watch: {
      "innerTags"(newVal, oldVal){
        if (this.innerTags) {
          if (this.innerTags.length > 0) {
            this.$emit('option', this.innerTags[0]);
          } else {
            this.$emit('option', null);
          }
        }
      },
      "tag"(newVal, oldVal){
        this.fillInnerTags();
      }

    },
    methods: {

      refresh(){
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
      //用tags的元素去装填innerTags
      fillInnerTags(){
        if (this.innerTags[0] === this.tag) {
          //Event from inner.

        } else {
          //Event from outer

          //清空innerTags
          this.innerTags.splice(0, this.innerTags.length);
          //把tags中所有的item追加过来

          if (this.tag) {
            this.innerTags.push(this.tag)
          }

        }
      },

      customLabel ({username}) {
        return `${username}`
      },
      asyncFind (value) {
        let that = this
        this.isLoading = true
        this.pager.setFilterValue('username', value)
        this.pager.httpFastPage(function (response) {
          that.userList = that.pager.data
          that.isLoading = false

        })
      }
    },
    components: {
      Multiselect
    },
    created () {
      /*let that = this
      if(this.initUser){
        this.selectedUser.uuid = this.initUser.uuid
        this.selectedUser.httpDetail(function (response) {
          console.log(that.selectedUser)
        })
      }*/
    },
    mounted () {
      this.fillInnerTags();
      if (this.initFilter) {
        for (let key in this.initFilter) {
          this.pager.setFilterValue(key, this.initFilter[key]);
        }
      }
      this.refresh();
    }

  }

</script>
<style></style>

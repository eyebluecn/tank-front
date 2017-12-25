<template>

	<el-select v-model="userUuidValue" class="w300" clearable placeholder="请选择用户">
		<el-option
			v-for="item in selection"
			:key="item.uuid"
			:label="item.username"
			:value="item.uuid">
		</el-option>
		<template>
			<div>
				<NbPager :pager="pager" :callback="refresh"/>
			</div>
		</template>
	</el-select>


</template>
<script>
  import Pager from '../../../common/model/base/Pager'
  import NbPager from '../../../common/widget/NbPager.vue'
  import User from '../../../common/model/user/User'

  export default {
    data () {
      return {
        pager: new Pager(User, 5),
	      userUuidValue: '',
	      selection: []
      }
    },
	  props:{
      initFilter: {
        type: Object,
        required: false
      },
		  initUser: {
        type: User,
			  required: false
		  }
	  },
	  watch:{
      'userUuidValue'(newVal,oldVal){
        this.$emit('currentUserChange',newVal)
      }
	  },
	  methods:{
      refresh(searchCallback){
        let that = this
	      this.pager.httpFastPage(function () {
		      that.selection = that.pager.data
		      typeof searchCallback === 'function' && searchCallback()
        })
      }
	  },
	  components:{
      NbPager
	  },
	  mounted(){
      let that = this
      if(this.initFilter){
        for (let key in this.initFilter) {
          this.pager.setFilterValue(key, this.initFilter[key]);
        }
      }
      this.refresh(function () {
        if(that.initUser){

          /*for(let i = 0; i < that.selection.length; i++){
						if(i.uuid === that.initUser.uuid){
              that.userUuidValue = that.initUser.uuid
							return
						}
          }*/

          that.userUuidValue = that.initUser.uuid

        }
      })

	  }
  }

</script>
<style lang="less" rel="stylesheet/less">

</style>

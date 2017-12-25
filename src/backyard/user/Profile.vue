<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-md-12">

        <div class="pedia-navigation">
          <span class="item active">用户详情</span>
        </div>

      </div>
    </div>

    <!--编辑，权限设置-->
    <div class="text-right mb10">
      <router-link class="btn btn-primary btn-sm" :to="'/user/edit/'+ user.uuid">
        <i class="fa fa-pencil"></i>
        编辑用户
      </router-link>
    </div>

    <div class="row">
      <div class="col-md-12">
        <LoadingFrame :loading="user.detailLoading">
          <div class="row">
            <div class="col-md-12">
              用户名：{{user.username}}
              邮箱：{{user.email}}
            </div>
          </div>
        </LoadingFrame>
      </div>

    </div>

  </div>
</template>
<script>
  import {MessageBox, Notification as NotificationBox} from 'element-ui'
  import User from '../../common/model/user/User'
  import NbSlidePanel from '../../common/widget/NbSlidePanel.vue'
  import NbExpanding from '../../common/widget/NbExpanding.vue'
  import NbBtnDropdown from "../../common/widget/NbBtnDropdown.vue";
  import LoadingFrame from "../widget/LoadingFrame";
  import CreateSaveButton from "../widget/CreateSaveButton.vue"

  export default {

    data() {
      return {
        user: new User()
      }
    },
    components: {},
    computed: {},
    methods: {
      fetchDetail() {
        let that = this;
        this.user.uuid = this.$store.state.route.params.uuid;
        if (this.user.uuid) {
          this.user.httpDetail();
        }
      }
    },
    mounted() {
      this.fetchDetail();
    }
  }
</script>

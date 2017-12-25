<template>
  <div class="backyard-matter-list">
    <div class="row">

      <div class="col-md-12">

        <div>
          <NbFilter :pager="pager" :callback="search"></NbFilter>
        </div>
        <div v-for="matter in pager.data">
          <MatterPanel @goToDirectory="goToDirectory" :matter="matter"/>
        </div>

        <div>
          <NbPager :pager="pager" :callback="refresh"/>
        </div>
      </div>


    </div>

  </div>
</template>
<script>
  import Vue from 'vue'
  import NbTank from '../../common/widget/NbTank.vue'
  import MatterPanel from "./widget/MatterPanel";

  import NbSlidePanel from '../../common/widget/NbSlidePanel.vue'
  import NbExpanding from '../../common/widget/NbExpanding.vue'
  import NbCheckbox from '../../common/widget/NbCheckbox.vue'
  import NbFilter from '../../common/widget/filter/NbFilter'
  import NbPager from '../../common/widget/NbPager'


  import Tank from '../../common/model/tank/Tank'
  import {Message, MessageBox, Notification} from 'element-ui'
  import Matter from '../../common/model/matter/Matter'
  import $ from 'jquery'
  import Pager from '../../common/model/base/Pager'
  import User from '../../common/model/user/User'

  export default {
    data() {
      return {
        pager: new Pager(Matter, 50),
        user: this.$store.state.user
      }
    },
    components: {
      NbCheckbox,
      MatterPanel,
      NbFilter,
      NbPager,
      NbTank,
      NbSlidePanel,
      NbExpanding
    },
    methods: {
      reset() {
        this.pager.page = 0;
        this.pager.resetFilter();
        this.pager.enableHistory();
      },
      search() {
        this.pager.page = 0;
        this.refresh()
      },
      refresh() {
        this.pager.httpFastPage();
      },
      goToDirectory(uuid) {
        this.pager.setFilterValue("puuid", uuid)
        this.search()

      }
    },
    watch: {},
    created() {

    },
    mounted() {

      let that = this
      this.pager.enableHistory();
      this.pager.setFilterValue("puuid", "root")
      this.refresh();

    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../assets/css/global/variables";

  .backyard-matter-list {

  }
</style>

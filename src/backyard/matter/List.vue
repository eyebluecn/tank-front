<template>
  <div class="backyard-matter-list">
    <div class="row">

      <div class="col-md-12">

        <div>
          <NbFilter :pager="pager" :callback="search">
            <button class="btn btn-sm btn-primary" @click.stop.prevent="createDirectory">
              <i class="fa fa-plus"></i>
              创建文件夹
            </button>
          </NbFilter>
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
        //当前文件夹信息。
        matter: new Matter(),
        pager: new Pager(Matter, 50),
        user: this.$store.state.user,
        breadcrumbs: this.$store.state.breadcrumbs
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

        //刷新面包屑
        this.refreshBreadcrumbs()

        this.pager.httpFastPage();
      },
      goToDirectory(uuid) {
        this.pager.setFilterValue("puuid", uuid)
        this.search()
        this.refreshBreadcrumbs()
      },
      refreshBreadcrumbs() {

        let that = this

        let uuid = that.pager.getFilterValue("puuid")


        //根目录简单处理即可。
        if (!uuid || uuid === "root") {
          that.breadcrumbs.splice(0, that.breadcrumbs.length);
          that.breadcrumbs.push({
            title: '全部文件'
          })

        } else {

          this.matter.uuid = uuid
          this.matter.httpDetail(function () {

            let arr = []
            let cur = that.matter.parent
            while (cur) {
              arr.push(cur)
              cur = cur.parent;
            }

            that.breadcrumbs.splice(0, that.breadcrumbs.length);
            let query = that.pager.getParams()
            query["puuid"] = "root"
            //添加一个随机数，防止watch $route失败
            query["_t"] = new Date().getTime()
            that.breadcrumbs.push({
              title: '全部文件',
              path: '/matter/list',
              query: query
            })

            for (let i = arr.length - 1; i >= 0; i--) {
              let m = arr[i]
              let query = that.pager.getParams()
              query["puuid"] = m.uuid
              query["_t"] = new Date().getTime()
              that.breadcrumbs.push({
                title: m.name,
                path: '/matter/list',
                query: query
              })
            }

            //第一个文件
            that.breadcrumbs.push({
              title: that.matter.name
            })
          })
        }
      },
      createDirectory() {
        let newMatter = new Matter()
        newMatter.name = '新建文件夹'
        newMatter.dir = true
        newMatter.editMode = true
        this.pager.data.unshift(newMatter)
        setTimeout(function () {

        }, 100)
      }
    },
    watch: {
      '$route'(newVal, oldVal) {

        let puuid = this.$route.query.puuid
        if (puuid) {
          this.pager.setFilterValue("puuid", puuid)
        } else {
          this.pager.setFilterValue("puuid", "root")
        }

        this.refresh()


      }
    },
    created() {

    },
    mounted() {

      let that = this
      this.pager.enableHistory();

      let puuid = this.$route.query.puuid
      if (puuid) {
        this.pager.setFilterValue("puuid", puuid)
      } else {
        this.pager.setFilterValue("puuid", "root")
      }

      this.refresh();


    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../assets/css/global/variables";

  .backyard-matter-list {

  }
</style>

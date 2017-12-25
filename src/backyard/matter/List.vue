<template>
  <div class="backyard-matter-list">
    <div class="row">

      <div class="col-md-12">

        <div>
          <NbFilter :pager="pager" :callback="search">

            <span class="btn btn-primary btn-sm btn-file">
              <slot name="button">
                <i class="fa fa-plus"></i>
                <span>上传文件</span>
              </slot>
              <input ref="refFile" type="file" @change.prevent.stop="triggerUpload"/>
				</span>

            <button class="btn btn-sm btn-primary" @click.stop.prevent="createDirectory">
              <i class="fa fa-plus"></i>
              创建文件夹
            </button>
          </NbFilter>
        </div>

        <div v-for="m in uploadMatters">
          <UploadMatterPanel :matter="m"/>
        </div>

        <div v-if="director.createMode">
          <MatterPanel ref="newMatterPanel" @createDirectorySuccess="refresh()" :matter="newMatter"
                       :director="director"/>
        </div>
        <div v-for="matter in pager.data">
          <MatterPanel @goToDirectory="goToDirectory" @deleteSuccess="refresh()" :matter="matter" :director="director"/>
        </div>

        <div>
          <NbPager :pager="pager" :callback="refresh" emptyHint="该目录下暂无任何内容"/>
        </div>
      </div>


    </div>

  </div>
</template>
<script>
  import MatterPanel from "./widget/MatterPanel";
  import UploadMatterPanel from "./widget/UploadMatterPanel";

  import NbSlidePanel from '../../common/widget/NbSlidePanel.vue'
  import NbExpanding from '../../common/widget/NbExpanding.vue'
  import NbCheckbox from '../../common/widget/NbCheckbox.vue'
  import NbFilter from '../../common/widget/filter/NbFilter'
  import NbPager from '../../common/widget/NbPager'
  import Matter from '../../common/model/matter/Matter'
  import Pager from '../../common/model/base/Pager'
  import Director from "./widget/Director";


  export default {
    data() {
      return {
        //当前文件夹信息。
        matter: new Matter(),
        //准备新建的文件。
        newMatter: new Matter(),
        //准备上传的一系列文件
        uploadMatters: [],
        pager: new Pager(Matter, 50),
        user: this.$store.state.user,
        breadcrumbs: this.$store.state.breadcrumbs,
        director: new Director()
      }
    },
    components: {
      NbCheckbox,
      MatterPanel,
      UploadMatterPanel,
      NbFilter,
      NbPager,
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

          this.matter.uuid = "root"
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
              path: '/',
              query: query
            })

            for (let i = arr.length - 1; i >= 0; i--) {
              let m = arr[i]
              let query = that.pager.getParams()
              query["puuid"] = m.uuid
              query["_t"] = new Date().getTime()
              that.breadcrumbs.push({
                title: m.name,
                path: '/',
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
        let that = this
        that.newMatter.name = '新建文件夹'
        that.newMatter.dir = true
        that.newMatter.editMode = true
        that.newMatter.puuid = that.matter.uuid
        if (!that.newMatter.puuid) {
          that.newMatter.puuid = "root"
        }
        that.newMatter.userUuid = that.user.uuid
        that.director.createMode = true

        setTimeout(function () {
          that.$refs.newMatterPanel.highLight()
        }, 100)
      },
      triggerUpload() {
        let that = this

        let m = new Matter()
        m.dir = false
        m.puuid = that.matter.uuid
        m.userUuid = that.user.uuid

        let value = that.$refs['refFile'].value
        if (!value) {
          return
        }
        m.file = that.$refs['refFile'].files[0]

        m.httpUpload(function () {
          that.refresh()
        })

        that.uploadMatters.push(m)

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

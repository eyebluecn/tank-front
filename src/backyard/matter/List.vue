<template>
  <div class="backyard-matter-list">
    <div class="row">

      <div class="col-md-12">

        <div>
          <NbFilter :pager="pager" :callback="search">

            <button class="btn btn-primary btn-sm" v-if="temporaryMatterUuids.length !== pager.data.length"
                    @click.stop.prevent="checkAll">
              <i class="fa fa-check-square"></i>
              全选
            </button>
            <button class="btn btn-primary btn-sm"
                    v-if="pager.data.length && temporaryMatterUuids.length === pager.data.length"
                    @click.stop.prevent="checkNone">
              <i class="fa fa-square-o"></i>
              取消全选
            </button>
            <button class="btn btn-primary btn-sm" v-if="temporaryMatterUuids.length" @click.stop.prevent="deleteBatch">
              <i class="fa fa-trash"></i>
              删除
            </button>
            <button class="btn btn-primary btn-sm" v-if="temporaryMatterUuids.length"
                    @click.stop.prevent="moveBatch($createElement)">
              <i class="fa fa-arrows"></i>
              移动
            </button>

            <span class="btn btn-primary btn-sm btn-file">
              <slot name="button">
                <i class="fa fa-cloud-upload"></i>
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
          <MatterPanel @goToDirectory="goToDirectory" @deleteSuccess="refresh()" :matter="matter" :director="director"
                       @checkMatter="checkMatter"/>
        </div>

        <div>
          <NbPager :pager="pager" :callback="refresh" emptyHint="该目录下暂无任何内容"/>
        </div>
      </div>


    </div>

  </div>
</template>
<script>
  import MatterPanel from './widget/MatterPanel'
  import UploadMatterPanel from './widget/UploadMatterPanel'
  import MoveBatchPanel from './widget/MoveBatchPanel'
  import NbSlidePanel from '../../common/widget/NbSlidePanel.vue'
  import NbExpanding from '../../common/widget/NbExpanding.vue'
  import NbCheckbox from '../../common/widget/NbCheckbox.vue'
  import NbFilter from '../../common/widget/filter/NbFilter'
  import NbPager from '../../common/widget/NbPager'
  import Matter from '../../common/model/matter/Matter'
  import Pager from '../../common/model/base/Pager'
  import Director from './widget/Director'
  import {Message, MessageBox, Notification} from 'element-ui'

  export default {
    data() {
      return {
        //当前文件夹信息。
        matter: new Matter(),
        //准备新建的文件。
        newMatter: new Matter(),
        //目标文件夹，用于移动操作
        targetMatter: new Matter(),
        //准备上传的一系列文件
        uploadMatters: [],
        //临时暂存区，用于文件的相关操作
        temporaryMatterUuids: [],
        pager: new Pager(Matter, 50),
        user: this.$store.state.user,
        breadcrumbs: this.$store.state.breadcrumbs,
        director: new Director()

      }
    },
    components: {
      MatterPanel,
      UploadMatterPanel,
      MoveBatchPanel,
      NbCheckbox,
      NbFilter,
      NbPager,
      NbSlidePanel,
      NbExpanding
    },
    methods: {
      reset() {
        this.pager.page = 0
        this.pager.resetFilter()
        this.pager.enableHistory()
      },
      search() {
        this.pager.page = 0
        this.refresh()
      },
      refresh() {

        //刷新面包屑
        this.refreshBreadcrumbs()

        this.pager.httpFastPage()
      },
      goToDirectory(uuid) {
        this.pager.setFilterValue('puuid', uuid)
        this.search()
        this.refreshBreadcrumbs()
      },
      refreshBreadcrumbs() {

        let that = this

        //清空暂存区
        this.temporaryMatterUuids.splice(0, this.temporaryMatterUuids.length)

        let uuid = that.pager.getFilterValue('puuid')

        //根目录简单处理即可。
        if (!uuid || uuid === 'root') {

          this.matter.uuid = 'root'
          that.breadcrumbs.splice(0, that.breadcrumbs.length)
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
              cur = cur.parent
            }

            that.breadcrumbs.splice(0, that.breadcrumbs.length)
            let query = that.pager.getParams()
            query['puuid'] = 'root'
            //添加一个随机数，防止watch $route失败
            query['_t'] = new Date().getTime()
            that.breadcrumbs.push({
              title: '全部文件',
              path: '/',
              query: query
            })

            for (let i = arr.length - 1; i >= 0; i--) {
              let m = arr[i]
              let query = that.pager.getParams()
              query['puuid'] = m.uuid
              query['_t'] = new Date().getTime()
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
          that.newMatter.puuid = 'root'
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


        //指定为当前选择的用户。
        //如果没有设置用户的话，那么默认显示当前登录用户的资料
        if (!that.pager.getFilterValue('userUuid')) {
          m.userUuid = that.user.uuid
        } else {
          m.userUuid = that.pager.getFilterValue('userUuid')
        }


        let value = that.$refs['refFile'].value
        if (!value) {
          return
        }
        m.file = that.$refs['refFile'].files[0]

        m.httpUpload(function () {
          that.refresh()
        })

        that.uploadMatters.push(m)

      },

      //全选
      checkAll() {
        this.pager.data.forEach(function (i, index) {
          i.check = true
        })
      },
      //取消全选
      checkNone() {
        this.pager.data.forEach(function (i, index) {
          i.check = false
        })
      },
      //选择文件时放入暂存区等待操作
      checkMatter(val) {
        if (val.checkStatus && this.temporaryMatterUuids.indexOf(val.matterUuid) === -1) {
          this.temporaryMatterUuids.push(val.matterUuid)
        } else if (!val.checkStatus && this.temporaryMatterUuids.indexOf(val.matterUuid) !== -1) {
          let index = this.temporaryMatterUuids.indexOf(val.matterUuid)
          this.temporaryMatterUuids.splice(index, 1)
        }
        return true
      },
      //批量删除
      deleteBatch() {
        let that = this
        MessageBox.confirm('此操作将永久删除这些文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              let uuids = that.temporaryMatterUuids.join(',')
              that.matter.httpDeleteBatch(uuids, function (response) {
                Message.success('删除成功！')
                that.refresh()
              })
            }

          }
        })
      },
      //批量移动
      moveBatch(createElement) {
        let that = this
        let newMatter = new Matter()
        let dom = createElement(MoveBatchPanel, {
          props: {
            targetMatter: this.targetMatter
          }
        })

        MessageBox({
          title: '移动到',
          message: dom,
          customClass: 'wp50',
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonText: '关闭',
          callback: (action, instance) => {
            if (action === 'confirm') {
              let uuids = that.temporaryMatterUuids.join(',')
              that.matter.httpMove(uuids, this.targetMatter.uuid, function (response) {
                Message.success('移动成功！')
                that.targetMatter.render(new Matter())
                that.refresh()
              })
            }
          }
        })
      }
    },
    watch: {
      '$route'(newVal, oldVal) {

        let puuid = this.$route.query.puuid
        if (puuid) {
          this.pager.setFilterValue('puuid', puuid)
        } else {
          this.pager.setFilterValue('puuid', 'root')
        }

        this.refresh()

      }

    },
    created() {
      /*初始化inputSelection*/
      if (this.user.role === 'ADMINISTRATOR') {
        this.pager.getFilter('userUuid').visible = true
      } else {
        this.pager.setFilterValue('userUuid', this.user.uuid)
      }
    },
    mounted() {

      let that = this
      this.pager.enableHistory()

      let puuid = this.$route.query.puuid
      if (puuid) {
        this.pager.setFilterValue('puuid', puuid)
      } else {
        this.pager.setFilterValue('puuid', 'root')
      }


      //如果所有的排序都没有设置，那么默认以时间降序。
      if (!this.pager.getFilterValue('orderDir') && !this.pager.getFilterValue('orderCreateTime') && !this.pager.getFilterValue('orderSize') && !this.pager.getFilterValue('orderName')) {
        this.pager.setFilterValue('orderCreateTime', 'DESC')
      }

      //如果没有设置用户的话，那么默认显示当前登录用户的资料
      if (!this.pager.getFilterValue('userUuid')) {
        this.pager.setFilterValue('userUuid', this.user.uuid)
      }

      this.refresh()

    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../assets/css/global/variables";

  .backyard-matter-list {

  }
</style>

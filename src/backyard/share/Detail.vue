<template>
  <div class="share-detail">

    <div class="share-block">
      <div class="upper">
        <div class="left-box">
          <img class="share-icon" :src="share.getIcon()"/>
          <span class="name">{{share.name}}</span>
        </div>
        <div class="right-box">

          <button class="btn btn-danger btn-sm">
            <i class="fa fa-ban"></i>
            取消分享
          </button>
          <button class="btn btn-primary btn-sm">
            <i class="fa fa-link"></i>
            下载链接
          </button>
        </div>
      </div>
      <div class="share-info">

        <span class="inline-block mr10">
          分享者：{{share.username}}
        </span>
        <span class="inline-block mr10">
          创建时间：{{share.createTime | simpleDateHourMinute}}
        </span>
        <span class="inline-block mr10" v-if="!share.expireInfinity">
          失效时间：{{share.expireTime | simpleDateHourMinute}}
        </span>
        <span class="inline-block mr10" v-if="share.expireInfinity">
          永久有效
        </span>

      </div>
    </div>

    <div class="breadcrumb" v-if="breadcrumbs && breadcrumbs.length">
      <a href="javascript:void(0)"
         @click.stop.prevent="goToDirectory(null)">全部文件</a>
      <span v-for="matter in breadcrumbs">
          <span>/</span>
          <a href="javascript:void(0)" @click.stop.prevent="goToDirectory(matter)">{{matter.name}}</a>
        </span>
    </div>

    <div v-for="matter in pager.data">
      <ShareMatterPanel
        :matter="matter"
        @goToDirectory="goToDirectory"
      />
    </div>

    <div class="mt20">
      <NbPager :pager="pager" :callback="refresh" emptyHint="该目录下暂无任何内容"/>
    </div>

  </div>
</template>

<script>

  import Share from "../../common/model/share/Share";
  import ShareMatterPanel from "../matter/widget/ShareMatterPanel"
  import Matter from "../../common/model/matter/Matter";
  import Pager from "../../common/model/base/Pager";
  import NbPager from "../../common/widget/NbPager";
  import {SortDirection} from "../../common/model/base/SortDirection";

  export default {
    data() {
      return {
        breadcrumbs: [],
        share: new Share(),
        pager: new Pager(Matter, 50),
        preference: this.$store.state.preference
      }
    },
    computed: {},
    watch: {
      '$route'(newVal, oldVal) {

        this.refresh()
      }

    },
    methods: {
      goToDirectory(dirMatter) {

        //如果dirMatter不存在，那么当成回到分享详情页处理
        if (dirMatter) {
          let puuid = this.$route.query.puuid

          this.pager.setFilterValue('puuid', dirMatter.uuid)
          this.pager.page = 0
          let query = this.pager.getParams()

          //如果当前是跟，那么shareRootUuid就是这个matter的uuid
          if (!puuid || puuid === Matter.MATTER_ROOT) {
            query["shareRootUuid"] = dirMatter.uuid
          }


          //采用router去管理路由，否则浏览器的回退按钮出现意想不到的问题。
          this.$router.push({
            path: this.$route.path,
            query: query
          })
        } else {

          //采用router去管理路由，否则浏览器的回退按钮出现意想不到的问题。
          this.$router.push({
            path: this.$route.path,
            query: {}
          })
        }


      },
      refresh() {

        let that = this
        let puuid = this.$route.query.puuid
        let shareRootUuid = this.$route.query.shareRootUuid

        //根目录从分享中获取
        if (!puuid) {
          puuid = Matter.MATTER_ROOT
        }
        if (!shareRootUuid) {
          shareRootUuid = null
        }
        that.share.httpBrowse(puuid, shareRootUuid, function (response) {

          //如果是寻根之旅，那么直接赋值到pager.
          if (!puuid || puuid === Matter.MATTER_ROOT) {
            that.pager.page = 0
            that.pager.pageSize = 50
            that.pager.totalItems = that.share.matters.length
            that.pager.data.splice(0, that.pager.data.length)
            that.pager.data.push(...that.share.matters)

          }

          //刷新面包屑
          that.refreshBreadcrumbs()

        })

        if (puuid && puuid !== Matter.MATTER_ROOT) {
          this.pager.setFilterValue('puuid', puuid)
          this.pager.setFilterValue('shareUuid', that.share.uuid)
          this.pager.setFilterValue('shareCode', that.share.code)
          this.pager.setFilterValue('shareRootUuid', shareRootUuid)

          //如果所有的排序都没有设置，那么默认以时间降序。
          this.pager.setFilterValue('orderCreateTime', SortDirection.DESC)
          this.pager.setFilterValue("orderDir", SortDirection.DESC)

          this.pager.httpFastPage()
        }

      },
      refreshBreadcrumbs() {
        let that = this

        //清空
        that.breadcrumbs.splice(0, that.breadcrumbs.length)

        let pMatter = this.share.dirMatter
        while (pMatter && pMatter.uuid) {
          that.breadcrumbs.splice(0, 0, pMatter)
          pMatter = pMatter.parent
        }

      }
    },
    components: {
      ShareMatterPanel,
      NbPager
    },
    mounted() {
      let that = this;

      this.share.uuid = this.$store.state.route.params.uuid

      this.pager.enableHistory()

      this.refresh()

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .share-detail {

    .share-block {
      background-color: white;
      padding: 30px 10px 20px 10px;

      .upper {

        //宽屏flex布局
        display: block;
        @media (min-width: 992px) {
          display: flex;
          justify-content: space-between;
        }

        .left-box {
          margin-bottom: 15px;
          display: block;
          @media (min-width: 992px) {
            display: flex;
            justify-content: space-between;
            align-content: center;
          }

          .share-icon {
            width: 30px;
            height: 30px;
          }

          .name {
            font-size: 18px;
            margin-left: 10px;
            line-height: 30px;
          }
        }
      }

      .share-info {
        margin-top: 5px;
      }


    }

    .breadcrumb {
      padding: 10px;
      border-top: 1px solid #eee;

    }

  }
</style>

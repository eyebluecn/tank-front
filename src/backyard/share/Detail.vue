<template>
  <div class="share-detail">

    <LoadingFrame :loading="share.detailLoading && needShareCode">
      <div v-if="!needShareCode">
        <div class="share-block">
          <div class="upper">
            <div class="left-box">
              <img class="share-icon" :src="share.getIcon()"/>
              <span class="name">
                {{share.name}}
                <span class="text-danger" v-if="share.hasExpired()">{{$t('share.expired')}}</span>
              </span>
            </div>
            <div class="right-box">

              <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="downloadZip">
                <i class="fa fa-download"></i>
                {{$t('download')}}
              </button>

              <button class="btn btn-danger btn-sm mr5" @click.stop.prevent="cancelShare"
                      v-if="user.uuid && user.uuid === share.userUuid">
                <i class="fa fa-ban"></i>
                {{$t('share.cancelShare')}}
              </button>

              <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="shareDialogVisible = true"
                      v-if="user.uuid && user.uuid === share.userUuid">
                <i class="fa fa-link"></i>
                {{$t('share.getLink')}}
              </button>
              <el-dialog
                :title="$t('share.shareDetail')"
                :visible.sync="shareDialogVisible"
                :append-to-body="true">
                <ShareDialogPanel :share="share"/>
                <span slot="footer" class="dialog-footer">
                <button class="btn btn-primary btn-sm mr5" @click="share.copyLinkAndCode()">{{$t('share.copyLinkAndCode')}}</button>
                <button class="btn btn-default btn-sm mr5" @click="shareDialogVisible = false">{{$t('close')}}</button>
              </span>
              </el-dialog>

            </div>
          </div>
          <div class="share-info">

        <span class="inline-block mr10">
          {{$t('share.sharer')}}:{{share.username}}
        </span>
            <span class="inline-block mr10">
          {{$t('createTime')}}:{{share.createTime | simpleDateHourMinute}}
        </span>
            <span class="inline-block mr10" v-if="!share.expireInfinity">
          {{$t('share.expireTime')}}:{{share.expireTime | simpleDateHourMinute}}
        </span>
            <span class="inline-block mr10" v-if="share.expireInfinity">
          {{$t('share.noExpire')}}
        </span>

          </div>
        </div>

        <div class="breadcrumb" v-if="breadcrumbs && breadcrumbs.length">
          <a href="javascript:void(0)"
             @click.stop.prevent="goToDirectory(null)">{{$t('share.allFiles')}}</a>
          <span v-for="(matter,index) in breadcrumbs">
          <span>/</span>
          <a v-if="index<breadcrumbs.length-1" href="javascript:void(0)" @click.stop.prevent="goToDirectory(matter)">{{matter.name}} </a>
          <span v-if="index===breadcrumbs.length-1">{{matter.name}}</span>
        </span>
        </div>

        <div v-for="matter in pager.data">
          <ShareMatterBar
            :matter="matter"
            :share="share"
            @goToDirectory="goToDirectory"
          />
        </div>

        <div class="mt20">
          <NbPager :pager="pager" :callback="refresh" :emptyHint="$t('share.noContent')"/>
        </div>
      </div>

      <div v-if="needShareCode" class="col-md-4 col-md-offset-4 mt100">
        <div class="input-group">
          <input type="text" class="form-control" :placeholder="$t('share.enterCode')" v-model="share.code"
                 @keyup.enter="refresh">
          <span class="input-group-btn">
          <button type="button" class="btn btn-primary" @click.stop.prevent="refresh">
            {{$t('share.getFiles')}}
          </button>
        </span>
        </div>
      </div>
    </LoadingFrame>

  </div>
</template>

<script>

  import Share from "../../common/model/share/Share";
  import ShareMatterBar from "./widget/ShareMatterBar"
  import Matter from "../../common/model/matter/Matter";
  import Pager from "../../common/model/base/Pager";
  import NbPager from "../../common/widget/NbPager";
  import {SortDirection} from "../../common/model/base/SortDirection";
  import {Message, MessageBox} from 'element-ui'
  import ShareDialogPanel from "./widget/ShareDialogPanel"
  import LoadingFrame from "../widget/LoadingFrame";
  import {ResultCode} from "../../common/model/base/ResultCode";

  export default {
    data() {
      return {
        needShareCode: true,
        shareDialogVisible: false,
        breadcrumbs: [],
        share: new Share(),
        pager: new Pager(Matter, 50),
        user: this.$store.state.user,
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

          //share.rootUuid 一旦设置好了，只要根文件夹不换，那么就一直不会变。
          if (!puuid || puuid === Matter.MATTER_ROOT) {
            this.share.rootUuid = dirMatter.uuid
            this.pager.clear()
          }

          //采用router去管理路由
          this.$router.push({
            path: this.$route.path,
            query: query
          })

        } else {

          this.share.rootUuid = Matter.MATTER_ROOT
          this.pager.clear()


          //采用router去管理路由
          this.$router.push({
            path: this.$route.path,
            query: {}
          })
        }


      },
      refreshPager() {

        let that = this
        let puuid = this.$route.query.puuid

        //只有当鉴权通过，并且不是分享首页时需要去进行page请求。
        if (!that.needShareCode && puuid && puuid !== Matter.MATTER_ROOT) {

          this.pager.setFilterValue('puuid', puuid)
          this.pager.setFilterValue('shareUuid', that.share.uuid)
          this.pager.setFilterValue('shareCode', that.share.code)
          this.pager.setFilterValue('shareRootUuid', that.share.rootUuid)

          //如果所有的排序都没有设置，那么默认以时间降序。
          this.pager.setFilterValue('orderCreateTime', SortDirection.DESC)
          this.pager.setFilterValue("orderDir", SortDirection.DESC)

          this.pager.httpFastPage()
        }

      },
      refresh() {

        let that = this
        let puuid = this.$route.query.puuid

        if (!puuid) {
          puuid = Matter.MATTER_ROOT
        }

        that.share.httpBrowse(puuid, that.share.rootUuid, function (response) {

          //如果是寻根之旅，那么直接赋值到pager.
          if (puuid === Matter.MATTER_ROOT) {
            that.pager.page = 0
            that.pager.pageSize = 50
            that.pager.totalItems = that.share.matters.length
            that.pager.data.splice(0, that.pager.data.length)
            that.pager.data.push(...that.share.matters)
          }

          //刷新面包屑
          that.refreshBreadcrumbs()


          if (that.needShareCode) {
            that.needShareCode = false
            that.refreshPager()
          }

        }, function (errorMessage, response) {

          if (response.data.code === ResultCode.NEED_SHARE_CODE) {
            that.needShareCode = true
            that.$message.warning(that.$t('share.enterCode'))
          } else if (response.data.code === ResultCode.SHARE_CODE_ERROR) {
            that.needShareCode = true
            that.$message.error(that.$t('share.codeError'))
          } else {
            that.$message.error(errorMessage)
          }

        })


        that.refreshPager()

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

      },
      cancelShare() {
        let that = this
        MessageBox.confirm(that.$t('share.cancelPrompt'), that.$t('prompt'), {
          confirmButtonText: that.$t("confirm"),
          cancelButtonText: that.$t("cancel"),
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              that.share.httpDelete(function (response) {
                Message.success(that.$t('operationSuccess'))
                that.$router.push("/share/list")

              })
            }

          }
        })

      },
      downloadZip() {
        let puuid = this.$route.query.puuid

        if (!puuid) {
          puuid = Matter.MATTER_ROOT
        }

        this.share.downloadZip(puuid)

      }
    },
    components: {
      LoadingFrame,
      ShareDialogPanel,
      ShareMatterBar,
      NbPager
    },
    mounted() {
      let that = this;

      this.share.uuid = this.$store.state.route.params.uuid
      //如果query中有rootUuid那么就更新.
      if (this.$route.query.shareRootUuid) {
        this.share.rootUuid = this.$route.query.shareRootUuid
      }

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

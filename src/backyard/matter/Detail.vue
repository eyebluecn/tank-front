<template>
  <div class="matter-detail">
    <div class="matter-block">
      <div class="title">
        {{$t('matter.fileInfo')}}
      </div>
      <div class="row">
        <div class="col-md-12 form-info">
          <span>{{$t('matter.fileInfo')}}: </span>
          <span class="bold">{{matter.name}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>{{$t('matter.path')}}: </span>
          <span class="matter-breadcrumb">
            <span v-for="m in parentList">
              <span>/</span>
							<router-link v-if="m.dir" :to="'/?puuid='+m.uuid">
                {{m.name}}
              </router-link>
              <span v-else>
                {{m.name}}
              </span>
            </span>
          </span>

          <a class="mr15" :title="$t('matter.path')"
             @click.stop.prevent="copyPath">
            <i class="fa fa-copy"></i>
          </a>
        </div>
        <div class="col-md-12 form-info" v-if="!matter.dir">
          <span>{{$t('matter.size')}}: </span>
          <span class="bold">{{matter.size | humanFileSize}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>{{$t('matter.createTime')}}: </span>
          <span class="bold">{{matter.createTime | simpleDateTime}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>{{$t('matter.updateTime')}}: </span>
          <span class="bold">{{matter.updateTime | simpleDateTime}}</span>
        </div>
        <div class="col-md-12 form-info" v-if="!matter.dir">
          <span>{{$t('matter.publicOrPrivate')}}: </span>
          <span>{{matter.privacy?$t('matter.privateInfo'):$t('matter.publicInfo')}}</span>
        </div>
        <div class="col-md-12 form-info" v-if="!matter.dir">
          <span>{{$t('matter.downloadTimes')}}: </span>
          <span>{{matter.times}}</span>
        </div>
        <div class="col-md-12 form-info" v-if="!matter.dir">
          <span>{{$t('matter.operations')}}: </span>
          <span>
            <a class="mr15" :title="$t('matter.download')" @click.stop.prevent="matter.download()" v-if="!matter.dir">
              <i class="fa fa-download"></i>
              {{$t('matter.download')}}
            </a>
            <a class="mr15" :title="$t('matter.preview')" @click.stop.prevent="matter.preview()" v-if="!matter.dir">
              <i class="fa fa-eye"></i>
              {{$t('matter.preview')}}
            </a>
            <a class="mr15" :title="$t('matter.oneTimeLinkInfo')"
               @click.stop.prevent="copyLink" v-if="!matter.dir && matter.privacy">
              <i class="fa fa-link"></i>
              {{$t('matter.oneTimeLink')}}
            </a>
            <a class="mr15" :title="$t('matter.publicInfo')"
               @click.stop.prevent="copyLink" v-if="!matter.dir && !matter.privacy">
              <i class="fa fa-link"></i>
              {{$t('matter.copyLink')}}
            </a>

          </span>
        </div>

      </div>
    </div>

    <div class="matter-block" v-if="!matter.dir && matter.uuid && matter.isImage()">
      <div class="title">
        {{$t('matter.imageCache')}}
      </div>
      <div class="ph5">
        <ImageCacheList :initFilter="{matterUuid:matter.uuid}"/>
      </div>
    </div>


  </div>
</template>

<script>
  import Matter from "../../common/model/matter/Matter";
  import ImageCacheList from "../image/cache/widget/ImageCacheList"
  import DownloadToken from "../../common/model/download/token/DownloadToken";
  import {Message} from "element-ui"

  export default {
    data() {
      return {
        matter: new Matter(),
        //复制只能是同步进行，因此提前获取downloadToken
        downloadToken: new DownloadToken(),
        preference: this.$store.state.preference
      }
    },
    computed: {
      parentList() {
        let that = this
        let arr = []
        let item = that.matter;
        while (item) {
          arr.unshift(item)
          item = item.parent
        }

        return arr;
      }
    },
    methods: {
      copyLink() {
        let that = this;

        if (that.matter.privacy) {

          let textToCopy = that.matter.getDownloadUrl(that.downloadToken.uuid);

          that.$copyPlguin.copy(textToCopy, function () {
            Message.success({
              message: that.$t('operationSuccess'),
              center: true
            })
          })
        } else {
          let textToCopy = that.matter.getDownloadUrl();

          that.$copyPlguin.copy(textToCopy, function () {
            Message.success({
              message: that.$t('operationSuccess'),
              center: true
            })
          })
        }

      },

      copyPath() {
        let that = this;

        let textToCopy = that.matter.path;

        that.$copyPlguin.copy(textToCopy, function () {
          Message.success({
            message: that.$t('operationSuccess'),
            center: true
          })
        })
      }
    },
    components: {
      ImageCacheList
    },
    mounted() {
      let that = this;
      this.matter.uuid = this.$store.state.route.params.uuid
      if (this.matter.uuid) {
        this.matter.httpDetail(function () {

          if (!that.matter.dir) {
            that.downloadToken.httpFetchDownloadToken(that.matter.uuid)
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .matter-detail {

    .matter-block {
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, .2);
      border-radius: 5px;
      padding: 20px 15px 10px 15px;
      margin-bottom: 30px;

      .title {
        font-size: 16px;
        padding: 0 0 15px 0;
        color: black;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
      }

      .matter-breadcrumb {
        a {
          font-weight: normal;
        }
      }
    }

  }
</style>

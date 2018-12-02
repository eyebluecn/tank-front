<template>
  <div class="matter-detail">
    <div class="pedia-navigation">
      <span class="item active">文件详情</span>
    </div>

    <div class="matter-block">
      <div class="title">
        文件基本信息
      </div>
      <div class="row">
        <div class="col-md-12 form-info">
          <span>文件名：</span>
          <span class="bold">{{matter.name}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>文件路径：</span>
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
        </div>
        <div class="col-md-12 form-info">
          <span>大小：</span>
          <span class="bold">{{matter.size | humanFileSize}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>创建日期：</span>
          <span class="bold">{{matter.createTime | simpleDateTime}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>修改日期：</span>
          <span class="bold">{{matter.updateTime | simpleDateTime}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>系统文件：</span>
          <span>{{matter.alien?'是':'否'}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>文件公开性：</span>
          <span>{{matter.privacy?'私有文件，只有自己或者授权的用户可以下载':'公有文件，任何人可以通过链接下载'}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>下载次数：</span>
          <span>{{matter.times}}</span>
        </div>
        <div class="col-md-12 form-info">
          <span>操作：</span>
          <span>
            <a class="mr15" title="下载" @click.stop.prevent="matter.download()" v-if="!matter.dir">
              <i class="fa fa-download"></i>
              下载
            </a>
            <a title="预览" @click.stop.prevent="matter.preview()" v-if="!matter.dir">
              <i class="fa fa-eye"></i>
              预览
            </a>

          </span>
        </div>

      </div>
    </div>

    <div class="matter-block" v-if="matter.uuid && matter.isImage()">
      <div class="title">
        图片缓存
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

  export default {
    data() {
      return {
        matter: new Matter(),
        preference: this.$store.state.preference
      }
    },
    computed: {
      parentList() {
        let that = this
        let arr = []
        let item = that.matter;
        console.log("这里1", item)
        while (item) {
          arr.unshift(item)
          item = item.parent
        }

        console.log(arr)
        return arr;
      }
    },
    methods: {},
    components: {
      ImageCacheList
    },
    mounted() {
      let that = this;
      this.matter.uuid = this.$store.state.route.params.uuid
      if (this.matter.uuid) {
        this.matter.httpDetail(function () {
          console.log(that.matter)
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

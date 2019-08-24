<template>
  <div class="nb-matter-image">

    <div class="tiny-block">
      <div class="p10 mb10 bg-white br5 border" :style="'width:'+previewWidth+'px'" v-show="preview && value">
        <img class="wp100 cursor" :src="value" @click="$photoSwipePlugin.showPhoto(value)"/>
      </div>
    </div>

    <div>
      <div class="input-group">
        <input type="text"
               class="form-control input-sm"
               v-model="value"
               v-if="manual"
               :placeholder="$t('matter.fillInPicLink')">

        <span class="form-control input-sm btn-file text-center pt3 pb0" v-show="!manual">
          <slot name="button">
            <i class="fa fa-cloud-upload"></i>
            <span>{{value?$t('matter.rePick'):$t('matter.chooseImage')}}</span>
          </slot>
          <input ref="refFile" type="file" @change.prevent.stop="triggerUpload"/>
        </span>

        <span class="input-group-btn">
          <button class="btn btn-primary btn-sm mr5" @click.stop.prevent="manual = !manual">
        <i class="fa fa-pencil" v-if="!manual"></i>
        <i class="fa fa-cloud-upload" v-if="manual"></i>
        <span>{{manual?$t('matter.uploadMode'):$t('matter.fillMode')}}</span>
      </button>
          </span>
      </div>

      <div class="italic" v-if="uploadHint">
        {{uploadHint}}
      </div>
    </div>
    <div>
      <UploadMatterPanel :matter="matter"/>
    </div>

  </div>
</template>
<script>
  import Matter from '../../../model/matter/Matter'
  import UploadMatterPanel from "./UploadMatterPanel"
  import {humanFileSize} from "../../../common/filter/str";

  export default {
    data() {
      return {
        manual: false,
        user: this.$store.state.user,
        matter: new Matter()
      }
    },
    components: {
      UploadMatterPanel
    },
    props: {
      preview: {
        //上传的照片是否需要预览
        type: Boolean,
        required: false,
        'default': true
      },
      previewWidth: {
        type: Number,
        required: false,
        'default': 200
      },
      //图片的url.
      value: {
        type: String | null,
        required: true
      },
      //filter.
      filter: {
        type: String,
        required: false,
        "default": "image"
      },
      uploadHint: {
        type: String,
        required: false,
        "default": ""
      }
    },
    methods: {
      del() {
        let that = this
        that.matter.clear()
      },
      triggerUpload() {
        let that = this

        let matter = that.matter;
        matter.puuid = "root"
        matter.uploadHint = that.uploadHint
        matter.filter = that.filter
        matter.privacy = false

        matter.dir = false
        matter.alien = true
        matter.userUuid = that.user.uuid

        let value = that.$refs['refFile'].value
        if (!value) {
          return
        }
        matter.file = that.$refs['refFile'].files[0]


        //判断文件大小。
        if (that.user.sizeLimit >= 0) {
          if (matter.file.size > that.user.sizeLimit) {
            that.$message.error(this.$t('matter.sizeExceedLimit', humanFileSize(matter.file.size), humanFileSize(that.user.sizeLimit)))
            return;
          }
        }


        matter.httpUpload(function () {

          that.$emit("input", matter.getPreviewUrl())

        })


      }
    },
    created() {
    },
    mounted() {

    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  .nb-matter-image {

  }
</style>

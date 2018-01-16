<template>
  <div class="nb-matter-image">

    <div class="tiny-block">
      <div class="p10 mb10 bg-white br5 border" :style="'width:'+previewWidth+'px'" v-show="preview && value">
        <img class="wp100" :src="value"/>
      </div>
    </div>

    <div>

      <span class="btn btn-primary btn-sm btn-file">
          <slot name="button">
            <i class="fa fa-cloud-upload"></i>
            <span>{{value?'重新上传':'上传图片'}}</span>
          </slot>
          <input ref="refFile" type="file" @change.prevent.stop="triggerUpload"/>
        </span>
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
  import Matter from '../../../common/model/matter/Matter'
  import UploadMatterPanel from "./UploadMatterPanel"



  export default {
    data() {
      return {
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
      maxSize: {
        type: Number,
        required: false,
        "default": 1024 * 1024
      },
      uploadHint: {
        type: String,
        required: false,
        "default": "图片最大不超过1M"
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
        matter.maxSize = that.maxSize
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

        matter.httpUpload(function () {

          that.$emit("input", matter.getDownloadUrl())

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

<template>
  <div class="nb-matter-image">

    <div class="tiny-block">
      <div class="w200 p10 mb10 bg-white br5 border" v-show="preview && value">
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
    </div>
    <div>
      <UploadMatterPanel :matter="matter"/>

    </div>


  </div>
</template>
<script>
  import Matter from '../../../common/model/matter/Matter'
  import NbExpanding from "../../../common/widget/NbExpanding"
  import UploadMatterPanel from "./UploadMatterPanel"
  import Vue from "vue"
  import $ from "jquery"
  import Director from "./Director";
  import {Message, MessageBox, Notification} from 'element-ui'
  import {setInputSelection} from "../../../common/util/Utils";


  export default {
    data() {
      return {
        user: this.$store.state.user,
        matter: new Matter()
      }
    },
    components: {
      UploadMatterPanel,
      NbExpanding
    },
    props: {
      preview: {
        //上传的照片是否需要预览
        type: Boolean,
        required: false,
        'default': true
      },
      //图片的url.
      value: {
        type: String | null,
        required: true
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
        matter.maxSize = 1024 * 1024
        matter.uploadHint = "图片最大不超过1M"
        matter.filter = "image"

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

          console.log("发射：")
          console.log(matter.getDownloadUrl())

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

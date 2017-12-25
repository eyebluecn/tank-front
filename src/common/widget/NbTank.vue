<template>
  <div class="nb-tank-block">
    <NbExpanding>
      <div v-show="edit && tank.procedure === tank.Procedure.FREE && !tank.exist()">
        <div>
				<span class="btn btn-primary btn-sm btn-file">
					<slot name="button">
						<i class="fa fa-folder-open-o"></i>
						<span>选择文件</span>
					</slot>
					<input ref="refFile" type="file" name="avatar" @change.prevent.stop="fileChanged"/>
				</span>
        </div>
        <div class="mt5 italic" v-if="!tank.errorMessage && tank.uploadHint">
          <i class="fa fa-info-circle"></i> {{tank.uploadHint}}
        </div>
        <div class="mt5 " v-if="tank.errorMessage">
          <i class="fa fa-warning text-danger"></i> <span class="text-danger">{{tank.errorMessage}}</span>
        </div>
      </div>
    </NbExpanding>


    <NbExpanding>
      <div v-show="tank.procedure === tank.Procedure.FETCHING_UPLOAD_TOKEN">
        <i class="fa fa-spinner fa-spin fa-fw"></i> 准备上传中...
      </div>
    </NbExpanding>

    <NbExpanding>
      <div class="huge-block clearfix"
           v-if="tank.procedure === tank.Procedure.UPLOADING">
        <div class="media">
          <div class="pull-right">
            <i class="btn-action f16 fa fa-trash text-danger" @click.stop.prevent="del()"></i>
          </div>
          <div class="media-body">{{tank.file.name}}</div>
        </div>
        <div class="progress" :class="{'progress-striped active' : tank.procedure === tank.Procedure.UPLOADING}">
          <div :style="'width: '+(tank.progress*100)+'%'" class="progress-bar progress-bar-primary">
            <span>已上传 {{(tank.progress * 100).toFixed(1)}}%</span>
          </div>
        </div>
        <div>
          已上传:{{ (tank.file.size * tank.progress).toFixed(0) | humanFileSize }}/{{ tank.file.size | humanFileSize}}
          速度:{{tank.speed | humanFileSize}}/s

        </div>
      </div>
    </NbExpanding>

    <NbExpanding>
      <div class="tiny-block"
           v-if="tank.exist()">
        <div class="w200 p10 mb10 bg-white br5 border" v-show="preview && tank.publicImgUrl()">
          <img class="wp100" :src="tank.publicImgUrl()"/>
        </div>
        <div>
          <i class="f16" v-show="tank.fileIcon() && !tank.publicImgUrl()" :class="[tank.fileIcon()]"></i>
          <span class="f14 black cursor hover-underline" @click.stop.prevent="tank.download()">
					{{tank.name}}
				</span>
          <span>
					{{tank.size | humanFileSize}}
				</span>
          <span>
					<i class="btn-action f16 fa fa-download text-success" @click.stop.prevent="tank.download()"></i>
				</span>
          <span v-if="edit">
					<i class="btn-action f16 fa fa-trash text-danger" @click.stop.prevent="del()"></i>
				</span>

        </div>
      </div>
    </NbExpanding>

  </div>
</template>

<script>

  import {startWith, endWith, getExtension, containStr} from '../../common/filter/str'
  import Tank from '../../common/model/tank/Tank'
  import $ from 'jquery'
  import {MessageBox, Notification} from 'element-ui'
  import NbExpanding from './NbExpanding.vue'

  export default {
    data() {
      return {}
    },
    props: {
      //上传的照片是否需要预览
      preview: {
        type: Boolean,
        required: false,
        'default': true
      },
      //当前是否是编辑状态（编辑状态可以上传，非编辑状态只能下载）
      edit: {
        type: Boolean,
        required: false,
        'default': true
      },
      tank: {
        type: Tank,
        required: true
      },
      uploadSuccessCallback: {
        type: Function,
        required: false
      }

    },
    components: {
      NbExpanding
    },
    computed: {},
    methods: {
      fileChanged() {
        let that = this

        let value = that.$refs['refFile'].value
        if (!value) {
          return
        }

        this.tank.file = this.$refs['refFile'].files[0]

        this.tank.httpUpload(function (response) {

          if (typeof that.uploadSuccessCallback === 'function') {
            that.uploadSuccessCallback(that.tank)
          }

        }, function () {
          console.error('上传失败啦')

          that.clear()
        })
      },
      del() {
        let that = this
        MessageBox.confirm('是否删除此文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
            that.clear()
          },
          function () {
          }
        )
      },
      clear() {
        let that = this
        that.tank.clear()
        that.$refs['refFile'].value = ''
      }
    },
    mounted() {


    }
  }
</script>


<style lang="less" rel="stylesheet/less">

  .nb-tank-block {

    .huge-block {
      background-color: white;
      border-radius: 5px;
      padding: 10px;
      border: 1px solid #eeeeee;

      .progress {
        margin-bottom: 10px;
      }

      .media {
        margin-bottom: 5px;
        .media-body {
          cursor: pointer;
          color: #555;
          font-size: 15px;
          font-weight: bold;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

    }

  }


</style>

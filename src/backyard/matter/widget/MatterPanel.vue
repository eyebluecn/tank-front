<template>
  <div class="widget-matter-panel">

    <div @click.stop.prevent="clickRow">

      <div class="media">

        <div class="pull-left">
          <div class="left-part">
            <span class="basic-span">
            <NbCheckbox v-model="matter.check"/>
            </span>
            <span class="basic-span">
              <img class="matter-icon" :src="matter.getIcon()"/>
            </span>
          </div>
        </div>

        <!--在大屏下的操作栏-->
        <div class="pull-right hidden-sm hidden-xs">
          <div class="right-part" v-if="matter.uuid">

            <span class="matter-operation">

              <i class="fa fa-lock btn-action text-primary" v-if="!matter.dir && matter.privacy" title="设置为公有文件"
                 @click.stop.prevent="matter.httpChangePrivacy(false)"></i>
              <i class="fa fa-unlock btn-action text-primary" v-if="!matter.dir && !matter.privacy" title="设置为私有文件"
                 @click.stop.prevent="matter.httpChangePrivacy(true)"></i>

              <i class="fa fa-pencil btn-action text-primary" title="重命名" @click.stop.prevent="prepareRename"></i>
              <i class="fa fa-link btn-action text-primary" title="复制下载链接" v-if="!matter.dir"
                 @click.stop.prevent="clipboard"></i>
              <i class="fa fa-download btn-action text-primary" title="下载" v-if="!matter.dir"
                 @click.stop.prevent="download"></i>

              <i class="fa fa-trash btn-action text-danger" title="删除" @click.stop.prevent="deleteMatter"></i>
            </span>
            <span class="matter-size" v-if="matter.dir">
              -
            </span>
            <span class="matter-size" v-else>
              {{matter.size | humanFileSize}}
            </span>

            <span class="matter-date">
              {{matter.updateTime | simpleDateHourMinute}}
            </span>

          </div>
        </div>

        <!--在小屏幕下的操作栏-->
        <div class="pull-right hidden-lg hidden-md">
          <span class="more-btn" @click.stop.prevent="showMore = !showMore">
            <i class="fa fa-ellipsis-h btn-action" title="重命名"></i>
          </span>
        </div>

        <div class="media-body">

          <div class="middle-part">

            <span class="matter-name-edit" v-if="matter.editMode">
              <input ref="editInput" class="form-control"
                     :class="matter.uuid"
                     v-model="renameMatterName"
                     placeholder="请输入名称"
                     @blur="blurTrigger()"
                     v-on:keyup.13="enterTrigger()"/>
            </span>
            <span class="matter-name" :class="{'alien':matter.alien}" v-else>
              {{matter.name}} <i class="fa fa-unlock" v-if="!matter.dir && !matter.privacy" title="公有文件，任何人可以访问"></i>
            </span>

          </div>
        </div>
      </div>

    </div>

    <NbExpanding>
      <div class="hidden-lg hidden-md more-panel" v-if="showMore">
        <div class="cell-btn" style="border: none">
          <span>
            {{matter.updateTime | simpleDateHourMinute}}
          </span>

          <span v-if="!matter.dir">
              {{matter.size | humanFileSize}}
          </span>
        </div>

        <div class="cell-btn" v-if="!matter.dir && matter.privacy" title="设置为公有文件"
             @click.stop.prevent="matter.httpChangePrivacy(false)">
          <i class="fa fa-lock"></i>
          设置为公有文件
        </div>

        <div class="cell-btn" v-if="!matter.dir && !matter.privacy" title="设置为私有文件"
             @click.stop.prevent="matter.httpChangePrivacy(true)">
          <i class="fa fa-unlock"></i>
          设置为私有文件
        </div>

        <div class="cell-btn" title="重命名" @click.stop.prevent="prepareRename">
          <i class="fa fa-pencil"></i>
          重命名
        </div>

        <div class="cell-btn" title="复制下载链接" v-if="!matter.dir"
             @click.stop.prevent="clipboard">
          <i class="fa fa-link"></i>
          复制下载链接
        </div>


        <div class="cell-btn" title="下载" v-if="!matter.dir"
             @click.stop.prevent="download">
          <i class="fa fa-download"></i>
          下载
        </div>

        <div class="cell-btn text-danger" title="删除" @click.stop.prevent="deleteMatter">
          <i class="fa fa-trash"></i>
          删除
        </div>

      </div>
    </NbExpanding>

  </div>

</template>
<script>
  import Matter from '../../../common/model/matter/Matter'
  import NbCheckbox from '../../../common/widget/NbCheckbox'
  import NbExpanding from '../../../common/widget/NbExpanding'
  import $ from 'jquery'
  import Director from './Director'
  import {Message, MessageBox, Notification} from 'element-ui'
  import {currentHost, setInputSelection} from '../../../common/util/Utils'

  export default {
    data() {
      return {
        //正在向服务器提交rename的请求
        renamingLoading: false,
        showMore: false,
        //正在重命名的临时字段
        renameMatterName: null
      }
    },
    components: {
      NbExpanding,
      NbCheckbox
    },
    props: {
      matter: {
        type: Matter,
        required: true
      },
      director: {
        type: Director,
        required: true
      }
    },
    watch: {
      'matter.check'(newVal, oldVal) {
        this.$emit('checkMatter', this.matter)
      }
    },
    methods: {
      clickRow() {
        let that = this

        if (this.director.isEditing()) {
          console.error('导演正忙着，不予执行')
          return
        }

        if (this.matter.dir) {
          this.$emit('goToDirectory', that.matter.uuid)
        } else {
          //图片进行预览操作
          if (that.matter.isImage()) {
            that.$photoSwipePlugin.showPhoto(that.matter.getDownloadUrl())
          } else if (that.matter.isPdf()) {

            this.$previewer.previewPdf(that.matter.name, that.matter.getDownloadUrl(), that.matter.size)

          } else if (that.matter.isText()) {

            this.$previewer.previewText(that.matter.name, that.matter.getDownloadUrl(), that.matter.size)

          } else {
            this.download()
          }
        }
      },

      download() {
        if (this.director.isEditing()) {
          console.error('导演正忙着，不予执行')
          return
        }

        window.open(this.matter.getDownloadUrl())
      },
      deleteMatter() {
        let that = this
        MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              that.matter.httpDelete(function (response) {
                Message.success('删除成功！')
                that.$emit('deleteSuccess', that.matter)
              })
            }

          }
        })
      },
      prepareRename() {
        let that = this

        if (this.director.isEditing()) {
          console.error('导演正忙着，不予执行')
          return
        }
        //告诉导演，自己正在编辑
        this.director.renameMode = true
        this.matter.editMode = true
        this.renameMatterName = this.matter.name

        //稍作延迟，vue的组件才能加载出来
        setTimeout(function () {

          let dotIndex = that.matter.name.lastIndexOf('.')
          if (dotIndex === -1) {
            setInputSelection(that.$refs.editInput, 0, that.renameMatterName)
          } else {
            setInputSelection(that.$refs.editInput, 0, dotIndex)
          }

        }, 100)

      },
      finishRename() {
        let that = this
        //有可能按enter的时候和blur同时了。
        if (that.renamingLoading) {
          return
        }

        that.renamingLoading = true
        this.matter.httpRename(that.renameMatterName, function () {
          that.renamingLoading = false
          Message.success('重命名成功！')
          //告诉导演，自己编辑完毕
          that.director.renameMode = false
          that.matter.editMode = false

        }, function (errorMessage) {
          that.renamingLoading = false
          Message.error(errorMessage)
          //告诉导演，自己编辑完毕
          that.director.renameMode = false
          that.matter.editMode = false

        })

      },
      finishCreateDirectory() {
        let that = this
        that.matter.httpCreateDirectory(function () {
          that.director.createMode = false
          that.editMode = false

          that.matter.render(new Matter())

          that.$emit('createDirectorySuccess', that.matter)

        }, function (errorMessage) {
          that.director.createMode = false
          that.editMode = false
          Message.error(errorMessage)
        })
      },
      blurTrigger() {
        let that = this
        if (that.matter.editMode) {
          if (that.director.createMode) {
            that.finishCreateDirectory()
          } else if (that.director.renameMode) {
            that.finishRename()
          }
        }
      },
      enterTrigger() {
        $(this.$refs.editInput).blur()
      },
      highLight() {
        $(this.$refs.editInput).select()
      },
      clipboard() {

        let textToCopy = currentHost() + this.matter.getDownloadUrl();
        this.$copyPlguin.copy(textToCopy, function () {
          Message.success({
            message: "复制成功!",
            center: true
          })
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

  @import "../../../assets/css/global/variables";

  @base-height: 48px;
  @inner-cell-height: 36px;

  .basic-span {
    display: inline-block;
    vertical-align: middle;
    line-height: @base-height;
    margin-right: 5px;
  }

  .widget-matter-panel {

    border-top: 1px solid #eee;
    background-color: white;

    .media {
      > .pull-left {
        padding-right: 1px;
      }
    }

    .matter-icon {
      width: 24px;
    }

    .left-part {
      margin-left: 10px;
    }
    .middle-part {

      height: @base-height;
      overflow: hidden;

      .matter-name-edit {
        .basic-span;

        width: 90%;
        input {
          width: 100%;
          height: 26px;
          display: inline-block;
          padding: 6px;
        }
      }

      .matter-name {
        .basic-span;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .right-part {

      .matter-operation {
        .basic-span;
        display: none;
        i {
          font-size: 16px;
          margin-right: 5px;

          &:hover {

          }
        }
      }
      .matter-size {
        .basic-span;
        display: inline-block;
        width: 80px;
        text-align: left;
        margin-left: 20px;
      }
      .matter-date {
        .basic-span;
      }
    }

    .more-btn {
      display: inline-block;
      vertical-align: middle;
      line-height: @base-height;
      padding: 0 15px;
    }

    &:hover {
      background-color: aliceblue;
      cursor: pointer;

      .matter-operation {
        display: inline-block;
      }
    }

    .more-panel {
      border-top: 1px solid #eee;
      padding-left: 35px;
      .info {
      }
      .cell-btn {
        border-top: 1px solid #eee;
        line-height: @inner-cell-height;
        vertical-align: middle;
      }
    }
  }

</style>

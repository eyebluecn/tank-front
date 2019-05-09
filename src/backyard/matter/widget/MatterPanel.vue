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

              <i class="fa fa-lock btn-action text-primary" v-if="!matter.dir && matter.privacy"
                 :title="$t('matter.setPublic')"
                 @click.stop.prevent="matter.httpChangePrivacy(false)"></i>
              <i class="fa fa-unlock btn-action text-primary" v-if="!matter.dir && !matter.privacy"
                 :title="$t('matter.setPrivate')"
                 @click.stop.prevent="matter.httpChangePrivacy(true)"></i>

              <i class="fa fa-info-circle btn-action text-primary" :title="$t('matter.file')"
                 @click.stop.prevent="$router.push('/matter/detail/'+matter.uuid)"></i>

              <i class="fa fa-font btn-action text-primary" :title="$t('matter.rename')"
                 @click.stop.prevent="prepareRename"></i>
              <i class="fa fa-link btn-action text-primary" :title="$t('matter.copyLink')" v-if="!matter.dir"
                 @click.stop.prevent="clipboard"></i>
              <i class="fa fa-download btn-action text-primary" :title="$t('matter.download')"
                 @click.stop.prevent="matter.download()"></i>

              <i class="fa fa-trash btn-action text-danger" :title="$t('matter.delete')"
                 @click.stop.prevent="deleteMatter"></i>
            </span>
            <span class="matter-size">
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
            <i class="fa fa-ellipsis-h btn-action" :title="$t('matter.more')"></i>
          </span>
        </div>

        <div class="media-body">

          <div class="middle-part">

            <span class="matter-name-edit" v-if="matter.editMode">
              <input ref="editInput" class="form-control"
                     :class="matter.uuid"
                     v-model="renameMatterName"
                     :placeholder="$t('matter.enterName')"
                     @blur="blurTrigger()"
                     v-on:keyup.13="enterTrigger()"/>
              </span>
            <span class="matter-name"
                  :title="matter.name" v-else>
                {{matter.name}} <i class="fa fa-unlock" v-if="!matter.dir && !matter.privacy"
                                   :title="$t('matter.publicFileEveryoneCanVisit')"></i>
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

        <div class="cell-btn" v-if="!matter.dir && matter.privacy" :title="$t('matter.setPublic')"
             @click.stop.prevent="matter.httpChangePrivacy(false)">
          <i class="fa fa-lock"></i>
          {{$t('matter.setPublic')}}
        </div>

        <div class="cell-btn" v-if="!matter.dir && !matter.privacy" :title="$t('matter.setPrivate')"
             @click.stop.prevent="matter.httpChangePrivacy(true)">
          <i class="fa fa-unlock"></i>
          {{$t('matter.setPrivate')}}
        </div>

        <div class="cell-btn" :title="$t('matter.fileDetail')"
             @click.stop.prevent="$router.push('/matter/detail/'+matter.uuid)">
          <i class="fa fa-info-circle"></i>
          {{$t('matter.fileDetail')}}
        </div>

        <div class="cell-btn" :title="$t('matter.rename')" @click.stop.prevent="prepareRename">
          <i class="fa fa-pencil"></i>
          {{$t('matter.rename')}}
        </div>

        <div class="cell-btn" :title="$t('matter.copyLink')"
             @click.stop.prevent="clipboard">
          <i class="fa fa-link"></i>

          {{$t('matter.copyLink')}}
        </div>

        <div class="cell-btn" :title="$t('matter.download')"
             @click.stop.prevent="matter.download()">
          <i class="fa fa-download"></i>
          {{$t('matter.download')}}
        </div>

        <div class="cell-btn text-danger" :title="$t('matter.delete')" @click.stop.prevent="deleteMatter">
          <i class="fa fa-trash"></i>
          {{$t('matter.delete')}}
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
  import {Message, MessageBox} from 'element-ui'
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

            this.$emit("previewImage", that.matter)

          } else {
            that.matter.preview()
          }
        }
      },
      deleteMatter() {
        let that = this
        MessageBox.confirm(that.$t('actionCanNotRevertConfirm'), that.$t('prompt'), {
          confirmButtonText: that.$t("confirm"),
          cancelButtonText: that.$t("cancel"),
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              that.matter.httpDelete(function (response) {
                Message.success(that.$t('operationSuccess'))
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

          //如果是文件夹，全选中
          let dotIndex = that.matter.name.lastIndexOf('.')
          if (dotIndex === -1) {
            setInputSelection(that.$refs.editInput, 0, that.renameMatterName.length)
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
          Message.success(that.$t('operationSuccess'))
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
        that.matter.name = that.renameMatterName
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
        let that = this

        let textToCopy = this.matter.getDownloadUrl();
        this.$copyPlguin.copy(textToCopy, function () {
          Message.success({
            message: that.$t('operationSuccess'),
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

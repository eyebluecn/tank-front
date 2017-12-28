<template>
  <div class="widget-matter-panel clearfix" @click.stop.prevent="clickRow">
    <div class="left-part">
      <span>
        <NbCheckbox v-model="matter.check"/>
      </span>
      <span>
        <img class="matter-icon" :src="matter.getIcon()"/>
      </span>
      <span class="matter-name-edit" v-if="matter.editMode">

        <input ref="editInput" class="form-control"
               :class="matter.uuid"
               v-model="matter.name"
               placeholder="请输入名称"
               @blur="blurTrigger()"
               v-on:keyup.13="enterTrigger()"/>
      </span>
      <span class="matter-name" :class="{'alien':matter.alien}" v-else>
        {{matter.name}}
      </span>

    </div>
    <div class="right-part" v-if="matter.uuid">

      <span class="matter-operation">
        <i class="fa fa-pencil btn-action text-primary" title="重命名" @click.stop.prevent="prepareRename"></i>
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
        {{matter.modifyTime | simpleDateHourMinute}}
      </span>

    </div>


  </div>
</template>
<script>
  import Matter from '../../../common/model/matter/Matter'
  import NbCheckbox from '../../../common/widget/NbCheckbox'
  import Vue from 'vue'
  import $ from 'jquery'
  import Director from './Director'
  import {Message, MessageBox, Notification} from 'element-ui'
  import {setInputSelection} from '../../../common/util/Utils'

  export default {
    data() {
      return {
        //正在向服务器提交rename的请求
        renamingLoading: false
      }
    },
    components: {
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
        this.$emit('checkMatter', {matterUuid: this.matter.uuid, checkStatus: newVal})
      }
    },
    methods: {
      clickRow() {
        let that = this

        if (this.director.isEditing()) {
          console.log('导演正忙着，不予执行')
          return
        }

        if (this.matter.dir) {
          this.$emit('goToDirectory', that.matter.uuid)
        } else {
          this.download()
        }

      },
      download() {
        if (this.director.isEditing()) {
          console.log('导演正忙着，不予执行')
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
          console.log('导演正忙着，不予执行')
          return
        }
        //告诉导演，自己正在编辑
        this.director.renameMode = true
        this.matter.editMode = true

        setTimeout(function () {

          let dotIndex = that.matter.name.lastIndexOf('.')
          if (dotIndex === -1) {
            setInputSelection(that.$refs.editInput, 0, that.matter.name.length)
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
        this.matter.httpRename(function () {
          that.renamingLoading = false
          Message.info('重命名成功！')
          //告诉导演，自己编辑完毕
          that.director.renameMode = false
          that.matter.editMode = false

        }, function (response) {
          that.renamingLoading = false
          Message.error(response.data.msg)
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

          that.$emit('createDirectorySuccess', that.matter)

        }, function (response) {
          that.director.createMode = false
          that.editMode = false
          Message.error(response.data.msg)
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

  .widget-matter-panel {

    border-top: 1px solid #eee;
    background-color: white;

    @base-height: 48px;
    padding-left: 10px;

    .left-part, .right-part {
      height: @base-height;
      display: inline-block;
      > span {
        display: inline-block;
        vertical-align: middle;
        line-height: @base-height;
        margin-right: 10px;
      }
    }

    .left-part {

      .matter-icon {
        width: 24px;
      }
      .matter-name-edit {
        input {
          width: 200px;
          height: 26px;
          display: inline-block;
          padding: 6px;
        }
      }
      .matter-name {

        &.alien {
          color: @brand-primary;
        }
      }
    }
    .right-part {
      float: right;

      .matter-operation {
        visibility: hidden;
        i {
          font-size: 16px;
          margin-right: 5px;

          &:hover {

          }
        }
      }

      .matter-size {
        display: inline-block;
        width: 80px;
        text-align: left;
        margin-left: 20px;
      }
      .matter-date {

      }
    }

    &:hover {
      background-color: aliceblue;
      cursor: pointer;

      .matter-operation {
        visibility: visible;
      }
    }

  }
</style>

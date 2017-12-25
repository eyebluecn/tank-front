<template>
  <div class="widget-matter-panel clearfix" @click.stop.prevent="clickRow">
    <div class="left-part">
      <span>
        <NbCheckbox v-model="val"/>
      </span>
      <span>
        <img class="matter-icon" :src="matter.getIcon()"/>
      </span>
      <span class="matter-name-edit" v-if="matter.editMode">

        <input ref="editInput" class="form-control"
               :class="matter.uuid"
               v-model="matter.name"
               placeholder="请输入名称"
               @blur="finishRename()"
               v-on:keyup.13="finishRename()"/>

      </span>
      <span class="matter-name" v-else>
        {{matter.name}}
      </span>

    </div>
    <div class="right-part">

      <span class="matter-operation">
        <i class="fa fa-pencil btn-action text-primary" title="重命名" @click.stop.prevent="prepareRename"></i>
        <i class="fa fa-download btn-action text-primary" title="下载" v-if="!matter.dir"
           @click.stop.prevent="download"></i>
        <i class="fa fa-trash btn-action text-danger" title="删除"></i>
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
  import NbCheckbox from "../../../common/widget/NbCheckbox"
  import Vue from "vue"
  import $ from "jquery"

  export default {
    data() {
      return {
        val: false
      }
    },
    components: {
      NbCheckbox
    },
    props: {
      matter: {
        type: Matter,
        required: true
      }
    },
    methods: {
      clickRow() {
        let that = this
        if (this.matter.dir) {
          this.$emit("goToDirectory", that.matter.uuid)
        } else {
          this.download()
        }

      },
      download() {
        window.open(Vue.http.options.root + '/alien/download/' + this.matter.uuid + '/' + this.matter.name)
      },
      prepareRename() {
        let that = this
        this.matter.editMode = true
        setTimeout(function () {
          $(that.$refs.editInput).select()
        }, 100)

      },
      finishRename() {

      }
    },
    created() {
    },
    mounted() {

    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  .widget-matter-panel {

    border-top: 1px solid #eee;
    background-color: white;
    padding: 10px;

    .left-part {
      float: left;
      .matter-icon {
        width: 24px;
      }
      .matter-name-edit {
        margin-left: 5px;
        input {
          width: 200px;
          height: 26px;
          display: inline-block;
        }
      }
      .matter-name {
        margin-left: 5px;
      }
    }
    .right-part {
      float: right;
      margin-top: 4px;

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

<template>
  <div class="animated fadeIn">

    <div class="row">
      <div class="col-md-12">
        <div class="pedia-navigation">
          <span class="item active">自家轮子demo</span>
        </div>
      </div>
    </div>

    <div class="row mt10">
      <div class="col-md-12">
        <h3>
          NbTank演示：
        </h3>
      </div>
      <div class="col-md-12 mt15">
        <p>
          1.私有文件演示：
        </p>
      </div>
      <div class="col-md-12">
        <NbTank :tank="tank1"/>
      </div>

      <div class="col-md-12 mt15">
        <p>
          2.公有文件演示：
        </p>
      </div>
      <div class="col-md-12">
        <NbTank :tank="tank2"/>
      </div>


    </div>

  </div>
</template>

<script>

  import NbTank from "../../common/widget/NbTank.vue"
  import Tank from "../../common/model/tank/Tank";

  export default {
    data() {
      return {
        tank1: new Tank("image", true, 1024 * 1024, "请上传1M以内的图片"),
        tank2: new Tank("image", false, 1024 * 1024, "请上传1M以内的图片")
      }
    },
    props: {},
    watch: {},
    computed: {},
    components: {
      NbTank
    },
    methods: {},
    mounted() {

    }
  }

</script>

<style lang="less" rel="stylesheet/less">

</style>



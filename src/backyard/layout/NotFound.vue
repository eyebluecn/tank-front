<template>
  <div class="not-found">
    {{ $t('notFound') }}
  </div>
</template>
<script>

  export default {
    data() {
      return {}
    },
    computed: {},
    watch: {},
    components: {},
    methods: {}
  }
</script>


<style lang="less" rel="stylesheet/less">

  @import "../../assets/css/global/variables";

  .not-found {
    font-size: 32px;
  }

</style>

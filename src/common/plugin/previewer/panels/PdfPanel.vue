<template>

  <iframe width="100%" height="500" :src="url"></iframe>

</template>

<script>
  let nop = () => {
  };
  //这个组件主要用于提供dom元素。
  export default {
    data() {
      return {}
    },
    computed: {},
    props: {
      //寻找该用户的合适文件夹
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    watch: {},
    methods: {},
    mounted() {


    }
  }
</script>

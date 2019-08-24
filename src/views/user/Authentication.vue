<template>
  <div class="row animated fadeIn backyard-user-authentication">
    <div>{{$t('user.redirecting')}}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: this.$store.state.user
      }
    },
    props: {},
    watch: {},
    computed: {},
    components: {},
    methods: {},
    mounted() {
      let that = this
      let authentication = this.$store.state.route.params.authentication
      this.user.httpAuthenticationLogin(authentication, function (response) {
        //自动进入到首页。
        that.$router.push('/')
      })
    }
  }

</script>

<style lang="less" rel="stylesheet/less">
  .backyard-user-authentication {

  }
</style>



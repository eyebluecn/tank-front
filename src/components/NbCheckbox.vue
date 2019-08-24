<template>
  <div class="nb-check-checkbox">
    <input ref="check" type="checkbox" :value="val">
  </div>
</template>

<script>

  import $ from "jquery"
  import iCheck from "../common/fork/icheck/icheck-vue"
  //css
  //import "icheck/skins/square/green.css";
  //import "icheck/skins/flat/blue.css";
  import "../common/fork/icheck/blue.css";


  iCheck($);

  export default {
    data() {
      return {}
    },
    props: {
      value: {
        type: [String, Number, Boolean, Array],
        required: false,
        "default": false
      },
      val: {
        type: [String, Number, Boolean],
        required: false,
        "default": null
      }
    },
    computed: {
      $check() {
        return $(this.$refs.check);
      }
    },
    watch: {
      "value"() {
        this.refresh();
      },
      "val"() {
        this.refresh();
      }
    },
    methods: {
      refresh() {

        let state = "check";
        if (this.value instanceof Array) {
          if (this.value.indexOf(this.val) === -1) {
            state = "uncheck";
          } else {
            state = "check";
          }
        } else {
          state = this.value ? "check" : "uncheck";
        }
        this.$check.iCheck(state);

      }
    },
    mounted() {
      let that = this;
      this.$check.iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass: 'iradio_minimal-blue'
      });
      this.refresh();

      this.$check.on('ifChecked', function (event) {

        if (that.value instanceof Array) {
          if (that.value.indexOf(that.val) === -1) {
            that.value.push(that.val);
            that.$emit('input', that.value);
          }
        } else {
          that.$emit('input', true);
        }

      });

      this.$check.on('ifUnchecked', function (event) {
        if (that.value instanceof Array) {
          let index = that.value.indexOf(that.val);
          if (index !== -1) {
            that.value.splice(index, 1);
          }
          that.$emit('input', that.value);
        } else {
          that.$emit('input', false);
        }

      });


    }
  }

</script>

<style lang="less" rel="stylesheet/less">
  .nb-check-checkbox {
    display: inline-block;
    vertical-align: middle;
    margin: 0;
    padding: 0;
    width: 18px;
    line-height: 18px;
    border: none;
  }
</style>




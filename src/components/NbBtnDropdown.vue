<template>
	<div ref="dropdown" class="btn-group nb-btn-dropdown" :class="{'open':open,'align-right':alignRight}"
	     @mouseover="mouseOver" @mouseout="mouseOut" @click="toggle">
		<button :class="btnClass" @blur="loseFocus">
			{{name}}
			<span class="caret"></span>
		</button>
		<slot></slot>
	</div>
</template>

<script>

  import $ from "jquery";

  export default {
    data () {
      return {
        open: false,
        isInside: false
      }
    },
    props: {
      name: {
        type: String,
        required: false,
        "default"() {
          return ""
        }
      },
      size: {
        type: String,
        required: false,
        "default"() {
          return ""
        }
      },
      color: {
        type: String,
        required: false,
        "default"() {
          return "default"
        }
      },
      alignRight: {
        type: Boolean,
        required: false,
        "default"() {
          return false
        }
      }
    },
    computed: {
      btnClass(){
        let style = "dropdown-toggle btn";
        if (this.size === "sm" || this.size === "lg") {
          style += " btn-" + this.size;
        } else {
          style += " ";
        }

        if (this.color === "info" || this.color === "success" || this.color === "primary" ||
          this.color === "warning" || this.color === "danger" || this.color === "white" || this.color === "default"
        ) {
          style += " btn-" + this.color
        }

        return style;

      },
      $dropdown(){
        return $(this.$refs.dropdown);
      }
    },
    methods: {
      toggle(){
        this.open = !this.open;
      },
      loseFocus(){
        if (!this.isInside) {
          this.open = false;
        }
      },
      mouseOver(){
        this.isInside = true;
      },
      mouseOut(){
        this.isInside = false;
      }
    },
    mounted(){

      this.$dropdown.find("ul").addClass("dropdown-menu");

    }
  }
</script>

<style lang="less" rel="stylesheet/less">

	.nb-btn-dropdown {
		&.align-right {

			.dropdown-menu {
				left: auto;
				right: 0;
			}

		}
	}


</style>
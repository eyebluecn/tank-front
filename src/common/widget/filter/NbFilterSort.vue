<template>
  <span class="nb-sort" v-show="filter.visible">

    <span class="sort-main">
      <button class="btn" :class="{'btn-info':filter.value,'btn-default':!filter.value}" @click="change">

        <span>
          <i class="fa fa-arrow-up" v-show="filter.value==='ASC'"></i>
          <i class="fa fa-arrow-down" v-show="filter.value==='DESC'"></i>
        </span>
        {{filter.name}}
      </button>
      <i class="fa fa-times-circle-o sort-close" v-show="filter.value" @click="clear"></i>
    </span>
    <span>&nbsp;</span>
  </span>
</template>

<script>
	import Filter from "../../model/base/Filter";
	export default {
		props: {
			filter: {
				type: Filter,
				required: true,
				validator: function (value) {

					if (!value["name"]) {
						console.error("name is required.");
						return false;
					}

					if (value["value"]) {

						if (value["value"] !== "ASC" && value["value"] !== "DESC") {
							console.error("order can only be ASC or DESC.");
							return false;
						}
					}
					return true;
				}
			},
			callback: {
				type: Function,
				required: false
			}
		},
		methods: {
			change(){
				if (this.filter.value) {
					if (this.filter.value === "ASC") {
						this.filter.value = "DESC";
					} else {
						this.filter.value = "ASC";
					}
				} else {
					this.filter.value = "ASC";
				}

				this.callback && this.callback();
			},
			clear(){
				this.filter.value = null;

				this.callback && this.callback();
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
  .nb-sort{

    .sort-main{
      position:relative;

      .sort-close {

        opacity: 0.85;
        -webkit-transition: all 0.1s;
        -o-transition: all 0.1s;
        transition: all 0.1s;
        cursor:pointer;
        position:absolute;
        top:-13px;
        right:-2px;
        font-size: 18px;
        color: #555;


        &:hover{
          text-decoration: none;
          opacity: 1;
          -moz-transform: scale(1.2);
          -webkit-transform: scale(1.2);
          -o-transform: scale(1.2);
          -ms-transform: scale(1.2);
          transform: scale(1.2);
        }
      }
    }

  }


</style>


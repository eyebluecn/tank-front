<template>

	<span class="pt5" v-show="filter.visible">
		<span class="mr20 inline-block mb10" v-for="(option, index) in filter.options">
			<NbCheckbox :val="option.value" v-model="filter.value" :disabled="disabled"></NbCheckbox>
			<span :class="'label label-'+option.style">{{option.name}}</span>
		</span>
	</span>

</template>


<script>
  import Filter from '../../model/base/Filter'
  import NbCheckbox from '../NbCheckbox.vue'

  export default {
    data() {
      return {
        courses: []
      }
    },

    props: {
      filter: {
        type: Filter,
        required: true,
        validator: function (value) {

          if (value['type'] !== 'MULTI_SELECTION') {
            console.error('type must be `MULTI_SELECTION`.')
            return false
          }

          if (!value.value) {
            value.value = []
          }

          return true
        }
      },
      disabled: {
        type: Boolean,
        required: false,
        "default": false
      }
    },
    watch: {
      "filter.value"() {
        this.$emit("change");
      }
    },
    computed: {},
    components: {
      NbCheckbox
    },
    methods: {}
  }
</script>


<style lang="less" rel="stylesheet/less">

</style>


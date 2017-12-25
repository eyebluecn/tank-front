<template>
	<div>
		<div class="h50 cursor folder-block" :class="{'bg-silver-white': activeUuid === matter.uuid}" @click.stop.prevent="deepFolderToggle">
			<span class="fa fa-chevron-down mr5" v-if="deepFolder && pager.data.length"></span>
			<span class="fa fa-chevron-right mr5" v-if="!deepFolder && pager.data.length"></span>
			<span :class="{ 'ml18': !pager.data.length }">
				<img src="../../../assets/img/folder.svg" class="mr5" alt="文件夹" height="40%">
				<span v-if="matter.uuid">{{matter.name}}</span>
				<span v-else>全部文件</span>
			</span>

		</div>
		<div v-if="deepFolder && pager.data.length" class="pl20">
			<div v-for="(child, index) in pager.data" :key="index">
				<FolderTree :matter="child" :deepFolderInit="deepFolderInit" :currentCallback="currentCallback" :activeUuid="activeUuid"></FolderTree>
			</div>
		</div>
	</div>
</template>
<script>
  import Matter from '../../../common/model/matter/Matter'
  import NbExpanding from '../../../common/widget/NbExpanding.vue'
  import Pager from '../../../common/model/base/Pager'

  export default {
    name: 'FolderTree',
    data () {
      return {
        deepFolder: false,
        pager: new Pager(Matter)
      }
    },
    components: {
      NbExpanding
    },
    props: {
      matter: {
        type: Matter,
        required: true
      },
      deepFolderInit: {
        type: Boolean,
        required: false
      },
	    currentCallback:{
        type: Function,
		    required: false
	    },
	    activeUuid:{
        type: String,
		    required: false
	    }
    },
    methods: {
      deepFolderToggle () {
        this.deepFolder = !this.deepFolder
	      if(this.currentCallback){
          this.currentCallback(this.matter)
	      }
      }
    },
    created () {
      this.pager.setFilterValue('dir', true)
    },
    mounted () {
      if (!this.matter.uuid) {
        this.pager.setFilterValue('puuid', 'root')
      } else {
        this.pager.setFilterValue('puuid', this.matter.uuid)
      }
      this.pager.httpFastPage()
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
	.folder-block {
		padding: 5px 10px;
		line-height: 40px;
		&:hover {
			background: #eee;
		}
	}
</style>

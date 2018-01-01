<template>
	<div class="folder-tree">
		<div class="h50 cursor folder-block" :class="{'bg-silver-white': targetMatter.uuid === matter.uuid}" @click.stop.prevent="deepFolderToggle">
			<span class="fa fa-chevron-down mr5 w14" v-if="pager.data.length && deepFolder"></span>
			<span class="fa fa-chevron-right mr5 w14" v-if="pager.data.length && !deepFolder"></span>
			<span :class="{ 'ml23': !pager.data.length }">
				<span v-if="matter.uuid">
					<img :src="matter.getIcon()" class="mr5" alt="文件夹" width="22" />
					<span>{{matter.name}}</span>
				</span>
				<span v-else>
					<span>全部文件</span>
				</span>

			</span>

		</div>
		<NbExpanding>
			<div v-if="pager.data.length && deepFolder" class="pl20">
				<div v-for="(child, index) in pager.data">
					<FolderTree :matter="child" :targetMatter="targetMatter"></FolderTree>
				</div>
			</div>
		</NbExpanding>

	</div>
</template>

<script>
	import NbExpanding from '../../../common/widget/NbExpanding'
  import Pager from '../../../common/model/base/Pager'
  import Matter from '../../../common/model/matter/Matter'

  export default {
    name: 'FolderTree',

	  data(){
      return{
        deepFolder: false,
        pager: new Pager(Matter)
      }
	  },
	  props:{
      targetMatter: {
        type: Matter,
	      required: true
      },
      matter: {
        type: Matter,
        required: true
      },
      deepFolderInit:{
        type: Boolean,
	      required: false,
	      default: false
      }
	  },
	  methods:{
      deepFolderToggle () {
        this.deepFolder = !this.deepFolder
	      if(this.targetMatter.uuid !== this.matter.uuid){
          this.targetMatter.render(this.matter)
	      }
      }
	  },
	  components:{
      NbExpanding
	  },
	  mounted() {
      if (!this.matter.uuid) {
        this.pager.setFilterValue('puuid', 'root')
      } else {
        this.pager.setFilterValue('puuid', this.matter.uuid)
      }

      if(this.deepFolderInit){
        this.deepFolder = true
      }

      this.pager.setFilterValue('dir', true)
      this.pager.httpFastPage()

	  }

  }
</script>

<style lang="less" rel="stylesheet/less">
	.folder-tree{
		.folder-block {
			padding: 5px 10px;
			line-height: 40px;
			&:hover {
				background: #eee;
			}
		}
		.ml23{
			margin-left: 23px;
		}
	}

</style>
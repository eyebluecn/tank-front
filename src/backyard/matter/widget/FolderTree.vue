<template>
  <div class="folder-tree">
    <div class="h50 cursor folder-block" :class="{'bg-silver-white': targetMatter.uuid === matter.uuid}"
         @click.stop.prevent="clickItem">
      <span class="fa fa-chevron-down mr5 w14" v-if="pager.data.length && showSubFolder"></span>
      <span class="fa fa-chevron-right mr5 w14" v-if="pager.data.length && !showSubFolder"></span>
      <span :class="{ 'ml23': !pager.data.length }">
				<span v-if="matter.uuid">
					<img :src="matter.getIcon()" class="mr5" alt="文件夹" width="22"/>
					<span>{{matter.name}}</span>
				</span>
				<span v-else>
					<span>根目录</span>
				</span>

			</span>

    </div>
    <NbExpanding>
      <div v-if="pager.data.length && showSubFolder" class="pl20">
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

    data() {
      return {
        showSubFolder: false,
        pager: new Pager(Matter)
      }
    },
    props: {
      targetMatter: {
        type: Matter,
        required: true
      },
      matter: {
        type: Matter,
        required: true
      },
      showSubFolderInit: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    methods: {
      clickItem() {
        this.showSubFolder = !this.showSubFolder
        if (this.targetMatter.uuid !== this.matter.uuid) {
          this.targetMatter.render(this.matter)
        }
      },
      setUserUuid() {
        //限制选择的范围。文件和目标文件夹必须是同一主人
        if (this.targetMatter.userUuid) {
          this.pager.setFilterValue('userUuid', this.targetMatter.userUuid)
        } else {
          console.error("目标文件夹的userUuid必须指定！")
        }
      },
      refresh() {
        console.log("FolderTree mounted!")

        if (!this.matter.uuid) {
          this.pager.setFilterValue('puuid', 'root')
        } else {
          this.pager.setFilterValue('puuid', this.matter.uuid)
        }

        //限制选择的范围。文件和目标文件夹必须是同一主人
        this.setUserUuid()

        if (this.showSubFolderInit) {
          this.showSubFolder = true
        }

        this.pager.setFilterValue('dir', true)
        this.pager.httpFastPage()

      }
    },
    components: {
      NbExpanding
    },
    mounted() {
      this.refresh()
    }

  }
</script>

<style lang="less" rel="stylesheet/less">
  .folder-tree {
    .folder-block {
      padding: 5px 10px;
      line-height: 40px;
      &:hover {
        background: #eee;
      }
    }
    .ml23 {
      margin-left: 23px;
    }
  }

</style>

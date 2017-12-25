<template>
	<div class="common-matter">
		<div class="row">

			<div class="col-md-6 mb10" v-if="user.role === 'ADMINISTRATOR'">
				<UserInputSelection class="w300" :tag="currentUser" @option="currentUserChange"></UserInputSelection>
			</div>


			<div class="col-md-6 mb10" :class="{'text-right':!$store.state.config.mobile,'col-md-offset-6':user.role !== 'ADMINISTRATOR'}">

				<div>

					<el-input v-model="keywords" placeholder="请输入您的文件" class="w300" @change="keySearch">
						<el-button slot="append" icon="el-icon-search" @click.stop.prevent="keySearch"></el-button>
					</el-input>

				</div>

			</div>

		</div>

		<div class="row">

			<div class="col-md-12">
				<el-button-group>
					<el-button type="primary" icon="el-icon-delete" size="small" @click.stop.prevent="deleteBatch"
					           v-if="multipleSelection.length >= 2">删除
					</el-button>
				</el-button-group>

			</div>

		</div>


		<div class="wp100">
			<el-table
				ref="commonTable"
				@cell-mouse-enter="cellMouseEnter"
				@cell-mouse-leave="cellMouseLeave"
				:data="listData"
				tooltip-effect="dark"
				style="width: 100%"
				@selection-change="handleSelectionChange">
				<el-table-column
					type="selection"
					width="55">
				</el-table-column>
				<el-table-column
					label="名称">
					<template slot-scope="scope">
						<div>
							<div class="col-md-8">
								<div v-if="scope.row.newFolderStatus">
									<div style="width: 100%">
										<img src="../../../assets/img/folder.svg" alt="" width="20">
										<input type="text" v-model="scope.row.name" id="new" @keyup.13="saveFolder(scope.row)"
										       @blur="saveFolder(scope.row)"/>
									</div>
								</div>
								<div v-else-if="scope.row.renameStatus ">
									<input type="text" v-model="scope.row.name" id="modify" @keyup.13="saveRename(scope.row)"
									       @blur="saveRename(scope.row)"/>
								</div>
								<div v-else>
									<div v-if="!scope.row.type" style="width: 100%">
										<router-link :to="'/matter/list/' + scope.row.uuid">
											<img src="../../../assets/img/folder.svg" alt="" width="20" class="mr5">
											<span class="black">{{scope.row.name}}</span>
										</router-link>
									</div>
									<div v-else>
										<span>{{scope.row.name}}</span>
									</div>
								</div>
							</div>

							<div class="action-buttons col-md-4 text-right"
							     v-if="scope.row.showOperation || scope.row.renameStatus">
								<a href="javascript:void(0)" title="重命名" @click.stop.prevent="renameRow(scope.row)">
									<span class="fa fa-pencil"></span>
								</a>
								<a href="javascript:void(0)" title="下载" @click.stop.prevent="downloadRow(scope.row)"
								   v-if="scope.row.type">
									<span class="fa fa-download"></span>
								</a>
								<a href="javascript:void(0)" title="删除" @click.stop.prevent="deleteRow(scope.row)">
									<span class="fa fa-trash"></span>
								</a>
							</div>

						</div>

					</template>
				</el-table-column>
				<el-table-column v-if="!$store.state.config.mobile"
					label="上次修改时间">
					<template slot-scope="scope">
						<span>{{ scope.row.modifyTime | simpleDateTime }}</span>
					</template>
				</el-table-column>
				<el-table-column v-if="!$store.state.config.mobile"
					prop="size"
					label="大小"
					align="left">
					<template slot-scope="scope">
						<span v-if="scope.row.type">{{scope.row.size | humanFileSize}}</span>
						<span v-else> - </span>
					</template>
				</el-table-column>

			</el-table>
		</div>

		<div class="col-md-12 mt20">
			<NbPager :pager="pager" :callback="refresh"></NbPager>
		</div>


	</div>
</template>
<script>
  import Vue from 'vue'
  import NbPager from '../../../components/NbPager.vue'
  import UserSelection from '../../user/widget/UserSelection.vue'
  import UserInputSelection from '../../user/widget/UserInputSelection.vue'
  import { Message, MessageBox, Notification } from 'element-ui'
  import { ExtensionsType, ExtensionsTypeMap, ExtensionsTypeList } from '../../../model/base/ExtensionsType'
  import Matter from '../../../model/matter/Matter'
  import Pager from '../../../model/base/Pager'
  import $ from 'jquery'
  import User from '../../../model/user/User'

  export default {
    data () {
      return {
        ExtensionsType,
        ExtensionsTypeMap,
        ExtensionsTypeList,
        matter: new Matter(),
        pager: new Pager(Matter, 50),
        user: this.$store.state.user,
        currentUser: new User(),
        keywords: '',
        listData: [],
        multipleSelection: []
      }
    },
    props: {
      matterType: {
        type: String,
        required: true
      }
    },
    components: {
      NbPager,
      UserSelection,
      UserInputSelection
    },
    watch: {
      'keywords' (newVal, oldVal) {
        if (!newVal) {
          this.pager.setFilterValue('name', null)
          this.refresh()
        }
      }
    },
    methods: {
      currentUserChange (user) {
        if (user) {
          this.currentUser.uuid = user.uuid
          this.currentUser.httpDetail()
        } else {
          this.currentUser.render(new User())
        }
        this.refresh()
      },
      keySearch () {
        let that = this
        if (this.keywords) {
          this.pager.page = 0
          this.pager.setFilterValue('name', this.keywords)
          this.refresh()
        }
      },

      deleteBatch () {
        let that = this

        MessageBox.confirm('此操作将永久删除选中文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {

              let uuids = ''
              that.multipleSelection.forEach(function (i, index) {
                if (index !== that.multipleSelection.length - 1) {
                  uuids += i.uuid + ','
                } else {
                  uuids += i.uuid
                }
              })
              that.matter.httpMatterDeleteBatch(uuids, function (response) {
                Message.success('删除成功！')
                that.refresh()
              }, function (response) {
                Message.error('删除失败！')
              })

            }

          }
        })

      },


      cellMouseEnter (row, column, cell, event) {
        row.showOperation = true
      },
      cellMouseLeave (row, column, cell, event) {
        row.showOperation = false
      },

      selectText ($text, startIndex, stopIndex) {
        if ($text.setSelectionRange) {
          $text.setSelectionRange(startIndex, stopIndex)
        } else if ($text.createTextRange) {
          let range = $text.createTextRange()
          range.moveStart('character', startIndex);
          range.moveEnd('character', stopIndex - startIndex);
          range.select();
        }
        $text.focus();
      },

      renameRow (row, successCallback) {
        let that = this
        row.renameStatus = true
        setTimeout(function () {
          let $modify = $('#modify')
          if(!row.type){
            $modify.select()
          }else{
            let text = $modify.val()
            let stopIndex = text.lastIndexOf('.')
            that.selectText($modify.get(0),0,stopIndex)
          }
        }, 100)
      },
      saveRename (row) {
        if (row.renameStatus) {
          let that = this
          row.name = $('#modify').val()
          row.httpMatterRename(function (response) {
            Message.success('重命名成功！')
            row.renameStatus = false
          }, function (response) {
            Message.error(response.data.msg)
            row.renameStatus = false
            row.httpDetail()

          })
        }
      },

      downloadRow (row) {
        if (row.type) {
          window.open(Vue.http.options.root + '/matter/download?uuid=' + row.uuid)
        }
      },
      deleteRow (row) {
        let that = this
        MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: function (action, instance) {
            if (action === 'confirm') {
              row.httpMatterDelete(function (response) {
                Message.success('删除成功！')
                that.refresh()
              })
            }
          }
        })
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      refresh () {
        let that = this
        this.pager.setFilterValue('userUuid', this.currentUser.uuid)
        this.pager.httpFastPage(function (response) {
          that.listData = that.pager.data
        })
      }
    },
    created () {
      if (this.$store.state.route.query.userUuid) {
        this.currentUser.uuid = this.$store.state.route.query.userUuid
      } else {
        this.currentUser.uuid = this.user.uuid
      }
      this.currentUser.httpDetail()
    },
    mounted () {
      this.pager.enableHistory()
      this.pager.setFilterValue('extensions', this.ExtensionsType[this.matterType])
	    this.refresh()
    }
  }


</script>
<style lang="less" rel="stylesheet/less">

</style>

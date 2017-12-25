<template>
	<div class="matter-all-type">
		<div>
			<div class="row">

				<div class="col-md-4 mb10" style="line-height: 40px;">
					<router-link :to="'/matter/list/root'" v-if="matter.uuid && matter.uuid !== 'root' && !keywords">
						全部文件
					</router-link>
					<span v-else>全部文件</span>
					<span v-if="!keywords" v-for="b in breadcrumbs">
              <span> > </span>
							<router-link v-if="b.name !== matter.name" :to="'/matter/list/' + b.uuid">
                {{b.name}}
              </router-link>
							<span v-if="b.name === matter.name">
								{{b.name}}
							</span>

            </span>
				</div>

				<div class="col-md-4 mb10" v-if="user.role === 'ADMINISTRATOR'">
					<UserInputSelection class="w300" :tag="currentUser" @option="currentUserChange"></UserInputSelection>
				</div>

				<div class="col-md-4 mb10"
				     :class="{'text-right':!$store.state.config.mobile, 'col-md-offset-4':user.role !== 'ADMINISTRATOR' }">

					<div>
						<el-input v-model="keywords" placeholder="请输入您的文件" class="w300" @change="keySearch">
							<el-button slot="append" icon="el-icon-search" @click.stop.prevent="keySearch"></el-button>
						</el-input>

					</div>

				</div>

			</div>

			<div class="row">

				<div class="col-md-12 mt10">

					<el-button-group>

						<el-button type="primary" size="small" class="mb5" v-if="currentUser.uuid"
						           @click.stop.prevent="uploadMatter($createElement)">
							<span class="fa fa-upload mr5"></span>
							上传文件
						</el-button>
						<el-button type="primary" size="small" class="mb5" v-if="currentUser.uuid" @click.stop.prevent="newFolder">
							<span class="fa fa-folder-open mr5"></span>
							新建文件夹
						</el-button>
						<el-button type="primary" size="small" class="mb5"
						           v-if="multipleSelection.length >= 1" @click.stop.prevent="fileMove($createElement)">
							<span class="fa fa-arrows mr5"></span>
							移动
						</el-button>
						<el-button type="primary" size="small" class="mb5" @click.stop.prevent="deleteBatch"
						           v-if="multipleSelection.length >= 2">
							<span class="fa fa-trash mr5"></span>
							删除
						</el-button>
					</el-button-group>

				</div>

			</div>


			<div class="wp100 mt10">
				<el-table
					ref="multipleTable"
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
						label="名称"
						min-width="200">
						<template slot-scope="scope">
							<div>
								<div class="col-md-8">
									<div v-if="scope.row.newFolderStatus">
										<div style="width: 100%">
											<img src="../../assets/img/folder.svg" alt="" width="20">
											<input type="text" v-model="scope.row.name" id="new" @keyup.13="saveFolder(scope.row)"
											       @blur="saveFolder(scope.row)"/>
										</div>
									</div>
									<div v-else-if="scope.row.renameStatus ">
										<span>
											<img v-if="scope.row.dir" src="../../assets/img/folder.svg" alt="" width="20"
											     class="mr5">
											<img v-else :src="scope.row.getIcon()" alt="" width="20" class="mr5">
										</span>
										<input type="text" v-model="scope.row.name" id="modify" @keyup.13="saveRename(scope.row)"
										       @blur="saveRename(scope.row)"/>
									</div>
									<div v-else>
										<div v-if="scope.row.dir">
											<router-link :to="'/matter/list/' + scope.row.uuid">
												<img src="../../assets/img/folder.svg" alt="" width="20" class="mr5">
												<span class="black">{{scope.row.name}}</span>
											</router-link>
										</div>
										<div v-else>
											<img :src="scope.row.getIcon()" alt="" width="20" class="mr5">
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
									   v-if="!scope.row.dir">
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

		</div>


	</div>
</template>
<script>
  import Vue from 'vue'
  import NbTank from '../../common/widget/NbTank.vue'
  import FolderTree from './widget/FolderTree.vue'
  import NbSlidePanel from '../../common/widget/NbSlidePanel.vue'
  import NbExpanding from '../../common/widget/NbExpanding.vue'
  import NbCheckbox from '../../common/widget/NbCheckbox.vue'
  import UserInputSelection from '../user/widget/UserInputSelection.vue'
  import UserSelection from '../user/widget/UserSelection.vue'
  import UploadComponent from './components/UploadComponent.vue'
  import MoveComponent from './components/MoveComponent.vue'
  import Tank from '../../common/model/tank/Tank'
  import { Message, MessageBox, Notification } from 'element-ui'
  import Matter from '../../common/model/matter/Matter'
  import $ from 'jquery'
  import Pager from '../../common/model/base/Pager'
  import User from '../../common/model/user/User'

  export default {
    data () {
      return {
        moveUuids: [],
        matter: new Matter(),
        destMatter: new Matter(),
        pager: new Pager(Matter, 200),
        user: this.$store.state.user,
        currentUser: new User(),
        keywords: '',
        newFolderLockStatus: false,
        listData: [],           //存放table表格数据
        multipleSelection: [],  //存放选中的数据
        breadcrumbs: []         //存放面包屑
      }
    },
    components: {
      FolderTree,
      NbCheckbox,
      UserSelection,
      UserInputSelection,
      NbTank,
      NbSlidePanel,
      NbExpanding,
      UploadComponent,
      MoveComponent
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
          this.pager.setFilterValue('puuid', null)
          this.pager.setFilterValue('name', this.keywords)
          this.pager.httpFastPage(function () {
            that.listData = that.pager.data
          })
        }
      },

      fileMove (createElement) {
        let that = this
        this.moveUuids.splice(0, this.moveUuids.length)
        this.multipleSelection.forEach(function (i) {
          that.moveUuids.push(i.uuid)
        })

        let dom = createElement(MoveComponent, {
          props: {
            destMatter: this.destMatter
          }
        })

        MessageBox({
          title: '移动到',
          message: dom,
          customClass: 'wp50',
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonText: '关闭',
          callback: (action, instance) => {
            if (action === 'confirm') {
              that.matter.httpMatterMove(that.moveUuids.join(','), that.destMatter.uuid, function (response) {
                Message.success('移动成功！')
                that.refresh()
              })
            }

          }
        })

      },

      uploadMatter (createElement) {
        let that = this
        let dom = createElement(UploadComponent, {
          props: {
            currentUser: that.currentUser.uuid ? that.currentUser : that.user,
            matter: that.matter
          }
        })

        MessageBox({
          title: '上传文件',
          message: dom,
          customClass: 'wp50',
          confirmButtonText: '缩小窗体',
          callback: (action, instance) => {
            that.refresh()
          }
        })
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
      blurNew (row) {
        if (!row.name) {
          this.listData.shift()
        } else {
          this.saveFolder(row)
        }
      },
      saveFolder (row) {
        let that = this
        if (this.newFolderLockStatus) {
          return
        } else {
          this.newFolderLockStatus = true
          setTimeout(function () {
            that.newFolderLockStatus = false
          }, 300)
        }

        if (!row.name) {
          this.listData.shift()
        } else if (row.newFolderStatus) {
          let that = this
          let puuid = this.matter.uuid    //父级uuid
          row.loading = true
          row.httpMatterCreateDirectory(this.currentUser.uuid, puuid, function (response) {
            Message.success('创建文件夹成功！')
            row.newFolderStatus = false
          }, function (response) {
            Message.error(response.data.msg)
          })

        }

      },
      newFolder () {
        let newMatter = new Matter()
        newMatter.name = '新建文件夹'
        newMatter.newFolderStatus = true
        this.listData.unshift(newMatter)
        setTimeout(function () {
          $('#new').select()
        }, 100)
      },

      selectText ($text, startIndex, stopIndex) {
        if ($text.setSelectionRange) {
          $text.setSelectionRange(startIndex, stopIndex)
        } else if ($text.createTextRange) {
          let range = $text.createTextRange()
          range.moveStart('character', startIndex)
          range.moveEnd('character', stopIndex - startIndex)
          range.select()
        }
        $text.focus()
      },

      renameRow (row, successCallback) {
        let that = this
        row.renameStatus = true
        setTimeout(function () {
          let $modify = $('#modify')
          if (!row.type) {
            $modify.select()
          } else {
            let text = $modify.val()
            let stopIndex = text.lastIndexOf('.')
            that.selectText($modify.get(0), 0, stopIndex)
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
        window.open(Vue.http.options.root + '/alien/download/' + row.uuid + '/' + row.name)
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

      refresh () {
        let that = this
        let puuid = this.matter.uuid
        this.pager.setFilterValue('userUuid', this.currentUser.uuid)
        this.pager.setFilterValue('puuid', this.matter.uuid)
        if (!puuid) {
          this.pager.setFilterValue('puuid', 'root')
        }
        this.pager.httpFastPage(function (response) {
          that.listData = that.pager.data
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      //更换面包屑
      breadCrumb () {
        let that = this
        this.breadcrumbs.splice(0, this.breadcrumbs.length)
        if (this.matter.uuid) {
          this.matter.httpDetail(function (response) {
            let breadChain = response.data.data
            do {
              that.breadcrumbs.unshift({name: breadChain.name, uuid: breadChain.uuid})
              if (breadChain.parent) {
                breadChain = breadChain.parent
              } else break

            } while (breadChain)
          })
        }
      },
      parentMatterChange () {
        if (this.$store.state.route.params.puuid !== 'root') {
          this.matter.uuid = this.$store.state.route.params.puuid
        } else {
          this.matter.render(new Matter())
        }
        this.refresh()
        this.breadCrumb()
      }
    },
    watch: {
      '$route.path' (newVal, oldVal) {
        this.parentMatterChange()
      },
      'keywords' (newVal, oldVal) {
        if (!newVal) {
          this.pager.setFilterValue('name', null)
          this.refresh()
        }

      }
    },
    created () {
      if (this.$store.state.route.query.userUuid) {
        this.currentUser.uuid = this.$store.state.route.query.userUuid
      } else {
        this.currentUser.uuid = this.user.uuid
      }
      if (this.currentUser.uuid) {
        this.currentUser.httpDetail()
      }

    },
    mounted () {
      let that = this
      this.pager.enableHistory()
      this.parentMatterChange()
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
	@import "../../assets/css/global/variables";

	.matter-all-type {

		.search-keywords {
			&:hover {
				border-color: #000;
			}
		}

		.fixed-download-box {
			position: fixed;
			z-index: 2000;
			bottom: 0;
			right: 0;
			width: 120px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			cursor: pointer;
			border-radius: 10px 10px 0 0;
		}
	}
</style>

<template>
	<div class="nb-tanks-block">


		<div class="tank-block" v-for="(tank,tankIndex) in tanks">
			<NbExpanding>
				<div v-show="tank.procedure === tank.Procedure.FETCHING_UPLOAD_TOKEN">
					<i class="fa fa-spinner fa-spin fa-fw"></i> 准备上传中...
				</div>
			</NbExpanding>


			<NbExpanding>
				<div class="huge-block clearfix"
				     v-if="tank.procedure === tank.Procedure.UPLOADING">
					<div class="media">
						<div class="pull-right">
							<i class="btn-action f16 fa fa-trash text-danger" @click.stop.prevent="del(tank,tankIndex)"></i>
						</div>
						<div class="media-body">{{tank.file.name}}</div>
					</div>
					<div class="progress" :class="{'progress-striped active' : tank.procedure === tank.Procedure.UPLOADING}">
						<div :style="'width: '+(tank.progress*100)+'%'" class="progress-bar progress-bar-primary">
							<span>已上传 {{(tank.progress * 100).toFixed(1)}}%</span>
						</div>
					</div>
					<div>
						已上传:{{ (tank.file.size * tank.progress).toFixed(0) | humanFileSize }}/{{ tank.file.size | humanFileSize}} 速度:{{tank.speed | humanFileSize}}/s

					</div>
				</div>
			</NbExpanding>

			<NbExpanding>
				<div class="tiny-block"
				     v-if="tank.exist()">
					<div class="w200 p10 mb10 bg-white br5 border" v-show="tank.publicImgUrl()">
						<img class="wp100" :src="tank.publicImgUrl()"/>
					</div>
					<div>
						<i class="f16" v-show="tank.fileIcon() && !tank.publicImgUrl()" :class="[tank.fileIcon()]"></i>
						<span class="f14 black cursor hover-underline" @click.stop.prevent="tank.download()">
					{{tank.name}}
				</span>
						<span>
					{{tank.size | humanFileSize}}
				</span>
						<span>
					<i class="btn-action f16 fa fa-download text-success" @click.stop.prevent="tank.download()"></i>
				</span>
						<span v-if="edit">
					<i class="btn-action f16 fa fa-trash text-danger" @click.stop.prevent="del(tank,tankIndex)"></i>
				</span>

					</div>
				</div>
			</NbExpanding>

		</div>

		<div
			v-show="tanks.length < maxNum && edit && templateTank.procedure === templateTank.Procedure.FREE && !templateTank.exist()">
			<div>
				<span class="btn btn-primary btn-sm btn-file">
					<slot name="button">
						<i class="fa fa-folder-open-o"></i>
						<span>选择文件</span>
					</slot>
					<input ref="refFile" type="file" name="avatar" @change.prevent.stop="fileChanged"/>
				</span>
			</div>
			<div class="mt5 italic" v-if="!templateTank.errorMessage && templateTank.uploadHint">
				<i class="fa fa-info-circle"></i> {{templateTank.uploadHint}}
			</div>
			<div class="mt5 " v-if="templateTank.errorMessage">
				<i class="fa fa-warning text-danger"></i> <span class="text-danger">{{templateTank.errorMessage}}</span>
			</div>
		</div>


	</div>

</template>

<script>

  import { startWith, endWith, getExtension, containStr } from '../../common/filter/str'
  import Tank from '../../common/model/tank/Tank'
  import $ from 'jquery'
  import { MessageBox, Notification } from 'element-ui'
  import NbExpanding from './NbExpanding.vue'

  export default {
    data () {
      return {}
    },
    props: {
      tanks: {
        type: Array,
        required: true,
        'default': []
      },
      edit: {
        type: Boolean,
        required: false,
        'default': true
      },
      maxNum: {
        type: Number,
        required: false,
        'default': 9
      },
      templateTank: {
        type: Tank,
        required: false,
        'default': function () {
          return new Tank('*', true)
        },
        validator: function (tank) {
          return tank.validateFilter()
        }
      },
      success: {
        type: Function,
        required: false
      },
      remove: {
        type: Function,
        required: false
      }
    },
    components: {
      NbExpanding
    },
    computed: {},
    methods: {
      fileChanged () {
        let that = this

        let tank = new Tank('*', true)
        tank.render(this.templateTank)

        tank.file = this.$refs['refFile'].files[0]
        that.$refs['refFile'].value = ''

        //提前验证，有错误及时显示
        if (!tank.validate()) {
          this.templateTank.errorMessage = tank.errorMessage
          console.error(tank.errorMessage)
          return
        } else {
          this.templateTank.errorMessage = null
        }

        this.tanks.push(tank)

        tank.httpUpload(function () {
          if (that.success) {
            that.success(tank)
          }
        }, function () {
          console.error('上传失败啦')

          //一次检查哪些失败了，失败了的移除掉。
          for (let i = 0; i < that.tanks.length; i++) {
            let itemTank = that.tanks[i]

            if (itemTank.errorMessage) {
              that.templateTank.errorMessage = itemTank.errorMessage
              that.tanks.splice(i, 1)
            }

          }

        })
      },
      del (tank, tankIndex) {
        let that = this
        console.log('del')
        console.log(tank)
        MessageBox.confirm('是否删除此文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
            tank.clear()
            if (that.remove) {
              that.remove(tank)
            }
            that.tanks.splice(tankIndex, 1)
          },
          function () {
          }
        )
      }
    },
    mounted () {

    }
  }
</script>


<style lang="less" rel="stylesheet/less">

	.nb-tanks-block {

		.tank-block {

			transition-duration: 0.3s;
			margin: 5px 0;

			.huge-block {
				background-color: white;
				border-radius: 5px;
				border: 1px solid #eeeeee;
				padding: 10px;

				.progress {
					margin-bottom: 10px;
				}
			}
		}

	}


</style>

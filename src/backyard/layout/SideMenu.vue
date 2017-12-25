<template>
	<li class="nav-item nav-first-level" :class="{active:menu.active,current:current(menu)}">
		<a href="javascript:void(0)" @click="menuClick(menu)">
			<i v-if="menu.icon" class="w14" :class="menu.icon"></i>
			<span class="nav-label">{{menu.name}}</span>

			<i v-if="menu.children && menu.children.length" class="pull-right fa"
			   :class="{'fa-angle-left':!menu.active,'fa-angle-down':menu.active}"></i>


		</a>

		<NbExpanding>
			<ul
				v-show="menu.active"
				v-if="menu.children && menu.children.length"
				class="nav nav-second-level"
			>

				<!--区域管理特俗情况处理-->
				<li v-for="(menu1, index1) in menu.children"
				    :class="{active:menu1.active,current:current(menu1)||shouldActive(menu1)}">
					<a href="javascript:void(0)" @click="menuClick(menu1)">
						{{menu1.name}}
						<i v-if="menu1.children && menu1.children.length" class="pull-right fa"
						   :class="{'fa-angle-left':!menu1.active,'fa-angle-down':menu1.active}"></i>
					</a>


					<NbExpanding>
						<ul
							v-show="menu1.active"
							v-if="menu1.children && menu1.children.length"
							class="nav nav-third-level"
						>
							<li v-for="menu2 in menu1.children" :class="{active:menu2.active,current:current(menu2)}">
								<a href="javascript:void(0)" @click="menuClick(menu2)">
									<span class="nav-label" :data-path="menu2.router.path">{{menu2.name}}</span>
									<i v-if="menu2.children && menu2.children.length" class="pull-right fa"
									   :class="{'fa-angle-left':!menu2.active,'fa-angle-down':menu2.active}"></i>

								</a>

								<NbExpanding>
									<ul
										v-show="menu2.active"
										v-if="menu2.children && menu2.children.length"
										class="nav nav-fourth-level"
									>
										<li v-for="menu3 in menu2.children">
											<a href="javascript:void(0)" @click="menuClick(menu3)">
												<span class="nav-label">{{menu3.name}}</span>
											</a>

										</li>
									</ul>
								</NbExpanding>
							</li>
						</ul>
					</NbExpanding>

				</li>
			</ul>
		</NbExpanding>
	</li>
</template>
<script>

  import NbExpanding from '../../common/widget/NbExpanding.vue'
  import Menu from '../../common/frontend/Menu'
  import { startWith } from '../../common/filter/str'

  export default {
    props: {
      menu: {
        type: Menu,
        required: true
      }
    },
    computed: {},
    components: {
      NbExpanding
    },
    methods: {
      current (menu) {
        if (!menu.children || menu.children.length === 0) {
          if (menu.router.path === this.$store.state.route.path) {
            return true
          }

          if (menu.router.path === '/') {
            if (this.$store.state.route.path === '/' || this.$store.state.route.path === '/index') {
              return true
            }

          }

        }

        return false
      },
      menuClick (menu) {

        if (!menu.children || menu.children.length === 0) {
          if (menu.router.path !== this.$store.state.route.fullPath) {
            this.$router.push(menu.router)
          }
        } else {
          menu.active = !menu.active
        }

      },
      shouldActive (menu) {
        //TODO:需要一个优雅的解决方案。

        return (startWith(this.$route.path, '/region/list') && startWith(menu.router.path, '/region/list')) ||
          (startWith(this.$route.path, '/user/role') && startWith(menu.router.path, '/user/role'))

      }
    },
    watch: {},
    mounted () {

    }
  }
</script>


<style lang="less" rel="stylesheet/less">

</style>

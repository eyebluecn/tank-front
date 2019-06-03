import Vue from 'vue'
import Router from 'vue-router'
import ByFrameView from '../../backyard/Frame.vue'
import ShareList from '../../backyard/share/List'
import ShareDetail from '../../backyard/share/Detail'
import MatterList from '../../backyard/matter/List'
import MatterDetail from '../../backyard/matter/Detail'
import UserLogin from '../../backyard/user/Login'
import UserAuthentication from '../../backyard/user/Authentication'
import UserRegister from '../../backyard/user/Register'
import UserList from '../../backyard/user/List'
import UserDetail from '../../backyard/user/Detail'
import UserChangePassword from '../../backyard/user/ChangePassword'
import UserEdit from '../../backyard/user/Edit'
import DashboardIndex from '../../backyard/dashboard/Index'
import PreferenceIndex from '../../backyard/preference/Index'
import InstallIndex from '../../backyard/install/Index'
import PreferenceEdit from '../../backyard/preference/Edit'
import NotFound from '../../backyard/layout/NotFound'
import store from '../vuex/index.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'is-link-active',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
      component: ByFrameView,
      children: [
        {
          path: '',
          name: 'MatterList',
          component: MatterList,
          meta: {
            //here is i18n key
            title: 'router.allFiles',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'MatterList',
                title: 'router.allFiles'
              }
            ]
          }
        },
        {
          path: 'matter/detail/:uuid',
          name: 'MatterDetail',
          component: MatterDetail,
          meta: {
            title: 'router.fileDetail',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'MatterList',
                title: 'router.allFiles'
              },
              {
                name: 'MatterDetail',
                title: 'router.fileDetail'
              }
            ]
          }
        },
        {
          path: 'user/login',
          name: 'UserLogin',
          component: UserLogin,
          meta: {
            title: 'router.login',
            requiresAuth: false,
            breadcrumbs: []
          }
        },
        {
          path: 'user/authentication/:authentication',
          name: 'UserAuthentication',
          component: UserAuthentication,
          meta: {
            title: 'router.autoLogin',
            requiresAuth: false,
            breadcrumbs: []
          }
        },
        {
          path: 'user/register',
          name: 'UserRegister',
          component: UserRegister,
          meta: {
            title: 'router.register',
            requiresAuth: false,
            breadcrumbs: []
          }
        },
        {
          path: 'user/list',
          name: 'UserList',
          component: UserList,
          meta: {
            title: 'router.users',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserList',
                title: 'router.users'
              }
            ]
          }
        },
        {
          path: 'user/detail/:uuid',
          name: 'UserDetail',
          component: UserDetail,
          meta: {
            title: 'router.userDetail',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserList',
                title: 'router.users'
              },
              {
                name: 'UserDetail',
                title: 'router.userDetail'
              }
            ]
          }
        },
        {
          path: 'user/change/password',
          name: 'UserChangePassword',
          component: UserChangePassword,
          meta: {
            title: 'router.changePassword',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserChangePassword',
                title: 'router.changePassword'
              }
            ]
          }
        },
        {
          path: 'user/create',
          name: 'UserCreate',
          component: UserEdit,
          meta: {
            title: 'router.createUser',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserList',
                title: 'router.users'
              },
              {
                name: 'UserCreate',
                title: 'router.createUser'
              }
            ]
          }
        },

        {
          path: 'user/edit/:uuid',
          name: 'UserEdit',
          component: UserEdit,
          meta: {
            title: 'router.editUser',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserList',
                title: 'router.users'
              },
              {
                name: 'UserEdit',
                title: 'router.editUser'
              }
            ]
          }
        },

        {
          path: 'share/detail/:uuid',
          name: 'ShareDetail',
          component: ShareDetail,
          meta: {
            title: 'router.shareDetail',
            requiresAuth: false,
            breadcrumbs: []
          }
        },
        {
          path: 'share/list',
          name: 'ShareList',
          component: ShareList,
          meta: {
            title: 'router.myShare',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'ShareList',
                title: 'router.myShare'
              }
            ]
          }
        },
        {
          path: 'dashboard/index',
          name: 'DashboardIndex',
          component: DashboardIndex,
          meta: {
            title: 'router.dashboard',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'DashboardIndex',
                title: 'router.dashboard'
              }
            ]
          }
        },

        {
          path: 'install/index',
          name: 'InstallIndex',
          component: InstallIndex,
          meta: {
            title: 'router.dashboard',
            requiresAuth: false,
            breadcrumbs: [
              {
                name: 'InstallIndex',
                title: 'router.dashboard'
              }
            ]
          }
        },

        {
          path: 'preference',
          name: 'PreferenceIndex',
          component: PreferenceIndex,
          meta: {
            title: 'router.setting',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'PreferenceIndex',
                title: 'router.setting'
              }
            ]
          }
        },

        {
          path: 'preference/edit',
          name: 'PreferenceEdit',
          component: PreferenceEdit,
          meta: {
            title: 'router.setting',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'PreferenceIndex',
                title: 'router.setting'
              },
              {
                name: 'PreferenceEdit',
                title: 'router.setting'
              }
            ]
          }
        },
        //未被上面处理的route被视为404
        {
          path: '*',
          component: NotFound,
          meta: {requiresAuth: false}
        }
      ]
    }
  ]
})

//装填面包屑
function fillBreadcrumbs(to) {
  //清空数组
  store.state.breadcrumbs.splice(0, store.state.breadcrumbs.length);
  if (to.meta.breadcrumbs) {
    //追加一个数组
    store.state.breadcrumbs.push.apply(store.state.breadcrumbs, to.meta.breadcrumbs)
  }
}

//add global interceptor.
router.beforeEach((to, from, next) => {

  //handle auth feature.
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (store.state.user.role === 'GUEST') {
      next({
        path: '/user/login',
        query: {redirect: to.fullPath}
      })
    } else {

      fillBreadcrumbs(to);
      next()
    }
  } else {

    fillBreadcrumbs(to);
    next()
  }
})

export default router

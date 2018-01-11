import Vue from 'vue'
import Router from 'vue-router'
import ByFrameView from '../../backyard/Frame.vue'
import MatterList from '../../backyard/matter/List'
import UserLogin from '../../backyard/user/Login.vue'
import UserList from '../../backyard/user/List'
import UserDetail from '../../backyard/user/Detail'
import UserChangePassword from '../../backyard/user/ChangePassword'
import UserCreate from '../../backyard/user/Create'
import PreferenceIndex from '../../backyard/preference/Index'
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
            title: '全部文件',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'MatterList',
                title: '全部文件'
              }
            ]
          }
        },
        {
          path: 'user/login',
          name: 'UserLogin',
          component: UserLogin,
          meta: {
            title: '登录',
            requiresAuth: false,
            breadcrumbs: []
          }
        },
        {
          path: 'user/list',
          name: 'UserList',
          component: UserList,
          meta: {
            title: '用户列表',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserList',
                title: '用户列表'
              }
            ]
          }
        },


        {
          path: 'user/detail/:uuid',
          name: 'UserDetail',
          component: UserDetail,
          meta: {
            title: '用户详情',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserList',
                title: '用户列表'
              },
              {
                name: 'UserDetail',
                title: '用户详情'
              }
            ]
          }
        },
        {
          path: 'user/change/password',
          name: 'UserChangePassword',
          component: UserChangePassword,
          meta: {
            title: '修改密码',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserChangePassword',
                title: '修改密码'
              }
            ]
          }
        },
        {
          path: 'user/create',
          name: 'UserCreate',
          component: UserCreate,
          meta: {
            title: '创建用户',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserList',
                title: '用户列表'
              },
              {
                name: 'UserCreate',
                title: '创建用户'
              }
            ]
          }
        },
        {
          path: 'user/edit/:uuid',
          name: 'UserEdit',
          component: UserCreate,
          meta: {
            title: '编辑用户',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'UserList',
                title: '用户列表'
              },
              {
                name: 'UserEdit',
                title: '编辑用户'
              }
            ]
          }
        },
        {
          path: 'preference',
          name: 'PreferenceIndex',
          component: PreferenceIndex,
          meta: {
            title: '网站偏好',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'PreferenceIndex',
                title: '网站偏好'
              }
            ]
          }
        },
        {
          path: 'preference/edit',
          name: 'PreferenceEdit',
          component: PreferenceEdit,
          meta: {
            title: '网站偏好设置',
            requiresAuth: true,
            breadcrumbs: [
              {
                name: 'PreferenceIndex',
                title: '网站偏好'
              },
              {
                name: 'PreferenceEdit',
                title: '网站偏好设置'
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

import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/ad',
    component: Layout,
    redirect: '/ad/list',
    name: 'Ad',
    meta: { title: '广告', icon: 'example' },
    children: [
      {
        name: 'AdList',
        path: 'list',
        component: () => import('@/views/advertisement/list'),
        meta: { title: '列表', icon: 'list' }
      },
      {
        name: 'EditPublish',
        path: 'editPublish',
        component: () => import('@/views/advertisement/editPublish'),
        meta: { title: '发布', icon: 'edit' }
      },
      {
        name: 'Statistics',
        path: 'statistics',
        component: () => import('@/views/advertisement/statistics'),
        meta: { title: '统计', icon: 'chart' }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: { title: '文章', icon: 'documentation' },
    children: [
      {
        name: 'AdminArticle',
        path: 'admin',
        component: () => import('@/views/article/admin'),
        meta: { title: '列表(管理员可用)', icon: 'table' }
      },
      {
        name: 'ArticleList',
        path: 'list',
        component: () => import('@/views/article/list'),
        meta: { title: '列表(编辑使用)', icon: 'list' }
      },
      {
        name: 'ArticleEditPublish',
        path: 'editPublish',
        component: () => import('@/views/article/editPublish'),
        meta: { title: '发布', icon: 'edit' }
      },
      {
        name: 'ArticleStatistics',
        path: 'statistics',
        component: () => import('@/views/article/statistics'),
        meta: { title: '统计', icon: 'chart' }
      },
      {
        name: 'ChildUser',
        path: 'childUser',
        component: () => import('@/views/article/childUser'),
        meta: { title: '子用户', icon: 'peoples' }
      }
    ]
  },

  {
    path: '/feebback',
    component: Layout,
    children: [
      {
        name: 'Feebback',
        path: 'index',
        component: () => import('@/views/feedback/index'),
        meta: { title: '反馈', icon: 'form' }
      }
    ],
  },

  {
    path: '/report',
    component: Layout,
    children: [
      {
        name: 'Report',
        path: 'index',
        component: () => import('@/views/report/index'),
        meta: { title: '举报', icon: 'form' }
      }
    ],
  },

  {
    path: '/kyb',
    component: Layout,
    meta: { title: '康有保', icon: 'form' },
    children: [
      {
        name: 'KybArticle',
        path: 'index',
        component: () => import('@/views/kyb/article'),
        meta: { title: '资讯列表', icon: 'form' }
      },
      {
        name: 'KybArticleEditPublish',
        path: 'editPublish',
        component: () => import('@/views/kyb/editPublish'),
        meta: { title: '资讯发布', icon: 'edit' }
      },
      {
        name: 'KybMessage',
        path: 'message',
        component: () => import('@/views/kyb/message'),
        meta: { title: '留言列表', icon: 'chart' }
      },
    ],
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        name: 'Form',
        path: 'index',
        component: () => import('@/views/form/index'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  },

  {
    path: 'externalLink',
    component: Layout,
    meta: { title: '外链', icon: 'tree' },
    children: [
      {
        path: 'http://zjzx.xyz',
        meta: { title: '直击真相pc', icon: 'link' }
      },
      {
        path: 'http://m.zjzx.xyz',
        meta: { title: '直击真相web', icon: 'link' }
      },
      {
        path: 'https://mobile.umeng.com/platform/5c41951ef1f5567e500014c2/channels/list',
        meta: { title: '直击真相统计', icon: 'link' }
      },
      {
        path: 'http://kangyoubao.net',
        meta: { title: '康有保官网', icon: 'link' }
      },
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        name: 'Icon',
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        meta: { title: '图标', icon: 'icon' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

import Const from "../core/const"
import Util from "../core/utils"
import Data from "../core/data"
import MallLayout from '../views/mall/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE
const ROUTER_TYPE = Const.LOGIN.ROUTER_TYPE

const mallRouters = { // 看板
    path: '/mall',
    component: MallLayout,
    name: 'Mall',
    meta: {
        title: '商城',
        title_en: 'Store',
        icon: 'i_s_dashboard',
        roles: [LOGIN_TYPE.DISTRIBUTOR],
        hidden: true
    },
    children: [
        {
            path: 'index',
            component: () => import('@/views/mall/purchase/index.vue'),
            meta: {
                title: '首页',
                title_en: 'Index',
            }
        },
        {
            path: 'search',
            component: () => import('@/views/mall/purchase/search.vue'),
            meta: {
                title: '搜索',
                title_en: 'Search',
            }
        },
        {
            path: 'favorites',
            component: () => import('@/views/mall/purchase/favorites.vue'),
            meta: {
                title: '收藏夹',
                title_en: 'Favorites',
            }
        },
        {
            path: 'all-articles',
            component: () => import('@/views/mall/purchase/all-articles.vue'),
            meta: {
                title: '文章列表',
                title_en: 'All Articles',
            }
        },
        {
            path: 'all-deals',
            component: () => import('@/views/mall/purchase/all-deals.vue'),
            meta: {
                title: '公告列表',
                title_en: 'All Deals',
            }
        },
        {
            path: 'detail',
            component: () => import('@/views/mall/purchase/detail.vue'),
            meta: {
                title: '文章详情',
                title_en: 'Articles Detail',
            }
        },
        {
            path: 'vehicle-list',
            component: () => import('@/views/mall/purchase/vehicle/vehicle-list.vue'),
            meta: {
                title: '所有车型',
                title_en: 'All Vehicle Models',
            },
            children: [
                {
                    path: 'detail',
                    component: () => import('@/views/mall/purchase/vehicle/vehicle-detail.vue'),
                    meta: {
                        title: '文章详情',
                        title_en: 'Vehicle Detail',
                        hideParentTemplate: true
                    }
                },
            ]
        },
    ]
}
export {
    mallRouters
}

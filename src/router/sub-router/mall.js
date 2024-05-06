import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';

const LOGIN_TYPE = Const.LOGIN.TYPE;

const mallRouters = {
    // 看板
    path: '/mall',
    component: () => import('@/views/mall/layout/index.vue'),
    name: 'Mall',
    meta: {
        title: '商城',
        title_en: 'Store',
        icon: 'i_s_dashboard',
        roles: [LOGIN_TYPE.DISTRIBUTOR],
        hidden: true,
    },
    children: [
        {
            path: 'index',
            component: () => import('@/views/mall/purchase/index.vue'),
            meta: {
                title: '首页',
                title_en: 'Index',
            },
        },
        {
            path: 'search',
            component: () => import('@/views/mall/purchase/search.vue'),
            meta: {
                title: '搜索',
                title_en: 'Search',
            },
        },
        {
            path: 'favorites',
            component: () => import('@/views/mall/purchase/favorites.vue'),
            meta: {
                title: '收藏夹',
                title_en: 'Favorites',
            },
        },
        {
            path: 'all-articles',
            component: () => import('@/views/mall/purchase/all-articles.vue'),
            meta: {
                title: '文章列表',
                title_en: 'All Articles',
            },
        },
        {
            path: 'all-deals',
            component: () => import('@/views/mall/purchase/all-deals.vue'),
            meta: {
                title: '公告列表',
                title_en: 'All Deals',
            },
        },
        {
            path: 'deals-detail',
            component: () => import('@/views/mall/purchase/deals-detail.vue'),
            meta: {
                title: '公告详情',
                title_en: 'Report Detail',
            },
        },
        {
            path: 'detail',
            component: () => import('@/views/mall/purchase/detail.vue'),
            meta: {
                title: '文章详情',
                title_en: 'Articles Detail',
            },
        },
        {
            path: 'shopping-bag',
            component: () => import('@/views/mall/purchase/shopping-bag.vue'),
            meta: {
                title: '购物车',
                title_en: 'Shopping Bag',
            },
        },
        {
            path: 'vehicle-list',
            component: () => import('@/views/mall/purchase/vehicle/vehicle-list.vue'),
            meta: {
                title: '所有整车',
                title_en: 'All Vehicle Models',
                item_type: 1, //商品分类：1.整车；2.零部件；3.周边；4.广宣品
            },
            children: [
                {
                    path: 'detail',
                    component: () => import('@/views/mall/purchase/vehicle/vehicle-detail.vue'),
                    meta: {
                        title: '整车详情',
                        title_en: 'Vehicle Detail',
                        hideParentTemplate: true,
                    },
                },
            ],
        },
        {
            path: 'accessories-list',
            component: () => import('@/views/mall/purchase/vehicle/vehicle-list.vue'),
            meta: {
                title: '所有配件',
                title_en: 'All Accessories',
                item_type: 2, //商品分类：1.整车；2.零部件；3.周边；4.广宣品
            },
            children: [
                {
                    path: 'detail',
                    component: () => import('@/views/mall/purchase/vehicle/vehicle-detail.vue'),
                    meta: {
                        title: '配件详情',
                        title_en: 'Accessories Detail',
                        hideParentTemplate: true,
                    },
                },
            ],
        },
        {
            path: 'peripheral-list',
            component: () => import('@/views/mall/purchase/vehicle/vehicle-list.vue'),
            meta: {
                title: '所有周边件',
                title_en: 'All Peripheral Products',
                item_type: 3, //商品分类：1.整车；2.零部件；3.周边；4.广宣品
            },
            children: [
                {
                    path: 'detail',
                    component: () => import('@/views/mall/purchase/vehicle/vehicle-detail.vue'),
                    meta: {
                        title: '周边件详情',
                        title_en: 'Peripheral Products Detail',
                        hideParentTemplate: true,
                    },
                },
            ],
        },
        {
            path: 'promotional-list',
            component: () => import('@/views/mall/purchase/vehicle/vehicle-list.vue'),
            meta: {
                title: '所有广宣品',
                title_en: 'All Promotional Products',
                item_type: 4, //商品分类：1.整车；2.零部件；3.周边；4.广宣品
            },
            children: [
                {
                    path: 'detail',
                    component: () => import('@/views/mall/purchase/vehicle/vehicle-detail.vue'),
                    meta: {
                        title: '广宣品详情',
                        title_en: 'Promotional Products Detail',
                        hideParentTemplate: true,
                    },
                },
            ],
        },
        {
            path: 'recharge',
            component: () => import('@/views/mall/order/recharge.vue'),
            meta: {
                title: '充值',
                title_en: 'Recharge',
            },
        },
        {
            path: 'confirm-order',
            component: () => import('@/views/mall/order/confirm-order.vue'),
            meta: {
                title: '确认订单',
                title_en: 'Confirm Order',
            },
        },
        {
            path: 'pending-payment',
            component: () => import('@/views/mall/order/pending-payment.vue'),
            meta: {
                title: '待支付订单',
                title_en: 'Pending Payment Order',
            },
        },
    ],
};
const dealsPreview = {
    path: '/preview',
    component: () => import('@/views/mall/layout/index.vue'),
    name: 'Preview',
    meta: {
        title: '商城',
        title_en: 'Store',
        icon: 'i_s_dashboard',
        roles: [LOGIN_TYPE.ADMIN],
        hidden: true,
    },
    children: [
        {
            path: 'deals-preview',
            component: () => import('@/views/mall/purchase/deals-detail.vue'),
            meta: {
                title: '公告详情',
                title_en: 'Report Detail',
            },
        },
    ],
};
export { mallRouters, dealsPreview };

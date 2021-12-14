import Const from "../core/const"
const LOGIN_TYPE = Const.LOGIN.TYPE

import Layout from '../views/layout/index.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        hidden: true
    },
    {   // 登录
        path: '/login',
        hidden: true,
        component: () => import('@/views/Login.vue'),
        meta: {
            title: '登录',
        }
    },
    {   // 时效看板
        path: '/dashboard',
        component: Layout,
        // hidden: true,
        meta: {
            title: '时效看板',
            icon: 'i_s_dashboard',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/Dashboard.vue'),
                meta: {
                    title: '时效看板',
                }
            },
        ]
    },
    {   // 维修单
        path: '/repair',
        component: Layout,
        name: 'RepairManagement',
        redirect: '/repair/repair-list',
        meta: {
            title: '维修单管理',
            icon: 'i_s_dashboard',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'repair-list',
                name: 'RepairList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '维修单列表',
                }
            },
            {
                path: 'repair-edit',
                name: 'RepairEdit',
                component: () => import('@/views/repair/repair-edit.vue'),
                hidden: true,
                meta: {
                    title: '维修单编辑',
                    parent: '/repair/repair-list',
                }
            },
            {
                path: 'repair-detail',
                name: 'RepairDetail',
                component: () => import('@/views/repair/repair-detail.vue'),
                hidden: true,
                meta: {
                    title: '维修单详情',
                    parent: '/repair/repair-list',
                }
            },
        ]
    },
    {   // 经销商
        path: '/dealers',
        component: Layout,
        redirect: '/dealers/dealers-list',
        name: 'DealersManagement',
        meta: {
            title: '经销商管理',
            icon: 'i_s_dashboard',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'dealers-list',
                name: 'DealersList',
                component: () => import('@/views/dealers/dealers-list.vue'),
                meta: {
                    title: '经销商列表',
                }
            },
            {
                path: 'dealers-edit',
                name: 'DealersEdit',
                component: () => import('@/views/dealers/dealers-edit.vue'),
                hidden: true,
                meta: {
                    title: '经销商编辑',
                    parent: '/dealers/dealers-list',
                }
            },
            {
                path: 'dealers-detail',
                name: 'DealersDetail',
                component: () => import('@/views/dealers/dealers-detail.vue'),
                hidden: true,
                meta: {
                    title: '经销商详情',
                    parent: '/dealers/dealers-list',
                }
            },
        ]
    },
    {   // 仓库
        path: '/warehouse',
        component: Layout,
        redirect: '/warehouse/warehouse-list',
        name: 'WarehouseManagement',
        meta: {
            title: '仓库管理',
            icon: 'i_s_dashboard',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'warehouse-list',
                name: 'WarehouseList',
                component: () => import('@/views/warehouse/warehouse-list.vue'),
                meta: {
                    title: '仓库列表',
                }
            },
            {
                path: 'warehouse-edit',
                name: 'WarehouseEdit',
                component: () => import('@/views/warehouse/warehouse-edit.vue'),
                hidden: true,
                meta: {
                    title: '仓库编辑',
                    parent: '/warehouse/warehouse-list',
                }
            },
            {
                path: 'warehouse-detail',
                name: 'WarehouseDetail',
                component: () => import('@/views/warehouse/warehouse-detail.vue'),
                hidden: true,
                meta: {
                    title: '仓库详情',
                    parent: '/warehouse/warehouse-list',
                }
            },
        ]
    },
    {   // 商品
        path: '/item',
        component: Layout,
        redirect: '/item/item-list',
        name: 'ItemManagement',
        meta: {
            title: '商品管理',
            icon: 'i_s_dashboard',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'item-list',
                name: 'ItemList',
                component: () => import('@/views/item/item-list.vue'),
                meta: {
                    title: '采购',
                }
            },
            {
                path: 'item-edit',
                name: 'ItemEdit',
                component: () => import('@/views/item/item-edit.vue'),
                hidden: true,
                meta: {
                    title: '商品编辑',
                    parent: '/item/item-list',
                }
            },
            {
                path: 'item-detail',
                name: 'ItemDetail',
                component: () => import('@/views/item/item-detail.vue'),
                hidden: true,
                meta: {
                    title: '商品详情',
                    parent: '/item/item-list',
                }
            },
            {
                path: 'shop-cart-list',
                name: 'ShopCartList',
                component: () => import('@/views/item/shop-cart-list.vue'),
                meta: {
                    title: '购物车',
                }
            },
        ]
    },
    {   // 员工管理
        path: '/user',
        component: Layout,
        redirect: '/user/user-list',
        name: 'UserManagement',
        meta: {
            title: '员工管理',
            icon: 'i_s_dashboard',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'user-list',
                name: 'UserList',
                component: () => import('@/views/user/user-list.vue'),
                meta: {
                    title: '员工列表',
                }
            },
            {
                path: 'user-edit',
                name: 'UserEdit',
                component: () => import('@/views/user/user-edit.vue'),
                hidden: true,
                meta: {
                    title: '员工编辑',
                    parent: '/user/user-list',
                }
            },
            {
                path: 'user-detail',
                name: 'ItemDetail',
                component: () => import('@/views/user/user-detail.vue'),
                hidden: true,
                meta: {
                    title: '员工详情',
                    parent: '/user/user-list',
                }
            },
        ]
    },
];

export default routes;

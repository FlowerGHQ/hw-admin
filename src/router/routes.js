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
    {   // 看板
        path: '/dashboard',
        component: Layout,
        // hidden: true,
        meta: {
            title: '时效看板',
            icon: 'i_s_temp',
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
            icon: 'i_s_temp',
            // auth: ['dashboard'],
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
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
            {
                path: 'repair-invoice',
                name: 'RepairInvoice',
                component: () => import('@/views/repair/repair-invoice.vue'),
                hidden: true,
                meta: {
                    title: '维修单详情',
                    parent: '/repair/repair-list',
                }
            },
        ]
    },
    {   // 经销商管理 - 平台端
        path: '/agent',
        component: Layout,
        redirect: '/agent/agent-list',
        name: 'AgentManagement',
        meta: {
            title: '经销商管理',
            icon: 'i_s_temp',
            // auth: ['dashboard'],
            roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'agent-list',
                name: 'AgentList',
                component: () => import('@/views/agent/agent-list.vue'),
                meta: {
                    title: '经销商列表',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'agent-edit',
                name: 'AgentEdit',
                component: () => import('@/views/agent/agent-edit.vue'),
                hidden: true,
                meta: {
                    title: '经销商编辑',
                    parent: '/agent/agent-list',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'agent-detail',
                name: 'AgentDetail',
                component: () => import('@/views/agent/agent-detail.vue'),
                hidden: true,
                meta: {
                    title: '经销商详情',
                    parent: '/agent/agent-list',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
        ]
    },
    {   // 经销商管理 - 经销商端
        path: '/agent/agent-detail-sp',
        component: Layout,
        meta: {
            title: '经销商管理',
            icon: 'i_s_temp',
            roles: [LOGIN_TYPE.AGENT],
        },
        children: [
            {
                path: '',
                name: 'AgentManagementSp',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    title: '经销商详情',
                    roles: [LOGIN_TYPE.AGENT],
                    is_sub_menu: true
                }
            },
        ]
    },
    {   // 门店管理 - 平台端&经销商端
        path: '/store',
        component: Layout,
        redirect: '/store/store-list',
        name: 'StoreManagement',
        meta: {
            title: '门店管理',
            icon: 'i_s_temp',
            // auth: ['dashboard'],
            roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT],
        },
        children: [
            {
                path: 'store-list',
                name: 'StoreList',
                component: () => import('@/views/store/store-list.vue'),
                meta: {
                    title: '门店列表',
                }
            },
            {
                path: 'store-edit',
                name: 'StoreEdit',
                component: () => import('@/views/store/store-edit.vue'),
                hidden: true,
                meta: {
                    title: '门店编辑',
                    parent: '/store/store-list',
                }
            },
            {
                path: 'store-detail',
                name: 'StoreDetail',
                component: () => import('@/views/store/store-detail.vue'),
                hidden: true,
                meta: {
                    title: '门店详情',
                    parent: '/store/store-list',
                }
            },
        ]
    },
    {   // 门店管理 - 门店端
        path: '/store/store-detail-sp',
        component: Layout,
        meta: {
            title: '门店管理',
            icon: 'i_s_temp',
            roles: [LOGIN_TYPE.STORE],
        },
        children: [
            {
                path: '',
                name: 'StoreManagementSp',
                component: () => import('@/views/store/store-detail.vue'),
                meta: {
                    title: '门店详情',
                    roles: [LOGIN_TYPE.STORE],
                    is_sub_menu: true
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
            icon: 'i_s_temp',
            // auth: ['dashboard'],
            roles: [LOGIN_TYPE.ADMIN],
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
<<<<<<< HEAD
            // {
            //     path: 'warehouse-detail',
            //     name: 'WarehouseDetail',
            //     component: () => import('@/views/warehouse/warehouse-detail.vue'),
            //     hidden: true,
            //     meta: {
            //         title: '仓库详情',
            //         parent: '/warehouse/warehouse-list',
            //     }
            // },
=======
>>>>>>> 5643925d489e8d38e2f198f06262fe1ed5c49237
        ]
    },
    {   // 商品 - 平台端
        path: '/item',
        component: Layout,
        redirect: '/item/item-list',
        name: 'ItemManagement',
        meta: {
            title: '商品管理',
            icon: 'i_s_temp',
            roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'item-list',
                name: 'ItemList',
                component: () => import('@/views/item/item-list.vue'),
                meta: {
                    title: '商品列表',
                    roles: [LOGIN_TYPE.ADMIN],
                    is_sub_menu: true
                }
            },
            {
                path: 'item-edit',
                name: 'ItemEdit',
                component: () => import('@/views/item/item-edit.vue'),
                hidden: true,
                meta: {
                    title: '商品编辑',
                    roles: [LOGIN_TYPE.ADMIN],
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
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/item-list',
                }
            },
            {
                path: 'item-category',
                name: 'ItemCategory',
                component: () => import('@/views/item/item-category.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '商品分类',
                    is_sub_menu: true,
                }
            },
            {
                path: 'item-category-config',
                name: 'ItemCategoryConfig',
                component: () => import('@/views/item/item-category-config.vue'),
                hidden: true,
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '商品分类配置',
                    is_sub_menu: true,
                }
            },
            {
                path: 'purchase-order-list',
                name: 'PurchaseOrderListAdmin',
                component: () => import('@/views/item/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN],
                    title: '采购订单',
                    is_sub_menu: true,
                }
            },
        ]
    },
    {   // 商品&采购 - 经销商端 && 门店端
        path: '/purchase',
        component: Layout,
        redirect: '/purchase/item-list',
        name: 'PurchaseManagement',
        meta: {
            title: '采购管理',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN],
            auth: ['AGENT', 'STORE'],
            icon: 'i_s_temp',
        },
        children: [
            {
                path: 'item-list',
                name: 'ItemListSp',
                component: () => import('@/views/item/item-list.vue'),
                meta: {
                    title: '采购',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
                    is_sub_menu: true
                }
            },
            {
                path: 'item-display',
                name: 'ItemDisplay',
                component: () => import('@/views/item/item-display.vue'),
                hidden: true,
                meta: {
                    title: '商品详情',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
                    is_sub_menu: true
                }
            },
            {
                path: 'item-collect',
                name: 'ItemCollect',
                component: () => import('@/views/item/item-collect.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
                    title: '购物车',
                    is_sub_menu: true,
                }
            },
            {
                path: 'item-settle',
                name: 'ItemSettle',
                component: () => import('@/views/item/item-settle.vue'),
                hidden: true,
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
                    title: '结算',
                }
            },
            {
                path: 'purchase-order-list',
                name: 'PurchaseOrderList',
                component: () => import('@/views/item/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN],
                    title: '采购订单',
                    is_sub_menu: true,
                }
            },
            {
                path: 'purchase-order-detail',
                name: 'PurchaseOrderDetail',
                component: () => import('@/views/item/purchase-order-detail.vue'),
                hidden: true,
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN],
                    title: '采购订单详情',
                }
            },
        ]
    },
    {   // 客户管理
        path: '/customer',
        component: Layout,
        redirect: '/customer/customer-list',
        name: 'CustomerManagement',
        meta: {
            title: '客户管理',
            icon: 'i_s_temp',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'customer-list',
                name: 'CustomerList',
                component: () => import('@/views/customer/customer-list.vue'),
                meta: {
                    title: '客户列表',
                }
            },
            {
                path: 'customer-edit',
                name: 'CustomerEdit',
                component: () => import('@/views/customer/customer-edit.vue'),
                hidden: true,
                meta: {
                    title: '新建客户',
                    parent: '/customer/customer-list',
                }
            },
<<<<<<< HEAD

            // {
            //     path: 'customer-detail',
            //     name: 'CustomerDetail',
            //     component: () => import('@/views/customer/customer-detail.vue'),
            //     hidden: true,
            //     meta: {
            //         title: '客户详情',
            //         parent: '/customer/customer-list',
            //     }
            // },
=======
>>>>>>> 5643925d489e8d38e2f198f06262fe1ed5c49237
        ]
    },
    {   // 员工管理
        path: '/user',
        component: Layout,
        redirect: '/user/user-list',
        name: 'UserManagement',
        meta: {
            title: '员工管理',
            icon: 'i_s_temp',
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
                name: 'UserDetail',
                component: () => import('@/views/user/user-detail.vue'),
                hidden: true,
                meta: {
                    title: '员工详情',
                    parent: '/user/user-list',
                }
            },
        ]

    },
    {   // 系统消息
        path: '/notice',
        component: Layout,
        redirect: '/notice/notice-list',
        name: 'NoticeManagement',
        meta: {
            title: '系统消息',
            icon: 'i_s_temp',
            // auth: ['dashboard'],
            roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'notice-list',
                name: 'NoticeList',
                component: () => import('@/views/notice/notice-list.vue'),
                meta: {
                    title: '系统列表',
                }
            },
            {
                path: 'notice-edit',
                name: 'NoticeEdit',
                component: () => import('@/views/notice/notice-edit.vue'),
                hidden: true,
                meta: {
                    title: '新增系统',
                    parent: '/notice/notice-list',
                }

            },
<<<<<<< HEAD
            // {
            //     path: 'notice-detail',
            //     name: 'NoticeDetail',
            //     component: () => import('@/views/notice/notice-detail.vue'),
            //     hidden: true,
            //     meta: {
            //         title: '系统详情',
            //         parent: '/notice/notice-list',
            //     }
            // },
=======

>>>>>>> 5643925d489e8d38e2f198f06262fe1ed5c49237
        ]
    },
];

export default routes;

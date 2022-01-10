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
            title: '数据看板',
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
            icon: 'i_s_repair',
            // auth: ['dashboard'],
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN,  LOGIN_TYPE.DISTRIBUTOR],
        },
        children: [
            {
                path: 'repair-list',
                name: 'RepairList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '维修单列表',
                    is_sub_menu: true
                }
            },
            {
                path: 'repair-list-audit',
                name: 'RepairListAudit',
                component: () => import('@/views/repair/repair-list-audit.vue'),
                meta: {
                    title: '待审工单列表',
                    roles: [LOGIN_TYPE.ADMIN],
                    is_sub_menu: true
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
                    title: '维修单结算',
                    parent: '/repair/repair-list',
                }
            },
            {
                path: 'item-fault-list',
                name: 'FaultList',
                component: () => import('@/views/repair/item-fault-list.vue'),
                meta: {
                    title: '故障管理',
                    roles: [LOGIN_TYPE.ADMIN],
                    is_sub_menu: true
                }
            },
            {
                path: 'item-fault-edit',
                name: 'FaultEdit',
                component: () => import('@/views/repair/item-fault-edit.vue'),
                hidden: true,
                meta: {
                    title: '故障编辑',
                    title_en: 'fault-edit',
                    parent: '/repair/item-fault-list',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
        ]
    },
    {   // 维修单 结算下载
        path: '/repair/invoice-download',
        name: 'RepairInvoiceExport',
        component: () => import('@/views/repair/repair-invoice.vue'),
        hidden: true,
        meta: {
            title: '维修单结算',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE,  LOGIN_TYPE.DISTRIBUTOR],
        },
    },
    {   // 分销商管理 - 平台端
        path: '/distributor',
        component: Layout,
        redirect: '/distributor/distributor-list',
        name: 'DistributorManagement',
        meta: {
            title: '分销商管理',
            icon: 'i_s_agent',
            // auth: ['dashboard'],
            roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'distributor-list',
                name: 'DistributorList',
                component: () => import('@/views/distributor/distributor-list.vue'),
                meta: {
                    title: '分销商列表',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'distributor-edit',
                name: 'DistributorEdit',
                component: () => import('@/views/distributor/distributor-edit.vue'),
                hidden: true,
                meta: {
                    title: '分销商编辑',
                    parent: '/distributor/distributor-list',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'distributor-detail',
                name: 'DistributorDetail',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                hidden: true,
                meta: {
                    title: '分销商详情',
                    parent: '/distributor/distributor-list',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
        ]
    },
    {   // 分销商管理 - 分销商端
        path: '/distributor/distributor-detail-sp',
        component: Layout,
        meta: {
            title: '分销商管理',
            icon: 'i_s_agent',
            roles: [LOGIN_TYPE.DISTRIBUTOR],
        },
        children: [
            {
                path: '',
                name: 'DistributorManagementSp',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                meta: {
                    title: '分销商详情',
                    roles: [LOGIN_TYPE.DISTRIBUTOR],
                    is_sub_menu: true
                }
            },
        ]
    },
    {   // 经销商管理 - 平台端 分销商端
        path: '/agent',
        component: Layout,
        redirect: '/agent/agent-list',
        name: 'AgentManagement',
        meta: {
            title: '经销商管理',
            icon: 'i_s_agent',
            roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
        },
        children: [
            {
                path: 'agent-list',
                name: 'AgentList',
                component: () => import('@/views/agent/agent-list.vue'),
                meta: {
                    title: '经销商列表',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
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
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
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
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                }
            },
        ]
    },
    {   // 经销商管理 - 经销商端
        path: '/agent/agent-detail-sp',
        component: Layout,
        meta: {
            title: '经销商管理',
            icon: 'i_s_agent',
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
            icon: 'i_s_store',
            // auth: ['dashboard'],
            roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT, LOGIN_TYPE.DISTRIBUTOR],
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
            icon: 'i_s_store',
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
            icon: 'i_s_warehouse',
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
                    // is_sub_menu: true
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
            {
                path: 'stock-edit',
                name: 'StockEdit',
                component: () => import('@/views/warehouse/stock-edit.vue'),
                hidden: true,
                meta: {
                    title: '库存增减',
                    parent: '/warehouse/warehouse-detail',
                }
            },
        ]
    },
    {   // 商品 - 平台端
        path: '/item',
        component: Layout,
        redirect: '/item/item-list',
        name: 'ItemManagement',
        meta: {
            title: '商品管理',
            icon: 'i_s_item',
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
                path: 'sales-area-list',
                name: 'SalesList',
                component: () => import('@/views/item/sales-area-list.vue'),
                meta: {
                    title: '销售区域',
                    roles: [LOGIN_TYPE.ADMIN],
                    is_sub_menu: true
                }
            },
            {
                path: 'sales-area-edit',
                name: 'SalesEdit',
                component: () => import('@/views/item/sales-area-edit.vue'),
                hidden: true,
                meta: {
                    title: '区域编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/sales-area-list',
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
    {   // 商品&采购 - 经销商端 && 门店端 && 分销商端
        path: '/purchase',
        component: Layout,
        redirect: '/purchase/item-list',
        name: 'PurchaseManagement',
        meta: {
            title: '采购管理',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
            auth: ['AGENT', 'STORE','DISTRIBUTOR'],
            icon: 'i_s_item',
        },
        children: [
            {
                path: 'item-list',
                name: 'ItemListSp',
                component: () => import('@/views/item/item-list.vue'),
                meta: {
                    title: '采购',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
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
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    is_sub_menu: true
                }
            },
            {
                path: 'item-collect',
                name: 'ItemCollect',
                component: () => import('@/views/item/item-collect.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
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
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '结算',
                }
            },
            {
                path: 'purchase-order-list',
                name: 'PurchaseOrderList',
                component: () => import('@/views/item/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
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
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title: '采购订单详情',
                }
            },
        ]
    },
    {   // 退款管理
        path: '/refund',
        component: Layout,
        redirect: '/refund/refund-list',
        name: 'RefundManagement',
        hidden: false,
        meta: {
            title: '退款管理',
            icon: 'i_s_temp',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'refund-list',
                name: 'RefundList',
                component: () => import('@/views/refund/refund-list.vue'),
                meta: {
                    title: '退款列表',
                }
            },
            {
                path: 'refund-create',
                name: 'RefundCreate',
                component: () => import('@/views/refund/refund-create.vue'),
                hidden: true,
                meta: {
                    title: '新增退款',
                    parent: '/refund/refund-list',
                }

            },
            {
                path: 'refund-detail',
                name: 'RefundDetail',
                component: () => import('@/views/refund/refund-detail.vue'),
                hidden: true,
                meta: {
                    title: '退款详情',
                    parent: '/refund/refund-list',
                }
            },
            /* {
                path: 'refund-audit',
                name: 'RefundAudit',
                component: () => import('@/views/refund/refund-audit.vue'),
                hidden: true,
                meta: {
                    title: '退款审核',
                    parent: '/refund/refund-list',
                }
            }, */
        ]
    },
    {   // 客户管理
        path: '/customer',
        component: Layout,
        redirect: '/customer/customer-list',
        name: 'CustomerManagement',
        meta: {
            title: '客户管理',
            icon: 'i_s_customer',
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
        ]
    },
    {   // 员工管理
        path: '/user',
        component: Layout,
        redirect: '/user/user-list',
        name: 'UserManagement',
        meta: {
            title: '员工管理',
            icon: 'i_s_user',
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
    {   // 角色管理
        path: '/authority',
        component: Layout,
        redirect: '/authority/auth-role-list',
        name: 'AuthManagement',
        hidden: false,
        meta: {
            title: '角色管理',
            icon: 'i_s_temp',
            auth: ['MANAGER']
        },
        children: [
            {
                path: 'auth-role-list',
                name: 'RoleList',
                component: () => import('@/views/authority/auth-role-list.vue'),
                meta: {
                    title: '角色管理',
                }
            },
            {
                path: 'auth-role-edit',
                name: 'RoleEdit',
                component: () => import('@/views/authority/auth-role-edit.vue'),
                hidden: true,
                meta: {
                    title: '角色编辑',
                    parent: '/authority/auth-role-list',
                }

            },
        ]
    },
    {   // 系统管理
        path: '/system',
        component: Layout,
        redirect: '/system/system-file-list',
        name: 'SystemManagement',
        hidden: false,
        meta: {
            title: '系统管理',
            icon: 'i_s_temp',
        },
        children: [
            {
                path: 'system-file-list',
                name: 'SystemFileList',
                component: () => import('@/views/system/system-file-list.vue'),
                meta: {
                    title: '系统文件',
                    is_sub_menu: true,
                }
            },
            {
                path: 'system-file-edit',
                name: 'SystemFileEdit',
                component: () => import('@/views/system/system-file-edit.vue'),
                hidden: true,
                meta: {
                    title: '文件编辑',
                    parent: '/system/system-file-list',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'allot-org-auth',
                name: 'AllotOrgAuth',
                component: () => import('@/views/system/allot-org-auth.vue'),
                meta: {
                    title: '组织权限管理',
                    is_sub_menu: true,
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
        ]
    },
    {   // 系统消息
        path: '/notice',
        component: Layout,
        redirect: '/notice/notice-list',
        name: 'NoticeManagement',
        hidden: false,
        meta: {
            title: '系统消息',
            icon: 'i_s_temp',
        },
        children: [
            {
                path: 'notice-list',
                name: 'NoticeList',
                component: () => import('@/views/notice/notice-list.vue'),
                meta: {
                    title: '消息列表',
                }
            },
            {
                path: 'notice-edit',
                name: 'NoticeEdit',
                component: () => import('@/views/notice/notice-edit.vue'),
                hidden: true,
                meta: {
                    title: '新增消息',
                    parent: '/notice/notice-list',
                }
            },
            {
                path: 'notice-detail',
                name: 'NoticeDetail',
                component: () => import('@/views/notice/notice-detail.vue'),
                hidden: true,
                meta: {
                    title: '消息详情',
                    parent: '/notice/notice-list',
                }
            },
        ]
    },
];

export default routes;

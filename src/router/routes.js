import Const from '../core/const';
import Util from '../core/utils';
import Data from '../core/data';

import Layout from '../views/layout/index.vue';

// 供应商路由
import { supplyManage, supplyRouters, supplyMaterialManagement } from './supply-router';
// 新分销商路由
import { mallRouters, dealsPreview } from './mall';
// 分销商路由
import { customerCare } from './distributor-router';
// 平台方路由
import { inquiryManagement, adminEmpty, operationManagement } from './admin-router';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.LOGIN.ROUTER_TYPE;
const PURCHASE_SEARCH_TYPE = Const.PURCHASE.SEARCH_TYPE;
const REFUND_QUERY_TYPE = Const.AFTERSALES.QUERY_TYPE;
const NOW_LOGIN_TYPE = Data.getLoginType();

// 重定向
let indexPath = '';
switch (NOW_LOGIN_TYPE) {
    case LOGIN_TYPE.ADMIN:
        indexPath = '/distributor';
        break;
    case LOGIN_TYPE.DISTRIBUTOR:
        indexPath = '/mall/index';
        break;
    case LOGIN_TYPE.AGENT:
        indexPath = '/mall/index';
        break;
    case LOGIN_TYPE.STORE:
        indexPath = '/mall/index';
        break;
    case LOGIN_TYPE.SUPPLIER:
        indexPath = '/supply-home';
        break;
    default:
        break;
}
/**
 * @params type 这个权限是 销售/售后/生产/CRM 路口的权限 整个模块
 * @params meta.roles 这个权限是 在平台方 / 分销商 / 零售商 / 门店 下显示的权限
 * @params meta.auth 这个权限是在系统那边配置每一个用户或者角色的权限显示与否
 * @params meta.parent 类似于list里面有添加编辑需要给个上一级的地址让其显示
 * @params meta.hideen判断是否显示到侧边栏上 true为不显示
 * @params meta.not_sub_menu: true判断当前路由是否是一级标签
 * @params meta.super_admin_show: 只在权限为ADMIN(平台方的时候有用) 判断这个路由是否只展示在超级管理员中
 * @params children meta.admin_module: 区分在admin中四大 销售/售后/生产/CRM 路口的权限 子模块判断(判断例如  商品管理(子 BOM管理)即在销售/售后中 但是需要售后有[BOM管理] 销售不需要[BOM管理])
 */
const routes = [
    {
        path: '/',
        redirect: indexPath,
    },
    {
        // 飞书跳转
        path: '/login-redirect',
        component: () => import('@/views/login-redirect.vue'),
        meta: {
            hidden: true,
            title: '登录重定向',
            title_en: 'login-redirect',
        },
    },
    {
        // 登录
        path: '/login',
        component: () => import('@/views/mall/Login.vue'),
        meta: {
            hidden: true,
            title: '登录',
            title_en: 'Login',
        },
    },
    // { // 分销商登录
    //     path: '/loginMall',
    //     component: () => import ('@/views/mall/Login.vue'),
    //     meta: {
    //         hidden: true,
    //         title: '登录',
    //         title_en: 'Login',
    //     }
    // },
    mallRouters,
    dealsPreview,
    {
        // 看板
        path: '/dashboard',
        component: Layout,
        name: 'Dashboard',
        redirect: '/dashboard/index',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER, ROUTER_TYPE.PRODUCTION],
        meta: {
            title: '商城',
            title_en: 'Data Board',
            icon: 'i_s_dashboard',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
        },
        children: [
            {
                path: 'index',
                name: 'Index',
                component: () => import('@/views/dashboard/Analytics.vue'),
                meta: {
                    title: '首页',
                    title_en: 'Index',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                },
            },
            {
                path: '',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/Dashboard.vue'),
                meta: {
                    title: '时效看板',
                    title_en: 'RTDB',
                    hidden: true,
                },
            },
        ],
    },
    // { // 看板
    //     path: '/test-report',
    //     component: Layout,
    //     name: 'TestReport',
    //     redirect: '/test-report/list',
    //     meta: {
    //         title: '测试报告',
    //         title_en: 'Test Report',
    //         icon: 'i_s_dashboard',
    //     },
    //     children: [
    //         {
    //             path: 'list',
    //             name: 'TestReportList',
    //             component: () => import('@/views/test-report/test-report-list.vue'),
    //             meta: {
    //                 title: '测试报告',
    //                 title_en: 'Test Report List',
    //                 roles: [LOGIN_TYPE.ADMIN],
    //             }
    //         },
    //     ]
    // },

    {
        // 维修单 结算下载
        path: '/repair/invoice-download',
        name: 'RepairInvoiceExport',
        component: () => import('@/views/repair/repair-invoice.vue'),
        type: [ROUTER_TYPE.AFTER],
        meta: {
            hidden: true,
            title: '维修单结算',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
        },
    },
    {
        // 分销管理 - 平台端
        path: '/distributor',
        component: Layout,
        redirect: '/distributor/purchase-order-list',
        name: 'DistributorManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER],
        meta: {
            title: '分销管理',
            title_en: 'Distribution',
            icon: 'i_s_agent',
            auth: ['distributor.list', 'agent.list', 'store.list', 'purchase-order.list', 'sales-area.list'],
        },
        children: [
            {
                path: 'purchase-order-list',
                name: 'AdminPurchaseOrderListAll',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    title: '订单列表',
                    title_en: 'Order List',
                    search_type: PURCHASE_SEARCH_TYPE.ALL,
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['purchase-order.list'],
                },
            },
            {
                path: 'purchase-order-children',
                name: 'AdminPurchaseOrderListChildren',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    title: '供货订单',
                    title_en: 'Supply order',
                    search_type: PURCHASE_SEARCH_TYPE.CHILDREN,
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['purchase-order.list'],
                },
            },
            {
                path: 'distributor-list',
                name: 'DistributorList',
                component: () => import('@/views/distributor/distributor-list.vue'),
                meta: {
                    title: '分销商列表',
                    title_en: 'Distributors',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['distributor.list'],
                },
            },
            {
                path: 'distributor-edit',
                name: 'DistributorEdit',
                component: () => import('@/views/distributor/distributor-edit.vue'),
                meta: {
                    hidden: true,
                    title: '分销商编辑',
                    parent: '/distributor/distributor-list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['distributor.save'],
                },
            },
            {
                path: 'distributor-detail',
                name: 'DistributorDetail',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                meta: {
                    hidden: true,
                    title: '分销商详情',
                    parent: '/distributor/distributor-list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['distributor.detail'],
                },
            },
            {
                path: 'distributor-detail-sp',
                name: 'DistributorDetailSp',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                meta: {
                    title: '分销商详情',
                    title_en: 'Details',
                    roles: [LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['distributor.detail'],
                },
            },
            {
                path: 'agent-list',
                name: 'AgentList',
                component: () => import('@/views/agent/agent-list.vue'),
                meta: {
                    title: '零售商列表',
                    title_en: 'List of retailers',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
                    auth: ['agent.list'],
                },
            },
            {
                path: 'agent-edit',
                name: 'AgentEdit',
                component: () => import('@/views/agent/agent-edit.vue'),
                meta: {
                    hidden: true,
                    title: '零售商编辑',
                    parent: '/distributor/agent-list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
                    auth: ['agent.save'],
                },
            },
            {
                path: 'agent-detail',
                name: 'AgentDetail',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    hidden: true,
                    title: '零售商详情',
                    parent: '/distributor/agent-list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
                    auth: ['agent.detail'],
                },
            },
            {
                path: 'agent-detail-sp',
                name: 'AgentDetailSp',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    title: '零售商详情',
                    title_en: 'Details',
                    roles: [LOGIN_TYPE.AGENT],
                    auth: ['agent.detail'],
                },
            },
            {
                path: 'store-list',
                name: 'StoreList',
                component: () => import('@/views/store/store-list.vue'),
                meta: {
                    title: '门店列表',
                    title_en: 'Store list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT],
                    auth: ['store.list'],
                },
            },
            {
                path: 'store-edit',
                name: 'StoreEdit',
                component: () => import('@/views/store/store-edit.vue'),
                meta: {
                    hidden: true,
                    title: '门店编辑',
                    parent: '/distributor/store-list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT],
                    auth: ['store.save'],
                },
            },
            {
                path: 'store-detail',
                name: 'StoreDetail',
                component: () => import('@/views/store/store-detail.vue'),
                meta: {
                    hidden: true,
                    title: '门店详情',
                    parent: '/distributor/store-list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT],
                    auth: ['store.detail'],
                },
            },
            {
                path: 'store-detail-sp',
                name: 'StoreDetailSp',
                component: () => import('@/views/store/store-detail.vue'),
                meta: {
                    title: '门店详情',
                    title_en: 'Details',
                    roles: [LOGIN_TYPE.STORE],
                    auth: ['store.detail'],
                },
            },
            {
                path: 'sales-area-list',
                name: 'SalesList',
                component: () => import('@/views/item/sales-area-list.vue'),
                meta: {
                    title: '销售区域',
                    title_en: 'Sales area',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['sales-area.list'],
                },
            },
            {
                path: 'sales-area-detail',
                name: 'SalesAreaDetail',
                component: () => import('@/views/item//sales-area-detail.vue'),
                meta: {
                    hidden: true,
                    title: '销售区域详情',
                    parent: '/sales-area-list',
                    auth: ['sales-area.detail'],
                    // auth: ['warehouse.list'],
                },
            },
            {
                path: 'sales-area-edit',
                name: 'SalesEdit',
                component: () => import('@/views/item/sales-area-edit.vue'),
                meta: {
                    hidden: true,
                    title: '区域编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/sales-area-list',
                    auth: ['sales-area.save'],
                },
            },
        ],
    },
    /* { // 分销商管理 - 分销商端
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
                }
            },
        ]
    },*/
    {
        // 采购管理 - 经销商端 && 门店端 && 分销商端
        path: '/purchase',
        component: Layout,
        redirect: '/purchase/purchase-order-list',
        name: 'PurchaseManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER],
        meta: {
            title: '采购管理',
            title_en: 'Purchase',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
            icon: 'i_s_item',
        },
        children: [
            {
                path: 'item-list',
                name: 'PurchaseItemList',
                component: () => import('@/views/purchase/item-index.vue'),
                meta: {
                    title: '采购',
                    title_en: 'Purchase',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['item.list'],
                    hidden: true,
                },
            },
            {
                path: 'item-display',
                name: 'ItemDisplay',
                component: () => import('@/views/purchase/item-display.vue'),
                meta: {
                    hidden: true,
                    title: '商品详情',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['item.detail'],
                },
            },
            {
                path: 'item-collect',
                name: 'ItemCollect',
                component: () => import('@/views/purchase/item-collect.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '购物车',
                    title_en: 'Shopping cart',
                    auth: ['purchase-order.save'],
                    hidden: true,
                },
            },
            {
                path: 'item-settle',
                name: 'ItemSettle',
                component: () => import('@/views/purchase/item-settle.vue'),
                meta: {
                    hidden: true,
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '结算',
                    auth: ['purchase-order.save'],
                },
            },
            {
                path: 'purchase-order-list',
                name: 'PurchaseOrderList',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '订单列表',
                    title_en: 'Order List',
                    search_type: PURCHASE_SEARCH_TYPE.ALL,
                    auth: ['purchase-order.list'],
                },
            },
            {
                path: 'purchase-order-self',
                name: 'PurchaseOrderListSelf',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '采购订单',
                    title_en: 'Purchase order',
                    search_type: PURCHASE_SEARCH_TYPE.SELF,
                    auth: ['purchase-order.list'],
                },
            },
            {
                path: 'purchase-order-children',
                name: 'PurchaseOrderListChildren',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title: '供货订单',
                    title_en: 'Supply orders',
                    search_type: PURCHASE_SEARCH_TYPE.CHILDREN,
                    auth: ['purchase-order.list'],
                },
            },
            {
                path: 'purchase-order-detail',
                name: 'PurchaseOrderDetail',
                component: () => import('@/views/purchase/purchase-order-detail.vue'),
                meta: {
                    hidden: true,
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title: '采购订单详情',
                    auth: ['purchase-order.detail'],
                },
            },
        ],
    },
    {
        //商品管理 - 平台端
        path: '/item',
        component: Layout,
        redirect: '/item/item-list',
        name: 'ItemManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER],
        meta: {
            title: '商品管理',
            title_en: 'Product',
            icon: 'i_menu_shangpingguanli',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['item.list', 'item-category.list'],
        },
        children: [
            {
                path: 'item-list',
                name: 'ItemList',
                component: () => import('@/views/item/item-list.vue'),
                meta: {
                    title: '商品列表',
                    title_en: 'Product list',
                    auth: ['item.list'],
                },
            },
            {
                path: 'item-edit',
                name: 'ItemEdit',
                component: () => import('@/views/item/item-edit.vue'),
                meta: {
                    hidden: true,
                    title: '商品编辑',
                    parent: '/item/item-list',
                    auth: ['item.save'],
                },
            },
            {
                path: 'item-detail',
                name: 'ItemDetail',
                component: () => import('@/views/item/item-detail.vue'),
                meta: {
                    hidden: true,
                    title: '商品详情',
                    parent: '/item/item-list',
                    auth: ['item.detail'],
                },
            },
            {
                path: 'item-explored-edit',
                name: 'ItemExploredEdit',
                component: () => import('@/views/item/item-explored-edit.vue'),
                meta: {
                    hidden: true,
                    title: '商品爆炸图详情',
                    parent: '/item/item-list',
                    auth: ['item.save'],
                },
            },
            {
                path: 'item-category',
                name: 'ItemCategory',
                component: () => import('@/views/item/item-category.vue'),
                meta: {
                    title: '商品分类',
                    title_en: 'Categories',
                    auth: ['item-category.list'],
                },
            },
            {
                path: 'item-category-config',
                name: 'ItemCategoryConfig',
                component: () => import('@/views/item/item-category-config.vue'),
                meta: {
                    hidden: true,
                    title: '商品分类配置',
                },
            },
            {
                path: 'Item-category-explored',
                name: 'ItemCategoryExplored',
                component: () => import('@/views/item/Item-category-explored.vue'),
                meta: {
                    hidden: true,
                    title: '商品爆炸图编辑',
                },
            },
            {
                path: 'item-bom',
                name: 'ItemBom',
                component: () => import('@/views/item/item-bom.vue'),
                meta: {
                    title: 'BOM管理',
                    title_en: 'BOM Management',
                    admin_module: [ROUTER_TYPE.AFTER],
                    auth: ['aftermarket-bom.list'],
                },
            },
        ],
    },
    {
        // 实例管理
        path: '/entity',
        component: Layout,
        redirect: '/entity/vehicle-list',
        name: 'EntityManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.PRODUCTION],
        meta: {
            title: '实例管理',
            title_en: 'Instance',
            icon: 'i_menu_shiliguanli',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['entity.list'],
        },
        children: [
            {
                path: 'vehicle-list',
                name: 'VehicleList',
                component: () => import('@/views/entity/entity-list.vue'),
                meta: {
                    title: '整车列表',
                    title_en: 'Vehicles list',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: 'vehicle',
                    auth: ['entity.list'],
                },
            },
            {
                path: 'part-list',
                name: 'PartList',
                component: () => import('@/views/entity/entity-list.vue'),
                meta: {
                    title: '零部件列表',
                    title_en: 'Parts',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: 'part',
                    auth: ['entity.list'],
                },
            },
            {
                path: 'entity-detail',
                name: 'EntityDetail',
                component: () => import('@/views/entity/entity-detail.vue'),
                meta: {
                    hidden: true,
                    title: '车架详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/entity/entity-list',
                    auth: ['entity.detail'],
                },
            },
        ],
    },
    // { // 三包管理 - 平台端
    //     path: '/warranty',
    //     component: Layout,
    //     redirect: '/warranty/time-config',
    //     name: 'Warranty',
    //     type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER],
    //     meta: {
    //         title: '三包管理',
    //         title_en: 'Warranty Management',
    //         icon: 'i_s_temp',
    //         roles: [LOGIN_TYPE.ADMIN],
    //         // auth: ['warranty.time-config','warranty.list'],
    //     },
    //     children: [
    //         {
    //             path: 'warranty-time-config',
    //             name: 'warrantyConfig',
    //             component: () => import('@/views/warranty/time-config.vue'),
    //             meta: {
    //                 title: '生效时间',
    //                 title_en: 'Effective Time',
    //                 roles: [LOGIN_TYPE.ADMIN],
    //             }
    //         },
    //         {
    //             path: 'warranty-list',
    //             name: 'WarrantyList',
    //             component: () => import('@/views/warranty/warranty-list.vue'),
    //             meta: {
    //                 title: '三包时长',
    //                 title_en: 'Warranty Duration',
    //                 roles: [LOGIN_TYPE.ADMIN],
    //             }
    //         },
    //     ]
    // },
    // { // 售后管理 - 平台 && 分销
    //     path: '/aftersales-supply',
    //     component: Layout,
    //     redirect: '/aftersales-supply/aftersales-supply-list',
    //     name: 'AftersalesSupplyManagement',
    //     meta: {
    //         title: '售后管理',
    //         title_en: 'After sales',
    //         icon: 'i_s_temp',
    //         hidden: false,
    //         auth: ["after-sales-order.list", "refund.list"],
    //     },
    //     children: [
    //         {
    //             path: 'aftersales-supply-list',
    //             name: 'AftersalesSupplyList',
    //             component: () => import('@/views/aftersales/aftersales-list.vue'),
    //             meta: {
    //                 title: '售后响应',
    //                 title_en: 'Response',
    //                 roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
    //                 query_type: REFUND_QUERY_TYPE.SUPPLY,
    //                 auth: ["after-sales-order.list"],
    //             }
    //         },
    //         {
    //             path: 'aftersales-apply-list',
    //             redirect: '/aftersales/aftersales-list',
    //             meta: {
    //                 title: '售后申请',
    //                 title_en: 'Application',
    //                 roles: [LOGIN_TYPE.DISTRIBUTOR],
    //                 query_type: REFUND_QUERY_TYPE.APPLY,
    //                 auth: ["after-sales-order.save"],
    //             }
    //         },
    //         {
    //             path: 'refund-list',
    //             name: 'RefundList',
    //             component: () => import('@/views/aftersales/refund-list.vue'),
    //             meta: {
    //                 roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
    //                 // auth: ['aftersales.refund', 'asjncsaij'],
    //                 title: '退款审核',
    //                 title_en: 'Audit',
    //                 auth: ["refund-list"],
    //             }
    //         },
    //     ]
    // },
    {
        // 售后管理 - 门店 && 零售
        path: '/aftersales',
        component: Layout,
        redirect: '/aftersales/aftersales-list',
        name: 'AftersalesManagement',
        type: [ROUTER_TYPE.AFTER],
        meta: {
            title: '售后管理',
            title_en: 'After-sales',
            icon: 'i_menu_shouhouguanli',
            auth: ['after-sales-order.list'],
        },
        children: [
            {
                path: 'aftersales-list',
                name: 'AftersalesApplyList',
                component: () => import('@/views/aftersales/aftersales-list.vue'),
                meta: {
                    title: '售后单列表',
                    title_en: 'Aftersales list',
                    query_type: REFUND_QUERY_TYPE.APPLY,
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['after-sales-order.list'],
                },
            },
            {
                path: 'aftersales-edit',
                name: 'AftersalesEdit',
                component: () => import('@/views/aftersales/aftersales-edit.vue'),
                meta: {
                    hidden: true,
                    title: '申请售后',
                    title_en: 'Apply',
                    parent: '/aftersales/aftersales-list',
                    auth: ['after-sales-order.save'],
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                },
            },
            {
                path: 'aftersales-detail',
                name: 'AftersalesDetail',
                component: () => import('@/views/aftersales/aftersales-detail.vue'),
                meta: {
                    hidden: true,
                    title: '售后单详情',
                    parent: '/aftersales/aftersales-list',
                    auth: ['after-sales-order.detail'],
                },
            },
            {
                path: 'refund-detail',
                name: 'RefundDetail',
                component: () => import('@/views/aftersales/refund-detail.vue'),
                meta: {
                    hidden: true,
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title: '退款单详情',
                    auth: ['refund.detail'],
                },
            },
            {
                path: 'aftersales-supply-list',
                name: 'AftersalesSupplyList',
                component: () => import('@/views/aftersales/aftersales-list.vue'),
                meta: {
                    title: '售后响应',
                    title_en: 'Response',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    query_type: REFUND_QUERY_TYPE.SUPPLY,
                    auth: ['after-sales-order.list'],
                },
            },
            // {
            //     path: 'aftersales-apply-list',
            //     redirect: '/aftersales/aftersales-list',
            //     meta: {
            //         title: '售后申请',
            //         title_en: 'Application',
            //         roles: [LOGIN_TYPE.DISTRIBUTOR],
            //         query_type: REFUND_QUERY_TYPE.APPLY,
            //         auth: ["after-sales-order.save"],
            //     }
            // },
            {
                path: 'refund-list',
                name: 'RefundList',
                component: () => import('@/views/aftersales/refund-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    // auth: ['aftersales.refund', 'asjncsaij'],
                    title: '退款审核',
                    title_en: 'Refund Audit',
                    auth: ['refund.list'],
                },
            },
        ],
    },
    {
        // 工单管理
        path: '/repair',
        component: Layout,
        name: 'RepairManagement',
        redirect: '/repair/repair-list',
        type: [ROUTER_TYPE.AFTER],
        meta: {
            title: '工单管理',
            title_en: 'Maintenance',
            icon: 'i_menu_gongdanguanli',
            auth: ['repair-order.list'],
        },
        children: [
            {
                path: 'repair-list',
                name: 'RepairList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '工单列表',
                    title_en: 'Warranty Claim',
                    auth: ['repair-order.list'],
                },
            },
            {
                path: 'repair-audit-list',
                name: 'RepairAuditList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待审工单',
                    title_en: 'Pending warranty claim',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    type: 'audit',
                    auth: ['repair-order.audit'],
                },
            },
            {
                path: 'repair-redit-list',
                name: 'RepairReditList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待改工单',
                    title_en: 'Pending warranty claim',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
                    type: 'redit',
                    auth: ['repair-order.save'],
                },
            },
            {
                path: 'repair-invoice-list',
                name: 'RepairInvoiceList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待审核故障件',
                    title_en: 'Pending defective parts',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: 'invoice',
                    auth: ['repair-order.list'],
                },
            },
            {
                path: 'repair-fault-list',
                name: 'RepairFaultList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待入库故障件',
                    title_en: 'Wait recall parts',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    type: 'fault',
                    auth: ['repair-order.save-to-invoice'],
                },
            },
            {
                path: 'repair-edit',
                name: 'RepairEdit',
                component: () => import('@/views/repair/repair-edit.vue'),
                meta: {
                    hidden: true,
                    title: '维修单编辑',
                    parent: '/repair/repair-list',
                    roles: [LOGIN_TYPE.STORE, LOGIN_TYPE.AGENT, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['repair-order.save'],
                },
            },
            {
                path: 'repair-detail',
                name: 'RepairDetail',
                component: () => import('@/views/repair/repair-detail.vue'),
                meta: {
                    hidden: true,
                    title: '维修单详情',
                    parent: '/repair/repair-list',
                    auth: ['repair-order.detail'],
                },
            },
            {
                path: 'repair-invoice',
                name: 'RepairInvoice',
                component: () => import('@/views/repair/repair-invoice.vue'),
                meta: {
                    hidden: true,
                    title: '维修单结算',
                    parent: '/repair/repair-list',
                    auth: ['repair-order.settlement'],
                },
            },
            {
                path: 'item-fault-list',
                name: 'FaultList',
                component: () => import('@/views/repair/item-fault-list.vue'),
                meta: {
                    title: '故障管理',
                    title_en: 'Fault management',
                    roles: [LOGIN_TYPE.STORE, LOGIN_TYPE.AGENT, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['fault.list'],
                },
            },
        ],
    },
    // 客户关怀
    customerCare,
    inquiryManagement,

    /*{ // 零售商管理 - 零售商端
        path: '/agent/agent-detail-sp',
        component: Layout,
        meta: {
            title: '零售商管理',
            icon: 'i_s_agent',
            roles: [LOGIN_TYPE.AGENT],
        },
        children: [
            {
                path: '',
                name: 'AgentManagementSp',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    title: '零售商详情',
                    roles: [LOGIN_TYPE.AGENT],
                }
            }
        ]
    },*/
    /* { // 门店管理 - 门店端
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
                }
            }
        ]
    },*/

    /* { // 物流管理
        path: '/waybill',
        component: Layout,
        redirect: '/waybill/waybill-list',
        name: 'WayBillManagement',
        meta: {
            title: '物流管理',
            title_en: 'Logistics',
            icon: 'i_deliver',
            roles: [LOGIN_TYPE.ADMIN],            
        },
        children: [
            {
                path: 'waybill-list',
                name: 'waybillList',
                component: () => import('@/views/waybill/waybill-list.vue'),
                meta: {
                    title: '物流列表',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            // {
            //     path: 'waybill-company',
            //     name: 'WaybillCompanyList',
            //     component: () => import('@/views/waybill/waybill-company.vue'),
            //     meta: {
            //         title: '物流公司',
            //         roles: [LOGIN_TYPE.ADMIN],
            //     }
            // },
        ]
    },*/

    {
        // 生产管理 - 平台端
        path: '/production',
        component: Layout,
        redirect: '/production/stock-list',
        name: 'ProductionManagement',
        type: [ROUTER_TYPE.PRODUCTION],
        meta: {
            title: '供应管理',
            title_en: 'Suppliers',
            icon: 'i_menu_gongyingguajli',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['production-order.list', 'supplier.list', 'material-purchase-order.list', 'material.list'],
        },
        children: [
            {
                path: 'supplier-list',
                name: 'SupplierList',
                component: () => import('@/views/production/supplier-list.vue'),
                meta: {
                    title: '供应商列表',
                    title_en: 'Supplier list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['supplier.list'],
                },
            },
            {
                path: 'supplier-edit',
                name: 'SupplierEdit',
                component: () => import('@/views/production/supplier-edit.vue'),
                meta: {
                    hidden: true,
                    title: '供应商编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/supplier-list',
                    auth: ['supplier.save'],
                },
            },
            {
                path: 'supplier-detail',
                name: 'SupplierDetail',
                component: () => import('@/views/production/supplier-detail.vue'),
                meta: {
                    hidden: true,
                    title: '供应商详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/supplier-list',
                    auth: ['supplier.detail'],
                },
            },
            {
                path: 'material-purchase-list',
                name: 'MaterialPurchaseList',
                component: () => import('@/views/production/material-purchase-list.vue'),
                meta: {
                    title: '采购单列表',
                    title_en: 'Procurement list',
                    roles: [LOGIN_TYPE.ADMIN],
                    is_sub_menu: true,
                    auth: ['material-purchase-order.list'],
                },
            },
            /*{
                path: 'material-purchase-edit',
                name: 'MaterialPurchaseEdit',
                component: () => import ('@/views/production/material-purchase-edit.vue'),
                meta: {
                    title: '新建采购单',
                    hidden: true,
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/material-purchase-list',
                }
            },*/
            {
                path: 'material-purchase-detail',
                name: 'MaterialPurchaseDetail',
                component: () => import('@/views/production/material-purchase-detail.vue'),
                meta: {
                    hidden: true,
                    title: '采购单详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/material-purchase-list',
                    auth: ['material-purchase-order.list.detail'],
                },
            },

            {
                path: 'material-list',
                name: 'MaterialList',
                component: () => import('@/views/production/material-list.vue'),
                meta: {
                    title: '物料列表',
                    title_en: 'Material list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['material.list'],
                },
            },
            {
                path: 'material-edit',
                name: 'MaterialEdit',
                component: () => import('@/views/production/material-edit.vue'),
                meta: {
                    hidden: true,
                    title: '物料编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/material-list',
                    auth: ['material.save'],
                },
            },
            {
                path: 'material-detail',
                name: 'MaterialDetail',
                component: () => import('@/views/production/material-detail.vue'),
                meta: {
                    hidden: true,
                    title: '物料详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/material-list',
                    auth: ['material.detail'],
                },
            },

            // {
            //     path: 'material-adjust-stock',
            //     name: 'MaterialAdjustStock',
            //     component: () => import('@/views/production/material-adjust-stock.vue'),
            //     meta: {
            //         roles: [LOGIN_TYPE.ADMIN],
            //         title: '物料调库',
            //     }
            // },
            // {
            //     path: 'material-stock-record',
            //     name: 'MaterialStockRecord',
            //     component: () => import('@/views/production/components/MaterialStockRecord.vue'),
            //     meta: {
            //         roles: [LOGIN_TYPE.ADMIN],
            //         title: '物料调库',
            //     }
            // },

            {
                path: 'material-category',
                name: 'MaterialCategory',
                component: () => import('@/views/production/material-category.vue'),
                meta: {
                    title: '物料分类',
                    title_en: 'Material classification',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['material-category.list'],
                },
            },
            {
                // dev上线了 正式服后端未上
                path: 'incoming-inspection',
                name: 'incomingInspection',
                component: () => import('@/views/production/incoming-inspection.vue'),
                meta: {
                    title: '来料检验',
                    title_en: 'Incoming Inspection',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
        ],
    },
    {
        // 生产管理
        path: '/manufacture',
        component: Layout,
        redirect: '/manufacture/manufacture-list',
        name: 'ManufactureManagement',
        type: [ROUTER_TYPE.PRODUCTION],
        meta: {
            title: '生产管理',
            title_en: 'Production',
            icon: 'i_menu_shegnchanguanli',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['production-order.list', 'bom.list'],
        },
        children: [
            {
                path: 'device-list',
                name: 'DeviceList',
                component: () => import('@/views/manufacture/device-list.vue'),
                meta: {
                    title: '设备列表',
                    title_en: 'Vehicles',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: 'vehicle',
                    // auth: ['entity.list'],
                },
            },
            {
                path: 'testRepor-list',
                name: 'TestReportList',
                component: () => import('@/views/test-report/test-report-list.vue'),
                meta: {
                    title: '测试报告',
                    title_en: 'Test Report List',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'bom-list',
                name: 'BomList',
                component: () => import('@/views/manufacture/bom-list.vue'),
                meta: {
                    title: 'BOM列表',
                    title_en: 'BOM list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['bom.list'],
                },
            },
            {
                path: 'bom-detail',
                name: 'BomDetail',
                component: () => import('@/views/manufacture/bom-detail.vue'),
                meta: {
                    hidden: true,
                    title: 'BOM详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/manufacture/bom-list',
                    auth: ['bom.detail'],
                },
            },
            {
                path: 'manufacture-order-list',
                name: 'ManufactureOrderList',
                component: () => import('@/views/manufacture/manufacture-order-list.vue'),
                meta: {
                    title: '生产单列表',
                    title_en: 'Manufacture order list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['production-order.list'],
                },
            },
            {
                path: 'manufacture-order-edit',
                name: 'ManufactureOrderEdit',
                component: () => import('@/views/manufacture/manufacture-order-edit.vue'),
                meta: {
                    hidden: true,
                    title: '生产单编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/manufacture/manufacture-order-list',
                    auth: ['production-order.save'],
                },
            },
            {
                path: 'manufacture-order-detail',
                name: 'ManufactureOrderDetail',
                component: () => import('@/views/manufacture/manufacture-order-detail.vue'),
                meta: {
                    hidden: true,
                    title: '生产单详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/item-list',
                    auth: ['production-order.detail'],
                },
            },
            {
                path: 'calculate-production-amount',
                name: 'CalculateProductionAmount',
                component: () => import('@/views/manufacture/calculate-production-amount.vue'),
                meta: {
                    hidden: true,
                    title: '成套计算',
                    roles: [LOGIN_TYPE.ADMIN],
                    // auth: ['calculate-production.amount'],
                },
            },
            {
                path: 'vehicle-inspection',
                name: 'vehicleInspection',
                component: () => import('@/views/manufacture/vehicle-inspection.vue'),
                meta: {
                    title: '整车完检',
                    title_en: 'Complete vehicle inspection',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
        ],
    },

    {
        // 仓库管理
        path: '/warehouse',
        component: Layout,
        redirect: '/warehouse/warehouse-list',
        name: 'WarehouseManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER, ROUTER_TYPE.PRODUCTION],
        meta: {
            title: '库存管理',
            title_en: 'Inventories',
            icon: 'i_menu_kucunguanli',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
            auth: ['warehouse.list', 'warehouse-transfer-order.list', 'invoice.list', 'stock.list'],
        },
        children: [
            {
                path: 'warehouse-list',
                name: 'WarehouseList',
                component: () => import('@/views/warehouse/warehouse-list.vue'),
                meta: {
                    title: '仓库管理',
                    title_en: 'Warehouses',
                    auth: ['warehouse.list'],
                },
            },
            {
                path: 'warehouse-edit',
                name: 'WarehouseEdit',
                component: () => import('@/views/warehouse/warehouse-edit.vue'),
                meta: {
                    hidden: true,
                    title: '仓库编辑',
                    parent: '/warehouse/warehouse-list',
                    auth: ['warehouse.save'],
                },
            },
            {
                path: 'warehouse-detail',
                name: 'WarehouseDetail',
                component: () => import('@/views/warehouse/warehouse-detail.vue'),
                // component: () => import('@/views/warehouse/warehouse-detail-copy.vue'),
                meta: {
                    hidden: true,
                    title: '仓库详情',
                    parent: '/warehouse/warehouse-list',
                    auth: ['warehouse.detail'],
                },
            },
            {
                path: 'stock-list',
                name: 'StockList',
                component: () => import('@/views/warehouse/stock-list.vue'),
                meta: {
                    title: '库存总览',
                    title_en: 'Inventory overview',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['stock.list'],
                },
            },
            {
                path: 'invoice-list',
                name: 'InvoiceList',
                component: () => import('@/views/warehouse/invoice-list.vue'),
                meta: {
                    title: '出入库管理',
                    title_en: 'Inbound and outbound',
                    auth: ['invoice.list'],
                },
            },
            {
                path: 'invoice-edit',
                name: 'InvoiceEdit',
                component: () => import('@/views/warehouse/invoice-edit.vue'),
                meta: {
                    hidden: true,
                    title: '出入库编辑',
                    parent: '/invoice/invoice-list',
                    auth: ['invoice.save'],
                },
            },
            {
                path: 'invoice-detail',
                name: 'InvoiceDetail',
                component: () => import('@/views/warehouse/invoice-detail2.vue'),
                meta: {
                    hidden: true,
                    title: '出入库详情',
                    parent: '/invoice/invoice-list',
                    auth: ['invoice.detail'],
                },
            },
            {
                path: 'warehouse-transfer-list',
                name: 'WarehouseTransferList',
                component: () => import('@/views/warehouse/warehouse-transfer-list.vue'),
                meta: {
                    title: '调货单管理',
                    title_en: 'Transfer order',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['warehouse-transfer-order.list'],
                },
            },
            {
                path: 'warehouse-transfer-detail',
                name: 'WarehouseTransferDetail',
                component: () => import('@/views/warehouse/warehouse-transfer-detail.vue'),
                meta: {
                    hidden: true,
                    title: '调货单详情',
                    parent: '/warehouse/warehouse-transfer-list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['warehouse-transfer-order.detail'],
                },
            },
            {
                path: 'material-put-stock',
                name: 'MaterialPutStock',
                component: () => import('@/views/production/material-put-stock.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '入库',
                    title_en: 'Inbound',
                    auth: ['invoice.in'],
                },
            },
            {
                path: 'material-out-stock',
                name: 'MaterialOutStock',
                component: () => import('@/views/production/material-out-stock.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '出库',
                    title_en: 'Outbound',
                    auth: ['invoice.out'],
                },
            },
            /*  {
                path: 'transfer-order-list-in',
                name: 'TransferOrderListIn',
                component: () => import('@/views/warehouse/transfer-order-list.vue'),
                meta: {
                    title: '调货收货管理',
                    roles: [LOGIN_TYPE.AGENT,LOGIN_TYPE.DISTRIBUTOR,LOGIN_TYPE.STORE],
                    type: 'in'
                }
            },*/
            /*  {
                path: 'transfer-order-list-out',
                name: 'TransferOrderListOut',
                component: () => import('@/views/warehouse/transfer-order-list.vue'),
                meta: {
                    title: '调货发货管理',
                    type: 'out'
                }
            },
            {
                path: 'transfer-order-edit',
                name: 'TransferOrderEdit',
                component: () => import('@/views/warehouse/transfer-order-edit.vue'),
                meta: {
                    hidden: true,
                    title: '调货单编辑',
                    parent: '/transfer/transfer-order-list',
                }
            },
            {
                path: 'transfer-order-detail',
                name: 'TransferOrderDetail',
                component: () => import('@/views/warehouse/transfer-order-detail.vue'),
                meta: {
                    hidden: true,
                    title: '调货单详情',
                    parent: '/transfer/transfer-order-list',
                }
            },*/
            /*        {
                path: 'fault-entity-list',
                name: 'faultEntityList',
                component: () => import('@/views/warehouse/fault-entity-list.vue'),
                meta: {
                    title: '故障件管理',
                }
            },
            {
                path: 'pending-fault-entity-list',
                name: 'pendingFaultEntityList',
                component: () => import('@/views/warehouse/fault-entity-list.vue'),
                meta: {
                    title: '待处理故障件',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: 'pending'
                }
            },*/
        ],
    },
    {
        // 存货管理
        path: '/inventory',
        component: Layout,
        redirect: '/inventory/inventory-list',
        name: 'InventoryManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.PRODUCTION],
        meta: {
            title: '存货管理',
            title_en: 'Stock Control',
            icon: 'i_menu_cunhuoguanli',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['inventory.list'],
        },
        children: [
            {
                path: 'inventory-list',
                name: 'InventoryList',
                component: () => import('@/views/inventory/inventory-list.vue'),
                meta: {
                    title: '存货档案',
                    title_en: 'Inventory Files',
                    auth: ['inventory.list'],
                },
            },
            {
                path: 'inventory-category',
                name: 'InventoryCategory',
                component: () => import('@/views/inventory/inventory-category.vue'),
                meta: {
                    title: '存货分类',
                    title_en: 'Inventory Category',
                    auth: ['inventory-category.list'],
                },
            },
            {
                path: 'inventory-edit',
                name: 'InventoryEdit',
                component: () => import('@/views/inventory/inventory-edit.vue'),
                meta: {
                    hidden: true,
                    title: '存货档案编辑',
                    parent: '/inventory/inventory-edit',
                    auth: ['inventory.edit'],
                },
            },
        ],
    },
    {
        // 账户管理
        path: '/wallet',
        component: Layout,
        redirect: '/wallet/wallet-list',
        name: 'WalletManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER],
        meta: {
            title: '账户管理',
            title_en: 'Accounts',
            icon: 'i_s_user',
            roles: [LOGIN_TYPE.DISTRIBUTOR],
            auth: ['user.list'],
        },
        children: [
            {
                path: 'wallet-list',
                name: 'WalletList',
                component: () => import('@/views/wallet/wallet-list.vue'),
                meta: {
                    title: '账户列表',
                    title_en: 'Account list',
                    auth: ['user.list'],
                },
            },
            {
                path: 'wallet-detail',
                name: 'WalletDetail',
                auth: ['user.detail'],
                component: () => import('@/views/wallet/wallet-detail.vue'),
                meta: {
                    hidden: true,
                    title: '账户详情',
                    parent: '/wallet/wallet-list',
                    auth: ['user.list'],
                },
            },
        ],
    },
    {
        // 客户管理
        path: '/eos-customer',
        component: Layout,
        redirect: '/eos-customer/customer-list',
        name: 'CustomerManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER],
        meta: {
            title: '客户管理',
            title_en: 'Customers',
            icon: 'i_s_customer',
            auth: ['customer.list'],
        },
        children: [
            {
                path: 'customer-list',
                name: 'EOSCustomerList',
                component: () => import('@/views/customer/customer-list.vue'),
                meta: {
                    title: '客户列表',
                    title_en: 'Customer list',
                    auth: ['customer.list'],
                },
            },
            {
                path: 'eos-customer-edit',
                name: 'EOSCustomerEdit',
                component: () => import('@/views/customer/customer-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新建客户',
                    parent: '/eos-customer/customer-list',
                    auth: ['customer.save'],
                },
            },
        ],
    },
    {
        // COC证书管理
        path: '/coc',
        component: Layout,
        redirect: '/coc/coc-list',
        name: 'COC',
        type: [ROUTER_TYPE.SALES],
        meta: {
            title: 'COC证书管理',
            title_en: 'COC Certificate Management',
            icon: 'i_menu_COC',
            auth: ['coc.template', 'coc.certificate'],
        },
        children: [
            {
                path: 'coc-list',
                name: 'COCList',
                component: () => import('@/views/coc/platform-super-list.vue'),
                meta: {
                    title: 'COC模板',
                    title_en: 'COC Template',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['coc.template'],
                },
            },
            {
                // coc证书
                path: 'coc-certificate',
                name: 'COCCertificate',
                component: () => import('@/views/coc/coc-certificate.vue'),
                meta: {
                    title: 'COC证书',
                    title_en: 'COC Certificate',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['coc.certificate'],
                },
            },
            {
                // 证书清单
                path: 'certificate-list',
                name: 'CertificateList',
                component: () => import('@/views/coc/certificate-list.vue'),
                meta: {
                    title: '证书清单',
                    title_en: 'Certificate List',
                    hidden: true,
                },
            },
        ],
    },
    // 供应商管理
    supplyManage,
    {
        // 数据
        path: '/crm-dashboard',
        component: Layout,
        redirect: '/crm-dashboard/vote-dashboard',
        name: 'crm-dashboard',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '数据',
            title_en: 'Dashboard',
            icon: 'i_crm_data',
            auth: ['crm-label.list'],
        },
        children: [
            {
                path: 'dashboard',
                name: 'CrmDashboard',
                component: () => import('@/views/crm-dashboard/dashboard.vue'),
                meta: {
                    hidden: true,
                    title: '数据看板',
                    title_en: 'Dashboard',
                    auth: ['crm-label.list'],
                },
            },
            {
                path: 'vote-dashboard',
                name: 'VoteDashboard',
                component: () => import('@/views/crm-dashboard/vote-dashboard.vue'),
                meta: {
                    title: '投票看板',
                    title_en: 'Voting Board',
                    auth: ['crm-label.list'],
                },
            },
            {
                path: 'vote-detail',
                name: 'voteDetail',
                component: () => import('@/views/crm-dashboard/vote-detail.vue'),
                meta: {
                    hidden: true,
                    title: '投票详情',
                    title_en: 'Voting Board',
                    auth: ['crm-label.list'],
                },
            },
            // {
            // 	path: 'employees-home',
            // 	name: 'EmployeesHome',
            // 	component: () => import('@/views/crm-dashboard/employees-home.vue'),
            // 	meta: {
            // 		title: '首页',
            // 		title_en: 'Index',
            // 		auth: ["crm-label.list"],
            // 	}
            // },
        ],
    },
    {
        // 工作台
        path: '/crm-staging',
        component: Layout,
        redirect: '/crm-staging/staging',
        name: 'crm-staging',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '工作台',
            title_en: 'Staging',
            icon: 'i_crm_bo',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['staging.staging'],
        },
        children: [
            {
                path: 'staging',
                name: 'CrmStaging',
                component: () => import('@/views/crm-staging/staging.vue'),
                meta: {
                    title: '工作台',
                    title_en: 'Staging',
                    auth: ['staging.staging'],
                },
            },
            {
                // 工作台详情
                path: 'staging-detail',
                name: 'stagingDetail',
                component: () => import('@/views/crm-staging-detail/staging.vue'),
                meta: {
                    title: '工作台详情',
                    title_en: 'StagingDetail',
                    hidden: true,
                },
            },
        ],
    },
    {
        // 用户中心
        path: '/user-center',
        component: Layout,
        redirect: '/user-center/clue-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '用户中心',
            title_en: 'User Center',
            icon: 'i_menu_yonghuzhognxin',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['user-center.clue', 'user-center.user-list'],
        },
        children: [
            {
                path: 'clue-list',
                name: 'clueList',
                component: () => import('@/views/crm-customer-center/clue-list.vue'),
                meta: {
                    title: '线索',
                    title_en: 'Clue List',
                    icon: 'i_home',
                    auth: ['user-center.clue'],
                },
            },
            {
                path: 'user-list',
                name: 'userList',
                component: () => import('@/views/crm-customer-center/user-list.vue'),
                meta: {
                    title: '用户列表',
                    title_en: 'User List',
                    icon: 'i_home',
                    auth: ['user-center.user-list'],
                },
            },
            {
                path: 'user-edit',
                name: 'userEdit',
                component: () => import('@/views/crm-customer-center/user-edit.vue'),
                meta: {
                    hidden: true,
                    title: '门店详情',
                    title_en: 'Payment Receipt Phase',
                    parent: '/stores-vehicle/stores-list',
                },
            },
        ],
    },
    {
        // 门店管理
        path: '/stores-vehicle',
        component: Layout,
        redirect: '/stores-vehicle/stores-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '门店管理',
            title_en: 'Stores Management',
            icon: 'i_stores',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['crm-store.list', 'crm-store.group-list'],
        },
        children: [
            {
                path: 'stores-list',
                name: 'storesList',
                component: () => import('@/views/retail-crm/stores/store-list.vue'),
                meta: {
                    title: '门店列表',
                    title_en: 'Stores List',
                    icon: 'i_home',
                    auth: ['crm-store.list'],
                },
            },
            {
                path: 'regional-mangage',
                name: 'regionalMangage',
                component: () => import('@/views/retail-crm/stores/regional-mangage.vue'),
                meta: {
                    title: '区域管理',
                    title_en: 'Regional Mangage',
                    icon: 'i_home',
                    auth: ['crm-store.group-list'],
                },
            },
            {
                path: 'shift-mangage',
                name: 'shiftMangage',
                component: () => import('@/views/retail-crm/stores/shift-mangage.vue'),
                meta: {
                    title: '班次管理',
                    title_en: 'Shift Mangage',
                    icon: 'i_home',
                    hidden: true,
                },
            },
            {
                path: 'target-mangage',
                name: 'targetMangage',
                component: () => import('@/views/retail-crm/stores/target-mangage.vue'),
                meta: {
                    title: '目标管理',
                    title_en: 'Target Mangage',
                    icon: 'i_home',
                    hidden: true,
                },
            },
            {
                path: 'store-edit',
                name: 'store-edit',
                component: () => import('@/views/retail-crm/stores/store-edit.vue'),
                meta: {
                    hidden: true,
                    title: '',
                    parent: '/stores-vehicle/stores-list',
                    auth: [],
                },
            },
            {
                path: 'stores-detail',
                name: 'storesDetail',
                component: () => import('@/views/retail-crm/stores/store-detail.vue'),
                meta: {
                    hidden: true,
                    title: '门店详情',
                    title_en: 'Payment Receipt Phase',
                    parent: '/stores-vehicle/stores-list',
                    auth: [],
                },
            },
        ],
    },
    {
        // 人员管理
        path: '/retail-personnel',
        component: Layout,
        redirect: '/retail-personnel/personnel-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '人员管理',
            title_en: 'Personnel Management',
            icon: 'i_menu_renyuanguanli',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['crm-user.list'],
        },
        children: [
            {
                path: 'personnel-list',
                name: 'personnelList',
                component: () => import('@/views/retail-crm/personnel/list.vue'),
                meta: {
                    title: '人员列表',
                    title_en: 'Personnel List',
                    icon: 'i_s_user',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['crm-user.list'],
                },
            },
            {
                path: 'personnel-detail',
                name: 'personnelDetail',
                component: () => import('@/views/retail-crm/personnel/detail.vue'),
                meta: {
                    hidden: true,
                    title: '人员详情',
                    title_en: 'Personnel Detail',
                },
            },
        ],
    },
    {
        // 探索

        path: '/retail-explore',
        component: Layout,
        redirect: '/retail-explore/file-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '探索',
            title_en: 'Explore',
            icon: 'i_tansuo',
            hidden: true,
        },
        children: [
            {
                path: 'file-list',
                name: 'fileList',
                component: () => import('@/views/retail-crm/explore/file-list.vue'),
                meta: {
                    title: '文件',
                    title_en: 'File',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'que-answer-list',
                name: 'queAnswerList',
                component: () => import('@/views/retail-crm/explore/que-answer-list.vue'),
                meta: {
                    // hidden: true,
                    title: '问卷解答',
                    title_en: 'Questionnaire Answers',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'que-naire-list',
                name: 'queNaireList',
                component: () => import('@/views/retail-crm/explore/que-naire-list.vue'),
                meta: {
                    title: '问卷列表',
                    title_en: 'List Of Questionnaires',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'naire-edit',
                name: 'naireEdit',
                component: () => import('@/views/retail-crm/explore/naire-edit.vue'),
                meta: {
                    hidden: true,
                    title: '编辑问卷',
                    title_en: 'Edit The Questionnaire',
                },
            },
        ],
    },
    {
        // 分配规则
        path: '/service',
        component: Layout,
        redirect: '/service/lead-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '分配规则',
            title_en: 'Allocation rules',
            icon: 'i_menu_fenpeiguize',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['allocation-rules.allocation-rules'],
        },
        children: [
            {
                path: 'lead-list',
                name: 'leadList',
                component: () => import('@/views/crm-service-customer/lead-list.vue'),
                meta: {
                    title: '分配规则',
                    title_en: 'Allocation rules',
                    auth: ['allocation-rules.allocation-rules'],
                },
            },
        ],
    },
    {
        // 好物订单
        path: '/good-items-order',
        component: Layout,
        redirect: '/good-items-order/order-list',
        name: 'good-items-order',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '好物订单',
            title_en: 'Good Items Order',
            icon: 'i_menu_haowudingdan',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['good-goods-order.order-list'],
        },
        children: [
            {
                path: 'order-list',
                name: 'orderListItem',
                component: () => import('@/views/good-items-order/order-list.vue'),
                meta: {
                    title: '订单列表',
                    title_en: 'Order List',
                    auth: ['good-goods-order.order-list'],
                },
            },
            {
                path: 'order-edit',
                name: 'orderEdit',
                component: () => import('@/views/good-items-order/order-detail.vue'),
                meta: {
                    hidden: true,
                    title: '订单详情',
                    title_en: 'Order Edit',
                    parent: '/good-items-order/order-list',
                },
            },
        ],
    },
    {
        // 客户
        path: '/crm-customer',
        component: Layout,
        redirect: '/crm-customer/customer-list',
        name: 'CRMCustomerManagement',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '客户',
            title_en: 'Customers',
            icon: 'i_menu_kehu',
            auth: ['crm-customer.list'],
        },
        children: [
            {
                path: 'region-customer-list',
                name: 'RegionCustomerList',
                component: () => import('@/views/crm-customer/customer-list.vue'),
                meta: {
                    title: '区域客户',
                    title_en: 'Regional Customers',
                    type: 'region',
                    auth: ['MANAGER_GROUP', 'MANAGER'],
                },
            },
            {
                path: 'private-customer-list',
                name: 'PrivateCustomerList',
                component: () => import('@/views/crm-customer/customer-list-copy1.vue'),
                meta: {
                    title: '我的客户',
                    title_en: 'My Customers',
                    type: 'private',
                    auth: ['crm-customer.list'],
                },
            },
            {
                path: 'customer-list',
                name: 'CustomerList',
                component: () => import('@/views/crm-customer/customer-list-copy2.vue'),
                meta: {
                    title: '未分配客户',
                    title_en: 'Unassigned Customers',
                    type: 'high_seas',
                    auth: ['crm-customer.list'],
                },
            },
            {
                path: 'customer-edit',
                name: 'CustomerEdit',
                component: () => import('@/views/crm-customer/customer-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新建客户',
                    parent: '/customer/customer-list',
                    auth: ['crm-customer.save'],
                },
            },
            {
                path: 'customer-detail',
                name: 'CustomerDetail',
                component: () => import('@/views/crm-customer/customer-detail.vue'),
                meta: {
                    hidden: true,
                    title: '客户详情',
                    parent: '/customer/customer-list',
                    auth: ['crm-customer.detail'],
                },
            },
            // {
            // 	path: 'customer-list',
            // 	name: 'CustomerList',
            // 	component: () => import('@/views/crm/customer/customer-list.vue'),
            // 	meta: {
            // 		title: '公海客户',
            // 		title_en: 'Customer list',
            // 		// auth: ["crm-customer.list"],
            // 	}
            // },
            // {
            // 	path: 'customer-edit',
            // 	name: 'CustomerEdit',
            // 	component: () => import('@/views/crm/customer/customer-edit.vue'),
            // 	meta: {
            // 		hidden: true,
            // 		title: '新建客户',
            // 		parent: '/customer/customer-list',
            // 		// auth: ["crm-customer.save"],
            // 	}
            // },
        ],
    },
    {
        // 邮件管理
        path: '/mail-management',
        component: Layout,
        redirect: '/mail-management/subscription-list',
        name: 'MailManagement',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '邮件管理',
            title_en: 'Mail Management',
            icon: 'i_s_customer',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['email.email-list', 'email.email-statistics'],
        },
        children: [
            {
                path: 'subscription-list',
                name: 'SubscriptionList',
                component: () => import('@/views/crm-mail-management/subscription-list.vue'),
                meta: {
                    title: '邮箱订阅状态列表',
                    title_en: 'List of email subscription status',
                    // auth: ['email.email-list'],
                },
            },
            {
                path: 'mail-send-statistics',
                name: 'MailSendStatistics',
                component: () => import('@/views/crm-mail-management/mail-send-statistics.vue'),
                meta: {
                    title: '邮件发送及统计',
                    title_en: 'Mail sending and statistics',
                    auth: ['email.email-statistics'],
                },
            },
            {
                path: 'add-mail',
                name: 'AddMail',
                component: () => import('@/views/crm-mail-management/add-mail.vue'),
                meta: {
                    hidden: true,
                    title: '新增邮件',
                    title_en: 'Add New Mail',
                },
            },
            {
                path: 'mail-send-situation',
                name: 'MailSendSituation',
                component: () => import('@/views/crm-mail-management/mail-send-situation.vue'),
                meta: {
                    title: '邮件发送及统计',
                    title_en: 'Mail sending and statistics',
                    hidden: true,
                },
            },
        ],
    },
    {
        // 商机管理
        path: '/crm-bo',
        component: Layout,
        redirect: '/crm-bo/bo-list',
        name: 'CRMBoManagement',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '商机',
            title_en: 'Business Opportunity',
            icon: 'i_menu_shangji',
            auth: ['crm-bo.list'],
        },
        children: [
            {
                path: 'bo-list',
                name: 'BoList',
                component: () => import('@/views/crm-bo/bo-list.vue'),
                meta: {
                    title: '商机列表',
                    title_en: 'Opportunities List',
                    auth: ['crm-bo.list'],
                },
            },
            {
                path: 'bo-edit',
                name: 'BoEdit',
                component: () => import('@/views/crm-bo/bo-edit.vue'),
                meta: {
                    hidden: true,
                    title: '修改商机',
                    parent: '/bo/bo-list',
                    auth: ['crm-bo.save'],
                },
            },
            {
                path: 'bo-detail',
                name: 'BoDetail',
                component: () => import('@/views/crm-bo/bo-detail.vue'),
                meta: {
                    hidden: true,
                    title: '商机详情',
                    parent: '/bo/bo-list',
                    auth: ['crm-bo.detail'],
                },
            },
        ],
    },
    {
        // 订单列表
        path: '/crm-order',
        component: Layout,
        redirect: '/crm-order/order-list',
        name: 'CRMOrder',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '订单管理',
            title_en: 'Contract Order',
            icon: 'i_crm_order',
            auth: ['crm-order.list'],
        },
        children: [
            {
                path: 'order-list',
                name: 'OrderList',
                component: () => import('@/views/crm-order/order-list.vue'),
                meta: {
                    title: '订单列表',
                    title_en: 'Contract Order list',
                    auth: ['crm-order.list'],
                },
            },
            {
                path: 'order-audit-list',
                name: 'OrderAuditList',
                component: () => import('@/views/crm-order/order-audit-list.vue'),
                meta: {
                    hidden: true,
                    title: '待审列表',
                    title_en: 'Pending List',
                    auth: ['crm-order.list'],
                },
            },
            {
                path: 'order-pool-list',
                name: 'OrderPoolList',
                component: () => import('@/views/crm-order/order-pool-list.vue'),
                meta: {
                    hidden: true,
                    title: '公海列表',
                    title_en: 'Pool List',
                    auth: ['crm-order.list'],
                },
            },

            {
                path: 'order-edit',
                name: 'OrderEdit',
                component: () => import('@/views/crm-order/order-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新建合同',
                    parent: '/crm-order/order-list',
                    auth: ['crm-order.save'],
                },
            },
            {
                path: 'order-detail',
                name: 'OrderDetail',
                component: () => import('@/views/crm-order/order-detail.vue'),
                meta: {
                    hidden: true,
                    title: '订单详情',
                    title_en: 'Contract Details',
                    parent: '/crm-order/order-list',
                    auth: ['crm-order.detail'],
                },
            },
        ],
    },
    // 运营管理
    operationManagement,
    {
        // 回款单
        path: '/crm-order-income',
        component: Layout,
        redirect: '/crm-order-income/order-income-list',
        name: 'CRMOrderIncome',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '回款单',
            title_en: 'Payment Receipt',
            icon: 'i_crm_order_income',
            auth: ['crm-order-income.list'],
        },
        children: [
            {
                path: 'order-income-list',
                name: 'OrderIncomeList',
                component: () => import('@/views/crm-order-income/order-income-list.vue'),
                meta: {
                    title: '回款单列表',
                    title_en: 'Payment Receipt List',
                    auth: ['crm-order-income.list'],
                },
            },
            {
                path: 'order-income-audit-list',
                name: 'OrderIncomeaAuditList',
                component: () => import('@/views/crm-order-income/order-income-audit-list.vue'),
                meta: {
                    title: '待审列表',
                    title_en: 'Pending List',
                    auth: ['crm-order-income.list'],
                },
            },
            {
                path: 'order-income-edit',
                name: 'OrderIncomeEdit',
                component: () => import('@/views/crm-order-income/order-income-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新建回款单',
                    parent: '/crm-order-income/order-income-list',
                    auth: ['crm-order-income.save'],
                },
            },
            {
                path: 'order-income-detail',
                name: 'OrderIncomeDetail',
                component: () => import('@/views/crm-order-income/order-income-detail.vue'),
                meta: {
                    hidden: true,
                    title: '回款单详情',
                    title_en: 'Payment Receipt Phase',
                    parent: '/crm-order-income/order-income-list',
                    auth: ['crm-order-income.detail'],
                },
            },
        ],
    },
    {
        // 试驾单
        path: '/crm-test-drive-order',
        component: Layout,
        redirect: '/crm-test-drive-order/test-drive-list',
        name: 'CRMTestDriveList',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '试驾单',
            title_en: 'Test Drive',
            icon: 'i_crm_test_drive',
            auth: ['crm-order-income.list'],
        },
        children: [
            {
                path: 'test-drive-list',
                name: 'TestDriveList',
                component: () => import('@/views/crm-test-drive-order/test-drive-list.vue'),
                meta: {
                    title: '试驾单列表',
                    title_en: 'Test Drive List',
                    auth: ['crm-order-income.list'],
                },
            },
            {
                path: 'test-drive-edit',
                name: 'TestDriveEdit',
                component: () => import('@/views/crm-test-drive-order/test-drive-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新建试驾单',
                    parent: '/crm-test-drive-order/test-drive-list',
                    auth: ['crm-test-drive-order.save'],
                },
            },
            {
                path: 'test-drive-detail',
                name: 'TestDriveDetail',
                component: () => import('@/views/crm-test-drive-order/test-drive-detail.vue'),
                meta: {
                    hidden: true,
                    title: '试驾订单',
                    parent: '/crm-test-drive-order/test-drive-list',
                    auth: ['crm-test-drive-order.save'],
                },
            },
        ],
    },
    {
        // 智能标签
        path: '/crm-smart-label',
        component: Layout,
        redirect: '/crm-smart-label/label-list',
        name: 'SmartLabel',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '智能标签',
            title_en: 'Smart Label',
            icon: 'i_menu_zhinengbiaoqian',
            auth: ['crm-label.list'],
        },
        children: [
            {
                path: 'label-list',
                name: 'LabelList',
                component: () => import('@/views/crm-smart-label/label-list.vue'),
                meta: {
                    title: '标签列表',
                    title_en: 'Label List',
                    // auth: ["crm-label.list"],
                },
            },
            {
                path: 'label-management',
                name: 'LabelManagement',
                component: () => import('@/views/crm-smart-label/label-management.vue'),
                meta: {
                    title: '标签管理',
                    title_en: 'Label Management',
                    // auth: ["crm-label.list"],
                },
            },
        ],
    },
    /*----  零售业务新添加在CRM中的 ----*/
    // 车辆管理和订单管理这期隐藏开启 hidden: 用这个字段
    {
        // 车辆管理
        path: '/retail-vehicle',
        component: Layout,
        redirect: '/retail-vehicle/vehicle-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '车辆管理',
            title_en: 'Vehicle Management',
            icon: 'i_001motuoche',
            hidden: true,
        },
        children: [
            {
                path: 'vehicle-list',
                name: 'vehicleList',
                component: () => import('@/views/retail-crm/vehicle/list.vue'),
                meta: {
                    title: '车辆列表',
                    title_en: 'Vehicle List',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'vehicle-detail',
                name: 'vehicleDetail',
                component: () => import('@/views/retail-crm/vehicle/detail.vue'),
                meta: {
                    hidden: true,
                    title: '车辆详情',
                    title_en: 'Vehicle Detail',
                },
            },
        ],
    },
    {
        // 订单管理
        path: '/retail-order',
        component: Layout,
        redirect: '/retail-order/order-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '订单管理',
            title_en: 'Order Management',
            icon: 'i_dingdan',
            hidden: true,
        },
        children: [
            {
                path: 'order-list',
                name: 'orderList',
                component: () => import('@/views/retail-crm/order/list.vue'),
                meta: {
                    title: '订单列表',
                    title_en: 'Order List',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'order-detail',
                name: 'orderDetail',
                component: () => import('@/views/retail-crm/order/detail.vue'),
                meta: {
                    hidden: true,
                    title: '订单详情',
                    title_en: 'Order Detail',
                },
            },
        ],
    },
    {
        // 系统设置
        path: '/crm-setting',
        component: Layout,
        redirect: '/crm-setting/setting-list',
        name: 'CRMSettingManagement',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '系统设置',
            title_en: 'System Setting',
            icon: 'i_crm_setting',
            auth: ['crm-bo-status.list', 'crm-dict.list', 'crm-group.list', 'crm-group.list'],
        },
        children: [
            {
                path: 'setting-list',
                name: 'SettingList',
                component: () => import('@/views/crm-setting/group-status.vue'),
                meta: {
                    title: '商机阶段',
                    title_en: 'Opportunity Stage',
                    auth: ['crm-bo-status.list'],
                },
            },
            {
                path: 'dict-list',
                name: 'DictList',
                component: () => import('@/views/crm-setting/dict-list.vue'),
                meta: {
                    title: '字典选项',
                    title_en: 'Dictionary',
                    auth: ['crm-dict.list'],
                },
            },
            {
                path: 'region-list',
                name: 'RegionList',
                component: () => import('@/views/crm-setting/region-list.vue'),
                meta: {
                    title: '区域管理',
                    title_en: 'Region',
                    auth: ['crm-group.list'],
                },
            },
            {
                path: 'region-employees-list',
                name: 'RegionEmployeesList',
                component: () => import('@/views/crm-setting/region-employees-list.vue'),
                meta: {
                    title: '区域用户管理',
                    title_en: 'Region User',
                    auth: ['crm-group.list'],
                },
            },
        ],
    },
    {
        // 销售策略管理
        path: '/sales-strategy-management',
        component: Layout,
        redirect: '/sales-strategy-management/sales-strategy-list',
        name: 'SalesStrategyManagement',
        type: [ROUTER_TYPE.SALES],
        meta: {
            title: '销售策略管理',
            title_en: 'System Management',
            icon: 'i_a-iconmenu_xiaoshoucelue',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['sales-strategy.list'],
        },
        children: [
            // 销售策略列表
            {
                path: 'sales-strategy-list',
                name: 'SalesStrategyList',
                component: () => import('@/views/sales-strategy-management/sales-strategy-list.vue'),
                meta: {
                    title: '销售策略列表',
                    title_en: 'Sales Strategy List',
                },
            },
            // 编辑销售策略
            {
                path: 'sales-strategy-edit',
                name: 'SalesStrategyEdit',
                component: () => import('@/views/sales-strategy-management/sales-strategy-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新增编辑销售策略',
                    title_en: 'Add Or Edit Sales Strategy',
                },
            },
        ],
    },
    {
        // 系统管理
        path: '/system',
        component: Layout,
        redirect: '/system/system-file-list',
        name: 'SystemManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER, ROUTER_TYPE.PRODUCTION, ROUTER_TYPE.CRM],
        meta: {
            title: '系统管理',
            title_en: 'System Management',
            icon: 'i_menu_xitongguanli',
            auth: ['MANAGER'], // 管理员
        },
        children: [
            {
                path: 'user-list',
                name: 'UserList',
                component: () => import('@/views/user/user-list.vue'),
                meta: {
                    title: '用户列表',
                    title_en: 'User',
                },
            },
            {
                path: 'user-edit',
                name: 'UserEdit',
                component: () => import('@/views/user/user-edit.vue'),
                meta: {
                    hidden: true,
                    title: '用户编辑',
                    parent: '/user/user-list',
                },
            },
            {
                path: 'user-detail',
                name: 'UserDetail',
                component: () => import('@/views/user/user-detail.vue'),
                meta: {
                    hidden: true,
                    title: '用户详情',
                    parent: '/user/user-list',
                },
            },
            {
                path: 'user-scope',
                name: 'UserScope',
                component: () => import('@/views/user/components/UserScope.vue'),
                meta: {
                    hidden: true,
                    title: '用户详情',
                    parent: '/user/user-list',
                },
            },
            /* {
                path: 'auth-user-list',
                name: 'AuthUserList',
                component: () => import('@/views/authority/auth-user-list.vue'),
                meta: {
                    title: '用户权限',
                }
            },
            {
                path: 'auth-user-edit',
                name: 'AuthUserEdit',
                component: () => import('@/views/authority/auth-user-edit.vue'),
                meta: {
                    hidden: true,
                    title: '用户权限编辑',
                    parent: '/authority/auth-user-list',
                }
            },*/
            // {
            //     path: 'dept-list',
            //     name: 'DeptList',
            //     component: () => import('@/views/system/dept-list.vue'),
            //     meta: {
            //         title: '部门管理',
            //         title_en: 'Dept',
            //     }
            // },
            {
                path: 'auth-role-list',
                name: 'RoleList',
                component: () => import('@/views/authority/auth-role-list.vue'),
                meta: {
                    title: '角色管理',
                    title_en: 'Roles',
                },
            },
            {
                path: 'auth-role-edit',
                name: 'RoleEdit',
                component: () => import('@/views/authority/auth-role-edit.vue'),
                meta: {
                    hidden: true,
                    title: '角色编辑',
                    parent: '/authority/auth-role-list',
                },
            },
            {
                path: 'allot-org-auth',
                name: 'AllotOrgAuth',
                component: () => import('@/views/system/allot-org-auth.vue'),
                meta: {
                    title: '权限管理',
                    title_en: 'Authority Management',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'system-file-edit',
                name: 'SystemFileEdit',
                component: () => import('@/views/system/system-file-edit.vue'),
                meta: {
                    hidden: true,
                    title: '附件编辑',
                    parent: '/system/system-file-list',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'notice-list',
                name: 'NoticeList',
                component: () => import('@/views/system/notice-list.vue'),
                meta: {
                    title: '消息列表',
                    title_en: 'Messages ',
                },
            },
            {
                path: 'notice-edit',
                name: 'NoticeEdit',
                component: () => import('@/views/system/notice-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新增消息',
                    parent: '/system/notice-list',
                    roles: [LOGIN_TYPE.ADMIN],
                },
            },
            {
                path: 'notice-detail',
                name: 'NoticeDetail',
                component: () => import('@/views/system/notice-detail.vue'),
                meta: {
                    hidden: true,
                    title: '消息详情',
                    parent: '/system/notice-list',
                },
            },
            {
                path: 'system-file-list',
                name: 'SystemFileList',
                component: () => import('@/views/system/system-file-list.vue'),
                meta: {
                    title: '文件管理',
                    title_en: 'Files ',
                },
            },
            {
                path: 'print_template_list',
                name: 'PrintTemplatelList',
                component: () => import('@/views/system/print_template_list.vue'),
                roles: [LOGIN_TYPE.ADMIN],
                meta: {
                    title: '标签规则',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title_en: 'Label rules ',
                },
            },
        ],
    },
    adminEmpty,
    // 测试用例
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/z-test/test1.vue'),
        meta: {
            title: '测试1',
            not_sub_menu: true,
            hidden: true,
        },
    },
    ...supplyRouters,
    supplyMaterialManagement
];

export default routes;

let ADMIN = [],
    DISTRIBUTOR = [],
    AGENT = [],
    STORE = [];

let target = Util.deepCopy(routes).filter(first => {
    return first.meta && !first.meta.hidden;
});
target.forEach(first => {
    if (first.children) {
        let children = first.children.filter(second => {
            return second.meta && !second.meta.hidden;
        });
        first.children = children;
    }
});

// 平台方
ADMIN = Util.deepCopy(target).filter(first => {
    let meta = first.meta;
    return !meta.roles || meta.roles.includes(LOGIN_TYPE.ADMIN);
});

ADMIN.forEach(first => {
    if (first.children) {
        let children = first.children.filter(second => {
            let meta = second.meta;
            return !meta.roles || meta.roles.includes(LOGIN_TYPE.ADMIN);
        });
        first.children = children;
    }
});

// 分销商
DISTRIBUTOR = Util.deepCopy(target).filter(first => {
    let meta = first.meta;
    return !meta.roles || meta.roles.includes(LOGIN_TYPE.DISTRIBUTOR);
});
DISTRIBUTOR.forEach(first => {
    if (first.children) {
        let children = first.children.filter(second => {
            let meta = second.meta;
            return !meta.roles || meta.roles.includes(LOGIN_TYPE.DISTRIBUTOR);
        });
        first.children = children;
    }
});

// 零售商
AGENT = Util.deepCopy(target).filter(first => {
    let meta = first.meta;
    return !meta.roles || meta.roles.includes(LOGIN_TYPE.AGENT);
});
AGENT.forEach(first => {
    if (first.children) {
        let children = first.children.filter(second => {
            let meta = second.meta;
            return !meta.roles || meta.roles.includes(LOGIN_TYPE.AGENT);
        });
        first.children = children;
    }
});

// 门店
STORE = Util.deepCopy(target).filter(first => {
    let meta = first.meta;
    return !meta.roles || meta.roles.includes(LOGIN_TYPE.STORE);
});
STORE.forEach(first => {
    if (first.children) {
        let children = first.children.filter(second => {
            let meta = second.meta;
            return !meta.roles || meta.roles.includes(LOGIN_TYPE.STORE);
        });
        first.children = children;
    }
});

export const SIDER = {
    ADMIN,
    DISTRIBUTOR,
    AGENT,
    STORE,
};

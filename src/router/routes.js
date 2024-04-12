import Const from '../core/const';
import Util from '../core/utils';
import Data from '../core/data';

import Layout from '../views/layout/index.vue';

// 供应商路由
import { supplyManage, supplyRouters, supplyMaterialManagement, costManagement } from './sub-router/supply-router';
// 新分销商路由
import { mallRouters, dealsPreview } from './sub-router/mall';
// 分销商路由
import { customerCare, unpaidFinalPayment } from './sub-router/distributor-router';
// 平台方路由
import {
    inquiryManagement,
    operationManagement,
    crmCustomerManagement,
    crmBoManagement,
    crmOrder,
    crmOrderIncome,
    crmTestDriveList,
    smartLabel,
    crmSettingManagement,
    salesStrategyManagement,
    crmDashboard,
    cocCertificate,
    customerManagement,
    InventoryManagement,
    WarehouseManagement,
    manufactureManagement,
    productionManagement,
    repairManagement,
    finalPaymentOrder,
    cancellationOrderRequest,
    rechargeManagement,
} from './sub-router/admin-router';
// 公共的路由
import { freightConfirmed } from './sub-router/common';
// 飞书路由
import { fsLogin } from './sub-router/fs-login';
// 系统权限路由
import { SYSTEM } from './sub-router/system';
// 国内销售权限路由
import { domesticSales } from './sub-router/domestic-sales';
// 不知道用途的
import {
    mailManagement,
    retailBusinessVehicleManagement,
    retailBusinessOrderManagement,
    RepairInvoiceExport,
    walletManagement,
} from './sub-router/un-konw-router';
// 测试用例
import { testUseCases } from './sub-router/test';
// 仓储的路由
import { warehousingManagement } from './sub-router/warehousing';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;
const PURCHASE_SEARCH_TYPE = Const.PURCHASE.SEARCH_TYPE;
const REFUND_QUERY_TYPE = Const.AFTERSALES.QUERY_TYPE;
const NOW_LOGIN_TYPE = Data.getLoginType();

// 重定向
let indexPath = '';
switch (NOW_LOGIN_TYPE) {
    case LOGIN_TYPE.ADMIN:
        indexPath = Data.getTabPosition()?.path || '/';
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
 * @params auth: ['MANAGER]: MANAGER 表示管理员
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
        children: [
            {
                path: 'feishu',
                name: 'LoginFeishu',
                component: () => import('@/views/mall/Login-fs.vue'),
                meta: {
                    hidden: true,
                    title: '登录',
                    title_en: 'Login',
                },
            },
        ],
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
    //
    // 看板
    mallRouters,
    dealsPreview,
    // 维修单 结算下载
    RepairInvoiceExport,
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
            auth: ['sales.distribution'],
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
                    auth: ['sales.distribution.order'],
                },
            },
            {
                path: 'purchase-order-self',
                name: 'PurchaseOrderListSelf',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    title: '采购订单',
                    title_en: 'Purchase order',
                    search_type: PURCHASE_SEARCH_TYPE.SELF,
                    auth: ['sales.distribution.purchase-order'],
                },
            },
            {
                path: 'purchase-order-detail',
                name: 'PurchaseOrderDetail',
                component: () => import('@/views/purchase/purchase-order-detail.vue'),
                meta: {
                    hidden: true,
                    title: '采购订单详情',
                    title_en: 'Purchase Order Detail',
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
                    auth: ['sales.distribution.supply-material'],
                },
            },
            {
                path: 'distributor-list',
                name: 'DistributorList',
                component: () => import('@/views/distributor/distributor-list.vue'),
                meta: {
                    title: '分销商列表',
                    title_en: 'Distributors',
                    auth: ['sales.distribution.distributor'],
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
                },
            },
            {
                path: 'distributor-detail',
                name: 'DistributorDetail',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                meta: {                    
                    title: '分销商详情',
                    parent: '/distributor/distributor-list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['sales.distribution.distribution-detail'],
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
                    auth: ['sales.distribution.distribution-detail'],
                },
            },
            // 资金变化明细
            {
                path: 'distributor-fund-change-detail',
                name: 'FundChangeDetail',
                component: () => import('@/views/distributor/fund-change-detail.vue'),
                meta: {
                    hidden: true,
                    title: '资金变动明细',
                    title_en: 'Fund Change Detail',
                    parent: '/distributor/distributor-list',
                },
            },
            // 授信变化
            {
                path: 'distributor-credit-change',
                name: 'DistributorCreditChange',
                component: () => import('@/views/distributor/distributor-credit-change.vue'),
                meta: {
                    hidden: true,
                    title: '授信变动',
                    title_en: 'Credit Change',
                    parent: '/distributor/distributor-list',
                },
            },
            // 充值记录
            {
                path: 'distributor-recharge-record',
                name: 'RechargeRecord',
                component: () => import('@/views/distributor/recharge-record.vue'),
                meta: {
                    hidden: true,
                    title: '充值记录',
                    title_en: 'Recharge Record',
                    parent: '/distributor/distributor-list',
                },
            },
            // 充值详情
            {
                path: 'distributor-recharge-detail',
                name: 'DistributorRechargeDetail',
                component: () => import('@/views/distributor/recharge-detail.vue'),
                meta: {
                    hidden: true,
                    title: '充值详情',
                    title_en: 'Recharge Detail',
                    parent: '/distributor/distributor-list',
                },
            },
            {
                path: 'agent-list',
                name: 'AgentList',
                component: () => import('@/views/agent/agent-list.vue'),
                meta: {
                    title: '零售商列表',
                    title_en: 'List of retailers',
                    auth: ['sales.distribution.agent'],
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
                },
            },
            {
                path: 'agent-detail-sp',
                name: 'AgentDetailSp',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    title: '零售商详情',
                    title_en: 'Details',
                },
            },
            {
                path: 'store-list',
                name: 'StoreList',
                component: () => import('@/views/store/store-list.vue'),
                meta: {
                    title: '门店列表',
                    title_en: 'Store list',
                    auth: ['sales.distribution.store'],
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
                },
            },
            {
                path: 'store-detail-sp',
                name: 'StoreDetailSp',
                component: () => import('@/views/store/store-detail.vue'),
                meta: {
                    title: '门店详情',
                    title_en: 'Details',
                },
            },
            {
                path: 'sales-area-list',
                name: 'SalesList',
                component: () => import('@/views/item/sales-area-list.vue'),
                meta: {
                    title: '销售区域',
                    title_en: 'Sales area',
                    auth: ['sales.distribution.sale-area'],
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
                },
            },
            {
                path: 'sales-area-edit',
                name: 'SalesEdit',
                component: () => import('@/views/item/sales-area-edit.vue'),
                meta: {
                    hidden: true,
                    title: '区域编辑',
                    parent: '/item/sales-area-list',
                },
            },
            freightConfirmed,
            finalPaymentOrder,
            cancellationOrderRequest,
            unpaidFinalPayment,
        ],
    },
    {
        // 商品管理
        path: '/item',
        component: Layout,
        redirect: '/item/item-list',
        name: 'ItemManagement',
        type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER],
        meta: {
            title: '商品管理',
            title_en: 'Product',
            icon: 'i_menu_shangpingguanli',
            auth: ['sales.item', 'aftermarket.item'],
        },
        children: [
            {
                path: 'item-list',
                name: 'ItemList',
                component: () => import('@/views/item/item-list.vue'),
                meta: {
                    title: '商品列表',
                    title_en: 'Product list',
                    auth: ['sales.item.item'],
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
                },
            },
            {
                path: 'item-category',
                name: 'ItemCategory',
                component: () => import('@/views/item/item-category.vue'),
                meta: {
                    title: '商品分类',
                    title_en: 'Categories',
                    auth: ['sales.item.item-category'],
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
                    auth: ['aftermarket.item.bom'],
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
            auth: ['sales.entity', 'production.instance'],
        },
        children: [
            {
                path: 'vehicle-list',
                name: 'VehicleList',
                component: () => import('@/views/entity/entity-list.vue'),
                meta: {
                    title: '整车列表',
                    title_en: 'Vehicles list',
                    type: 'vehicle',
                    auth: ['sales.entity.vehicle', 'production.instance.vehicle'],
                },
            },
            {
                path: 'part-list',
                name: 'PartList',
                component: () => import('@/views/entity/entity-list.vue'),
                meta: {
                    title: '零部件列表',
                    title_en: 'Parts',
                    type: 'part',
                    auth: ['sales.entity.parts', 'production.instance.parts'],
                },
            },
            {
                path: 'entity-detail',
                name: 'EntityDetail',
                component: () => import('@/views/entity/entity-detail.vue'),
                meta: {
                    hidden: true,
                    title: '车架详情',
                    parent: '/entity/entity-list',
                },
            },
        ],
    },
    {
        // 售后管理
        path: '/aftersales',
        component: Layout,
        redirect: '/aftersales/aftersales-list',
        name: 'AftersalesManagement',
        type: [ROUTER_TYPE.AFTER],
        meta: {
            title: '售后管理',
            title_en: 'After-sales',
            icon: 'i_menu_shouhouguanli',
            auth: ['aftermarket.aftermarket'],
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
                    auth: ['aftermarket.aftermarket.aftermarket'],
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
                },
            },
            {
                path: 'refund-detail',
                name: 'RefundDetail',
                component: () => import('@/views/aftersales/refund-detail.vue'),
                meta: {
                    hidden: true,
                    title: '退款单详情',
                },
            },
            {
                path: 'aftersales-supply-list',
                name: 'AftersalesSupplyList',
                component: () => import('@/views/aftersales/aftersales-list.vue'),
                meta: {
                    title: '售后响应',
                    title_en: 'Response',
                    query_type: REFUND_QUERY_TYPE.SUPPLY,
                    auth: ['aftermarket.aftermarket.response'],
                },
            },
            {
                path: 'refund-list',
                name: 'RefundList',
                component: () => import('@/views/aftersales/refund-list.vue'),
                meta: {
                    title: '退款审核',
                    title_en: 'Refund Audit',
                    auth: ['aftermarket.aftermarket.refund-review'],
                },
            },
        ],
    },
    // 工单管理
    repairManagement,
    // 分销售客户关怀
    customerCare,
    // 平台方客户关怀
    inquiryManagement,
    // 供应管理 - 平台端
    productionManagement,
    // 生产管理
    manufactureManagement,
    // 库存管理
    WarehouseManagement,
    // 存货管理
    InventoryManagement,
    // 账户管理
    walletManagement,
    // 客户管理
    customerManagement,
    // COC证书管理
    cocCertificate,
    // 供应商管理
    supplyManage,
    // 数据
    crmDashboard,
    // 国内销售
    ...domesticSales,
    // 客户
    crmCustomerManagement,
    // 邮件管理
    mailManagement,
    // 商机管理
    crmBoManagement,
    // 订单管理
    crmOrder,
    // 运营管理
    operationManagement,
    // 回款单
    crmOrderIncome,
    // 试驾单
    crmTestDriveList,
    // 智能标签
    smartLabel,
    // 车辆管理
    retailBusinessVehicleManagement,
    // 订单管理
    retailBusinessOrderManagement,
    // 系统设置
    crmSettingManagement,
    // 销售策略管理
    salesStrategyManagement,
    // 系统管理
    SYSTEM,
    ...supplyRouters,
    // 物料管理
    supplyMaterialManagement,
    // 飞书
    fsLogin,
    // 测试用例
    ...testUseCases,
    costManagement,
    warehousingManagement,
    rechargeManagement,
];

export default routes;

let ADMIN = [],
    DISTRIBUTOR = [],
    AGENT = [],
    STORE = [];

// 过滤掉hideen 为true的路由
let target = Util.deepCopy(routes).filter(first => {
    return first.meta && !first.meta.hidden;
});
// 过滤掉children中的hideen为true的路由
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
// AGENT = Util.deepCopy(target).filter(first => {
//     let meta = first.meta;
//     return !meta.roles || meta.roles.includes(LOGIN_TYPE.AGENT);
// });
// AGENT.forEach(first => {
//     if (first.children) {
//         let children = first.children.filter(second => {
//             let meta = second.meta;
//             return !meta.roles || meta.roles.includes(LOGIN_TYPE.AGENT);
//         });
//         first.children = children;
//     }
// });

// 门店
// STORE = Util.deepCopy(target).filter(first => {
//     let meta = first.meta;
//     return !meta.roles || meta.roles.includes(LOGIN_TYPE.STORE);
// });
// STORE.forEach(first => {
//     if (first.children) {
//         let children = first.children.filter(second => {
//             let meta = second.meta;
//             return !meta.roles || meta.roles.includes(LOGIN_TYPE.STORE);
//         });
//         first.children = children;
//     }
// });

export const SIDER = {
    ADMIN,
    DISTRIBUTOR,
    // AGENT,
    // STORE,
};

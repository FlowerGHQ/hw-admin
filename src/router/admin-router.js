import Const from '../core/const';
import Util from '../core/utils';
import Data from '../core/data';
import Layout from '../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.LOGIN.ROUTER_TYPE;

// 客户关怀
const inquiryManagement = {
    path: '/inquiry-management',
    component: Layout,
    name: 'InquiryManagement',
    redirect: '/inquiry-management/list',
    type: [ROUTER_TYPE.AFTER],
    meta: {
        title: '问询单管理',
        title_en: 'Inquiry Management',
        icon: 'i_menu_fankuguanli',
        roles: [LOGIN_TYPE.ADMIN],
        auth: ['enquiry-ticket.list', 'enquiry-ticket-category.list', 'enquiry-ticket-customer.list'],
    },
    children: [
        {
            path: 'list',
            name: 'InquiryManagementList',
            component: () => import('@/views/customer-care/customer-care-list.vue'),
            meta: {
                title: '问询单列表',
                title_en: 'Customer Service Inquiry',
                auth: ['enquiry-ticket.list'],
            },
        },
        {
            path: 'edit',
            name: 'InquiryManagementEdit',
            component: () => import('@/views/customer-care/customer-care-edit.vue'),
            meta: {
                hidden: true,
                title: '问询单编辑',
                title_en: 'Customer Service Inquiry Edit',
            },
        },
        {
            path: 'detail',
            name: 'InquiryManagementDetail',
            component: () => import('@/views/customer-care/customer-care-detail.vue'),
            meta: {
                hidden: true,
                title: '问询单详情',
                title_en: 'Customer Service Inquiry Detail',
            },
        },
        // 车型分类管理
        {
            path: 'car-model-management',
            name: 'CarModelManagement',
            component: () => import('@/views/customer-care/car-model-management.vue'),
            meta: {
                title: '车型分类管理',
                title_en: 'Vehicle Model Management',
                auth: ['enquiry-ticket-category.list'],
            },
        },
        // 账号管理及分配
        {
            path: 'account-management',
            name: 'AccountManagement',
            component: () => import('@/views/customer-care/account-management.vue'),
            meta: {
                title: '问询单分配',
                title_en: 'Inquiry Sheet Distribution',
                auth: ['enquiry-ticket-customer.list'],
            },
        },
    ],
};
// 运营管理
const operationManagement = {
    path: '/operation',
    component: Layout,
    redirect: '/operation/report-list',
    name: 'Operation',
    type: [ROUTER_TYPE.SALES],
    meta: {
        title: '运营管理',
        title_en: 'Operation Management',
        icon: 'i_order',
        roles: [LOGIN_TYPE.ADMIN],
        auth: ['operate.announcement', 'operate.advertisement'],
    },
    children: [
        {
            path: 'report-list',
            name: 'ReportList',
            component: () => import('@/views/operation/report-list.vue'),
            meta: {
                title: '通知公告',
                title_en: 'Notice And Announcement',
                auth: ['operate.announcement'],
            },
        },
        {
            path: 'report-edit',
            name: 'ReportEdit',
            component: () => import('@/views/operation/report-edit.vue'),
            meta: {
                hidden: true,
                title: '通知公告编辑',
                title_en: 'Notice Editor',
                parent: '/operation/report-list',
            },
        },
        {
            path: 'ad-list',
            name: 'adList',
            component: () => import('@/views/operation/ad-list.vue'),
            meta: {
                title: '广告位管理',
                title_en: 'Advertising Space Management',
                auth: ['operate.advertisement'],
            },
        },
        {
            path: 'ad-edit',
            name: 'adEdit',
            component: () => import('@/views/operation/ad-edit.vue'),
            meta: {
                hidden: true,
                title: '广告位编辑',
                title_en: 'AD Space Editor',
                parent: '/operation/ad-list',
            },
        },
    ],
};

// 切换 销售/售后/生产/CRM 路口显示 空页面显示
const adminEmpty = {
    path: '/admin',
    component: Layout,
    name: 'Empty',
    redirect: '/admin/404',
    type: [ROUTER_TYPE.AFTER],
    meta: {
        title: '空',
        title_en: 'Inquiry Management',
        hidden: true,
    },
    children: [
        {
            path: '404',
            name: '404',
            component: () => import('@/views/z-error/admin404.vue'),
            meta: {
                title: '空',
                title_en: 'Inquiry Management',
                hidden: true,
            },
        },
    ],
};

// 仓储管理(Warehousing management)
const warehousingManagement = {
    path: '/warehousing-management',
    component: Layout,
    redirect: '/warehousing-management/report-list',
    name: 'WarehousingManagement',
    type: [ROUTER_TYPE.WAREHOUSING],
    meta: {
        title: '仓储管理',
        title_en: 'Warehousing Management',
        icon: 'i_order',
        roles: [LOGIN_TYPE.ADMIN],        
    },
    children: [
        {
            path: 'procurement',
            name: 'WarehousingManagementProcurement',
            component: () => import('@/views/admin/warehousing-management/procurement.vue'),
            meta: {
                title: '采购入库单列表',
                title_en: 'List Of Purchase Orders',                
            },
        },  
        {
            path: 'production',
            name: 'WarehousingManagementProduction',
            component: () => import('@/views/admin/warehousing-management/production.vue'),
            meta: {
                title: '生产订单列表',
                title_en: 'Production Order List',                
            },
        },  
        {
            path: 'son-production',
            name: 'WarehousingManagementSonProduction',
            component: () => import('@/views/admin/warehousing-management/son-production.vue'),
            meta: {
                hidden: true,
                title: '生产订单列表',
                title_en: 'Production Order List',                
            },
        },  
    ],
};

// 尾款待支付订单表
const finalPaymentOrder = {
    path: 'final-payment-list',
    name: 'finalPaymentList',
    component: () => import('@/views/distributor/final-unpaid-payment/list.vue'),
    meta: {
        title: '尾款待支付订单表',
        title_en: 'Final Payment List',
        icon: 'i_menu_fankuguanli',
        roles: [LOGIN_TYPE.ADMIN],
    },
};
// 取消订单申请列表
const cancellationOrderRequest = {
    path: 'cancellation-order-list',
    name: 'cancellationOrderList',
    component: () => import('@/views/distributor/cancellation-order/list.vue'),
    meta: {
        title: '取消订单申请列表',
        title_en: 'Cancellation Order List',
        icon: 'i_menu_fankuguanli',
        roles: [LOGIN_TYPE.ADMIN],
    },
};

export { inquiryManagement, operationManagement, adminEmpty, warehousingManagement, finalPaymentOrder, cancellationOrderRequest };

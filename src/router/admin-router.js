import Const from '../core/const';
import Util from '../core/utils';
import Data from '../core/data';
import Layout from '../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 平台方客户关怀
const inquiryManagement = {
    path: '/inquiry-management',
    component: Layout,
    name: 'InquiryManagement',
    redirect: '/inquiry-management/list',
    type: [ROUTER_TYPE.AFTER],
    meta: {
        title: '客户关怀',
        title_en: 'Customer Care',
        icon: 'i_menu_fankuguanli',
        roles: [LOGIN_TYPE.ADMIN],
        auth: ['aftermarket.enquiry'],
    },
    children: [
        {
            path: 'list',
            name: 'InquiryManagementList',
            component: () => import('@/views/customer-care/customer-care-list.vue'),
            meta: {
                title: '客服问询单',
                title_en: 'Customer Service Inquiry',
                auth: ['aftermarket.enquiry.enquiry-ticket'],
            },
        },
        {
            path: 'edit',
            name: 'InquiryManagementEdit',
            component: () => import('@/views/customer-care/customer-care-edit.vue'),
            meta: {
                hidden: true,
                title: '客服问询单编辑',
                title_en: 'Customer Service Inquiry Edit',
            },
        },
        {
            path: 'detail',
            name: 'InquiryManagementDetail',
            component: () => import('@/views/customer-care/customer-care-detail.vue'),
            meta: {
                hidden: true,
                title: '客服问询单详情',
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
                auth: ['aftermarket.enquiry.quiry-ticket-category'],
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
                auth: ['aftermarket.enquiry.enquiry-ticket-customer'],
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
        auth: ['sales.operate'],
    },
    children: [
        {
            path: 'report-list',
            name: 'ReportList',
            component: () => import('@/views/operation/report-list.vue'),
            meta: {
                title: '通知公告',
                title_en: 'Notice And Announcement',
                auth: ['sales.operate.announcement'],
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
                auth: ['sales.operate.advertisement'],
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
export { inquiryManagement, operationManagement, adminEmpty };

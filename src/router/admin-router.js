import Const from "../core/const"
import Util from "../core/utils"
import Data from "../core/data"
import Layout from '../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE
const ROUTER_TYPE = Const.LOGIN.ROUTER_TYPE

// 客户关怀
const inquiryManagement = {
    path: "/inquiry-management",
    component: Layout,
    name: "InquiryManagement",
    redirect: "/inquiry-management/list",    
    type: [ROUTER_TYPE.AFTER],
    meta: {
        title: '问询单管理',
        title_en: 'Inquiry Management',
        icon: 'i_menu_fankuguanli',
        roles: [LOGIN_TYPE.ADMIN],
        // auth: ["supplier-application.list"],
    },
    children: [
        {
            path: 'list',
            name: 'InquiryManagementList',
            component: () => import('@/views/customer-care/customer-care-list.vue'),
            meta: {
                title: '问询单列表',
                title_en: 'Customer Service Inquiry',
            }
        },
        {
            path: 'edit',
            name: 'InquiryManagementEdit',
            component: () => import('@/views/customer-care/customer-care-edit.vue'),
            meta: {
                hidden: true,
                title: '问询单编辑',
                title_en: 'Customer Service Inquiry Edit',
            }
        },
        {
            path: 'detail',
            name: 'InquiryManagementDetail',
            component: () => import('@/views/customer-care/customer-care-detail.vue'),
            meta: {
                hidden: true,
                title: '问询单详情',
                title_en: 'Customer Service Inquiry Detail',
            }
        },
        // 车型分类管理
        {
            path: 'car-model-management',
            name: 'CarModelManagement',
            component: () => import('@/views/customer-care/car-model-management.vue'),
            meta: {
                title: '车型分类管理',
                title_en: 'Car Model Management',
            }
        },
        // 账号管理及分配
        {
            path: 'account-management',
            name: 'AccountManagement',
            component: () => import('@/views/customer-care/account-management.vue'),
            meta: {
                title: '账号管理及分配',
                title_en: 'Account Management',
            }
        },
    ]
}
// 运营管理
const operationManagement = { 
    path: '/operation',
    component: Layout,
    redirect: '/operation/report-list',
    name: 'Operation',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '运营管理',
        title_en: 'Operation Management',
        icon: 'i_order',
        roles: [LOGIN_TYPE.ADMIN],
    },
    children: [
        {
            path: 'report-list',
            name: 'ReportList',
            component: () => import('@/views/operation/report-list.vue'),
            meta: {
                title: '通知公告',
                title_en: 'Notice And Announcement',
            }
        },
        {
            path: 'report-edit',
            name: 'ReportEdit',
            component: () => import('@/views/operation/report-edit.vue'),
            meta: {
                hidden: true,
                title: '通知公告编辑',
                title_en: 'Notice Editor',
            }
        },
        {
            path: 'ad-list',
            name: 'AD',
            component: () => import('@/views/operation/ad-list.vue'),
            meta: {
                title: '广告位管理',
                title_en: 'Advertising Space Management',
            }
        },
        {
            path: 'ad-edit',
            name: 'AD',
            component: () => import('@/views/operation/ad-edit.vue'),
            meta: {
                hidden: true,
                title: '广告位编辑',
                title_en: 'AD Space Editor',
            }
        },
    ]
}
export  {
    inquiryManagement,
    operationManagement
}

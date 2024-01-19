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
    type: [ROUTER_TYPE.AFTER, ROUTER_TYPE.PRODUCTION, ROUTER_TYPE.CRM],
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
    ]
}
export  {
    inquiryManagement
}

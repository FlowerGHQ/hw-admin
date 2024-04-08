import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';
import Layout from '../../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 全部不知道用途的
// 邮件管理
const mailManagement = {
    path: '/mail-management',
    component: Layout,
    redirect: '/mail-management/subscription-list',
    name: 'MailManagement',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '邮件管理',
        title_en: 'Mail Management',
        icon: 'i_s_customer',
        hidden: true,
    },
    children: [
        {
            path: 'subscription-list',
            name: 'SubscriptionList',
            component: () => import('@/views/crm-mail-management/subscription-list.vue'),
            meta: {
                title: '邮箱订阅状态列表',
                title_en: 'List of email subscription status',
            },
        },
        {
            path: 'mail-send-statistics',
            name: 'MailSendStatistics',
            component: () => import('@/views/crm-mail-management/mail-send-statistics.vue'),
            meta: {
                title: '邮件发送及统计',
                title_en: 'Mail sending and statistics',
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
};
/* 零售业务新添加在CRM中的 start*/
// 车辆管理
const retailBusinessVehicleManagement = {
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
};
// 订单管理
const retailBusinessOrderManagement = {
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
};

// 维修单
const RepairInvoiceExport = {
    path: '/repair/invoice-download',
    name: 'RepairInvoiceExport',
    component: () => import('@/views/repair/repair-invoice.vue'),
    type: [ROUTER_TYPE.AFTER],
    meta: {
        hidden: true,
        title: '维修单结算',
    },
};

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
        },
        children: [
            {
                path: 'waybill-list',
                name: 'waybillList',
                component: () => import('@/views/waybill/waybill-list.vue'),
                meta: {
                    title: '物流列表',
                }
            },
            // {
            //     path: 'waybill-company',
            //     name: 'WaybillCompanyList',
            //     component: () => import('@/views/waybill/waybill-company.vue'),
            //     meta: {
            //         title: '物流公司',
            //     }
            // },
        ]
    },*/

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
/* 零售业务新添加在CRM中的 end*/
export { mailManagement, retailBusinessVehicleManagement, retailBusinessOrderManagement, RepairInvoiceExport };

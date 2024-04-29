import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 全部不知道用途的
// 邮件管理
const mailManagement = {
    path: '/mail-management',
    component: () => import('@/views/layout/index.vue'),
    name: 'MailManagement',
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
    component: () => import('@/views/layout/index.vue'),
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
    component: () => import('@/views/layout/index.vue'),
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
    meta: {
        hidden: true,
        title: '维修单结算',
    },
};

// 账户管理(废弃)
const walletManagement = {
    path: '/wallet',
    component: () => import('@/views/layout/index.vue'),
    name: 'WalletManagement',
    meta: {
        title: '账户管理',
        title_en: 'Accounts',
        icon: 'i_s_user',
        hidden: true,
    },
    children: [
        {
            path: 'wallet-list',
            name: 'WalletList',
            component: () => import('@/views/wallet/wallet-list.vue'),
            meta: {
                title: '账户列表',
                title_en: 'Account list',
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
            },
        },
    ],
};

// 可能废弃了
const Dashboard = {
    path: '/dashboard',
    component: () => import('@/views/layout/index.vue'),
    name: 'Dashboard',
    meta: {
        title: '商城',
        title_en: 'Data Board',
        icon: 'i_s_dashboard',
        hidden: true,
    },
    children: [
        {
            path: 'index',
            name: 'Index',
            component: () => import('@/views/dashboard/Analytics.vue'),
            meta: {
                title: '首页',
                title_en: 'Index',
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
};

/*{ // 零售商管理 - 零售商端
        path: '/agent/agent-detail-sp',
        component: () => import('@/views/layout/index.vue'),
        meta: {
            title: '零售商管理',
            icon: 'i_s_agent',
        },
        children: [
            {
                path: '',
                name: 'AgentManagementSp',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    title: '零售商详情',
                }
            }
        ]
    },*/
/* { // 门店管理 - 门店端
        path: '/store/store-detail-sp',
        component: () => import('@/views/layout/index.vue'),
        meta: {
            title: '门店管理',
            icon: 'i_s_store',
        },
        children: [
            {
                path: '',
                name: 'StoreManagementSp',
                component: () => import('@/views/store/store-detail.vue'),
                meta: {
                    title: '门店详情',
                }
            }
        ]
    },*/

/* { // 物流管理
        path: '/waybill',
        component: () => import('@/views/layout/index.vue'),        
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
//     component: () => import('@/views/layout/index.vue'),
//     name: 'Warranty',
//     meta: {
//         title: '三包管理',
//         title_en: 'Warranty Management',
//         icon: 'i_s_temp',
//     },
//     children: [
//         {
//             path: 'warranty-time-config',
//             name: 'warrantyConfig',
//             component: () => import('@/views/warranty/time-config.vue'),
//             meta: {
//                 title: '生效时间',
//                 title_en: 'Effective Time',
//             }
//         },
//         {
//             path: 'warranty-list',
//             name: 'WarrantyList',
//             component: () => import('@/views/warranty/warranty-list.vue'),
//             meta: {
//                 title: '三包时长',
//                 title_en: 'Warranty Duration',
//             }
//         },
//     ]
// },
/* 零售业务新添加在CRM中的 end*/
export {
    mailManagement,
    retailBusinessVehicleManagement,
    retailBusinessOrderManagement,
    RepairInvoiceExport,
    walletManagement,
};

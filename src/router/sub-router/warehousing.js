import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 仓储管理(Warehousing management)
const warehousingManagement = {
    path: '/warehousing-management',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/warehousing-management/procurement',
    name: 'WarehousingManagement',
    type: [ROUTER_TYPE.WAREHOUSING],
    meta: {
        title: '仓储管理',
        title_en: 'Warehousing Management',
        icon: 'i_order',
        auth: ['invoice.storage'],
    },
    children: [
        {
            path: 'procurement',
            name: 'WarehousingManagementProcurement',
            component: () => import('@/views/admin/warehousing-management/procurement.vue'),
            meta: {
                title: '采购入库单列表',
                title_en: 'List Of Purchase Orders',
                auth: ["invoice.storage.purchase-order"]    
            },
        },
        {
            path: 'production',
            name: 'WarehousingManagementProduction',
            component: () => import('@/views/admin/warehousing-management/production.vue'),
            meta: {
                title: '生产订单列表',
                title_en: 'Production Order List',
                auth: ["invoice.storage.production-order"]    
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

export { warehousingManagement };

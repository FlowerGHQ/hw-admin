import Const from '../core/const';
import Util from '../core/utils';
import Data from '../core/data';
import Layout from '../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.LOGIN.ROUTER_TYPE;


// 仓储管理(Warehousing management)
const warehousingManagement = {
    path: '/warehousing-management',
    component: Layout,
    redirect: '/warehousing-management/procurement',
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

export { warehousingManagement };

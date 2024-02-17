import Const from '../core/const';
import Util from '../core/utils';
import Data from '../core/data';
import Layout from '../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.LOGIN.ROUTER_TYPE;

const supplyManage = {
    // 供应商管理(仅平台方可看)
    path: '/supply-manage',
    component: Layout,
    name: 'SupplyManage',
    redirect: '/supply/list',
    type: [ROUTER_TYPE.SALES],
    meta: {
        title: '供应商管理',
        title_en: 'supplier management',
        icon: 'i_menu_fankuguanli',
        roles: [LOGIN_TYPE.ADMIN],
        auth: ['supplier-application.list'],
    },
    children: [
        {
            path: 'list',
            name: 'SupplyList',
            component: () => import('@/views/supplier/manage/list.vue'),
            meta: {
                title: '申请资料列表',
                title_en: 'Application Materials',
            },
        },
        {
            path: 'detail',
            name: 'SupplyDetail',
            component: () => import('@/views/supplier/manage/detail.vue'),
            meta: {
                title: '资料详情',
                title_en: 'Materials Detail',
                hidden: true,
            },
        },
        {
            path: 'add',
            name: 'SupplyAdd',
            component: () => import('@/views/supplier/add-supply/index.vue'),
            meta: {
                title: '创建资料',
                title_en: 'Create Data',
                hidden: true,
            },
        },
    ],
};

const supplyRouters = [
    // {
    //     path: "/supply-home",
    //     name: "SupplyHome",
    //     component: () => import('@/views/supplier/home/index.vue'),
    //     meta: {
    //         title: '首页',
    //         title_en: 'Supplier Home',
    //         hidden: true,
    //     },
    // },
    {
        path: '/supply-home',
        name: 'SupplyHome',
        component: () => import('@/views/supplier/home/index.vue'),
        meta: {
            title: '首页',
            title_en: 'Supplier Home',
            hidden: true,
        },
    },
];
export { supplyManage, supplyRouters };

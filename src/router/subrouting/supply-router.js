import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';
import Layout from '../../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

const supplyManage = {
    // 供应商管理(仅平台方可看)
    path: '/supply-manage',
    component: Layout,
    name: 'SupplyManage',
    redirect: '/supply-manage/list',
    type: [ROUTER_TYPE.SUPPLIER],
    meta: {
        title: '供应商管理',
        title_en: 'supplier management',
        icon: 'i_menu_fankuguanli',
        auth: ['supply.supplier-manage'],
    },
    children: [
        {
            path: 'list',
            name: 'SupplyList',
            component: () => import('@/views/supplier/manage/list.vue'),
            meta: {
                title: '供应商列表',
                title_en: 'Supplier list',
                auth: ['supply.supplier-manage.save-supplier'],
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

// 物料管理(代码其实就是商品管理的代码只是路由不一样)
const supplyMaterialManagement = {
    // 物料管理
    path: '/material',
    component: Layout,
    redirect: '/material/material-list',
    name: 'MaterialManagement',
    type: [ROUTER_TYPE.SUPPLIER],
    meta: {
        title: '物料管理',
        title_en: 'Material Management',
        icon: 'i_menu_shangpingguanli',
        roles: [LOGIN_TYPE.ADMIN],
        auth: ['supplier-material.list'],
    },
    children: [
        {
            path: 'material-list',
            name: 'SupplyMaterialList',
            component: () => import('@/views/item/item-list.vue'),
            meta: {
                title: '物料列表',
                title_en: 'Material list',
                auth: ['supplier-material.list'],
            },
        },
        {
            path: 'material-edit',
            name: 'SupplyMaterialEdit',
            component: () => import('@/views/item/item-edit.vue'),
            meta: {
                hidden: true,
                title: '物料编辑',
                parent: '/material/material-list',
            },
        },
        {
            path: 'material-detail',
            name: 'SupplyMaterialDetail',
            component: () => import('@/views/item/item-detail.vue'),
            meta: {
                hidden: true,
                title: '物料详情',
                parent: '/material/material-list',
            },
        },
        {
            path: 'material-explored-edit',
            name: 'SupplyMaterialExploredEdit',
            component: () => import('@/views/item/item-explored-edit.vue'),
            meta: {
                hidden: true,
                title: '物料爆炸图详情',
                parent: '/material/material-list',
            },
        },
        {
            path: 'material-category',
            name: 'SupplyMaterialCategory',
            component: () => import('@/views/item/item-category.vue'),
            meta: {
                title: '物料分类',
                title_en: 'Material Categories',
                auth: ['supplier-material.category-list'],
            },
        },
        {
            path: 'material-category-config',
            name: 'SupplyMaterialCategoryConfig',
            component: () => import('@/views/item/item-category-config.vue'),
            meta: {
                hidden: true,
                title: '物料分类配置',
            },
        },
        {
            path: 'material-category-explored',
            name: 'SupplyMaterialCategoryExplored',
            component: () => import('@/views/item/Item-category-explored.vue'),
            meta: {
                hidden: true,
                title: '物料爆炸图编辑',
            },
        },
        {
            path: 'material-bom',
            name: 'SupplyMaterialBom',
            component: () => import('@/views/item/item-bom.vue'),
            meta: {
                title: 'BOM管理',
                title_en: 'BOM Management',
                auth: ['supplier-material.bom-list'],
            },
        },
    ],
};
export { supplyManage, supplyRouters, supplyMaterialManagement };

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
    redirect: '/supply-manage/list',
    type: [ROUTER_TYPE.SUPPLIER],
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
                title: '新增供应商',
                title_en: 'Add New Suppliers',
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
const supplyMaterialManagement =  {
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
        // auth: ['item.list', 'item-category.list'],
    },
    children: [
        {
            path: 'material-list',
            name: 'MaterialList',
            component: () => import('@/views/item/item-list.vue'),
            meta: {
                title: '物料列表',
                title_en: 'Material list',
                // auth: ['item.list'],
            },
        },
        {
            path: 'material-edit',
            name: 'MaterialEdit',
            component: () => import('@/views/item/item-edit.vue'),
            meta: {
                hidden: true,
                title: '物料编辑',
                parent: '/material/material-list',
                // auth: ['item.save'],
            },
        },
        {
            path: 'material-detail',
            name: 'MaterialDetail',
            component: () => import('@/views/item/item-detail.vue'),
            meta: {
                hidden: true,
                title: '物料详情',
                parent: '/material/material-list',
                // auth: ['item.detail'],
            },
        },
        {
            path: 'material-explored-edit',
            name: 'MaterialExploredEdit',
            component: () => import('@/views/item/item-explored-edit.vue'),
            meta: {
                hidden: true,
                title: '物料爆炸图详情',
                parent: '/material/material-list',
                // auth: ['item.save'],
            },
        },
        {
            path: 'material-category',
            name: 'MaterialCategory',
            component: () => import('@/views/item/item-category.vue'),
            meta: {
                title: '物料分类',
                title_en: 'Material Categories',
                // auth: ['item-category.list'],
            },
        },
        {
            path: 'material-category-config',
            name: 'MaterialCategoryConfig',
            component: () => import('@/views/item/item-category-config.vue'),
            meta: {
                hidden: true,
                title: '物料分类配置',
            },
        },
        {
            path: 'material-category-explored',
            name: 'MaterialCategoryExplored',
            component: () => import('@/views/item/Item-category-explored.vue'),
            meta: {
                hidden: true,
                title: '物料爆炸图编辑',
            },
        },
        {
            path: 'material-bom',
            name: 'MaterialBom',
            component: () => import('@/views/item/item-bom.vue'),
            meta: {
                title: 'BOM管理',
                title_en: 'BOM Management',
                // auth: ['aftermarket-bom.list'],
            },
        },
    ],
}
export { supplyManage, supplyRouters, supplyMaterialManagement };

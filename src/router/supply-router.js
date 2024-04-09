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
        {
            path: 'qualifiedList',
            name: 'QualifiedSupplierList',
            component: () => import('@/views/supplier/manage/qualified-list.vue'),
            meta: {
                title: '合格供应商名录',
                title_en: 'Qualified Supplier List',
            },
        },
        // 考虑免审供应商名录
        {
            path: 'exemptList',
            name: 'ExemptSupplierList',
            component: () => import('@/views/supplier/manage/exempt-list.vue'),
            meta: {
                title: '考虑免审供应商名录',
                title_en: 'Consider Exempt Supplier List',
            },
        },

        // 潜在供应商名录
        {
            path: 'potentialList',
            name: 'PotentialSupplierList',
            component: () => import('@/views/supplier/manage/potential-list.vue'),
            meta: {
                title: '潜在供应商名录',
                title_en: 'Potential Supplier List',
            },
        },
        // 注册供应商名录
        {
            path: 'registerList',
            name: 'RegisterSupplierList',
            component: () => import('@/views/supplier/manage/register-list.vue'),
            meta: {
                title: '注册供应商名录',
                title_en: 'Register Supplier List',
            },
        },
        // 淘汰供应商名录
        {
            path: 'eliminateList',
            name: 'EliminateSupplierList',
            component: () => import('@/views/supplier/manage/eliminate-list.vue'),
            meta: {
                title: '淘汰供应商名录',
                title_en: 'Eliminate Supplier List',
            },
        },
        // 待现场考核供应商名录
        {
            path: 'assessmentList',
            name: 'AssessmentSupplierList',
            component: () => import('@/views/supplier/manage/assessment-list.vue'),
            meta: {
                title: '待现场考核供应商名录',
                title_en: 'Assessment Supplier List',
            },
        },
        // 淘汰原因管理
        {
            path: 'eliminateReason',
            name: 'EliminateReason',
            component: () => import('@/views/supplier/manage/eliminate-reason.vue'),
            meta: {
                title: '淘汰原因管理',
                title_en: 'Eliminate Reason Management',
            },
        },
        // 车型分类管理
        {
            path: 'vehicleCategory',
            name: 'VehicleCategory',
            component: () => import('@/views/supplier/manage/vehicle-category.vue'),
            meta: {
                title: '车型分类管理',
                title_en: 'Vehicle Category Management',
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
// 成本管理
const costManagement = {
    path: '/cost',
    component: Layout,
    redirect: '/cost/cost-list',
    name: 'CostManagement',
    type: [ROUTER_TYPE.SUPPLIER],
    meta: {
        title: '成本管理',
        title_en: 'Cost Management',
        icon: 'i_menu_shangpingguanli',
        roles: [LOGIN_TYPE.ADMIN],
        auth: ['supplier-cost-management.model-cost-list'],
    },
    children: [
        {
            path: 'cost-list',
            name: 'CostList',
            component: () => import('@/views/supplier/cost/list.vue'),
            meta: {
                title: '车型成本表',
                title_en: 'Vehicle Cost Table',
                auth: ['supplier-cost-management.model-cost-list'],
            },
        },
    ],
};
export { supplyManage, supplyRouters, supplyMaterialManagement, costManagement };

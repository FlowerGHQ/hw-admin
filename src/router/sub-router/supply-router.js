import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

const supplyManage = {
    // 供应商管理(仅平台方可看)
    path: '/supply-manage',
    component: () => import('@/views/layout/index.vue'),
    name: 'SupplyManage',
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
                title: '新增供应商',
                title_en: 'Add New Suppliers',
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
        // 考虑免审供应商名录
        {
            path: 'exemptList',
            name: 'ExemptSupplierList',
            component: () => import('@/views/supplier/manage/exempt-list.vue'),
            meta: {
                title: '考虑免审供应商名录',
                title_en: 'Consider Exempt Supplier List',
                auth: ['supply.supplier-manage.consider-exempt-review'],
            },
        },
        // 免审申请表
        {
            path: 'exemptApply',
            name: 'ExemptSupplierApply',
            component: () => import('@/views/supplier/manage/exempt-apply.vue'),
            meta: {
                title: '免审申请表',
                title_en: 'Exempt Application Form',
                hidden: true,
                auth: ['supply.supplier-manage.consider-exempt-review.view'],
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
                auth: ['supply.supplier-manage.wait-scene-examine'],
            },
        },
        {
            path: 'qualifiedList',
            name: 'QualifiedSupplierList',
            component: () => import('@/views/supplier/manage/qualified-list.vue'),
            meta: {
                title: '合格供应商名录',
                title_en: 'Qualified Supplier List',
                auth: ['supply.supplier-manage.qualified'], //正式
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
                auth: ['supply.supplier-manage.eliminate'],
            },
        },

        // 淘汰原因管理
        {
            path: 'eliminateReason',
            name: 'EliminateReason',
            component: () => import('@/views/supplier/manage/eliminate-reason.vue'),
            meta: {
                title: '合格供应商淘汰原因管理',
                title_en: 'Qualified Supplier Elimination Reason Management',
                auth: ['supply.supplier-manage.eliminate-reason'],
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
                auth: ['supply.supplier-manage.vehicle-category'],
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
    component: () => import('@/views/layout/index.vue'),
    name: 'MaterialManagement',
    meta: {
        title: '物料管理',
        title_en: 'Material Management',
        icon: 'i_menu_shangpingguanli',
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
    component: () => import('@/views/layout/index.vue'),
    name: 'CostManagement',
    meta: {
        title: '成本管理',
        title_en: 'Cost Management',
        icon: 'i_menu_shangpingguanli',
        auth: ['supply.cost-manage'],
    },
    children: [
        {
            path: 'cost-list',
            name: 'CostList',
            component: () => import('@/views/supplier/cost/list.vue'),
            meta: {
                title: '车型成本表',
                title_en: 'Vehicle Cost Table',
                auth: ['supply.cost-manage.vehicle'],
            },
        },
    ],
};
export { supplyManage, supplyRouters, supplyMaterialManagement, costManagement };

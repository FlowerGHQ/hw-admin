import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';
import Layout from '../../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 平台方客户关怀
const inquiryManagement = {
    path: '/inquiry-management',
    component: Layout,
    name: 'InquiryManagement',
    redirect: '/inquiry-management/list',
    type: [ROUTER_TYPE.AFTER],
    meta: {
        title: '客户关怀',
        title_en: 'Customer Care',
        icon: 'i_menu_fankuguanli',
        auth: ['aftermarket.enquiry'],
    },
    children: [
        {
            path: 'list',
            name: 'InquiryManagementList',
            component: () => import('@/views/customer-care/customer-care-list.vue'),
            meta: {
                title: '客服问询单',
                title_en: 'Customer Service Inquiry',
                auth: ['aftermarket.enquiry.enquiry-ticket'],
            },
        },
        {
            path: 'edit',
            name: 'InquiryManagementEdit',
            component: () => import('@/views/customer-care/customer-care-edit.vue'),
            meta: {
                hidden: true,
                title: '客服问询单编辑',
                title_en: 'Customer Service Inquiry Edit',
            },
        },
        {
            path: 'detail',
            name: 'InquiryManagementDetail',
            component: () => import('@/views/customer-care/customer-care-detail.vue'),
            meta: {
                hidden: true,
                title: '客服问询单详情',
                title_en: 'Customer Service Inquiry Detail',
            },
        },
        // 车型分类管理
        {
            path: 'car-model-management',
            name: 'CarModelManagement',
            component: () => import('@/views/customer-care/car-model-management.vue'),
            meta: {
                title: '车型分类管理',
                title_en: 'Vehicle Model Management',
                auth: ['aftermarket.enquiry.quiry-ticket-category'],
            },
        },
        // 账号管理及分配
        {
            path: 'account-management',
            name: 'AccountManagement',
            component: () => import('@/views/customer-care/account-management.vue'),
            meta: {
                title: '问询单分配',
                title_en: 'Inquiry Sheet Distribution',
                auth: ['aftermarket.enquiry.enquiry-ticket-customer'],
            },
        },
    ],
};
// 运营管理
const operationManagement = {
    path: '/operation',
    component: Layout,
    redirect: '/operation/report-list',
    name: 'Operation',
    type: [ROUTER_TYPE.SALES],
    meta: {
        title: '运营管理',
        title_en: 'Operation Management',
        icon: 'i_order',
        auth: ['sales.operate'],
    },
    children: [
        {
            path: 'report-list',
            name: 'ReportList',
            component: () => import('@/views/operation/report-list.vue'),
            meta: {
                title: '通知公告',
                title_en: 'Notice And Announcement',
                auth: ['sales.operate.announcement'],
            },
        },
        {
            path: 'report-edit',
            name: 'ReportEdit',
            component: () => import('@/views/operation/report-edit.vue'),
            meta: {
                hidden: true,
                title: '通知公告编辑',
                title_en: 'Notice Editor',
                parent: '/operation/report-list',
            },
        },
        {
            path: 'ad-list',
            name: 'adList',
            component: () => import('@/views/operation/ad-list.vue'),
            meta: {
                title: '广告位管理',
                title_en: 'Advertising Space Management',
                auth: ['sales.operate.advertisement'],
            },
        },
        {
            path: 'ad-edit',
            name: 'adEdit',
            component: () => import('@/views/operation/ad-edit.vue'),
            meta: {
                hidden: true,
                title: '广告位编辑',
                title_en: 'AD Space Editor',
                parent: '/operation/ad-list',
            },
        },
    ],
};
// 工单管理
const repairManagement = {
    path: '/repair',
    component: Layout,
    name: 'RepairManagement',
    redirect: '/repair/repair-list',
    type: [ROUTER_TYPE.AFTER],
    meta: {
        title: '工单管理',
        title_en: 'Maintenance',
        icon: 'i_menu_gongdanguanli',
        auth: ['aftermarket.repair'],
    },
    children: [
        {
            path: 'repair-list',
            name: 'RepairList',
            component: () => import('@/views/repair/repair-list.vue'),
            meta: {
                title: '工单列表',
                title_en: 'Warranty Claim',
                auth: ['aftermarket.repair.repair'],
            },
        },
        {
            path: 'repair-audit-list',
            name: 'RepairAuditList',
            component: () => import('@/views/repair/repair-list.vue'),
            meta: {
                title: '待审工单',
                title_en: 'Pending warranty claim',
                type: 'audit',
                auth: ['aftermarket.repair.wait-examine'],
            },
        },
        {
            path: 'repair-redit-list',
            name: 'RepairReditList',
            component: () => import('@/views/repair/repair-list.vue'),
            meta: {
                title: '待改工单',
                title_en: 'Pending warranty claim',
                type: 'redit',
                auth: ['aftermarket.repair.wait-modified'],
            },
        },
        {
            path: 'repair-invoice-list',
            name: 'RepairInvoiceList',
            component: () => import('@/views/repair/repair-list.vue'),
            meta: {
                title: '待审核故障件',
                title_en: 'Pending defective parts',
                type: 'invoice',
                auth: ['aftermarket.repair.wait-examine-fault'],
            },
        },
        {
            path: 'repair-fault-list',
            name: 'RepairFaultList',
            component: () => import('@/views/repair/repair-list.vue'),
            meta: {
                title: '待入库故障件',
                title_en: 'Wait recall parts',
                type: 'fault',
                auth: ['aftermarket.repair.wait-warehouse-fault'],
            },
        },
        {
            path: 'repair-edit',
            name: 'RepairEdit',
            component: () => import('@/views/repair/repair-edit.vue'),
            meta: {
                hidden: true,
                title: '维修单编辑',
                parent: '/repair/repair-list',
            },
        },
        {
            path: 'repair-detail',
            name: 'RepairDetail',
            component: () => import('@/views/repair/repair-detail.vue'),
            meta: {
                hidden: true,
                title: '维修单详情',
                parent: '/repair/repair-list',
            },
        },
        {
            path: 'repair-invoice',
            name: 'RepairInvoice',
            component: () => import('@/views/repair/repair-invoice.vue'),
            meta: {
                hidden: true,
                title: '维修单结算',
                parent: '/repair/repair-list',
            },
        },
        {
            path: 'item-fault-list',
            name: 'FaultList',
            component: () => import('@/views/repair/item-fault-list.vue'),
            meta: {
                title: '故障管理',
                title_en: 'Fault management',
                auth: ['aftermarket.repair.fault'],
            },
        },
    ],
};

/* CRM start*/
// 数据
const crmDashboard = {
    path: '/crm-dashboard',
    component: Layout,
    redirect: '/crm-dashboard/vote-dashboard',
    name: 'crm-dashboard',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '数据',
        title_en: 'Dashboard',
        icon: 'i_crm_data',
        auth: ['crm.data'],
    },
    children: [
        {
            path: 'dashboard',
            name: 'CrmDashboard',
            component: () => import('@/views/crm-dashboard/dashboard.vue'),
            meta: {
                hidden: true,
                title: '数据看板',
                title_en: 'Dashboard',
            },
        },
        {
            path: 'vote-dashboard',
            name: 'VoteDashboard',
            component: () => import('@/views/crm-dashboard/vote-dashboard.vue'),
            meta: {
                title: '投票看板',
                title_en: 'Voting Board',
                auth: ['crm.data.dashboard'],
            },
        },
        {
            path: 'vote-detail',
            name: 'voteDetail',
            component: () => import('@/views/crm-dashboard/vote-detail.vue'),
            meta: {
                hidden: true,
                title: '投票详情',
                title_en: 'Voting Board',
            },
        },
    ],
};
// 客户
const crmCustomerManagement = {
    path: '/crm-customer',
    component: Layout,
    redirect: '/crm-customer/customer-list',
    name: 'CRMCustomerManagement',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '客户',
        title_en: 'Customers',
        icon: 'i_menu_kehu',
        auth: ['crm.crm-customer'],
    },
    children: [
        {
            path: 'region-customer-list',
            name: 'RegionCustomerList',
            component: () => import('@/views/crm-customer/customer-list.vue'),
            meta: {
                title: '区域客户',
                title_en: 'Regional Customers',
                type: 'region',
                auth: ['crm.crm-customer.area'],
            },
        },
        {
            path: 'private-customer-list',
            name: 'PrivateCustomerList',
            component: () => import('@/views/crm-customer/customer-list-copy1.vue'),
            meta: {
                title: '我的客户',
                title_en: 'My Customers',
                type: 'private',
                auth: ['crm.crm-customer.mine'],
            },
        },
        {
            path: 'customer-list',
            name: 'CustomerList',
            component: () => import('@/views/crm-customer/customer-list-copy2.vue'),
            meta: {
                title: '未分配客户',
                title_en: 'Unassigned Customers',
                type: 'high_seas',
                auth: ['crm.crm-customer.undistributed'],
            },
        },
        {
            path: 'customer-edit',
            name: 'CustomerEdit',
            component: () => import('@/views/crm-customer/customer-edit.vue'),
            meta: {
                hidden: true,
                title: '新建客户',
                parent: '/customer/customer-list',
            },
        },
        {
            path: 'customer-detail',
            name: 'CustomerDetail',
            component: () => import('@/views/crm-customer/customer-detail.vue'),
            meta: {
                hidden: true,
                title: '客户详情',
                parent: '/customer/customer-list',
            },
        },
        // {
        // 	path: 'customer-list',
        // 	name: 'CustomerList',
        // 	component: () => import('@/views/crm/customer/customer-list.vue'),
        // 	meta: {
        // 		title: '公海客户',
        // 		title_en: 'Customer list',
        // 		// auth: ["crm-customer.list"],
        // 	}
        // },
    ],
};

// 商机管理
const crmBoManagement = {
    path: '/crm-bo',
    component: Layout,
    redirect: '/crm-bo/bo-list',
    name: 'CRMBoManagement',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '商机',
        title_en: 'Business Opportunity',
        icon: 'i_menu_shangji',
        auth: ['crm.business'],
    },
    children: [
        {
            path: 'bo-list',
            name: 'BoList',
            component: () => import('@/views/crm-bo/bo-list.vue'),
            meta: {
                title: '商机列表',
                title_en: 'Opportunities List',
                auth: ['crm.business.business'],
            },
        },
        {
            path: 'bo-edit',
            name: 'BoEdit',
            component: () => import('@/views/crm-bo/bo-edit.vue'),
            meta: {
                hidden: true,
                title: '修改商机',
                parent: '/bo/bo-list',
            },
        },
        {
            path: 'bo-detail',
            name: 'BoDetail',
            component: () => import('@/views/crm-bo/bo-detail.vue'),
            meta: {
                hidden: true,
                title: '商机详情',
                parent: '/bo/bo-list',
            },
        },
    ],
};

// 订单管理
const crmOrder = {
    path: '/crm-order',
    component: Layout,
    redirect: '/crm-order/order-list',
    name: 'CRMOrder',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '订单管理',
        title_en: 'Contract Order',
        icon: 'i_crm_order',
        auth: ['crm.manage'],
    },
    children: [
        {
            path: 'order-list',
            name: 'OrderList',
            component: () => import('@/views/crm-order/order-list.vue'),
            meta: {
                title: '订单列表',
                title_en: 'Contract Order list',
                auth: ['crm.manage.order'],
            },
        },
        {
            path: 'order-audit-list',
            name: 'OrderAuditList',
            component: () => import('@/views/crm-order/order-audit-list.vue'),
            meta: {
                hidden: true,
                title: '待审列表',
                title_en: 'Pending List',
            },
        },
        {
            path: 'order-pool-list',
            name: 'OrderPoolList',
            component: () => import('@/views/crm-order/order-pool-list.vue'),
            meta: {
                hidden: true,
                title: '公海列表',
                title_en: 'Pool List',
            },
        },

        {
            path: 'order-edit',
            name: 'OrderEdit',
            component: () => import('@/views/crm-order/order-edit.vue'),
            meta: {
                hidden: true,
                title: '新建合同',
                parent: '/crm-order/order-list',
            },
        },
        {
            path: 'order-detail',
            name: 'OrderDetail',
            component: () => import('@/views/crm-order/order-detail.vue'),
            meta: {
                hidden: true,
                title: '订单详情',
                title_en: 'Contract Details',
                parent: '/crm-order/order-list',
            },
        },
    ],
};

// 回款单
const crmOrderIncome = {
    path: '/crm-order-income',
    component: Layout,
    redirect: '/crm-order-income/order-income-list',
    name: 'CRMOrderIncome',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '回款单',
        title_en: 'Payment Receipt',
        icon: 'i_crm_order_income',
        auth: ['crm.payment'],
    },
    children: [
        {
            path: 'order-income-list',
            name: 'OrderIncomeList',
            component: () => import('@/views/crm-order-income/order-income-list.vue'),
            meta: {
                title: '回款单列表',
                title_en: 'Payment Receipt List',
                auth: ['crm.payment.payment'],
            },
        },
        {
            path: 'order-income-audit-list',
            name: 'OrderIncomeaAuditList',
            component: () => import('@/views/crm-order-income/order-income-audit-list.vue'),
            meta: {
                title: '待审列表',
                title_en: 'Pending List',
                auth: ['crm.payment.wait-audit'],
            },
        },
        {
            path: 'order-income-edit',
            name: 'OrderIncomeEdit',
            component: () => import('@/views/crm-order-income/order-income-edit.vue'),
            meta: {
                hidden: true,
                title: '新建回款单',
                parent: '/crm-order-income/order-income-list',
            },
        },
        {
            path: 'order-income-detail',
            name: 'OrderIncomeDetail',
            component: () => import('@/views/crm-order-income/order-income-detail.vue'),
            meta: {
                hidden: true,
                title: '回款单详情',
                title_en: 'Payment Receipt Phase',
                parent: '/crm-order-income/order-income-list',
            },
        },
    ],
};

// 试驾单
const crmTestDriveList = {
    path: '/crm-test-drive-order',
    component: Layout,
    redirect: '/crm-test-drive-order/test-drive-list',
    name: 'CRMTestDriveList',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '试驾单',
        title_en: 'Test Drive',
        icon: 'i_crm_test_drive',
        auth: ['crm.test-drive'],
    },
    children: [
        {
            path: 'test-drive-list',
            name: 'TestDriveList',
            component: () => import('@/views/crm-test-drive-order/test-drive-list.vue'),
            meta: {
                title: '试驾单列表',
                title_en: 'Test Drive List',
                auth: ['crm.test-drive.test-drive'],
            },
        },
        {
            path: 'test-drive-edit',
            name: 'TestDriveEdit',
            component: () => import('@/views/crm-test-drive-order/test-drive-edit.vue'),
            meta: {
                hidden: true,
                title: '新建试驾单',
                parent: '/crm-test-drive-order/test-drive-list',
            },
        },
        {
            path: 'test-drive-detail',
            name: 'TestDriveDetail',
            component: () => import('@/views/crm-test-drive-order/test-drive-detail.vue'),
            meta: {
                hidden: true,
                title: '试驾订单',
                parent: '/crm-test-drive-order/test-drive-list',
            },
        },
    ],
};

// 智能标签
const smartLabel = {
    path: '/crm-smart-label',
    component: Layout,
    redirect: '/crm-smart-label/label-list',
    name: 'SmartLabel',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '智能标签',
        title_en: 'Smart Label',
        icon: 'i_menu_zhinengbiaoqian',
        auth: ['crm.intelligent'],
    },
    children: [
        {
            path: 'label-list',
            name: 'LabelList',
            component: () => import('@/views/crm-smart-label/label-list.vue'),
            meta: {
                title: '标签列表',
                title_en: 'Label List',
                auth: ['crm.intelligent.label'],
            },
        },
        {
            path: 'label-management',
            name: 'LabelManagement',
            component: () => import('@/views/crm-smart-label/label-management.vue'),
            meta: {
                title: '标签管理',
                title_en: 'Label Management',
                auth: ['crm.intelligent.label-manager'],
            },
        },
    ],
};

// 系统设置
const crmSettingManagement = {
    path: '/crm-setting',
    component: Layout,
    redirect: '/crm-setting/setting-list',
    name: 'CRMSettingManagement',
    type: [ROUTER_TYPE.CRM],
    meta: {
        title: '系统设置',
        title_en: 'System Setting',
        icon: 'i_crm_setting',
        auth: ['crm.system'],
    },
    children: [
        {
            path: 'setting-list',
            name: 'SettingList',
            component: () => import('@/views/crm-setting/group-status.vue'),
            meta: {
                title: '商机阶段',
                title_en: 'Opportunity Stage',
                auth: ['crm.system.business-stage'],
            },
        },
        {
            path: 'dict-list',
            name: 'DictList',
            component: () => import('@/views/crm-setting/dict-list.vue'),
            meta: {
                title: '字典选项',
                title_en: 'Dictionary',
                auth: ['crm.system.dictionary'],
            },
        },
        {
            path: 'region-list',
            name: 'RegionList',
            component: () => import('@/views/crm-setting/region-list.vue'),
            meta: {
                title: '区域管理',
                title_en: 'Region',
                auth: ['crm-group.list'],
                auth: ['crm.system.area-manage'],
            },
        },
        {
            path: 'region-employees-list',
            name: 'RegionEmployeesList',
            component: () => import('@/views/crm-setting/region-employees-list.vue'),
            meta: {
                title: '区域用户管理',
                title_en: 'Region User',
                auth: ['crm.system.area-user-manage'],
            },
        },
    ],
};
/* CRM end*/

/* 销售(SALES) start*/
// 销售策略管理
const salesStrategyManagement = {
    path: '/sales-strategy-management',
    component: Layout,
    redirect: '/sales-strategy-management/sales-strategy-list',
    name: 'SalesStrategyManagement',
    type: [ROUTER_TYPE.SALES],
    meta: {
        title: '销售策略管理',
        title_en: 'System Management',
        icon: 'i_a-iconmenu_xiaoshoucelue',
        auth: ['sales.sales-strategy'],
    },
    children: [
        // 销售策略列表
        {
            path: 'sales-strategy-list',
            name: 'SalesStrategyList',
            component: () => import('@/views/sales-strategy-management/sales-strategy-list.vue'),
            meta: {
                title: '销售策略列表',
                title_en: 'Sales Strategy List',
                auth: ['sales.sales-strategy.sales-strategy'],
            },
        },
        // 编辑销售策略
        {
            path: 'sales-strategy-edit',
            name: 'SalesStrategyEdit',
            component: () => import('@/views/sales-strategy-management/sales-strategy-edit.vue'),
            meta: {
                hidden: true,
                title: '新增编辑销售策略',
                title_en: 'Add Or Edit Sales Strategy',
            },
        },
    ],
};

// COC证书管理
const cocCertificate = {
    path: '/coc',
    component: Layout,
    redirect: '/coc/coc-list',
    name: 'COC',
    type: [ROUTER_TYPE.SALES],
    meta: {
        title: 'COC证书管理',
        title_en: 'COC Certificate Management',
        icon: 'i_menu_COC',
        auth: ['sales.coc'],
    },
    children: [
        {
            path: 'coc-list',
            name: 'COCList',
            component: () => import('@/views/coc/platform-super-list.vue'),
            meta: {
                title: 'COC模板',
                title_en: 'COC Template',
                auth: ['sales.coc.template'],
            },
        },
        {
            // coc证书
            path: 'coc-certificate',
            name: 'COCCertificate',
            component: () => import('@/views/coc/coc-certificate.vue'),
            meta: {
                title: 'COC证书',
                title_en: 'COC Certificate',
                auth: ['sales.coc.certificate'],
            },
        },
        {
            // 证书清单
            path: 'certificate-list',
            name: 'CertificateList',
            component: () => import('@/views/coc/certificate-list.vue'),
            meta: {
                title: '证书清单',
                title_en: 'Certificate List',
                hidden: true,
            },
        },
    ],
};
/* 销售 end*/

/* 财务 start*/
// 审核
const rechargeManagement = {
    // 财务审核
    path: '/recharge',
    component: Layout,
    redirect: '/recharge/recharge-audit',
    name: 'RechargeManagement',
    type: [ROUTER_TYPE.FINANCE],
    meta: {
        title: '审核',
        title_en: 'Audit',
        icon: 'i_s_agent',
        auth: ['finance.audit-record'],
    },
    children: [
        {
            path: 'recharge-audit',
            name: 'RechargeAudit',
            component: () => import('@/views/recharge-audit/index.vue'),
            meta: {
                title: '充值审核',
                title_en: 'Recharge Audit',
                auth: ['finance.audit-record.recharge'],
            },
        },
        {
            path: 'detail',
            name: 'RechargeDetail',
            component: () => import('@/views/recharge-audit/detail.vue'),
            meta: {
                title: '充值审核详情',
                title_en: 'Recharge Audit Details',
                hidden: true,
            },
        },
    ],
};
/* 财务 end*/

/* 生产 start*/
// 生产管理
const manufactureManagement = {
    path: '/manufacture',
    component: Layout,
    redirect: '/manufacture/manufacture-list',
    name: 'ManufactureManagement',
    type: [ROUTER_TYPE.PRODUCTION],
    meta: {
        title: '生产管理',
        title_en: 'Production',
        icon: 'i_menu_shegnchanguanli',
        auth: ['production.production'],
    },
    children: [
        {
            path: 'device-list',
            name: 'DeviceList',
            component: () => import('@/views/manufacture/device-list.vue'),
            meta: {
                title: '设备列表',
                title_en: 'Vehicles',
                type: 'vehicle',
                auth: ['production.production.device'],
            },
        },
        {
            path: 'testRepor-list',
            name: 'TestReportList',
            component: () => import('@/views/test-report/test-report-list.vue'),
            meta: {
                title: '测试报告',
                title_en: 'Test Report List',
                auth: ['production.production.test'],
            },
        },
        {
            path: 'bom-list',
            name: 'BomList',
            component: () => import('@/views/manufacture/bom-list.vue'),
            meta: {
                title: 'BOM列表',
                title_en: 'BOM list',
                auth: ['production.production.bom'],
            },
        },
        {
            path: 'bom-detail',
            name: 'BomDetail',
            component: () => import('@/views/manufacture/bom-detail.vue'),
            meta: {
                hidden: true,
                title: 'BOM详情',
                parent: '/manufacture/bom-list',
            },
        },
        {
            path: 'manufacture-order-list',
            name: 'ManufactureOrderList',
            component: () => import('@/views/manufacture/manufacture-order-list.vue'),
            meta: {
                title: '生产单列表',
                title_en: 'Manufacture order list',
                auth: ['production.production.production-order'],
            },
        },
        {
            path: 'manufacture-order-edit',
            name: 'ManufactureOrderEdit',
            component: () => import('@/views/manufacture/manufacture-order-edit.vue'),
            meta: {
                hidden: true,
                title: '生产单编辑',
                parent: '/manufacture/manufacture-order-list',
            },
        },
        {
            path: 'manufacture-order-detail',
            name: 'ManufactureOrderDetail',
            component: () => import('@/views/manufacture/manufacture-order-detail.vue'),
            meta: {
                hidden: true,
                title: '生产单详情',
                parent: '/item/item-list',
            },
        },
        {
            path: 'calculate-production-amount',
            name: 'CalculateProductionAmount',
            component: () => import('@/views/manufacture/calculate-production-amount.vue'),
            meta: {
                hidden: true,
                title: '成套计算',
            },
        },
        {
            path: 'vehicle-inspection',
            name: 'vehicleInspection',
            component: () => import('@/views/manufacture/vehicle-inspection.vue'),
            meta: {
                title: '整车完检',
                title_en: 'Complete vehicle inspection',
                auth: ['production.production.vehicle'],
            },
        },
    ],
};
// 供应管理
const productionManagement = {
    path: '/production',
    component: Layout,
    redirect: '/production/stock-list',
    name: 'ProductionManagement',
    type: [ROUTER_TYPE.PRODUCTION],
    meta: {
        title: '供应管理',
        title_en: 'Suppliers',
        icon: 'i_menu_gongyingguajli',
        auth: ['production.supply'],
    },
    children: [
        {
            path: 'supplier-list',
            name: 'SupplierList',
            component: () => import('@/views/production/supplier-list.vue'),
            meta: {
                title: '供应商列表',
                title_en: 'Supplier list',
                auth: ['production.supply.supplier'],
            },
        },
        {
            path: 'supplier-edit',
            name: 'SupplierEdit',
            component: () => import('@/views/production/supplier-edit.vue'),
            meta: {
                hidden: true,
                title: '供应商编辑',
                parent: '/production/supplier-list',
            },
        },
        {
            path: 'supplier-detail',
            name: 'SupplierDetail',
            component: () => import('@/views/production/supplier-detail.vue'),
            meta: {
                hidden: true,
                title: '供应商详情',
                parent: '/production/supplier-list',
            },
        },
        {
            path: 'material-purchase-list',
            name: 'MaterialPurchaseList',
            component: () => import('@/views/production/material-purchase-list.vue'),
            meta: {
                title: '采购单列表',
                title_en: 'Procurement list',
                is_sub_menu: true,
                auth: ['production.supply.purchase-order'],
            },
        },
        /*{
            path: 'material-purchase-edit',
            name: 'MaterialPurchaseEdit',
            component: () => import ('@/views/production/material-purchase-edit.vue'),
            meta: {
                title: '新建采购单',
                hidden: true,
                parent: '/production/material-purchase-list',
            }
        },*/
        {
            path: 'material-purchase-detail',
            name: 'MaterialPurchaseDetail',
            component: () => import('@/views/production/material-purchase-detail.vue'),
            meta: {
                hidden: true,
                title: '采购单详情',
                parent: '/production/material-purchase-list',
            },
        },

        {
            path: 'material-list',
            name: 'MaterialList',
            component: () => import('@/views/production/material-list.vue'),
            meta: {
                title: '物料列表',
                title_en: 'Material list',
                auth: ['production.supply.material'],
            },
        },
        {
            path: 'material-edit',
            name: 'MaterialEdit',
            component: () => import('@/views/production/material-edit.vue'),
            meta: {
                hidden: true,
                title: '物料编辑',
                parent: '/production/material-list',
            },
        },
        {
            path: 'material-detail',
            name: 'MaterialDetail',
            component: () => import('@/views/production/material-detail.vue'),
            meta: {
                hidden: true,
                title: '物料详情',
                parent: '/production/material-list',
            },
        },

        // {
        //     path: 'material-adjust-stock',
        //     name: 'MaterialAdjustStock',
        //     component: () => import('@/views/production/material-adjust-stock.vue'),
        //     meta: {
        //         title: '物料调库',
        //     }
        // },
        // {
        //     path: 'material-stock-record',
        //     name: 'MaterialStockRecord',
        //     component: () => import('@/views/production/components/MaterialStockRecord.vue'),
        //     meta: {
        //         title: '物料调库',
        //     }
        // },

        {
            path: 'material-category',
            name: 'MaterialCategory',
            component: () => import('@/views/production/material-category.vue'),
            meta: {
                title: '物料分类',
                title_en: 'Material classification',
                auth: ['production.supply.material-category'],
            },
        },
        {
            // dev上线了 正式服后端未上
            path: 'incoming-inspection',
            name: 'incomingInspection',
            component: () => import('@/views/production/incoming-inspection.vue'),
            meta: {
                title: '来料检验',
                title_en: 'Incoming Inspection',
                auth: ['production.supply.material-checkout'],
            },
        },
    ],
};
/* 财务 end*/

// 多个
// 客户管理
const customerManagement = {
    path: '/eos-customer',
    component: Layout,
    redirect: '/eos-customer/customer-list',
    name: 'CustomerManagement',
    type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER],
    meta: {
        title: '客户管理',
        title_en: 'Customers',
        icon: 'i_s_customer',
        auth: ['sales.customer'],
    },
    children: [
        {
            path: 'customer-list',
            name: 'EOSCustomerList',
            component: () => import('@/views/customer/customer-list.vue'),
            meta: {
                title: '客户列表',
                title_en: 'Customer list',
                auth: ['sales.customer.customer'],
            },
        },
        {
            path: 'eos-customer-edit',
            name: 'EOSCustomerEdit',
            component: () => import('@/views/customer/customer-edit.vue'),
            meta: {
                hidden: true,
                title: '新建客户',
                parent: '/eos-customer/customer-list',
            },
        },
    ],
};

// 存货管理
const InventoryManagement = {
    path: '/inventory',
    component: Layout,
    redirect: '/inventory/inventory-list',
    name: 'InventoryManagement',
    type: [ROUTER_TYPE.SALES, ROUTER_TYPE.PRODUCTION],
    meta: {
        title: '存货管理',
        title_en: 'Stock Control',
        icon: 'i_menu_cunhuoguanli',
        auth: ['sales.inventory-management', 'production.inventory-management'],
    },
    children: [
        {
            path: 'inventory-list',
            name: 'InventoryList',
            component: () => import('@/views/inventory/inventory-list.vue'),
            meta: {
                title: '存货档案',
                title_en: 'Inventory Files',
                auth: ['sales.inventory-management.files', 'production.inventory-management.files'],
            },
        },
        {
            path: 'inventory-category',
            name: 'InventoryCategory',
            component: () => import('@/views/inventory/inventory-category.vue'),
            meta: {
                title: '存货分类',
                title_en: 'Inventory Category',
                auth: ['sales.inventory-management.category', 'production.inventory-management.category'],
            },
        },
        {
            path: 'inventory-edit',
            name: 'InventoryEdit',
            component: () => import('@/views/inventory/inventory-edit.vue'),
            meta: {
                hidden: true,
                title: '存货档案编辑',
                parent: '/inventory/inventory-edit',
            },
        },
    ],
};

// 库存管理
const WarehouseManagement = {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/warehouse-list',
    name: 'WarehouseManagement',
    type: [ROUTER_TYPE.SALES, ROUTER_TYPE.AFTER, ROUTER_TYPE.PRODUCTION],
    meta: {
        title: '库存管理',
        title_en: 'Inventories',
        icon: 'i_menu_kucunguanli',
        auth: ['sales.stock', 'aftermarket.stock', 'production.inventory'],
    },
    children: [
        {
            path: 'warehouse-list',
            name: 'WarehouseList',
            component: () => import('@/views/warehouse/warehouse-list.vue'),
            meta: {
                title: '仓库管理',
                title_en: 'Warehouses',
                auth: ['sales.stock.warehouse', 'aftermarket.stock.warehouse', 'production.inventory.warehouse'],
            },
        },
        {
            path: 'warehouse-edit',
            name: 'WarehouseEdit',
            component: () => import('@/views/warehouse/warehouse-edit.vue'),
            meta: {
                hidden: true,
                title: '仓库编辑',
                parent: '/warehouse/warehouse-list',
            },
        },
        {
            path: 'warehouse-detail',
            name: 'WarehouseDetail',
            component: () => import('@/views/warehouse/warehouse-detail.vue'),
            // component: () => import('@/views/warehouse/warehouse-detail-copy.vue'),
            meta: {
                hidden: true,
                title: '仓库详情',
                parent: '/warehouse/warehouse-list',
            },
        },
        {
            path: 'stock-list',
            name: 'StockList',
            component: () => import('@/views/warehouse/stock-list.vue'),
            meta: {
                title: '库存总览',
                title_en: 'Inventory overview',
                auth: ['sales.stock.overview', 'aftermarket.stock.overview', 'production.inventory.overview'],
            },
        },
        {
            path: 'invoice-list',
            name: 'InvoiceList',
            component: () => import('@/views/warehouse/invoice-list.vue'),
            meta: {
                title: '出入库管理',
                title_en: 'Inbound and outbound',
                auth: ['sales.stock.invoice', 'aftermarket.stock.invoice', 'production.inventory.invoice'],
            },
        },
        {
            path: 'invoice-edit',
            name: 'InvoiceEdit',
            component: () => import('@/views/warehouse/invoice-edit.vue'),
            meta: {
                hidden: true,
                title: '出入库编辑',
                parent: '/invoice/invoice-list',
            },
        },
        {
            path: 'invoice-detail',
            name: 'InvoiceDetail',
            component: () => import('@/views/warehouse/invoice-detail2.vue'),
            meta: {
                hidden: true,
                title: '出入库详情',
                parent: '/invoice/invoice-list',
            },
        },
        {
            path: 'warehouse-transfer-list',
            name: 'WarehouseTransferList',
            component: () => import('@/views/warehouse/warehouse-transfer-list.vue'),
            meta: {
                title: '调货单管理',
                title_en: 'Transfer order',
                auth: [
                    'sales.stock.transfer-note',
                    'aftermarket.stock.transfer-note',
                    'production.inventory.transfer-note',
                ],
            },
        },
        {
            path: 'warehouse-transfer-detail',
            name: 'WarehouseTransferDetail',
            component: () => import('@/views/warehouse/warehouse-transfer-detail.vue'),
            meta: {
                hidden: true,
                title: '调货单详情',
                parent: '/warehouse/warehouse-transfer-list',
            },
        },
        {
            path: 'material-put-stock',
            name: 'MaterialPutStock',
            component: () => import('@/views/production/material-put-stock.vue'),
            meta: {
                title: '入库',
                title_en: 'Inbound',
                auth: [
                    'sales.stock.in-warehouse',
                    'aftermarket.stock.in-warehouse',
                    'production.inventory.material-in',
                ],
            },
        },
        {
            path: 'material-out-stock',
            name: 'MaterialOutStock',
            component: () => import('@/views/production/material-out-stock.vue'),
            meta: {
                title: '出库',
                title_en: 'Outbound',
                auth: [
                    'sales.stock.out-warehouse',
                    'aftermarket.stock.out-warehouse',
                    'production.inventory.material-out',
                ],
            },
        },
        /*  {
                path: 'transfer-order-list-in',
                name: 'TransferOrderListIn',
                component: () => import('@/views/warehouse/transfer-order-list.vue'),
                meta: {
                    title: '调货收货管理',
                    type: 'in'
                }
            },*/
        /*  {
                path: 'transfer-order-list-out',
                name: 'TransferOrderListOut',
                component: () => import('@/views/warehouse/transfer-order-list.vue'),
                meta: {
                    title: '调货发货管理',
                    type: 'out'
                }
            },
            {
                path: 'transfer-order-edit',
                name: 'TransferOrderEdit',
                component: () => import('@/views/warehouse/transfer-order-edit.vue'),
                meta: {
                    hidden: true,
                    title: '调货单编辑',
                    parent: '/transfer/transfer-order-list',
                }
            },
            {
                path: 'transfer-order-detail',
                name: 'TransferOrderDetail',
                component: () => import('@/views/warehouse/transfer-order-detail.vue'),
                meta: {
                    hidden: true,
                    title: '调货单详情',
                    parent: '/transfer/transfer-order-list',
                }
            },*/
        /*        {
                path: 'fault-entity-list',
                name: 'faultEntityList',
                component: () => import('@/views/warehouse/fault-entity-list.vue'),
                meta: {
                    title: '故障件管理',
                }
            },
            {
                path: 'pending-fault-entity-list',
                name: 'pendingFaultEntityList',
                component: () => import('@/views/warehouse/fault-entity-list.vue'),
                meta: {
                    title: '待处理故障件',
                    type: 'pending'
                }
            },*/
    ],
};

// 尾款待支付订单表
const finalPaymentOrder = {
    path: 'final-payment-list',
    name: 'finalPaymentList',
    component: () => import('@/views/distributor/final-unpaid-payment/list.vue'),
    meta: {
        title: '尾款待支付订单表',
        title_en: 'Final Payment List',
        icon: 'i_menu_fankuguanli',
        auth: ['sales.distribution.balance-payment', 'aftermarket.distribution.balance-payment'],
    },
};
// 取消订单申请列表
const cancellationOrderRequest = {
    path: 'cancellation-order-list',
    name: 'cancellationOrderList',
    component: () => import('@/views/distributor/cancellation-order/list.vue'),
    meta: {
        title: '取消订单申请列表',
        title_en: 'Cancellation Order List',
        icon: 'i_menu_fankuguanli',
        auth: ['sales.distribution.cancel-order', 'aftermarket.distribution.cancel-order'],
    },
};

export {
    inquiryManagement,
    operationManagement,
    crmCustomerManagement,
    crmBoManagement,
    crmOrder,
    crmOrderIncome,
    crmTestDriveList,
    smartLabel,
    crmSettingManagement,
    salesStrategyManagement,
    crmDashboard,
    cocCertificate,
    customerManagement,
    InventoryManagement,
    WarehouseManagement,
    manufactureManagement,
    productionManagement,
    repairManagement,
    finalPaymentOrder,
    cancellationOrderRequest,
    rechargeManagement
};

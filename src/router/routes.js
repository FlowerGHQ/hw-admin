import Const from "../core/const"
import Util from "../core/utils"

import Layout from '../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE
const PURCHASE_SEARCH_TYPE = Const.PURCHASE.SEARCH_TYPE
const REFUND_QUERY_TYPE = Const.AFTERSALES.QUERY_TYPE

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        meta: {
            hidden: true
        }
    },
    { // 登录
        path: '/login',
        component: () => import ('@/views/Login.vue'),
        meta: {
            hidden: true,
            title: '登录',
        }
    },
    { // 看板
        path: '/dashboard',
        component: Layout,
        meta: {
            title: '数据看板',
            title_en: 'Data Display',
            icon: 'i_s_dashboard',
            // not_sub_menu: true,
        },
        children: [
	        {
		        path: 'index',
		        name: 'Index',
		        component: () => import('@/views/dashboard/Analytics.vue'),
		        meta: {
			        title: '首页',
			        title_en: 'Index',
			        roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
		        }
	        },
        	{
	            path: '',
	            name: 'Dashboard',
	            component: () => import('@/views/dashboard/Dashboard.vue'),
	            meta: {
	                title: '时效看板',
	                title_en: 'RTDB',
	            }
            },

        ]
    },

    { // 维修单 结算下载
        path: '/repair/invoice-download',
        name: 'RepairInvoiceExport',
        component: () => import ('@/views/repair/repair-invoice.vue'),
        meta: {
            hidden: true,
            title: '维修单结算',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
        },
    },
    { // 分销管理 - 平台端
        path: '/distributor',
        component: Layout,
        redirect: '/distributor/distributor-list',
        name: 'DistributorManagement',
        meta: {
            title: '分销管理',
            title_en: 'Distribution',
            icon: 'i_s_agent',
	        auth: ["distributor.list", "agent.list", "store.list", "purchase-order.list", "sales-area.list"],
        },
        children: [
            {
                path: 'distributor-list',
                name: 'DistributorList',
                component: () => import('@/views/distributor/distributor-list.vue'),
                meta: {
                    title: '分销商列表',
                    title_en: 'Distributors',
                    roles: [LOGIN_TYPE.ADMIN],
	                auth: ["distributor.list"],
                }
            },
            {
                path: 'distributor-edit',
                name: 'DistributorEdit',
                component: () => import('@/views/distributor/distributor-edit.vue'),
                meta: {
                    hidden: true,
                    title: '分销商编辑',
                    parent: '/distributor/distributor-list',
                    roles: [LOGIN_TYPE.ADMIN],
	                auth: ["distributor.save"],

                }
            },
            {
                path: 'distributor-detail',
                name: 'DistributorDetail',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                meta: {
                    hidden: true,
                    title: '分销商详情',
                    parent: '/distributor/distributor-list',
                    roles: [LOGIN_TYPE.ADMIN],
	                auth: ["distributor.detail"],
                }
            },
            {
                path: 'distributor-detail-sp',
                name: 'DistributorDetailSp',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                meta: {
                    title: '分销商详情',
                    title_en: 'Details',
                    roles: [LOGIN_TYPE.DISTRIBUTOR],
	                auth: ["distributor.detail"],
                }
            },
            {
                path: 'agent-list',
                name: 'AgentList',
                component: () => import('@/views/agent/agent-list.vue'),
                meta: {
                    title: '零售商列表',
                    title_en: 'Retailers',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
	                auth: ["agent.list"],
                }
            },
            {
                path: 'agent-edit',
                name: 'AgentEdit',
                component: () => import('@/views/agent/agent-edit.vue'),
                meta: {
                    hidden: true,
                    title: '零售商编辑',
                    parent: '/distributor/agent-list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
	                auth: ["agent.save"],
                }
            },
            {
                path: 'agent-detail',
                name: 'AgentDetail',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    hidden: true,
                    title: '零售商详情',
                    parent: '/distributor/agent-list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
	                auth: ["agent.detail"],
                }
            },
            {
                path: 'agent-detail-sp',
                name: 'AgentDetailSp',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    title: '零售商详情',
                    title_en: 'Details',
                    roles: [LOGIN_TYPE.AGENT],
	                auth: ["agent.detail"],
                }
            },
            {
                path: 'store-list',
                name: 'StoreList',
                component: () => import('@/views/store/store-list.vue'),
                meta: {
                    title: '门店列表',
                    title_en: 'Stores',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT],
	                auth: ["store.list"],
                }
            },
            {
                path: 'store-edit',
                name: 'StoreEdit',
                component: () => import('@/views/store/store-edit.vue'),
                meta: {
                    hidden: true,
                    title: '门店编辑',
                    parent: '/distributor/store-list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT],
	                auth: ["store.save"],
                }
            },
            {
                path: 'store-detail',
                name: 'StoreDetail',
                component: () => import('@/views/store/store-detail.vue'),
                meta: {
                    hidden: true,
                    title: '门店详情',
                    parent: '/distributor/store-list',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT],
	                auth: ["store.detail"],
                }
            },
            {
                path: 'store-detail-sp',
                name: 'StoreDetailSp',
                component: () => import('@/views/store/store-detail.vue'),
                meta: {
                    title: '门店详情',
                    title_en: 'Details',
                    roles: [LOGIN_TYPE.STORE],
	                auth: ["store.detail"],
                }
            },
            {
                path: 'purchase-order-list',
                name: 'AdminPurchaseOrderListAll',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    title: '订单列表',
                    title_en: 'All orders',
                    search_type: PURCHASE_SEARCH_TYPE.ALL,
                    roles: [LOGIN_TYPE.ADMIN],
	                auth: ["purchase-order.list"],
                }
            },
            {
                path: 'purchase-order-children',
                name: 'AdminPurchaseOrderListChildren',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    title: '供货订单',
                    title_en: 'Supply orders',
                    search_type: PURCHASE_SEARCH_TYPE.CHILDREN,
                    roles: [LOGIN_TYPE.ADMIN],
	                auth: ["purchase-order.list"],
                }
            },
            {
                path: 'sales-area-list',
                name: 'SalesList',
                component: () => import('@/views/item/sales-area-list.vue'),
                meta: {
                    title: '销售区域',
                    title_en: 'Sales areas',
                    roles: [LOGIN_TYPE.ADMIN],
	                auth: ["sales-area.list"],
                }
            },
            {
                path: 'sales-area-detail',
                name: 'SalesAreaDetail',
                component: () => import('@/views/item//sales-area-detail.vue'),
                meta: {
                    hidden: true,
                    title: '销售区域详情',
                    parent: '/sales-area-list',
	                auth: ["sales-area.detail"],
                    // auth: ['warehouse.list'],
                }
            },
            {
                path: 'sales-area-edit',
                name: 'SalesEdit',
                component: () => import('@/views/item/sales-area-edit.vue'),
                meta: {
                    hidden: true,
                    title: '区域编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/sales-area-list',
	                auth: ["sales-area.save"],
                }
            },
        ]
    },
/*    { // 分销商管理 - 分销商端
        path: '/distributor/distributor-detail-sp',
        component: Layout,
        meta: {
            title: '分销商管理',
            icon: 'i_s_agent',
            roles: [LOGIN_TYPE.DISTRIBUTOR],
            // not_sub_menu: true,
            sp: true,
        },
        children: [
            {
                path: '',
                name: 'DistributorManagementSp',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                meta: {
                    title: '分销商详情',
                }
            },
        ]
    },*/
    { // 采购管理 - 经销商端 && 门店端 && 分销商端
        path: '/purchase',
        component: Layout,
        redirect: '/purchase/item-list',
        name: 'PurchaseManagement',
        meta: {
            title: '采购管理',
            title_en: 'Purchase',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
            icon: 'i_s_item',
        },
        children: [
            {
                path: 'item-list',
                name: 'PurchaseItemList',
                component: () => import('@/views/purchase/item-index.vue'),
                meta: {
                    title: '采购',
                    title_en: 'Purchase',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
	                auth: ["item.list"],
                }
            },
            {
                path: 'item-display',
                name: 'ItemDisplay',
                component: () => import('@/views/purchase/item-display.vue'),
                meta: {
                    hidden: true,
                    title: '商品详情',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
	                auth: ["item.detail"],
                }
            },
            {
                path: 'item-collect',
                name: 'ItemCollect',
                component: () => import('@/views/purchase/item-collect.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '购物车',
                    title_en: 'Shopping cart',
	                auth: ["purchase-order.save"],
                }
            },
            {
                path: 'item-settle',
                name: 'ItemSettle',
                component: () => import('@/views/purchase/item-settle.vue'),
                meta: {
                    hidden: true,
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '结算',
	                auth: ["purchase-order.save"],
                }
            },
            {
                path: 'purchase-order-list',
                name: 'PurchaseOrderList',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '订单列表',
                    title_en: 'All orders',
                    search_type: PURCHASE_SEARCH_TYPE.ALL,
	                auth: ["purchase-order.list"],
                }
            },
            {
                path: 'purchase-order-self',
                name: 'PurchaseOrderListSelf',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '采购订单',
                    title_en: 'Purchase NO.',
                    search_type: PURCHASE_SEARCH_TYPE.SELF,
	                auth: ["purchase-order.list"],
                }
            },
            {
                path: 'purchase-order-children',
                name: 'PurchaseOrderListChildren',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title: '供货订单',
                    title_en: 'Supply orders',
                    search_type: PURCHASE_SEARCH_TYPE.CHILDREN,
	                auth: ["purchase-order.list"],
                }
            },
            {
                path: 'purchase-order-detail',
                name: 'PurchaseOrderDetail',
                component: () => import('@/views/purchase/purchase-order-detail.vue'),
                meta: {
                    hidden: true,
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title: '采购订单详情',
	                auth: ["purchase-order.detail"],
                }
            },
        ]
    },
    { // 维修单
        path: '/repair',
        component: Layout,
        name: 'RepairManagement',
        redirect: '/repair/repair-list',
        meta: {
            title: '工单管理',
            title_en: 'Repair',
            icon: 'i_s_repair',
            auth: ['repair-order.list'],
        },
        children: [
            {
                path: 'repair-list',
                name: 'RepairList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '工单列表',
                    title_en: 'Repair orders',
                    auth: ['repair-order.list'],
                }
            },
            {
                path: 'repair-audit-list',
                name: 'RepairAuditList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待审工单',
                    title_en: 'Awaiting audit',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    type: 'audit',
                    auth: ['repair-order.audit'],
                }
            },
            {
                path: 'repair-redit-list',
                name: 'RepairReditList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待改工单',
                    title_en: 'Awaiting revise',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
                    type: 'redit',
                    auth: ['repair-order.save'],
                }
            },
            {
                path: 'repair-invoice-list',
                name: 'RepairInvoiceList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待审核故障件',
                    title_en: 'Check fault',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: 'invoice',
                    auth: ['repair-order.list'],
                }
            },
            {
                path: 'repair-fault-list',
                name: 'RepairFaultList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待入库故障件',
                    title_en: 'Warehousing',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    type: 'fault',
                    auth: ['repair-order.save-to-invoice'],
                }
            },
            {
                path: 'repair-edit',
                name: 'RepairEdit',
                component: () => import('@/views/repair/repair-edit.vue'),
                meta: {
                    hidden: true,
                    title: '维修单编辑',
                    parent: '/repair/repair-list',
                    roles: [LOGIN_TYPE.STORE, LOGIN_TYPE.AGENT, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['repair-order.save'],
                }
            },
            {
                path: 'repair-detail',
                name: 'RepairDetail',
                component: () => import('@/views/repair/repair-detail.vue'),
                meta: {
                    hidden: true,
                    title: '维修单详情',
                    parent: '/repair/repair-list',
                    auth: ['repair-order.detail'],
                }
            },
            {
                path: 'repair-invoice',
                name: 'RepairInvoice',
                component: () => import('@/views/repair/repair-invoice.vue'),
                meta: {
                    hidden: true,
                    title: '维修单结算',
                    parent: '/repair/repair-list',
                    auth: ['repair-order.settlement'],
                }
            },
            {
                path: 'item-fault-list',
                name: 'FaultList',
                component: () => import('@/views/repair/item-fault-list.vue'),
                meta: {
                    title: '故障管理',
                    title_en: 'Faults',
                    roles: [LOGIN_TYPE.STORE, LOGIN_TYPE.AGENT, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ['fault.list'],
                }
            },
        ]
    },
	{ // 反馈单
		path: '/feedback',
		component: Layout,
		name: 'FeedbackManagement',
		redirect: '/feedback/feedback-list',
		meta: {
			title: '反馈管理',
			title_en: 'Feedback',
			icon: 'i_s_repair',
			auth: ['quality-feedback.list'],
		},
		children: [
			{
				path: 'feedback-list',
				name: 'FeedbackList',
				component: () => import('@/views/feedback/feedback-list.vue'),
				meta: {
					title: '反馈单列表',
					title_en: 'Feedback orders',
					auth: ['quality-feedback.list'],				}
			},
			// {
			// 	path: 'feedback-audit-list',
			// 	name: 'FeedbackAuditList',
			// 	component: () => import('@/views/feedback/feedback-list.vue'),
			// 	meta: {
			// 		title: '待审工单',
			// 		title_en: 'Awaiting audit',
			// 		roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
			// 		type: 'audit',
			// 		auth: ['quality-feedback.audit'],
			// 	}
			// },
			// {
			// 	path: 'feedback-redit-list',
			// 	name: 'FeedbackReditList',
			// 	component: () => import('@/views/feedback/feedback-list.vue'),
			// 	meta: {
			// 		title: '待改工单',
			// 		title_en: 'Awaiting revise',
			// 		roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
			// 		type: 'redit',
			// 		auth: ['quality-feedback.save'],
			// 	}
			// },
			{
				path: 'feedback-edit',
				name: 'FeedbackEdit',
				component: () => import('@/views/feedback/feedback-edit.vue'),
				meta: {
					hidden: true,
					title: '反馈单编辑',
                    title_en: 'feedback-edit',
					parent: '/feedback/feedback-list',
					roles: [LOGIN_TYPE.STORE, LOGIN_TYPE.AGENT, LOGIN_TYPE.DISTRIBUTOR],
					auth: ['quality-feedback.save'],
				}
			},
			{
				path: 'feedback-detail',
				name: 'FeedbackDetail',
                title_en: 'feedback-detail',
				component: () => import('@/views/feedback/feedback-detail.vue'),
				meta: {
					hidden: true,
					title: '反馈单详情',
					parent: '/feedback/feedback-list',
					auth: ['quality-feedback.detail'],
				}
			},
		]
	},

    /*{ // 零售商管理 - 零售商端
        path: '/agent/agent-detail-sp',
        component: Layout,
        meta: {
            title: '零售商管理',
            icon: 'i_s_agent',
            roles: [LOGIN_TYPE.AGENT],
            not_sub_menu: true,
            sp: true,
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
            not_sub_menu: true,
            sp: true,
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
    { //商品管理 - 平台端
        path: '/item',
        component: Layout,
        redirect: '/item/item-list',
        name: 'ItemManagement',
        meta: {
            title: '商品管理',
            title_en: 'Product',
            icon: 'i_s_item',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['item.list','item-category.list'],
        },
        children: [
            {
                path: 'item-list',
                name: 'ItemList',
                component: () => import('@/views/item/item-list.vue'),
                meta: {
                    title: '商品列表',
                    title_en: 'Product list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['item.list'],
                }
            },
            {
                path: 'item-edit',
                name: 'ItemEdit',
                component: () => import('@/views/item/item-edit.vue'),
                meta: {
                    hidden: true,
                    title: '商品编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/item-list',
                    auth: ['item.save'],
                }
            },
            {
                path: 'item-detail',
                name: 'ItemDetail',
                component: () => import('@/views/item/item-detail.vue'),
                meta: {
                    hidden: true,
                    title: '商品详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/item-list',
                    auth: ['item.detail'],
                }
            },
            {
                path: 'item-explored-edit',
                name: 'ItemExploredEdit',
                component: () => import('@/views/item/item-explored-edit.vue'),
                meta: {
                    hidden: true,
                    title: '商品爆炸图详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/item-list',
                    auth: ['item.save'],
                }
            },
            {
                path: 'item-category',
                name: 'ItemCategory',
                component: () => import('@/views/item/item-category.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '商品分类',
                    title_en: 'Categories',
                    auth: ['item-category.list'],
                }
            },
            {
                path: 'item-category-config',
                name: 'ItemCategoryConfig',
                component: () => import('@/views/item/item-category-config.vue'),
                meta: {
                    hidden: true,
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '商品分类配置',

                }
            },
            {
                path: 'Item-category-explored',
                name: 'ItemCategoryConfig',
                component: () => import('@/views/item/Item-category-explored.vue'),
                meta: {
                    hidden: true,
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '商品爆炸图编辑',

                }
            },
        ]
    },

   /* { // 物流管理
        path: '/waybill',
        component: Layout,
        redirect: '/waybill/waybill-list',
        name: 'WayBillManagement',
        meta: {
            title: '物流管理',
            title_en: 'Logistics',
            icon: 'i_deliver',
            roles: [LOGIN_TYPE.ADMIN],
            not_sub_menu: true,
        },
        children: [
            {
                path: 'waybill-list',
                name: 'waybillList',
                component: () => import('@/views/waybill/waybill-list.vue'),
                meta: {
                    title: '物流列表',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            // {
            //     path: 'waybill-company',
            //     name: 'WaybillCompanyList',
            //     component: () => import('@/views/waybill/waybill-company.vue'),
            //     meta: {
            //         title: '物流公司',
            //         roles: [LOGIN_TYPE.ADMIN],
            //     }
            // },
        ]
    },*/
    { // 实例管理
        path: '/entity',
        component: Layout,
        redirect: '/entity/entity-list',
        name: 'EntityManagement',
        meta: {
            title: '实例管理',
            title_en: 'Instance',
            icon: 'i_s_item',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['entity.list'],
        },
        children: [
            {
                path: 'vehicle-list',
                name: 'VehicleList',
                component: () => import('@/views/entity/entity-list.vue'),
                meta: {
                    title: '整车列表',
                    title_en: 'Vehicles',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: "vehicle",
                    auth: ['entity.list'],
                }
            },
            // {
            //     path: 'part-list',
            //     name: 'PartList',
            //     component: () => import('@/views/entity/entity-list.vue'),
            //     meta: {
            //         title: '零部件列表',
            //         title_en: 'Parts',
            //         roles: [LOGIN_TYPE.ADMIN],
            //         type: "part",
            //         auth: ['entity.list'],
            //     }
            // },
            {
                path: 'entity-detail',
                name: 'EntityDetail',
                component: () => import('@/views/entity/entity-detail.vue'),
                meta: {
                    hidden: true,
                    title: '车架详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/entity/entity-list',
                    auth: ['entity.detail'],
                }
            },
        ]
    },
    { // 生产管理 - 平台端
        path: '/production',
        component: Layout,
        redirect: '/production/stock-list',
        name: 'ProductionManagement',
        meta: {
            title: '供应管理',
	        title_en: 'Suppliers',
            icon: 'i_s_item',
            roles: [LOGIN_TYPE.ADMIN],
            auth: ['production-order.list', 'supplier.list', 'material-purchase-order.list', 'material.list'],
        },
        children: [
            {
                path: 'supplier-list',
                name: 'SupplierList',
                component: () => import ('@/views/production/supplier-list.vue'),
                meta: {
                    title: '供应商列表',
	                title_en: 'Supplier list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['supplier.list'],
                }
            },
            {
                path: 'supplier-edit',
                name: 'SupplierEdit',
                component: () => import ('@/views/production/supplier-edit.vue'),
                meta: {
                    hidden: true,
                    title: '供应商编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/supplier-list',
                    auth: ['supplier.save'],
                }
            },
            {
                path: 'supplier-detail',
                name: 'SupplierDetail',
                component: () => import ('@/views/production/supplier-detail.vue'),
                meta: {
                    hidden: true,
                    title: '供应商详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/supplier-list',
                    auth: ['supplier.detail'],
                }
            },
            {
                path: 'material-purchase-list',
                name: 'MaterialPurchaseList',
                component: () => import ('@/views/production/material-purchase-list.vue'),
                meta: {
                    title: '采购单列表',
	                title_en: 'Procurement list',
                    roles: [LOGIN_TYPE.ADMIN],
                    is_sub_menu: true,
                    auth: ['material-purchase-order.list'],
                }
            },
            /*{
                path: 'material-purchase-edit',
                name: 'MaterialPurchaseEdit',
                component: () => import ('@/views/production/material-purchase-edit.vue'),
                meta: {
                    title: '新建采购单',
                    hidden: true,
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/material-purchase-list',
                }
            },*/
            {
                path: 'material-purchase-detail',
                name: 'MaterialPurchaseDetail',
                component: () => import ('@/views/production/material-purchase-detail.vue'),
                meta: {
                    hidden: true,
                    title: '采购单详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/material-purchase-list',
                    auth: ['material-purchase-order.list.detail'],
                }
            },

            {
                path: 'material-list',
                name: 'MaterialList',
                component: () => import ('@/views/production/material-list.vue'),
                meta: {
                    title: '物料列表',
	                title_en: 'Material list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['material.list'],
                }
            },
            {
                path: 'material-edit',
                name: 'MaterialEdit',
                component: () => import ('@/views/production/material-edit.vue'),
                meta: {
                    hidden: true,
                    title: '物料编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/material-list',
                    auth: ['material.save'],
                }
            },
            {
                path: 'material-detail',
                name: 'MaterialDetail',
                component: () => import ('@/views/production/material-detail.vue'),
                meta: {
                    hidden: true,
                    title: '物料详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/material-list',
                    auth: ['material.detail'],
                }
            },


	        // {
		    //     path: 'material-adjust-stock',
		    //     name: 'MaterialAdjustStock',
		    //     component: () => import('@/views/production/material-adjust-stock.vue'),
		    //     meta: {
			//         roles: [LOGIN_TYPE.ADMIN],
			//         title: '物料调库',
		    //     }
	        // },
	        // {
		    //     path: 'material-stock-record',
		    //     name: 'MaterialStockRecord',
		    //     component: () => import('@/views/production/components/MaterialStockRecord.vue'),
		    //     meta: {
			//         roles: [LOGIN_TYPE.ADMIN],
			//         title: '物料调库',
		    //     }
	        // },



            {
                path: 'material-category',
                name: 'MaterialCategory',
                component: () =>
                    import ('@/views/production/material-category.vue'),
                meta: {
                    title: '物料分类',
	                title_en: 'Material classification',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['material-category.list'],
                }
            },

        ]
    },
	{ // 生产管理
		path: '/manufacture',
		component: Layout,
		redirect: '/manufacture/manufacture-list',
		name: 'ManufactureManagement',
		meta: {
			title: '生产管理',
			title_en: 'Production',
			icon: 'i_s_warehouse',
			roles: [LOGIN_TYPE.ADMIN],
            auth: ['production-order.list', 'bom.list'],
		},
		children: [
			{
				path: 'bom-list',
				name: 'BomList',
				component: () =>
					import ('@/views/manufacture/bom-list.vue'),
				meta: {
					title: 'BOM列表',
					title_en: 'BOM list',
					roles: [LOGIN_TYPE.ADMIN],
                    auth: ['bom.list'],
				}
			},
			{
				path: 'bom-detail',
				name: 'BomDetail',
				component: () => import ('@/views/manufacture/bom-detail.vue'),
				meta: {
					hidden: true,
					title: 'BOM详情',
					roles: [LOGIN_TYPE.ADMIN],
					parent: '/manufacture/bom-list',
					auth: ['bom.detail'],
				}
			},
			{
				path: 'manufacture-order-list',
				name: 'ManufactureOrderList',
				component: () =>
					import ('@/views/manufacture/manufacture-order-list.vue'),
				meta: {
					title: '生产单列表',
					title_en: 'Manufacture order list',
					roles: [LOGIN_TYPE.ADMIN],
                    auth: ['production-order.list'],
				}
			},
			{
				path: 'manufacture-order-edit',
				name: 'ManufactureOrderEdit',
				component: () => import ('@/views/manufacture/manufacture-order-edit.vue'),
				meta: {
					hidden: true,
					title: '生产单编辑',
					roles: [LOGIN_TYPE.ADMIN],
					parent: '/manufacture/manufacture-order-list',
					auth: ['production-order.save'],
				}
			},
			{
				path: 'manufacture-order-detail',
				name: 'ManufactureOrderDetail',
				component: () => import ('@/views/manufacture/manufacture-order-detail.vue'),
				meta: {
					hidden: true,
					title: '生产单详情',
					roles: [LOGIN_TYPE.ADMIN],
					parent: '/item/item-list',
					auth: ['production-order.detail'],
				}
			},
			{
				path: 'calculate-production-amount',
				name: 'CalculateProductionAmount',
				component: () =>
					import ('@/views/manufacture/calculate-production-amount.vue'),
				meta: {
					hidden: true,
					title: '成套计算',
					roles: [LOGIN_TYPE.ADMIN],
                    // auth: ['calculate-production.amount'],
				}
			},
		]
	},

    { // 仓库管理
        path: '/warehouse',
        component: Layout,
        redirect: '/warehouse/warehouse-list',
        name: 'WarehouseManagement',
        meta: {
            title: '库存管理',
            title_en: 'Inventories',
            icon: 'i_s_warehouse',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
            auth: ['warehouse.list', 'warehouse-transfer-order.list', 'invoice.list', 'stock.list'],
        },
        children: [
            {
                path: 'warehouse-list',
                name: 'WarehouseList',
                component: () => import('@/views/warehouse/warehouse-list.vue'),
                meta: {
                    title: '仓库管理',
                    title_en: 'Warehouses',
                    auth: ['warehouse.list'],
                }
            },
            {
                path: 'warehouse-edit',
                name: 'WarehouseEdit',
                component: () => import('@/views/warehouse/warehouse-edit.vue'),
                meta: {
                    hidden: true,
                    title: '仓库编辑',
                    parent: '/warehouse/warehouse-list',
                    auth: ['warehouse.save'],
                }
            },
            {
                path: 'warehouse-detail',
                name: 'WarehouseDetail',
                component: () => import('@/views/warehouse/warehouse-detail.vue'),
                meta: {
                    hidden: true,
                    title: '仓库详情',
                    parent: '/warehouse/warehouse-list',
                    auth: ['warehouse.detail'],

                }
            },
	        {
		        path: 'stock-list',
		        name: 'StockList',
		        component: () => import ('@/views/warehouse/stock-list.vue'),
		        meta: {
			        title: '库存总览',
			        title_en: 'Inventory overview',
			        roles: [LOGIN_TYPE.ADMIN],
                    auth: ['stock.list'],
		        }
	        },
            {
                path: 'invoice-list',
                name: 'InvoiceList',
                component: () => import('@/views/warehouse/invoice-list.vue'),
                meta: {
                    title: '出入库管理',
                    title_en: 'Inbound and outbound',
                    auth: ['invoice.list'],
                }
            },
            {
                path: 'invoice-edit',
                name: 'InvoiceEdit',
                component: () => import('@/views/warehouse/invoice-edit.vue'),
                meta: {
                    hidden: true,
                    title: '出入库编辑',
                    parent: '/invoice/invoice-list',
                    auth: ['invoice.save'],
                }
            },
            {
                path: 'invoice-detail',
                name: 'InvoiceDetail',
                component: () => import('@/views/warehouse/invoice-detail2.vue'),
                meta: {
                    hidden: true,
                    title: '出入库详情',
                    parent: '/invoice/invoice-list',
                    auth: ['invoice.detail'],
                }
            },
            {
                path: 'warehouse-transfer-list',
                name: 'WarehouseTransferList',
                component: () => import('@/views/warehouse/warehouse-transfer-list.vue'),
                meta: {
                    title: '调货单管理',
	                title_en: 'Transfer order',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['warehouse-transfer-order.list'],
                }
            },
            {
                path: 'warehouse-transfer-detail',
                name: 'WarehouseTransferDetail',
                component: () => import('@/views/warehouse/warehouse-transfer-detail.vue'),
                meta: {
                    hidden: true,
                    title: '调货单详情',
                    parent: '/warehouse/warehouse-transfer-list',
                    roles: [LOGIN_TYPE.ADMIN],
                    auth: ['warehouse-transfer-order.detail'],
                }
            },
	        {
		        path: 'material-put-stock',
		        name: 'MaterialPutStock',
		        component: () => import('@/views/production/material-put-stock.vue'),
		        meta: {
			        roles: [LOGIN_TYPE.ADMIN],
			        title: '入库',
                    title_en: 'Inbound',
                    auth: ['invoice.in'],
		        }
	        },
	        {
		        path: 'material-out-stock',
		        name: 'MaterialOutStock',
		        component: () => import('@/views/production/material-out-stock.vue'),
		        meta: {
			        roles: [LOGIN_TYPE.ADMIN],
			        title: '出库',
                    title_en: 'Outbound',
                    auth: ['invoice.out'],
		        }
	        },
          /*  {
                path: 'transfer-order-list-in',
                name: 'TransferOrderListIn',
                component: () => import('@/views/warehouse/transfer-order-list.vue'),
                meta: {
                    title: '调货收货管理',
                    roles: [LOGIN_TYPE.AGENT,LOGIN_TYPE.DISTRIBUTOR,LOGIN_TYPE.STORE],
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
                    roles: [LOGIN_TYPE.ADMIN],
                    type: 'pending'
                }
            },*/
        ]
    },
    // { // 售后管理 - 平台 && 分销
    //     path: '/aftersales-supply',
    //     component: Layout,
    //     redirect: '/aftersales-supply/aftersales-supply-list',
    //     name: 'AftersalesSupplyManagement',
    //     meta: {
    //         title: '售后管理',
    //         title_en: 'After sales',
    //         icon: 'i_s_temp',
    //         hidden: false,
    //         auth: ["after-sales-order.list", "refund.list"],
    //     },
    //     children: [
    //         {
    //             path: 'aftersales-supply-list',
    //             name: 'AftersalesSupplyList',
    //             component: () => import('@/views/aftersales/aftersales-list.vue'),
    //             meta: {
    //                 title: '售后响应',
    //                 title_en: 'Response',
    //                 roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
    //                 query_type: REFUND_QUERY_TYPE.SUPPLY,
    //                 auth: ["after-sales-order.list"],
    //             }
    //         },
    //         {
    //             path: 'aftersales-apply-list',
    //             redirect: '/aftersales/aftersales-list',
    //             meta: {
    //                 title: '售后申请',
    //                 title_en: 'Application',
    //                 roles: [LOGIN_TYPE.DISTRIBUTOR],
    //                 query_type: REFUND_QUERY_TYPE.APPLY,
    //                 auth: ["after-sales-order.save"],
    //             }
    //         },
    //         {
    //             path: 'refund-list',
    //             name: 'RefundList',
    //             component: () => import('@/views/aftersales/refund-list.vue'),
    //             meta: {
    //                 roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
    //                 // auth: ['aftersales.refund', 'asjncsaij'],
    //                 title: '退款审核',
    //                 title_en: 'Audit',
    //                 auth: ["refund-list"],
    //             }
    //         },
    //     ]
    // },
    { // 售后管理 - 门店 && 零售
        path: '/aftersales',
        component: Layout,
        redirect: '/aftersales/aftersales-list',
        name: 'AftersalesManagement',
        meta: {
            title: '售后管理',
            title_en: 'After-sales',
            icon: 'i_s_temp',
            auth: ["after-sales-order.list"],
        },
        children: [
            {
                path: 'aftersales-list',
                name: 'AftersalesApplyList',
                component: () => import('@/views/aftersales/aftersales-list.vue'),
                meta: {
                    title: '售后单列表',
	                title_en: 'Aftersales list',
                    query_type: REFUND_QUERY_TYPE.APPLY,
	                roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    auth: ["after-sales-order.list"],
                }
            },
            {
                path: 'aftersales-edit',
                name: 'AftersalesEdit',
                component: () => import('@/views/aftersales/aftersales-edit.vue'),
                meta: {
                    hidden: true,
                    title: '申请售后',
                    title_en: 'Apply',
                    parent: '/aftersales/aftersales-list',
                    auth: ["after-sales-order.save"],
	                roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                }
            },
            {
                path: 'aftersales-detail',
                name: 'AftersalesDetail',
                component: () => import('@/views/aftersales/aftersales-detail.vue'),
                meta: {
                    hidden: true,
                    title: '售后单详情',
                    parent: '/aftersales/aftersales-list',
	                auth: ["after-sales-order.detail"],
                }
            },
            {
                path: 'refund-detail',
                name: 'RefundDetail',
                component: () => import('@/views/aftersales/refund-detail.vue'),
                meta: {
                    hidden: true,
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title: '退款单详情',
                    auth: ["refund.detail"],
                }
            },
	        {
		        path: 'aftersales-supply-list',
		        name: 'AftersalesSupplyList',
		        component: () => import('@/views/aftersales/aftersales-list.vue'),
		        meta: {
			        title: '售后响应',
			        title_en: 'Response',
			        roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
			        query_type: REFUND_QUERY_TYPE.SUPPLY,
			        auth: ["after-sales-order.list"],
		        }
	        },
	        // {
		    //     path: 'aftersales-apply-list',
		    //     redirect: '/aftersales/aftersales-list',
		    //     meta: {
			//         title: '售后申请',
			//         title_en: 'Application',
			//         roles: [LOGIN_TYPE.DISTRIBUTOR],
			//         query_type: REFUND_QUERY_TYPE.APPLY,
			//         auth: ["after-sales-order.save"],
		    //     }
	        // },
	        {
		        path: 'refund-list',
		        name: 'RefundList',
		        component: () => import('@/views/aftersales/refund-list.vue'),
		        meta: {
			        roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
			        // auth: ['aftersales.refund', 'asjncsaij'],
			        title: '退款审核',
			        title_en: 'Refund Audit',
			        auth: ["refund.list"],
		        }
	        },
        ]
    },
    { // 账户管理
        path: '/wallet',
        component: Layout,
        redirect: '/wallet/wallet-list',
        name: 'WalletManagement',
        meta: {
            title: '账户管理',
            title_en: 'Accounts',
            icon: 'i_s_user',
            roles: [LOGIN_TYPE.DISTRIBUTOR],
            auth: ["user.list"],
        },
        children: [
            {
                path: 'wallet-list',
                name: 'WalletList',
                component: () => import('@/views/wallet/wallet-list.vue'),
                meta: {
                    title: '账户列表',
                    title_en: 'Account list',
                    auth: ["user.list"],
                }
            },
            {
                path: 'wallet-detail',
                name: 'WalletDetail',
                auth: ["user.detail"],
                component: () => import('@/views/wallet/wallet-detail.vue'),
                meta: {
                    hidden: true,
                    title: '账户详情',
                    parent: '/wallet/wallet-list',
                    auth: ["user.list"],
                }
            },
        ]
    },
    { // 客户管理
        path: '/customer',
        component: Layout,
        redirect: '/customer/customer-list',
        name: 'CustomerManagement',
        meta: {
            title: '客户管理',
            title_en: 'Customers',
            icon: 'i_s_customer',
	        auth: ["customer.list"],

        },
        children: [
            {
                path: 'customer-list',
                name: 'CustomerList',
                component: () => import('@/views/customer/customer-list.vue'),
                meta: {
                    title: '客户列表',
                    title_en: 'Customer list',
                    auth: ["customer.list"],
                }
            },
            {
                path: 'customer-edit',
                name: 'CustomerEdit',
                component: () => import('@/views/customer/customer-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新建客户',
                    parent: '/customer/customer-list',
                    auth: ["customer.save"],
                }
            },
        ]
    },
	{ // 客户管理
		path: '/crm-customer',
		component: Layout,
		redirect: '/crm-customer/customer-list',
		name: 'CRMCustomerManagement',
		meta: {
			title: 'CRM客户',
			title_en: 'CRM Customers',
			icon: 'i_s_customer',
			// auth: ["crm-customer.list"],

		},
		children: [
			{
				path: 'customer-list',
				name: 'CustomerList',
				component: () => import('@/views/crm-customer/customer-list.vue'),
				meta: {
					title: '公海客户',
					title_en: 'Community Customer list',
					type: 'high_seas'
					// auth: ["crm-community-customer.list"],
				}
			},
			{
				path: 'customer-private-list',
				name: 'CustomerPrivateList',
				component: () => import('@/views/crm-customer/customer-list.vue'),
				meta: {
					title: '私人客户',
					title_en: 'Private clients',
					type: 'private'
					// auth: ["crm-community-customer.list"],
				}
			},
			{
				path: 'customer-edit',
				name: 'CustomerEdit',
				component: () => import('@/views/crm-customer/customer-edit.vue'),
				meta: {
					hidden: true,
					title: '新建客户',
					parent: '/customer/customer-list',
					// auth: ["crm-customer.save"],
				}
			},
			{
				path: 'customer-detail',
				name: 'CustomerDetail',
				component: () => import('@/views/crm-customer/customer-detail.vue'),
				meta: {
					hidden: true,
					title: '客户详情',
					parent: '/customer/customer-list',
					// auth: ["crm-customer.save"],
				}
			},
            {
                path: 'order-edit',
                name: 'OrderEdit',
                meta: {
                    hidden: true,
                    title: '新建订单',
                },
                component: () => import ('@/components/popup-btn/OrderEdit.vue'),
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
			// {
			// 	path: 'customer-edit',
			// 	name: 'CustomerEdit',
			// 	component: () => import('@/views/crm/customer/customer-edit.vue'),
			// 	meta: {
			// 		hidden: true,
			// 		title: '新建客户',
			// 		parent: '/customer/customer-list',
			// 		// auth: ["crm-customer.save"],
			// 	}
			// },
		]
	},
	{ // 客户管理
		path: '/crm-bo',
		component: Layout,
		redirect: '/crm-bo/bo-list',
		name: 'CRMBoManagement',
		meta: {
			title: 'CRM商机',
			title_en: 'CRM BO',
			icon: 'i_s_customer',
			// auth: ["crm-customer.list"],

		},
		children: [
			{
				path: 'bo-list',
				name: 'BoList',
				component: () => import('@/views/crm-bo/bo-list.vue'),
				meta: {
					title: '商机列表',
					title_en: 'Business opportunities list',
					// auth: ["crm-community-customer.list"],
				}
			},
			{
				path: 'bo-edit',
				name: 'BoEdit',
				component: () => import('@/views/crm-bo/bo-edit.vue'),
				meta: {
					hidden: true,
					title: '新建客户',
					parent: '/bo/bo-list',
					// auth: ["crm-customer.save"],
				}
			},
			{
				path: 'bo-detail',
				name: 'BoDetail',
				component: () => import('@/views/crm-bo/bo-detail.vue'),
				meta: {
					hidden: true,
					title: '客户详情',
					parent: '/bo/bo-list',
					// auth: ["crm-customer.save"],
				}
			},
		]
	},
	{ // 合同订单
		path: '/crm-order',
		component: Layout,
		redirect: '/crm-order/order-list',
		name: 'CRMOrder',
		meta: {
			title: 'CRM合同',
			title_en: 'CRM Order',
			icon: 'i_s_customer',
			// auth: ["crm-customer.list"],
		},
		children: [
			{
				path: 'order-list',
				name: 'OrderList',
				component: () => import('@/views/crm-order/order-list.vue'),
				meta: {
					title: '合同列表',
					title_en: 'Business opportunities list',
					// auth: ["crm-community-customer.list"],
				}
			},
			{
				path: 'order-edit',
				name: 'OrderEdit',
				component: () => import('@/views/crm-order/order-edit.vue'),
				meta: {
					hidden: true,
					title: '新建合同',
					parent: '/crm-order/order-list',
					// auth: ["crm-customer.save"],
				}
			},
			{
				path: 'order-detail',
				name: 'OrderDetail',
				component: () => import('@/views/crm-order/order-detail.vue'),
				meta: {
					hidden: true,
					title: '合同详情',
					title_en: 'Business opportunities phase',
					parent: '/crm-order/order-list',
					// auth: ["crm-community-customer.list"],
				}
			},
		]
	},
	{ // 客户管理
		path: '/crm-setting',
		component: Layout,
		redirect: '/crm-setting/setting-list',
		name: 'CRMSettingManagement',
		meta: {
			title: 'CRM设置',
			title_en: 'CRM Setting',
			icon: 'i_s_customer',
			// auth: ["crm-customer.list"],

		},
		children: [
			{
				path: 'setting-list',
				name: 'SettingList',
				component: () => import('@/views/crm-setting/group-status.vue'),
				meta: {
					title: '商机阶段',
					title_en: 'Business opportunities phase',
					// auth: ["crm-community-customer.list"],
				}
			},
		]
	},
    { // 系统管理
        path: '/system',
        component: Layout,
        redirect: '/system/system-file-list',
        name: 'SystemManagement',
        meta: {
            title: '系统管理',
            title_en: 'Systems',
            icon: 'i_s_temp',
            auth: ['MANAGER'],
        },
        children: [
            {
                path: 'user-list',
                name: 'UserList',
                component: () => import('@/views/user/user-list.vue'),
                meta: {
                    title: '员工列表',
                    title_en: 'Employees',
                }
            },
            {
                path: 'user-edit',
                name: 'UserEdit',
                component: () => import('@/views/user/user-edit.vue'),
                meta: {
                    hidden: true,
                    title: '员工编辑',
                    parent: '/user/user-list',
                }
            },
            {
                path: 'user-detail',
                name: 'UserDetail',
                component: () => import('@/views/user/user-detail.vue'),
                meta: {
                    hidden: true,
                    title: '员工详情',
                    parent: '/user/user-list',
                }
            },
            {
                path: 'user-scope',
                name: 'UserScope',
                component: () => import('@/views/user/components/UserScope.vue'),
                meta: {
                    hidden: true,
                    title: '员工详情',
                    parent: '/user/user-list',
                }
            },
           /* {
                path: 'auth-user-list',
                name: 'AuthUserList',
                component: () => import('@/views/authority/auth-user-list.vue'),
                meta: {
                    title: '用户权限',
                }
            },
            {
                path: 'auth-user-edit',
                name: 'AuthUserEdit',
                component: () => import('@/views/authority/auth-user-edit.vue'),
                meta: {
                    hidden: true,
                    title: '用户权限编辑',
                    parent: '/authority/auth-user-list',
                }
            },*/
            {
                path: 'auth-role-list',
                name: 'RoleList',
                component: () => import('@/views/authority/auth-role-list.vue'),
                meta: {
                    title: '角色管理',
                    title_en: 'Roles',
                }
            },
            {
                path: 'auth-role-edit',
                name: 'RoleEdit',
                component: () => import('@/views/authority/auth-role-edit.vue'),
                meta: {
                    hidden: true,
                    title: '角色编辑',
                    parent: '/authority/auth-role-list',
                }
            },
            {
                path: 'allot-org-auth',
                name: 'AllotOrgAuth',
                component: () => import('@/views/system/allot-org-auth.vue'),
                meta: {
                    title: '权限管理',
                    title_en: 'Authority ',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'system-file-edit',
                name: 'SystemFileEdit',
                component: () => import('@/views/system/system-file-edit.vue'),
                meta: {
                    hidden: true,
                    title: '附件编辑',
                    parent: '/system/system-file-list',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'notice-list',
                name: 'NoticeList',
                component: () => import('@/views/system/notice-list.vue'),
                meta: {
                    title: '消息列表',
                    title_en: 'Messages ',
                }
            },
            {
                path: 'notice-edit',
                name: 'NoticeEdit',
                component: () => import('@/views/system/notice-edit.vue'),
                meta: {
                    hidden: true,
                    title: '新增消息',
                    parent: '/system/notice-list',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'notice-detail',
                name: 'NoticeDetail',
                component: () => import('@/views/system/notice-detail.vue'),
                meta: {
                    hidden: true,
                    title: '消息详情',
                    parent: '/system/notice-list',
                }
            },
            {
                path: 'system-file-list',
                name: 'SystemFileList',
                component: () => import('@/views/system/system-file-list.vue'),
                meta: {
                    title: '文件管理',
                    title_en: 'Files ',
                }
            },
	        {
		        path: 'print_template_list',
		        name: 'PrintTemplatelList',
		        component: () => import('@/views/system/print_template_list.vue'),
                roles: [LOGIN_TYPE.ADMIN],
		        meta: {
			        title: '标签规则',
			        roles: [LOGIN_TYPE.ADMIN,LOGIN_TYPE.DISTRIBUTOR],
			        title_en: 'Label rules ',
		        }
	        },


        ]
    },
];

export default routes;


let ADMIN = [], DISTRIBUTOR = [], AGENT = [], STORE = []

let target = Util.deepCopy(routes).filter(first => {
    return first.meta && !first.meta.hidden
})
target.forEach(first => {
    let children = first.children.filter(second => {
        return second.meta && !second.meta.hidden
    })
    first.children = children
})

ADMIN = Util.deepCopy(target).filter(first => {
    let meta = first.meta
    return !meta.roles || meta.roles.includes(LOGIN_TYPE.ADMIN)
})
ADMIN.forEach(first => {
    let children = first.children.filter(second => {
        let meta = second.meta
        return !meta.roles || meta.roles.includes(LOGIN_TYPE.ADMIN)
    })
    first.children = children
})

DISTRIBUTOR = Util.deepCopy(target).filter(first => {
    let meta = first.meta
    return !meta.roles || meta.roles.includes(LOGIN_TYPE.DISTRIBUTOR)
})
DISTRIBUTOR.forEach(first => {
    let children = first.children.filter(second => {
        let meta = second.meta
        return !meta.roles || meta.roles.includes(LOGIN_TYPE.DISTRIBUTOR)
    })
    first.children = children
})

AGENT = Util.deepCopy(target).filter(first => {
    let meta = first.meta
    return !meta.roles || meta.roles.includes(LOGIN_TYPE.AGENT)
})
AGENT.forEach(first => {
    let children = first.children.filter(second => {
        let meta = second.meta
        return !meta.roles || meta.roles.includes(LOGIN_TYPE.AGENT)
    })
    first.children = children
})

STORE = Util.deepCopy(target).filter(first => {
    let meta = first.meta
    return !meta.roles || meta.roles.includes(LOGIN_TYPE.STORE)
})
STORE.forEach(first => {
    let children = first.children.filter(second => {
        let meta = second.meta
        return !meta.roles || meta.roles.includes(LOGIN_TYPE.STORE)
    })
    first.children = children
})

export const SIDER = {
    ADMIN,
    DISTRIBUTOR,
    AGENT,
    STORE,
}
console.log('SIDER:', SIDER)

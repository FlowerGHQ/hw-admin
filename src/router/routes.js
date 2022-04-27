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
            icon: 'i_s_dashboard',
            not_sub_menu: true,
        },
        children: [{
            path: '',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/Dashboard.vue'),
            meta: {
                title: '时效看板',
            }
        }]
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
            icon: 'i_s_agent',
        },
        children: [
            {
                path: 'distributor-list',
                name: 'DistributorList',
                component: () => import('@/views/distributor/distributor-list.vue'),
                meta: {
                    title: '分销商列表',
                    roles: [LOGIN_TYPE.ADMIN],
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
                }
            },
            {
                path: 'distributor-detail-sp',
                name: 'DistributorDetailSp',
                component: () => import('@/views/distributor/distributor-detail.vue'),
                meta: {
                    title: '分销商详情',
                    roles: [LOGIN_TYPE.DISTRIBUTOR],
                }
            },
            {
                path: 'agent-list',
                name: 'AgentList',
                component: () => import('@/views/agent/agent-list.vue'),
                meta: {
                    title: '零售商列表',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN],
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
                }
            },
            {
                path: 'agent-detail-sp',
                name: 'AgentDetailSp',
                component: () => import('@/views/agent/agent-detail.vue'),
                meta: {
                    title: '零售商详情',
                    roles: [LOGIN_TYPE.AGENT],
                }
            },
            {
                path: 'store-list',
                name: 'StoreList',
                component: () => import('@/views/store/store-list.vue'),
                meta: {
                    title: '门店列表',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.ADMIN, LOGIN_TYPE.AGENT],
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
                }
            },
            {
                path: 'store-detail-sp',
                name: 'StoreDetailSp',
                component: () => import('@/views/store/store-detail.vue'),
                meta: {
                    title: '门店详情',
                    roles: [LOGIN_TYPE.STORE],
                }
            },
            {
                path: 'purchase-order-list',
                name: 'AdminPurchaseOrderListAll',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    title: '订单列表',
                    search_type: PURCHASE_SEARCH_TYPE.ALL,
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'purchase-order-children',
                name: 'AdminPurchaseOrderListChildren',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    title: '供货订单',
                    search_type: PURCHASE_SEARCH_TYPE.CHILDREN,
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'sales-area-list',
                name: 'SalesList',
                component: () => import('@/views/item/sales-area-list.vue'),
                meta: {
                    title: '销售区域',
                    roles: [LOGIN_TYPE.ADMIN],
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
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
            auth: ['AGENT', 'STORE', 'DISTRIBUTOR'],
            icon: 'i_s_item',
        },
        children: [
            {
                path: 'item-list',
                name: 'PurchaseItemList',
                component: () => import('@/views/purchase/item-list.vue'),
                meta: {
                    title: '采购',
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
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
                }
            },
            {
                path: 'item-collect',
                name: 'ItemCollect',
                component: () => import('@/views/purchase/item-collect.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '购物车',
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
                }
            },
            {
                path: 'purchase-order-list',
                name: 'PurchaseOrderList',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '订单列表',
                    search_type: PURCHASE_SEARCH_TYPE.ALL
                }
            },
            {
                path: 'purchase-order-self',
                name: 'PurchaseOrderListSelf',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.DISTRIBUTOR],
                    title: '采购订单',
                    search_type: PURCHASE_SEARCH_TYPE.SELF
                }
            },
            {
                path: 'purchase-order-children',
                name: 'PurchaseOrderListChildren',
                component: () => import('@/views/purchase/purchase-order-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    title: '供货订单',
                    search_type: PURCHASE_SEARCH_TYPE.CHILDREN
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
            icon: 'i_s_repair',
        },
        children: [
            {
                path: 'repair-list',
                name: 'RepairList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '工单列表',
                }
            },
            {
                path: 'repair-audit-list',
                name: 'RepairAuditList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待审工单',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    type: 'audit'
                }
            },
            {
                path: 'repair-redit-list',
                name: 'RepairReditList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待改工单',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
                    type: 'redit'
                }
            },
            {
                path: 'repair-invoice-list',
                name: 'RepairInvoiceList',
                component: () => import('@/views/repair/repair-list.vue'),
                meta: {
                    title: '待结算工单',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: 'invoice'
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
                }
            },
            {
                path: 'item-fault-list',
                name: 'FaultList',
                component: () => import('@/views/repair/item-fault-list.vue'),
                meta: {
                    title: '故障管理',
                    roles: [LOGIN_TYPE.STORE, LOGIN_TYPE.AGENT, LOGIN_TYPE.DISTRIBUTOR],
                }
            },
        ]
    },

    { // 零售商管理 - 零售商端
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
    },
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
            icon: 'i_s_item',
            roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'item-list',
                name: 'ItemList',
                component: () => import('@/views/item/item-list.vue'),
                meta: {
                    title: '商品列表',
                    roles: [LOGIN_TYPE.ADMIN],
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
                }
            },
            {
                path: 'item-category',
                name: 'ItemCategory',
                component: () => import('@/views/item/item-category.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN],
                    title: '商品分类',
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
        ]
    },

    { // 物流管理
        path: '/waybill',
        component: Layout,
        redirect: '/waybill/waybill-list',
        name: 'WayBillManagement',
        meta: {
            title: '物流管理',
            icon: 'i_deliver',
            roles: [LOGIN_TYPE.ADMIN],
            not_sub_menu: true,
            hidden: false,
        },
        children: [
            {
                path: 'waybill-list',
                name: 'waybillList',
                component: () => import('@/views/waybill/waybill-list.vue'),
                meta: {
                    title: '物流管理列表',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
        ]
    },
    { // 实例管理
        path: '/entity',
        component: Layout,
        redirect: '/entity/entity-list',
        name: 'EntityManagement',
        meta: {
            title: '实例管理',
            icon: 'i_s_item',
            roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'vehicle-list',
                name: 'VehicleList',
                component: () => import('@/views/entity/entity-list.vue'),
                meta: {
                    title: '整车列表',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: "vehicle"
                }
            },
            {
                path: 'part-list',
                name: 'PartList',
                component: () => import('@/views/entity/entity-list.vue'),
                meta: {
                    title: '零部件列表',
                    roles: [LOGIN_TYPE.ADMIN],
                    type: "part"
                }
            },
            /*{
                path: 'entity-detail',
                name: 'EntityDetail',
                component: () => import('@/views/entity/entity-detail.vue'),
                meta: {
                    hidden: true,
                    title: '车架详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/entity/entity-list',
                }
            },*/
        ]
    },
    { // 生产管理 - 平台端
        path: '/production',
        component: Layout,
        redirect: '/production/stock-list',
        name: 'ProductionManagement',
        meta: {
            title: '生产管理',
            icon: 'i_s_item',
            roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'supplier-list',
                name: 'SupplierList',
                component: () => import ('@/views/production/supplier-list.vue'),
                meta: {
                    title: '供应商列表',
                    roles: [LOGIN_TYPE.ADMIN],
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
                    auth: ['supplier.list'],
                }
            },
            {
                path: 'material-purchase-list',
                name: 'MaterialPurchaseList',
                component: () => import ('@/views/production/material-purchase-list.vue'),
                meta: {
                    title: '采购单列表',
                    roles: [LOGIN_TYPE.ADMIN],
                    is_sub_menu: true
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
                }
            },
            {
                path: 'stock-list',
                name: 'StockList',
                component: () => import ('@/views/production/stock-list.vue'),
                meta: {
                    title: '库存总览',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'material-list',
                name: 'MaterialList',
                component: () => import ('@/views/production/material-list.vue'),
                meta: {
                    title: '物料列表',
                    roles: [LOGIN_TYPE.ADMIN],
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
                    auth: ['material.list'],
                }
            },
            {
                path: 'material-category',
                name: 'MaterialCategory',
                component: () =>
                    import ('@/views/production/material-category.vue'),
                meta: {
                    title: '物料分类',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'bom-list',
                name: 'BomList',
                component: () =>
                    import ('@/views/production/bom-list.vue'),
                meta: {
                    title: 'BOM列表',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'bom-detail',
                name: 'BomDetail',
                component: () => import ('@/views/production/bom-detail.vue'),
                meta: {
                    hidden: true,
                    title: 'BOM详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/bom-list',
                    auth: ['bom.list'],
                }
            },
            {
                path: 'manufacture-order-list',
                name: 'ManufactureOrderList',
                component: () =>
                    import ('@/views/production/manufacture-order-list.vue'),
                meta: {
                    title: '生产单列表',
                    roles: [LOGIN_TYPE.ADMIN],
                }
            },
            {
                path: 'manufacture-order-edit',
                name: 'ManufactureOrderEdit',
                component: () => import ('@/views/production/manufacture-order-edit.vue'),
                meta: {
                    hidden: true,
                    title: '生产单编辑',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/production/manufacture-order-list',
                    auth: ['manufacture.save'],
                }
            },
            {
                path: 'manufacture-order-detail',
                name: 'ManufactureOrderDetail',
                component: () => import ('@/views/production/manufacture-order-detail.vue'),
                meta: {
                    hidden: true,
                    title: '生产单详情',
                    roles: [LOGIN_TYPE.ADMIN],
                    parent: '/item/item-list',
                    auth: ['manufacture.list'],
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
            icon: 'i_s_warehouse',
            roles: [LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE, LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
        },
        children: [
            {
                path: 'warehouse-list',
                name: 'WarehouseList',
                component: () => import('@/views/warehouse/warehouse-list.vue'),
                meta: {
                    title: '仓库管理',
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
                    auth: ['warehouse.list'],

                }
            },
            {
                path: 'invoice-list',
                name: 'InvoiceList',
                component: () => import('@/views/warehouse/invoice-list.vue'),
                meta: {
                    title: '出入库管理',
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
                component: () => import('@/views/warehouse/invoice-detail.vue'),
                meta: {
                    hidden: true,
                    title: '出入库详情',
                    parent: '/invoice/invoice-list',
                    auth: ['invoice.list'],
                }
            },
            {
                path: 'transfer-order-list-in',
                name: 'TransferOrderListIn',
                component: () => import('@/views/warehouse/transfer-order-list.vue'),
                meta: {
                    title: '调货收货管理',
                    roles: [LOGIN_TYPE.AGENT,LOGIN_TYPE.DISTRIBUTOR,LOGIN_TYPE.STORE],
                    type: 'in'
                }
            },
            {
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
            },
            {
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
            },
        ]
    },
    { // 售后管理 - 平台 && 分销
        path: '/aftersales-supply',
        component: Layout,
        redirect: '/aftersales-supply/aftersales-supply-list',
        name: 'AftersalesSupplyManagement',
        meta: {
            title: '售后管理',
            roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
            icon: 'i_s_temp',
            hidden: false,
        },
        children: [
            {
                path: 'aftersales-supply-list',
                name: 'AftersalesSupplyList',
                component: () => import('@/views/aftersales/aftersales-list.vue'),
                meta: {
                    title: '售后响应',
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    query_type: REFUND_QUERY_TYPE.SUPPLY,
                }
            },
            {
                path: 'aftersales-apply-list',
                redirect: '/aftersales/aftersales-list',
                meta: {
                    title: '售后申请',
                    roles: [LOGIN_TYPE.DISTRIBUTOR],
                    query_type: REFUND_QUERY_TYPE.APPLY,
                }
            },
            {
                path: 'refund-list',
                name: 'RefundList',
                component: () => import('@/views/aftersales/refund-list.vue'),
                meta: {
                    roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                    // auth: ['aftersales.refund', 'asjncsaij'],
                    title: '退款审核',
                }
            }
        ]
    },
    { // 售后管理 - 门店 && 零售
        path: '/aftersales',
        component: Layout,
        redirect: '/aftersales/aftersales-list',
        name: 'AftersalesManagement',
        meta: {
            title: '售后管理',
            icon: 'i_s_temp',
            roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
            auth: ['AGENT', 'STORE'],
            not_sub_menu: true,
        },
        children: [
            {
                path: 'aftersales-list',
                name: 'AftersalesApplyList',
                component: () => import('@/views/aftersales/aftersales-list.vue'),
                meta: {
                    title: '售后单列表',
                    roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
                    query_type: REFUND_QUERY_TYPE.APPLY,
                }
            },
            {
                path: 'aftersales-edit',
                name: 'AftersalesEdit',
                component: () => import('@/views/aftersales/aftersales-edit.vue'),
                meta: {
                    hidden: true,
                    title: '申请售后',
                    parent: '/aftersales/aftersales-list'
                }
            },
            {
                path: 'aftersales-detail',
                name: 'AftersalesDetail',
                component: () => import('@/views/aftersales/aftersales-detail.vue'),
                meta: {
                    hidden: true,
                    title: '售后单详情',
                    parent: '/aftersales/aftersales-list'
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
                }
            }
        ]
    },
    { // 账户管理
        path: '/wallet',
        component: Layout,
        redirect: '/wallet/wallet-list',
        name: 'WalletManagement',
        meta: {
            title: '账户管理',
            icon: 'i_s_user',
            roles: [LOGIN_TYPE.DISTRIBUTOR, LOGIN_TYPE.AGENT, LOGIN_TYPE.STORE],
            not_sub_menu: true,
        },
        children: [
            {
                path: 'wallet-list',
                name: 'WalletList',
                component: () => import('@/views/wallet/wallet-list.vue'),
                meta: {
                    title: '账户列表',
                }
            },
            {
                path: 'wallet-detail',
                name: 'WalletDetail',
                component: () => import('@/views/wallet/wallet-detail.vue'),
                meta: {
                    hidden: true,
                    title: '账户详情',
                    parent: '/wallet/wallet-list',
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
            icon: 'i_s_customer',
            not_sub_menu: true,
        },
        children: [
            {
                path: 'customer-list',
                name: 'CustomerList',
                component: () => import('@/views/customer/customer-list.vue'),
                meta: {
                    title: '客户列表',
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
                path: 'auth-role-list',
                name: 'RoleList',
                component: () => import('@/views/authority/auth-role-list.vue'),
                meta: {
                    title: '角色管理',
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
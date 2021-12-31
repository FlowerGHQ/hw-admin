import Api from './base';
import Const from '../const'

let baseUrl = Const.NET.URL_POINT
/*
 * PostJson
 * GetJson
 * Post
 * Get
 */

const apiList = {
    Common: { // 公共
        login: ['PostJson', 'system/login'], // 账号登录
        logout: ['Post', 'system/logout'], // 账号登出
        updatePwd: ['PostJson', 'system/updatePwd'], // 密码修改

        emailCode: ['Post', 'common/email-verification-code-send'], // 发送邮箱验证码
        phoneCode: ['Post', 'common/phone-verification-code-send'], // 发送手机验证码
        userInfo: ['Get', 'system/info'], // 获取当前登录账号的账户信息
        migrate: ['Post', 'migrate/order'], // 获取当前登录账号的账户信息
    },
    Export: { // 导出
        templateExport: ['PostJson', 'item-media-package/export'],
    },
    User: { // 员工
        save: ['PostJson', 'user/save'],
        list: ['PostJson', 'user/list'],
        detail: ['PostJson', 'user/detail'],
        delete: ['PostJson', 'user/delete'],
        setAdmin: ['PostJson', 'user/set-admin'],
    },
    Account: {
        list: ['PostJson', 'account/list'], // 账户列表
        save: ['PostJson', 'account/save' ], // 账号新增
        profile: ['GET', 'account/profile' ], // 账户详情
        update: ['PostJson', 'account/update'], //  账号修改
        delete: ['PostJson', 'account/delete' ], // 账户删除
        resetPwd: ['PostJson', 'account/resetPwd' ], // 重置密码
        statusUpdate: ['PostJson', 'account/status-update'], // 更新账户状态1=启用2=禁用
        roleAssign: ['PostJson','account/role-assign'],
    },
    AuthRole: {
        authTree: ['PostJson', 'auth/menu-list-tree'], // 权限树
        list: ['PostJson', 'auth/role-list'], // 角色列表
        save: ['PostJson', 'auth/role-save'], // 角色编辑
        menuList: ['PostJson', 'auth/menu-list'],
        menuSave: ['PostJson', 'auth/menu-save'],
        menuDelete: ['PostJson', 'auth/menu-delete'],
        treeList: ['PostJson', 'auth/menu-list-tree'],
        detail: ['PostJson', 'auth/role-detail'], // 角色详情
        delete: ['PostJson', 'auth/role-delete'], // 角色删除
        userMenu: ['PostJson', 'auth/user-menu'], // 角色删除
    },
    Agent: { // 经销商
        list: ['PostJson', 'agent/list'], // 列表
        listAll: ['PostJson','agent/list-name'], //选择用的 名称列表 无分页
        save: ['PostJson', 'agent/save'], // 编辑
        detail: ['PostJson', 'agent/detail'], // 详情
        update: ['PostJson', 'agent/update'], // 更新
        delete: ['PostJson', 'agent/delete'], // 删除
        updateStatus: ['PostJson', 'agent/update-status'], // 禁用
    },
    Customer: { // 客户管理
        list: ['PostJson', 'customer/list'],
        listByName: ['PostJson', 'customer/list-by-name'],
        save: ['PostJson', 'customer/save'],
        update: ['PostJson', 'customer/update'],
        detail: ['PostJson', 'customer/detail'],
        delete: ['PostJson', 'customer/delete'],
    },
    Warehouse: { // 仓库
        save: ['PostJson', 'warehouse/save'],
        update: ['PostJson', 'warehouse/update'],
        detail: ['PostJson', 'warehouse/detail'],
        list: ['PostJson', 'warehouse/list'],
        delete: ['PostJson', 'warehouse/delete'],
    },

    Repair: { // 维修单
        list: ['PostJson', 'repair/list'], // 列表
	    create: ['PostJson', 'repair/save'], // 列表
	    hand: ['PostJson', 'repair/hand'], // 列表
        detail: ['PostJson', 'repair/detail'], // 工单详情
	    check: ['PostJson', 'repair/check'], // 检查
        statusList: ['PostJson', 'repair/status-list'], // 保存
	    repair: ['PostJson', 'repair/repair'], // 维修结束
	    secondDoor: ['PostJson', 'repair/second-door'], // 二次上门
	    settlement: ['PostJson', 'repair/settlement'], // 结算
	    transfer: ['PostJson', 'repair/transfer'], // 维修结束
	    update: ['PostJson', 'repair/update'], // 维修结束
    },
	RepairItem: { // 维修单
		saveList: ['PostJson', 'repair-order-item/save-list'], // 列表
		list: ['PostJson', 'repair-order-item/list'], // 列表
		faultList: ['PostJson', 'repair-order-item/fault-list'], // 列表
	},

    Item: { // 商品
        save: ['PostJson', 'item/save'],
        list: ['PostJson', 'item/list'],
        detail: ['PostJson', 'item/detail'],
        delete: ['PostJson', 'item/delete'],
    },
    ItemCategory: { // 商品分类
        list: ['PostJson', 'item-category/list'],
        save: ['PostJson', 'item-category/save'],
        update: ['PostJson', 'item-category/update'],
        tree: ['PostJson', 'item-category/tree'],
        delete: ['PostJson', 'item-category/delete'],
        detail: ['PostJson', 'item-category/detail'],
    },
    SalesArea: { // 车辆销售区域
        list: ['PostJson', 'sales-area/list'],
        save: ['PostJson', 'sales-area/save'],
        delete: ['PostJson', 'sales-area/delete'],
        detail: ['PostJson', 'sales-area/detail'],
    },
    ShopCart: { // 购物车
        save: ['PostJson', 'shopping-cart/save'],
        list: ['PostJson', 'shopping-cart/list'],
        clear: ['PostJson', 'shopping-cart/clear'],
        detail: ['GetJson', 'shopping-cart/detail'],
        remove: ['PostJson', 'shopping-cart/delete'],
    },
    Favorite: { // 收藏夹
        add: ['PostJson', 'favorite/create'],
        list: ['PostJson', 'favorite/list-user'],
        remove: ['PostJson', 'favorite/delete'],
    },
    Receive: { // 配送地址
        list: ['PostJson', 'receive-info/list'],
        save: ['PostJson', 'receive-info/save'],
        detail: ['PostJson', 'receive-info/detail'],
        delete: ['PostJson', 'receive-info/delete'],
    },
    Purchase: { // 采购订单
        list: ['PostJson', 'purchase-order/list'], // 采购订单列表
        cancel: ['PostJson', 'purchase-order/cancel'], // 取消采购订单
        create: ['PostJson', 'purchase-order/create'], // 创建采购订单
        detail: ['PostJson', 'purchase-order/detail'], // 采购订单详情
        detailByUid: ['PostJson', 'purchase-order/detail-uid'], // 采购订单详情
        itemList: ['PostJson', 'purchase-order-item/list'], // 采购订单明细列表
        itemByIdList: ['PostJson', 'purchase-order-item/list-by-item-id'], // 采购订单明细列表
	    payment: ['PostJson', 'purchase-order/payment'], // 支付订单
	    deliver: ['PostJson', 'purchase-order/deliver'], // 订单发货
	    takeDeliver: ['PostJson', 'purchase-order/take-deliver'], // 确认收货
	    review: ['PostJson', 'purchase-order/review'], // 评论
	    statusList: ['PostJson', 'purchase-order/status-list'], // 保存
	    recreate: ['PostJson', 'purchase-order/recreate'], // 再来一单
    },
    Store: { // 门店管理
        list: ['PostJson', 'store/list'],
        listAll: ['PostJson', 'store/list-name'],
        save: ['PostJson', 'store/save'],
        update: ['PostJson', 'store/update'],
        detail: ['PostJson', 'store/detail'],
        delete: ['PostJson', 'store/delete'],
        updateStatus: ['PostJson', 'store/update-status'], // 禁用
    },
    Notice: { // 系统消息
        list: ['PostJson', 'sys-message/list'],
        save: ['PostJson', 'sys-message/save'],
        detail: ['PostJson', 'sys-message/detail'],
        delete: ['PostJson', 'sys-message/delete'],
    },
	ActionLog: {
		list: ['PostJson', 'action-log/list'],
	},
	Waybill:{
		detailByTarget: ['PostJson', 'waybill/detail-by-target'],
		queryLogistics: ['PostJson', 'waybill/query-logistics'],
		update: ['PostJson', 'waybill/update'],

	},
    Refund: { // 退款管理
        list: ['PostJson', 'order-refund-record/list'],
        create: ['PostJson', 'order-refund-record/create'],
        detail: ['PostJson', 'order-refund-record/detail'],
        update: ['PostJson', 'order-refund-record/update'],
        audit: ['PostJson', 'order-refund-record/audit'],

    },
    Distributor: { // 分销商
        list: ['PostJson', 'distributor/list'],
        save: ['PostJson', 'distributor/save'],
        listAll: ['PostJson','distributor/list-name'], //选择用的 名称列表 无分页
        detail: ['PostJson', 'distributor/detail'],
        updateStatus: ['PostJson', 'distributor/update-status'], //修改状态

    },
    Fault: { // 故障管理
        list: ['PostJson', 'item-fault/list'],
        save: ['PostJson', 'item-fault/save'],
        detail: ['PostJson', 'item-fault/detail'],
        delete: ['PostJson', 'item-fault/delete'],

    },

};

export default new Api(baseUrl, apiList);


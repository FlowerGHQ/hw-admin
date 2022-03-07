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
    Authority: { // 角色 & 权限
        roleList: ['PostJson', 'auth/role-list'], // 角色列表
        roleEdit: ['PostJson', 'auth/role-save'], // 角色编辑
        roleDetail: ['PostJson', 'auth/role-detail'], // 角色详情
        roleDelete: ['PostJson', 'auth/role-delete'], // 角色删除

        allOptions: ['PostJson', 'authority/list-all'],  // 所有权限项
        authOptions: ['PostJson', 'authority/list-by-org-type'], // 某个身份下 可选的权限项
        authSelected: ['PostJson', 'authority/list-by-role'],    // 某个角色 已选的权限

        allotOrgAuth: ['PostJson', 'authority/save-org-type-authority'], // 向组织分配 可分配权限
        allotAuth: ['PostJson', 'authority/save-role-authority'], // 向角色分配权限
        allotRole: ['PostJson', 'authority/save-user-role'], // 向员工账号分配角色
    },
    Agent: { // 零售商
        list: ['PostJson', 'agent/list'], // 列表
        listAll: ['PostJson','agent/list-name'], //选择用的 名称列表 无分页
        save: ['PostJson', 'agent/save'], // 编辑
        detail: ['PostJson', 'agent/detail'], // 详情
        update: ['PostJson', 'agent/update'], // 更新
        delete: ['PostJson', 'agent/delete'], // 删除
        updateStatus: ['PostJson', 'agent/update-status'], // 禁用

        detailByStore: ['PostJson', 'agent/detail-by-store'], // 通过门店找上属零售商
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
        detail: ['PostJson', 'warehouse/detail'],
        list: ['PostJson', 'warehouse/list'],
        listAll: ['PostJson', 'warehouse/list-name'],
        delete: ['PostJson', 'warehouse/delete'],
        listWithStock: ['PostJson', 'warehouse/list-with-stock'],
    },
    Stock: { //仓库库存管理
        add: ['PostJson', 'stock/add'],
        reduce: ['PostJson', 'stock/reduce'],
        list: ['PostJson', 'stock/list'],
        transfer: ['PostJson', 'stock/transfer'],
        listByTarget: ['PostJson', 'stock/list-by-target'],
        listByTargetId: ['PostJson', 'stock/list-by-target-id'],
        stockRecordList: ['PostJson', 'stock-record/list'],
        stockRecordDetail: ['PostJson', 'stock-record/detail'],
    },
    Invoice: { // 出入库货单
        save: ['PostJson', 'invoice/save'],
        detail: ['PostJson', 'invoice/detail'],
        list: ['PostJson', 'invoice/list'],
        delete: ['PostJson', 'invoice/delete'],
        audit: ['PostJson', 'invoice/audit'],
        status: ['PostJson', 'invoice/status-list'], // 状态
        handle: ['PostJson', 'invoice/handle'], // 处理完成
        cancel: ['PostJson', 'invoice/cancel'], // 取消出入库单
    },
    InvoiceItem: {
        list: ['PostJson', 'invoice-item/list'], // 出入库单明细列表
        save: ['PostJson', 'invoice-item/save'], //出入库单明细 单个修改
        saveList: ['PostJson', 'invoice-item/save-list'], //出入库单明细 批量提交
        delete: ['PostJson', 'invoice-item/delete'], //出入库单明细 单个移除
    },
    Transfer: { // 调货申请单
        save: ['PostJson', 'transfer-order/save'],
        detail: ['PostJson', 'transfer-order/detail'],
        list: ['PostJson', 'transfer-order/list'],
        delete: ['PostJson', 'transfer-order/delete'],
        audit: ['PostJson', 'transfer-order/audit'],
        itemList: ['PostJson', 'transfer-order-item/list'], // 调货单明细列表
        saveList: ['PostJson', 'transfer-order-item/save-list'], //调货单提交
        status: ['PostJson', 'transfer-order/status-list'], // 状态
        cancel: ['PostJson', 'transfer-order/cancel'], // 取消调货单
        detailByUid: ['PostJson', 'transfer-order/detail-by-uid'], // 取消调货单
    },
    Repair: { // 维修单
        list: ['PostJson', 'repair/list'], // 列表
	    create: ['PostJson', 'repair/save'], // 列表
	    hand: ['PostJson', 'repair/hand'], // 列表
        detail: ['PostJson', 'repair/detail'], // 工单详情
	    check: ['PostJson', 'repair/check'], // 确认
	    audit: ['PostJson', 'repair/audit'], // 审批
        statusList: ['PostJson', 'repair/status-list'], // 保存
	    repair: ['PostJson', 'repair/repair'], // 维修结束
	    secondDoor: ['PostJson', 'repair/second-door'], // 二次上门
	    settlement: ['PostJson', 'repair/settlement'], // 结算
	    transfer: ['PostJson', 'repair/transfer'], // 维修结束
	    update: ['PostJson', 'repair/update'], // 维修结束
	    post: ['PostJson', 'repair/post-for-transfer'], // 增加快递
	    export: ['PostJson', 'repair/export-repair-order-record'], // 导出
    },
    RepairItem: { // 维修单
        saveList: ['PostJson', 'repair-order-item/save-list'], // 列表
        list: ['PostJson', 'repair-order-item/list'], // 列表
        faultList: ['PostJson', 'repair-order-item/fault-list'], // 列表
    },
    Item: { // 商品
        save: ['PostJson', 'item/save'],
        batchSave: ['PostJson', 'item/batch-save'],
        update: ['PostJson', 'item/update'],

        list: ['PostJson', 'item/list'],
        listBySet: ['PostJson', 'item/list-by-set-id'],
        detail: ['PostJson', 'item/detail'],
        delete: ['PostJson', 'item/delete'],
        detailByCode: ['PostJson', 'item/detail-by-code'],
        detailByCodeForRepair: ['PostJson','item/detail-by-code-for-repair'],
        setIndep: ['PostJson', 'item/set-flag-independent-info'],
    },
    Entity: {// 车架
        list: ['PostJson', 'entity/list'],
        save: ['PostJson', 'entity/save'],
        detail: ['PostJson', 'entity/detail'],
        delete: ['PostJson', 'entity/delete'],
        detailByUid: ['PostJson', 'entity/detail-by-uid'],
        getByUid: ['PostJson', 'entity/get-by-uid'],


    },
    ItemCategory: { // 商品分类
        list: ['PostJson', 'item-category/list'],
        save: ['PostJson', 'item-category/save'],
        update: ['PostJson', 'item-category/update'],
        tree: ['PostJson', 'item-category/tree'],
        delete: ['PostJson', 'item-category/delete'],
        detail: ['PostJson', 'item-category/detail'],
    },
    ItemPrice: { // 商品价格体系
        save: ['PostJson', 'item-price/save'],
        batchSave: ['PostJson', 'item-price/batch-save'],
        list: ['PostJson', 'item-price/list'],
        delete: ['PostJson', 'item-price/delete'],
        detail: ['PostJson', 'item-price/detail'],
    },
    AttrDef: { // 规格定义
        save: ['PostJson', 'attr-def/save'],
        batchSave: ['PostJson', 'attr-def/batch-save'],

        delete: ['PostJson', 'attr-def/delete'],
        listBySet: ['PostJson', 'attr-def/list-by-set-id'],
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
        detailSn: ['PostJson', 'purchase-order/detail-sn'],
    },
    Store: { // 门店管理
        list: ['PostJson', 'store/list'],
        listAll: ['PostJson', 'store/list-name'],
        save: ['PostJson', 'store/save'],
        update: ['PostJson', 'store/update'],
        detail: ['PostJson', 'store/detail'],
        delete: ['PostJson', 'store/delete'],
        updateStatus: ['PostJson', 'store/update-status'], // 禁用
        listTransfer: ['PostJson', 'store/list-receive-transfer-able'], // 获取可接收转单的门店列表
        updateTransfer: ['PostJson', 'store/set-flag-receive-transfer'], // 修改是否接收转单
    },
    Notice: { // 系统消息
        list: ['PostJson', 'sys-message/list'],
        save: ['PostJson', 'sys-message/save'],
        detail: ['PostJson', 'sys-message/detail'],
        delete: ['PostJson', 'sys-message/delete'],
    },
    ActionLog: { // 维修单 操作记录
        list: ['PostJson', 'action-log/list'],
    },
    Waybill: { // 物流
        delete: ['PostJson', 'waybill/delete'],
        detail: ['PostJson', 'waybill/detail'],
        detailByTarget: ['PostJson', 'waybill/detail-by-target'],
        detailByUid: ['PostJson', 'waybill/detail-by-uid'],
        detailType: ['PostJson', 'waybill/detail-type'],
        list: ['PostJson', 'waybill/list'],
        queryLogistics: ['PostJson', 'waybill/query-logistics'],
        save: ['PostJson', 'waybill/save'],
        saveByUid: ['PostJson', 'waybill/save-by-uid'],
        update: ['PostJson', 'waybill/update'],
    },
    Refund: { // 退款管理
        list: ['PostJson', 'order-refund-record/list'],
        create: ['PostJson', 'order-refund-record/create'],
        detail: ['PostJson', 'order-refund-record/detail'],
        update: ['PostJson', 'order-refund-record/update'],
        audit: ['PostJson', 'order-refund-record/audit'],
        cancel: ['PostJson', 'order-refund-record/cancel'],
        status: ['PostJson', 'order-refund-record/status-list'], // 状态
    },
    Distributor: { // 分销商
        list: ['PostJson', 'distributor/list'],
        save: ['PostJson', 'distributor/save'],
        listAll: ['PostJson', 'distributor/list-name'], //选择用的 名称列表 无分页
        detail: ['PostJson', 'distributor/detail'],
        updateStatus: ['PostJson', 'distributor/update-status'], //修改状态
    },
    Fault: { // 产品故障管理
        list: ['PostJson', 'item-fault/list'],
        save: ['PostJson', 'item-fault/save'],
        detail: ['PostJson', 'item-fault/detail'],
        delete: ['PostJson', 'item-fault/delete'],
    },
    FaultEntity: { // 故障件管理
        audit: ['PostJson', 'fault-entity/audit'],
        delete: ['PostJson', 'fault-entity/delete'],
        detail: ['PostJson', 'fault-entity/detail'],
        detailByUid: ['PostJson', 'fault-entity/detail-by-uid'],
        list: ['PostJson', 'fault-entity/list'],
        save: ['PostJson', 'fault-entity/save'],
    },
    System: { // 系统管理
        fileList: ['PostJson', 'sys-file/list'], // 系统文件管理
        fileSave: ['PostJson', 'sys-file/save'],
        fileDetail: ['PostJson', 'sys-file/detail'],
        fileDelete: ['PostJson', 'sys-file/delete'],
    },

    Attachment: { // 附件管理
        list: ['PostJson', 'attachment/list'],
        save: ['PostJson', 'attachment/save'],
        delete: ['PostJson', 'attachment/delete'],
    },
    Wallet: { // 钱包管理
        list: ['PostJson', 'wallet/list'],
        get: ['PostJson', 'wallet/get'],
        detail: ['PostJson', 'wallet/detail'],
        update: ['PostJson', 'wallet/update-balance'],
    },
};

export default new Api(baseUrl, apiList);
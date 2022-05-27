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
        purchaseExport: ['PostJson', 'purchase-order/export'],
        purchaseTemplateExport: ['PostJson', 'purchase-order/export-template'], // 采购单模版导出
        repairExport: ['PostJson', 'repair/export-repair-order-record'],
        invoiceOutExport: ['PostJson', 'invoice/export-out-invoice'],//导出
        invoiceInExport: ['PostJson', 'invoice/export-in-invoice'],//导出
        materialPurchaseExport: ['PostJson', '/material-purchase-order/export'],//导出
    },
    User: { // 员工
        save: ['PostJson', 'user/save'],
        list: ['PostJson', 'user/list'],
        listAll: ['PostJson', 'user/list-name'],
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
    },
    Authority: { // 角色 & 权限
        roleList: ['PostJson', 'auth/role-list'], // 角色列表
        roleEdit: ['PostJson', 'auth/role-save'], // 角色编辑
        roleDetail: ['PostJson', 'auth/role-detail'], // 角色详情
        roleDelete: ['PostJson', 'auth/role-delete'], // 角色删除

        allOptions: ['PostJson', 'authority/list-all'],  // 所有权限项
        authOptions: ['PostJson', 'authority/list-by-org-type'], // 某个身份下 可选的权限项
        authSelected: ['PostJson', 'authority/list-by-role'],    // 某个角色 已选的权限
        authRoleUser: ['PostJson', 'authority/list-role-by-user'],    // 获取该用户对应角色下的全部权限
        authUser: ['PostJson', 'authority/list-by-user'],    // 某个用户对应角色 已选的权限
        authUserAll: ['PostJson', 'authority/list-all-by-user'],    // 获取某个用户所有权限


        allotOrgAuth: ['PostJson', 'authority/save-org-type-authority'], // 向组织分配 可分配权限
        allotAuth: ['PostJson', 'authority/save-role-authority'], // 向角色分配权限
        allotRole: ['PostJson', 'authority/save-user-role'], // 向员工账号分配角色
        allotUser: ['PostJson', 'authority/save-user-authority'], // 向员工账户分配权限
        deleteUserRole: ['PostJson', 'authority/delete-user-role'], // 向员工账号分配角色

        listUserRole: ['PostJson', 'authority/list-user-role'], // 查看所有对应用户的所有角色

    },
    AuthorityUser: {
        list: ['PostJson', 'authority/list-user-authority-scope'], // 用户权限范围列表
        save: ['PostJson', 'authority/save-user-authority-scope'],//新增/编辑用户权限范围
        detail: ['PostJson', 'authority/detail-user-authority-scope'],//用户权限范围详情
        delete: ['PostJson', 'authority//delete-user-authority-scope'],//删除用户权限范围
        authority: ['PostJson', 'authority//list-by-resource-authorized'], //获得某个资源授权的用户ID列表
        user: ['PostJson', 'authority//user-has-authority'],//判断用户是否拥有对某个资源的权限


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
        submit: ['PostJson', 'invoice/submit'],
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
        deliver: ['PostJson', 'transfer-order/deliver'], // 调货单发货
        receive: ['PostJson', 'transfer-order/receive'], // 调货单收货
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
        detailByUid: ['PostJson', 'repair/detail-by-uid'],
        pay: ['PostJson', 'repair/pay'],
        stock: ['PostJson', 'repair/save-to-invoice'], //入库

        settleDetail: ['PostJson', 'clearing-order/detail-by-source'], //结算单
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
        updateStatus: ['PostJson', 'item/update-status'], // 上下架
        list: ['PostJson', 'item/list'],
        listBySet: ['PostJson', 'item/list-by-set-id'],
        detail: ['PostJson', 'item/detail'],
        detailByCode: ['PostJson', 'item/detail-by-code'],
        detailByCodeForRepair: ['PostJson','item/detail-by-code-for-repair'],
        delete: ['PostJson', 'item/delete'],
        setIndep: ['PostJson', 'item/set-flag-independent-info'],
        addItemComponent: ['PostJson', 'item/item-component-set-save'], // 新增爆炸图
        getItemComponent: ['PostJson', 'item/item-component-set-list'], // 查询爆炸图列表
        bindItemComponent: ['PostJson', 'item/bind-item-component'], // 绑定零部件
        deleteItemComponent: ['PostJson', 'item/delete-item-component'], // 解绑零部件
    },
    Entity: {// 车架
        list: ['PostJson', 'entity/list'],
        save: ['PostJson', 'entity/save'],
        detail: ['PostJson', 'entity/detail'],
        delete: ['PostJson', 'entity/delete'],
        detailByUid: ['PostJson', 'entity/detail-by-uid'],
        getByUid: ['PostJson', 'entity/get-by-uid'],
        batchSave: ['PostJson', 'entity/batch-save-arrival-time'],
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
    SalesArea: { // 销售区域
        list: ['PostJson', 'sales-area/list'],
        save: ['PostJson', 'sales-area/save'],
        delete: ['PostJson', 'sales-area/delete'],
        detail: ['PostJson', 'sales-area/detail'],
    },
    SalesAreaItem: { //销售区域商品管理
        list: ['PostJson', 'item-sales-area/list'],
        bind: ['PostJson', 'item-sales-area/sales-ares-bind'],
        delete: ['PostJson', 'item-sales-area/delete'],
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
        detailBySn: ['PostJson', 'purchase-order/detail-sn'],
        itemList: ['PostJson', 'purchase-order-item/list'], // 采购订单明细列表
        itemByIdList: ['PostJson', 'purchase-order-item/list-by-item-id'], // 采购订单明细列表
        payment: ['PostJson', 'purchase-order/payment'], // 支付订单
        deliver: ['PostJson', 'purchase-order/deliver'], // 订单发货
        takeDeliver: ['PostJson', 'purchase-order/take-deliver'], // 确认收货
        review: ['PostJson', 'purchase-order/review'], // 评论
        statusList: ['PostJson', 'purchase-order/status-list'], // 保存
        recreate: ['PostJson', 'purchase-order/recreate'], // 再来一单
        transfer: ['PostJson', 'purchase-order/transfer'], // 转单
    },
    Aftersales: { // 售后单
        list: ['PostJson', 'after-sales-order/list'],
        save: ['PostJson', 'after-sales-order/save'],
        audit: ['PostJson', 'after-sales-order/audit'],
        detail: ['PostJson', 'after-sales-order/detail'],
        cancel: ['PostJson', 'after-sales-order/cancel'],
        submit: ['PostJson', 'after-sales-order/submit'], // 提交审核

        deliver: ['PostJson', 'after-sales-order/create-waybill'],
        receive: ['PostJson', 'after-sales-order/receive-waybill'],
        applyRefund: ['PostJson', 'after-sales-order/apply-refund'],
    },
    AftersalesItem: { // 售后单明细
        list:   ['PostJson', 'after-sales-order-item/list'],
        save:   ['PostJson', 'after-sales-order-item/save-list'], //批量修改
        edit:   ['PostJson', 'after-sales-order-item/save'],      //单个修改
        detail: ['PostJson', 'after-sales-order-item/detail'],
        delete: ['PostJson', 'after-sales-order-item/delete'],
    },
    Refund: { // 退款管理
        list: ['PostJson', 'order-refund-record/list'],
        create: ['PostJson', 'order-refund-record/create'],
        detail: ['PostJson', 'order-refund-record/detail'],
        update: ['PostJson', 'order-refund-record/update'],
        audit: ['PostJson', 'order-refund-record/audit'],
        cancel: ['PostJson', 'order-refund-record/cancel'],
        status: ['PostJson', 'order-refund-record/status-list'], // 状态
        handle: ['PostJson', 'order-refund-record/handle'],
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
        batchAudit: ['PostJson', 'fault-entity/batch-audit'], // 批量审核
        batchRecycle: ['PostJson', 'fault-entity/batch-recycle']  // 批量入库
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
    Wallet: { // 账户管理
        list: ['PostJson', 'wallet/list'],
        get: ['PostJson', 'wallet/get'],
        detail: ['PostJson', 'wallet/detail'],
        update: ['PostJson', 'wallet/update-balance'],
        walletDetail:  ['PostJson', 'wallet-money/detail'],
        walletList: ['PostJson', 'wallet-money/list'],
    },
    // 生产管理
    ProductionOrder: { // 生产单
        list: ['PostJson', 'production-order/list'],
        save: ['PostJson', 'production-order/save'],
        detail: ['PostJson', 'production-order/detail'],
        detailByUid: ['PostJson', 'production-order/detail-by-uid'],
        cancel: ['PostJson', 'production-order/cancel'],
    },
    Material: { // 物料
        save: ['PostJson', 'material/save'],
        delete: ['PostJson', 'material/delete'],
        list: ['PostJson', 'material/list'],
        detail: ['PostJson', 'material/detail'],
        price: ['PostJson', 'material/set-supplier-material-price'],
    },
    MaterialCategory: { // 物料分类
        tree: ['PostJson', 'material-category/tree'],
        list: ['PostJson', 'material-category/list'],
        save: ['PostJson', 'material-category/save'],
        update: ['PostJson', 'material-category/update'],
        detail: ['PostJson', 'material-category/detail'],
        delete: ['PostJson', 'material-category/delete'],
    },
    BomCategory: {
        list: ['PostJson', 'bom-category/list'],
        save: ['PostJson', 'bom-category/save'],
        delete: ['PostJson', 'bom-category/delete'],
        tree: ['PostJson', 'bom-category/tree'],
    },
    Bom: { // bom表
        list: ['PostJson', 'bom/list'],
        listAll: ['PostJson', 'bom/list-name'],
        save: ['PostJson', 'bom/save'],
        detail: ['PostJson', 'bom/detail'],
        delete: ['PostJson', 'bom/delete'],
        detailByItemId: ['PostJson', 'bom/detail-by-item-id'],
        invoiceBom: ['PostJson', 'bom/create-invoice-of-bom'], //根据bom生成领料单
    },
    BomItem: {  // bom明细
        save: ['PostJson', 'bom-item/save'],
        batchSave: ['PostJson', 'bom-item/batch-add'],
        list: ['PostJson', 'bom-item/list'],
        listAll: ['PostJson', 'bom-item/list-all'],
        delete: ['PostJson', 'bom-item/delete'],
        batchDelete: ['PostJson', 'bom-item/batch-delete'],
        deleteByEditTime: ['PostJson', 'bom-item/delete-by-edit-time'],
    },
    ReceiveAddress: { //收货地址管理
        list: ['PostJson', 'receive-info/list'],
        save: ['PostJson', 'receive-info/save'],
        detail: ['PostJson', 'receive-info/detail'],
        delete: ['PostJson', 'receive-info/delete'],
    },
    Supplier: { //供应商
        list: ['PostJson', 'supplier/list'],
        save: ['PostJson', 'supplier/save'],
        detail: ['PostJson', 'supplier/detail'],
        delete: ['PostJson', 'supplier/delete'],
        listAll: ['PostJson', 'supplier/list-name'],
    },
    SupplierItem: { //供应商物料管理
        list: ['PostJson', 'supplier-material/list'],
        save: ['PostJson', 'supplier-material/save'],
        batchSave: ['PostJson', 'supplier-material/batch-save'],
        detail: ['PostJson', 'supplier-material/detail'],
        delete: ['PostJson', 'supplier-material/delete-material'],
    },
    MaterialPurchase: { //物料采购单
        list: ['PostJson', 'material-purchase-order/list'],
        detail: ['PostJson', 'material-purchase-order/detail'],
        cancel: ['PostJson', 'material-purchase-order/cancel'],
        save: ['PostJson', 'material-purchase-order/save'],
        submit: ['PostJson', 'material-purchase-order/submit'],
        audit: ['PostJson', 'material-purchase-order/audit'],
        export: ['PostJson', 'material-purchase-order/export'], // 导出
        itemList: ['PostJson', 'material-purchase-order-item/list'],
        itemDetail: ['PostJson', 'material-purchase-order-item/detail'],
        itemDelete: ['PostJson', 'material-purchase-order-item/delete'],
        itemSave: ['PostJson', 'material-purchase-order-item/save'],
        batchSave: ['PostJson', 'material-purchase-order-item/batch-save'],
        statusList: ['PostJson', 'material-purchase-order/status-list'],
        detailByUid: ['PostJson', 'material-purchase-order/detail-by-sn'],
        stock: ['PostJson', 'material-purchase-order/save-to-invoice'],//入库
    },
    WarehouseTransfer: { //物料调货单
        list: ['PostJson', 'warehouse-transfer-order/list'],
        detail: ['PostJson', 'warehouse-transfer-order/detail'],
        cancel: ['PostJson', 'warehouse-transfer-order/cancel'],
        save: ['PostJson', 'warehouse-transfer-order/save'],
        submit: ['PostJson', 'warehouse-transfer-order/submit'],
        statusList: ['PostJson', 'warehouse-transfer-order/status-list'],
        audit: ['PostJson', 'warehouse-transfer-order/audit'],
        itemList: ['PostJson', 'warehouse-transfer-order-item/list'],
        itemSave: ['PostJson', 'warehouse-transfer-order-item/save'],
        saveList: ['PostJson', 'warehouse-transfer-order-item/save-list'],
        itemDelete: ['PostJson', 'warehouse-transfer-order-item/delete'],
        deliver: ['PostJson', 'warehouse-transfer-order/deliver'],
        receive: ['PostJson', 'warehouse-transfer-order/receive'],
        stock: ['PostJson', 'warehouse-transfer-order/save-to-invoice'],//入库
        detailByUid: ['PostJson', 'warehouse-transfer-order/detail-by-sn'],//入库


    }
};

export default new Api(baseUrl, apiList);

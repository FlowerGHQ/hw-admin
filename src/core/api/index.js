import Api from './base';
import Const from '../const';

let baseUrl = Const.NET.URL_POINT;
/*
 * PostJson
 * GetJson
 * Post
 * Get
 */

const apiList = {
    Common: {
        // 公共
        // login: ['PostJson', 'system/login'], // 账号登录
        logout: ['Post', 'system/logout'], // 账号登出
        updatePwd: ['PostJson', 'system/updatePwd'], // 密码修改

        checkAccount: ['PostJson', 'system/login/check-account'], // 校验登录账号
        selectUser: ['PostJson', 'system/login'], // 选择用户登录
        switchUser: ['PostJson', 'system/switch-user'], // 切换用户
        loginByTempUser: ['PostJson', 'system/login-by-temp-user'], // 临时用户登录-供应商

        emailCode: ['Post', 'common/email-verification-code-send'], // 发送邮箱验证码
        phoneCode: ['Post', 'common/phone-verification-code-send'], // 发送手机验证码
        userInfo: ['Get', 'system/info'], // 获取当前登录账号的账户信息
        migrate: ['Post', 'migrate/order'], // 获取当前登录账号的账户信息
        downloadImportQualifiedListTemplate: ['GetJson', 'file/download-import-template'], // 下载导入合格供应商名录模板
    },
    ThirdParty: {
        fsAuthorize: ['Get', 'feishu/web/authorize'], // 飞书登录验证
    },
    Export: {
        // 导出
        purchaseExport: ['PostJson', 'purchase-order/export'],
        purchaseTemplateExport: ['PostJson', 'purchase-order/export-template'], // 采购单模版导出
        purchaseOrderExport: ['PostJson', 'purchase-order/export-order'], // 采购单模版导出
        repairExport: ['PostJson', 'repair/export-repair-order-record'],
        invoiceOutExport: ['PostJson', 'invoice/export-out-invoice'], //导出
        invoiceInExport: ['PostJson', 'invoice/export-in-invoice'], //导出
        invoiceDetailExport: ['PostJson', 'invoice/export-detail'], //导出
        materialPurchaseExport: ['PostJson', '/material-purchase-order/export'], //导出
        ItemCollectExport: ['PostJson', '/shopping-cart/download-import-template'], //导出
        feedbackTemplateExport: ['PostJson', 'feedback/export-template'], // 采购单模版导出

        exportOrderPrice: ['GetJson', 'purchase-order/export-item-price'], // 采购数据导出

        exportStock: ['GetJson', 'stock/export'], // 采购数据导出

        exportItemPrice: ['GetJson', 'item/export-item-price'], // 导出数据

        exportSalesStatement: ['GetJson', 'purchase-order/export-sales-statement'], // 导出数据
        exportSalesQuantityStatistics: ['GetJson', 'purchase-order/export-sales-quantity-statistics'], // 导出数据
        exportAccessoriesOrder: ['GetJson', 'purchase-order/export-accessories-order'], // 导出数据
        materialExport: ['PostJson', 'material/export-material'], // 物料导出
        goodItemExport: ['PostJson', 'app-order/export'], // 好物订单-导出
        downloadItem: ['GetJson', 'app-order/download-import-template'], // 好物订单-下载模板
        incomingInspection: ['GetJson', 'material-arrival-quality-inspection-order/export'], // 来料检导出
        orderExport: ['GetJson', 'crm-order/export'],
        downloadTemplate: ['GetJson', 'aftermarket/bom/download-aftermarket-bom'], // 二级页面下载导入模板
        enquiryTickeTexport: ['GetJson', 'enquiry-ticket/export'], // 问询单导出接口
        downloadImportFobPriceTemplate: ['GetJson', 'item/download-import-fob-price-template'], // 下载导入商品价格模板
        bomItemExport: ['GetJson', 'supplier/bom-item/export'], // 导出bom item
    },
    User: {
        // 用户
        save: ['PostJson', 'user/save'],
        list: ['PostJson', 'user/list'],
        listAll: ['PostJson', 'user/list-name'],
        detail: ['PostJson', 'user/detail'],
        delete: ['PostJson', 'user/delete'],
        setAdmin: ['PostJson', 'user/set-admin'],
        listGroup: ['PostJson', 'user/list-group'],
        setPlatformAdmin: ['PostJson', 'user/set-platform-admin'],
        checkAdmin: ['PostJson', 'user/check-admin'], // 检查用户是否是超级管理员
    },
    Account: {
        list: ['PostJson', 'account/list'], // 账户列表
        save: ['PostJson', 'account/save'], // 账号新增
        profile: ['GET', 'account/profile'], // 账户详情
        update: ['PostJson', 'account/update'], //  账号修改
        delete: ['PostJson', 'account/delete'], // 账户删除
        resetPwd: ['PostJson', 'account/resetPwd'], // 重置密码
        statusUpdate: ['PostJson', 'account/status-update'], // 更新账户状态1=启用2=禁用
        ResetDetailPwd: ['PostJson', 'account/reset-password'], // 重置密码(1分销商详情 2门店详情 3零售详情下的用户管理)
    },
    Authority: {
        // 角色 & 权限
        roleList: ['PostJson', 'auth/role-list'], // 角色列表
        roleEdit: ['PostJson', 'auth/role-save'], // 角色编辑
        roleDetail: ['PostJson', 'auth/role-detail'], // 角色详情
        roleDelete: ['PostJson', 'auth/role-delete'], // 角色删除

        allOptions: ['PostJson', 'authority/list-all'], // 所有权限项
        authOptions: ['PostJson', 'authority/list-by-org-type'], // 某个身份下 可选的权限项
        authSelected: ['PostJson', 'authority/list-by-role'], // 某个角色 已选的权限
        authRoleUser: ['PostJson', 'authority/list-role-by-user'], // 获取该用户对应角色下的全部权限
        authUser: ['PostJson', 'authority/list-by-user'], // 某个用户对应角色 已选的权限
        authUserAll: ['PostJson', 'authority/list-all-by-user'], // 获取某个用户所有权限

        allotOrgAuth: ['PostJson', 'authority/save-org-type-authority'], // 向组织分配 可分配权限
        allotAuth: ['PostJson', 'authority/save-role-authority'], // 向角色分配权限
        allotRole: ['PostJson', 'authority/save-user-role'], // 向用户账号分配角色
        allotUser: ['PostJson', 'authority/save-user-authority'], // 向用户账户分配权限
        deleteUserRole: ['PostJson', 'authority/delete-user-role'], // 向用户账号分配角色

        listUserRole: ['PostJson', 'authority/list-user-role'], // 查看所有对应用户的所有角色
    },
    AuthorityUser: {
        list: ['PostJson', 'authority/list-user-authority-scope'], // 用户权限范围列表
        save: ['PostJson', 'authority/save-user-authority-scope'], //新增/编辑用户权限范围
        detail: ['PostJson', 'authority/detail-user-authority-scope'], //用户权限范围详情
        delete: ['PostJson', 'authority/delete-user-authority-scope'], //删除用户权限范围
        authority: ['PostJson', 'authority/list-by-resource-authorized'], //获得某个资源授权的用户ID列表
        user: ['PostJson', 'authority/user-has-authority'], //判断用户是否拥有对某个资源的权限
    },
    Agent: {
        // 零售商
        list: ['PostJson', 'agent/list'], // 列表
        listAll: ['PostJson', 'agent/list-name'], //选择用的 名称列表 无分页
        save: ['PostJson', 'agent/save'], // 编辑
        detail: ['PostJson', 'agent/detail'], // 详情
        update: ['PostJson', 'agent/update'], // 更新
        delete: ['PostJson', 'agent/delete'], // 删除
        updateStatus: ['PostJson', 'agent/update-status'], // 禁用

        detailByStore: ['PostJson', 'agent/detail-by-store'], // 通过门店找上属零售商
        listPath: ['PostJson', 'agent/list-path'], // 详情
    },
    Customer: {
        // 客户管理
        list: ['PostJson', 'customer/list'],
        listByName: ['PostJson', 'customer/list-by-name'],
        save: ['PostJson', 'customer/save'],
        update: ['PostJson', 'customer/update'],
        detail: ['PostJson', 'customer/detail'],
        delete: ['PostJson', 'customer/delete'],
    },
    Warehouse: {
        // 仓库
        save: ['PostJson', 'warehouse/save'],
        detail: ['PostJson', 'warehouse/detail'],
        list: ['PostJson', 'warehouse/list'],
        listAll: ['PostJson', 'warehouse/list-name'],
        delete: ['PostJson', 'warehouse/delete'],
        listWithStock: ['PostJson', 'warehouse/list-with-stock'],
    },
    WarehouseLocation: {
        save: ['PostJson', 'warehouse-location/save'],
        detail: ['PostJson', 'warehouse-location/detail'],
        list: ['PostJson', 'warehouse-location/list'],
        listAll: ['PostJson', 'warehouse-location/list-name'],
        delete: ['PostJson', 'warehouse-location/delete'],
    },
    WarehouseLocationStock: {
        save: ['PostJson', 'warehouse-location-stock/save'],
        saveList: ['PostJson', 'warehouse-location-stock/save-list'],
        detail: ['PostJson', 'warehouse-location-stock/detail'],
        detailByWarehouseLocation: ['PostJson', 'warehouse-location-stock/detail-by-warehouse_location_id'],

        list: ['PostJson', 'warehouse-location-stock/list'],
        listAll: ['PostJson', 'warehouse-location-stock/list-name'],
        delete: ['PostJson', 'warehouse-location-stock/delete'],
        detailByWarehouseId: ['PostJson', 'warehouse-location-stock/detail-by-warehouse-id'],
        adjust: ['PostJson', 'warehouse-location-stock/adjust'],
        check: ['PostJson', 'warehouse-location-stock/check'],
    },
    Stock: {
        //仓库库存管理
        add: ['PostJson', 'stock/add'],
        detail: ['PostJson', 'stock/detail'],
        reduce: ['PostJson', 'stock/reduce'],
        list: ['PostJson', 'stock/list'],
        transfer: ['PostJson', 'stock/transfer'],
        listByTarget: ['PostJson', 'stock/list-by-target'],
        listByTargetId: ['PostJson', 'stock/list-by-target-id'],
        stockRecordList: ['PostJson', 'stock-record/list'],
        stockRecordDetail: ['PostJson', 'stock-record/detail'],
        detailCodeWarehouse: ['PostJson', 'stock-record/detail-code-warehouse'],
        detailWarehouse: ['PostJson', 'stock-record/detail-warehouse'],
    },
    StockRecord: {
        //仓库库存管理
        add: ['PostJson', 'stock-record/add'],
        adjust: ['PostJson', 'stock-record/adjust'],
        detail: ['PostJson', 'stock-record/detail'],
        detailWarehouse: ['PostJson', 'stock-record/detail-warehouse'],
    },
    Invoice: {
        // 出入库货单
        save: ['PostJson', 'invoice/save'],
        detail: ['PostJson', 'invoice/detail'],
        list: ['PostJson', 'invoice/list'],
        delete: ['PostJson', 'invoice/delete'],
        audit: ['PostJson', 'invoice/audit'],
        submit: ['PostJson', 'invoice/submit'],
        status: ['PostJson', 'invoice/status-list'], // 状态
        handle: ['PostJson', 'invoice/handle'], // 处理完成
        cancel: ['PostJson', 'invoice/cancel'], // 取消出入库单
        listByPurchase: ['PostJson', 'invoice/list-by-purchase'],
        updatePI: ['PostJson', 'invoice/update-pi'], // 修改pi
        detailByItemUid: ['PostJson', 'invoice/detail-by-item-uid'], // 修改pi
        generateMaterialRequisition: ['PostJson', 'invoice/generate-material-requisition'], // 一键领料
    },
    InvoiceItem: {
        list: ['PostJson', 'invoice-item/list'], // 出入库单明细列表
        save: ['PostJson', 'invoice-item/save'], //出入库单明细 单个修改
        saveList: ['PostJson', 'invoice-item/save-list'], //出入库单明细 批量提交
        saveChild: ['PostJson', 'invoice-item/save-child'], //出入库单明细 批量提交
        delete: ['PostJson', 'invoice-item/delete'], //出入库单明细 单个移除
    },
    Transfer: {
        // 调货申请单
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
    Repair: {
        // 维修单
        list: ['PostJson', 'repair/list'], // 列表
        create: ['PostJson', 'repair/save'], // 新建工单
        hand: ['PostJson', 'repair/hand'],
        detail: ['PostJson', 'repair/detail'], // 工单详情
        check: ['PostJson', 'repair/check'], // 确认
        audit: ['PostJson', 'repair/audit'], // 审批
        delete: ['PostJson', 'repair/delete'], // 审批
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
        remark: ['PostJson', 'repair/remark'], //入库
        settleDetail: ['PostJson', 'clearing-order/detail-by-source'], //结算单
    },
    RepairItem: {
        // 维修单
        saveList: ['PostJson', 'repair-order-item/save-list'], // 列表
        list: ['PostJson', 'repair-order-item/list'], // 列表
        faultList: ['PostJson', 'repair-order-item/fault-list'], // 列表
    },
    Item: {
        // 商品
        save: ['PostJson', 'item/save'],
        batchSave: ['PostJson', 'item/batch-save'],
        update: ['PostJson', 'item/update'],
        updateStatus: ['PostJson', 'item/update-status'], // 上下架
        list: ['PostJson', 'item/list'],
        listBySet: ['PostJson', 'item/list-by-set-id'],
        detail: ['PostJson', 'item/detail'],
        detailByCode: ['PostJson', 'item/detail-by-code'],
        detailByCodeForRepair: ['PostJson', 'item/detail-by-code-for-repair'],
        delete: ['PostJson', 'item/delete'],
        setIndep: ['PostJson', 'item/set-flag-independent-info'],
        setDefaults: ['PostJson', 'item/set-flag-defaults'],
        addItemComponent: ['PostJson', 'item/item-component-set-save'], // 新增爆炸图
        getItemComponent: ['PostJson', 'item/item-component-set-list'], // 查询爆炸图列表
        bindItemComponent: ['PostJson', 'item/bind-item-component'], // 绑定零部件
        deleteItemComponent: ['PostJson', 'item/delete-item-component'], // 解绑零部件
        saveSalesAreaByCategory: ['PostJson', 'item/save-sales-area-by-category'], // 解绑零部件
        ItemAccessoryModify: ['PostJson', 'item-accessory/modify'], // 商品详情上传配件修改数量
        ItemCategory: ['PostJson', 'item-category/primary/list'], // 获取商品分类一级分类tab列表
    },
    ItemAccessory: {
        // 商品
        // save: ['PostJson', 'item-accessory/save'],   // 单选
        save: ['PostJson', 'item-accessory/save-list'], // 多选
        list: ['PostJson', 'item-accessory/list'],
        delete: ['PostJson', 'item-accessory/delete'],
    },

    Entity: {
        // 车架
        list: ['PostJson', 'entity/list'],
        save: ['PostJson', 'entity/save'],
        detail: ['PostJson', 'entity/detail'],
        delete: ['PostJson', 'entity/delete'],
        detailByUid: ['PostJson', 'entity/detail-by-uid'],
        getByUid: ['PostJson', 'entity/get-by-uid'],
        batchSave: ['PostJson', 'entity/batch-save-arrival-time'],
    },
    Device: {
        // 车架
        list: ['PostJson', 'device/list'],
        deviceToEntity: ['PostJson', 'device/device-to-entity'],
    },
    ItemCategory: {
        // 商品分类
        list: ['PostJson', 'item-category/list'],
        listAll: ['PostJson', 'item-category/list-all'],
        save: ['PostJson', 'item-category/save'],
        update: ['PostJson', 'item-category/update'],
        tree: ['PostJson', 'item-category/tree'],
        treeList: ['PostJson', 'item-category/list/tree'], // 三包管理 - 商品详情
        delete: ['PostJson', 'item-category/delete'],
        detail: ['PostJson', 'item-category/detail'],
        // 是否显示爆炸图
        updateDisplay: ['PostJson', 'item-category/update-display'],
    },
    ItemPrice: {
        // 商品价格体系
        save: ['PostJson', 'item-price/save'],
        batchSave: ['PostJson', 'item-price/batch-save'],
        list: ['PostJson', 'item-price/list'],
        delete: ['PostJson', 'item-price/delete'],
        detail: ['PostJson', 'item-price/detail'],
    },
    AttrDef: {
        // 规格定义
        save: ['PostJson', 'attr-def/save'],
        batchSave: ['PostJson', 'attr-def/batch-save'],

        delete: ['PostJson', 'attr-def/delete'],
        listBySet: ['PostJson', 'attr-def/list-by-set-id'],
    },
    SalesArea: {
        // 销售区域
        list: ['PostJson', 'sales-area/list'],
        save: ['PostJson', 'sales-area/save'],
        delete: ['PostJson', 'sales-area/delete'],
        detail: ['PostJson', 'sales-area/detail'],
        // 获取销售区域列表
        listAll: ['PostJson', 'sales-area/bind-list'],
    },
    SalesAreaItem: {
        //销售区域商品管理
        list: ['PostJson', 'item-sales-area/list'],
        bind: ['PostJson', 'item-sales-area/sales-ares-bind'],
        delete: ['PostJson', 'item-sales-area/delete'],
        batchSave: ['PostJson', 'item-sales-area/batch-save'],
    },
    ShopCart: {
        // 购物车
        save: ['PostJson', 'shopping-cart/save'],
        list: ['PostJson', 'shopping-cart/list'],
        clear: ['PostJson', 'shopping-cart/clear'],
        detail: ['GetJson', 'shopping-cart/detail'],
        remove: ['PostJson', 'shopping-cart/delete'],

        // 备注
        remark: ['PostJson', 'shopping-cart/remark'],
        switchItem: ['PostJson', 'shopping-cart/switch-item'], // 切换商品
    },
    Favorite: {
        // 收藏夹
        add: ['PostJson', 'favorite/create'],
        list: ['PostJson', 'favorite/list-user'],
        remove: ['PostJson', 'favorite/delete'],
    },
    Receive: {
        // 配送地址
        list: ['PostJson', 'receive-info/list'],
        save: ['PostJson', 'receive-info/save'],
        detail: ['PostJson', 'receive-info/detail'],
        delete: ['PostJson', 'receive-info/delete'],
    },
    Purchase: {
        // 采购订单
        // 修改赠品单
        updateGiveaway: ['PostJson', 'purchase-order-item/update-giveaway'],
        // 删除赠品单
        deleteGiveaway: ['PostJson', 'purchase-order-item/delete-giveaway'],
        list: ['PostJson', 'purchase-order/list'], // 采购订单列表
        cancel: ['PostJson', 'purchase-order/cancel'], // 取消采购订单
        create: ['PostJson', 'purchase-order/create'], // 创建采购订单
        detail: ['PostJson', 'purchase-order/detail'], // 采购订单详情
        update: ['PostJson', 'purchase-order/update'], // 采购订单修改
        detailBySn: ['PostJson', 'purchase-order/detail-sn'],
        itemList: ['PostJson', 'purchase-order-item/list'], // 采购订单明细列表
        giveawayList: ['PostJson', 'purchase-order-item/giveaway-list'], // 采购订单赠品明细列表
        payList: ['PostJson', 'purchase-order-pay/list'], // 采购订单收款明细列表
        payAudit: ['PostJson', 'purchase-order-pay/audit'], // 采购订单收款明细列表
        createAudit: ['PostJson', 'purchase-order/create-audit'], // 售后采购单创建审核
        delete: ['PostJson', 'purchase-order-pay/delete'], // 采购订单收款明细列表
        itemByIdList: ['PostJson', 'purchase-order-item/list-by-item-id'], // 采购订单明细列表
        payment: ['PostJson', 'purchase-order/payment'], // 支付订单
        outStock: ['PostJson', 'purchase-order/out-stock'], // 订单发货
        deliver: ['PostJson', 'purchase-order/deliver'], // 订单发货

        // takeDelivery: ['PostJson', 'purchase-order/take-delivery'], // 订单发货
        takeDeliver: ['PostJson', 'purchase-order/take-deliver'], // 确认收货
        review: ['PostJson', 'purchase-order/review'], // 评论
        statusList: ['PostJson', 'purchase-order/status-list'], // 保存
        recreate: ['PostJson', 'purchase-order/recreate'], // 再来一单
        transfer: ['PostJson', 'purchase-order/transfer'], // 转单

        revise: ['PostJson', 'purchase-order/revise'], // 已下单的订单-编辑商品
        reviseAudit: ['PostJson', 'purchase-order/revise-audit'], // 已下单的订单-编辑商品-审核

        createGiveaway: ['PostJson', 'purchase-order/create-giveaway'], // 已下单的订单-编辑商品-审核
        updatePI: ['PostJson', 'purchase-order/update-pi'], // 修改pi
        // 平台方增加功能请求-手动同步u8--同步erp
        erpPush: ['PostJson', 'erp/purchase-order/push'], // 同步erp  待生产-》生产中
    },
    Aftersales: {
        // 售后单
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
    AftersalesItem: {
        // 售后单明细
        list: ['PostJson', 'after-sales-order-item/list'],
        save: ['PostJson', 'after-sales-order-item/save-list'], //批量修改
        edit: ['PostJson', 'after-sales-order-item/save'], //单个修改
        detail: ['PostJson', 'after-sales-order-item/detail'],
        delete: ['PostJson', 'after-sales-order-item/delete'],
    },
    Refund: {
        // 退款管理
        list: ['PostJson', 'order-refund-record/list'],
        create: ['PostJson', 'order-refund-record/create'],
        detail: ['PostJson', 'order-refund-record/detail'],
        update: ['PostJson', 'order-refund-record/update'],
        audit: ['PostJson', 'order-refund-record/audit'],
        cancel: ['PostJson', 'order-refund-record/cancel'],
        status: ['PostJson', 'order-refund-record/status-list'], // 状态
        handle: ['PostJson', 'order-refund-record/handle'],
    },
    Store: {
        // 门店管理
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
    Notice: {
        // 系统消息
        list: ['PostJson', 'sys-message/list'],
        save: ['PostJson', 'sys-message/save'],
        detail: ['PostJson', 'sys-message/detail'],
        delete: ['PostJson', 'sys-message/delete'],
    },
    ActionLog: {
        // 维修单 操作记录
        list: ['PostJson', 'action-log/list'],
        content: ['PostJson', 'action-log/content'],
    },
    Waybill: {
        // 物流
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
        detailByUidNoException: ['PostJson', 'waybill/detail-by-uid-no-exception'],
    },
    Distributor: {
        // 分销商
        list: ['PostJson', 'distributor/list'],
        save: ['PostJson', 'distributor/save'],
        listAll: ['PostJson', 'distributor/list-name'], //选择用的 名称列表 无分页
        detail: ['PostJson', 'distributor/detail'],
        detailUpdate: ['PostJson', 'distributor/detail-update'],
        updateStatus: ['PostJson', 'distributor/update-status'], //修改状态
        walletMoneyList: ['PostJson', 'wallet-money/list'], //钱包余额明细列表
        walletDetail: ['PostJson', 'wallet/detail'], //钱包详情
    },
    Fault: {
        // 产品故障管理
        list: ['PostJson', 'item-fault/list'],
        save: ['PostJson', 'item-fault/save'],
        detail: ['PostJson', 'item-fault/detail'],
        delete: ['PostJson', 'item-fault/delete'],
    },
    FaultEntity: {
        // 故障件管理
        audit: ['PostJson', 'fault-entity/audit'],
        delete: ['PostJson', 'fault-entity/delete'],
        detail: ['PostJson', 'fault-entity/detail'],
        detailByUid: ['PostJson', 'fault-entity/detail-by-uid'],
        list: ['PostJson', 'fault-entity/list'],
        save: ['PostJson', 'fault-entity/save'],
        batchAudit: ['PostJson', 'fault-entity/batch-audit'], // 批量审核
        batchRecycle: ['PostJson', 'fault-entity/batch-recycle'], // 批量入库
    },
    System: {
        // 系统管理
        fileList: ['PostJson', 'sys-file/list'], // 系统文件管理
        fileSave: ['PostJson', 'sys-file/save'],
        fileDetail: ['PostJson', 'sys-file/detail'],
        fileDelete: ['PostJson', 'sys-file/delete'],
    },

    Attachment: {
        // 附件管理
        list: ['PostJson', 'attachment/list'],
        save: ['PostJson', 'attachment/save'],
        saveList: ['PostJson', 'attachment/save-list'],
        delete: ['PostJson', 'attachment/delete'],
    },
    Wallet: {
        // 账户管理
        list: ['PostJson', 'wallet/list'],
        get: ['PostJson', 'wallet/get'],
        detail: ['PostJson', 'wallet/detail'],
        update: ['PostJson', 'wallet/update-balance'],
        walletDetail: ['PostJson', 'wallet-money/detail'],
        walletList: ['PostJson', 'wallet-money/list'],
    },
    // 生产管理
    ProductionOrder: {
        // 生产单
        list: ['PostJson', 'production-order/list'],
        save: ['PostJson', 'production-order/save'],
        detail: ['PostJson', 'production-order/detail'],
        detailByUid: ['PostJson', 'production-order/detail-by-uid'],
        cancel: ['PostJson', 'production-order/cancel'],
        calculateAmount: ['PostJson', 'production-order/calculate-production-amount'], //根据bom和仓库计算生产数量
        vehicleAdd: ['PostJson', 'production-order/vehicle-add'],
        inspectionList: ['PostJson', 'mes-quality-inspect/finished-list'], // 整车完检列表
        incomingInspectionList: ['PostJson', 'material-arrival-quality-inspection-order/list'], // 来料检验列表
    },
    Material: {
        // 物料
        save: ['PostJson', 'material/save'],
        delete: ['PostJson', 'material/delete'],
        list: ['PostJson', 'material/list'],
        detail: ['PostJson', 'material/detail'],
        price: ['PostJson', 'material/set-supplier-material-price'],
    },
    MaterialCategory: {
        // 物料分类
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
    Bom: {
        // bom表
        list: ['PostJson', 'bom/list'],
        listAll: ['PostJson', 'bom/list-name'],
        save: ['PostJson', 'bom/save'],
        detail: ['PostJson', 'bom/detail'],
        delete: ['PostJson', 'bom/delete'],
        detailByItemId: ['PostJson', 'bom/detail-by-item-id'],
        invoiceBom: ['PostJson', 'bom/create-invoice-of-bom'], //根据bom生成领料单
    },
    BomItem: {
        // bom明细
        save: ['PostJson', 'bom-item/save'],
        batchSave: ['PostJson', 'bom-item/batch-add'],
        list: ['PostJson', 'bom-item/list'],
        listAll: ['PostJson', 'bom-item/list-all'],
        delete: ['PostJson', 'bom-item/delete'],
        batchDelete: ['PostJson', 'bom-item/batch-delete'],
        deleteByEditTime: ['PostJson', 'bom-item/delete-by-edit-time'],
    },
    ReceiveAddress: {
        //收货地址管理
        list: ['PostJson', 'receive-info/list'],
        save: ['PostJson', 'receive-info/save'],
        detail: ['PostJson', 'receive-info/detail'],
        delete: ['PostJson', 'receive-info/delete'],
    },
    Supplier: {
        //供应商
        list: ['PostJson', 'supplier/list'],
        save: ['PostJson', 'supplier/save'],
        detail: ['PostJson', 'supplier/detail'],
        delete: ['PostJson', 'supplier/delete'],
        listAll: ['PostJson', 'supplier/list-name'],
        bomList: ['PostJson', 'supplier/bom/list'], // bom列表
        updateName: ['PostJson', 'supplier/bom/update-name'], // 修改bom名称
        listVersion: ['PostJson', 'supplier/bom/list-version'], // bom版本列表
        bomItemList: ['PostJson', 'supplier/bom-item/list'], // BomItem列表
        bomLogSave: ['PostJson', 'supplier/bom-log/save'], // 修改价格
        bomLogList: ['PostJson', 'supplier/bom-log/list'], // 价格变化记录
        updateRemark: ['PostJson', 'supplier/update-remark'], // 更新备注
    },
    SupplierItem: {
        //供应商物料管理
        list: ['PostJson', 'supplier-material/list'],
        save: ['PostJson', 'supplier-material/save'],
        batchSave: ['PostJson', 'supplier-material/batch-save'],
        detail: ['PostJson', 'supplier-material/detail'],
        delete: ['PostJson', 'supplier-material/delete-material'],
    },
    MaterialPurchase: {
        //物料采购单
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
        stock: ['PostJson', 'material-purchase-order/save-to-invoice'], //入库
    },
    WarehouseTransfer: {
        //物料调货单
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
        stock: ['PostJson', 'warehouse-transfer-order/save-to-invoice'], //入库
        detailByUid: ['PostJson', 'warehouse-transfer-order/detail-by-sn'], //入库
    },
    Feedback: {
        //质量反馈单
        list: ['PostJson', 'feedback/list'], //
        statusList: ['PostJson', 'feedback/status-list'], //
        create: ['PostJson', 'feedback/create'], //
        update: ['PostJson', 'feedback/update'], //
        detail: ['PostJson', 'feedback/detail'], //
        detailByUid: ['PostJson', 'feedback/detail-by-uid'], //
        delete: ['PostJson', 'feedback/delete'], //删除
        audit: ['PostJson', 'feedback/audit'], //审核
        submit: ['PostJson', 'feedback/submit'], //提交
        feedback: ['PostJson', 'feedback/feedback'], //
        afterSalesDesc: ['PostJson', 'feedback/after-sales-desc'], //
        saveTitle: ['PostJson', 'feedback/save-title'], //
        content: ['PostJson', 'feedback/content'], //
    },
    FeedbackItem: {
        // 维修单
        saveList: ['PostJson', 'quality-feedback-item/save-list'], // 列表
        list: ['PostJson', 'quality-feedback-item/list'], // 列表
        faultList: ['PostJson', 'quality-feedback-item/fault-list'], // 列表
    },
    AuditRecord: {
        //审核流程单
        list: ['PostJson', 'audit-record/list'], //
    },
    PrintTemplate: {
        //审核流程单
        list: ['PostJson', 'print-template/list'], //
        save: ['PostJson', 'print-template/save'], //
        delete: ['PostJson', 'print-template/delete'], //
    },
    Dept: {
        // EOS部门
        // tree: ['PostJson', 'dept/tree'],
        list: ['PostJson', 'dept/list'],
        save: ['PostJson', 'dept/save'],
        detail: ['PostJson', 'dept/detail'],
        delete: ['PostJson', 'dept/delete'],
    },
    CRMGroup: {
        // CRM分组
        // tree: ['PostJson', 'crm-group/tree'],
        list: ['PostJson', 'crm-group/list'],
        save: ['PostJson', 'crm-group/save'],
        detail: ['PostJson', 'crm-group/detail'],
        delete: ['PostJson', 'crm-group/delete'],
        batchAddMember: ['PostJson', 'crm-group/batch-add-member'],
        getGroupAdmin: ['PostJson', 'crm-group/get-group-admin'],
    },
    CRMGroupMember: {
        save: ['PostJson', 'crm-group-member/save'], //
        list: ['PostJson', 'crm-group-member/list'], //
        delete: ['PostJson', 'crm-group-member/delete'], //
        detail: ['PostJson', 'crm-group-member/detail'], //
        structure: ['PostJson', 'crm-group-member/structure'], //
        structureByUser: ['PostJson', 'crm-group-member/structure-by-user'], //
        structureByUserGroup: ['PostJson', 'crm-group-member/structure-by-user-group'], //

        users: ['PostJson', 'crm-group-member/users'], //
        setAdmin: ['PostJson', 'crm-group-member/set-admin'],
    },
    CRMCustomer: {
        //CRM 客户
        save: ['PostJson', 'crm-customer/save'], //
        list: ['PostJson', 'crm-customer/list'], //
        delete: ['PostJson', 'crm-customer/delete'], //
        detail: ['PostJson', 'crm-customer/detail'], //
        obtain: ['PostJson', 'crm-customer/obtain'], //
        distribute: ['PostJson', 'crm-customer/distribute'], //
        returnPool: ['PostJson', 'crm-customer/return-pool'], //
        transfer: ['PostJson', 'crm-customer/transfer'], //
        checking: ['PostJson', 'crm-customer/checking'], //

        batchGroup: ['PostJson', 'crm-customer/batch-group'],
        batchDelete: ['PostJson', 'crm-customer/batch-delete'],
        batchObtain: ['PostJson', 'crm-customer/batch-obtain'],
        batchDistribute: ['PostJson', 'crm-customer/batch-distribute'],
        batchReturnPool: ['PostJson', 'crm-customer/batch-return-pool'],
        batchTransfer: ['PostJson', 'crm-customer/batch-transfer'],
        checkPhone: ['PostJson', 'crm-customer/check-phone'],
        checkEmail: ['PostJson', 'crm-customer/check-email'],
        toDoList: ['PostJson', 'crm-customer/to-do-list'],
    },
    CRMBo: {
        //CRM 商机
        save: ['PostJson', 'crm-bo/save'], //
        list: ['PostJson', 'crm-bo/list'], //
        delete: ['PostJson', 'crm-bo/delete'], //
        detail: ['PostJson', 'crm-bo/detail'], //
        transfer: ['PostJson', 'crm-bo/transfer'], //
        updateStatus: ['PostJson', 'crm-bo/update-status'],
        success: ['PostJson', 'crm-bo/success'],
        fail: ['PostJson', 'crm-bo/fail'],
        reactivation: ['PostJson', 'crm-bo/reactivation'],
        batchTransfer: ['PostJson', 'crm-bo/batch-transfer'],
        batchDelete: ['PostJson', 'crm-bo/batch-delete'],
        toDoList: ['PostJson', 'crm-bo/to-do-list'],
    },
    CRMOrderIncome: {
        //CRM 回款单
        save: ['PostJson', 'crm-order-income/save'], //
        list: ['PostJson', 'crm-order-income/list'], //
        delete: ['PostJson', 'crm-order-income/delete'], //
        detail: ['PostJson', 'crm-order-income/detail'], //
        createUser: ['PostJson', 'crm-order-income/join-create-user-list'], // 搜索条件-创建人列表
        audit: ['PostJson', 'crm-order-income/audit'], // 审核
    },
    CRMRefundRecord: {
        save: ['PostJson', 'crm-refund-record/save'], //
        list: ['PostJson', 'crm-refund-record/list'], //
        delete: ['PostJson', 'crm-refund-record/delete'], //
    },

    CRMTrackMember: {
        //CRM 团队成员
        save: ['PostJson', 'crm-track-member/save'], //
        list: ['PostJson', 'crm-track-member/list'], //
        delete: ['PostJson', 'crm-track-member/delete'], //
        batchSave: ['PostJson', 'crm-track-member/batch-save'], //
        getTargetByUserId: ['PostJson', 'crm-track-member/get-target-by-user-id'], //
        savePermissions: ['PostJson', 'crm-track-member/save-permissions'], //
        joinUserList: ['PostJson', 'crm-track-member/join-user-list'], // 负责人列表
    },
    CRMLabel: {
        //CRM 标签
        save: ['PostJson', 'crm-label/save'], //
        list: ['PostJson', 'crm-label/list'], //
        delete: ['PostJson', 'crm-label/delete'], //
        batchSave: ['PostJson', 'crm-label/batch-save'], //
        detail: ['PostJson', 'crm-label/detail'], //
        change: ['PostJson', 'crm-label/change'], //
    },
    CRMTrackRecord: {
        //CRM跟进记录
        save: ['PostJson', 'crm-track-record/save'], //
        list: ['PostJson', 'crm-track-record/list'], //
        delete: ['PostJson', 'crm-track-record/delete'], //
        detail: ['PostJson', 'crm-track-record/detail'], //
    },
    CRMOrder: {
        // CRM合同订单
        save: ['PostJson', 'crm-order/save'], //新增/修改
        list: ['PostJson', 'crm-order/list'], //列表
        delete: ['PostJson', 'crm-order/delete'], // 删除
        detail: ['PostJson', 'crm-order/detail'], // 详情
        batchDelete: ['PostJson', 'crm-order/batch-delete'], // 批量删除
        createUser: ['PostJson', 'crm-order/join-create-user-list'], // 搜索条件-创建人列表
        audit: ['PostJson', 'crm-order/audit'], // 审核
        reactivation: ['PostJson', 'crm-order/reactivation'], // 审核未通过，修改后再次提交从头审核
        batchTransfer: ['PostJson', 'crm-order/batch-transfer'],
        saveAddress: ['PostJson', 'crm-order/save-address'], //新增/修改
    },
    CRMItemBind: {
        //CRM销售信息
        save: ['PostJson', 'crm-item-bind/save'], //新增/修改
        list: ['PostJson', 'crm-item-bind/list'], //列表
        delete: ['PostJson', 'crm-item-bind/delete'], //删除
        detail: ['PostJson', 'crm-item-bind/detail'], //详情
    },
    CRMBoStatusGroup: {
        //CRM 阶段
        save: ['PostJson', 'crm-bo-status-group/save'], //
        list: ['PostJson', 'crm-bo-status-group/list'], //
        delete: ['PostJson', 'crm-bo-status-group/delete'], //
        detail: ['PostJson', 'crm-bo-status-group/detail'], //
    },
    CrmContactBind: {
        //CRM联系人绑定
        save: ['PostJson', 'crm-contact-bind/save'], //
        list: ['PostJson', 'crm-contact-bind/list'], //
        delete: ['PostJson', 'crm-contact-bind/delete'], //
        detail: ['PostJson', 'crm-contact-bind/detail'], //
        batchSave: ['PostJson', 'crm-contact-bind/batch-save'], //
    },
    CrmActionRecord: {
        //CRM联系人绑定
        list: ['PostJson', 'crm-action-record/list'], //
    },
    CRMDict: {
        //CRM数据字典
        save: ['PostJson', 'crm-dict/save'], //
        list: ['PostJson', 'crm-dict/list'], //
        delete: ['PostJson', 'crm-dict/delete'], //
        detail: ['PostJson', 'crm-dict/detail'], //
        change: ['PostJson', 'crm-dict/change'], //
    },
    CRMLabelBind: {
        list: ['PostJson', 'crm-label-bind/list'], //
        save: ['PostJson', 'crm-label-bind/save'], //
        saveList: ['PostJson', 'crm-label-bind/save-list'], //
        delete: ['PostJson', 'crm-label-bind/delete'], //
        labelList: ['PostJson', 'crm-label-bind/label-list'], //
    },
    CRMTestDriveOrder: {
        save: ['PostJson', 'crm-test-drive-order/save'], //
        list: ['PostJson', 'crm-test-drive-order/list'], //
        delete: ['PostJson', 'crm-test-drive-order/delete'], //
        detail: ['PostJson', 'crm-test-drive-order/detail'], //
    },
    CRMCustomerPortrait: {
        //CRM 客户画像
        save: ['PostJson', 'crm-customer-portrait/save'], //
        list: ['PostJson', 'crm-customer-portrait/list'], //
        delete: ['PostJson', 'crm-customer-portrait/delete'], //
        detail: ['PostJson', 'crm-customer-portrait/detail'], //
        detailCustomerId: ['PostJson', 'crm-customer-portrait/detail-customer-id'], //
    },

    CRMDashboard: {
        salesStatistics: ['PostJson', 'crm-dashboard/sales-statistics'], // 销售简报
        trackStatistics: ['PostJson', 'crm-dashboard/track-statistics'], // 跟进统计
        boStatistics: ['PostJson', 'crm-dashboard/bo-statistics'], // 商机统计
        purchaseIntentStatistics: ['PostJson', 'crm-dashboard/purchase-intent-statistics'], // 商机统计
        testDriveIntentStatistics: ['PostJson', 'crm-dashboard/test-drive-intent-statistics'], // 商机统计
        performanceList: ['PostJson', 'crm-dashboard/performance-list'], // 业绩榜单
        customerStatistics: ['PostJson', 'crm-dashboard/customer-statistics'], // 客户来源分布
        carTotalStatistics: ['PostJson', 'crm-dashboard/car-total-statistics'], // 个人 - 销售简报
        customerTotalStatistics: ['PostJson', 'crm-dashboard/customer-total-statistics'], // 个人 - 销售简报
        transformationStatistics: ['PostJson', 'crm-dashboard/transformation-statistics'], // 转化分析
        employeesSalesStatistics: ['PostJson', 'crm-dashboard/employees-sales-statistics'], // 个人 - 销售简报
    },

    TestReport: {
        // 测试报告
        list: ['PostJson', 'report/list'],
        detail: ['PostJson', 'report/detail'],
    },
    MoneyChange: {
        switch: ['PostJson', 'crm-order/switch-currency'],
    },
    Inventory: {
        list: ['PostJson', 'inventory/list'], // 存货列表
        save: ['PostJson', 'inventory/save'], // 新增存货档案
        detail: ['PostJson', 'inventory/detail'], // 存货档案详情
        delete: ['PostJson', 'inventory/delete'], // 删除存货档案
    },
    // CRM 试驾单
    CRMTESTDRIVE: {
        userEmail: ['PostJson', 'crm-test-drive-order/reset-email-to-user'],
        storeEmail: ['PostJson', 'crm-test-drive-order/reset-email-to-store'],
    },
    // 数据看板
    DashBoard: {
        orderCount: ['PostJson', 'data-board/statistics'],
        purchaseOrder: ['PostJson', 'data-board/purchase-order'],
        repairOrder: ['PostJson', 'data-board/repair-order'],
        repairRank: ['PostJson', 'data-board/fault_rank'],
    },
    // 三包
    Warranty: {
        saveTime: ['PostJson', 'warranty-config/save/effect-time'], // 设置三包生效时间
        categoryList: ['PostJson', 'warranty-config/list/category'], // 根据商品分类展示列表
        warrantyConfigSave: ['PostJson', 'warranty-config/save'], // 三包管理的新增或修改
        itemList: ['PostJson', 'warranty-config/list/item'], // 根据商品列表展示列表
        updateLogList: ['PostJson', 'warranty-config/list/update-log'], // 查询三包管理变更记录
        getTimeDetail: ['PostJson', 'warranty-config/get/effect-time'], // 获取三包设置生效时间详情
    },
    // 投票统计
    VoteData: {
        getActivityId: ['PostJson', 'vote/activity/current'], // get 活动Id
        cityStatistics: ['PostJson', 'vote/activity/statistics/city'], // 投票城市统计
        sourceStatistics: ['PostJson', 'vote/activity/statistics/source'], // 投票来源统计
        numberStatistics: ['PostJson', 'vote/activity/statistics/number'], // 投票数量统计
        resultStatistics: ['PostJson', 'vote/activity/statistics/result'], // 投票结果统计
    },
    // 国内零售模块 【零售相关的接口都得放这里面, 调用的接口前缀是 crm/1/.........】
    RETAIL: {
        // 门店管理接口
        storeList: ['PostJson', 'store/list'], // 门店-门店列表
        editStore: ['PostJson', 'store/save'], // 编辑-创建门店
        deleteStore: ['PostJson', 'store/delete'], // 删除-门店
        storeDetail: ['Get', 'store/detail'], // 门店-详情
        storeUserList: ['PostJson', 'store/user/list'], // 门店-人员（获取）
        addStoreUser: ['PostJson', 'store/user/add'], // 门店-添加人员
        deleteStoreUser: ['PostJson', 'store/user/delete'], // 门店-添加人员
        // 区域管理接口
        regionsList: ['PostJson', 'group/city/list'], // 门店-区域列表/crm/1/store/list
        deleteRegion: ['PostJson', 'group/city/delete'], // 删除区域
        detailRegion: ['Get', 'group/city/detail'], // 区域-详情
        saveRegion: ['PostJson', 'group/city/save'], // 区域-更新
        // 人员管理接口
        personList: ['PostJson', 'user/list'], // 人员列表（添加店长可用）
        deletePersonList: ['PostJson', 'user/delete'], // 删除人员
        externalList: ['PostJson', 'out/user/list'], // 人员列表(外部【飞书】)
        addPerson: ['PostJson', 'out/user/save'], // 添加人员(外部【飞书】)
        personDetail: ['Get', 'store/user/detail'], // 人员信息详情
        personUpdate: ['PostJson', 'store/user/save'], // 人员信息更新

        // 车辆管理接口
        // 订单管理接口
    },
    // crm 好物订单接口
    GoodItemsOrder: {
        orderList: ['PostJson', 'app-order/list'], // 订单列表
        orderDetail: ['PostJson', 'app-order/detail'], // 订单详情
        updateTrackingNumber: ['PostJson', 'app-waybill/save'], // 更新快递单号
        logisticsRecords: ['PostJson', 'app-waybill-log/list'], // 物流信息修改记录
        statusCount: ['PostJson', 'app-order/count'], // 订单状态数量统计
        seePhone: ['PostJson', 'app-order/show-phone'], // 查看手机号
        wayillDetail: ['PostJson', 'app-waybill/detail'], // 物流详情
    },
    CustomService: {
        list: ['PostJson', 'customer-service/customer/list'],
        amountList: ['PostJson', 'customer-service/home/my-task/amount-list'], // 我的任务- 已处理/全部 数量
        detail: ['PostJson', 'customer-service/customer/detail'], // 用户线索详情
        deleteLabel: ['PostJson', 'customer-service/label-bind/delete'],
        updateLabel: ['PostJson', 'customer-service/label-bind/batch-update'],
        storeList: ['PostJson', 'customer-service/store/list-name'], // 门店列表
        groupList: ['PostJson', 'customer-service/group/list-name'], // 大区列表
        bindList: ['PostJson', 'customer-service/customer-store-user-bind/list'],
        getTestDriveList: ['PostJson', 'customer-service/crm-test-drive-order/list'], // 试驾单list
        getLogList: ['PostJson', 'customer-service/action-log/list'], // 日志list

        trackRecordList: ['PostJson', 'customer-service/track-record/list'], // 跟进记录-列表
        createRecord: ['PostJson', 'customer-service/track-record/save'], //创建跟进记录
        createTrack: ['PostJson', 'customer-service/track-record/save-task'], //创建任务记录
        cancelTrack: ['PostJson', 'customer-service/track-record/cancel-task'], //创建任务记录
        storeUserList: ['PostJson', 'customer-service/store-user/list'], // 店员列表
        upDateTransfer: ['PostJson', 'customer-service/customer/update-store-user-transfer'], // 线索转移
        getCityList: ['GetJson', 'customer-service/group/cityList'], // 城市列表(根据大区)

        editIsTop: ['PostJson', 'customer-service/customer/editIsTop'],
        createOrder: ['PostJson', 'customer-service/crm-order/create'],
        orderDetail: ['PostJson', 'customer-service/crm-order/detail'],
        orderList: ['PostJson', 'customer-service/crm-order/list'],
        pushApp: ['GetJson', 'customer-service/crm-order/push-app'],
        orderUpdate: ['PostJson', 'customer-service/crm-order/update'],
        logList: ['PostJson', 'customer-service/action-log/list'],

        getAllocationList: ['PostJson', 'customer-service/user/list'], // 客服-线索-分配list
        setAllocation: ['PostJson', 'customer-service/user/set-system-assign-rate'], // 客服-线索-设置系统分配比例
        editUser: ['PostJson', 'customer-service/customer/save'], // 编辑用户线索
        verifyPhoneAndEmail: ['PostJson', 'customer-service/customer/verifyPhoneAndEmail'], // 验证手机号 / 邮箱号
    },
    // COC模块
    COC: {
        getCocTemplateList: ['PostJson', 'coc-template/list'], // 获取模板列表
        addCocTemplate: ['PostJson', 'coc-template/save'], // 添加模板
        viewCocTemplate: ['PostJson', 'coc-template/detail'], // 查看模板
        deleteCocTemplate: ['PostJson', 'coc-template/delete'], // 删除模板
        getCateGoryList: ['PostJson', 'item/list-vehicle-item-name'], // 车型名称
        getCertificateList: ['PostJson', 'coc-certificate/list'], // 证书列表
        getCertificateDetailList: ['PostJson', 'coc-certificate/detail/list'], // 证书清单列表
        downLoadCertificateDetailLis: ['BlobPost', 'coc-certificate/download'], // 证书清单列表下载
        setCertificateVisible: ['PostJson', 'coc-certificate/set-visibility'], // 设置证书可见
        getCertificatNumber: ['PostJson', 'coc-certificate/detail/statistics'], // 获取证书编号
        regenerateFile: ['PostJson', '/coc-certificate/regenerate-file'], // 重新生成文件
    },
    // 用户中心
    USER_CENTER: {
        getClueList: ['PostJson', 'user-center/clue/list'], // 线索ist
        distributionStore: ['PostJson', 'user-center/update-store-transfer'], // 分配门店
    },
    // 邮箱订阅状态
    EMAIL_SUBSCRIPTION: {
        list: ['PostJson', 'crm-customer/list'], // 列表
    },

    // 邮件模板接口
    MAIL_MANAGEMENT: {
        add: ['PostJson', 'email-task/save'],
        detail: ['PostJson', 'email-task/detail'],
        list: ['PostJson', 'email-task/list'],
        delete: ['PostJson', 'email-task/delete'],
        scheduleEmail: ['PostJson', 'email/schedule-email'],
        memberList: ['PostJson', 'email/member-list'],
    },

    ITEM_BOM: {
        listName: ['PostJson', 'aftermarket/bom/list-name'], // 产品名称列表
        versionList: ['PostJson', 'aftermarket/bom/list-version'], // 版本列表
        listCategory: ['PostJson', 'aftermarket/bom/list-category'], // 分类列表
        partsList: ['PostJson', 'aftermarket/bom/list-parts'], // 配件list
        saveOrEdit: ['PostJson', 'item/item-component-set-save'], // 新增编辑爆炸图
        getExplosionImg: ['PostJson', 'item/item-component-set-list'], // 爆炸图list
        editPoint: ['PostJson', 'item/bind-item-component'], // 编辑点位
        updateName: ['PostJson', 'aftermarket/bom/update-name'], // 编辑Bom商品名称
        saveCategoryName: ['PostJson', 'bom-category/save'], // 新增编辑分类
        deleteCategory: ['PostJson', 'bom-category/delete'], // 删除分类
        changeBomList: ['PostJson', 'bom-log/list'], // bom设变列表
        changeCount: ['PostJson', 'bom-log/count-by-type'], // bom设变统计
        bindCategory: ['PostJson', 'aftermarket/bom/bind-category'], // 给Bom商品绑定分类 （覆盖）
        addBindCategory: ['PostJson', 'aftermarket/bom/add-bind-category'], // 给Bom商品添加（不覆盖）-绑定分类
        parsingImportFile: ['PostJson', 'aftermarket/bom/parsing-import-file'], // 二级页面解析导入表格情况返回
        importBindBomItem: ['PostJson', 'aftermarket/bom/import-bind-bom-item'], // 保存导入成功表格情况返回
    },
    // 供应商接口
    SUPPLY: {
        adminList: ['PostJson', 'supplier-application/list'], // 平台方供应商管理list
        adminDetail: ['PostJson', 'supplier-application/detail'], // 平台方供应商管理详情
        adminAdd: ['PostJson', 'supplier-application/save'], // 平台方供应商管理添加
        add: ['PostJson', 'supplier-application/save'], // 供应商前缀 /supplier
        countStatus: ['PostJson', 'supplier-application/count-status'], // 供应商前缀 /supplier
        // 特批为合格供应商
        batchUpdateStage: ['PostJson', 'supplier-application/batch-update-stage'], // 供应商前缀 /supplier
        // 审核
        audit: ['PostJson', 'supplier-application/audit'], // 供应商前缀 /supplier
        // 免审审核详情
        noExamineDetail: ['PostJson', 'supplier-application/no-examine-application-detail'], // 供应商前缀 /supplier
        // 免审申请
        noExamine: ['PostJson', 'supplier-application/no-examine-application'], // 供应商前缀 /supplier
        // 获取淘汰原因
        getEliminateReason: ['PostJson', 'supplier-application/get-eliminate-reason'], // 供应商前缀 /supplier
    },
    SALES_STRATEGY: {
        list: ['PostJson', 'sales-strategy/list'],
        add: ['PostJson', 'sales-strategy/create'],
        disable: ['PostJson', 'sales-strategy/disable'],
        enable: ['PostJson', 'sales-strategy/enable'],
        delete: ['PostJson', 'sales-strategy/delete'],
        update: ['PostJson', 'sales-strategy/update'],
        detail: ['PostJson', 'sales-strategy/detail'],
    },
    DISTRIBUTOR_HOME: {
        searchList: ['PostJson', 'new/list'], // 分销商首页搜索
    },
    // 官网端接口
    CLIENT: {
        communityList: ['PostJson', 'community-post/list'], //动态列表
    },
    // 问询单
    inquiry_sheet: {
        list: ['PostJson', 'enquiry-ticket/list'], // 列表
        add: ['PostJson', 'enquiry-ticket/create'], // 创建
        modify: ['PostJson', 'enquiry-ticket/update'], // 修改
        detail: ['PostJson', 'enquiry-ticket/detail'], // 详情
        statusList: ['PostJson', 'enquiry-ticket/status-list'], // 状态数据
        sortingType: ['PostJson', 'enquiry-ticket/sorting-type'], // 归类
        bindPart: ['PostJson', 'enquiry-ticket/bind-part'], // 零件
        markResolved: ['PostJson', 'enquiry-ticket/mark-resolved'], // 问题解决接口
        commentList: ['PostJson', 'comment/list'], // 评论
        saveComment: ['PostJson', 'comment/save'], // 新增评论
        // 客服列表
        cusomerList: ['PostJson', 'user/customer-list'], // 客服列表
        // 删除
        deleteCustomer: ['PostJson', 'user/delete-customer-country'], // 删除
        // 添加
        addCustomer: ['PostJson', 'user/save-area'], // 添加
        distributorFindList: ['PostJson', '/distributor/find-list'], // 根据国家和分销售名称查询 账号
    },
    Operation: {
        list: ['PostJson', 'announcement/list'], // 列表
        detail: ['PostJson', 'announcement/detail'], // 详情
        delete: ['PostJson', 'announcement/delete'], // 删除
        save: ['PostJson', 'announcement/save'], // 新增
        updateStatus: ['PostJson', 'announcement/update-status'], // 修改排序和状态
    },
    WarehousingManagement: {
        MaterialPurchaseOrderList: ['PostJson', 'invoice-item/material-purchase-order-list'], // 采购入库单列表
        ProductionOrderList: ['PostJson', 'production-order-item-bind/production-order-list'], // 生产单列表
        ProductionOrderDetail: ['PostJson', 'production-order-item-bind/detail'], // 生产单子件列表
        ProductionOrderItemlist: ['PostJson', 'production-order-item/list'], // 生产单子件列表
    },
    ToBCustomer: {
        list: ['PostJson', 'comment/list'], // crm tob客户列表
    },
    // 获取供应链角色下主管
    SupplierApplication: {
        getAdminList: ['PostJson', 'supplier-application/get-manager'], // 获取供应链角色下主管
        //合作供应商修改
        update: ['PostJson', 'supplier-application/update'],
    },
};

export default new Api(baseUrl, apiList);

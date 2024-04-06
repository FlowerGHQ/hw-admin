const SYSTEM_AUTH = {
    // 模块底下的权限
    AUTH_LIST_TEMP: [
        /**
         * test.oneMange1.bookList.xxx  第一级是模块 第二级别是侧边栏 三级是侧边栏底下 四级是按钮
         * @param(*) list (是渲染列表)
         * @param(*) select 表示之前被选择过了
         * @param(*) key 中英文翻译的头
         */
        // { list: [], select: [], key: 'home', name: '总览' },
        // { list: [], select: [], key: 'data', name: '时效看板' },
        // { list: [], select: [], key: 'distributor', name: '分销商管理' },
        // { list: [], select: [], key: 'agent', name: '零售商管理' },
        // { list: [], select: [], key: 'store', name: '分销管理-门店列表' },
        // { list: [], select: [], key: 'purchase-order', name: '采购订单' },
        // { list: [], select: [], key: 'sales-area', name: '销售区域' },
        // { list: [], select: [], key: 'item', name: '商品管理' },
        // { list: [], select: [], key: 'aftermarket-bom', name: 'BOM管理' },
        // { list: [], select: [], key: 'item-category', name: '商品分类' },
        // { list: [], select: [], key: 'entity', name: '商品实例' },
        // { list: [], select: [], key: 'after-sales-order', name: '售后订单' },
        // { list: [], select: [], key: 'repair-order', name: '维修单' },
        // { list: [], select: [], key: 'quality-feedback', name: '质量反馈' },
        // { list: [], select: [], key: 'fault', name: '故障件' },
        // { list: [], select: [], key: 'account', name: '账户管理' },
        // { list: [], select: [], key: 'customer', name: '客户管理' },
        // { list: [], select: [], key: 'user', name: '用户管理' },
        // { list: [], select: [], key: 'refund', name: '退款' },
        // { list: [], select: [], key: 'warehouse', name: '仓库' },
        // { list: [], select: [], key: 'invoice', name: '出入库单' },
        // { list: [], select: [], key: 'stock', name: '库存总览' },
        // { list: [], select: [], key: 'supplier', name: '供应商' },
        // { list: [], select: [], key: 'transfer', name: '调货单' },
        // { list: [], select: [], key: 'warehouse-transfer-order', name: '仓库调货单' },
        // { list: [], select: [], key: 'material-purchase-order', name: '物料采购单' },
        // { list: [], select: [], key: 'material', name: '物料' },
        // { list: [], select: [], key: 'material-category', name: '物料分类' },
        // { list: [], select: [], key: 'inventory', name: '存货档案' },
        // { list: [], select: [], key: 'inventory-category', name: '存货分类' },
        // { list: [], select: [], key: 'bom', name: 'BOM表' },
        // { list: [], select: [], key: 'production-order', name: '生产单' },
        // { list: [], select: [], key: 'message', name: '消息' },
        // { list: [], select: [], key: 'authority', name: '权限' },
        // { list: [], select: [], key: 'role', name: '角色' },
        // { list: [], select: [], key: 'file', name: '文件' },
        // { list: [], select: [], key: 'crm-customer', name: 'CRM客户' },
        // { list: [], select: [], key: 'crm-bo', name: 'CRM商机' },
        // { list: [], select: [], key: 'crm-bo-status', name: 'CRM商机阶段' },
        // { list: [], select: [], key: 'crm-order', name: 'CRM合同订单' },
        // { list: [], select: [], key: 'crm-order-income', name: 'CRM回款单' },
        // { list: [], select: [], key: 'crm-test-drive', name: 'CRM试驾单' },
        // { list: [], select: [], key: 'crm-label', name: 'CRM标签' },
        // { list: [], select: [], key: 'crm-dict', name: 'CRM数据字典' },
        // { list: [], select: [], key: 'crm-group', name: 'CRM区域' },
        // // 新加的2023/8/14
        // { list: [], select: [], key: 'crm-store', name: '门店管理' },
        // { list: [], select: [], key: 'crm-user', name: '人员管理' },
        // { list: [], select: [], key: 'feishu-data', name: '飞书管理' }, // (需要小程序判断权限(还未接入))
        // // 新加入2023/10/9
        // { list: [], select: [], key: 'coc', name: 'COC证书管理' },
        // { list: [], select: [], key: 'supplier-application', name: '供应商管理' },
        // { list: [], select: [], key: 'sales-strategy', name: '销售策略管理' },
        // // 新加入2024/2/2
        // { list: [], select: [], key: 'enquiry-ticket', name: '问询单列表、客户关怀' },
        // { list: [], select: [], key: 'enquiry-ticket-category', name: '车型分类管理' },
        // { list: [], select: [], key: 'enquiry-ticket-customer', name: '问询单分配' },
        // // 新加入2024/2/18
        // { list: [], select: [], key: 'operate', name: '运营管理' },
        // { list: [], select: [], key: 'staging', name: '工作台' },
        // { list: [], select: [], key: 'user-center', name: '用户中心' },
        // { list: [], select: [], key: 'allocation-rules', name: '分配规则' },
        // { list: [], select: [], key: 'good-goods-order', name: '好物订单' },
        // { list: [], select: [], key: 'email', name: '邮件管理' },

        {
            list: [
                // {
                //     key: "oneMange1",
                //     itemSelect: [], // checkout 选中的
                //     itemCheckAll: [], // list底下所有选中项id
                //     list: [
                //         {
                //             id: 2,
                //             key: "bookList",
                //             list: [
                //                 {
                //                     id: 1,
                //                     key: "edit",
                //                 }
                //             ]
                //         }
                //     ]
                // }
            ],
            select: [],
            key: 'test',
            name: '测试模块',
        },
    ],
    allAuthData: [
        {
            id: 1,
            key: 'test.oneMange1',
            scope_type: 0,
        },
        {
            id: 2,
            key: 'test.oneMange1.bookList',
            scope_type: 3,
        },
        {
            id: 3,
            key: 'test.oneMange1.bookList.edit',
            scope_type: 2,
        },
        {
            id: 4,
            key: 'test.oneMange1.bookList1',
            scope_type: 1,
        },
        {
            id: 5,
            key: 'test.oneMange1.bookList1.delete',
            scope_type: 1,
        },
        
        {
            id: 6,
            key: 'test.oneMange2',
            scope_type: 0,
        },
        {
            id: 7,
            key: 'test.oneMange2.bookList',
            scope_type: 0,
        },
        {
            id: 8,
            key: 'test.oneMange2.bookList.edit',
            scope_type: 1,
        },
        {
            id: 9,
            key: 'test.oneMange2.bookList1',
            scope_type: 1,
        },
        {
            id: 10,
            key: 'test.oneMange2.bookList1.delete',
            scope_type: 0,
        },
    ],
    RoleData: [
        {
            id: 1,
            key: 'test.oneMange1',
        },
        {
            id: 2,
            key: 'test.oneMange1.bookList',
        },
        {
            id: 3,
            key: 'test.oneMange1.bookList.edit',
        },
        {
            id: 4,
            key: 'test.oneMange1.bookList1',
        },
        // {
        //     id: 5,
        //     key: 'test.oneMange1.bookList1.delete',
        // },
    ],
    // 禁用的数据
    disableData: [
        {
            id: 3,
            key: 'test.oneMange1.bookList.edit',
        }, 
    ]
};

export default SYSTEM_AUTH;

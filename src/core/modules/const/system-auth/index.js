let ROUTER_TYPE = {
    SALES: 1, // 销售
    AFTER: 2, // 售后
    PRODUCTION: 3, // 生产
    CRM: 4, // CRM
    SUPPLIER: 5, // 供应商
    SYSTEM: 6, // 系统管理
} 
const ROUTER_TYPE_MAP = {
    1: { KEY: 'sales', VALUE: 1 },
    2: { KEY: 'aftermarket', VALUE: 2 },
    3: { KEY: 'production', VALUE: 3 },
    4: { KEY: 'crm', VALUE: 4 },
    5: { KEY: 'supply', VALUE: 5 },
    6: { KEY: 'sys', VALUE: 6 },       
}  

const SYSTEM_AUTH = {
    ROUTER_TYPE,
    ROUTER_TYPE_MAP,
    // 模块底下的权限
    AUTH_LIST_TEMP: [
        /**
         * test.oneMange1.bookList.xxx  第一级是模块 第二级别是侧边栏 三级是侧边栏底下 四级是按钮
         * @param(*) list (是渲染列表)
         * @param(*) select 表示之前被选择过了
         * @param(*) key 中英文翻译的头
         * @param(*) name 无用标识
         */
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
            templateSelect: [], // 当前模块是否被选中了
            key: ROUTER_TYPE_MAP[ROUTER_TYPE.SALES].KEY, // 销售
            name: '销售',
            tab: ROUTER_TYPE.SALES,
        },
        {
            list: [],
            select: [],
            templateSelect: [], // 当前模块是否被选中了
            key: ROUTER_TYPE_MAP[ROUTER_TYPE.AFTER].KEY, // 售后
            name: '售后',
            tab: ROUTER_TYPE.AFTER,
        },
        {
            list: [],
            select: [],
            templateSelect: [], // 当前模块是否被选中了
            key: ROUTER_TYPE_MAP[ROUTER_TYPE.PRODUCTION].KEY, // 生产
            name: '生产',
            tab: ROUTER_TYPE.PRODUCTION,
        },
        {
            list: [],
            select: [], // CRM
            templateSelect: [], // 当前模块是否被选中了
            key: ROUTER_TYPE_MAP[ROUTER_TYPE.CRM].KEY,
            name: 'CRM',
            tab: ROUTER_TYPE.CRM,
        },
        {
            list: [],
            select: [],
            templateSelect: [], // 当前模块是否被选中了
            key: ROUTER_TYPE_MAP[ROUTER_TYPE.SUPPLIER].KEY,  // 供应链
            name: '供应链',
            tab: ROUTER_TYPE.SUPPLIER,
        },
        {
            list: [],
            select: [],
            templateSelect: [], // 当前模块是否被选中了
            key: ROUTER_TYPE_MAP[ROUTER_TYPE.SYSTEM].KEY,  // 系统管理
            name: '系统管理',
            tab: ROUTER_TYPE.SYSTEM,
        },
        {
            list: [],
            select: [],
            templateSelect: [], // 当前模块是否被选中了
            key: 'finance', // 财务
            name: '财务',
            tab: 7,
        },
        {
            list: [],
            select: [],
            templateSelect: [], // 当前模块是否被选中了
            key: 'invoice', // 仓储
            name: '仓储',
            tab: 8,
        },
    ],
};

export default SYSTEM_AUTH;

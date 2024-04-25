import Util from '../../../utils'
let ROUTER_TYPE = {
    SALES: 1, // 销售
    AFTER: 2, // 售后
    PRODUCTION: 3, // 生产
    CRM: 4, // CRM
    SUPPLIER: 5, // 供应商
    SYSTEM: 6, // 系统管理
    WAREHOUSING: 8, // 仓储
} 
/**
 * ISMANAGER 是否管理员就能看到这个路由
*/
const ROUTER_TYPE_MAP = {
    1: { KEY: 'sales', VALUE: 1 },
    2: { KEY: 'aftermarket', VALUE: 2 },
    3: { KEY: 'production', VALUE: 3 },
    4: { KEY: 'crm', VALUE: 4 },
    5: { KEY: 'supply', VALUE: 5 },
    6: { KEY: 'sys', VALUE: 6, ISMANAGER: true },       
    8: { KEY: 'invoice', VALUE: 8 },       
}  

// Layout/index.vue中的数据
const MODULEAUTH = [
    {
        id: 1,
        value: ROUTER_TYPE.SALES,
        key: ROUTER_TYPE_MAP[ROUTER_TYPE.SALES].KEY,
        img: Util.Image.getImageFile('router', 'router_type_3'),
        t: 'n.sales',
    },
    {
        id: 2,
        value: ROUTER_TYPE.AFTER,
        key: ROUTER_TYPE_MAP[ROUTER_TYPE.AFTER].KEY,
        img: Util.Image.getImageFile('router', 'router_type_2'),
        t: 'n.after',
    },
    {
        id: 3,
        value: ROUTER_TYPE.PRODUCTION,
        key: ROUTER_TYPE_MAP[ROUTER_TYPE.PRODUCTION].KEY,
        img: Util.Image.getImageFile('router', 'router_type_4'),
        t: 'n.production',
    },
    {
        id: 4,
        value: ROUTER_TYPE.SUPPLIER,
        key: ROUTER_TYPE_MAP[ROUTER_TYPE.SUPPLIER].KEY,
        img: Util.Image.getImageFile('router', 'router_type_5'),
        t: 'n.supplier',
    },
    {
        id: 8,
        value: ROUTER_TYPE.WAREHOUSING,
        key: ROUTER_TYPE_MAP[ROUTER_TYPE.WAREHOUSING].KEY,
        img: Util.Image.getImageFile('router', 'router_type_5'),
        t: 'n.warehousing',
    },
    {
        id: 5,
        value: ROUTER_TYPE.CRM,
        key: ROUTER_TYPE_MAP[ROUTER_TYPE.CRM].KEY,
        img: Util.Image.getImageFile('router', 'router_type_1'),
        t: 'n.crm',
    },
    {
        id: 6,
        value: ROUTER_TYPE.SYSTEM,
        key: ROUTER_TYPE_MAP[ROUTER_TYPE.SYSTEM].KEY,
        img: Util.Image.getImageFile('router', 'router_type_1'),
        t: 'n.system_management',
        ismanager: ROUTER_TYPE_MAP[ROUTER_TYPE.SYSTEM]?.ISMANAGER,
    },
] 

const SYSTEM_AUTH = {
    MODULEAUTH,
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
            key: ROUTER_TYPE_MAP[ROUTER_TYPE.WAREHOUSING].KEY, // 仓储
            name: '仓储',
            tab: ROUTER_TYPE.WAREHOUSING,
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
            key: ROUTER_TYPE_MAP[ROUTER_TYPE.SYSTEM].KEY,  // 系统管理
            name: '系统管理',
            tab: ROUTER_TYPE.SYSTEM,
        },
    ],
};

export default SYSTEM_AUTH;

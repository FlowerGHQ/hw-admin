import dayjs from 'dayjs';

let OSS_POINT = 'https://rebuild-mel-erp.oss-cn-hangzhou.aliyuncs.com'
let URL_POINT = 'https://eos-api.hw.innotick.com'

switch (window.location.hostname) {
    case 'eos.hw.innotick.com':
        URL_POINT = 'https://eos-api.hw.innotick.com' // 正式服
        break;
    case "10.0.0.205":
        URL_POINT = 'http://10.0.0.205:8083'
        break;
    case "10.0.0.197":
    case "10.0.0.107":
        URL_POINT = 'https://eos-api.hw.innotick.com'
        break;
    case "10.0.0.158":
    case "10.0.0.159":
        URL_POINT = 'http://10.0.0.109:8083'
        break;
    case "10.0.0.228":
        URL_POINT = 'http://10.0.0.228:8083'
        break;
    default:
        // URL_POINT = 'http://10.0.0.198:8083' // 谢耀圣
        URL_POINT = 'http://10.0.0.109:8083' // 谢耀圣
        // URL_POINT = 'http://10.0.0.205:8083' // 徐伟
        // URL_POINT = 'http://10.0.0.149:8083' // 徐伟
        // URL_POINT = 'http://10.0.0.39:8083'  // 姚志宇
        // URL_POINT = 'http://10.0.0.128:8083' // 姚志宇
        // URL_POINT = 'http://10.0.0.155:8083' // 戚哲康
        break;
}

let Const = {
    NET: {
        URL_POINT: URL_POINT,
        OSS_POINT: OSS_POINT,
        FILE_URL_PREFIX: `${OSS_POINT}/`,
        FILE_UPLOAD_END_POINT: `${URL_POINT}/core/1/file/file-upload`,
    },
    DATA: { // 本地存储
        KEY_PREFIX: 'haowan.admin.data.',
        KEY_TOKEN: 'token',
        KEY_USER: 'user',
        KEY_ORG_ID: 'org.id',
        KEY_ORG_TYPE: 'org.type',
        KEY_LOGIN_TYPE: 'login.type',
        KEY_USER_TYPE: 'user.type',
        KEY_AUTHORITY_LIST: 'authority.list',

        KEY_FIELD_DISPLAY: 'field.display',
    },

    TIME_PICKER_DEFAULT_VALUE: {
        BEGIN: dayjs().second(0).minute(0).hour(0),
        B_TO_B: {
            defaultValue: [
                dayjs().second(0).minute(0).hour(0),
                dayjs().second(0).minute(0).hour(0)
            ],
        },
        B_TO_E: {
            defaultValue: [
                dayjs().second(0).minute(0).hour(0),
                dayjs().second(59).minute(59).hour(23)
            ],
        }
    },

    CONTINENT_LIST: [ // 大洲列表
        {
            "short": "CN",
            "name": "中国",
            "en": "China",
            "tel": "86",
            "pinyin": "zg"
        },
    ],
    COUNTRY_LIST: [ // 国家列表
        {
            "short": "CN",
            "name": "中国",
            "en": "China",
            "tel": "86",
            "pinyin": "zg"
        },
    ],
    CONTINENT_COUNTRY_LIST: [ // 大洲>国家列表
        {
            "value": "亚洲",
            "lable": "Asia",
            "children": [{
                "value": "中国",
                "lable": "China",
            }]
        },
        {
            "value": "欧洲",
            "lable": "Europe",
            "children": [{
                "value": "法国",
                "lable": "France",
            }]
        },
        {
            "value": "非洲",
            "lable": "Africa",
            "children": [{
                "value": "印度",
                "lable": "India",
            }]
        },
    ],

    USER: { // 员工、账号、用户
        TYPE: {
            ADMIN: 10,      // 管理员
            DISTRIBUTOR: 15, //分销商
            AGENT: 20,      // 零售商
            STORE: 30,      // 门店
            WORKER: 40,     // 维修工
            CUSTOMER: 100,  // 顾客
        },
        TYPE_MAP: {
            10: '平台方',
            15: '分销商',
            20: '零售商',
            30: '门店',
            40: '维修工',
            100: '顾客',
        },
    },
    LOGIN: { // 登录
        TYPE: {
            ADMIN: 10,     // 管理员
            DISTRIBUTOR: 15, //分销商
            AGENT: 20,     // 零售商
            STORE: 30,     // 门店
        },
        TYPE_LIST: [
            {value: 30, text: '门店'},
            {value: 20, text: '零售商'},
            {value: 15, text: '分销商'},
            {value: 10, text: '平台方'},
        ],
        TYPE_MAP: {
            10: 'ADMIN',
            15: 'DISTRIBUTOR',
            20: 'AGENT',
            30: 'STORE',
            40: 'WORKER',
            100: 'CUSTOMER',
        },
        ORG_TYPE: {
            ADMIN: 10,
            DISTRIBUTOR: 15,
            AGENT: 20,
            STORE: 30,
            REPAIR: 40,
        },
    },

    DISTRIBUTOR: { // 代理商
        TYPE: {
            INTERNAL: 1,  //国内
            EXPORT: 2, //出口
        },
        TYPE_LIST: [
            {text: '国内', value: 1},
            {text: '出口', value: 2},
        ],
        TYPE_MAP: {
            1: '国内',
            2: '出口',
        },
    },

    ORG_STATUS_LIST: [ // 组织状态
        {text: "启用", value: 1},
        {text: "禁用", value: 0},
    ],

    REPAIR: { // 维修工单
        // 工单分类
        TYPE_LIST: [
            {text: '维修工单', value: 1}, // 普通工单
            {text: '特批订单', value: 2},
        ],
        TYPE_MAP: {
            1: '维修工单',
            2: '特批订单',
        },
        // 工单帐类
        SERVICE_TYPE_LIST: [
            {text: '保内维修', value: 1},
            {text: '保外维修', value: 2},
        ],
        SERVICE_TYPE_MAP: {
            1: '保内维修',
            2: '保外维修',
        },
        // 维修方式
        CHANNEL_LIST: [
            {text: '上门', value: 1},
            {text: '到店', value: 2},
            {text: '寄修', value: 3},
        ],
        CHANNEL_MAP: {
            1: '上门',
            2: '到店',
            3: '寄修',
        },
        ORG_TYPE_LIST: [
            {text: '零售商', value: 20},
            {text: '门店', value: 30},
        ],
        // 维修类别
        METHOD_LIST: [
            {text: '维修', value: 1},
            {text: '更换', value: 2},
        ],
        METHOD_MAP: {
            1: '维修',
            2: '更换',
        },
        // 优先级
        PRIORITY_LIST: [
            {text: '高', value: 1},
            {text: '中', value: 2},
            {text: '低', value: 3},
        ],
        PRIORITY_MAP: {
            1: '高',
            2: '中',
            3: '低',
        },
        PRIORITY_COLOR_MAP: {
            1: 'red',
            2: 'blue',
            3: 'green',
        },
        // 状态
        STATUS: {
            WAIT_DISTRIBUTION: 10,
            WAIT_CHECK: 20,
            WAIT_AUDIT: 25,
            WAIT_DETECTION: 30,
            WAIT_REPAIR: 40,
            REPAIR_END: 50,
            SETTLEMENT: 60,
            // TRANSFER: 100,
            CHECK_FAIL: -20,
            AUDIT_FAIL: -30,
            CLOSE: -10,
        },
        STATUS_MAP: {
            10: '待分配',
            20: '待确认',
            25: '待审核',
            30: '待检测',
            40: '维修中',
            50: '已维修',
            60: '已结算',
            // 100: '已转单',
            '-20': '确认未通过',
            '-30': '审核未通过',
            '-10': '取消',
        },
        STATUS_COLOR_MAP: {
            10: 'red',
            20: 'orange',
            30: 'yellow',
            40: 'blue',
            50: 'light',
            60: 'green',
            100: 'purple',
        },
        // 故障类型 - 放弃使用
        FAULT_OPTIONS_MAP: {
            1: "电池故障",
            2: "发动机故障",
            3: "轮胎故障",
            4: "刹车故障",
            5: "转向灯故障",
            6: "仪表盘故障",
            7: "尾灯故障",
        },
        // 维修结果
        RESULTS_LIST: [
            {name: '成功', value: '1'},
            {name: '失败', value: '2'},
        ],
        RESULTS: {
            SUCCESS: 1,
            FAIL: 2,
        },
    },
    REPAIR_ITEM: { //维修商品
        TYPE: {
            ADD: 1,
            REPLACE: 2,
        }
    },
    ACTION_LOG: { // 操作记录
        SOURCE_TYPE: {
            PURCHASE_ORDER: 10,
            REPAIR_ORDER: 20,
        },
        ACTION_LOG_TYPE_MAP: {
            101: '维修单创建',
            102: '维修单信息完善/修改',
            103: '维修单删除',
            104: '二次上门',
            201: '维修单确认',
            301: '维修检测',
            401: '维修完成',
            501: '结算完成',
            1001: '订单转移',
        },
    },

    ITEM: { // 商品
    },
    PURCHASE: { // 采购订单
        // 状态
        STATUS: {
            INIT: 0,
            WAIT_PAY: 100,
            WAIT_DELIVER: 200,
            WAIT_TAKE_DELIVER: 300,
            DEAL_SUCCESS: 400,
            CLOSE: 1000,


        },
        STATUS_MAP: {
            '0': '未知',
            '100': '待支付',
            '200': '待发货',
            '300': '已发货',
            '400': '交易完成',
            '1000': '交易关闭',
        },
        STATUS_COLOR_MAP: {
            '0': 'red',
            '100': 'yellow',
            '200': 'orange',
            '300': 'blue',
            '400': 'green',
        },
        // 支付方式
        PAY_METHOD: {
            1: "支付宝",
            2: "微信",
            3: "银行转账",
        },
        PAY_METHOD_LIST: [
            {name: '支付宝', value: '1'},
            {name: '微信', value: '2'},
            {name: '银行转账', value: '3'},

        ],
        // 评论
        FLAG_REVIEW: {
            SUCCESS: 1,
            FAIL: 0,
        },
        FLAG_REVIEW_MAP: {
            '1': '已评论',
            '0': '未评论',
        },
    },
    REFUND: { // 退款管理
        TYPE: {
            APPLY_BY_CUSTOMER: 100,  //用户申请
            INITIATIVE_REFUND: 200, //后台主动退款
        },
        TYPE_MAP: {
            100: '用户申请退款',
            200: '零售商申请退款',
        },
        STATUS: {
            WAIT_AUDIT: 10,    // 初始化
            AUDIT_PASS: 20,    // 审核通过
            SUCCESS: 40,       // 退款成功
            AUDIT_REFUSE: '-10', // 拒绝退款
            FAIL: '-20',         // 退款失败
        },
        STATUS_MAP: {
            10: '初始化',
            20: '审核通过',
            40: '退款成功',
            '-10': '拒绝退款',
            '-20': '退款失败',

        },
    },

    WAYBILL: { // 物流
        TYPE: {
            IN: 1,
            OUT: 2,
        },
        TARGET_TYPE: {
            PURCHASE_ORDER: 10
        },

        COMPANY_MAP: {
            'EMS': 'EMS',
            'JD': '京东物流',
            'STO': '申通快递',
            'YTO': '圆通速递',
            'ZTO': '中通快递',
            'HTKY': '百世快递',
            'BSKY': '百世快运',
            'YUNDA': '韵达快递',
            'DEPPON': '德邦快递',
            'SFEXPRESS': '顺丰速运',
            'CHINAPOST': '邮政包裹',
            'KYEXPRESS': '跨越速运',
        },
        COMPANY_LIST: [
            {name: 'EMS', value: 'EMS'},
            {name: '京东物流', value: 'JD'},
            {name: '申通快递', value: 'STO'},
            {name: '圆通速递', value: 'YTO'},
            {name: '中通快递', value: 'ZTO'},
            {name: '百世快递', value: 'HTKY'},
            {name: '百世快运', value: 'BSKY'},
            {name: '韵达快递', value: 'YUNDA'},
            {name: '德邦快递', value: 'DEPPON'},
            {name: '顺丰速运', value: 'SFEXPRESS'},
            {name: '邮政包裹', value: 'CHINAPOST'},
            {name: '跨越速运', value: 'KYEXPRESS'},
        ],
    },

    NOTICE: { //系统消息
        TYPE: {
            ADMIN: 10,  //平台消息
            AGENT: 20,  //零售商消息
        },
        TYPE_MAP: {
            10: '平台消息',
            20: '零售商消息'
        },
    },
    SYSTEM: { //系统
        FILE: {
            TARGET_TYPE:{
                // TARGET_TYPE_SYSTEM: '1',
                TARGET_TYPE_DISTRIBUTOR: '2',
                // TARGET_TYPE_AGENT: '3',
                // TARGET_TYPE_STORE: '4',
                // TARGET_TYPE_REPAIR_ORDER: '5',
            },
            TARGET_TYPE_LIST: [
                // {value: 1, text: '系统'},
                {value: 2, text: '分销商'},
                // {value: 3, text: '零售商'},
                // {value: 4, text: '门店'},
                // {value: 5, text: '维修订单'},
            ],
            TYPE:{
                XLSX: 'xlsx',
                DOC: 'doc',
                DOCX: 'docx',
                AVI: 'avi',
            },
            TYPE_LIST: [
                {value: 'xlsx', text: '表格'},
                {value: 'doc', text: '文档(doc)'},
                {value: 'docx', text: '文档(docx)'},
                {value: 'avi', text: '视频'},
            ]
        },
    },

    AUTH_LIST_TEMP: [ // 权限
        { list: [], select: [], key: 'home',            name: '总览' },
        { list: [], select: [], key: 'distributor',     name: '代理商管理' },
        { list: [], select: [], key: 'agent',           name: '零售商管理' },
        { list: [], select: [], key: 'store',           name: '门店管理' },
        { list: [], select: [], key: 'customer',        name: '客户管理' },
        { list: [], select: [], key: 'org-user',        name: '员工管理' },
        { list: [], select: [], key: 'item',            name: '商品管理' },
        { list: [], select: [], key: 'warehouse',       name: '仓库管理' },
        { list: [], select: [], key: 'purchase-order',  name: '采购订单管理' },
        { list: [], select: [], key: 'refund',          name: '退款管理' },
        { list: [], select: [], key: 'repair-order',    name: '维修单管理' },
        { list: [], select: [], key: 'notice',          name: '消息管理' },
        { list: [], select: [], key: 'system-file',     name: '系统文件管理' },
    ],

    ATTACHMENT: {
        TARGET_TYPE: {
            REPAIR_ORDER: 1, //图片类型
        }
    },
    STOCK_RECORD: {
        TYPE: {
            TYPE_IN: 1, //增加
            TYPE_OUT: 2, //减少
        },
        TYPE_MAP: {
            1: '增加',
            2: '减少'
        },
        PRODUCT_TYPE: {  //产品类型
            TYPE_QUALITY: 1, //正品仓
            TYPE_DEFECTIVE: 2, //残次仓
        },
        PRODUCT_TYPE_MAP: {
            1: '正品仓',
            2: '残次仓',
        }


    },
};

export default Const;

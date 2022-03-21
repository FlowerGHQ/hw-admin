import dayjs from 'dayjs';
import defult_img from '@images/defult_img.png'
import defult_org from '@images/defult_org.png'
import defult_item from '@images/defult_item.png'
import defult_file from '@images/defult_file.png'


let OSS_POINT = 'https://horwin.oss-cn-hangzhou.aliyuncs.com'
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
        URL_POINT = 'http://10.0.0.121:8083' // 谢耀圣
        // URL_POINT = 'http://10.0.0.134:8083' // 谭洋波
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
        FILE_UPLOAD_ACTION: `${URL_POINT}/admin/1/item/import`,
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
    DEFULT_IMG: {
        1: defult_img,
        2: defult_item,
        3: defult_org,
        4: defult_file,
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
    CONTINENT_MAP: {
        "亚洲": "Asia",
        "欧洲": "Europe",
        "非洲": "Africa",
        "北美洲": "North America",
        "南美洲": "South America",
        "大洋洲": "Oceania",
        "南极洲": "Antarctica",
    },
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
            ADMIN: 10, // 管理员
            DISTRIBUTOR: 15, //分销商
            AGENT: 20, // 零售商
            STORE: 30, // 门店
            CUSTOMER: 100, // 顾客
        },
        TYPE_MAP: {
            10: '平台方',
            15: '分销商',
            20: '零售商',
            30: '门店',
            100: '顾客',
        },
    },
    LOGIN: { // 登录
        TYPE: {
            ADMIN: 10, // 管理员
            DISTRIBUTOR: 15, //分销商
            AGENT: 20, // 零售商
            STORE: 30, // 门店
        },
        TYPE_LIST: [
            { value: 30, text: '门店' },
            { value: 20, text: '零售商' },
            { value: 15, text: '分销商' },
            { value: 10, text: '平台方' },
        ],
        TYPE_MAP: {
            10: 'ADMIN',
            15: 'DISTRIBUTOR',
            20: 'AGENT',
            30: 'STORE',
            100: 'CUSTOMER',
        },
        ORG_TYPE: {
            ADMIN: 10,
            DISTRIBUTOR: 15,
            AGENT: 20,
            STORE: 30,
        },
    },

    DISTRIBUTOR: { // 代理商
        TYPE: {
            INTERNAL: 1, //国内
            EXPORT: 2, //出口
        },
        TYPE_LIST: [
            { text: '国内', value: 1 },
            { text: '出口', value: 2 },
        ],
        TYPE_MAP: {
            1: '国内',
            2: '出口',
        },
    },

    ORG_STATUS_LIST: [ // 组织状态
        { text: "启用", value: 1 },
        { text: "禁用", value: 0 },
    ],

    TRANSFER_STATUS_LIST: [ // 组织转单状态
        { text: "接受转单", value: 1 },
        { text: "不接受转单", value: 0 },
    ],

    REPAIR: { // 维修工单
        // 工单分类
        TYPE_LIST: [
            { text: '维修工单', value: 1 }, // 普通工单
            { text: '特批订单', value: 2 },
        ],
        TYPE_MAP: {
            1: '维修工单',
            2: '特批订单',
        },
        // 维修单类别
        CATEGORY_LIST: [
            { text: '维修', value: 1 },
            { text: '换车', value: 2 },
            { text: '开箱损', value: 3 },
            { text: '电池维修', value: 4 },
        ],
        // 工单帐类
        SERVICE_TYPE: {
            IN_REPAIR_TIME: 1,
            OUT_REPAIR_TIME: 2,
        },
        SERVICE_TYPE_LIST: [
            { text: '保内', value: 1 },
            { text: '保外', value: 2 },
        ],
        SERVICE_TYPE_MAP: {
            1: '保内',
            2: '保外',
        },
        // 维修方式
        CHANNEL_LIST: [
            { text: '上门', value: 1 },
            { text: '到店', value: 2 },
            { text: '寄修', value: 3 },
        ],
        CHANNEL_MAP: {
            1: '上门',
            2: '到店',
            3: '寄修',
        },
        ORG_TYPE_LIST: [
            { text: '零售商', value: 20 },
            { text: '门店', value: 30 },
        ],
        // 维修类别
        METHOD_LIST: [
            { text: '维修', value: 1 },
            { text: '更换', value: 2 },
        ],
        METHOD_MAP: {
            1: '维修',
            2: '更换',
        },
        // 优先级
        PRIORITY_LIST: [
            { text: '高', value: 1 },
            { text: '中', value: 2 },
            { text: '低', value: 3 },
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
            WAIT_DETECTION: 30,
            WAIT_REPAIR: 40,
            SETTLEMENT: 60,
            AUDIT_SUCCESS: 80,
            FINISH: 100,
            CLOSE: -10,
            AUDIT_FAIL: -30,
        },
        STATUS_MAP: {
            '30': '待检测',
            '40': '维修中',
            '60': '已结算待审核',
            '80': '审核通过',
            '100': '结算完成',
            '-30': '审核未通过',
        },
        STATUS_COLOR_MAP: {
            '30': 'yellow',
            '40': 'blue',
            '60': 'orange',
            '80': 'purple',
            '100': 'green',
            '-10': 'gray',
            '-30': 'red',
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
            { name: '成功', value: '1' },
            { name: '失败', value: '2' },
        ],
        RESULTS: {
            SUCCESS: 1,
            FAIL: 2,
        },
        AUDIT: { //审核结果
            PASS: 1,
            REFUSE: 2
        },
    },
    REPAIR_ITEM: { //维修商品
        TYPE: {
            ADD: 1,
            REPLACE: 2,
            TRANSFER: 3,
        },
        TYPE_MAP: {
            1: '新增零件',
            2: '更换零件',
            3: '维修转单',
        },
    },
    ACTION_LOG: { // 操作记录
        SOURCE_TYPE: {
            PURCHASE_ORDER: 10,
            REPAIR_ORDER: 20,
            AFTER_SALES_ORDER: 40,
        },
        TYPE_MAP: {
            201: '维修单创建',
            202: '维修单信息完善/修改',
            204: '维修单删除',
            205: '维修单取消',
            212: '维修单审核',
            301: '维修检测',
            213: '增加故障零件',
            215: '删除故障零件',
            216: '维修完成',
            217: '结算完成',
            218: '订单转移',
        },
    },

    ITEM: { // 商品
        TYPE: {
            PRODUCT: 1,//成品
            COMPONENT: 2//零件
        },
        TYPE_MAP: {
            1: '整车',
            2: '零部件',
        },
        MONETARY_TYPE: {
            '￥': 'CNY',
            '€': 'EUR',
            '$': 'USD',
            '£': 'GBP',
        },
        MONETARY_TYPE_MAP: {
            'CNY': '￥',
            'EUR': '€',
            'USD': '$',
            'GBP': '£',
        },
        STATUS: {
        },
        STATUS_LIST: [
            { text: '全部', value: '1' },
            { text: '上架中', value: '0' },
            { text: '已下架', value: '-1' },
        ],
        TARGET_TYPE_MAP: {
            ITEM: 1, // 商品
            MATERIAL: 2, // 物料
        },
        TARGET_TYPE_LIST: [
            {
                text: '商品',
                value: 1
            },
            {
                text: '物料',
                value: 2
            },
        ]
    },
    PURCHASE: { // 采购订单
        // 状态
        STATUS: {
            INIT: 0,
            WAIT_DELIVER: 200,
            WAIT_TAKE_DELIVER: 300,
            TAKE_DELIVER: 350,
            DEAL_SUCCESS: 400,
            CANCEL: -100,
        },
        STATUS_MAP: {
            '0': '未知',
            '200': '待发货',
            '300': '已发货',
            '350': '已收货',
            '400': '交易完成',
            '-100': '交易关闭',
        },
        STATUS_COLOR_MAP: {
            '0': 'red',
            '200': 'orange',
            '300': 'blue',
            '350': 'yellow',
            '400': 'green',
        },
        // 支付方式
        PAY_METHOD: {
            1: "支付宝",
            2: "微信",
            3: "银行转账",
        },
        PAY_METHOD_LIST: [
            { name: '支付宝', value: '1' },
            { name: '微信', value: '2' },
            { name: '银行转账', value: '3' },
        ],
        PAYMENT_STATUS: {
            WAIT_PAY: 100, //待支付
            PAYING: 200, //部分付款
            PAY_ALL: 400,//全部付款
        },
        PAYMENT_STATUS_MAP: {
            '100': '待支付',
            '200': '预付款',
            '400': '全额付款',
        },
        PAYMENT_COLOR_MAP: {
            '100': 'yellow',
            '200': 'blue',
            '400': 'green',
        },
        // 评论
        FLAG_REVIEW: {
            SUCCESS: 1,
            FAIL: 0,
        },
        FLAG_REVIEW_MAP: {
            '1': '已评论',
            '0': '未评论',
        },
        SEARCH_TYPE: {
            SELF: 1, //本账户的采购单
            CHILDREN: 2, //子级采购单
            ALL: 3, //所有子级采购单
        },
    },

    WAYBILL: { // 物流
        TYPE: {
            IN: 1,
            OUT: 2,
        },
        TARGET_TYPE: {
            PURCHASE_ORDER: 10, //采购订单
            REPAIR_ORDER_TRANSFER: 20, //维修单转单
            TRANSFER_ORDER: 30, //维修单调货单
            AFTER_SALES_ORDER: 40 //售后单
        },
        TARGET_TYPE_LIST: [
            { text: '采购订单', value: 10 },
            { text: '维修单转单', value: 20 },
            { text: '维修单调货单', value: 30 },
            { text: '售后单', value: 40 },
        ],
        TARGET_TYPE_MAP: {
            10: '采购订单',
            20: '维修单转单',
            30: '维修单调货单',
            40: '售后单'
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
            { name: 'EMS', value: 'EMS' },
            { name: '京东物流', value: 'JD' },
            { name: '申通快递', value: 'STO' },
            { name: '圆通速递', value: 'YTO' },
            { name: '中通快递', value: 'ZTO' },
            { name: '百世快递', value: 'HTKY' },
            { name: '百世快运', value: 'BSKY' },
            { name: '韵达快递', value: 'YUNDA' },
            { name: '德邦快递', value: 'DEPPON' },
            { name: '顺丰速运', value: 'SFEXPRESS' },
            { name: '邮政包裹', value: 'CHINAPOST' },
            { name: '跨越速运', value: 'KYEXPRESS' },
        ],
    },

    NOTICE: { //系统消息
        TYPE: {
            ADMIN: 10, // 系统消息
            DISTRIBUTOR: 15, // 分销商
            AGENT: 20, // 零售商
            STORE: 30, // 门店
        },
        TYPE_MAP: {
            10: '系统消息',
            15: '分销商消息',
            20: '零售商消息',
            30: '门店消息',
        },
    },
    SYSTEM: { //系统
        FILE: {
            TARGET_TYPE: {
                SYSTEM: 1,
                DISTRIBUTOR: 2,
                AGENT: 3,
                STORE: 4,
                // REPAIR_ORDER: '5',
            },
            TARGET_TYPE_MAP: {
                1: '系统',
                2: '分销商',
                3: '零售商',
                4: '门店',
            },
        },
    },

    AUTH_LIST_TEMP: [ // 权限
        { list: [], select: [], key: 'home', name: '总览' },
        { list: [], select: [], key: 'distributor', name: '代理商管理' },
        { list: [], select: [], key: 'agent', name: '零售商管理' },
        { list: [], select: [], key: 'store', name: '门店管理' },
        { list: [], select: [], key: 'customer', name: '客户管理' },
        { list: [], select: [], key: 'org-user', name: '员工管理' },
        { list: [], select: [], key: 'item', name: '商品管理' },
        { list: [], select: [], key: 'warehouse', name: '仓库管理' },
        { list: [], select: [], key: 'purchase-order', name: '采购订单管理' },
        { list: [], select: [], key: 'refund', name: '退款管理' },
        { list: [], select: [], key: 'repair-order', name: '维修单管理' },
        { list: [], select: [], key: 'notice', name: '消息管理' },
        { list: [], select: [], key: 'system-file', name: '系统文件管理' },
    ],

    ATTACHMENT: {
        TARGET_TYPE: { // 来源类型
            REPAIR_ORDER: 1, // 维修单附件
            PURCHASE_ORDER: 2 // 采购单附件
        }
    },
    WAREHOUSE: {
        TYPE: { //仓库类型
            QUALITY: 1, //正品仓
            DEFECTIVE: 2, //残次仓
        },
        TYPE_MAP: {
            1: '正品仓',
            2: '残次仓',
        },
    },
    STOCK_RECORD: { // 出入库明细
        COMMODITY_TYPE: {
            ITEM: 10,
            ENTITY: 20,
            MATERIALS: 30,
        },
        COMMODITY_TYPE_MAP: {
            10: '无实例商品',
            20: '有实例商品',
            // 30: '物料',
        },
        TYPE: {
            IN: 1, //入库
            OUT: 2, //出库
        },
        TYPE_MAP: {
            1: '入库',
            2: '出库'
        },
        STATUS: { //出入库单审核状态
            INIT: 0, //初始化
            CLOSE: 40, //已完成
            CANCEL: -20, // 取消
        },
        STATUS_MAP: {
            '0': '待提交',
            '40': '已完成',
            '-20': '已取消'
        },
        STATUS_COLOR_MAP: {
            '0': 'yellow',
            '40': 'green',
            '-20': 'grey'
        },
        STATUS_LIST: [ //出入库单审核
            { text: '待提交', value: 0 },
            { text: '已完成', value: 40 },
            { text: '已取消', value: -20 },
        ],
        SOURCE_TYPE: {
            ADMIN: 10,       //管理员创建
            PRODUCTION: 15,  // 生产单
            PURCHASE: 20,    // 采购单
            AFTER_SALES: 30, // 售后单
            TRANSFER: 40,    // 调货单
            REPAIR: 50,      // 维修单
        },
        SOURCE_TYPE_MAP: {
            10: '管理员创建',
            15: '生产单',
            20: '采购单',
            30: '售后单',
            40: '调货单',
            50: '维修单'
        },
    },
    TRANSFER_ORDER: { //调货单
        STATUS: { //调货单审核状态
            WAIT_AUDIT: 10, //待审核
            AUDIT_PASS: 20, //审核通过
            IN_TRANSIT: 30, //运输中
            CLOSE: 40, //处理完成
            AUDIT_REFUSE: -10, //审核失败
            CANCEL: -20, //取消
        },
        STATUS_MAP: {
            '10': '待审核',
            '20': '审核通过',
            '30': '运输中',
            '40': '处理完成',
            '-10': '审核失败',
            '-20': '已取消',
        },
        STATUS_COLOR_MAP: {
            '10': 'yellow',
            '20': 'blue',
            '30': 'purple',
            '40': 'green',
            '-10': 'red',
            '-20': 'grey'
        },
        STATUS_LIST: [ //调货单审核
            { text: '待审核', value: 10 },
            { text: '审核通过', value: 20 },
            { text: '运输中', value: 30 },
            { text: '处理完成', value: 40 },
            { text: '审核失败', value: -10 },
            { text: '已取消', value: -20 },
        ],
    },
    WALLET: { //账户
        TYPE: {
            CNY: 1,
            EUR: 2,
            USD: 3,
            GBP: 4,
        },
        TYPE_MAP: {
            '1': 'CNY',
            '2': 'EUR',
            '3': 'USD',
            '4': 'GBP',
        },
        OPERATE_TYPE: {
            IN: 1,
            OUT: 2,
        },
        OPERATE_TYPE_MAP: {
            '1': '充值',
            '2': '扣款',
        },
        SUBJECT: {
            MANAGER_ADJUSTMENT: 101,
            PURCHASE_ORDER: 201,
            PURCHASE_ORDER_COMPENSATION: 202,
            REPAIR_ORDER_DEDUCTIONS: 501,
            REPAIR_ORDER_COMPENSATION: 502,
        },
        SUBJECT_MAP: {
            '101': '调整余额',
            '201': '采购单支付',
            '202': '采购单补偿',
            '501': '维修单扣款',
            '502': '维修单补偿',
        }
    },
    FAULT_ENTITY: { //故障件
        STATUS: { // 故障件审核状态
            INIT: 0, // 初始化
            WAIT_AUDIT: 10, // 待审核
            AUDIT_SUCCESS:20, // 审核成功
            AUDIT_FAIL: -20, // 审核失败
        },
        STATUS_MAP: {
            '0': '初始化',
            '10': '待审核',
            '20': '审核成功',
            '-20': '审核失败'
        },
        STATUS_COLOR_MAP: {
            '0': 'grey',
            '10': 'yellow',
            '20': 'green',
            '-20': 'red'
        },
        AUDIT_TYPE: {
            WAIT: 10,
            FAIL: 0,
            SUCCESS: 1,
        }
    },
    AFTERSALES: { // 售后
        STATUS: {
            INIT: 0,         // 待提交
            APPLY: 100,      // 待审核
            AUDIT_PASS: 200, // 处理中
            FINISH: 600 ,    // 已完成
            CANCEL: -100,    // 已取消
            AUDIT_FAIL: -200,// 审核失败
        },
        STATUS_MAP: {
            '0'   : { color: 'purple', text: '待提交'},
            '100' : { color: 'orange', text: '待审核'},
            '200' : { color: 'blue',   text: '处理中'},
            '600' : { color: 'green',  text: '已完成'},
            '-100': { color: 'gray',   text: '已取消'},
            '-200': { color: 'red',    text: '审核失败'},
        },
        TYPE: {
            ONLY_REFUND: 1,       // 仅退款
            REFUND_WITH_ITEMS: 2, // 退款且退货
            EXCHANGE_ITEMS: 3,    // 换货
            REISSUE: 4,           // 补发
        },
        TYPE_MAP: {
            '1': '仅退款',
            '2': '退款且退货',
            '3': '换货',
            '4': '补发',
        },
        QUERY_TYPE: {
            APPLY: 1,
            SUPPLY: 2,
        },
        WAYBILL_STATUS_MAP: {
            '0' :'初始化',
            '100' :'已发货',
            '200' :'已接收',
            '400' :'已入库',
        },
        REFUND_STATUS_MAP: {
            '0' :'初始化',
            '100' :'已申请',
            '400' :'退款成功',
        },
    },
    REFUND: { // 退款管理
        TYPE_LIST: [
            { text: '零售商申请退款', value: 100 },
            { text: '分销商申请退款', value: 110 },
            { text: '门店申请退款', value: 120 },
            { text: '后台主动退款', value: 200 },
        ],
        TYPE_MAP: {
            100: '零售商申请退款',
            110: '分销商申请退款',
            120: '门店申请退款',
            200: '后台主动退款'
        },
        STATUS: {
            WAIT_AUDIT: 10, // 待审核
            AUDIT_PASS: 20, // 审核通过
            SUCCESS: 40, // 退款成功
            AUDIT_REFUSE: -10, // 审核失败
            CANCEL: -20, // 已取消
        },
        STATUS_MAP: {
            '10': '待审核',
            '20': '审核通过',
            '40': '退款成功',
            '-10': '审核失败',
            '-20': '已取消',
        },
        STATUS_COLOR_MAP: {
            '10': 'yellow',
            '20': 'blue',
            '40': 'green',
            '-10': 'red',
            '-20': 'grey'
        },
        SEARCH_TYPE: {
            SELF: 1, //本账户申请的退款单
            CHILDREN: 2, //待审核的退款单
        },
    },
};

export default Const;

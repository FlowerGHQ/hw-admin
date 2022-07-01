import dayjs from 'dayjs';
import defult_img from '@images/defult_img.png'
import defult_org from '@images/defult_org.png'
import defult_item from '@images/defult_item.png'
import defult_file from '@images/defult_file.png'


// let OSS_POINT = 'https://horwin.oss-cn-hangzhou.aliyuncs.com' // 正式
let OSS_POINT = 'https://horwin.oss-cn-hangzhou.aliyuncs.com' //
let URL_POINT = 'https://eos-api.hw.innotick.com'

switch (window.location.hostname) {
    case 'eos.hw.innotick.com':
        URL_POINT = 'https://eos-api.hw.innotick.com' // 正式服
        break;
    case 'eos-dev.hw.innotick.com':
        URL_POINT = 'http://eos-api-dev.hw.innotick.com' // 测试服
        break;
    case "10.0.0.205":
    case "10.0.0.219":
        // URL_POINT = 'http://10.0.0.213:8889'
        break;
    default:
        URL_POINT = 'http://eos-api-dev.hw.innotick.com' // 测试服
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
        KEY_LANGUAGE: 'language'
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
            '10': { key: 10, zh: '平台方',en: 'Admin'},
            '15': { key: 15, zh: '分销商',en: 'Distributor'},
            '20': { key: 20, zh: '零售商',en: 'Retailer'},
            '30': { key: 30, zh: '门店',en: 'Store'},
            /*  10: '平台方',
              15: '分销商',
              20: '零售商',
              30: '门店',
              100: '顾客',*/
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
            { value: 30, zh: '门店',en: 'Store' },
            { value: 20, zh: '零售商',en: 'Retailer' },
            { value: 15, zh: '分销商',en: 'Distributor' },
            { value: 10, zh: '平台方',en: 'Admin' },
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
            { zh: '国内', en: 'Internal', value: 1 },
            { zh: '出口', en: 'Export', value: 2 },
        ],
        TYPE_MAP: {
            '1': { key: 1, zh: '国内', en: 'Internal' },
            '2': { key: 2, zh: '出口', en: 'Export' },
        },
        // PAY_TIME_LIST: [
        //     { text: 'TT(30%定金,70%尾款)', value: 10 },
        //     { text: 'OA 30天', value: 20 },
        //     { text: 'OA 60天', value: 30 },
        //     { text: 'OA 90天', value: 40 },
        // ],
	    PAY_TIME: {
		    PAYMENT_TYPE_ALL_PAYMENT: 10,
		    PAYMENT_TYPE_DOWN_PAYMENT: 20,
		    PAYMENT_TYPE_PAYMENT_DAYS_30: 30,
		    PAYMENT_TYPE_PAYMENT_DAYS_60: 40,
		    PAYMENT_TYPE_PAYMENT_DAYS_90: 50,

	    },
	    PAY_TIME_LIST: {
		    '10': { key: 10, zh: '全款发货', en: 'Full payment delivery'},
		    '20': { key: 20, zh: 'TT(30%定金,70%尾款)', en: 'TT'},
		    '30': { key: 30, zh: 'OA 30天', en: 'OA 30 days'},
		    '40': { key: 40, zh: 'OA 60天', en: 'OA 60 days'},
		    '50': { key: 50, zh: 'OA 90天', en: 'OA 90 days'},
	    },
        PAY_TIME_MAP: {
            10: 'TT(30%定金,70%尾款)',
            20: 'OA 30天',
            30: 'OA 60天',
            40: 'OA 90天',
        },
    },

    ORG_STATUS_LIST: [// 组织状态
        {value: 1, zh: "启用", en: 'enable'},
        {value: 0, zh: "禁用", en: 'disable'}
    ],
    TRANSFER_STATUS_LIST: [ // 组织转单状态
        { text: "接受转单", value: 1 },
        { text: "不接受转单", value: 0 },
    ],

    REPAIR: { // 维修工单
        // 工单分类
        TYPE_LIST: [
            { zh: '维修工单', en: 'repair order', value: 1 }, // 普通工单
            { zh: '特批工单', en: 'special repair order', value: 2 },
        ],
        TYPE_MAP: {
            1: '维修工单',
            2: '特批订单',
        },
	    TYPE: {
		    TYPE_COMMON: 1,
		    TYPE_SPECIAL: 2,
	    },
        // 维修单类别
        CATEGORY_LIST: [
            { zh: '维修', en: 'repair', value: 1 },
            { zh: '换车', en: 'replace car', value: 2 },
            { zh: '开箱损', en: 'unpacking damage', value: 3 },
            { zh: '电池维修', en: 'battery', value: 4 },
        ],
        // 工单帐类
        SERVICE_TYPE: {
            IN_REPAIR_TIME: 1,
            OUT_REPAIR_TIME: 2,
        },
        SERVICE_TYPE_LIST: [
            { zh: '保内', en: 'under warranty', value: 1 },
            { zh: '保外', en: 'out of warranty', value: 2 },
        ],
        SERVICE_TYPE_MAP: {
            '1' : { zh: '保内', en: 'Under warranty'},
            '2' : { zh: '保外', en: 'Out of warranty'},
        },
        // 维修方式
        CHANNEL_LIST: [
            { zh: '上门', en: 'home repair', value: 1 },
            { zh: '到店', en: 'repair in store', value: 2 },
            { zh: '寄修', en: 'send by courier', value: 3 },
        ],
        CHANNEL_MAP: {
            '1' : { zh: '上门', en: 'Home repair'},
            '2' : { zh: '到店', en: 'Repair in store'},
            '3' : { zh: '寄修', en: 'Send by courier'},
        },
        ORG_TYPE_LIST: [
            { text: '零售商', value: 20 },
            { text: '门店', value: 30 },
        ],
        // 维修类别
        METHOD_LIST: [
            { zh: '维修', en: 'repair', value: 1 },
            { zh: '更换', en: 'replace', value: 2 },
        ],
        METHOD_MAP: {
            '1' : { zh: '维修', en: 'Repair'},
            '2' : { zh: '更换', en: 'Replace'},
        },
        // 优先级
        PRIORITY_LIST: [
            { zh: '高', en: 'high', value: 1 },
            { zh: '中', en: 'medium', value: 2 },
            { zh: '低', en: 'low', value: 3 },
        ],
        PRIORITY_MAP: {
            '1' : { color: 'red',  zh: '高', en: 'high'},
            '2' : { color: 'blue', zh: '中', en: 'medium'},
            '3' : { color: 'green', zh: '低', en: 'low'},
        },
        // 状态
        STATUS: {
            WAIT_DETECTION: 30,
            WAIT_REPAIR: 40,
	        REPAIR_END: 45,
            SETTLEMENT: 60,
            SETTLEMENT_DISTRIBUTOR: 70,
            DISTRIBUTOR_AUDIT_SUCCESS: 80,
            AUDIT_SUCCESS: 90,
            DISTRIBUTOR_WAREHOUSE: 95,
            FINISH: 100,
            FAULT_ENTITY_AUDIT: 105,
            SAVE_TO_INVOICE: 110,
            CLOSE: -10,
            AUDIT_FAIL: -30,
            FAULT_ENTITY_AUDIT_FAIL: -40,
        },
        STATUS_MAP: {
            '30': { key: 30, color: 'yellow', zh: '待检测', en: 'Waiting detect'},
            '40': { key: 40, color: 'blue', zh: '维修中', en: 'Under repair'},
	        '45': { key: 40, color: 'blue', zh: '维修结束', en: 'Under repair'},
            '60': { key: 60, color: 'orange', zh: '已结算待审核', en: 'Settled accounts and awaiting audit'},
            '70': { key: 70, color: 'orange', zh: '已结算待审核',en: 'Settled accounts and awaiting audit'},
            '80': { key: 80, color: 'purple', zh: '分销商审核通过', en: 'Passed audit'},
            '90': { key: 90, color: 'purple', zh: '平台审核通过', en: 'Passed audit'},
            '95': { key: 95, color: 'purple', zh: '分销商已入库',},
            '100': { key: 100, color: 'blue', zh: '已完成', en: 'Finished settle accounts'},
            '105': { key: 105, color: 'blue', zh: '故障件审核通过',en: ''},
            '110': { key: 110, color: 'green', zh: '平台方已入库'},
            '-10': { key: -10, color: 'gray', zh: '已取消', en: 'Cancelled'},
            '-30': { key: -30, color: 'red', zh: '工单审核未通过', en: 'Failed audit'},
            '-40': { key: -40, color: 'red', zh: '故障件审核未通过'},
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
            '1':  { key: 1, zh: '新增零件', en: 'New parts' },
            '2':  { key: 2, zh: '更换零件', en: 'Replace' },
            // '3':  { key: 3, zh: '维修转单', en: '1' },

        },
    },
    ACTION_LOG: { // 操作记录
        SOURCE_TYPE: {
            PURCHASE_ORDER: 10,
            REPAIR_ORDER: 20,
            AFTER_SALES_ORDER: 40,
        },
        TYPE_MAP: {
            '201': {key: 201, zh: '维修单创建', en: 'Create repair order'},
            '202': {key: 202, zh: '维修单信息完善/修改', en: 'Information improvement/modification'},
            '204': {key: 204, zh: '维修单删除', en: 'Deleted'},
            '205': {key: 205, zh: '维修单取消', en: 'Canceled'},
            '212': {key: 212, zh: '维修单审核', en: 'Review'},
            '301': {key: 301, zh: '维修检测', en: 'Detection'},
            '213': {key: 213, zh: '增加故障零件', en: 'Add faulty parts'},
            '215': {key: 215, zh: '删除故障零件', en: 'Deleted faulty parts'},
            '216': {key: 216, zh: '维修完成', en: 'Repair is complete'},
            '217': {key: 217, zh: '结算完成', en: 'Settlement completed'},
            // '218': {key: 218, zh: '订单转移', en: 'Parts'},
           /* 201: '维修单创建',
            202: '维修单信息完善/修改',
            204: '维修单删除',
            205: '维修单取消',
            212: '维修单审核',
            301: '维修检测',
            213: '增加故障零件',
            215: '删除故障零件',
            216: '维修完成',
            217: '结算完成',
            218: '订单转移',*/
        },
    },

    ITEM: { // 商品
        TYPE: {
            PRODUCT: 1,//成品
            COMPONENT: 2//零件
        },
        TYPE_MAP: {
            '1': {key: 1, zh: '整车', en: 'Vehicle'},
            '2': {key: 2, zh: '零部件', en: 'Parts'},
	        '3': {key: 3, zh: '周边', en: 'Parts'},
	        '4': {key: 4, zh: '广宣品', en: 'Parts'},
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
            { zh: '全部', en: 'All', value: '1' },
            { zh: '上架中',en: 'Active', value: '0' },
            { zh: '已下架', en: 'Inactive', value: '-1' },
        ],
	    FLAG_ENTITY: {
		    YES:1,
		    NO:0,
	    },
	    FLAG_ENTITY_MAP: {
		    '1': {key: 1, zh: '是', en: 'Yes'},
		    '0': {key: 0, zh: '否', en: 'No'}
	    },
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
        ],
        SEARCH_TYPE:{
            NAME: "1",
            CODE: "2",
        },
        SEARCH_TYPE_MAP:{
            '1': {key: 1, zh: '名称', en: 'name'},
            '2': {key: 2, zh: '编码', en: 'code'}
        },
    },
    PURCHASE: { // 采购订单
        // 状态
        STATUS: {
            INIT: 0,
	        SPLIT: 50,
            WAIT_PAY: 100,
            WAIT_DELIVER: 200,
	        ORDER_TRANSFERRED: 250,
            WAIT_TAKE_DELIVER: 300,
            TAKE_DELIVER: 330,
            ALL_TAKE_DELIVER: 360,
            DEAL_SUCCESS: 400,
	        REVISE: 600,
            REVISE_AUDIT: 630,
            CANCEL: -100,
	        RE_REVISE: -200,
        },
        STATUS_MAP: {
            '0':   { value: '0', key: 0,    color: 'red',    zh: '未知', en: 'Unknown'},
	        '50': { value: '0', key: 50,  color: 'green', zh: '已拆单', en: 'Separate bill'},
            '100': { value: '0', key: 100,  color: 'orange', zh: '待支付', en: 'Wait to pay'},
            '200': { value: '0', key: 200,  color: 'orange', zh: '待发货', en: 'Wait for delivery'},
            '250': { value: '0', key: 400,  color: 'blue',   zh: '已转单', en: 'Order transferred'},
            '300': { value: '0', key: 300,  color: 'blue',   zh: '已发货', en: 'Shipped'},
            '330': { value: '0', key: 330,  color: 'yellow', zh: '部分收货', en: 'Received'},
            '360': { value: '0', key: 360,  color: 'yellow', zh: '已收货', en: 'Received'},
            '400': { value: '0', key: 400,  color: 'green',  zh: '交易完成', en: 'Order completed'},
	        '600': { value: '0', key: 600,  color: 'blue',  zh: '已修改', en: 'The modified'},
	        '630': { value: '0', key: 630,  color: 'yellow',  zh: '待审核', en: 'To audit'},
            '-100':{ value: '0', key: -100, color: 'gray',   zh: '交易关闭', en: 'Canceled'},
	        '-200':{ value: '0', key: -200, color: 'gray',   zh: '已修改关闭', en: 'Modified closed'},
        },
        /* STATUS_COLOR_MAP: {
            '0': 'red',
            '200': 'orange',
            '300': 'blue',
            '350': 'yellow',
            '400': 'green',
        },*/
        // 支付方式
        PAY_METHOD: {
            // 1: "支付宝",
            // 2: "微信",
            // 3: "银行转账",
            10: "汇票",
            20: "银行转账",
        },
        PAY_METHOD_LIST: [
            // { name: '支付宝', value: '1' },
            // { name: '微信', value: '2' },
            // { name: '银行转账', value: '3' },
            { zh: '汇票', en: 'Draft', value: '10' },
            { zh: '银行转账', en: 'Bank transfer', value: '20' },
        ],
        PAYMENT_STATUS: {
            WAIT_PAY: 100, //待支付
	        WAIT_AUDIT: 200, //部分付款
            PAYING: 300, //部分付款
            PAY_ALL: 400,//全部付款
        },
        PAYMENT_STATUS_MAP: {
            '100': { key: 100, color: 'yellow', zh: '待支付', en: 'Wait to pay', value: '0'},
            '200': { key: 200, color: 'orange', zh: '待审核', en: 'Wait to audit', value: '0'},
	        '300': { key: 300, color: 'blue', zh: '部分付款', en: 'Part of the payment', value: '0'},
            '400': { key: 400, color: 'green', zh: '全额付款',en: 'Full payment', value: '0'},
        },
        /* PAYMENT_COLOR_MAP: {
             '100': 'yellow',
             '200': 'blue',
             '400': 'green',
         },*/
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
        // 分批发货
        FLAG_PART_SHIPMENT_LIST: {
            '1': {key: 1, zh: '同意', en: 'Agree' },
            '2': {key: 2, zh: '不同意', en: 'Disagree'},
        },
        FLAG_PART_SHIPMENT_MAP: {
            1: '同意',
            2: '不同意',
        },
        // 转运
        FLAG_TRANSFER_LIST: {
            '1': {key: 1, zh: '同意', en: 'Agree' },
            '2': {key: 2, zh: '不同意', en: 'Disagree'},
        },
        FLAG_TRANSFER_MAP: {
            '1': { key: 1, zh: '同意', en: 'Allowed'},
            '2': { key: 2, zh: '不同意', en: 'Disagreed'},
        },
	    FLAG_ORDER_TYPE_LIST: {
		    '10': { key: 10, zh: '售前订单', en: 'Pre-sale orders'},
		    '20': { key: 20, zh: '售后订单', en: 'After sales order'},
		    '30': { key: 30, zh: '混合订单', en: 'Mix order'},
		    '40': { key: 40, zh: '赠品单', en: 'Giveaway order'},
	    },
	    FLAG_ORDER_TYPE_MAP: {
		    10: '售前订单',
		    20: '售后订单',
		    30: '混合订单',
		    40: '赠品单',
	    },
	    FLAG_ORDER_TYPE: {
		    PRE_SALES: 10,
			AFTER_SALES: 20,
	    },
	    PAY_STATUS_LIST: {
		    '0': { key: 10, zh: '初始', en: 'Init'},
		    '10': { key: 10, zh: '等待审核', en: 'Wait to audit'},
		    '20': { key: 20, zh: '审核通过', en: 'Approved'},
		    '-10': { key: -10, zh: '取消', en: 'Cancel'},
		    '-20': { key: -20, zh: '审核未通过', en: 'Audit failed'},
	    },
	    PAY_STATUS:{
			INIT: 0,
		    WAIT_TO_AUDIT: 10,
		    APPROVED: 20,
		    CANCEL: -10,
		    AUDIT_FAILED: -20,
	    },
        FLAG: {
            YES:1,
            NO:0,
        },
	    TYPE: {
		    PRE_SALES: 10,
		    AFTER_SALES: 20,
		    MIX: 30,
		    GIVEAWAY: 40,
	    },
	    PARENT_TYPE: {
		    BREAK : 10  ,     // 拆分订单
		    TRANSFER : 20,     // 转单
		    UPDATE: 30,     // 修改
		    TYPE_GIVE: 40 ,    // 修改
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
        COURIER_LIST: [
            { name: '国际物流', value: 1 },
            { name: '货代公司', value: 2 },
        ],
        COURIER_MAP: {
            '1': { key: 1, zh: '国际物流', en: 'International logistics'},
            '2': { key: 2, zh: '货代公司', en: 'Shipping agent' },
        },
        RECEIPT_LIST: [
            { name: '快递', value: 1 },
            { name: '自提', value: 2 },
        ],
        RECEIPT_MAP: {
            '1': { key: 1, zh: '快递', en: 'Send by post'},
            '2': { key: 2, zh: '自提', en: 'Self pick up' },
        }
    },

    NOTICE: { //系统消息
        CATEGORY: {
            MASTER: 10, //平台消息
            ORG: 20,    //机构消息
        },
        CATEGORY_MAP: {
            '10': {key: 10, zh: '平台消息', en: 'System messages'},
            '20': {key: 20, zh: '机构消息', en: 'Other messages',},
        },
        TYPE: {
            ADMIN: 10,        // 系统消息，所有人都可以看到
            DISTRIBUTOR: 20,  // 分销商消息，只有分销商可以看到

            STOCK_ALARM: 100, // 库存告警消息，可配置权限
        },
        MASTER_TYPE_MAP: {
            '10': {key: 10, zh: '平台消息', en: 'System messages'},
            '20': {key: 20, zh: '分销商消息', en: 'Other messages',},
        },
        ORG_TYPE_MAP: {
            '100': { key: 100, zh: '库存预警',en: 'Inventory alert' },
        },
        RESOURCE_TYPE: {
            WAREHOUSE: 10,
	        PURCHASE: 20,
	        DISTRIBUTOR: 30,
        },
        RESOURCE_TYPE_MAP: {
            '10': {text: '仓库'},
	        '20': {text: '采购'},
	        '30': {text: '分销商'},
        },
	    RESOURCE_TYPE_LIST: [
		    {value: 10, text:'仓库'},
		    {value: 20, text:'采购'},
		    {value: 30, text:'分销商'}
	    ]
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
                '1': {key: 1, zh: '系统', en: 'System'},
                '2': {key: 2, zh: '分销商', en: 'Distributor',},
                '3': {key: 3, zh: '零售商', en: 'Retailer'},
                '4': {key: 4, zh: '门店', en: 'Store',},
            },
        },
    },

    AUTH_LIST_TEMP: [ // 权限
        { list: [], select: [], key: 'home', name: '总览' },
        { list: [], select: [], key: 'distributor', name: '分销商管理' },
        { list: [], select: [], key: 'agent', name: '零售商管理' },
        { list: [], select: [], key: 'store', name: '门店管理' },
        { list: [], select: [], key: 'account', name: '账户管理' },
        { list: [], select: [], key: 'repair-order', name: '维修单' },
        { list: [], select: [], key: 'customer', name: '客户管理' },
        { list: [], select: [], key: 'user', name: '员工管理' },
        { list: [], select: [], key: 'item', name: '商品管理' },
        { list: [], select: [], key: 'purchase-order', name: '采购订单' },
        { list: [], select: [], key: 'after-sales-order', name: '售后订单' },
        { list: [], select: [], key: 'sales-area', name: '销售区域' },
        { list: [], select: [], key: 'warehouse', name: '仓库' },
        { list: [], select: [], key: 'invoice', name: '出入库单' },
        { list: [], select: [], key: 'supplier', name: '供应商' },
        { list: [], select: [], key: 'material-purchase-order', name: '物料采购单'},
        { list: [], select: [], key: 'stock', name: '库存总览'},
        { list: [], select: [], key: 'material', name: '物料' },
        { list: [], select: [], key: 'material-category', name: '物料分类' },
        { list: [], select: [], key: 'bom', name: 'BOM表' },
        { list: [], select: [], key: 'production-order', name: '生产单' },
        { list: [], select: [], key: 'message', name: '消息' },
        { list: [], select: [], key: 'authority', name: '权限' },
        { list: [], select: [], key: 'role', name: '角色' },
        { list: [], select: [], key: 'file', name: '文件' },
    ],

    ATTACHMENT: {
        TARGET_TYPE: { // 来源类型
            REPAIR_ORDER: 1, // 维修单附件
            PURCHASE_ORDER: 2 // 采购单附件
        }
    },
    WAREHOUSE: {
        TYPE: { //仓库类型
            QUALITY: 1, //成品仓
            DEFECTIVE: 2, //残次仓
            MATERIAL: 3, //物料仓
            CUSTOMIZE: 4, // 广宣品仓
        },
        TYPE_MAP: {
            '1': { key: 1, zh: '成品仓', en: 'Good'},
            '2': { key: 2, zh: '残次仓', en: 'Imperfect' },
            '3': { key: 3, zh: '物料仓', en: 'Material'},
            '4': { key: 4, zh: '广宣品仓',en: 'Other'},
        },
	    IS_AUTHORITY_WAREHOUSE: {
		    YES: 1,
		    NO: 0,
	    },
    },
    STOCK_RECORD: { // 出入库明细
        COMMODITY_TYPE: {
            ITEM: 10,
            ENTITY: 20,
            MATERIALS: 30,
            CUSTOMIZE: 40,
        },
        COMMODITY_TYPE_MAP: {
            '10': { key: 10, zh: '商品', en: 'No instance'},
            '30': { key: 30, zh: '物料', en: 'Materiel'},
            '40': { key: 40, zh: '广宣品', en: 'Other' },
        },
	    COMMODITY_TYPE_OLD_MAP: {
		    '10': { key: 10, zh: '无实例商品', en: 'No instance'},
		    '20': { key: 10, zh: '有实例商品', en: 'No instance'},
	    },
        TYPE: {
            IN: 1, //入库
            OUT: 2, //出库
        },
        TYPE_MAP: {
            '1': {key: 1, zh: '入库', en: 'Inbound'},
            '2': {key: 2, zh: '出库', en: 'Outbound'},
        },
        STATUS: { //出入库单状态
            INIT: 0, //初始化
	        WAIT_AUDIT: 10, //待审核
	        FINANCE_PASS: 20, //财务审核
            AUDIT_PASS: 30, //审核通过


            CLOSE: 40, //已完成
	        DELIVERY: 50, //已完成
            AUDIT_REFUSE: -10,//审核失败
            CANCEL: -20, // 取消
        },
        STATUS_MAP: {
            '0': {key: 0, zh: '待提交', en: 'Awaiting commit',color: 'orange'},
            '10': {key: 10, zh: '待审核', en: 'Awaiting review', color: 'yellow'},
	        '20': {key: 30, zh: '财务审核通过', en: 'Financial review passed', color: 'purple'},
            '30': {key: 20, zh: '仓库审核通过', en: 'Admin review passed', color: 'blue'},
            '40': {key: 40, zh: '已完成', en: 'In the warehouse', color: 'green'},
	        '50': {key: 40, zh: '已发货', en: 'Delivery', color: 'green'},
	        '60': {key: 40, zh: '已收货', en: 'Take delivery', color: 'green'},
            '-10': {key: -10, zh: '审核失败', en: 'Review failed', color: 'red'},
            '-20': {key: -20, zh: '已取消', en: 'Cancelled', color: 'grey'},
        },
        STATUS_LIST: [
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
            MATERIAL_PURCHASE: 60, //物料采购单
            WAREHOUSE_TRANSFER: 70, //仓库调货单
            ITEM_PURCHASE: 80, // 商品采购单 todo:零时加的不一定是这个值
        },
        SOURCE_TYPE_ADMIN_MAP: {
            '10': {key: 10, text: '管理员操作', color: 'yellow'},
            '15': {key: 15, text: '生产单', color: 'blue'},
            '30': {key: 30, text: '售后单', color: 'yellow'},
            '40': {key: 40, text: '调货单', color: 'blue'},
            '50': {key: 50, text: '维修单', color: 'orange'},
            '60': {key: 60, text: '物料采购单', color: 'yellow'},
            '70': {key: 70, text: '仓库调货单', color: 'blue'},
        },
        SOURCE_TYPE_MAP: {
            '10': {key: 10, zh: '管理员操作', en: 'Admin action', color: 'yellow'},
            '20': {key: 20, zh: '采购单', en: 'Purchase order',color: 'orange'},
            '30': {key: 30, zh: '售后单', en: 'After-sale order', color: 'yellow'},
            '50': {key: 50, zh: '维修单', en: 'Repair order',color: 'orange'},
        },
        SOURCE_FORM: { //出入库单变更来源
            UNKNOWN: 0,
            ADMIN: 1,
            REPAIR_ORDER_ITEM: 21,
            INVOICE: 31,
        },
        SOURCE_FORM_MAP: {
            '0': {key: 0, zh: '未知操作', en: 'Unknown operation'},
            '1': {key: 1, zh: '管理员操作', en: 'Admin action'},
            '21': {key: 21, zh: '维修单', en: 'Repair Order'},
            '31': {key: 31, zh: '出入库单', en: 'Inbound and outbound order'},
        },
        AUDIT_TYPE: {
            STOREKEEPER: 1, //仓库管理员
            FINANCE: 2,//财务
        },
        AUDIT_TYPE_MAP: {
            1: '仓库管理员',
            2: '财务',
        },
        AUDIT: { //审核结果
            PASS: 1,
            REFUSE: 2
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
            '1': {key: 1, zh: '充值', en: 'Recharge'},
            '2': {key: 2, zh: '扣款', en: 'Deduction'},
        },
        SUBJECT: {
            MANAGER_ADJUSTMENT: 101,
            PURCHASE_ORDER: 201,
            REPAIR_ORDER_DEDUCTIONS: 501,
        },
        SUBJECT_MAP: {
            '101': '管理员操作',
            '201': '采购单',
            '501': '维修单',
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
            '0'   : { key: 0, color: 'purple', zh: '待提交', en: 'Wait submit'},
            '100' : { key: 100, color: 'orange', zh: '待审核', en: 'Wait review'},
            '200' : { key: 200, color: 'blue', zh: '处理中', en: 'In process'},
            '600' : { key: 600, color: 'green', zh: '已完成', en: 'Completed'},
            '-100': { key: -100, color: 'gray', zh: '已取消', en: 'Canceled'},
            '-200': { key: -200, color: 'red', zh: '审核失败', en: 'Review failed'},
        },
        TYPE: {
            ONLY_REFUND: 1,       // 仅退款
            REFUND_WITH_ITEMS: 2, // 退款且退货
            EXCHANGE_ITEMS: 3,    // 换货
            REISSUE: 4,           // 补发
        },
        TYPE_MAP: {
            '1' : { key: 1, zh: '仅退款', en: 'Refund only'},
            '2' : { key: 2, zh: '退款且退货', en: 'Refund and return'},
            '3' : { key: 3, zh: '换货', en: 'Exchange goods'},
            '4' : { key: 4, zh: '补发', en: 'Reissue'},
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
            '100': { key: 100, zh: '零售商申请退款',en: 'Retailer applies for refund', value: 100 },
            '110': { key: 110, zh: '分销商申请退款',en: 'Distributor applies for refund', value: 110 },
            '120': { key: 120, zh: '门店申请退款',en: 'Store application for refund', value: 120 },
            '200': { key: 200, zh: '后台主动退款',en: 'Backstage active refund', value: 200 },
        },
        STATUS: {
            WAIT_AUDIT: 10, // 待审核
            AUDIT_PASS: 20, // 审核通过
            SUCCESS: 40, // 退款成功
            AUDIT_REFUSE: -10, // 审核失败
            CANCEL: -20, // 已取消
        },
        STATUS_MAP: {
            '10': { key: 10, zh: '待审核',en: 'Awaiting review',color: 'yellow'},
            '20': { key: 20, zh: '审核通过',en: 'Approved', color: 'blue'},
            '40': { key: 40, zh: '退款成功',en: 'Refund completed', color: 'green'},
            '-10': { key: -10, zh: '审核失败',en: 'Review failed', color: 'red'},
            '-20': { key: -10, zh: '已取消',en: 'Canceled', color: 'grey'},
        },
        /* STATUS_COLOR_MAP: {
             '10': 'yellow',
             '20': 'blue',
             '40': 'green',
             '-10': 'red',
             '-20': 'grey'
         },*/
        SEARCH_TYPE: {
            SELF: 1, //本账户申请的退款单
            CHILDREN: 2, //待审核的退款单
        },
    },

    BOM: {
        TARGET_TYPE: {
            ITEM: 1,     //商品
            MATERIAL: 2, //物料
        },
        TARGET_TYPE_MAP: {
            '1': {text: '商品'},
            '2': {text: '物料'},
        }
    },
    PRODUCTION: {
        STATUS: {
            INIT: 0,  // 待生产
            PRODUCTION: 100,  // 生产中
            COMPLETE: 200, // 已完成
            CANCEL: -100,  // 已取消
        },
        STATUS_MAP: {
            '0':   { text: '待生产', color: 'yellow' },
            '100': { text: '生产中', color: 'orange' },
            '200': { text: '已完成', color: 'green' },
            '-100':{ text: '已取消', color: 'gray' },
        }
    },
    SUPPLIER: { //供应商
        PAYMENT_TYPE: {
            FIFTEEN: 20,
            THIRTY: 30,
            FORTY_FIVE: 40,
            SIXTY: 50,
            CASH_AND_DELIVERY: 10,
        },
        PAYMENT_TYPE_MAP: {
            '10': '款到发货',
            '20': '见票15天',
            '30': '见票30天',
            '40': '见票45天',
            '50': '见票60天'
        },
	    PAYMENT_TYPE_LIST: [
		    {value: 10 , name: '款到发货'},
		    {value: 20 , name: '见票15天'},
		    {value: 30 , name: '见票30天'},
		    {value: 40 , name: '见票45天'},
		    {value: 50 , name: '见票60天'},
	    ],
        SUPPLIER_TYPE: {
            QUALIFIED: 10,
            DISPOSABLE: 20,
            OBSOLETE: 30,
        },
        SUPPLIER_TYPE_MAP: {
            '10': '合格',
            '20': '一次性',
            '30': '淘汰',
        },
        SUPPLIER_TYPE_COLOR_MAP: {
            '10': 'green',
            '20': 'orange',
            '30': 'grey',
        },
        STATUS_PURCHASE: {
            ON_PURCHASE: 1, //正常采购
            OFF_PURCHASE: 2
        },
        STATUS_PURCHASE_MAP: {
            '1': '采购正常',
            '2': '采购冻结',
        },
        STATUS_PURCHASE_COLOR_MAP: {
            '1': 'green',
            '2': 'red',
        },
        STATUS_SETTLEMENT: {
            ON_SETTLEMENT: 1, //正常结算
            OFF_SETTLEMENT: 2
        },
        STATUS_SETTLEMENT_MAP: {
            '1': '结算正常',
            '2': '结算冻结',
        },
        STATUS_SETTLEMENT_COLOR_MAP: {
            '1': 'green',
            '2': 'red',
        },

    },
    MATERIAL_PURCHASE: {
        STATUS: {
            INIT: 0, //初始化
            SUBMIT: 100, //已提交待审核
            PASS: 200, //审核通过
            PART: 400,//部分入库
            WAREHOUSE_AUDIT: 450, //一键入库，等待仓库审核
            N_WAREHOUSE: 500,  //入库完成
            REFUSE: -200,//审核失败
            CANCEL: -100, // 取消
        },
        STATUS_MAP: {
            '0': '待提交',
            '100': '待审核',
            '200': '审核通过',
            '400': '部分入库',
            '450': '等待仓库审核',
            '500': '全部入库',
            '-200': '审核未通过',
            '-100': '已取消'
        },
        STATUS_COLOR_MAP: {
            '0': 'orange',
            '100': 'yellow',
            '200': 'blue',
            '400': 'purple',
            '450': 'purple',
            '500': 'green',
            '-200': 'red',
            '-100': 'grey'
        },
        /*        STATUS_LIST: [
                    { text: '待提交', value: 0 },
                    { text: '待审核', value: 100 },
                    { text: '审核通过', value: 200 },
                    { text: '已入库', value: 500 },
                    { text: '审核未通过', value: -200 },
                    { text: '已取消', value: -100 },
                ],*/
    },
    WAREHOUSE_TRANSFER: {
        STATUS: {
            INIT: 5,
            APPLICANT_AUDIT: 10,
            SENDER_AUDIT: 20,
            AUDIT_PASS: 30,
            DELIVERED: 40,
            RECEIVED: 50,
            CLOSE: 60,
            APPLICANT_AUDIT_REFUSE: -10,
            SENDER_AUDIT_REFUSE: -20,
            CANCEL: -30,
        },
        STATUS_MAP: {
            '5': { key: 5, color: 'yellow', text: '待提交',value: '0'},
            '10': { key: 10, color: 'orange', text: '收货方审核',value: '0'},
            '20': { key: 20, color: 'orange', text: '发货方待审核',value: '0'},
            '30': { key: 30, color: 'blue', text: '待发货',value: '0'},
            '40': { key: 40, color: 'purple', text: '已发货',value: '0'},
            '50': { key: 50, color: 'purple', text: '已收货',value: '0'},
            '60': { key: 60, color: 'green', text: '已完成', value: '0'},
            '-10': { key: -10, color: 'red', text: '收货方审核失败', value: '0'},
            '-20': { key: -20, color: 'red', text: '发货方审核失败', value: '0'},
            '-30': { key: -30, color: 'grey', text: '已取消', value: '0'},
        },
        COMMODITY_TYPE: {
            ITEM: 10,
            MATERIALS: 30,
        },
        COMMODITY_TYPE_MAP: {
            10: '商品',
            30: '物料',
        },
    }
};

export default Const;

import dayjs from 'dayjs';
import defult_img from '@images/defult_img.png';
import default_img2 from '@images/default_img2.png';
import defult_mall_img from '@images/defult_mall_img.png';
import defult_org from '@images/defult_org.png';
import defult_item from '@images/defult_item.png';
import defult_file from '@images/defult_file.png';
import constModules from './modules/const/index';
import EuropeData from '../../public/ext/Europe.json';
// let OSS_POINT = 'https://horwin.oss-cn-hangzhou.aliyuncs.com' // 正式
let OSS_POINT = 'https://horwin.oss-cn-hangzhou.aliyuncs.com/'; //
let URL_POINT = 'http://eos-dev-api.horwincloud.com'; // 测试服
// let URL_POINT = 'http://10.0.0.100'  // zy
let DISABLELOG = false;

switch (window.location.hostname) {
    case 'eos.horwincloud.com':
        URL_POINT = 'https://eos-api.horwincloud.com'; // 新正式服
        DISABLELOG = true;
        break;
    case 'eos-release.horwincloud.com':
        URL_POINT = 'https://eos-api-release.horwincloud.com'; // 预发环境
        break;
    case 'eos-dev.horwincloud.com':
        URL_POINT = 'https://eos-dev-api.horwincloud.com'; // 新测试服
        break;
    case '10.0.0.213':
        URL_POINT = 'https://10.0.0.213:8889';
        // URL_POINT = 'http://eos-dev-api.horwincloud.com' // 测试服
        URL_POINT = 'https://10.0.0.65:8889';
        // URL_POINT = 'http://eos-dev-api.horwincloud.com' // 测试服
        // URL_POINT = 'http://eos-api.horwincloud.com' // 正式服
        break;
    case '10.10.12.83':
        URL_POINT = 'http://10.10.12.65:8889';
        // URL_POINT = 'http://eos-dev-api.horwincloud.com' // 测试服
        // URL_POINT = 'http://eos-api.horwincloud.com' // 正式服
        // URL_POINT = 'http://10.10.12.75:8889' // zwq
        // URL_POINT = 'https://eos-api-release.horwincloud.com' // 预发环境
        break;
    case 'eos.hw.innotick.com':
        URL_POINT = 'https://eos-api.horwincloud.com'; // 老正式服
        break;
    case 'eos-dev.hw.innotick.com':
        URL_POINT = 'https://eos-dev-api.horwincloud.com'; // 老测试服
        break;
    case 'eos-release.horwincloud.com':
        URL_POINT = 'https://eos-api-release.horwincloud.com'; // 预发环境
        break;
    default:
        URL_POINT = 'https://eos-dev-api.horwincloud.com'; // 测试服
        // URL_POINT = 'https://eos-api.horwincloud.com'; // 新正式服
        // URL_POINT = 'https://eos-api-release.horwincloud.com'; // 预发环境
        // URL_POINT = 'http://10.0.0.170:8889'
        URL_POINT = 'http://10.10.12.194:8889';
        // URL_POINT = 'http://10.10.12.75:8889'
        break;
}

let Const = {
    ...constModules,
    NET: {
        URL_POINT: URL_POINT,
        OSS_POINT: OSS_POINT,
        FILE_URL_PREFIX: `${OSS_POINT}/`,
        FILE_UPLOAD_END_POINT: `${URL_POINT}/core/1/file/file-upload`,
        DISABLELOG,
    },
    DATA: {
        // 本地存储
        KEY_PREFIX: 'haowan.admin.data.',
        KEY_TOKEN: 'token',
        KEY_USER: 'user',
        KEY_ORG_ID: 'org.id',
        KEY_ORG_TYPE: 'org.type',
        KEY_LOGIN_TYPE: 'login.type',
        KEY_USER_TYPE: 'user.type',
        KEY_AUTHORITY_LIST: 'authority.list',
        KEY_CURRENCY: 'org.currency',
        KEY_FIELD_DISPLAY: 'field.display',
        KEY_LANGUAGE: 'language',
        TAB_POSITION: 'tab.position',
        COUNTRY_CODE: 'country.code',
        GROUP_ID: 'group.id',
        SUPER_ADMIN: 'super_admin',
        CUSTOMER_SERVICE_CLUE: 'customer-service-clue',
        SUPPLY_CHAIN: 'supply-chain',
        SUPPLY_Daft_CHAIN: 'supply-draft-chain',
        SUPPLY_STEP: 'supply-step',
        SUPPLY_ISREAD: 'supply-isread',
        SUPPLY_SUBMITED: 'supply-submited',
        USER_TYPE_LIST: 'user-type-list',
        LOGIN_MES: 'login-mes',
        SALES_DATA: 'sales-data',
        GOODS_DRAFT: 'goods-draft',
        CART_DATA: 'cart-data',

        // 这两个是问询单新消息存储(正常来说是后端, 这边先前端做)
        ADMIN_NEW_MSG: 'admin-new-msg',
        DISTRIBUTOR_NEW_MSG: 'distributor-new-msg',
        REPORT_DATA: 'report_data',
        AUTHFIRST: 'authfirst', // 销售/售后/生产/CRM/供应链 存储信息
    },
    DEFULT_IMG: {
        1: defult_img,
        2: defult_item,
        3: defult_org,
        4: defult_file,
        5: defult_mall_img,
        6: default_img2,
    },

    TIME_PICKER_DEFAULT_VALUE: {
        BEGIN: dayjs().second(0).minute(0).hour(0),
        B_TO_B: {
            defaultValue: [dayjs().second(0).minute(0).hour(0), dayjs().second(0).minute(0).hour(0)],
        },
        B_TO_E: {
            defaultValue: [dayjs().second(0).minute(0).hour(0), dayjs().second(59).minute(59).hour(23)],
        },
    },
    CONTINENT_MAP: {
        亚洲: 'Asia',
        欧洲: 'Europe',
        非洲: 'Africa',
        北美洲: 'North America',
        南美洲: 'South America',
        大洋洲: 'Oceania',
        南极洲: 'Antarctica',
    },
    COUNTRY_LIST: [
        // 国家列表
        {
            short: 'CN',
            name: '中国',
            en: 'China',
            tel: '86',
            pinyin: 'zg',
        },
    ],
    CONTINENT_COUNTRY_LIST: [
        // 大洲>国家列表
        {
            value: '亚洲',
            lable: 'Asia',
            children: [
                {
                    value: '中国',
                    lable: 'China',
                },
            ],
        },
        {
            value: '欧洲',
            lable: 'Europe',
            children: [
                {
                    value: '法国',
                    lable: 'France',
                },
            ],
        },
        {
            value: '非洲',
            lable: 'Africa',
            children: [
                {
                    value: '印度',
                    lable: 'India',
                },
            ],
        },
    ],

    USER: {
        // 用户、账号、用户
        TYPE: {
            ADMIN: 10, // 平台方
            DISTRIBUTOR: 15, //分销商
            AGENT: 20, // 零售商
            STORE: 30, // 门店
            SUPPLIER: 60, // 供应商
            CUSTOMER: 100, // 顾客
        },
        TYPE_MAP: {
            10: { key: 10, zh: '平台方', en: 'Admin' },
            15: { key: 15, zh: '分销商', en: 'Distributor' },
            20: { key: 20, zh: '零售商', en: 'Retailer' },
            30: { key: 30, zh: '门店', en: 'Store' },
            60: { key: 60, zh: '供应商', en: 'Supplier' },
            /*  10: '平台方',
              15: '分销商',
              20: '零售商',
              30: '门店',
              100: '顾客',*/
        },
    },
    LOGIN: {
        // 登录
        TYPE: {
            ADMIN: 10, // 管理员
            DISTRIBUTOR: 15, //分销商
            AGENT: 20, // 零售商
            STORE: 30, // 门店
            SUPPLIER: 60, // 供应商
        },
        TYPE_LIST: [
            { value: 60, zh: '供应商', en: 'Supplier' },
            { value: 30, zh: '门店', en: 'Store' },
            { value: 20, zh: '零售商', en: 'Retailer' },
            { value: 15, zh: '分销商', en: 'Distributor' },
            { value: 10, zh: '平台方', en: 'Admin' },
        ],
        TYPE_MAP: {
            10: 'ADMIN',
            15: 'DISTRIBUTOR',
            20: 'AGENT',
            30: 'STORE',
            60: 'SUPPLIER',
            100: 'CUSTOMER',
        },
        ORG_TYPE: {
            ADMIN: 10,
            DISTRIBUTOR: 15,
            AGENT: 20,
            STORE: 30,
            SUPPLIER: 60, // 供应商
        },
        ROUTER_TYPE: {
            SALES: 1, // 销售
            AFTER: 2, // 售后
            PRODUCTION: 3, // 生产
            CRM: 4, // CRM
            SUPPLIER: 5, // 供应商
            SYSTEM: 6, // 系统管理
            FINANCE: 7, // 财务
        },
    },
    LOGINMALL: {
        // 登录
        TYPE_LIST: [
            { value: 15, zh: '分销商', en: 'Distributor' },
            { value: 10, zh: '平台方', en: 'Admin' },
        ],
        HEADERMENU: [
            { key: '1', nameLang: 'dashboard', path: '/dashboard/index' },
            { key: '2', nameLang: 'distribution', path: '/distributor/distributor-detail-sp' },
            { key: '3', nameLang: 'after_sales', path: '/aftersales' },
            { key: '4', nameLang: 'maintenance', path: '/repair' },
            { key: '5', nameLang: 'feedback', path: '/feedback' },
            { key: '6', nameLang: 'accounts', path: '/wallet' },
            { key: '7', nameLang: 'customers', path: '/eos-customer' },
            { key: '8', nameLang: 'coc_certificate_management', path: '/coc/coc-certificate' },
            { key: '9', nameLang: 'system_setting', path: '/crm-setting' },
            { key: '10', nameLang: 'system_management', path: '/system' },
        ],
        HEADERACCESMENU: [],
        FOOTERMENUONE: [
            { lang: 'coc_download', path: '/coc/coc-certificate' },
            // { lang: 'photo_video' },
            { lang: 'news', path: '/mall/all-articles' },
            // { lang: 'local_deals' },
        ],
        // FOOTERMENU: [{ lang: 'conditions' }, { lang: 'legal' }],
    },
    FLAG: {
        YES: 1,
        NO: 0,
    },

    ORG_STATUS_LIST: [
        // 组织状态
        { value: 1, zh: '启用', en: 'enable' },
        { value: 0, zh: '禁用', en: 'disable' },
    ],
    TRANSFER_STATUS_LIST: [
        // 组织转单状态
        { text: '接受转单', value: 1 },
        { text: '不接受转单', value: 0 },
    ],

    REPAIR: {
        // 维修工单
        // 工单类型
        DEVICE_LIST: [
            { zh: '整车', en: 'finished automobile', value: 1 },
            { zh: '零部件', en: 'components and parts', value: 2 },
        ],
        DEVICE_LIST_OBJ: {
            1: { zh: '整车', en: 'finished automobile', value: 1 },
            2: { zh: '零部件', en: 'components and parts', value: 2 },
        },
        DEVICE_MAP: {
            vehicle: 1, // 整车
            Parts: 2, // 零部件
        },
        DEVICE: {
            FINISHED_AUTOMOBILE: 1,
            COMPONENTS_AND_PARTS: 2,
        },
        // 工单分类
        TYPE_LIST: [
            { zh: '维修工单', en: 'repair order', value: 1 }, // 普通工单
            { zh: '特批工单', en: 'special repair order', value: 2 },
        ],
        // TYPE_MAP: {
        //     1: '维修工单',
        //     2: '特批订单',
        // },
        TYPE_MAP: {
            1: { zh: '维修工单', en: 'repair order', value: 1 }, // 普通工单
            2: { zh: '特批工单', en: 'special repair order', value: 2 },
        },
        TYPE: {
            TYPE_COMMON: 1,
            TYPE_SPECIAL: 2,
        },
        // 维修单类别
        CATEGORY_LIST: [
            { zh: '维修', en: 'repair', value: 1 },
            // { zh: '换车', en: 'replace car', value: 2 },
            { zh: '开箱损', en: 'unpacking damage', value: 3 },
            // { zh: '电池维修', en: 'battery', value: 4 },
        ],
        // 维修单类别
        CATEGORY_LIST_MAP: {
            1: { zh: '维修', en: 'repair', value: 1 },
            // { zh: '换车', en: 'replace car', value: 2 },
            3: { zh: '开箱损', en: 'unpacking damage', value: 3 },
            // { zh: '电池维修', en: 'battery', value: 4 },
        },
        LOG_MAP: {
            201: { zh: '创建', en: 'Create', value: 201 },
            212: { zh: '审核', en: 'Audit Success', value: 212 },
            211: { zh: '审核不通过', en: 'Audit Fail', value: 211 },
            205: { zh: '取消', en: 'Cancel', value: 205 },
            206: { zh: '作废', en: 'Voided', value: 206 },
        },
        // 维修单类别
        PARTS_LIST: [
            { zh: '质保', en: 'quality guarantee', value: 5 },
            { zh: '开箱损', en: 'dead on arrival', value: 3 },
            { zh: '电池维修', en: 'battery', value: 4 },
        ],
        // 工单帐类
        SERVICE_TYPE: {
            IN_REPAIR_TIME: 1,
            OUT_REPAIR_TIME: 2,
            SPECIAL_REPAIR_TIME: 3,
        },
        SERVICE_TYPE_LIST: [
            { zh: '保内', en: 'under warranty', value: 1 },
            { zh: '保外', en: 'out of warranty', value: 2 },
        ],
        SERVICE_TYPE_MAP: {
            0: { zh: '特殊', en: 'Special', color: 'yellow' },
            1: { zh: '保内', en: 'Under warranty', color: 'green' },
            2: { zh: '保外', en: 'Out of warranty', color: 'red' },
            3: { zh: '特殊', en: 'Special', color: 'yellow' },
        },
        // 赔付方式
        PAYMETHOD_TYPE_MAP: {
            1: { zh: '赔付配件', en: 'Pay The Spare Parts' },
            2: { zh: '赔付至账户', en: 'Pay The Claim To The Account' },
        },
        // 工单类型
        CATEGORY_TYPE_MAP: {
            1: { zh: '维修', en: 'Repair' },
            2: { zh: '换车', en: 'Transfer' },
            3: { zh: '开箱损', en: 'Unpacking Damage' },
            2: { zh: '电池维修', en: 'Battery Maintenance' },
            2: { zh: '质保', en: 'Quality Guarantee' },
        },
        // 维修方式
        CHANNEL_LIST: [
            { zh: '上门', en: 'home repair', value: 1 },
            { zh: '到店', en: 'repair in store', value: 2 },
            { zh: '寄修', en: 'send by courier', value: 3 },
        ],
        CHANNEL_MAP: {
            1: { zh: '上门', en: 'Home repair' },
            2: { zh: '到店', en: 'Repair in store' },
            3: { zh: '寄修', en: 'Send by courier' },
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
            1: { zh: '维修', en: 'Repair' },
            2: { zh: '更换', en: 'Replace' },
            3: { zh: '开箱损', en: 'unpacking damage' },
            4: { zh: '电池维修', en: 'battery' },
        },
        // 优先级
        PRIORITY_LIST: [
            { zh: '高', en: 'high', value: 1 },
            { zh: '中', en: 'medium', value: 2 },
            { zh: '低', en: 'low', value: 3 },
        ],
        PRIORITY_MAP: {
            1: { color: 'red', zh: '高', en: 'high' },
            2: { color: 'blue', zh: '中', en: 'medium' },
            3: { color: 'green', zh: '低', en: 'low' },
        },
        // 状态
        STATUS: {
            WAIT_DETECTION: 30, // 订单创建，等待检测
            WAIT_REPAIR: 40, // 维修中
            REPAIR_END: 45, // 维修完成
            SETTLEMENT: 60, // 已结算，待审核(零售商创建)
            SETTLEMENT_DISTRIBUTOR: 70, // 已结算，待审核(分销商创建)
            DISTRIBUTOR_AUDIT_SUCCESS: 80, // 分销商审核通过，待平台方审核
            AUDIT_SUCCESS: 90, // 平台方审核通过
            DISTRIBUTOR_WAREHOUSE: 95, // 分销商故障件入库，待平台方审核故障件
            FINISH: 100, // 保外结算直接完成，不需要审核 从40直接过来
            FAULT_ENTITY_AUDIT: 105, // 平台方故障件审核成功
            SAVE_TO_INVOICE: 110, // 平台方故障件入库
            CLOSE: -10, // 订单取消
            AUDIT_FAIL: -30, // 审核未通过
            FAULT_ENTITY_AUDIT_FAIL: -40, // 故障件审核未通过
            STATUS_VOIDED: -50, // 已作废 不可再次编辑
            STATUS_TIMEOUT_CLOSE: -60, // 已关闭 审核不通过后超时未处理的工单的状态
        },
        STATUS_MAP: {
            30: { key: 30, color: 'yellow', zh: '待检测', en: 'Waiting detect' },
            40: { key: 40, color: 'blue', zh: '维修中', en: 'Under repair' },
            45: { key: 40, color: 'blue', zh: '待结算', en: 'Waiting settlement' },
            60: { key: 60, color: 'orange', zh: '已结算待审核', en: 'Settled accounts and awaiting audit' },
            70: { key: 70, color: 'orange', zh: '已结算待审核', en: 'Settled accounts and awaiting audit' },
            80: { key: 80, color: 'purple', zh: '分销商审核通过', en: 'Passed audit' },
            90: { key: 90, color: 'purple', zh: '平台审核通过', en: 'Passed audit' },
            95: { key: 95, color: 'purple', zh: '分销商已入库' },
            100: { key: 100, color: 'blue', zh: '已完成', en: 'Finished settle accounts' },
            105: { key: 105, color: 'blue', zh: '故障件审核通过', en: '' },
            110: { key: 110, color: 'green', zh: '平台方已入库' },
            '-10': { key: -10, color: 'gray', zh: '已取消', en: 'Cancelled' },
            '-30': { key: -30, color: 'red', zh: '工单审核未通过', en: 'Failed audit' },
            '-40': { key: -40, color: 'red', zh: '故障件审核未通过' },
        },
        NEW_STATUS_MAP: {
            30: { key: 30, color: 'yellow', zh: '待审核', en: 'Awaiting Audit' },
            40: { key: 40, color: 'blue', zh: '维修中', en: 'Under repair' },
            45: { key: 40, color: 'blue', zh: '待结算', en: 'Waiting settlement' },
            60: { key: 60, color: 'orange', zh: '已结算待审核', en: 'Settled accounts and awaiting audit' },
            70: { key: 70, color: 'orange', zh: '已结算待审核', en: 'Settled accounts and awaiting audit' },
            80: { key: 80, color: 'purple', zh: '分销商审核通过', en: 'Passed audit' },
            90: { key: 90, color: 'green', zh: '通过', en: 'Passed' },
            100: { key: 100, color: 'blue', zh: '已完成', en: 'Finished settle accounts' },
            105: { key: 105, color: 'blue', zh: '故障件审核通过', en: '' },
            110: { key: 110, color: 'green', zh: '平台方已入库' },
            '-10': { key: -10, color: 'gray', zh: '已取消', en: 'Cancelled' },
            '-30': { key: -30, color: 'red', zh: '不通过', en: 'Rejected' },
            '-40': {
                key: -40,
                color: 'red',
                zh: '故障件审核未通过',
                en: 'The faulty component fails to pass the audit',
            },
            '-100': { key: -100, color: 'gray', zh: '已取消', en: 'Cancelled' },
            '-50': { key: -50, color: 'red', zh: '已作废', en: 'Have been voided' },
            '-60': { key: -60, color: 'gray', zh: '超时不通过', en: 'Timeout fail' },
        },
        // 故障类型 - 放弃使用
        FAULT_OPTIONS_MAP: {
            1: '电池故障',
            2: '发动机故障',
            3: '轮胎故障',
            4: '刹车故障',
            5: '转向灯故障',
            6: '仪表盘故障',
            7: '尾灯故障',
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
        AUDIT: {
            //审核结果
            PASS: 1,
            REFUSE: 2,
        },
        // 工单审核
        COMPENSATION: {
            COMPENSATION_METHOD: {
                1: { value: 1 }, // 赔付方式 赔付到配件
                2: { value: 2 }, // 赔付方式 赔付到账户
            },
        },
    },
    INVOICE_ITEM: {
        TARGET_TYPE: {
            ITEM: 10,
            MATERIAL: 30,
        },
        TARGET_TYPE_MAP: {
            10: { key: 10, zh: '商品', en: 'Item' },
            30: { key: 30, zh: '物料', en: 'Material' },
            // '3':  { key: 3, zh: '维修转单', en: '1' },
        },
    },
    REPAIR_ITEM: {
        //维修商品
        TYPE: {
            ADD: 1,
            REPLACE: 2,
            TRANSFER: 3,
        },
        TYPE_MAP: {
            1: { key: 1, zh: '新增零件', en: 'New parts' },
            2: { key: 2, zh: '更换零件', en: 'Replace' },
            // '3':  { key: 3, zh: '维修转单', en: '1' },
        },
    },

    FEEDBACK: {
        // 状态
        STATUS: {
            INIT: 0,
            WAIT_AFTER_SALES_AUDIT: 100,
            AFTER_SALES_AUDIT_FAIL: 110,
            WAIT_AFTER_SALES_DESC: 150,
            WAIT_FEEDBACK: 200,
            WAIT_QUALITY_AUDIT: 300,
            QUALITY_AUDIT_FAIL: 310,
            WAIT_AFTER_FEEDBACK: 400,
            CLOSE: 500,
            AUDIT_FAIL: -10,
            CANCEL: -1,
        },
        STATUS_MAP: {
            0: { key: 0, color: 'yellow', zh: '待提交', en: 'Pending submission' },
            100: { key: 100, color: 'blue', zh: '等待平台售后审核', en: 'Awaiting after-sales audit' },
            110: { key: 110, color: 'blue', zh: '待修改', en: 'Pending modification' },
            150: { key: 150, color: 'blue', zh: '等待售后填写故障信息', en: 'Waiting for after-sale filling' },
            200: { key: 200, color: 'orange', zh: '等待质量反馈', en: 'Waiting for quality feedback' },
            300: { key: 300, color: 'purple', zh: '等待质量审核', en: 'Waiting for quality audit' },
            310: { key: 300, color: 'purple', zh: '等待修改反馈', en: 'Waiting for modification feedback' },
            400: { key: 400, color: 'purple', zh: '等待售后反馈', en: 'Waiting for after-sales feedback' },
            500: { key: 500, color: 'blue', zh: '已完成', en: 'Finished' },
            '-10': { key: -10, color: 'blue', zh: '审核失败', en: 'Audit failed' },
            '-1': { key: -1, color: 'gray', zh: '已取消', en: 'Canceled' },
        },
        SOURCE_TYPE: {
            REPAIR_ORDER: 1,
        },
    },

    ACTION_LOG: {
        // 操作记录
        SOURCE_TYPE: {
            PURCHASE_ORDER: 10,
            REPAIR_ORDER: 20,
            AFTER_SALES_ORDER: 40,
            QUALITY_FEEDBACK: 50,
        },
        TYPE_MAP: {
            201: { key: 201, zh: '维修单创建', en: 'Create repair order' },
            202: { key: 202, zh: '维修单信息完善/修改', en: 'Information improvement/modification' },
            204: { key: 204, zh: '维修单删除', en: 'Deleted' },
            205: { key: 205, zh: '维修单取消', en: 'Canceled' },
            212: { key: 212, zh: '维修单审核', en: 'Review' },
            301: { key: 301, zh: '维修检测', en: 'Detection' },
            213: { key: 213, zh: '增加故障零件', en: 'Add faulty parts' },
            215: { key: 215, zh: '删除故障零件', en: 'Deleted faulty parts' },
            216: { key: 216, zh: '维修完成', en: 'Repair is complete' },
            217: { key: 217, zh: '结算完成', en: 'Settlement completed' },

            510: { key: 510, zh: '采购单修改', en: 'Purchase order modification' },

            601: { key: 601, zh: '反馈单创建', en: 'Feedback ticket creation' },
            602: { key: 601, zh: '反馈单提交', en: 'Feedback submission' },
            603: { key: 601, zh: '反馈单修改', en: 'Feedback form modification' },
            611: { key: 601, zh: '反馈单平台审核通过', en: 'Feedback single platform approved' },
            612: { key: 601, zh: '反馈单平台审核不通过', en: 'Feedback single platform review failed' },
            613: { key: 601, zh: '反馈单平台审核后关闭', en: 'Feedback single platform will be closed after review' },
            614: {
                key: 601,
                zh: '反馈单平台审核后修改',
                en: 'Modification after the feedback form is reviewed by the platform',
            },
            621: { key: 601, zh: '反馈单平台质量审核通过', en: 'Feedback single platform quality review passed' },
            622: { key: 601, zh: '反馈单平台质量审核不通过', en: 'Feedback single platform quality review failed' },
            623: {
                key: 601,
                zh: '反馈单平台质量审核后关闭',
                en: 'Feedback single platform closed after quality review',
            },
            624: {
                key: 601,
                zh: '反馈单平台质量审核后修改',
                en: 'Modification after feedback single platform quality review',
            },
            631: { key: 601, zh: '反馈单平台反馈', en: 'Feedback Single Platform Feedback' },
            632: { key: 601, zh: '反馈单平台反馈审核通过', en: 'Feedback single platform feedback review passed' },
            633: { key: 601, zh: '反馈单平台质量审核不通过', en: 'Feedback single platform quality review failed' },
            634: { key: 601, zh: '反馈单平台反馈修改', en: 'Feedback Single Platform Feedback Modification' },
            650: { key: 601, zh: '反馈单平台反馈关闭', en: 'Feedback Single Platform Feedback Close' },

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

    ITEM: {
        // 商品
        TYPE: {
            PRODUCT: 1, //成品
            COMPONENT: 2, //零件
        },
        TYPE_MAP: {
            1: {
                key: 1,
                zh: '整车',
                en: 'Vehicle',
                value: 1,
                id: 1,
                nameLang: 'products_name1',
                mesLang: 'products_mes1',
                img: 'products-img1',
                path: '/mall/vehicle-list',
            },
            2: {
                key: 2,
                zh: '零部件',
                en: 'Parts',
                value: 2,
                id: 2,
                nameLang: 'products_name2',
                mesLang: 'products_mes2',
                img: 'products-img2',
                path: '/mall/accessories-list',
            },
            3: {
                key: 3,
                zh: '周边',
                en: 'Peripheral',
                value: 3,
                id: 53,
                nameLang: 'products_name3',
                mesLang: 'products_mes3',
                img: 'products-img3',
                path: '/mall/peripheral-list',
            },
            4: {
                key: 4,
                zh: '广宣品',
                en: 'Publicity products',
                value: 4,
                id: 59,
                nameLang: 'products_name1',
                mesLang: 'products_mes1',
                img: 'products-img1',
                path: '/mall/promotional-list',
            },
        },
        MONETARY_TYPE: {
            '￥': 'CNY',
            '€': 'EUR',
            $: 'USD',
            // '£': 'GBP',
        },
        MONETARY_TYPE_MAP: {
            CNY: '￥',
            EUR: '€',
            USD: '$',
            // 'GBP': '£',
        },
        STATUS: {},
        STATUS_LIST: [
            { zh: '全部', en: 'All', value: '1' },
            { zh: '上架中', en: 'Active', value: '0' },
            { zh: '已下架', en: 'Inactive', value: '-1' },
        ],
        FLAG_ENTITY: {
            YES: 1,
            NO: 0,
        },
        FLAG_ENTITY_MAP: {
            1: { key: 1, zh: '是', en: 'Yes' },
            0: { key: 0, zh: '否', en: 'No' },
        },
        TARGET_TYPE_MAP: {
            ITEM: 1, // 商品
            MATERIAL: 2, // 物料
        },
        TARGET_TYPE_LIST: [
            {
                text: '商品',
                value: 1,
            },
            {
                text: '物料',
                value: 2,
            },
        ],
        SEARCH_TYPE: {
            NAME: '1',
            CODE: '2',
        },
        SEARCH_TYPE_MAP: {
            1: { key: 1, zh: '名称', en: 'name' },
            2: { key: 2, zh: '编码', en: 'code' },
        },
        // 商品列表-来源类型
        SOURCE_TYPE: {
            1: { id: 1, value: 'EOS' },
            2: { id: 2, value: 'ERP' },
        },
        // 仓库来源判断 物料 商品详情
        SOURCE_STOCK_TYPE: {
            1: { id: 2, value: 'ERP' },
            2: { id: 1, value: 'EOS' },
        },
        ITEM_SOURCE_MAP: {
            0: { value: 0, zh: '全部', en: 'All' },
            1: { value: 1, zh: 'BOS', en: 'BOS' },
            2: { value: 2, zh: 'U8', en: 'U8' },
        },
    },
    ITEM_ACCESSORY: {
        TARGET_TYPE_MAP: {
            ITEM: 1, // 商品
            MATERIAL: 2, // 物料
        },
        TYPE: {
            BATTERY: 10, // 商品
        },
    },
    PURCHASE: {
        // 采购订单
        // 状态
        STATUS: {
            INIT: 0, // 未知
            SPLIT: 50, // 已拆单
            WAIT_AUDIT: 60, // 等待审核
            WAIT_PAY: 100, // 待支付
            WAIT_DELIVER: 200, // 待发货
            ORDER_TRANSFERRED: 250, // 已转单
            WAIT_TAKE_DELIVER: 300, // 已发货
            TAKE_DELIVER: 330, // 部分收货
            ALL_TAKE_DELIVER: 360, // 全部收货
            DEAL_SUCCESS: 400, // 交易完成
            REVISE: 600,
            REVISE_AUDIT: 630, // 待审核
            CANCEL: -100, // 交易关闭
            RE_REVISE: -200,
        },
        STATUS_MAP: {
            0: { value: '0', key: 0, color: 'red', zh: '未知', en: 'Unknown' },
            50: { value: '0', key: 50, color: 'green', zh: '已拆单', en: 'Separate bill' },
            60: { value: '0', key: 60, color: 'green', zh: '等待审核', en: 'Waiting for audit' },
            100: { value: '0', key: 100, color: 'orange', zh: '待支付', en: 'Waiting for payment' },
            200: { value: '0', key: 200, color: 'orange', zh: '待发货', en: 'Wait for delivery' },
            250: { value: '0', key: 400, color: 'blue', zh: '已转单', en: 'Order transferred' },
            300: { value: '0', key: 300, color: 'blue', zh: '已发货', en: 'Shipped' },
            330: { value: '0', key: 330, color: 'yellow', zh: '部分收货', en: 'Received' },
            360: { value: '0', key: 360, color: 'yellow', zh: '全部收货', en: 'Received' },
            400: { value: '0', key: 400, color: 'green', zh: '交易完成', en: 'Order completed' },
            630: { value: '0', key: 630, color: 'yellow', zh: '待审核', en: 'To audit' },
            150: { value: '0', key: 150, color: 'blue-2', zh: '待生产', en: 'To be produced' },
            160: { value: '0', key: 160, color: 'green-2', zh: '生产中', en: 'In production' },
            '-100': { value: '0', key: -100, color: 'gray', zh: '交易关闭', en: 'Canceled' },
        },
        // 支付方式
        PAY_METHOD: {
            // 1: "支付宝",
            // 2: "微信",
            // 3: "银行转账",
            10: { value: 10, zh: '汇票', en: 'Draft' },
            20: { value: 20, zh: '银行转账', en: 'Bank transfer' },
        },
        PAY_METHOD_LIST: [
            { zh: '汇票', en: 'Draft', value: '10' },
            { zh: '银行转账', en: 'Bank transfer', value: '20' },
        ],
        PAYMENT_STATUS: {
            WAIT_PAY: 100, //待支付
            WAIT_AUDIT: 200, //部分付款
            PAYING: 300, //部分付款
            PAY_ALL: 400, //全部付款
            FAIL_PAY: 500, // 审核未通过
        },
        // 支付状态
        PAYMENT_STATUS_MAP: {
            100: { key: 100, color: 'yellow', zh: '待支付', en: 'Wait to pay', value: '0' },
            200: { key: 200, color: 'orange', zh: '待审核', en: 'Wait to audit', value: '0' },
            300: { key: 300, color: 'blue', zh: '部分付款', en: 'Part of the payment', value: '0' },
            400: { key: 400, color: 'green', zh: '全额付款', en: 'Full payment', value: '0' },
            500: { key: 500, color: 'red', zh: '审核未通过', en: 'Audit failed', value: '0' },
        },
        // 发货状态
        goods_status: {
            200: { value: '0', key: 200, color: 'orange', zh: '待发货', en: 'Wait for delivery' },
            250: { value: '0', key: 400, color: 'blue', zh: '已转单', en: 'Order transferred' },
            300: { value: '0', key: 300, color: 'blue', zh: '已发货', en: 'Shipped' },
            finally: { color: 'green', zh: '已发货', en: 'Shipped' },
        },
        // 收货状态
        Receive_goods: {
            330: { value: '0', key: 330, color: 'yellow', zh: '部分收货', en: 'Received' },
            360: { value: '0', key: 360, color: 'yellow', zh: '全部收货', en: 'Received' },
            finally: { color: 'green', zh: '预计10-12天工作日', en: 'Expected to be completed in 10-12 days' },
        },
        // 审核状态
        examine_status: {
            60: { value: '0', key: 60, color: 'green', zh: '等待审核', en: 'Waiting for audit' },
            630: { value: '0', key: 630, color: 'yellow', zh: '待审核', en: 'To audit' },
            finally: { color: 'green', zh: '审核完成', en: 'Audit completed' },
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
            1: '已评论',
            0: '未评论',
        },
        SEARCH_TYPE: {
            SELF: 1, //本账户的采购单
            CHILDREN: 2, //子级采购单
            ALL: 3, //所有子级采购单
        },
        // 分批发货
        FLAG_PART_SHIPMENT_LIST: [
            { nameLang: 'i.yes', value: 1 },
            { nameLang: 'i.no', value: 2 },
        ],
        FLAG_PART_SHIPMENT_MAP: {
            1: '同意',
            2: '不同意',
        },
        // 转运
        FLAG_TRANSFER_LIST: [
            { nameLang: 'i.yes', value: 1 },
            { nameLang: 'i.no', value: 2 },
        ],
        FLAG_TRANSFER_MAP: {
            1: { key: 1, zh: '同意', en: 'Allowed' },
            2: { key: 2, zh: '不同意', en: 'Disagreed' },
        },
        FLAG_ORDER_TYPE_LIST: {
            10: { key: 10, zh: '售前订单', en: 'Pre-sale orders' },
            20: { key: 20, zh: '售后订单', en: 'After sales order' },
            30: { key: 30, zh: '混合订单', en: 'Mix order' },
            40: { key: 40, zh: '赠品单', en: 'Giveaway order' },
        },
        FLAG_ORDER_TYPE_MAP: {
            10: '售前订单',
            20: '售后订单',
            30: '混合订单',
            40: '赠品单',
        },
        FLAG_ORDER_TYPE: {
            PRE_SALES: 10, // 售前订单
            AFTER_SALES: 20, // 售后订单
            Mix_SALES: 30, // 混合订单
            Gift_SALES: 40, // 赠送订单
        },
        PAY_STATUS_LIST: {
            0: { key: 10, zh: '初始', en: 'Init' },
            10: { key: 10, zh: '等待审核', en: 'Wait to audit' },
            20: { key: 20, zh: '审核通过', en: 'Approved' },
            '-10': { key: -10, zh: '取消', en: 'Cancel' },
            '-20': { key: -20, zh: '审核未通过', en: 'Audit failed' },
        },
        PAY_STATUS: {
            INIT: 0,
            WAIT_TO_AUDIT: 10, // 审核
            APPROVED: 20,
            CANCEL: -10,
            AUDIT_FAILED: -20,
        },
        FLAG: {
            YES: 1,
            NO: 0,
        },
        TYPE: {
            PRE_SALES: 10, // 售前订单 - 整车
            AFTER_SALES: 20, // 售后订单 - 零部件 - 物料
            MIX: 30, // 混合订单 - 整车 + 零部件 - 物料
            GIVEAWAY: 40, //赠品单
        },
        PARENT_TYPE: {
            BREAK: 10, // 拆分订单
            TRANSFER: 20, // 转单
            UPDATE: 30, // 修改
            TYPE_GIVE: 40, // 修改
        },
        // 运输方式选项列表
        TRANSFER_METHODS: [
            { nameLang: 'mall.by_truck', value: 1 },
            { nameLang: 'mall.by_air', value: 2 },
            { nameLang: 'mall.by_water_transportation', value: 3 },
        ],
        // 目的港
        DESTINATION_PORT: [
            { nameLang: 'mall.victoria_harbour', value: 1 },
            { nameLang: 'mall.dubai_port', value: 2 },
            { nameLang: 'mall.singapore_port', value: 3 },
            { nameLang: 'mall.busan_port', value: 4 },
        ],
        // 参保
        INSURED: [
            { nameLang: 'i.yes', value: 1 },
            { nameLang: 'i.no', value: 2 },
        ],
        // 打托
        PALLETIZE: [
            { nameLang: 'i.yes', value: 1 },
            { nameLang: 'i.no', value: 2 },
        ],
    },

    WAYBILL: {
        // 物流
        TYPE: {
            IN: 1,
            OUT: 2,
        },
        TYPE_MAP: {
            1: { key: 1, zh: '寄入', en: 'Receive' },
            2: { key: 2, zh: '寄出', en: 'Send' },
        },
        TARGET_TYPE: {
            PURCHASE_ORDER: 10, //采购订单
            REPAIR_ORDER_TRANSFER: 20, //维修单转单
            TRANSFER_ORDER: 30, //维修单调货单
            AFTER_SALES_ORDER: 40, //售后单
        },
        TARGET_TYPE_LIST: [
            { text: '采购订单', value: 10 },
            { text: '维修单转单', value: 20 },
            { text: '维修单调货单', value: 30 },
            { text: '售后单', value: 40 },
        ],
        TARGET_TYPE_MAP: {
            10: { key: 10, zh: '采购订单', en: 'Purchase Order' },
            20: { key: 20, zh: '维修单转单', en: '-' },
            30: { key: 20, zh: '维修单调货单', en: '-' },
            40: { key: 20, zh: '售后单', en: 'After-sale Order' },
        },
        COMPANY_MAP: {
            EMS: 'EMS',
            JD: '京东物流',
            STO: '申通快递',
            YTO: '圆通速递',
            ZTO: '中通快递',
            HTKY: '百世快递',
            BSKY: '百世快运',
            YUNDA: '韵达快递',
            DEPPON: '德邦快递',
            SFEXPRESS: '顺丰速运',
            CHINAPOST: '邮政包裹',
            KYEXPRESS: '跨越速运',
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
            // { value: 1 , zh: '国际物流', en: 'International logistics'},
            // { value: 2 , zh: '货代公司', en: 'Shipping agent' },
            { value: 3, zh: '陆运', en: 'Land transport' },
            { value: 4, zh: '海运', en: 'Sea transport' },
            { value: 5, zh: '空运', en: 'Air freight' },
        ],
        PORT_LIST: [
            { value: 1, zh: '上海', en: 'Shanghai' },
            { value: 2, zh: '太仓', en: 'Taicang' },
            { value: 3, zh: '南沙', en: 'Nansha' },
        ],
        COURIER_MAP: {
            // '1': { key: 1, zh: '国际物流', en: 'International logistics'},
            // '2': { key: 2, zh: '货代公司', en: 'Shipping agent' },
            3: { key: 3, zh: '陆运', en: 'Land transport' },
            4: { key: 4, zh: '海运', en: 'Sea transport' },
            5: { key: 5, zh: '空运', en: 'Air freight' },
        },
        RECEIPT_LIST: [
            { name: '快递', value: 1 },
            { name: '自提', value: 2 },
        ],
        RECEIPT_MAP: {
            1: { key: 1, zh: '快递', en: 'Send by post' },
            2: { key: 2, zh: '自提', en: 'Self pick up' },
        },
    },

    NOTICE: {
        //系统消息
        CATEGORY: {
            MASTER: 10, //平台消息
            ORG: 20, //机构消息
        },
        CATEGORY_MAP: {
            10: { key: 10, zh: '平台消息', en: 'System messages' },
            20: { key: 20, zh: '机构消息', en: 'Other messages' },
        },
        TYPE: {
            ADMIN: 10, // 系统消息，所有人都可以看到
            DISTRIBUTOR: 20, // 分销商消息，只有分销商可以看到

            STOCK_ALARM: 100, // 库存告警消息，可配置权限
        },
        MASTER_TYPE_MAP: {
            10: { key: 10, zh: '平台消息', en: 'System messages' },
            20: { key: 20, zh: '分销商消息', en: 'Other messages' },
        },
        ORG_TYPE_MAP: {
            100: { key: 100, zh: '库存预警', en: 'Inventory alert' },
        },
        RESOURCE_TYPE: {
            WAREHOUSE: 10,
            PURCHASE: 20,
            DISTRIBUTOR: 30,
        },
        RESOURCE_TYPE_MAP: {
            10: { zh: '仓库', en: 'warehouse' },
            20: { zh: '采购', en: 'procurement' },
            30: { zh: '分销商', en: 'distributors' },
        },
        RESOURCE_TYPE_LIST: [
            { value: 10, zh: '仓库', en: 'warehouse' },
            { value: 20, zh: '采购', en: 'procurement' },
            { value: 30, zh: '分销商', en: 'distributors' },
        ],
    },
    SYSTEM: {
        //系统
        PRINT_TEMPLATE: {
            TYPE_MAP: {
                1: { key: 1, zh: '物料', en: 'Material' },
                2: { key: 2, zh: '整车', en: 'vehicle' },
                3: { key: 3, zh: '唛头整车', en: 'Mark Vehicle' },
                4: { key: 4, zh: '唛头配件', en: 'Mark Accessories' },
            },
        },
        FILE: {
            TARGET_TYPE: {
                SYSTEM: 1,
                DISTRIBUTOR: 2,
                AGENT: 3,
                STORE: 4,
                // REPAIR_ORDER: '5',
            },
            TARGET_TYPE_MAP: {
                1: { key: 1, zh: '系统', en: 'System' },
                2: { key: 2, zh: '分销商', en: 'Distributor' },
                3: { key: 3, zh: '零售商', en: 'Retailer' },
                4: { key: 4, zh: '门店', en: 'Store' },
            },
        },
    },

    AUTH_LIST_TEMP: [
        /**
         * list是渲染列表
         * select表示之前被选择过了
         * key 中英文翻译的头
         */
        { list: [], select: [], key: 'home', name: '总览' },
        { list: [], select: [], key: 'data', name: '时效看板' },
        { list: [], select: [], key: 'distributor', name: '分销商管理' },
        { list: [], select: [], key: 'agent', name: '零售商管理' },
        { list: [], select: [], key: 'store', name: '分销管理-门店列表' },
        { list: [], select: [], key: 'purchase-order', name: '采购订单' },
        { list: [], select: [], key: 'sales-area', name: '销售区域' },
        { list: [], select: [], key: 'item', name: '商品管理' },
        { list: [], select: [], key: 'aftermarket-bom', name: 'BOM管理' },
        { list: [], select: [], key: 'item-category', name: '商品分类' },
        { list: [], select: [], key: 'entity', name: '商品实例' },
        { list: [], select: [], key: 'after-sales-order', name: '售后订单' },
        { list: [], select: [], key: 'repair-order', name: '维修单' },
        { list: [], select: [], key: 'quality-feedback', name: '质量反馈' },
        { list: [], select: [], key: 'fault', name: '故障件' },
        { list: [], select: [], key: 'account', name: '账户管理' },
        { list: [], select: [], key: 'customer', name: '客户管理' },
        { list: [], select: [], key: 'user', name: '用户管理' },
        { list: [], select: [], key: 'refund', name: '退款' },
        { list: [], select: [], key: 'warehouse', name: '仓库' },
        { list: [], select: [], key: 'invoice', name: '出入库单' },
        { list: [], select: [], key: 'stock', name: '库存总览' },
        { list: [], select: [], key: 'supplier', name: '供应商' },
        { list: [], select: [], key: 'transfer', name: '调货单' },
        { list: [], select: [], key: 'warehouse-transfer-order', name: '仓库调货单' },
        { list: [], select: [], key: 'material-purchase-order', name: '物料采购单' },
        { list: [], select: [], key: 'material', name: '物料' },
        { list: [], select: [], key: 'material-category', name: '物料分类' },
        { list: [], select: [], key: 'inventory', name: '存货档案' },
        { list: [], select: [], key: 'inventory-category', name: '存货分类' },
        { list: [], select: [], key: 'bom', name: 'BOM表' },
        { list: [], select: [], key: 'production-order', name: '生产单' },
        { list: [], select: [], key: 'message', name: '消息' },
        { list: [], select: [], key: 'authority', name: '权限' },
        { list: [], select: [], key: 'role', name: '角色' },
        { list: [], select: [], key: 'file', name: '文件' },
        { list: [], select: [], key: 'crm-customer', name: 'CRM客户' },
        { list: [], select: [], key: 'crm-bo', name: 'CRM商机' },
        { list: [], select: [], key: 'crm-bo-status', name: 'CRM商机阶段' },
        { list: [], select: [], key: 'crm-order', name: 'CRM合同订单' },
        { list: [], select: [], key: 'crm-order-income', name: 'CRM回款单' },
        { list: [], select: [], key: 'crm-test-drive', name: 'CRM试驾单' },
        { list: [], select: [], key: 'crm-label', name: 'CRM标签' },
        { list: [], select: [], key: 'crm-dict', name: 'CRM数据字典' },
        { list: [], select: [], key: 'crm-group', name: 'CRM区域' },
        // 新加的2023/8/14
        { list: [], select: [], key: 'crm-store', name: '门店管理' },
        { list: [], select: [], key: 'crm-user', name: '人员管理' },
        { list: [], select: [], key: 'feishu-data', name: '飞书管理' }, // (需要小程序判断权限(还未接入))
        // 新加入2023/10/9
        { list: [], select: [], key: 'coc', name: 'COC证书管理' },
        { list: [], select: [], key: 'supplier-application', name: '供应商管理' },
        { list: [], select: [], key: 'sales-strategy', name: '销售策略管理' },
        // 新加入2024/2/2
        { list: [], select: [], key: 'enquiry-ticket', name: '问询单列表、客户关怀' },
        { list: [], select: [], key: 'enquiry-ticket-category', name: '车型分类管理' },
        { list: [], select: [], key: 'enquiry-ticket-customer', name: '问询单分配' },
        // 新加入2024/2/18
        { list: [], select: [], key: 'operate', name: '运营管理' },
        { list: [], select: [], key: 'staging', name: '工作台' },
        { list: [], select: [], key: 'user-center', name: '用户中心' },
        { list: [], select: [], key: 'allocation-rules', name: '分配规则' },
        { list: [], select: [], key: 'good-goods-order', name: '好物订单' },
        { list: [], select: [], key: 'email', name: '邮件管理' },
        { list: [], select: [], key: 'recharge-review', name: '充值审核' },
    ],

    ATTACHMENT: {
        TARGET_TYPE: {
            // 来源类型
            REPAIR_ORDER: 1, // 维修单附件
            PURCHASE_ORDER: 2, // 采购单附件
            QUALITY_FEEDBACK: 5, // 质量反馈单
            ITEM: 6, // 商品

            CRM_TRACK_RECORD_FILE: 20, // CRM跟进记录-附件文件
            CRM_TRACK_RECORD_IMAGE: 25, // CRM跟进记录-附件图片
            CRM_ORDER_FILE: 30, // CRM合同订单-附件文件
            CRM_ORDER_INCOME_FILE: 40, // CRM回款单-附件文件
            CRM_REFUND_RECORD_FILE: 50, // CRM退款记录-附件文件
        },
    },
    WAREHOUSE: {
        TYPE: {
            //仓库类型
            QUALITY: 1, //成品仓
            DEFECTIVE: 2, //残次仓
            MATERIAL: 3, //物料仓
            CUSTOMIZE: 4, // 广宣品仓
        },
        TYPE_MAP: {
            1: { key: 1, zh: '成品仓', en: 'Good' },
            2: { key: 2, zh: '残次仓', en: 'Imperfect' },
            3: { key: 3, zh: '物料仓', en: 'Material' },
            4: { key: 4, zh: '广宣品仓', en: 'Other' },
        },
        IS_AUTHORITY_WAREHOUSE: {
            YES: 1,
            NO: 0,
        },
    },
    INVENTORY: {
        TYPE: {
            //存货类型

            FINISHED: 2, // 成品
            ADVERTISING: 3, // 广宣产品
            PERIPHERAL: 4, // 周边产品
            EXPENSE: 5, // 费用
            INVENTORY_MATERIAL: 6, // 物料
        },
        TYPE_MAP: {
            2: { key: 2, zh: '成品', en: 'Finished product' },
            3: { key: 3, zh: '广宣产品', en: 'Advertising products' },
            4: { key: 4, zh: '周边产品', en: 'Peripheral products' },
            5: { key: 5, zh: '费用', en: 'Expense' },
            6: { key: 6, zh: '物料', en: 'Material' },
        },
        IS_PRODUCTION_CONSUMPTION: {
            // 是否生产耗用
            YES: 1,
            NO: 0,
        },
        IS_OUTSOURCING: {
            // 是否委外
            YES: 1,
            NO: 0,
        },
        IS_BATCH: {
            // 是否有批次
            YES: 1,
            NO: 0,
        },
        FEATURE: {
            // 特征选配
            YES: 1,
            NO: 0,
        },
    },
    STOCK: {
        TARGET_TYPE: {
            ITEM: 1,
            MATERIAL: 2,
        },
        TARGET_TYPE_MAP: {
            1: { key: 1, zh: '商品', en: 'Item' },
            2: { key: 2, zh: '物料', en: 'Materiel' },
        },
    },
    STOCK_RECORD: {
        // 出入库明细
        COMMODITY_TYPE: {
            ITEM: 10,
            ENTITY: 20,
            MATERIALS: 30,
            CUSTOMIZE: 40,
        },
        COMMODITY_TYPE_MAP: {
            10: { key: 10, zh: '商品', en: 'Item' },
            30: { key: 30, zh: '物料', en: 'Materiel' },
        },
        COMMODITY_TYPE_OLD_MAP: {
            10: { key: 10, zh: '无实例商品', en: 'No instance' },
            20: { key: 10, zh: '有实例商品', en: 'No instance' },
        },
        TYPE: {
            IN: 1, //入库
            OUT: 2, //出库
        },
        TYPE_MAP: {
            1: { key: 1, zh: '入库', en: 'Inbound' },
            2: { key: 2, zh: '出库', en: 'Outbound' },
        },
        STATUS: {
            //出入库单状态
            INIT: 0, //初始化
            WAIT_AUDIT: 10, //待审核
            FINANCE_PASS: 20, //财务审核
            AUDIT_PASS: 30, //审核通过
            CLOSE: 40, //已完成
            DELIVERY: 50, //已发货
            RECEIVED: 60, //已收货
            AUDIT_BACK: -5, //退回
            AUDIT_REFUSE: -10, //审核失败
            CANCEL: -20, // 取消
        },
        STATUS_MAP: {
            0: { key: 0, zh: '待提交', en: 'Awaiting commit', color: 'orange' },
            10: { key: 10, zh: '待审核', en: 'Awaiting review', color: 'yellow' },
            20: { key: 30, zh: '财务审核通过', en: 'Financial review passed', color: 'purple' },
            30: { key: 20, zh: '仓库审核通过', en: 'Admin review passed', color: 'blue' },
            40: { key: 40, zh: '已完成', en: 'In the warehouse', color: 'green' },
            50: { key: 40, zh: '已发货', en: 'Delivery', color: 'green' },
            60: { key: 40, zh: '已收货', en: 'Take delivery', color: 'green' },
            '-10': { key: -10, zh: '审核失败', en: 'Review failed', color: 'red' },
            '-20': { key: -20, zh: '已取消', en: 'Cancelled', color: 'grey' },
        },
        STATUS_LIST: [
            { text: '待提交', value: 0 },
            { text: '已完成', value: 40 },
            { text: '已取消', value: -20 },
        ],
        SOURCE_TYPE: {
            ADMIN: 10, //管理员创建
            PRODUCTION: 15, // 生产单
            PURCHASE: 20, // 采购单
            AFTER_SALES: 30, // 售后单
            TRANSFER: 40, // 调货单
            REPAIR: 50, // 维修单
            MATERIAL_PURCHASE: 60, //物料采购单
            WAREHOUSE_TRANSFER: 70, //仓库调货单
            ITEM_PURCHASE: 80, // 商品采购单 todo:零时加的不一定是这个值
        },
        SOURCE_TYPE_ADMIN_MAP: {
            10: { key: 10, zh: '管理员操作', en: 'Admin action', color: 'yellow' },
            15: { key: 15, zh: '生产单', en: 'Production order', color: 'yellow' },
            20: { key: 20, zh: '采购单', en: 'Purchase order', color: 'orange' },
            30: { key: 30, zh: '售后单', en: 'After-sale order', color: 'yellow' },
            40: { key: 40, zh: '调货单', en: 'Transfer order', color: 'blue' },
            50: { key: 50, zh: '维修单', en: 'Repair order', color: 'orange' },
            60: { key: 60, zh: '物料采购单', en: 'Material purchase order', color: 'yellow' },
            70: { key: 70, zh: '仓库调货单', en: 'Warehouse transfer order', color: 'blue' },
        },
        SOURCE_TYPE_MAP: {
            10: { key: 10, zh: '管理员操作', en: 'Admin action', color: 'yellow' },
            20: { key: 20, zh: '采购单', en: 'Purchase order', color: 'orange' },
            30: { key: 30, zh: '售后单', en: 'After-sale order', color: 'yellow' },
            50: { key: 50, zh: '维修单', en: 'Repair order', color: 'orange' },
        },
        SOURCE_FORM: {
            //出入库单变更来源
            UNKNOWN: 0,
            ADMIN: 1,
            REPAIR_ORDER_ITEM: 21,
            INVOICE: 31,
        },
        SOURCE_FORM_MAP: {
            0: { key: 0, zh: '未知操作', en: 'Unknown operation' },
            1: { key: 1, zh: '管理员操作', en: 'Admin action' },
            21: { key: 21, zh: '维修单', en: 'Repair Order' },
            31: { key: 31, zh: '出入库单', en: 'Inbound and outbound order' },
        },
        AUDIT_TYPE: {
            STOREKEEPER: 1, //仓库管理员
            FINANCE: 2, //财务
        },
        AUDIT_TYPE_MAP: {
            1: '仓库管理员',
            2: '财务',
        },
        AUDIT: {
            //审核结果
            PASS: 1,
            REFUSE: 2,
        },
    },
    TRANSFER_ORDER: {
        //调货单
        STATUS: {
            //调货单审核状态
            WAIT_AUDIT: 10, //待审核
            AUDIT_PASS: 20, //审核通过
            IN_TRANSIT: 30, //运输中
            CLOSE: 40, //处理完成
            AUDIT_REFUSE: -10, //审核失败
            CANCEL: -20, //取消
        },
        STATUS_MAP: {
            10: '待审核',
            20: '审核通过',
            30: '运输中',
            40: '处理完成',
            '-10': '审核失败',
            '-20': '已取消',
        },
        STATUS_COLOR_MAP: {
            10: 'yellow',
            20: 'blue',
            30: 'purple',
            40: 'green',
            '-10': 'red',
            '-20': 'grey',
        },
        STATUS_LIST: [
            //调货单审核
            { text: '待审核', value: 10 },
            { text: '审核通过', value: 20 },
            { text: '运输中', value: 30 },
            { text: '处理完成', value: 40 },
            { text: '审核失败', value: -10 },
            { text: '已取消', value: -20 },
        ],
    },
    WALLET: {
        //账户
        TYPE: {
            CNY: 1,
            EUR: 2,
            USD: 3,
            GBP: 4,
        },
        TYPE_MAP: {
            1: 'CNY',
            2: 'EUR',
            3: 'USD',
            4: 'GBP',
        },
        OPERATE_TYPE: {
            IN: 1,
            OUT: 2,
        },
        OPERATE_TYPE_MAP: {
            1: { key: 1, zh: '充值', en: 'Recharge' },
            2: { key: 2, zh: '扣款', en: 'Deduction' },
        },
        SUBJECT: {
            MANAGER_ADJUSTMENT: 10,
            PURCHASE_ORDER: 20,
            REPAIR_ORDER_DEDUCTIONS: 50,
        },
        SUBJECT_MAP: {
            10: { key: 10, zh: '管理员操作', en: 'Admin action' },
            20: { key: 20, zh: '采购单', en: 'Purchase order' },
            50: { key: 50, zh: '维修单', en: 'Repair order' },
        },
    },
    WARRANTY: {
        STATUS_MAP: {
            0: { value: 0, zh: '已上架', en: 'Already Listed', color: 'green' },
            '-1': { value: -1, zh: '已下架', en: 'No Longer Available', color: 'red' },
        },
        STATUS_COLOR_MAP: {
            0: 'green',
            1: 'red',
        },
    },
    FAULT_ENTITY: {
        //故障件
        STATUS: {
            // 故障件审核状态
            INIT: 0, // 初始化
            WAIT_AUDIT: 10, // 待审核
            AUDIT_SUCCESS: 20, // 审核成功
            AUDIT_FAIL: -20, // 审核失败
        },
        STATUS_MAP: {
            0: '初始化',
            10: '待审核',
            20: '审核成功',
            '-20': '审核失败',
        },
        STATUS_COLOR_MAP: {
            0: 'grey',
            10: 'yellow',
            20: 'green',
            '-20': 'red',
        },
        AUDIT_TYPE: {
            WAIT: 10,
            FAIL: 0,
            SUCCESS: 1,
        },
    },
    ENTITY: {
        STATUS: {
            INIT: 0,
            DISTRIBUTION: 1,
            SALE_OUT: 2,
            PRE_WAREHOUSING: 3,
            DISTRIBUTION_WAREHOUSING: 4,
        },
        STATUS_MAP: {
            0: { key: 0, zh: '初始', en: 'Init' },
            1: { key: 1, zh: '已分销', en: 'Distributed' },
            2: { key: 2, zh: '已卖出', en: 'Sold' },
            3: { key: 3, zh: '预出入库', en: 'Pre-warehousing' },
            4: { key: 4, zh: '预分销出入库', en: 'Pre-distribution warehousing' },
        },
        TYPE_MAP: {
            1: { key: 1, zh: '商品编码', en: 'Code' },
            2: { key: 2, zh: '商品名称', en: 'Name' },
        },
    },
    DEVICE: {
        STATUS_MAP: {
            100: { key: 100, zh: '初始', en: 'Init' },
            200: { key: 200, zh: '已转换', en: 'conversion' },
        },
        TYPE_MAP: {
            1: { key: 1, zh: '整车', en: 'Vehicle' },
            2: { key: 2, zh: '零部件', en: 'Parts' },
        },
        TYPE: {
            VEHICLE: 1,
            PARTS: 2,
        },
    },
    AFTERSALES: {
        // 售后
        STATUS: {
            INIT: 0, // 待提交
            APPLY: 100, // 待审核
            AUDIT_PASS: 200, // 处理中
            FINISH: 600, // 已完成
            CANCEL: -100, // 已取消
            AUDIT_FAIL: -200, // 审核失败
        },
        STATUS_MAP: {
            0: { key: 0, color: 'purple', zh: '待提交', en: 'Wait submit' },
            100: { key: 100, color: 'orange', zh: '待审核', en: 'Wait review' },
            200: { key: 200, color: 'blue', zh: '处理中', en: 'In process' },
            600: { key: 600, color: 'green', zh: '已完成', en: 'Completed' },
            '-100': { key: -100, color: 'gray', zh: '已取消', en: 'Canceled' },
            '-200': { key: -200, color: 'red', zh: '审核失败', en: 'Review failed' },
        },
        TYPE: {
            ONLY_REFUND: 1, // 仅退款
            REFUND_WITH_ITEMS: 2, // 退款且退货
            EXCHANGE_ITEMS: 3, // 换货
            REISSUE: 4, // 补发
        },
        TYPE_MAP: {
            1: { key: 1, zh: '仅退款', en: 'Refund only' },
            2: { key: 2, zh: '退款且退货', en: 'Refund and return' },
            3: { key: 3, zh: '换货', en: 'Exchange goods' },
            4: { key: 4, zh: '补发', en: 'Reissue' },
        },
        QUERY_TYPE: {
            APPLY: 1,
            SUPPLY: 2,
        },
        WAYBILL_STATUS_MAP: {
            0: '初始化',
            100: '已发货',
            200: '已接收',
            400: '已入库',
        },
        REFUND_STATUS_MAP: {
            0: { key: 0, zh: '初始化', en: 'Initialization' },
            100: { key: 100, zh: '已申请', en: 'Have Applied' },
            400: { key: 400, zh: '退款成功', en: 'Refund Successfully' },
        },
    },
    REFUND: {
        // 退款管理
        TYPE_LIST: [
            { text: '零售商申请退款', value: 100 },
            { text: '分销商申请退款', value: 110 },
            { text: '门店申请退款', value: 120 },
            { text: '后台主动退款', value: 200 },
        ],
        TYPE_MAP: {
            100: { key: 100, zh: '零售商申请退款', en: 'Retailer applies for refund', value: 100 },
            110: { key: 110, zh: '分销商申请退款', en: 'Distributor applies for refund', value: 110 },
            120: { key: 120, zh: '门店申请退款', en: 'Store application for refund', value: 120 },
            200: { key: 200, zh: '后台主动退款', en: 'Backstage active refund', value: 200 },
        },
        STATUS: {
            WAIT_AUDIT: 10, // 待审核
            AUDIT_PASS: 20, // 审核通过
            SUCCESS: 40, // 退款成功
            AUDIT_REFUSE: -10, // 审核失败
            CANCEL: -20, // 已取消
        },
        STATUS_MAP: {
            10: { key: 10, zh: '待审核', en: 'Awaiting review', color: 'yellow' },
            20: { key: 20, zh: '审核通过', en: 'Approved', color: 'blue' },
            40: { key: 40, zh: '退款成功', en: 'Refund completed', color: 'green' },
            '-10': { key: -10, zh: '审核失败', en: 'Review failed', color: 'red' },
            '-20': { key: -10, zh: '已取消', en: 'Canceled', color: 'grey' },
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
            ITEM: 1, //商品
            MATERIAL: 2, //物料
        },
        TARGET_TYPE_MAP: {
            1: { text: '商品' },
            2: { text: '物料' },
        },
    },
    // 生产
    PRODUCTION: {
        STATUS: {
            INIT: 0, // 待生产
            PRODUCTION: 100, // 生产中
            COMPLETE: 200, // 已完成
            CANCEL: -100, // 已取消
        },
        STATUS_MAP: {
            0: { text: '待生产', color: 'yellow' },
            100: { text: '生产中', color: 'orange' },
            200: { text: '已完成', color: 'green' },
            '-100': { text: '已取消', color: 'gray' },
        },
        materialMsg: {
            editMsg: {
                0: { key: 0, zh: '普通件', en: 'Ordinary parts' },
                10: { key: 10, zh: '电池', en: 'battery' },
            },
        },
    },
    SUPPLIER: {
        //供应商
        PAYMENT_TYPE: {
            FIFTEEN: 20,
            THIRTY: 30,
            FORTY_FIVE: 40,
            SIXTY: 50,
            CASH_AND_DELIVERY: 10,
        },
        PAYMENT_TYPE_MAP: {
            10: '款到发货',
            20: '见票15天',
            30: '见票30天',
            40: '见票45天',
            50: '见票60天',
        },
        PAYMENT_TYPE_LIST: [
            { value: 10, name: '款到发货' },
            { value: 20, name: '见票15天' },
            { value: 30, name: '见票30天' },
            { value: 40, name: '见票45天' },
            { value: 50, name: '见票60天' },
        ],
        SUPPLIER_TYPE: {
            QUALIFIED: 10,
            DISPOSABLE: 20,
            OBSOLETE: 30,
        },
        SUPPLIER_TYPE_MAP: {
            10: '合格',
            20: '一次性',
            30: '淘汰',
        },
        SUPPLIER_TYPE_COLOR_MAP: {
            10: 'green',
            20: 'orange',
            30: 'grey',
        },
        STATUS_PURCHASE: {
            ON_PURCHASE: 1, //正常采购
            OFF_PURCHASE: 2,
        },
        STATUS_PURCHASE_MAP: {
            1: '采购正常',
            2: '采购冻结',
        },
        STATUS_PURCHASE_COLOR_MAP: {
            1: 'green',
            2: 'red',
        },
        STATUS_SETTLEMENT: {
            ON_SETTLEMENT: 1, //正常结算
            OFF_SETTLEMENT: 2,
        },
        STATUS_SETTLEMENT_MAP: {
            1: '结算正常',
            2: '结算冻结',
        },
        STATUS_SETTLEMENT_COLOR_MAP: {
            1: 'green',
            2: 'red',
        },
    },
    MATERIAL_PURCHASE: {
        STATUS: {
            INIT: 0, //初始化
            SUBMIT: 100, //已提交待审核
            PASS: 200, //审核通过
            PART: 400, //部分入库
            WAREHOUSE_AUDIT: 450, //一键入库，等待仓库审核
            N_WAREHOUSE: 500, //入库完成
            REFUSE: -200, //审核失败
            CANCEL: -100, // 取消
        },
        STATUS_MAP: {
            0: '待提交',
            100: '待审核',
            200: '审核通过',
            400: '部分入库',
            450: '等待仓库审核',
            500: '全部入库',
            '-200': '审核未通过',
            '-100': '已取消',
        },
        STATUS_COLOR_MAP: {
            0: 'orange',
            100: 'yellow',
            200: 'blue',
            400: 'purple',
            450: 'purple',
            500: 'green',
            '-200': 'red',
            '-100': 'grey',
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
            5: { key: 5, color: 'yellow', text: '待提交', value: '0' },
            10: { key: 10, color: 'orange', text: '收货方审核', value: '0' },
            20: { key: 20, color: 'orange', text: '发货方待审核', value: '0' },
            30: { key: 30, color: 'blue', text: '待发货', value: '0' },
            40: { key: 40, color: 'purple', text: '已发货', value: '0' },
            50: { key: 50, color: 'purple', text: '已收货', value: '0' },
            60: { key: 60, color: 'green', text: '已完成', value: '0' },
            '-10': { key: -10, color: 'red', text: '收货方审核失败', value: '0' },
            '-20': { key: -20, color: 'red', text: '发货方审核失败', value: '0' },
            '-30': { key: -30, color: 'grey', text: '已取消', value: '0' },
        },
        COMMODITY_TYPE: {
            ITEM: 10,
            MATERIALS: 30,
        },
        COMMODITY_TYPE_MAP: {
            10: '商品',
            30: '物料',
        },
    },
    AUDIT_RECORD: {
        TARGET_TYPE: {
            QUALITY_FEEDBACK: 10,
        },
    },
    ITEM_COMPONENT_SET: {
        TARGET_TYPE: {
            ITEM: 1,
            ITEM_CATEGORY: 2,
        },
    },

    CRM_CUSTOMER: {
        TYPE: {
            INDIVIDUAL: 1,
            UNIT: 2,
        },
        TYPE_MAP: {
            1: { key: 1, zh: '个人客户', en: 'Personal Customer', value: 1 },
            2: { key: 2, zh: '单位客户', en: 'Company Customer', value: 2 },
        },
        STATUS: {
            POOL: 10,
            CUSTOMER: 20,
            INVALID: 30,
            NOT_YET_A_CUSTOMER: 0,
        },
        SEARCH_TYPE: {
            POOL: 10,
            PRIVATE: 20,
            REGION: 30,
            PRIVATE_CUSTOMER_BY_USER: 40,
            PRIVATE_CUSTOMER_BY_OTHER_USER: 50,
        },
        LEVEL_MAP: {
            10: { key: 10, zh: '重点客户', en: 'Key Customer', value: 10 },
            20: { key: 20, zh: '普通客户', en: 'Normal Customer', value: 20 },
            30: { key: 30, zh: '非优先客户', en: 'Low Priority Customer', value: 30 },
            40: { key: 40, zh: '黑名单客户', en: 'Blacklisted Customer', value: 40 },
        },
        PURCHASE_INTENT_MAP: {
            10: { key: 10, zh: '购买意向低', en: 'Low Purchase Intention', value: 10 },
            20: { key: 20, zh: '购买意向中', en: 'Moderate Purchase Intention', value: 20 },
            30: { key: 30, zh: '购买意向高', en: 'High Purchase Intention', value: 30 },
        },
        TEST_DRIVE_INTENT_MAP: {
            10: { key: 10, zh: '试驾意向低', en: 'Low Test Drive Intention', value: 10 },
            20: { key: 20, zh: '试驾意向中', en: 'Moderate Test Drive Intention', value: 20 },
            30: { key: 30, zh: '试驾意向高', en: 'High Test Drive Intention', value: 30 },
            40: { key: 40, zh: '预约试驾', en: 'Make An Appointment To Test Drive', value: 40 },
            50: { key: 50, zh: '已试驾', en: 'Have A Test Drive', value: 50 },
        },
        PURCHASE_INTENT_CHART_MAP: {
            0: { key: 0, zh: '未选择', en: 'Not Selected', value: 0 },
            10: { key: 10, zh: '购买意向低', en: 'Low Purchase Intention', value: 10 },
            20: { key: 20, zh: '购买意向中', en: 'Moderate Purchase Intention', value: 20 },
            30: { key: 30, zh: '购买意向高', en: 'High Purchase Intention', value: 30 },
        },
        TEST_DRIVE_INTENT_CHART_MAP: {
            0: { key: 0, zh: '未选择', en: 'Not Selected', value: 0 },
            10: { key: 10, zh: '试驾意向低', en: 'Low Test Drive Intention', value: 10 },
            20: { key: 20, zh: '试驾意向中', en: 'Moderate Test Drive Intention', value: 20 },
            30: { key: 30, zh: '试驾意向高', en: 'High Test Drive Intention', value: 30 },
            40: { key: 40, zh: '预约试驾', en: 'Make An Appointment To Test Drive', value: 40 },
            50: { key: 50, zh: '已试驾', en: 'Have A Test Drive', value: 50 },
        },
        SOURCE_MAP: {
            10: { key: 10, zh: '客户介绍', en: 'Customers', value: 10 },
            20: { key: 20, zh: '广告', en: 'Advertising', value: 20 },
            30: { key: 30, zh: '活动推广', en: 'Activities to promote', value: 30 },
            40: { key: 40, zh: '其他', en: 'Other', value: 40 },
        },
        INDUSTRY_MAP: {
            10: { key: 10, zh: '金融', en: 'Finance', value: 10 },
            20: { key: 20, zh: '电信', en: 'Telecom', value: 20 },
            30: { key: 30, zh: '教育', en: 'Education', value: 30 },
            40: { key: 40, zh: '高科技', en: 'High-tech', value: 40 },
            50: { key: 50, zh: '政府', en: 'The government', value: 50 },
            60: { key: 60, zh: '制造业', en: 'Manufacturing', value: 60 },
            70: { key: 70, zh: '服务', en: 'Service', value: 70 },
            80: { key: 80, zh: '能源', en: 'Energy', value: 80 },
            90: { key: 90, zh: '零售', en: 'Retail', value: 90 },
            100: { key: 100, zh: '媒体', en: 'Media', value: 100 },
            110: { key: 110, zh: '娱乐', en: 'Entertainment', value: 110 },
            120: { key: 120, zh: '咨询', en: 'Consulting', value: 120 },
            130: { key: 130, zh: '非盈利事业', en: 'Non profit cause', value: 130 },
            140: { key: 140, zh: '公用事业', en: 'Utilities', value: 140 },
            500: { key: 500, zh: '其他', en: 'Other', value: 500 },
        },
        GENDER_MAP: {
            1: { key: 1, zh: '女', en: 'Woman', value: 1 },
            2: { key: 2, zh: '男', en: 'Man', value: 2 },
        },
        MARITAL_STATUS_MAP: {
            1: { key: 1, zh: '未婚', en: 'Single', value: 1 },
            2: { key: 2, zh: '已婚', en: 'Married', value: 2 },
        },
        TRACK_STATUS_MAP: {
            10: { key: 10, zh: '未跟进', en: 'Not followed up', value: 10 },
            20: { key: 20, zh: '跟进中', en: 'Following up', value: 20 },
            30: { key: 30, zh: '7天未跟进', en: '7 days without follow up', value: 30 },
        },
        COMPANY_SIZE_MAP: {
            100: { key: 100, zh: '0 - 20人', en: '0 - 20', value: 100 },
            200: { key: 200, zh: '21 - 50人', en: '21 - 50', value: 200 },
            300: { key: 300, zh: '51 - 100人', en: '51 - 100', value: 300 },
            400: { key: 400, zh: '101 - 200人', en: '101 - 200', value: 400 },
            500: { key: 500, zh: '201 - 500人', en: '201 - 500', value: 500 },
            600: { key: 600, zh: '501 - 1000人', en: '501 - 1000', value: 600 },
            700: { key: 700, zh: '1001 - 2000人', en: '1001 - 2000', value: 700 },
            800: { key: 800, zh: '2000人以上', en: 'More than 2000', value: 800 },
        },
        SOURCE_TYPE_MAP: {
            1: { key: 1, zh: '预定小程序', en: 'Order Applets', value: 1 },
            2: { key: 2, zh: '后台注册', en: 'Background Registration', value: 2 },
            3: { key: 3, zh: 'Shopify', en: 'Shopify', value: 3 },
            4: { key: 4, zh: '官网2.0', en: 'Official website 2.0', value: 4 },
            5: { key: 5, zh: '官网1.0', en: 'Official website 1.0', value: 5 },
            101: { key: 6, zh: '投票分享', en: 'Vote Sharing', value: 101 },
            30: { key: 30, en: 'Landing page 1', zh: '落地页1', value: 30 },
            31: { key: 31, en: 'Landing page 2', zh: '落地页2', value: 31 },
            32: { key: 32, en: 'Qr code of experience officer', zh: '体验官二维码', value: 32 },
            33: { key: 33, en: 'Store QR code', zh: '门店二维码', value: 33 },
            34: { key: 34, en: 'Manual creation', zh: '人工创建', value: 34 },
        },
        // 落地页
        Landing_Page: {
            30: { key: 1, zh: '落地页', en: 'Landing page', country_en: 'Germany', country: '德国' },
            31: { key: 2, zh: '落地页', en: 'Landing page', country_en: 'Germany', country: '德国' },
        },
    },
    CRM_ORDER: {
        SEARCH_TYPE: {
            PERSONAL: 10,
            AUDIT: 10,
            ALL: 30,
        },
        TARGET_TYPE: {
            CUSTOMER: 1,
            BO: 2,
        },
        TYPE: {
            SALES: 10, // 10产品销售
            COOPERATION: 20, // 20业务合作
            SERVICE: 30, // 30服务
            DISTRIBUTE: 40, // 40代理分销
            OTHER: 50, // 50其他
        },
        TYPE_MAP: {
            10: { key: 10, zh: '产品销售', en: 'Product Sales', value: 10 },
            20: { key: 20, zh: '业务合作', en: 'Cooperation', value: 20 },
            30: { key: 30, zh: '服务', en: 'Service', value: 30 },
            40: { key: 40, zh: '代理分销', en: 'Distribute', value: 40 },
            50: { key: 50, zh: '其他', en: 'Others', value: 50 },
        },
        STATUS: {
            // 对应下面 STATUS_MAP
            WAIT_AUDIT: 20,
            REFUSE: 30,
            TOBEPAID: 35,
            EXECUTING: 40,
            REFUND: 44,
            REFUND_PROGRESS: 44,
            FINISH: 50,
        },
        STATUS_MAP: {
            10: { key: 10, zh: '初始化', en: 'Init', value: 10 },
            20: { key: 20, zh: '待审核', en: 'Pending Review', value: 20 },
            30: { key: 30, zh: '审核拒绝', en: 'Review Rejected', value: 30 },
            35: { key: 35, zh: '待支付', en: 'To be paid', value: 35 },
            40: { key: 40, zh: '执行中', en: 'Executing', value: 40 },
            44: { key: 44, zh: '申请退款', en: 'Apply for a refund', value: 44 },
            46: { key: 46, zh: '退款中', en: 'Refund in progress', value: 46 },
            50: { key: 50, zh: '已结束', en: 'Finished', value: 50 },
        },
        CUSTOMER_MAP: {
            10: { key: 10, zh: '私人客户', en: 'Private client', value: 10 },
            40: { key: 40, zh: '公海客户', en: 'High seas customers', value: 40 },
        },
        // PAID_MONEY_PROGRESS: {
        //     0_20: 1,        // 回款进度 0%-20%
        //     20_40: 2,       // 回款进度 20%-40%
        //     40_60: 3,       // 回款进度 40%-60%
        //     60_80: 4,       // 回款进度 60%-80%
        //     80_100: 5,      // 回款进度 80%-100%
        // },
        PAID_MONEY_PROGRESS_MAP: {
            1: { key: 1, zh: '支付进度 0%-20%', en: 'Payment Collection Progress 0% - 20%', value: 1 },
            2: { key: 2, zh: '支付进度 20%-40%', en: 'Payment Collection Progress 20% - 40%', value: 2 },
            3: { key: 3, zh: '支付进度 40%-60%', en: 'Payment Collection Progress 40% - 60%', value: 3 },
            4: { key: 4, zh: '支付进度 60%-80%', en: 'Payment Collection Progress 60% - 80%', value: 4 },
            5: { key: 5, zh: '支付进度 80%-100%', en: 'Payment Collection Progress 80% - 100%', value: 5 },
        },
        WhetherNot: {
            1: { key: 20, zh: '是', en: 'YES', value: 1 },
            '-1': { key: 30, zh: '否', en: 'NO', value: -1 },
        },
        INTENTION: {
            10: {
                key: 10,
                zh: '无意向(不购买/30天3次无效沟通)',
                en: 'Unintentional communication (no purchase / 3 invalid communication times in 30 days)',
            },
            20: {
                key: 20,
                zh: '有意向(了解产品（体验、服务、性能、功能、权益、政策)，30天内能决策。)',
                en: 'Intentional (understand the product (experience, service, performance, features, benefits, policies), and be able to make a decision within 30 days. )',
            },
            30: {
                key: 30,
                zh: '高意向(完成产品体验并保持购买意向，14天内能决策)',
                en: 'High intent (complete the product experience and maintain purchase intent, and make a decision within 14 days)',
            },
            40: {
                key: 40,
                zh: 'Hot(主动提出支付意向金,3天内能决策)',
                en: 'Hot (offer to pay the intention fee, can make a decision within 3 days)',
            },
        },
        INTENTION_STATUS: {
            10: { key: 10, zh: '无意向', en: 'Unintentional' },
            20: { key: 20, zh: '有意向', en: 'Intentional' },
            30: { key: 30, zh: '高意向', en: 'High intent' },
            40: { key: 40, zh: 'Hot', en: 'Hot' },
        },
        SEX: {
            1: { key: 1, zh: '男', en: 'male' },
            2: { key: 2, zh: '女', en: 'female' },
        },
        SEX_MAP: {
            male: 1,
            female: 2,
        },
        RidingExperience: {
            '-1': { key: -1, zh: '无经验', en: 'Inexperienced' },
            1: { key: 1, zh: '0-3年', en: '0-3 years' },
            2: { key: 2, zh: '3-5年', en: '3-5 years' },
            3: { key: 3, zh: '5年及以上', en: '5 years and above' },
        },
        VehicleType: {
            1: { key: 1, zh: 'SENMENTI 0', en: 'SENMENTI 0' },
            2: { key: 2, zh: 'SENMENTI X', en: 'SENMENTI X' },
        },
        // 其他驾驶工具
        otherTool: {
            1: { key: 1, zh: '油车', en: 'Oil trucks' },
            2: { key: 2, zh: '电车', en: 'tram' },
        },
        // 订单列表筛选(tab)-订单状态
        Order_Status_Map: {
            0: { key: 0, zh: '全部', en: 'All', value: 0 },
            40: { key: 40, zh: '已支付', en: 'To Be Paid', value: 40, color: '#00B42A' },
            35: { key: 35, zh: '待付款', en: 'Pending Payment', value: 35, color: '#F77234' },
            48: { key: 48, zh: '已退款', en: 'Refunded', value: 48, color: '#3491FA' },
            10: { key: 10, zh: '已取消', en: 'Canceled', value: 10, color: '#A9B4C2' },
            36: { key: 36, zh: '待审核', en: 'Pending Review', value: 36, color: '#F77234' },
            38: { key: 38, zh: '审核不通过', en: 'Fail the audit', value: 38, color: '#A9B4C2' },
        },
        // 订单列表-来源
        SOURCE_TYPE: {
            1: { key: 1, zh: '微信小程序', en: 'WeChat Mini Program', value: 1 },
            2: { key: 2, zh: 'CRM', en: 'CRM', value: 2 },
            3: { key: 3, zh: 'shopify', en: 'shopify', value: 3 },
            4: { key: 4, zh: '国外官网', en: 'Official Website Abroad', value: 4 },
            5: { key: 5, zh: '飞书小程序', en: 'Feishu Mini Program', value: 5 },
            100: { key: 100, zh: '美国', en: 'United States', value: 100 },
            200: { key: 200, zh: '欧洲', en: 'Europe', value: 200 },
        },
        COUNTRY_MAP: {
            100: { value: 100, text: '欧洲' },
            200: { value: 200, text: '美国' },
        },
        CRM_ORDER_SOURCE_TYPE: [
            // 级联订单来源
            { value: 1, label: '微信小程序', label_en: 'WeChat Mini Program' },
            { value: 2, label: 'CRM', label_en: 'CRM' },
            { value: 3, label: 'shopify', label_en: 'Shopify' },
            {
                value: 4,
                label: '国外官网',
                label_en: 'Official Website For Overseas Markets',
                children: [
                    // 100 欧洲 200 美国
                    {
                        value: 0,
                        label: '全部',
                        label_en: 'All',
                    },
                    {
                        value: 100,
                        label: '欧洲',
                        label_en: 'Europe',
                        children: EuropeData,
                    },
                    {
                        value: 200,
                        label: '美国',
                        label_en: 'United States',
                    },
                ],
            },
            { value: 5, label: '飞书小程序', label_en: 'Feishu Mini Program' },
        ],
        // 支付方式
        PAYMENT_TYPE: {
            10: { key: 10, zh: '现金', en: 'cash', value: 10 },
            20: { key: 20, zh: '微信', en: 'Wechat', value: 20 },
            30: { key: 30, zh: '支付宝', en: 'Alipay', value: 30 },
            40: { key: 40, zh: '银行卡支付', en: 'Bank Card Payment', value: 40 },
            50: { key: 50, zh: '支票', en: 'cheque', value: 50 },
            60: { key: 60, zh: '其他', en: 'other', value: 60 },
            70: { key: 70, zh: 'paypal', en: 'paypal', value: 70 },
            80: { key: 80, zh: ' pingpong支付', en: 'pingpong', value: 80 },
        },
    },
    CRM_ORDER_INCOME: {
        STATUS: {
            WAIT_AUDIT: 20, // 20待审核
            REFUSE: 30, // 30审核拒绝
            EXECUTING: 40, // 40审核完成
            PARTIAL_REFUND: 50, // 50部分退款
            FULL_REFUND: 60, // 60全部退款
        },
        STATUS_MAP: {
            20: { key: 20, zh: '待审核', en: 'Pending Review', value: 20 },
            30: { key: 30, zh: '审核拒绝', en: 'Rejected', value: 30 },
            40: { key: 40, zh: '审核完成', en: 'Review Completed', value: 40 },
            50: { key: 50, zh: '部分退款', en: 'Partial Refunded', value: 50 },
            60: { key: 60, zh: '全部退款', en: 'Refunded', value: 60 },
        },
        TYPE: {
            ADVANCE_PAYMENT: 10, // 预付款
            FULL: 20, // 全款
            BALANCE_PAYMENT: 30, // 尾款
            OTHER: 40, // 其他
        },
        TYPE_MAP: {
            10: { key: 10, zh: '预付款', en: 'Advance Charge', value: 10 },
            20: { key: 20, zh: '全款', en: 'Full Payment', value: 20 },
            30: { key: 30, zh: '尾款', en: 'Balance Payment', value: 30 },
            40: { key: 40, zh: '其他', en: 'Other Payment', value: 40 },
        },
        PAYMENT_TYPE: {
            CASH: 10, // 现金
            WECHAT: 20, // 微信
            ALIPAY: 30, // 支付宝
            UNION_PAY: 40, // 银联
            CHECK: 50, // 支票
            OTHER: 60, // 其他
        },
        PAYMENT_TYPE_MAP: {
            10: { key: 10, zh: '现金', en: 'Cash', value: 10 },
            20: { key: 20, zh: '微信', en: 'Wechat pay', value: 20 },
            30: { key: 30, zh: '支付宝', en: 'Alipay', value: 30 },
            40: { key: 40, zh: '银联', en: 'Union Pay', value: 40 },
            50: { key: 50, zh: '支票', en: 'Check', value: 50 },
            60: { key: 60, zh: '其他', en: 'Other', value: 60 },
        },
        // 试驾单-订单来源
        SOURCE_TYPE: {
            10: { key: 10, zh: '销售录入', en: 'Sales Entry', value: 10 },
            20: { key: 20, zh: '官网1.0预约', en: 'Official Website 1.0 Appointment', value: 20 },
            30: { key: 30, zh: '落地页1', en: 'Landing page 1', value: 30 },
            31: { key: 31, zh: '落地页2', en: 'Landing page 2', value: 31 },
            40: { key: 40, zh: '官网2.0预约', en: 'Official Website 2.0 Appointment', value: 40 },
        },
    },
    CRM_TRACK_RECORD: {
        TYPE_MAP: {
            10: { key: 10, zh: '上门拜访', en: 'Home Visits', value: 10 },
            20: { key: 20, zh: '电话沟通', en: 'Phone Communication', value: 20 },
            30: { key: 30, zh: '其他', en: 'Other', value: 30 },
        },
        INTENT_MAP: {
            10: { key: 10, zh: '高', en: 'High', value: 10 },
            20: { key: 20, zh: '一般', en: 'General', value: 20 },
            30: { key: 30, zh: '低', en: 'Low', value: 30 },
        },
        DEGREE_INTENT: {
            10: { key: 10, zh: '未接', en: 'Missed', value: 10 },
            20: { key: 20, zh: '挂断', en: 'Hang up', value: 20 },
            30: { key: 30, zh: '拒绝加微信', en: 'Refuse to add Wechat', value: 30 },
            40: { key: 40, zh: '仅加微信', en: 'Add Wechat only', value: 40 },
            50: { key: 50, zh: '寻求合作', en: 'Seek cooperation', value: 50 },
            60: { key: 60, zh: '很感兴趣会关注', en: 'will follow', value: 60 },
            70: { key: 70, zh: '已支付订金', en: 'Deposit paid', value: 70 },
            80: { key: 80, zh: '已试驾', en: 'Test drive', value: 80 },
            90: { key: 90, zh: '已购', en: 'Purchased', value: 90 },
            100: { key: 100, zh: '预约试驾', en: 'Book a test drive', value: 100 },
        },
        CHINA_INTENT: {
            // 仅国内拥有--意向度(无英文)10无意向 20有意向 30高意向 40 Hot
            10: { key: 10, zh: '无意向', value: 10, con: '不购买/30天内3次无效沟通' },
            20: {
                key: 20,
                zh: '有意向',
                value: 20,
                con: '了解产品（体验、服务、性能、功能、权益、政策）,30天内能决策',
            },
            30: { key: 30, zh: '高意向', value: 30, con: '完成产品体验并保持购买意向，14天内能决策' },
            40: { key: 40, zh: 'Hot', value: 40, con: '主动提出支付意向金，3天内能做出决策' },
        },
        TARGET_TYPE: {
            CUSTOMER: 1,
            BO: 2,
            ORDER: 3,
            ORDER_INCOME: 4,
        },
        // 购车关注点
        CAR_BUYING_CONCERNS: [
            '续航',
            '服务',
            '质量',
            '外观',
            '性能',
            '舒适',
            '安全',
            '储物空间',
            '智能',
            '改装',
            '销售政策',
            '售后政策',
        ],
        // 购车习惯
        BUY_HABITS: ['试驾', '全款', '贷款'],
        // 购车顾虑
        BUY_CONCERNS: ['预算不足', '品牌顾虑', '售后保证', '保值率', '提车时间'],
    },
    CRM_TODO: {
        STATUS: {
            PENDING: 100,
            TIME_OUT: 110,
        },
        STATUS_MAP: {
            100: { key: 100, zh: '待完成', en: 'Pending', value: 100 },
            110: { key: 110, zh: '超时', en: 'Time out', value: 110 },
        },
    },
    CRM_TRACK_MEMBER: {
        TARGET_TYPE: {
            CUSTOMER: 1, // 1客户
            BO: 2, // 2商机
            ORDER: 3, // 3合同订单
            ORDER_INCOME: 4, // 4回款单
        },
        TYPE: {
            READ: 1, // 1只读
            READ_WRITE: 2, // 2读写
            OWN: 3, // 3负责人
        },
        TYPE_MAP: {
            1: { key: 1, zh: '只读', en: 'Read only', value: 1 },
            2: { key: 2, zh: '读写', en: 'Read and write', value: 2 },
            3: { key: 3, zh: '负责人', en: 'Head', value: 3 },
        },
        TYPE_EDIT_MAP: {
            1: { key: 1, zh: '只读', en: 'Read only', value: 1 },
            2: { key: 2, zh: '读写', en: 'Read and write', value: 2 },
        },
    },
    CRM_BO: {
        STATUS: {
            WIN: 100,
            LOSE: -100,
        },
        SOURCE_MAP: {
            1: { key: 1, zh: '新客户', en: 'New customer', value: 1 },
            2: { key: 2, zh: '老客户', en: 'Old customer', value: 2 },
        },
        LOST_REASON_MAP: {
            10: { key: 10, zh: '价格原因', en: 'Price Reason', value: 10 },
            20: { key: 20, zh: '质量原因', en: 'Quality Reasons', value: 20 },
            30: { key: 30, zh: '客户关系原因', en: 'Customer Relationship Reasons', value: 30 },
            40: { key: 40, zh: '其他', en: 'Other', value: 40 },
        },
    },
    CRM_ITEM_BIND: {
        SOURCE_TYPE: {
            BO: 1,
            ORDER: 2,
        },
    },
    CRM_LABEL: {
        CATEGORY: {
            CUSTOMER: 1,
            BO: 2,
            ORDER: 3,
            ORDER_INCOME: 4,
        },
    },
    CRM_CONTACT_BIND: {
        TARGET_TYPE: {
            CUSTOMER: 1,
            BO: 2,
            BO_ADD_CUSTOMER: 10,
        },
    },
    CRM_AUDIT_PROCESS: {
        AUDIT_STATUS: {
            NOT_AUDIT: 10, // 10 未轮到我审核
            WAIT_AUDIT: 20, // 20 待我审核
            PASS: 30, // 30 审核通过
            REFUSE: 40, // 40 审核拒绝
        },
    },
    CRM_ACTION_RECORD: {
        TYPE: {
            CREATE_CUSTOMER: 1001, // 新建客户
            DELETE_CUSTOMER: 1002, // 删除客户
            OBTAIN_CUSTOMER: 1003, // 领取客户
            DISTRIBUTE_CUSTOMER: 2001, // 分配客户
            RETURN_POOL: 1004, // 退回公海
            CUSTOMER_TO_OTHERS: 2002, // 将客户移交给
            MODIFYING_REGION: 1010, // 修改区域

            CREATE_BO: 2003, // 新建商机
            DELETE_BO: 2004, // 删除商机
            UPDATE_BO_STATUS: 2005, // 更新商机阶段
            BO_TO_OTHERS: 2006, // 将商机移交给

            CREATE_ORDER: 2007, // 新建订单
            DELETE_ORDER: 2008, // 删除订单
            CREATE_ORDER_INCOME: 1005, // 新建回款单
            DELETE_ORDER_INCOME: 1006, // 删除回款单
            AUDIT_PASS: 1007, // 审核人...审核通过
            AUDIT_REFUSE: 1008, // 审核人...审核拒绝
            REFUND: 2009, // 向客户退款
            CANCEL_REFUND: 2010, // 取消退款

            CREATE_CONTACT: 2011, // 创建联系人
            ADD_CONTACT: 2012, // 添加联系人
            DELETE_CONTACT: 2013, // 删除联系人
            ADD_MEMBER: 2014, // 添加团队成员
            DELETE_MEMBER: 2015, // 删除团队成员
            UPDATE_MEMBER: 2016, // 修改团队成员权限
            ADD_TRACK_RECORD: 2018, // 添加跟进记录
            DELETE_TRACK_RECORD: 2019, // 删除跟进记录
            ADD_LABEL: 2020, // 添加标签
            DELETE_LABEL: 2021, // 删除标签

            CREATE_TEST_DRIVE_ORDER: 2022, // 新建试驾单
            DELETE_TEST_DRIVE_ORDER: 2023, // 删除试驾单
            TEST_DRIVE_FINISH: 2024, // 完成试驾
            TEST_DRIVE_CANCEL: 2025, // 取消试驾
            TEST_DRIVE_EXPIRED: 2026, // 过期未试驾
            CREATE_PORTRAIT: 2027, // 新建用户画像
            DELETE_PORTRAIT: 2028, // 删除用户画像

            ORDER_TO_OTHERS: 2029, // 将合同订单转交给

            // 修改操作
            REVISE_CUSTOMER: 3001, // 修改客户信息
            REVISE_CONTACT: 3002, // 修改联系人
            REVISE_TRACK_RECORD: 3003, // 修改跟进记录
            REVISE_BO: 3004, // 修改商机
            REVISE_ORDER: 3005, // 修改订单
            REVISE_ORDER_INCOME: 3006, // 修改回款单
            REVISE_TEST_DRIVE_ORDER: 3007, // 修改试驾单
            REVISE_PORTRAIT: 3008, // 修改用户画像
        },
        TYPE_MAP: {
            1001: { key: 1001, zh: '新建客户', en: 'CREATE_CUSTOMER', value: 1001 },
            1002: { key: 1002, zh: '删除客户', en: 'DELETE_CUSTOMER', value: 1002 },
            1003: { key: 1003, zh: '领取客户', en: 'OBTAIN_CUSTOMER', value: 1003 },
            2001: { key: 2001, zh: '分配客户', en: 'DISTRIBUTE_CUSTOMER', value: 2001 },
            1004: { key: 1004, zh: '退回公海', en: 'RETURN_POOL', value: 1004 },
            1010: { key: 1010, zh: '修改区域信息', en: 'MODIFYING_REGION', value: 1010 },
            2002: { key: 2002, zh: '移交客户', en: 'CUSTOMER_TO_OTHERS', value: 2002 },

            2003: { key: 2003, zh: '新建商机', en: 'CREATE_BO', value: 2003 },
            2004: { key: 2004, zh: '删除商机', en: 'DELETE_BO', value: 2004 },
            2005: { key: 2005, zh: '更新商机阶段', en: 'UPDATE_BO_STATUS', value: 2005 },
            2006: { key: 2006, zh: '移交商机', en: 'BO_TO_OTHERS', value: 2006 },

            2007: { key: 2007, zh: '新建订单', en: 'CREATE_ORDER', value: 2007 },
            2008: { key: 2008, zh: '删除订单', en: 'DELETE_ORDER', value: 2008 },
            1005: { key: 1005, zh: '新建回款单', en: 'CREATE_ORDER_INCOME', value: 1005 },
            1006: { key: 1006, zh: '删除回款单', en: 'DELETE_ORDER_INCOME', value: 1006 },
            1007: { key: 1007, zh: '审核通过', en: 'AUDIT_PASS', value: 1007 },
            1008: { key: 1008, zh: '审核拒绝', en: 'AUDIT_REFUSE', value: 1008 },
            2009: { key: 2009, zh: '退款', en: 'REFUND', value: 2009 },
            2010: { key: 2010, zh: '取消退款', en: 'CANCEL_REFUND', value: 2010 },

            2011: { key: 2011, zh: '创建联系人', en: 'CREATE_CONTACT', value: 2011 },
            2012: { key: 2012, zh: '添加联系人', en: 'ADD_CONTACT', value: 2012 },
            2013: { key: 2013, zh: '删除联系人', en: 'DELETE_CONTACT', value: 2013 },
            2014: { key: 2014, zh: '添加团队成员', en: 'ADD_MEMBER', value: 2014 },
            2015: { key: 2015, zh: '删除团队成员', en: 'DELETE_MEMBER', value: 2015 },
            2016: { key: 2016, zh: '修改团队成员权限', en: 'DELETE_MEMBER', value: 2016 },
            2018: { key: 2018, zh: '写跟进', en: 'ADD_TRACK_RECORD', value: 2018 },
            2019: { key: 2019, zh: '删除跟进记录', en: 'DELETE_TRACK_RECORD', value: 2019 },
            2020: { key: 2020, zh: '添加标签', en: 'ADD_LABEL', value: 2020 },
            2021: { key: 2021, zh: '删除标签', en: 'DELETE_LABEL', value: 2021 },
            2022: { key: 2022, zh: '新建试驾单', en: 'ADD_LABEL', value: 2022 },
            2023: { key: 2023, zh: '删除试驾单', en: 'DELETE_LABEL', value: 2023 },
            2024: { key: 2024, zh: '完成试驾', en: 'ADD_LABEL', value: 2024 },
            2025: { key: 2025, zh: '取消试驾', en: 'DELETE_LABEL', value: 2025 },
            2026: { key: 2026, zh: '过期未试驾', en: 'ADD_LABEL', value: 2026 },
            2027: { key: 2027, zh: '新建用户画像', en: 'DELETE_LABEL', value: 2027 },
            2028: { key: 2028, zh: '删除用户画像', en: 'DELETE_LABEL', value: 2028 },
            2029: { key: 2029, zh: '转交合同订单', en: 'DELETE_LABEL', value: 2029 },

            3001: { key: 3001, zh: '修改客户信息', en: 'REVISE_CUSTOMER', value: 3001 },
            3002: { key: 3002, zh: '修改联系人', en: 'REVISE_CONTACT', value: 3002 },
            3003: { key: 3003, zh: '修改跟进记录', en: 'REVISE_TRACK_RECORD', value: 3003 },
            3004: { key: 3004, zh: '修改商机', en: 'REVISE_BO', value: 3004 },
            3005: { key: 3005, zh: '修改订单', en: 'REVISE_ORDER', value: 3005 },
            3006: { key: 3006, zh: '修改回款单', en: 'REVISE_ORDER_INCOME', value: 3006 },
            3007: { key: 3007, zh: '修改试驾单', en: 'REVISE_ORDER_INCOME', value: 3007 },
            3008: { key: 3008, zh: '修改用户画像', en: 'REVISE_ORDER_INCOME', value: 3008 },
        },
    },

    LABEl: {
        CATEGORY: {
            CLIENT: 1,
            BUSINESS: 2,
            ORDER: 3,
            ORDER_INCOME: 4,
        },
        CATEGORY_MAP: {
            1: { key: 1, zh: '客户', en: 'Client', value: 1 },
            2: { key: 2, zh: '商机', en: 'Business', value: 2 },
            3: { key: 3, zh: '合同订单', en: 'Contract Order', value: 3 },
            4: { key: 4, zh: '回款单', en: 'Receipt', value: 4 },
        },
    },

    CRM_REFUND_RECORD: {
        TYPE_MAP: {
            10: { key: 10, zh: '仅退款', en: 'Only Refund', value: 10 },
            20: { key: 20, zh: '退货退款', en: 'Return and Refund', value: 20 },
            30: { key: 30, zh: '其他', en: 'Other', value: 30 },
        },
    },

    CRM_DICT: {
        TYPE: {
            TYPE_CUSTOMER_SOURCE: 1, // 客户来源
            TYPE_TEST_MODEL: 2, // 试驾车型
        },
        TYPE_MAP: {
            1: { key: 1, zh: '客户来源', en: 'customer source' },
            2: { key: 2, zh: '试驾车型', en: 'test drive model' },
        },
        STATUS: {
            // 0是全部M
            STATUS_NORM: 1, // 1正常
            STATUS_DISABLE: 2, // 2停用
        },
        STATUS_MAP: {
            1: { key: 1, zh: '正常', en: 'Normal' },
            2: { key: 2, zh: '停用', en: 'Disable' },
        },
    },
    CRM_TEST_DRIVE: {
        CHANNEL: {
            SALES_ENTRY: 10,
        },
        CHANNEL_MAP: {
            10: { key: 10, zh: '销售录入', en: 'Entry of sales' },
        },
        STATUS_MAP: {
            10: { key: 10, zh: '已预约', en: 'Made An Appointment' },
            20: { key: 20, zh: '跟进中', en: 'In The Process' },
            30: { key: 30, zh: '待跟进', en: 'To Be Followed Up' },
        },

        BUY_TYPE_MAP: {
            10: { key: 10, zh: '首购', en: 'The First Purchase' },
            20: { key: 20, zh: '置换', en: 'Replacement' },
            30: { key: 30, zh: '增购', en: 'Additional' },
            40: { key: 40, zh: '暂不考虑', en: 'Leave Aside For The Moment' },
            100: { key: 100, zh: '其他', en: 'Other' },
        },
        RENTAL_DEMAND_MAP: {
            1: { key: 1, zh: '有', en: 'Yes' },
            2: { key: 2, zh: '无', en: 'No' },
        },
        TRAVEL_RANGE_MAP: {
            10: { key: 10, zh: '上下班通勤', en: 'Commuting To And From Work' },
            20: { key: 20, zh: '摩旅需求', en: 'Motorcycle Travel Demand' },
            30: { key: 30, zh: '市区出行', en: 'Urban Travel' },
            40: { key: 40, zh: '郊区出行', en: 'Suburban Travel' },
        },
        GREEN_CAR_OWNER_MAP: {
            1: { key: 1, zh: '是', en: 'Yes' },
            2: { key: 2, zh: '否', en: 'No' },
        },
        DRIVER_LICENSE_MAP: {
            1: { key: 1, zh: '有驾照', en: "Have A Driver's License" },
            2: { key: 2, zh: '无驾照', en: "No Driver's License" },
            3: { key: 3, zh: '驾考中', en: 'On The Driving Test' },
        },
        RIDE_EXP_MAP: {
            1: { key: 1, zh: '是', en: 'Yes' },
            2: { key: 2, zh: '否', en: 'No' },
        },
        MOTO_EXP_MAP: {
            1: { key: 1, zh: '是', en: 'Yes' },
            2: { key: 2, zh: '否', en: 'No' },
        },
        MOTO_TOUR_INTENTION_MAP: {
            1: { key: 1, zh: '有意向', en: 'Have an intention' },
            2: { key: 2, zh: '意向不高', en: 'Low intention' },
            3: { key: 3, zh: '无意向', en: 'Direction of no intention' },
        },
        PAY_ATTENTION_TO_MAP: {
            1: { key: 1, zh: '体验', en: 'Experience' },
            2: { key: 2, zh: '技术', en: 'Technology' },
        },
        GREEN_ENERGY_UNDERSTAND_MAP: {
            10: { key: 10, zh: '看好新能源前景', en: 'We are optimistic about the prospects of new energy' },
            20: { key: 20, zh: '对新能源了解较多', en: 'I know more about new energy' },
            30: { key: 30, zh: '对新能源了解较浅', en: 'Shallow understanding of new energy' },
            40: { key: 40, zh: '相信大众选择', en: 'Believe in mass choice' },
        },
        ELECTRIC_TWO_WHEELER_UNDERSTAND_MAP: {
            10: { key: 10, zh: '了解整车架构', en: 'Understand the vehicle architecture' },
            20: { key: 20, zh: '出行便捷', en: 'Convenient travel' },
            30: { key: 30, zh: '不了解', en: 'Out of touch' },
        },
        PRE_ORDER_CAR_TYPE_MAP: {
            1: { key: 1, zh: 'SENMENTI O', en: 'SENMENTI O' },
            2: { key: 2, zh: 'SENMENTI X', en: 'SENMENTI X' },
        },
        // 试驾单-订单来源
        SOURCE_TYPE: {
            10: { key: 10, zh: '销售录入', en: 'Sales Entry', value: 10 },
            20: { key: 20, zh: '官网1.0预约', en: 'Official Website 1.0 Appointment', value: 20 },
            30: { key: 30, zh: '落地页1', en: 'Landing page 1', value: 30 },
            31: { key: 31, zh: '落地页2', en: 'Landing page 2', value: 31 },
            40: { key: 40, zh: '官网2.0预约', en: 'Official Website 2.0 Appointment', value: 40 },
        },
    },
    INTENTION: {
        TYPE_MAP: {
            10: { key: '无意向', value: 10, status: 'empty', img_url: 'INTENT_EMPTY' },
            20: { key: '有意向', value: 20, status: 'little', img_url: 'INTENT_LITTLE' },
            30: { key: '高意向', value: 30, status: 'tall', img_url: 'INTENT_HIGH' },
            40: { key: 'Hot', value: 40, status: 'hot', img_url: 'INTENT_HOT' },
        },
        IMG_MAP: {
            INTENT_EMPTY:
                'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/4e6c67d8f5a90c0206b8c307e404771e705060fe923b4a22f56cd1cafc6992de.png', // 无意向图标
            INTENT_LITTLE:
                'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/1f032557ea384714de805694d90a8ef47caf3349c2f968de8a70f4c91a1f0149.png', // 有意向图标
            INTENT_HIGH:
                'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/c6b26b933225fba3e06b58e2193214d9a59f9527843e10688b91752b7bcacc81.png', // 高意向图标
            INTENT_HOT:
                'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/8a917d79979a636dc22b7c2fed8dd95d45eb7e67e01816dfcddda485b01ff180.png', // HOT意向图标
        },
        // 车型
        CAR_TYPE_MAP: {
            1: { key: 'SENMENTI 0', value: 1 },
            2: { key: 'SENMENTI X', value: 2 },
        },
        // 客户来源
        SOURCE_TYPE_MAP: {
            1: { key: '预定小程序', value: 1 },
            2: { key: '后台注册', value: 2 },
            3: { key: 'Shopify', value: 3 },
            4: { key: '官网2.0', value: 4 },
            5: { key: '官网1.0', value: 5 },
            30: { key: '落地页1', value: 30 },
            31: { key: '落地页2', value: 31 },
            32: { key: '体验官二维码', value: 32 },
            33: { key: '门店二维码', value: 33 },
            34: { key: '人工创建', value: 34 },
        },
        // 标签
        TAG_TYPE_MAP: {
            3: { key: '标签', value: 3, color: '#3381FF' /*字体颜色*/, bgColor: '#E6EFFF' /*背景颜色*/ },
            4: { key: '关注点', value: 4, color: '#00B42A' /*字体颜色*/, bgColor: '#E1F7E3' /*背景颜色*/ },
            5: { key: '摩托车型号', value: 5, color: '#3381FF' /*字体颜色*/, bgColor: '#E6EFFF' /*背景颜色*/ },
            6: { key: '用车城市', value: 6, color: '#3381FF' /*字体颜色*/, bgColor: '#E6EFFF' /*背景颜色*/ },
        },
        TAG_TYPE: {
            TAG: 3, // 正常标签
            FOCUS: 4, // 关注点
            MODEL: 5, // 摩托车型号
            CITY: 6, // 用车城市
        },
    },

    // 测试
    TEST: {
        SPACE_MAP: {
            26005: { value: 26005, text: 'BMS-26005' },
        },

        TYPE: {
            BMS_PLUG_IN_MACHINE: 10001,
        },
        TYPE_MAP: {
            10001: { value: 10001, key: 't.test_case.bms_plug_in_machine', text: 'BMS外挂整机测试' },
            26003: { value: 26003, key: 't.test_case.lierda_vcu_test', text: '利尔达VCU测试' },
        },

        TYPE_CASE_MAP: {
            10001: {
                '0001': '扫电池条码',
                '0002': '连接设备',
                '0005': 'DTU连通性测试',
                '0004': '电池电量测试',
                '0003': '读取数据校验项',
                '0006': '电池关闭测试',
                '0007': '电池开启测试',
            },
        },

        STATUS: {
            INIT: 0,
            RUNNING: 100,
            PASS: 200,
            FAIL: -100,
        },
        STATUS_MAP: {
            0: { value: 0, text: '初始化', color: 'gray' },
            100: { value: 100, text: '测试中', color: 'blue' },
            200: { value: 200, text: '已通过', color: 'green' },
            '-100': { value: -100, text: '未通过', color: 'red' },
        },
    },
    MONEYTYPE: {
        TYPE_MAP: {
            1: { value: 'usd', zh: '美元', en: 'dollar' },
            2: { value: 'eur', zh: '欧元', en: 'euro' },
        },
        TYPE: {
            DOLLAR: 1,
            EURO: 2,
        },
    },
    // 语言
    language: {
        1: { key: 1, zh: '中文', en: 'Chinese' },
        2: { key: 2, zh: '英文', en: 'English' },
    },
    // 试驾单
    test_drive: {
        test_drive_status: {
            0: { key: 0, zh: '未联系', en: 'uncontacted' },
            5: { key: 5, zh: '已联系', en: 'Have contacted' },
            10: { key: 10, zh: '预约试驾', en: 'Make drive' },
            20: { key: 20, zh: '试驾中', en: 'Appointment in progress' },
            30: { key: 30, zh: '已试驾', en: 'tested' },
            40: { key: 40, zh: '过期未试驾', en: 'No test drive due' },
        },
    },
    // 日期
    DATATIMES: {
        week: {
            1: { key: 1, zh: '周一', en: 'Monday' },
            2: { key: 2, zh: '周二', en: 'Tuesday' },
            3: { key: 3, zh: '周三', en: 'Wednesday' },
            4: { key: 4, zh: '周四', en: 'Thursday' },
            5: { key: 5, zh: '周五', en: 'Friday' },
            6: { key: 6, zh: '周六', en: 'Saturday' },
            7: { key: 7, zh: '周日', en: 'Sunday' },
        },
    },
    // 用户判断
    USERNAME: {
        admin1: true,
    },
    // 国内零售业务
    RETAIL: {
        Order_Status_Map: {
            paid: 1, // 已支付
            to_be_paid: 2, // 待支付
            apply_refund: 3, // 申请退订/退款
            unsubscribed_refunded: 4, // 已退订/退款
        },
        // 服装尺寸
        Outfit_Size: {
            S: { key: 1, value: 'S' },
            M: { key: 2, value: 'M' },
            L: { key: 3, value: 'L' },
            XL: { key: 4, value: 'XL' },
            XXL: { key: 5, value: 'XXL' },
            XXXL: { key: 6, value: 'XXXL' },
            XXXXL: { key: 7, value: 'XXXXL' },
        },
        // 工作状态
        Working_condition: {
            1: { key: 1, zh: '在职', en: 'Be on the job' },
            2: { key: 2, zh: '培训', en: 'train' },
            3: { key: 3, zh: '离职（系统判断）', en: 'dimission' },
        },
        // 职务
        Job: {
            103001: { father_type: 1, key: 103001, zh: '国内市场管理员', en: 'Home market manager' },
            103002: { father_type: 2, key: 103002, zh: '大区经理', en: 'Regional manager' },
            103003: { father_type: 3, key: 103003, zh: '城市经理', en: 'City manager' },
            103004: { father_type: 6, key: 103004, zh: '运营', en: 'operate' },
            103005: { father_type: 7, key: 103005, zh: '客服', en: 'Customer Service' },
            3000001: { father_type: 4, key: 3000001, zh: '门店店长', en: 'Store manager' },
            3000002: { father_type: 5, key: 3000002, zh: '用户体验官', en: 'User experience officer' },
        },
        Job_Map: {
            MARKET_MANAGER: 103001,
            REGIONAL_MANAGER: 103002,
            CITY_MANAGER: 103003,
            OPERATE: 103004,
            CUSTOMER_SERVICE: 103005,
            STORE_MANAGER: 3000001,
            OFFICER: 3000002,
        },
        // 车辆用途
        Vehicle_Usage: {
            1: { key: 1, zh: '试驾车', en: 'Test Drive' },
            2: { key: 2, zh: '展车', en: 'Display Car' },
            3: { key: 3, zh: '工具车', en: 'Tool Car' },
        },
        // 使用状态
        Use_Status: {
            1: { key: 1, zh: '配置中', en: 'Configuring' },
            2: { key: 2, zh: '使用中', en: 'In use' },
            3: { key: 3, zh: '停用中', en: 'Out of use' },
            4: { key: 4, zh: '维保中', en: 'Maintenance in progress' },
        },
        // 订单状态
        Order_Status: {
            1: { key: 1, value: 'retail.not_order' }, // 未下单
            1: { key: 1, value: 'retail.intention_deposit_paid' }, // 已付意向金
            2: { key: 2, value: 'retail.paid_small_order' }, // 已付小订
            3: { key: 3, value: 'retail.paid_large_order' }, // 已付大订
            4: { key: 4, value: 'retail.final_payment_paid' }, // 已付尾款
            5: { key: 5, value: 'retail.to_be_delivered' }, // 待交付
            6: { key: 6, value: 'retail.delivered' }, // 已交付
            7: { key: 7, value: 'retail.to_be_invoiced' }, // 待开票
            8: { key: 8, value: 'retail.completed' }, // 已完成
            9: { key: 9, value: 'retail.unsubscribing' }, // 退订中
            10: { key: 10, value: 'retail.unsubscribed' }, // 已退订
            11: { key: 11, value: 'retail.being_refunded' }, // 退款中
            12: { key: 12, value: 'retail.refunded' }, // 已退款
        },
        // 车辆系列
        Vehicle_Series: {
            1: { key: 1, value: 'SENMENTI 0' },
            2: { key: 2, value: 'SENMENTI X' },
        },
        // 支付状态
        Payment_Status: {
            1: { key: 1, zh: '已支付', en: 'Have Paid' },
            2: { key: 2, zh: '未支付', en: 'Non Payment' },
        },
        // 支付方式
        Payment_Method: {
            // 国内的是支付方式只有 微信
            1: { key: 1, zh: '微信', en: 'wechat' },
            2: { key: 2, zh: '支付宝', en: 'Alipay' },
            3: { key: 3, zh: '银行卡', en: 'Bank card' },
        },

        STORE_STATUS: {
            // 门店状态
            1: { key: 1, zh: '装修', en: 'fitment', value: 1 },
            2: { key: 2, zh: '试营业', en: 'Soft opening', value: 2 },
            3: { key: 3, zh: '开业', en: 'Opening', value: 3 },
        },

        STORE_TYPE: {
            // 门店类型
            1: { key: 1, zh: '零售体验中心', en: 'Retail Experience Center', value: 1 },
            2: { key: 2, zh: '零售体验店', en: 'Retail Experience Store', value: 2 },
            3: { key: 3, zh: '交付中心', en: 'Delivery Center', value: 3 },
            4: { key: 4, zh: '维修服务中心', en: 'Repair service center', value: 4 },
            5: { key: 5, zh: '体验展厅', en: 'Experience the showroom', value: 5 },
            6: { key: 6, zh: '活动展会', en: 'Event exhibition', value: 6 },
        },

        STORE_LEVEL: {
            // 门店等级
            1: { key: 1, zh: 'A类', en: 'A kind', value: 1 },
            2: { key: 2, zh: 'B类', en: 'B kind', value: 2 },
            3: { key: 3, zh: 'C类', en: 'C kind', value: 3 },
        },
    },
    VOTE: {
        SOURCE_TYPE_MAP: {
            1: { value: 1, text: '好友分享' },
            2: { value: 2, text: '官网' },
            3: { value: 3, text: '公众号二维码' },
            4: { value: 4, text: '微博链接' },
            5: { value: 5, text: '直接进入' },
        },
        TYPE: {
            DAILYVOTE: 1,
            SOURCE: 2,
            PAID: 3,
            COLOR: 4,
            AREA: 5,
            SHARE: 6,
        },
        VOTE_RESULT: {
            1: { key: 1, text: '白日梦影', value: 1 },
            2: { key: 2, text: '月影华彩', value: 2 },
            3: { key: 2, text: '星际漫游', value: 3 },
            4: { key: 2, text: '朝日炫影', value: 4 },
            5: { key: 2, text: '黑曜星尘', value: 5 },
            6: { key: 2, text: '紫光幻境', value: 6 },
            7: { key: 2, text: '浩万橙光', value: 7 },
            8: { key: 2, text: '深空炽橙', value: 8 },
        },
    },

    // 好物订单
    GOODITEMORDER: {
        Order_Status_Map: {
            1: { key: 1, zh: '全部', en: 'All', value: 0 },
            2: { key: 2, zh: '待发货', en: 'To Be Paid', value: 300 },
            3: { key: 3, zh: '已发货', en: 'Shipped', value: 400 },
            4: { key: 4, zh: '已完成', en: 'Completed', value: 500 },
        },
        // 奖品订单来源
        Source_Channel: {
            // '1': { key: 1, zh: '新春贺礼订单', en: 'New Year Gift Order',value:1 },
            // '1': { key: 1, zh: '投票分享', en: 'Voting Sharing', value: 1 },
            2: { key: 2, zh: '分享好友', en: 'Share friends', value: 2 },
            3: { key: 3, zh: '投票抽奖', en: 'Voting lottery', value: 3 },
        },
        // 修改好物订单记录
        Update_Record: {
            1: { key: 1, zh: '快递单号', en: 'Modify Tracking Number', value: 1 },
        },
        // 活动入口--来源类型1好友分享 2官网 3公众号 4 微博 5 直接进入
        Source_Type: {
            1: { key: 1, zh: '好友分享', en: 'Friends Share', value: 1 },
            2: { key: 1, zh: '官网', en: 'Official Website', value: 2 },
            3: { key: 1, zh: '公众号', en: 'Official Account', value: 3 },
            4: { key: 1, zh: '微博', en: 'Weibo', value: 4 },
            5: { key: 1, zh: '直接进入', en: 'Direct Entry', value: 5 },
        },
    },
    // 飞书人员所属类型
    FEISHUTYPE: {
        // 人员归属
        TYPE: {
            // 对应上面的Job
            1: { key: 1, zh: '国内市场管理员', en: 'Home market manager' },
            2: { key: 2, zh: '大区经理', en: 'Regional manager' },
            3: { key: 3, zh: '城市经理', en: 'City manager' },
            4: { key: 4, zh: '门店店长', en: 'Store manager' },
            5: { key: 5, zh: '用户体验官', en: 'User experience officer' },
            // 这两个字段前端自己玩自己的不传给后端
            6: { key: 6, zh: '运营', en: 'operate' },
            7: { key: 7, zh: '客服', en: 'Customer Service' },
            10: { key: 10, zh: '管理员', en: 'Admin' },
        },
    },
    // 国内销售-（工作台）运营
    WORK_OPERATION: {
        // 沟通方式
        COMMUNICATE_TYPE: {
            20: { key: 20, value: 20, zh: '电话沟通' },
            10: { key: 10, value: 10, zh: '面谈' },
            30: { key: 30, value: 30, zh: '未打通' },
        },
        // 跟进类型
        FOLLOW_TYPE: {
            10: { key: 10, value: 10, zh: '补充信息缺失', background: '#FFECE8', color: '#F53F3F', borderC: '#FCB9B6' },
            20: { key: 20, value: 20, zh: '预约试驾', background: '#E6EFFF', color: '#3381FF', borderC: '#A1C5FF' },
            30: { key: 30, value: 30, zh: '跟进', background: '#E8FFEA', color: '#00B42A', borderC: '#A3E9B1' },
        },
        // 试驾状态
        TEST_DRIVE_STATUS: {
            // 试驾单状态 10 预约 15 签到 20 试驾中 30 试驾结束 40 过期未试驾 50 取消试驾
            10: { key: 10, value: 10, zh: '预约' },
            15: { key: 15, value: 15, zh: '签到' },
            20: { key: 20, value: 20, zh: '试驾中' },
            30: { key: 30, value: 30, zh: '试驾结束' },
            40: { key: 40, value: 40, zh: '过期未试驾' },
            50: { key: 50, value: 50, zh: '取消试驾' },
        },
        LOG_KEY_MAP: {
            name: { key: 'name', text: '客户名称' },
            phone: { key: 'phone', text: '手机号' },
            email: { key: 'email', text: '邮箱' },
            city: { key: 'city', text: '城市' },
            address: { key: 'address', text: '地址' },
            birthday: { key: 'birthday', text: '出生日期' },
            country: { key: 'country', text: '国家' },
            province: { key: 'province', text: '省份' },
            intent_vehidle_model: { key: 'intent_vehidle_model', text: '意向车型' },
            gender: { key: 'gender', text: '性别' },
            intention: { key: 'intention', text: '意向度' },
        },
        INTENTION: {
            TYPE_LIST: [
                { key: '无意向', value: 10 },
                { key: '有意向', value: 20 },
                { key: '高意向', value: 30 },
                { key: 'Hot', value: 40 },
            ],
            TYPE_MAP: {
                10: { text: '无意向', key: 10 },
                20: { text: '有意向', key: 20 },
                30: { text: '高意向', key: 30 },
                40: { text: 'Hot', key: 40 },
            },
        },
    },
    // COC证书
    COC: {
        TAB_TYPE: {
            0: { key: 0, zh: '全部', en: 'ALL', color: 'default' },
            1: { key: 1, zh: '已生成', en: 'Generated', color: '#00B42A' },
            2: { key: 2, zh: '已部分生成', en: 'Partially Generated', color: '#F77234' },
            3: { key: 3, zh: '未生成', en: 'Not Generate', color: '#86909C' },
        },
        DOWN_LOAD_TYPE: {
            1: { key: 1, type: '证书列表' },
            2: { key: 2, type: '证书详情' },
        },
        // 证书状态
        CER_STATUS: {
            0: { key: 0, zh: '已过期', en: 'Expired', color: '#F53F3F' },
            1: { key: 1, zh: '生效中', en: 'In effect', color: '#00B42A' },
        },
    },
    // 质检
    INSPECTION: {
        STATUS_MAP: {
            0: '质检中',
            100: '不合格',
            200: '合格',
        },
        STATUS_COLOR_MAP: {
            0: 'blue',
            100: 'red',
            200: 'green',
        },
        TYPE_MAP: {
            1: '全检',
            2: '抽检',
            3: '免检',
        },
        TYPE_COLOR__MAP: {
            1: 'green',
            2: 'blue',
            3: 'red',
        },
    },
    SUBSCRIPTION: {
        STATUS_MAP: {
            0: { color: 'blue', text: '未订阅' },
            1: { color: 'green', text: '已订阅' },
            2: { color: 'grey', text: '已退订' },
        },
    },
    LANG_MAP: {
        en: { key: 101, value: 'en', label: '欧洲' },
        us: { key: 201, value: 'us', label: '美国' },
        de: { key: 102, value: 'de', label: '德国' },
    },
    ORDER: {
        // 区域-area对应订单金额单位
        AreaUnit: {
            zh: { key: '1', name_index: 'name' },
            en: { key: '2', name_index: 'name_en' },
        },
    },
};

export default Const;

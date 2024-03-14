const DISTRIBUTOR = {
    // 代理商
    TYPE: {
        INTERNAL: 1, //国内
        EXPORT: 2, //出口
    },
    TYPE_LIST: [
        { zh: '国内', en: 'Internal', value: 1 },
        { zh: '出口', en: 'Export', value: 2 },
    ],
    TYPE_MAP: {
        1: { key: 1, zh: '国内', en: 'Internal' },
        2: { key: 2, zh: '出口', en: 'Export' },
    },
    PAY_TIME: {
        PAYMENT_TYPE_ALL_PAYMENT: 10,
        PAYMENT_TYPE_DOWN_PAYMENT: 20,
        PAYMENT_TYPE_PAYMENT_DAYS_30: 30,
        PAYMENT_TYPE_PAYMENT_DAYS_60: 40,
        PAYMENT_TYPE_PAYMENT_DAYS_90: 50,
        TT: 60,
        OA: 70,
    },
    PAY_TIME_LIST: {
        10: { key: 10, zh: '全款支付', en: 'Full payment' },
        20: { key: 20, zh: 'TT(30%定金,70%尾款)', en: 'TT' },
        30: { key: 30, zh: 'OA 30天', en: 'OA 30 days' },
        40: { key: 40, zh: 'OA 60天', en: 'OA 60 days' },
        50: { key: 50, zh: 'OA 90天', en: 'OA 90 days' },
        60: { key: 50, zh: 'TT', en: 'TT' },
        70: { key: 50, zh: 'OA', en: 'OA' },
    },
    PAY_TIME_MAP: {
        10: '全款支付',
        20: 'TT(30%定金,70%尾款)',
        30: 'OA 30天',
        40: 'OA 60天',
        50: 'OA 90天',
        60: 'TT',
        70: 'OA',
    },
    // 创建分销商 支付方式
    PAY_METHODS: {
        TT: 1,
        OA: 2,
    },
    PAY_METHODS_MAP: {
        1: { key: 1, t: 'TT' },
        2: { key: 2, t: 'OA' },
    },
    // 运费状态
    FREIGHT_STATUS: {
        ALL: 0, // 全部
        TO_BE_FILLED_IN: 50, // 待填写
        TO_BE_CONFIRMED: 100, // 待确认
        CONFIRMED: 200, // 已确认
        REJECTED: -200, // 已拒绝
    },
    FREIGHT_STATUS_MAP: {
        // 0: { key: 0, t: "common.all"}, // 全部
        50: { key: 50, t: 'distributor.to_be_filled_in' }, // 待填写
        100: { key: 100, t: 'distributor.to_be_determined' }, // 待确认
        200: { key: 200, t: 'distributor.determined' }, // 已确认
        '-200': { key: -200, t: 'distributor.rejected' }, // 已拒绝
    },
    AUDIT_RESULT: {
        REFUSE: -200, // 不通过
        CONFIRM: 200, // 确认
    },
    AUDIT_RESULT_MAP_ARR: [
        { key: 200, t: 'common.confirm' }, // 确认
        { key: -200, t: 'common.refuse' }, // 拒绝
    ],
    // 取消订单申请表 下的状态
    CANCELLATION_ORDER_TAB: {
        ALL: 0,
        DEALT_WITH: 1, // 待处理
        HAS_AGREED: 2, // 已同意
        REJECTED: 3, // 已拒绝
    },
    // 尾款未支付订单表 和 尾款待支付订单表
    FINAL_UNPAID_ORDER_TAB: {
        ALL: 0,
        WITHIN_WEEK: 1, // 一周内
        DELAY: 2, // 延期
    },
    // 取消的状态
    AUDIT_CANCEL_STATUS: {
        // 1 审核中 2 审核通过  3 审核拒绝
        WAITING_FOR_APPROVAL: 1,
        APPROVED_AND_APPROVED: 2,
        AUDIT_REJECTION: 3,
    },
    AUDIT_CANCEL_STATUS_MAP: {
        1: { key: 1, t: 'distributor-detail.under_review' },
        2: { key: 2, t: 'distributor-detail.audit_pass' },
        3: { key: 3, t: 'distributor-detail.audit_rejection' },
    },
    // 运费支付状态
    FREIGHT_PAY_STATUS_MAP: {
        100: { key: 100, t: 'common.to_be_paid' },
        200: { key: 200, t: 'common.paid' },
    },
    FREIGHT_PAY_STATUS: {
        to_be_paid: 100,
        paid: 200,
    },
};

export default DISTRIBUTOR;

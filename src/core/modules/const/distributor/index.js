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
    },
    PAY_TIME_LIST: {
        10: { key: 10, zh: '全款发货', en: 'Full payment delivery' },
        20: { key: 20, zh: 'TT(30%定金,70%尾款)', en: 'TT' },
        30: { key: 30, zh: 'OA 30天', en: 'OA 30 days' },
        40: { key: 40, zh: 'OA 60天', en: 'OA 60 days' },
        50: { key: 50, zh: 'OA 90天', en: 'OA 90 days' },
    },
    PAY_TIME_MAP: {
        10: 'TT(30%定金,70%尾款)',
        20: 'OA 30天',
        30: 'OA 60天',
        40: 'OA 90天',
    },
    // 创建分销商 支付方式
    PAY_METHODS: {
        TT: 1,
        OA: 2,
    },
    PAY_METHODS_MAP: {
        1: { key: 1, t: "TT" },
        2: { key: 2, t: "OA" },
    }
};

export default DISTRIBUTOR;

const PAYMENT_MANAGEMENT = {
    EFFECTIVE_TYPE: {
        0: { value: 0, zh: '全部', en: 'All' },
        100: { value: 100, zh: '未生效', en: 'Not Activated' },
        200: { value: 200, zh: '已生效', en: 'Took Effect' },
    },
    EFFECTIVE_TYPE_MAP: {
        NO: 100, // 未生效
        YES: 200, // 已生效
    },
};

export default PAYMENT_MANAGEMENT;

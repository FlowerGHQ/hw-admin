const QUALIFIED_LIST = {
    // purchase_category
    PURCHASE_CATEGORY: {
        // RP类
        RP: { label: 'RP类', value: 'RP类' },
        // 包材类
        PACKAGING: { label: '包材类', value: '包材类' },
        // 电池类
        BATTERY: { label: '电池类', value: '电池类' },
        // 电机类
        MOTOR: { label: '电机类', value: '电机类' },
        // 电控类
        CONTROL: { label: '电控类', value: '电控类' },
        // 发泡类
        FOAM: { label: '发泡类', value: '发泡类' },
        // 结构类
        STRUCTURE: { label: '结构类', value: '结构类' },
        // 模具类
        MOLD: { label: '模具类', value: '模具类' },
        // 塑料类
        PLASTIC: { label: '塑料类', value: '塑料类' },
        // 橡胶类
        RUBBER: { label: '橡胶类', value: '橡胶类' },
    },
    PURCHASE_CATEGORY_LIST: [
        { label: 'RP类', value: 'RP类', id: 1 },
        { label: '包材类', value: '包材类', id: 2 },
        { label: '电池类', value: '电池类', id: 3 },
        { label: '电机类', value: '电机类', id: 4 },
        { label: '电控类', value: '电控类', id: 5 },
        { label: '发泡类', value: '发泡类', id: 6 },
        { label: '结构类', value: '结构类', id: 7 },
        { label: '模具类', value: '模具类', id: 8 },
        { label: '塑料类', value: '塑料类', id: 9 },
        { label: '橡胶类', value: '橡胶类', id: 10 },
    ],
    // register_type
    REGISTRATION_TYPE: {
        // 个人
        PERSONAL: { label: '个人', value: '1' },
        // 企业
        COMPANY: { label: '企业', value: '1' },
    },
    REGISTRATION_TYPE_LIST: [
        { label: '新增', value: 1, id: 1 },
        { label: '更名', value: 2, id: 2 },
    ],
};

export default QUALIFIED_LIST;

export default {
    // 问询单类型
    INQUIRY_SHEET_TYPE: {
        1: { value: 1, t: 'customer-care.malfunction' }, // 故障
        2: { value: 2, t: 'customer-care.consultation' }, // 咨询
        3: { value: 3, t: 'customer-care.battery' }, // 电池
    },
    INQUIRY_SHEET_TYPE_MAP: {
        MALFUNCTION: 1, // 故障
        CONSULTATION: 2, // 咨询
        BATTERY: 3, // 电池
    },

    // 订单状态
    ORDER_STATUS: {
        '-1': { value: -1, t: 'common.all' }, // 全部
        10: { value: 10, t: 'customer-care.waiting_processing' }, // 等待处理
        20: { value: 20, t: 'customer-care.in_process' }, // 处理中
        30: { value: 30, t: 'customer-care.resolved' }, // 已解决
    },
    ORDER_STATUS_MAP: {
        ALL: -1,
        EQUALTREATMENT: 10, // 等待处理
        INPROCESS: 20, // 处理中
        RESOLVED: 30, // 已解决
    },
    // 故障类型
    FAULT_TYPE: {
        '-1': { value: -1, t: 'common.all' }, // 全部
        1: { value: 1, t: 'customer-care.failure' }, // 失效
        2: { value: 2, t: 'customer-care.abnormal_sound' }, // 异响
        3: { value: 3, t: 'customer-care.scratch' }, // 划伤
        4: { value: 4, t: 'customer-care.burning' }, // 燃烧
        5: { value: 5, t: 'customer-care.accident' }, // 事故
    },
    // 问询标签
    SORTING_TYPE: {
        '-1': { value: -1, t: 'common.all' }, // 全部
        1: { value: 10, t: 'customer-care.consultation' }, // 咨询
        2: { value: 20, t: 'customer-care.complaints' }, // 投诉
        310: { value: 310, t: 'customer-care.general_claim' }, // 索赔-a.普通索赔
        320: { value: 320, t: 'customer-care.bona_fide_claim' }, // 索赔-b.善意索赔
        330: { value: 330, t: 'customer-care.unpacking_damage' }, // 开箱损
    },
    SORTING_TYPE_THREE_MAP: {
        CONSULTATION: 1, // 咨询
        COMPLAINTS: 2, // 投诉
        CLAIMCOMPENSATION: 3, // 索赔
    },
    SORTING_TYPE_THREE: {
        1: { value: 1, t: 'customer-care.consultation' }, // 咨询
        2: { value: 2, t: 'customer-care.complaints' }, // 投诉
        3: { value: 3, t: 'customer-care.claim_compensation' }, // 索赔
    },
    SORTING_TYPE_TWO: {
        310: { value: 310, t: 'customer-care.general_claim' }, // 普通索赔
        320: { value: 320, t: 'customer-care.bona_fide_claim' }, // 善意索赔
        330: { value: 330, t: 'customer-care.unpacking_damage' }, // 开箱损
    },
    SORTING_TYPE_TWO_MAP: {
        GENERALCLAIM: 310, // 普通索赔
        BONAFIDECLAIM: 320, // 善意索赔
        UNPACKINGDAMAGE: 330, // 开箱损
    },
    //咨询类别
    CONSULTATION_TYPE: {
        110: { value: 110, t: 'customer-care.technical_consultation' }, // 技术咨询
        120: { value: 120, t: 'customer-care.policy_consultation' }, // 政策咨询
        130: { value: 130, t: 'customer-care.business_consultation' }, // 业务咨询
        140: { value: 140, t: 'customer-care.other_consultation' }, // 其他咨询
    },
    // 保内 保外 其他
    GOOD_FAITH: {
        1: { value: 1, t: 'common.within_warranty' }, // 保内
        2: { value: 2, t: 'common.on_bail' }, // 保外
        3: { value: 3, t: 'common.other' }, // 其他
    },
    // part_status
    PART_STATUS: {
        1: { value: 1, t: 'customer-care.complete_vehicle' }, // 整车
        2: { value: 2, t: 'customer-care.parts_materials' }, // 零部件/物料
        3: { value: 3, t: 'customer-care.periphery' }, // 周边
        4: { value: 4, t: 'customer-care.publicity_products' }, // 广宣品
        5: { value: 5, t: 'customer-care.expenses' }, // 费用
    },
};

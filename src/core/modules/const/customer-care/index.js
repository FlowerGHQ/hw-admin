export default  {
    // 问询单类型
    INQUIRY_SHEET_TYPE: {
        '1': { value: 1, t: 'customer-care.malfunction' }, // 故障
        '2': { value: 2, t: 'customer-care.consultation' }, // 咨询
        '3': { value: 3, t: 'customer-care.battery' }, // 电池
    },
    INQUIRY_SHEET_TYPE_MAP: {
        MALFUNCTION: 1, // 故障
        CONSULTATION: 2, // 咨询
        BATTERY: 3, // 电池
    },

    // 订单状态
    ORDER_STATUS: {
        '-1': { value: -1, t: 'common.all',  }, // 全部
        '10': { value: 10, t: 'customer-care.equal_treatment',  }, // 等处理
        '20': { value: 20, t: 'customer-care.in_process',  }, // 处理中
        '30': { value: 30, t: 'customer-care.resolved',  }, // 已解决
    },
    // 故障类型
    FAULT_TYPE: {
        '-1': { value: -1, t: 'common.all',  }, // 全部
        '10': { value: 10, t: 'customer-care.failure',  }, // 失效
        '20': { value: 20, t: 'customer-care.abnormal_sound',  }, // 异响
        '30': { value: 30, t: 'customer-care.scratch',  }, // 划伤
        '40': { value: 40, t: 'customer-care.burning',  }, // 燃烧
        '50': { value: 50, t: 'customer-care.accident',  }, // 事故
    },
    // 问询标签    
    SORTING_TYPE: {
        '-1': { value: -1, t: 'common.all',  }, // 全部
        '10': { value: 10, t: 'customer-care.consultation',  }, // 咨询
        '20': { value: 20, t: 'customer-care.complaints',  }, // 投诉
        '30': { value: 30, t: 'customer-care.claim_a_general_claim',  }, // 索赔-a.普通索赔
        '40': { value: 40, t: 'customer-care.claim_b_Bona_fide_claim',  }, // 索赔-b.善意索赔
        '50': { value: 50, t: 'customer-care.unpacking_damage',  }, // 开箱损
    }
}
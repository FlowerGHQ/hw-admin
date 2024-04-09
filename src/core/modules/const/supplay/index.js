const SUPPLAY = {
    SUPPLAY_TYPE: {
        1: { value: 1, zh: '零件类', en: 'Part Class', t: 'supply-chain.part', icon: 'part' },
        2: { value: 2, zh: '代理类', en: 'Broker Class', t: 'supply-chain.broker', icon: 'broker' },
        3: { value: 3, zh: '外协类', en: 'Outsourcing Class', t: 'supply-chain.outsourcing', icon: 'outsourcing' },
        4: { value: 4, zh: '模具类', en: 'Mold Class', t: 'supply-chain.mold', icon: 'mold' },
        5: { value: 5, zh: '客指类', en: 'CustomerRefers Class', t: 'supply-chain.customer_refers', icon: 'customer' },
    },
    SUPPLAY_TYPE_MAP: {
        Part: 1,
        Broker: 2,
        Outsourcing: 3,
        Mold: 4,
        CustomerRefers: 5,
    },
    SUPPLAY_TYPE_LIST: [
        { value: 1, zh: '零件类', en: 'Part Class', t: 'supply-chain.part' },
        { value: 2, zh: '代理类', en: 'Broker Class', t: 'supply-chain.broker' },
        { value: 3, zh: '外协类', en: 'Outsourcing Class', t: 'supply-chain.outsourcing' },
        { value: 4, zh: '模具类', en: 'Mold Class', t: 'supply-chain.mold' },
        { value: 5, zh: '客指类', en: 'CustomerRefers Class', t: 'supply-chain.customer_refers' },
    ],
    // 职位
    POSITION_MAP: {
        1: { value: 1, t: 'supply-chain.sales' },
        2: { value: 2, t: 'supply-chain.quality' },
        3: { value: 3, t: 'supply-chain.technology' },
        4: { value: 4, t: 'supply-chain.general_manager' },
    },
    POSITION_MAP_STATUS: {
        SALES: 1,
        QUALITY: 2,
        TECHNOLOGY: 3,
        GENERAL_MANAGER: 4,
    },
    // 职位
    POSITION: [
        { value: 4, t: 'supply-chain.general_manager', label: 'supply-chain.general_manager' },
        { value: 1, t: 'supply-chain.sales', label: 'supply-chain.sales' },
        { value: 2, t: 'supply-chain.quality', label: 'supply-chain.quality' },
        { value: 3, t: 'supply-chain.technology', label: 'supply-chain.technology' },
    ],
    POSITION_LIST: [
        { value: 4, t: 'supply-chain.general_manager' },
        { value: 1, t: 'supply-chain.sales' },
        { value: 2, t: 'supply-chain.quality' },
        { value: 3, t: 'supply-chain.technology' },
    ],
    // 技术信息
    TECHNICAL_INFORMATION: [
        { value: 1, label: '独立设计', t: 'supply-chain.stand_alone_design' }, // 独立设计
        { value: 2, label: '共同设计', t: 'supply-chain.co_design' }, // 共同设计
        { value: 3, label: '转化设计', t: 'supply-chain.translational_design' }, //转化设计
        { value: 4, label: '委外设计', t: 'supply-chain.outsourced_design' }, //委外设计
    ],
    TECHNICAL_INFORMATION_OBJECT: {
        1: { value: 1, t: 'supply-chain.stand_alone_design', label: 'supply-chain.stand_alone_design' }, // 独立设计
        2: { value: 2, t: 'supply-chain.co_design', label: 'supply-chain.co_design' }, // 共同设计
        3: { value: 3, t: 'supply-chain.translational_design', label: 'supply-chain.translational_design' }, //转化设计
        4: { value: 4, t: 'supply-chain.outsourced_design', label: 'supply-chain.outsourced_design' }, //委外设计
    },

    // 过程设计
    PROCESS_DESIGN: [
        { value: 5, label: '模具设计', t: 'supply-chain.mold_design' }, // 模具设计
        { value: 6, label: '检具设计', t: 'supply-chain.fixture_design' }, // 检具设计
        { value: 7, label: '辅具设计', t: 'supply-chain.tooling_design' }, //辅具设计
        { value: 8, label: '工装设计', t: 'supply-chain.assistive_device_design' }, //工装设计
    ],
    PROCESS_DESIGN_OBJECT: {
        5: { value: 5, t: 'supply-chain.mold_design', label: 'supply-chain.mold_design' }, // 模具设计
        6: { value: 6, t: 'supply-chain.fixture_design', label: 'supply-chain.fixture_design' }, // 检具设计
        7: { value: 7, t: 'supply-chain.tooling_design', label: 'supply-chain.tooling_design' }, //辅具设计
        8: { value: 8, t: 'supply-chain.assistive_device_design', label: 'supply-chain.assistive_device_design' }, //工装设计
    },

    // 过程验证
    PROCESS_VALIDATION: [
        { value: 1, label: '模具验收', t: 'supply-chain.mold_acceptance' }, // 模具验收
        { value: 2, label: '检具验收', t: 'supply-chain.inspection_fixture_acceptance' }, // 检具验收
        { value: 3, label: '工装验收', t: 'supply-chain.tooling_acceptance' }, //工装验收
        { value: 4, label: '产品鉴定', t: 'supply-chain.product_identification' }, //产品鉴定
    ],
    PROCESS_VALIDATION_OBJECT: {
        1: { value: 1, t: 'supply-chain.mold_acceptance', label: 'supply-chain.mold_acceptance' }, // 模具验收
        2: {
            value: 2,
            t: 'supply-chain.inspection_fixture_acceptance',
            label: 'supply-chain.inspection_fixture_acceptance',
        }, // 检具验收
        3: { value: 3, t: 'supply-chain.tooling_acceptance', label: 'supply-chain.tooling_acceptance' }, //工装验收
        4: { value: 4, t: 'supply-chain.product_identification', label: 'supply-chain.product_identification' }, //产品鉴定
    },

    // 帐期要求
    ACCOUNt_PERIOD_REQUIREMENT: {
        90: { value: 90, unit: 'supply-chain.day' },
        75: { value: 75, unit: 'supply-chain.day' },
        60: { value: 60, unit: 'supply-chain.day' },
        30: { value: 30, unit: 'supply-chain.day' },
        0: { value: 0, t: 'supply-chain.other' },
    }, // 帐期要求
    ACCOUNt_PERIOD_REQUIREMENT_LIST: [
        { value: 90, unit: 'supply-chain.day' },
        { value: 75, unit: 'supply-chain.day' },
        { value: 60, unit: 'supply-chain.day' },
        { value: 30, unit: 'supply-chain.day' },
        { value: 0, t: 'supply-chain.other' },
    ],
    // 发票类型
    INVOICE_TYPE: {
        1: { value: 1, t: 'supply-chain.vat_invoice' }, // 增值税发票
        2: { value: 2, t: 'supply-chain.general_invoice' }, // 普通发票
        3: { value: 3, t: 'supply-chain.other' }, // 其他
    },
    // 营业期限
    BUSINESS_TERM: {
        1: { value: 1, t: 'supply-chain.long_term_validity' }, // 长期有效
        2: { value: 2, t: 'supply-chain.short_term_validity' }, // 短期有效
    },
    BUSINESS_TERM_MAP: {
        long_term_validity: 1,
        short_term_validity: 2,
    },
    // 法律纠纷
    Legal_Dispute: {
        '-1': { value: -1, t: 'supply-chain.None' },
        1: { value: 1, t: 'supply-chain.Yes' },
    },
    // 民营、外资、国有 - 公司性质
    NATURE: {
        1: { value: 1, t: 'supply-chain.private' },
        2: { value: 2, t: 'supply-chain.foreign_owned' },
        3: { value: 3, t: 'supply-chain.state_owned' },
    },
    // 变化类列表 0.全部；1.新增；2.更名
    CHANGE_CLASS_LIST: [
        { value: 0, t: 'common.all' },
        { value: 1, t: 'supply-chain.new_addition' },
        { value: 2, t: 'supply-chain.rename' },
    ],
};

export default SUPPLAY;

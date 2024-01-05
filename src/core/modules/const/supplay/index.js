const SUPPLAY = {
    SUPPLAY_TYPE: {
        '1': { value: 1, zh:'零件类', en: 'Part Class', t: 'supply-chain.part' },
        '2': { value: 2, zh:'代理类', en: 'Broker Class', t: 'supply-chain.broker' },
        '3': { value: 3, zh:'外协类', en: 'Outsourcing Class', t: 'supply-chain.outsourcing' },
        '4': { value: 4, zh:'模具类', en: 'Mold Class', t: 'supply-chain.mold' },
        '5': { value: 5, zh:'客指类', en: 'CustomerRefers Class', t: 'supply-chain.customer_refers' },
    },
    SUPPLAY_TYPE_MAP: {        
        Part: 1,
        Broker: 2,
        Outsourcing: 3,
        Mold: 4,
        CustomerRefers: 5,
    },
    SUPPLAY_TYPE_LIST: [
        { value: 1, zh:'零件类', en: 'Part Class', t: 'supply-chain.part' },
        { value: 2, zh:'代理类', en: 'Broker Class', t: 'supply-chain.broker' },
        { value: 3, zh:'外协类', en: 'Outsourcing Class', t: 'supply-chain.outsourcing' },
        { value: 4, zh:'模具类', en: 'Mold Class', t: 'supply-chain.mold' },
        { value: 5, zh:'客指类', en: 'CustomerRefers Class', t: 'supply-chain.customer_refers' },
    ],
    SUPPLAY_TYPE_MAP: {        
        part: 1,
        broker: 2,
        outsourcing: 3,
        mold: 4,
        customer_refers: 5,
    },
    // 职位
    POSITION: {        
        1: { value: 1, t: 'supply-chain.sales', },
        2: { value: 2, t: 'supply-chain.quality', },
        3: { value: 3, t: 'supply-chain.technology', },
        4: { value: 4, t: 'supply-chain.general_manager', },
    },
    POSITION_LIST: [
        { value: 1, t: 'supply-chain.sales', },
        { value: 2, t: 'supply-chain.quality', },
        { value: 3, t: 'supply-chain.technology', },
        { value: 4, t: 'supply-chain.general_manager', },
    ], 
    // 技术信息
    TECHNICAL_INFORMATION: [

        { value: 1, label: 'supply-chain.stand_alone_design' }, // 独立设计
        { value: 2, label: 'supply-chain.co_design' }, // 共同设计
        { value: 3, label: 'supply-chain.translational_design' }, //转化设计
        { value: 4, label: 'supply-chain.outsourced_design' }, //委外设计
    ],
    TECHNICAL_INFORMATION_OBJECT: {
        1: { value: 1, t: 'supply-chain.stand_alone_design' }, // 独立设计
        2: { value: 2, t: 'supply-chain.co_design' }, // 共同设计
        3: { value: 3, t: 'supply-chain.translational_design' }, //转化设计
        4: { value: 4, t: 'supply-chain.outsourced_design' }, //委外设计
    },

    // 过程设计
    PROCESS_DESIGN: [

        { value: 5, label: 'supply-chain.mold_design' }, // 模具设计
        { value: 6, label: 'supply-chain.fixture_design' }, // 检具设计
        { value: 7, label: 'supply-chain.tooling_design' }, //辅具设计
        { value: 8, label: 'supply-chain.assistive_device_design' }, //工装设计
    ],
    PROCESS_DESIGN_OBJECT: {
        5: { value: 5, t: 'supply-chain.mold_design' }, // 模具设计
        6: { value: 6, t: 'supply-chain.fixture_design' }, // 检具设计
        7: { value: 7, t: 'supply-chain.tooling_design' }, //辅具设计
        8: { value: 8, t: 'supply-chain.assistive_device_design' }, //工装设计
    },

    // 过程验证
    PROCESS_VALIDATION: [

        { value: 1, label: 'supply-chain.mold_acceptance' }, // 模具验收
        { value: 2, label: 'supply-chain.inspection_fixture_acceptance' }, // 检具验收
        { value: 3, label: 'supply-chain.tooling_acceptance' }, //工装验收
        { value: 4, label: 'supply-chain.product_identification' }, //产品鉴定
    ],
    PROCESS_VALIDATION_OBJECT: {
        1: { value: 1, t: 'supply-chain.mold_acceptance' }, // 模具验收
        2: { value: 2, t: 'supply-chain.inspection_fixture_acceptance' }, // 检具验收
        3: { value: 3, t: 'supply-chain.tooling_acceptance' }, //工装验收
        4: { value: 4, t: 'supply-chain.product_identification' }, //产品鉴定
    },

    // 帐期要求
    ACCOUNt_PERIOD_REQUIREMENT: {
        90: { value: 90, unit: "supply-chain.day", },
        75: { value: 75, unit: "supply-chain.day", },
        60: { value: 60, unit: "supply-chain.day", },
        30: { value: 30, unit: "supply-chain.day", },
        0: { value: 0, t: "supply-chain.other" },
    },
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
        '-1': { value: 1, t: 'supply-chain.None' },
        "1": { value: 1, t: 'supply-chain.Yes' },
    }

}

export default SUPPLAY


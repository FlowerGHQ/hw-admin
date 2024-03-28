const WAREHOUSING_MANAGEMENT = {
    STATUS: {
        1: { value: 1, t: 'warehousing-management.product_opening_status' }, // 开立状态
        60: { value: 60, t: 'warehousing-management.product_review_status' }, // 审核状态
        '-30': { value: -30, t: 'warehousing-management.product_closed_status' }, // 关闭状态
    },
};

export default WAREHOUSING_MANAGEMENT;

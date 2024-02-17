const CRM_CUSTOMER_CENTER = {
    INTENTION_MAP: {
        10: { key: '无意向', color: '#86909C', borderColor: '#E5E6EB' },
        20: { key: '有意向', color: '#F7BA1E', borderColor: '#F7BA1E4D' },
        30: { key: '高意向', color: '#F77234', borderColor: '#F772344D' },
        40: { key: 'Hot', color: '#F53F3F', borderColor: '#F53F3F4D' },
    },
    Order_Status: {
        0: { key: 0, value: 'retail.not_order', color: '#86909C', bgColor: '#E5E6EB', borderColor: '#E5E6EB' }, // 未下单
        1: {
            key: 1,
            value: 'retail.intention_deposit_paid',
            color: '#F77234',
            bgColor: '#FFF3E8',
            borderColor: '#F772344D',
        }, // 已付意向金
        2: { key: 2, value: 'retail.paid_small_order', color: '#3491FA', bgColor: '#E8F7FF', borderColor: '#3491FA4D' }, // 已付小订
        3: { key: 3, value: 'retail.paid_large_order', color: '#0061FF', bgColor: '#E6EFFF', borderColor: '#0061FF4D' }, // 已付大订
        4: {
            key: 4,
            value: 'retail.final_payment_paid',
            color: '#00B42A',
            bgColor: '#E8FFEA',
            borderColor: '#00B42A4D',
        }, // 已付尾款
        5: { key: 5, value: 'retail.to_be_delivered', color: '', bgColor: '', borderColor: '' }, // 待交付
        6: { key: 6, value: 'retail.delivered', color: '', bgColor: '', borderColor: '' }, // 已交付
        7: { key: 7, value: 'retail.to_be_invoiced', color: '', bgColor: '', borderColor: '' }, // 待开票
        8: { key: 8, value: 'retail.completed', color: '', bgColor: '', borderColor: '' }, // 已完成
        9: { key: 9, value: 'retail.unsubscribing', color: '#D91AD9', bgColor: '#FFE8FB', borderColor: '#D91AD94D' }, // 退订中
        10: { key: 10, value: 'retail.unsubscribed', color: '#D91AD9', bgColor: '#FFE8FB', borderColor: '#D91AD94D' }, // 已退订
        11: { key: 11, value: 'retail.being_refunded', color: '#722ED1', bgColor: '#F5E8FF', borderColor: '#722ED14D' }, // 退款中
        12: { key: 12, value: 'retail.refunded', color: '#722ED1', bgColor: '#F5E8FF', borderColor: '#722ED14D' }, // 已退款
    },
    // 搜索条件的订单状态
    ORDER_STATUS_SEARCH_MAP: {
        50: { key: '50', text: '未下单', bgColor: '#F2F3F5', border_color: '#E5E6EB', color: '#86909C' },
        100: { key: '100', text: '待支付', bbgColor: '', order_color: '#FFE4BA', color: '#FF7D00' },
        200: { key: '200', text: '已支付', bgColor: '', border_color: '#00B42A33', color: '#00B42A' },
        '-200': { key: '-200', text: '已取消', bgColor: '', border_color: '#E5E6EB', color: '#86909C' },
        '-300': { key: '-300', text: '已退款', bgColor: '', border_color: '#F7BA1E33', color: '#722ED1' },
        '-400': { key: '-400', text: '申请退款', bgColor: '', border_color: '#F5E8FF', color: '#722ED1' },
    },
    // 订单状态
    ORDER_STATUS_MAP: {
        0: { key: '0', text: '未下单', bgColor: '#F2F3F5', border_color: '#E5E6EB', color: '#86909C' },
        50: { key: '50', text: '未下单', bgColor: '#F2F3F5', border_color: '#E5E6EB', color: '#86909C' },
        100: { key: '100', text: '待支付', bbgColor: '', order_color: '#FFE4BA', color: '#FF7D00' },
        200: { key: '200', text: '已支付', bgColor: '', border_color: '#00B42A33', color: '#00B42A' },
        '-200': { key: '-200', text: '已取消', bgColor: '', border_color: '#E5E6EB', color: '#86909C' },
        '-300': { key: '-300', text: '已退款', bgColor: '', border_color: '#F7BA1E33', color: '#722ED1' },
        '-400': { key: '-400', text: '申请退款', bgColor: '', border_color: '#F5E8FF', color: '#722ED1' },
    },
    ORDER_STATUS_TEXT_MAPS: {
        Do_not_place_an_order: 0,
        Do_not_place_an_order50: 50,
        To_be_paid: 100,
        Have_paid: 200,
        Cancelled: -200,
        Refunded: -300,
        Apply_for_refund: -400,
    },
    // 来源（1.预定小程序 2.后台注册 3.Shopify 4.官网2.0 5.官网1.0 30.落地页1 31.落地页2 101-投票分享）
    SOURCE_TYPE: [
        { title: '全部', value: 0, key: 0 },
        { title: '预定小程序', value: 1, key: 1 },
        { title: '后台注册', value: 2, key: 2 },
        { title: 'Shopify', value: 3, key: 3 },
        { title: '官网2.0', value: 4, key: 4 },
        { title: '官网1.0', value: 5, key: 5 },
        { title: '落地页1', value: 30, key: 30 },
        { title: '落地页2', value: 31, key: 31 },
        { title: '投票分享', value: 101, key: 101 },
        { title: '体验官二维码', value: 32, key: 32 },
        { title: '门店二维码', value: 33, key: 33 },
        { title: '人工录入', value: 34, key: 34 },
    ],
    // 来源
    SOURCE_TYPE_MAP: {
        1: { key: '预定小程序', value: 1 },
        2: { key: '后台注册', value: 2 },
        3: { key: 'Shopify', value: 3 },
        4: { key: '官网2.0', value: 4 },
        5: { key: '官网1.0', value: 5 },
        30: { key: '落地页1', value: 30 },
        31: { key: '落地页2', value: 31 },
        101: { key: '投票分享', value: 101 },
        32: { key: '体验官二维码', value: 32 },
        33: { key: '门店二维码', value: 33 },
        34: { key: '人工录入', value: 34 },
    },
    // 判断接口事线索list还是用户list
    CHOOSE_TYPE: {
        CLUE: 1,
        USER: 2,
    },
    // 查询类型 0-全部(默认) 1-信息缺失 2-未绑定(未分配) 3-未跟进 4-已跟进 5-休眠 6-未下订 7-已下订 8-已成交 9-已交付
    SEARCH_TYPE: {
        All: 0,
        Information_loss: 1,
        Not_Yet_Bound: 2,
        Do_Not_Follow_Up: 3,
        Have_Followed: 4,
        dormancy: 5,
        unbooked: 6,
        on_Order: 7,
        traded: 8,
        delivered: 9,
    },
    // (3正常标签、4 关注点 5 自定义-摩托车型号、6 城市)
    LABEL_TYPE: {
        Label: 3,
        Focus: 4,
        Custom_model: 5,
        City: 6,
    },
    defaultAvatar:
        'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/57e4ee29250de0dc640a764068f55d697327d7b29ccd4bfe8c460dd838e20a75.png',
};

export default CRM_CUSTOMER_CENTER;

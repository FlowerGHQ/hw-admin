import Const from '../../core/const';
const Static = {
    INTENTION_MAP: {
        '10': { key: '无意向', color: '#86909C', borderColor: '#E5E6EB' },
        '20': { key: '有意向', color: '#F7BA1E', borderColor: '#F7BA1E4D' },
        '30': { key: '高意向', color: '#F77234', borderColor: '#F772344D' },
        '40': { key: 'Hot', color: '#F53F3F', borderColor: '#F53F3F4D' },
    },
    Order_Status: {
        '1': { key: 1, value: 'retail.not_order', color: '#86909C', bgColor: '#E5E6EB', borderColor: '#E5E6EB' },  // 未下单
        '1': { key: 1, value: 'retail.intention_deposit_paid', color: '#F77234', bgColor: '#FFF3E8', borderColor: '#F772344D' },// 已付意向金
        '2': { key: 2, value: 'retail.paid_small_order', color: '#3491FA', bgColor: '#E8F7FF', borderColor: '#3491FA4D' },      // 已付小订
        '3': { key: 3, value: 'retail.paid_large_order', color: '#0061FF', bgColor: '#E6EFFF', borderColor: '#0061FF4D' },      // 已付大订
        '4': { key: 4, value: 'retail.final_payment_paid', color: '#00B42A', bgColor: '#E8FFEA', borderColor: '#00B42A4D' },    // 已付尾款
        '5': { key: 5, value: 'retail.to_be_delivered', color: '', bgColor: '', borderColor: '' },       // 待交付
        '6': { key: 6, value: 'retail.delivered', color: '', bgColor: '', borderColor: '' },             // 已交付
        '7': { key: 7, value: 'retail.to_be_invoiced', color: '', bgColor: '', borderColor: '' },        // 待开票
        '8': { key: 8, value: 'retail.completed', color: '', bgColor: '', borderColor: '' },             // 已完成
        '9': { key: 9, value: 'retail.unsubscribing', color: '#D91AD9', bgColor: '#FFE8FB', borderColor: '#D91AD94D' },         // 退订中
        '10': { key: 10, value: 'retail.unsubscribed', color: '#D91AD9', bgColor: '#FFE8FB', borderColor: '#D91AD94D' },        // 已退订
        '11': { key: 11, value: 'retail.being_refunded', color: '#722ED1', bgColor: '#F5E8FF', borderColor: '#722ED14D' },      // 退款中
        '12': { key: 12, value: 'retail.refunded', color: '#722ED1', bgColor: '#F5E8FF', borderColor: '#722ED14D' },            // 已退款
    },
    // 来源
	SOURCE_TYPE_MAP: {
		'1': { key: '预定小程序', value: 1, },
		'2': { key: '后台注册', value: 2, },
		'3': { key: 'Shopify', value: 3, },
		'4': { key: '官网2.0', value: 4, },
		'5': { key: '官网1.0', value: 5, },
		'6': { key: '落地页1', value: 6, },
		'7': { key: '落地页2', value: 7, }
	},
    defaultAvatar: 'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/57e4ee29250de0dc640a764068f55d697327d7b29ccd4bfe8c460dd838e20a75.png'
}
export default Static
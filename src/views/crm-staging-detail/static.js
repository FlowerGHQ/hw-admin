import Const from '../../core/const';
import SENMENTI0 from './images/SENMENTI-0.png';
import SENMENTIX from './images/SENMENTI-X.png';
const Static = {
    renderList: [
        {
            title: '行业',
            isShow: true,
            list: [
                {
                    name: '金融',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '电信',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '教育',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '高科技',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '政府',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '制造业',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '服务',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '能源',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '媒体',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '娱乐',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '资讯',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '非盈利事业',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '公共事业',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '其他',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
        {
            title: '摩托车',
            isShow: true,
            list: [
                {
                    name: '有摩托车',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '无摩托车',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
        {
            title: '摩托车型号',
            isShow: false,
            list: [
                {
                    name: '',
                    type: Const.INTENTION.TAG_TYPE.MODEL,
                    isClick: false,
                },
            ],
        },
        {
            title: '骑行经验',
            isShow: true,
            list: [
                {
                    name: '无骑行经验',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '两年',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '两年以上',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
        {
            title: '家里有几台车',
            isShow: true,
            list: [
                {
                    name: '1台车',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '多台车',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
        {
            title: '排量',
            isShow: true,
            list: [
                {
                    name: '300cc以下',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '300~600cc',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '600~800cc',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '800~1000cc',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '1000cc以上',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
        {
            title: '有汽车类型',
            isShow: true,
            list: [
                {
                    name: '新能源汽车',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '汽油车',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
        {
            title: '家充桩',
            isShow: true,
            list: [
                {
                    name: '有家充桩',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: '无家充桩',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
        {
            title: 'KOL/KOC',
            isShow: true,
            list: [
                {
                    name: 'KOL',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
                {
                    name: 'KOC',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
        {
            title: '寻求合作',
            isShow: true,
            list: [
                {
                    name: '寻求合作',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false,
                },
            ],
        },
    ],
    multipleChoiceList: [
        {
            name: '续航',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '服务',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '质量',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '外观',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '性能',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '舒适',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '安全',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '储物空间',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '智能',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '改装',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '销售政策',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '售后政策',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '价格',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '品牌顾虑',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '售后',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '保值率',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
        {
            name: '提车时间',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false,
        },
    ],
    followList: [
        {
            title: '沟通方式',
            list: [
                {
                    name: '电话沟通',
                    value: 20,
                    isClick: false,
                },
                {
                    name: '面谈',
                    value: 10,
                    isClick: false,
                },
                {
                    name: '未接通',
                    value: 30,
                    isClick: false,
                },
            ],
        },
        {
            title: '意向度',
            list: [
                {
                    name: 'Hot',
                    value: 40,
                    isClick: false,
                },
                {
                    name: '高意向',
                    value: 30,
                    isClick: false,
                },
                {
                    name: '有意向',
                    value: 20,
                    isClick: false,
                },
                {
                    name: '无意向',
                    value: 10,
                    isClick: false,
                },
            ],
        },
        {
            title: '跟进类型',
            list: [
                // {
                //     name: '信息缺失',
                //     value: 10,
                //     isClick: false,
                // },
                // {
                //     name: '预约试驾',
                //     value: 20,
                //     isClick: false
                // },
                {
                    name: '跟进',
                    value: 30,
                    isClick: false,
                },
            ],
        },
    ],
    // 车辆信息
    MODEL: {
        1: {
            modelId: 1,
            name: 'SENMENTI 0',
            src: SENMENTI0,
            version: '创世版',
            total_price: 12680000,
            old_price: 13980000,
            pay_money: 50000,
            accelerate: '2.8s 百公里加速',
            mileage: '300km 续航里程（200km/h)',
            fastCharging: '30min 超级快充',
            color: '号外橙',
        },
        2: {
            modelId: 2,
            name: 'SENMENTI X',
            src: SENMENTIX,
            version: '',
            total_price: '',
            old_price: '',
            pay_money: 50000,
            accelerate: '<4s 百公里加速',
            mileage: '>400km 续航里程（200km/h)',
            fastCharging: '40min 超级快充',
            color: '号外紫',
        },
    },
    // 订单状态
    ORDER_STATUS_MAP: {
        0: { key: '', text: '未下单', border_color: '#FFE4BA', color: '#FF7D00' },
        100: { key: '100', text: '待支付', border_color: '#FFE4BA', color: '#FF7D00' },
        200: { key: '200', text: '已支付', border_color: '#00B42A33', color: '#00B42A' },
        '-200': { key: '-200', text: '已取消', border_color: '#E5E6EB', color: '#86909C' },
        '-300': { key: '-300', text: '已退订', border_color: '#F7BA1E33', color: '#F7BA1E' },
        '-300': { key: '-300', text: '已退款', border_color: '#F7BA1E33', color: '#F7BA1E' },
        '-400': { key: '-400', text: '申请退款', border_color: '#F7BA1E33', color: '#F7BA1E' },
    },
    // 来源
    SOURCE_TYPE: [
        { title: '全部', value: 0, key: 0 },
        { title: '预定小程序', value: 1, key: 1 },
        { title: '人工创建', value: 2, key: 2 },
        { title: '官网', value: 3, key: 3 },
        { title: '体验官二维码', value: 4, key: 4 },
        { title: '门店二维码', value: 5, key: 5 },
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
        32: { key: '体验官二维码', value: 32 },
        33: { key: '门店二维码', value: 33 },
        34: { key: '人工创建', value: 34 },
    },
    // 标签
    TAG_TYPE_MAP: {
        3: { key: '标签', value: 3, color: '#3381FF' /*字体颜色*/, bgColor: '#E6EFFF' /*背景颜色*/ },
        4: { key: '关注点', value: 4, color: '#00B42A' /*字体颜色*/, bgColor: '#E1F7E3' /*背景颜色*/ },
        5: { key: '摩托车型号', value: 5, color: '#3381FF' /*字体颜色*/, bgColor: '#E6EFFF' /*背景颜色*/ },
        6: { key: '用车城市', value: 6, color: '#3381FF' /*字体颜色*/, bgColor: '#E6EFFF' /*背景颜色*/ },
    },
    STATUS_MAP: {
        10: { key: '待试驾', value: 10, color: '#FF7D00', borderColor: '#FFE4BA' },
        15: { key: '待试驾', value: 15, color: '#FF7D00', borderColor: '#FFE4BA' },
        20: { key: '试驾中', value: 20, color: '#00B42A', borderColor: '#AFF0B5' },
        30: { key: '已试驾', value: 30, color: '#3381FF', borderColor: '#CCDFFF' },
        40: { key: '未出席', value: 40, color: '#F53F3F', borderColor: '#F53F3F4D' },
        50: { key: '已取消', value: 50, color: '#86909C', borderColor: '#E5E6EB' },
    },
    hitBottomHeight: 10,
    defaultAvatar:
        'http://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/57e4ee29250de0dc640a764068f55d697327d7b29ccd4bfe8c460dd838e20a75.png',
};
export default Static;

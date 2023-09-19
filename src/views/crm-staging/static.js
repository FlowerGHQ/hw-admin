import Const from '../../core/const';
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
            ]
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
            ]
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
            ]
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
                    isClick: false
                },
                {
                    name: '两年以上',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false
                },
            ]
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
                    isClick: false
                },
            ]
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
                    isClick: false
                },
                {
                    name: '600~800cc',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false
                },
                {
                    name: '800~1000cc',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false
                },
                {
                    name: '1000cc以上',
                    type: Const.INTENTION.TAG_TYPE.TAG,
                    isClick: false
                },
            ]
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
                    isClick: false
                },
            ]
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
                    isClick: false
                },
            ]
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
                    isClick: false
                },
            ]
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
            ]
        },
    ],
    multipleChoiceList: [
        {
            name: '续航',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '服务',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '质量',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '外观',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '性能',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '舒适',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '安全',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '储物空间',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '智能',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '改装',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '销售政策',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '售后政策',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '价格',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '品牌顾虑',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '售后',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '保值率',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
        },
        {
            name: '提车时间',
            type: Const.INTENTION.TAG_TYPE.FOCUS,
            isClick: false
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
            ]
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
            ]
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
                    isClick: false
                },
            ]
        },
    ]
}
export default Static
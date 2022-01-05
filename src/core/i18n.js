import { createI18n } from 'vue-i18n'

// 准备翻译的语言环境信息
/*
 * n：name
 * c：const const.js
 * def
 */
const messages = {
    ch: {
        n: {
            repair: '维修工单',
            repair_list: '维修工单',
            repair_detail: '维修详情',
            repair_create: '新增工单',

            agent: '经销商',
            distributor: '代理商',
            store: '门店',
            "故障编辑" : '故障编辑'
        },
        c: {
        },
        def: {
            search: '查询',
            reset: '重置',
            export: '导出',


            input: '请输入',
            select: '请选择',

            cancle: '取消',
            submit: '确定',

            create_time: '创建时间'
        }
    },
    en: {
        n: {
            repair: 'Repair Order',
            repair_list: 'Repair Order',
            repair_detail: 'Repair Order Detail',
            repair_create: 'Order Create',

            agent: 'Agent',
            distributor: 'Distributor',
            store: 'Store',

            "故障编辑" : 'dbascjhdb'
        },
        c: {
        },
        def: {
            search: 'Search',
            reset: 'Reset',
            export: 'Export',
            select: 'please select',

            cancle: 'Cancle',
            submit: 'Submit',

            create_time: 'CreateTime'
        }
    },
}


const i18n = createI18n({
    locale: 'ch', // 设置地区
    messages, // 设置地区信息
})

export default i18n
import { createI18n } from 'vue-i18n'

// 准备翻译的语言环境信息
/*
 * n：name
 * c：const const.js
 * def
 */
const messages = {
    zh: {
        n: {
            repair: '维修工单',
            repair_list: '维修工单列表',
            repair_detail: '维修详情',
            repair_create: '新增工单',
            agent: '零售商',
            distributor: '分销商',
            store: '门店',
            list_of_faults: '故障列表',
            new_fault: '新增故障',
            distributor_detail: '分销商详情'

        },
        c: {
        },
        def: {
            search: '查询',
            reset: '重置',
            export: '导出',
            input: '请输入',
            select: '请选择',
            cancel: '取消',
            submit: '确定',
            create_time: '创建时间',
            operate: '操作',
            edit: '编辑',
            disable: '禁用',
            enable: '启用',
        },
        search: {
            repair_sn: '工单编号',
            enter_repair_sn: '请输入工单编号',
            vehicle_no: '车架号',
            enter_vehicle_no: '请输入车架号',
            select_distributor: '请选择所属分销商',
            select_agent: '请选择所属零售商',
            select_d_first: '请先选择分销商',
            select_store: '请选择所属门店',
            select_a_first: '请先选择所属零售商',
        },
        table: {
            repair_sn: '工单编号',
            repair_name: '工单名称',
            emergency_level: '紧急程度',
            repair_status: '维修状态',
            repair_type: '工单帐类',
            repair_way: '维修方式',
            repair_category: '维修类别',
            repair_unit: '维修单位',
            repair_phone: '维修电话',
            creator_name: '创建人',
            associated_customers: '关联客户',
            name: '名称',
        },
        pop_up: {
            reason: '原因',
            enter_fault: '请输入故障名称',
        }
    },
    en: {
        n: {
            repair: 'Repair Order',
            repair_list: 'Repair Order List',
            repair_detail: 'Repair Order Detail',
            repair_create: 'Repair Order Create',
            agent: 'Agent',
            distributor: 'Distributor',
            store: 'Store',
            list_of_faults: 'List Of Faults',
            new_fault: 'New Fault',
            distributor_detail: 'Distributor Detail',
        },
        c: {
        },
        def: {
            search: 'Search',
            reset: 'Reset',
            export: 'Export',
            select: 'Please select',
            cancel: 'Cancel',
            submit: 'Submit',
            create_time: 'CreateTime',
            operate: 'Operate',
            edit: 'Edit',
            disable: 'Disable',
            enable: 'Enable'
        },
        search: {
            repair_sn: 'Inquire Sn',
            enter_repair_sn: 'Please enter the repair order number',
            vehicle_no: 'Vehicle No.',
            enter_vehicle_no: 'Please enter the vehicle number',
            select_distributor: 'Please select the Distributor',
            select_agent: 'Please select the Agent',
            select_d_first: 'Please select a distributor first',
            select_store: 'Please select the Store',
            select_a_first: 'Please select a Agent first'
        },
        table: {
            repair_sn: 'Repair Sn',
            repair_name: 'Repair name',
            repair_status: 'Repair order status',
            emergency_level: 'Emergency level',
            repair_type: 'Repair order classification',
            repair_way: 'Repair way',
            repair_category: 'Repair category',
            repair_unit: 'Repair unit',
            repair_phone: 'Unit phone',
            creator_name: 'Creator name',
            associated_customers: 'Associated customers',
            name: 'name',

        },
        pop_up: {
            reason: 'reason',
            enter_fault: 'Please enter a fault name',

        }
    },
}


const i18n = createI18n({
    locale: 'zh', // 设置地区
    messages, // 设置地区信息
})

export default i18n
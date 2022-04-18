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
            repair_edit: '编辑工单',
            agent: '零售商',
            distributor: '分销商',
            store: '门店',
            list_of_faults: '故障列表',
            new_fault: '新增故障',
            distributor_detail: '分销商详情',
        },
        r: {
            repair_sn: '工单编号',
            repair_name: '工单名称',
            repair_status: '维修状态',
            repair_way: '维修方式',
            repair_category: '维修类别',
            repair_unit: '维修单位',
            repair_phone: '维修电话',
            creator_name: '创建人',
            associated_customer: '相关客户',
            name: '名称',
            repair_content: '工单内容',
            repair_classify: '工单分类',
            category: '类别',
            urgency: '紧急程度',
            warranty: '工单帐类',
            enter_name: '请输入工单名称(最多输入50个字符)',
            description: '问题描述',
            fault_description: '请输入问题描述',
            vehicle_information: '车辆信息',
            miles_driven: '行驶里程',
            km: '公里',
            arrival_time: '到港时间',
            customer: '车主信息',
            associated_customers: '相关客户',
            select_customer: '请选择相关客户',
            add_customer: '新增客户',
            refresh: '刷新',
            customer_phone: '客户电话',
            enter_phone: '请输入客户电话',
            email: '客户邮箱',
            enter_email: '请输入客户邮箱',
            address: '客户地址',
            specific_address: '详细地址',
            enter_specific: '请输入详细地址',
            remark: '工单备注',
            enter_remark: '请输入工单备注',
            settle_accounts: '结算',
            serial_number: '工单编号',
            create_time: '创建时间',
            replacement_items: '零部件更换',
            fault_cause: '故障原因',
        },
        d: {
            contact: '联系人',
            phone: '手机号',
            email: '邮箱',
            country: '国家',
            sales_area: '销售区域',
            create_time: '创建时间',
            agent: '零售商数',
            store: '门店数',
            user: '员工数',
            revenue: '累计营收',
            orders: '累计订单数',
            manage_employees: '员工管理',
            order: '订单列表',
            address: '收货地址',
            manage_agent: '零售商管理',
            manage_store: '门店管理',
            manage_account: '账户管理',
        },
        c: {
            amount: '数量',
        },
        def: {
            search: '查询',
            reset: '重置',
            export: '导出',
            input: '请输入',
            select: '请选择',
            cancel: '取消',
            submit: '提交',
            ok: '确定',
            create_time: '创建时间',
            operate: '操作',
            edit: '编辑',
            re_edit: '重新编辑',
            disable: '禁用',
            enable: '启用',
            delete: '删除',
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
        pop_up: {
            reason: '原因',
            enter_fault: '请输入故障名称',
            sure: '确定要',
            disable: '禁用',
            enable: '启用',
            distributor: '该分销商吗？',
            success_disable: '禁用',
            success_enable: '启用',
            success: '成功',
            yes: '确定',
        }
    },
    en: {
        n: {
            repair: 'Repair Order',
            repair_list: 'Repair Order List',
            repair_detail: 'Repair Order Detail',
            repair_create: 'Repair Order Create',
            repair_edit: 'Repair Order Edit',
            agent: 'Agent',
            distributor: 'Distributor',
            store: 'Store',
            list_of_faults: 'List Of Faults',
            new_fault: 'New Fault',
            distributor_detail: 'Distributor Detail',
        },
        r: {
            repair_sn: 'Repair Sn',
            repair_name: 'Repair name',
            repair_status: 'Repair order status',
            repair_way: 'Repair way',
            repair_category: 'Category',
            repair_unit: 'Associated units',
            repair_phone: 'Unit phone',
            creator_name: 'Creator name',
            associated_customer: 'Customer',
            name: 'Name',
            repair_content: 'Repair Order Content',
            repair_classify: 'Classify',
            category: 'Category',
            urgency: 'Urgency',
            warranty: 'Warranty',
            enter_name: 'Please fill in the name of the repair order (up to 50 characters).',
            description: 'Description',
            fault_description: 'Please fill in the fault description.',
            vehicle_information: 'Vehicle Information',
            miles_driven: 'Miles driven',
            km: 'KM',
            arrival_time: 'Arrival time',
            customer: 'Car Owner Information',
            associated_customers: 'Customers',
            select_customer: 'Please select an associated customer.',
            add_customer: 'Add new customer',
            refresh: 'Refresh',
            customer_phone: 'Phone',
            enter_phone: 'Please enter the customer telephone number.',
            email: 'Email',
            enter_email: 'Please enter customer email address.',
            address: 'Address',
            enter_address: '',
            specific_address: 'Specific',
            enter_specific: 'Please enter the specific address.',
            remark: 'Remark',
            enter_remark: 'You can remark here.',
            settle_accounts: 'Close an account',
            serial_number: 'serial number',
            create_time: 'Create time',
            replacement_items: 'Replacement items',
            fault_cause: 'Fault cause',
        },
        d: {
            contact: 'Contact',
            phone: 'Phone',
            email: 'Email',
            country: 'Country',
            sales_area: 'Sales area',
            create_time: 'DC',
            agent: 'Number of agents',
            store: 'Number of stores',
            user: 'Number of staff',
            revenue: 'Gross revenue',
            orders: 'Cumulative number of orders',
            manage_employees: 'Employees',
            order: 'List of orders',
            address: 'Delivery addresses',
            manage_agent: 'Agents',
            manage_store: 'Stores',
            manage_account: 'Accounts',
        },
        c: {
            amount: '数量',
        },
        def: {
            search: 'Search',
            reset: 'Reset',
            export: 'Export',
            select: 'Please select',
            cancel: 'Cancel',
            submit: 'Submit',
            ok: 'OK',
            create_time: 'Creation Time',
            operate: 'Operate',
            edit: 'Edit',
            re_edit: 're-edit',
            disable: 'Disable',
            enable: 'Enable',
            delete: 'Delete'
        },
        search: {
            repair_sn: 'Inquire Sn',
            enter_repair_sn: 'Please enter the repair order number.',
            vehicle_no: 'Vehicle No.',
            enter_vehicle_no: 'Please enter the vehicle number.',
            select_distributor: 'Please select the Distributor.',
            select_agent: 'Please select the Agent.',
            select_d_first: 'Please select a distributor first.',
            select_store: 'Please select the Store.',
            select_a_first: 'Please select a Agent first.'
        },
        pop_up: {
            reason: 'reason',
            enter_fault: 'Please enter a fault name.',
            disable: 'disable ',
            sure: 'Do you want to ',
            enable: 'enable',
            distributor: 'this distributor?',
            success_disable: 'Disabled',
            success_enable: 'Enable',
            success: 'successfully!',
            yes: 'Yes',
        }
    },
}


const i18n = createI18n({
    locale: 'zh', // 设置地区
    messages, // 设置地区信息
})

export default i18n
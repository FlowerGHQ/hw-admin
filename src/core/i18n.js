import { createI18n } from 'vue-i18n'

// 准备翻译的语言环境信息
/*
 * n：通用
 * c：const const.js
 * def
 * a: 零售商
 * ac: 账户
 * ad: 收货地址
 * r: 工单
 * d: 分销商
 * i: 商品
 * v: 实例
 * e: 员工
 * p: 采购
 * s: 门店
 * ar: 销售区域
 */
const messages = {
    zh: {
        ac: { //账户
            account_list: '账户列表',
            new_account: '新建账户',
            type: '账户类型',
            balance: '余额',
            recharge: '充值',
            deduction: '扣费',
            source: '来源',
            repair: '维修单',
            purchase: '采购单',
            admin: '管理员操作',
            money: '金额',
            operation: '账户操作',
        },
        ad: {
            address: '收货地址列表',
            specific_address: '详细地址',
            shipping_address: '收货地址',
            add: '新增收货地址',
            addresses: '收货地址',
        },
        n: {
            name: '名称',
            state: '状态',
            type: '类型',
            contact: '联系人',
            phone: '手机号',
            email: '邮箱',
            continent: '大洲',
            country: '国家',
            enter: '请输入',
            area: '地区',
            choose: '请选择',
            time: '创建时间',
            information: '基本信息',
            information_a: '信息',
            supply_order: '供货订单',
            agent: '零售商',
            distributor: '分销商',
            store: '门店',
            order_time: '下单时间',
            size: '建议尺寸',
            all: '全部',
            pay: '待支付',
            delivery: '待发货',
            shipped: '已发货',
            transaction: '交易完成',
            transferred: '转单',
            institution: '创建单位',
            upload_attachment: '上传附件',
            attachment_list: '附件列表',
            uploader: '上传人',
            uploading_agency: '上传机构',
            upload_time: '上传时间',
            download: '下载',
            delivery_information: '收货信息',
            consignee: '收货人',
            source: '来源',
            source_number: '来源单号',
            audit: '审核',
            storage: '入库',
            result: '审核结果',
            pass: '通过',
            fail: '不通过',
            reason: '原因',
            warehouse: '仓库',
            fault: '故障件编号',
            export: '导出',
            password: '修改密码',
            old: '旧密码',
            new: '新密码',
            double: '再次确认',
            exit: '退出',
            username: '请输入用户名',
            enter_password: '请输入密码',
            system: '浩万后台管理系统',
            login: '登  录',
            account_login: '账号登录',
            display: '数据展示',
            operator: '操作人',
            operation: '操作类型',
            all_total: '共',
        },
        a: {
            new_retailer: '新建零售商',
            list_of_retailers: '零售商列表',
            superior: '所属分销商',
            edit: '编辑零售商',
            detail: '零售商详情',

        },
        ar: { //销售区域
            list: '销售区域列表',
            save: '新建销售区域',
            edit: '编辑销售区域',
            detail: '销售区域详情',
        },
        r: {
            sn: '维修单编号',
            unit: '所属单位',
            item: '更换商品',
            list_of_faults: '故障列表',
            new_fault: '新增故障',
            repair: '维修工单',
            repair_list: '维修工单列表',
            repair_detail: '维修详情',
            repair_create: '新增工单',
            repair_edit: '编辑工单',
            work_order: '待审工单',
            fault_list: '待审核故障件',
            fault_invoice: '待入库故障件',
            pending_work_order: '待改工单',
            repair_sn: '工单编号',
            repair_name: '工单名称',
            repair_status: '工单状态',
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
            distributor_detail: '分销商详情',
            name: '分销商名称',
            distribution_management: '分销管理',
            distributor_list: '分销商列表',
            new_distributor: '新建分销商',
            distributor_name: '分销商名称',
            short_name: '简称',
            abbreviation: '简称',
            port: '港口',
            receipt: '请输入收货港口',
            internal: '国内',
            export: '出口',
            company: '公司名称',
            company_name: '请输入公司名称',
            id: '税号',
            sales_area: '销售区域',
            create_time: '创建时间',
            edit: '编辑分销商',
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
            item: '商品价格',
        },
        e: {
            employee_list: '员工列表',
            new_employee: '新增员工',
            name: '姓名',
            account: '账号',
            administrator: '管理员',
            login_time: '上次登录时间',
        },
        i: {
            commodity_management: '商品管理',
            categories: '商品分类',
            product_information: '商品信息',
            detail: '商品详情',
            add_category: '新增分类',
            item: '商品',
            number: '商品品号',
            code: '商品编码',
            spec: '规格',
            instance: '商品实例号',
            amount: '数量',
            quantity: '数量',
            unit_price: '单价',
            total_price: '总价',
            total_quantity: '总数量',
            item_list: '商品列表',
            add: '添加商品',
            status: '商品状态',
            active: '已上架',
            inactive: '已下架',
            active_a: '上架',
            inactive_a: '下架',
            import: '批量导入',
            new: '新增商品',
            cost_price: '成本价格',
            hours: '工时',
            edit: '编辑商品',
            save: '新增商品',
            image: '图片信息',
            cover: '商品封面',
            picture: '详情图',
            configuration: '分类配置',
            information: '规格信息',
            mode: '规格模式',
            single: '单规格',
            multiple: '多规格',
            define: '规格定义',
            name: '规格名',
            words: '关键字',
            value: '规格值',
            keyword: '关键字：用于区分规格,应由小写英文字母组成且不可重复',
            definition: '添加定义',
            addition: '添加',
            message: '信息',
            settings: '批量设置',
            add_specs: '添加规格',
            price_information: '价格信息',
            diagram: '爆炸图',
            view: '爆炸图',
            save_view: '新增爆炸图',
            edit_view: '编辑爆炸图',
            custom: '自定义详情',
            default_a: '在商品展示时为默认商品',
            default: '默认',
            after: '商品下架后，向分销商分配的商品价格将作废；若商品需重新上架，需要重新向分销商分配商品并设置价格。',
            edit_name: '编辑名称',
            product_configuration: '商品配置',
            subcategory: '新增子分类',
            edit_a: '编辑分类',
            code_a: '商品编码不能重复',
            spec_a: '请不要设置规格完全一致的商品',
            edit_b: '编辑商品配置',
            configuration_item: '配置项',
            key: '键值',
            english: '请输入英文',
            required: '必填',
            yes: '是',
            no: '否',
            input_box: '输入框',
            text_area: '文本域',
            rich_text: '富文本',
            selection_box: '选择框',
            radio_button: '单选框',
            options: '内容选项',
            add_options: '添加选项',
            add_configuration: '添加配置项',
            point_location: '点位详情',
            clear: '清空点位',
            save_a: '新增点位',
            point: ' 此图点位已经修改变更，是否保存 ?',
            cart: '添加到购物车',
            added: '已加入购物车',
            look: '查看购物车',
            shopping: '购物车',
            favorites: '查看收藏夹',
            color: '颜色',
            favorited: '已收藏',
            move: '移至收藏夹',
            favorite: '收藏夹',
            add_to_favorites: '收藏商品',
            settle: '结算',
            already: '已在购物车中',
            summary: '摘要',
            items: '您的购物车中暂无商品',
            shipping_options: '配送选项',
            new_address: '添加新地址',
            shipping_settings: '配送设置',
        },
        w: {
            list: '账户列表',
            type: '账户类型',
            balance: '余额',
            detail: '账户详情',
            account: '账户',
            record: '余额变动记录',
            money: '变动金额',
            change: '变动后余额',
        },
        v: {
            instance_management: '实例管理',
            vehicle: '整车',
            parts: '零部件',
            list: '列表',
            save: '新增',
        },
        wa: { //仓库
            list: '仓库列表',
            address: '仓库地址',
            add: '新建仓库',
            edit: '编辑仓库',
            good: '成品仓',
            warehouse: '仓库',
            imperfect: '残次仓',
            detail: '仓库详情',
            stock: '库存产品',
            faulty_part: '故障件列表',
            goods: '库存产品',
            records: '出入库记录',
            quantity: '库存数量',
            object: '变更对象',
            amount: '变更后库存数量',
            type: '仓库类型',
        },
        in: {
            list: '出入库单列表',
            save: '新建出入库单',
            edit: '编辑出入库单',
            sn: '出入库单编号',
            admin: '仓库审核',
            category: '类目',
            related: '所属仓库',
            order_number: '订单号',
            order: '请输入正确的订单号',
            order_a: '请输入相关的订单号',
            detail: '单详情',
            inbound: '入库',
            outbound: '出库',
            number: '单编号',
            reviewer: '审核人',
            time: '审核时间',
            order_quantity: '下单数量',
            selected: '已选中',
            total: '条',
            item: ' 件',
            change: '更改数量',
            changes: '确认更改',
            add: '确认添加',
            copy: '复制',
            warn: '该商品实例号未在系统中录入！',
            no: '不存在',
            warn_a: '该商品不存在',
        },
        sa: { //售后
            list: '售后单列表',
        },
        p: {
            list: '采购订单列表',
            purchase_order: '采购订单',
            order_number: '订单编号',
            price: '订单总价',
            order_time: '下单时间',
            payment_status: '支付状态',
            payment_time: '支付时间',
            complete_time: '完成时间',
            number: '订单编号',
            total_price: '总价',
            freight: '运费',
            order_status: '订单状态',
            amount_paid: '已支付金额',
            buy_again: '再次购买',
            details: '采购订单详情',
            total: '合计',
            order_information: '订单信息',
            person: '下单人',
            payment_terms: '支付条款',
            remark: '备注信息',
            partial_shipments: '分批发货',
            transshipment: '转运',
            allow: '同意',
            disagree: '不同意',
            shipping_port: '发货港口',
            delivery_method: '发货方式',
            shipment_number: '发货单号',
            confirm_payment: '确认收款',
            confirm_transfer: '确认转单',
            ship: '发货',
            shipping_confirmation: '确认发货',
            sn_number: '单号',
            confirm_order: '下单',
            cart: '在您的购物车中',
            preview: '收货预览',
            code: '编码',
            unit_price: '单价',
        },
        s: {
            store_list: '门店列表',
            new_store: '新建门店',
            superior: '所属零售商',
            detail: '门店详情',
            edit: '门店编辑',
        },
        u: { //员工
            list: '员工列表',
            save: '新增员工',
            edit: '编辑员工',
            reset: '重置密码',
            account: '账号',
            role: '员工角色',
            login: '上次登录时间',
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
            sure: '确定',
            create_time: '创建时间',
            operate: '操作',
            detail: '详情',
            edit: '编辑',
            re_edit: '重新编辑',
            disable: '禁用',
            enable: '启用',
            enable_ing: '启用中',
            disable_ing: '禁用中',
            delete: '删除',
            enter: '请完善表单信息',
            remove: '移除',

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
            open: '开启',
            close: '关闭',
            information: '信息个性化?',
            delete: '删除',
            delete_success: '删除成功',
            save_success: '保存成功',
            cancel: '取消吗？',
            canceled: '取消成功',
            no: '取消',
            remove_a: '移除成功',
            define: '确定要将商品',
            item: '确定要将该商品移出购物车吗？',
            move: '移出成功',
            item_favorites: '确定要将该商品移出收藏夹吗',
            add: '添加成功',
            operate: '操作成功',
            move_favorites: '确定要将该商品移动至收藏夹吗',
            sure_delete: '确定要删除吗？'
        }
    },
    en: {
        ac: { //账户
            account_list: 'Account List',
            new_account: 'New account',
            type: 'Account type',
            balance: 'Balance',
            recharge: 'Recharge',
            deduction: 'Deduction',
            source: 'Source of deduction',
            repair: 'Repair order',
            purchase: 'Purchase order',
            admin: 'Admin action',
            money: 'Money',
            operation: 'Account operation',
        },
        ad: {
            address: 'Address list',
            specific_address: 'Specific address',
            shipping_address: 'Shipping address',
            add: 'Add new address',
            addresses: 'Address',
        },
        n: {
            name: 'Name',
            state: 'State',
            type: 'Type',
            contact: 'Contact',
            phone: 'Phone',
            email: 'Email',
            country: 'Nation',
            enter: 'Please enter distributor name',
            area: 'Area',
            choose: 'Please choose continent and nation',
            information: 'Basic Information',
            time: 'Time',
            information_a: 'Information',
            continent: 'Continent',
            supply_order: 'supply order',
            agent: 'Retailer',
            distributor: 'Distributor',
            store: 'Store',
            order_time:'Order time',
            size: 'Recommended size',
            all: 'All',
            pay: 'Waiting to pay',
            delivery: 'Wait for delivery',
            shipped: 'Shipped',
            transaction: 'Transaction completed',
            transferred: 'Order transferred',
            institution: 'Institution created',
            upload_attachment: 'Upload attachment',
            attachment_list: 'Attachment list',
            uploader: 'Uploader',
            uploading_agency: 'Uploading agency',
            upload_time: 'Upload time',
            download: 'Download',
            delivery_information: 'Delivery information',
            consignee: 'Consignee',
            source: 'Source',
            source_number: 'Source number',
            audit: 'Review',
            storage: 'Storage',
            result: 'Review result',
            pass: 'Pass',
            fail: 'Fail',
            reason: 'Reason',
            warehouse: 'Warehouse',
            fault: 'Trouble part number',
            export: 'export',
            password: 'Password',
            old: 'Old password',
            new: 'New password',
            double: 'Double confirm',
            exit: 'Exit',
            username: 'Please enter username',
            enter_password: 'Please enter password',
            system: 'Horwin Backstage Management System',
            login: 'LOGIN',
            account_login: 'Account login',
            display: 'Data Display',
            operator: 'Operator',
            operation: 'Type of operation',
            all_total: 'All',
        },
        a: {
            new_retailer: 'Add a retailer',
            list_of_retailers: 'List of retailers',
            superior: 'Superior',
            edit: 'Edit retailer',
            detail: 'Retailer details',
        },
        ar: { //销售区域
            list: 'Sales area list',
            save: 'Add sales area',
            edit: 'Edit sales area',
            detail: 'Sales area details',
        },
        r: {
            sn: 'Repair order number',
            unit: 'Associated Unit',
            item: 'Replaced product',
            list_of_faults: 'List Of Faults',
            new_fault: 'New Fault',
            repair: 'Repair Order',
            repair_list: 'Repair Order List',
            repair_detail: 'Repair Order Detail',
            repair_create: 'Repair Order Create',
            repair_edit: 'Repair Order Edit',
            work_order: 'pending work order',
            fault_list: 'Troubleshooting pending',
            fault_invoice: 'Faulty parts to be put into storage',
            pending_work_order: 'pending work order',
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
            distributor_detail: 'Distributor details',
            name: 'Name',
            distribution_management: 'Distribution management',
            distributor_list: 'Distributor List',
            distributor_name: 'Distributor name',
            new_distributor: 'New distributor',
            short_name: 'Short name',
            abbreviation: 'Abbreviation',
            port: 'Port',
            receipt: 'Please enter the port of receipt',
            internal: 'internal',
            export: 'export',
            company: 'Company',
            company_name: 'Please enter company name',
            id: 'Tax ID',
            sales_area: 'Sales area',
            create_time: 'Creation time',
            edit: 'Edit distribution',
            agent: 'Number of retailers ',
            store: 'Number of stores',
            user: 'Employee count',
            revenue: 'Cumulative revenue',
            orders: 'Cumulative number of orders',
            manage_employees: 'Employees',
            order: 'Orders',
            address: 'Shipping addresses',
            manage_agent: 'Retailers',
            manage_store: 'Stores',
            manage_account: 'Accounts',
            item: 'Commodity price ',
        },
        e: {
            employee_list: 'Employee list',
            new_employee: 'New employee',
            name: 'Name',
            account: 'Account',
            administrator: 'Administrator',
            login_time: 'Last login time',
        },
        i: {
            commodity_management: 'commodity management',
            categories: 'Categories',
            product_information: 'Product information',
            detail: 'Product details',
            add_category: 'Add category',
            item: 'Product',
            number: 'Product No.',
            code: 'Product code',
            spec: 'Spec',
            instance: 'instance number',
            amount: ' amount',
            quantity: 'Quantity',
            unit_price: 'Unit price',
            total_price: 'Total price',
            total_quantity: 'Total quantity',
            item_list: 'Product list',
            add: 'Add product',
            status: 'Product status',
            active: 'Active',
            inactive: 'Inactive',
            active_a: 'Active',
            inactive_a: 'Inactive',
            import: 'Batch Import',
            new: 'New product',
            cost_price: 'Cost price',
            hours: 'Hours',
            edit: 'Edit product',
            save: 'Add product',
            image: 'Image information',
            cover: 'Cover',
            picture: 'Picture',
            configuration: 'Category information',
            information: 'Spec information',
            mode: 'Spec mode',
            single: 'Single spec',
            multiple: 'Multiple spec',
            define: 'Define',
            name: 'Name',
            words: 'Words',
            value: 'Spec',
            keyword: 'Words: Used to distinguish specifications. It must contain lowercase letters and cannot be repeated',
            definition: 'Add definition',
            addition: 'Add',
            message: 'Information',
            settings:'Batch settings',
            add_specs: 'Add specs',
            price_information: 'Price information',
            diagram: 'Diagram',
            view: 'Explosive view',
            save_view: 'Add exploded diagram',
            edit_view: 'Edit exploded diagram',
            custom:'Custom details',
            default_a: 'The default product when the product is displayed',
            default: 'Default',
            after: 'After the product is taken off the shelf, the price of the product assigned to the distributor will be invalid; if the product needs to be re-listed, it needs to be re-allocated to the distributor and set the price!',
            edit_name: 'Edit name',
            product_configuration: 'Product configuration',
            subcategory: 'Add subcategory',
            edit_a: 'Edit category ',
            code_a: 'Commodity code cannot be repeated!',
            spec_a: 'Please do not set products with the exact same specifications',
            edit_b: 'Edit product configuration',
            configuration_item: 'Configuration item',
            key: 'Key',
            english: 'Please enter English',
            required: 'Required',
            yes: 'Yes',
            no: 'No',
            input_box: 'Input box',
            text_area: 'Text area',
            rich_text: 'Rich text',
            selection_box: 'Selection box',
            radio_button: 'Radio button',
            options: 'Options',
            add_options: 'Add option',
            remove: 'Remove',
            add_configuration: 'Add configuration',
            point_location: 'Details of point location',
            clear: 'Clear',
            save_a: 'Add',
            point: ' This map point has been modified and changed, do you want to save it ?',
            cart: 'Add to cart',
            added: 'Already added to cart',
            shopping: 'Shopping cart',
            look: 'View shopping cart ',
            favorites: 'View favorites',
            move: 'Move to favorites',
            color: 'Color',
            favorited: 'Already favorited',
            favorite: 'Favorites',
            add_to_favorites: 'Add to Favorites',
            settle: 'Settle accounts',
            already: 'Already in cart',
            summary: 'Summary',
            items: 'There are currently no items in your cart !',
            shipping_options: 'Shipping options',
            new_address: 'Add new address',
            shipping_settings: 'Shipping settings',
        },
        w: {
            list: 'Account List',
            type: 'Account type',
            balance: 'Balance',
            detail: 'Account details',
            account: 'Account',
            record: 'Record of balance changes',
            money: 'Amount change',
            change: 'Balance after changed'
        },
        v: {
            instance_management: 'instance management',
            vehicle: 'Vehicle',
            parts: 'Parts',
            list: ' list',
            save: 'Add ',
        },
        wa: { //仓库
            list: 'Warehouse list',
            address: 'Address',
            add: 'New warehouse',
            edit: 'Edit warehouse',
            good: 'Good',
            warehouse: 'Warehouse',
            imperfect: 'Imperfect',
            detail: 'Warehouse details',
            stock: 'Stock product',
            faulty_part: 'Faulty part list',
            goods: 'Goods in stock',
            records: 'Inbound and outbound records',
            quantity: 'Stock quantity',
            object: 'Object of change',
            amount: 'Inventory after changed',
            type: 'Type of warehouse',
        },
        in: {
            list: 'Inbound and outbound order list',
            save: 'Add new form',
            edit: 'Edit the form',
            sn: 'Number',
            admin: 'Review',
            category: 'Category',
            related: 'Related warehouse',
            order_number: 'Order No.',
            order: 'Please enter the correct order number !',
            order_a: 'Please enter the order number associated with it !',
            detail: ' details',
            inbound: 'Inbound',
            outbound: 'Outbound',
            number: ' number',
            reviewer: 'Reviewer',
            time: 'Review time',
            order_quantity: 'Order quantity',
            selected: 'Selected',
            total: 'total',
            item: ' item',
            change: 'Change quantity',
            changes: 'Confirm changes',
            add: 'Confirm to add',
            copy: 'Copy',
            warn: 'The instance number of this product has not been entered in the system !',
            no: 'nonexistent',
            warn_a: 'The product does not exist !',
        },
        sa: { //售后
            list: '售后单列表',
        },
        p: {
            list: 'Purchase Order List',
            purchase_order: 'Purchase orders',
            order_number: 'Order number',
            price: 'Total order price',
            order_time: 'Order time',
            payment_status: 'Payment status',
            payment_time: 'Payment time',
            complete_time: 'Complete time',
            number: 'Order number',
            total_price: 'Total price',
            freight: 'Freight',
            order_status: 'Order status',
            amount_paid: 'Amount paid',
            buy_again: 'Buy again',
            details: 'Purchase order details',
            total: 'Total',
            order_information: 'Order information',
            person: 'Order person',
            payment_terms: 'Payment Terms',
            remark: 'Remark',
            partial_shipments: 'Partial shipments',
            transshipment: 'Transshipment',
            allow: 'Allow',
            disagree: 'Disagree',
            shipping_port: 'Shipping port',
            delivery_method: 'Delivery method',
            shipment_number: 'Shipment number',
            confirm_payment: 'Payment confirmation',
            confirm_transfer: 'Transfer confirmation',
            ship: 'Ship',
            shipping_confirmation: 'Shipping confirmation',
            sn_number: 'Number',
            confirm_order: 'Confirm order',
            cart: 'In your shopping cart',
            preview: 'Delivery preview',
            code: 'code',
            unit_price: 'unit price',
        },
        s: {
            store_list: 'Store list',
            new_store: 'New store',
            superior: 'Superior',
            detail: 'Store details',
            edit: 'Edit store',
        },
        u: { //员工
            list: 'Employee list',
            save: 'Add new employee',
            edit: 'Edit employee',
            reset: 'Reset password',
            account: 'Account',
            role: 'Role',
            login: 'Last login time',
        },
        def: {
            search: 'Search',
            reset: 'Reset',
            export: 'Export',
            select: 'Please select',
            cancel: 'Cancel',
            input: 'Please enter',
            submit: 'Submit',
            ok: 'OK',
            sure: 'Sure',
            create_time: 'Creation Time',
            operate: 'Operate',
            edit: 'Edit',
            detail: 'Details',
            re_edit: 're-edit',
            disable: 'Disable',
            enable: 'Enable',
            enable_ing: 'Active',
            disable_ing: 'Disabled',
            delete: 'Delete',
            enter: 'Please complete the form information!',
            remove: 'Remove',

        },
        search: {
            repair_sn: 'Inquire Sn',
            enter_repair_sn: 'Please enter the repair order number',
            vehicle_no: 'Vehicle No.',
            enter_vehicle_no: 'Please enter the vehicle number',
            select_distributor: 'Please select the distributor',
            select_agent: 'Please select the retailer',
            select_d_first: 'Please select a distributor first',
            select_store: 'Please select the Store',
            select_a_first: 'Please select a Agent first'
        },
        pop_up: {
            reason: 'reason',
            enter_fault: 'Please enter a fault name',
            disable: 'disable ',
            sure: 'Do you want to ',
            enable: 'enable',
            distributor: 'this distributor ?',
            success_disable: 'Disabled',
            success_enable: 'Enable',
            success: ' successfully !',
            yes: 'Yes',
            open: 'open',
            close: 'close',
            information: 'information personalization?',
            delete: 'delete',
            delete_success: 'Successfully deleted!',
            save_success: 'Successfully saved !',
            cancel: 'cancel ?',
            canceled: 'Successfully Canceled !',
            no: 'No',
            remove_a: 'Successfully removed !',
            item: 'Are you sure you want to remove this item from shopping cart ？',
            move: 'Moved out successfully !',
            item_favorites: 'Are you sure you want to move the item out of your favorites ?',
            add: 'Added successfully !',
            operate: 'Successful operation !',
            move_favorites: 'Are you sure to move the item to favorites ?',
            sure_delete: 'Are you sure you want to delete ?',
        }
    },
}


const i18n = createI18n({
    locale: 'zh', // 设置地区
    messages, // 设置地区信息
})

export default i18n
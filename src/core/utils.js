import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import Data from './data';
import Const from './const';
import dayjs from "dayjs";

const Util = {
    /* =============== 通用方法 ================ */
    /**
     * 判断当前登录用户是否有某项权限
     * @param {String,String} keys 权限的关键字
     */
    auth(...arr) {
        if (!arr.length) {
            return true
        }
        const rolesMap = Data.getAuthority() || {};
        return arr.some(key => {
            return rolesMap[key];
        });
    },
    confirm(param, type = 'warning') {
        Modal.confirm({
            ...param,
            icon: createVNode('span', { class: `modal-confirm-icon icon i_m_${type}` }),
        })
    },
    /**
     * 深拷贝
     * @param {Object} target
     */
    deepCopy(target) {
        let copyed_objs = [];

        function _deepCopy(target) {
            if (typeof target === 'string') {
                return target.trim()
            }
            if ((typeof target !== 'object') || !target) {
                return target;
            }
            for (let i = 0; i < copyed_objs.length; i++) {
                if (copyed_objs[i].target === target) {
                    return copyed_objs[i].copyTarget;
                }
            }
            let obj = {};
            if (Array.isArray(target)) {
                obj = [];
            }
            copyed_objs.push({ target: target, copyTarget: obj })
            Object.keys(target).forEach(key => {
                if (obj[key]) {
                    return;
                }
                obj[key] = _deepCopy(target[key]);
            });
            return obj;
        }

        return _deepCopy(target);
    },
    /**
     * 判断传入的对象是否为空
     * @param {Object} obj
     */
    isEmptyObj(obj) {
        if (!obj) {
            return true
        }
        return !Object.keys(obj).length
    },
    /**
     * 判断传入的数组是否有相同的值
     * @param {Array} arr ['', '']
     */
    hasSameItem(arr) {
        for (let i = 0; i < arr.length; i++) {
            const val = arr[i];
            for (let j = i + 1; j < arr.length; j++) {
                const _val = arr[j];
                if (val === _val) {
                    return true
                }
            }
        }
        return false
    },
    /**
     * 检测字符串中是否包含 表情图标
     * @param {String} str 需要检测的字符串
     */
    includeEmoji(str = '', ) {
        str = str.toString()
        let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
        return str.match(regRule) ? true : false
    },
    /**
     * 构造树型结构数据
     * @param {*} data 数据源
     * @param {*} id id字段 默认 'id'
     * @param {*} parentId 父节点字段 默认 'parentId'
     * @param {*} children 孩子节点字段 默认 'children'
     * @param {*} rootId 根Id 默认 0
     */
    handleTree(data, id, parentId, children, rootId) {
        id = id || 'id'
        parentId = parentId || 'parentId'
        children = children || 'children'
        rootId = rootId || 0
            //对源数据深度克隆
        const cloneData = JSON.parse(JSON.stringify(data))
            //循环所有项
        const treeData = cloneData.filter(father => {
            let branchArr = cloneData.filter(child => {
                //返回每一项的子级数组
                return father[id] === child[parentId]
            });
            branchArr.length > 0 ? father.children = branchArr : '';
            //返回第一层
            return father[parentId] === rootId;
        });
        return treeData != '' ? treeData : data;
    },
    /* =============== 通用方法 ================ */

    /* =============== 时间 ================ */
    /**
     * 将秒时间戳或毫秒时间戳转换成对应格式
     * @param {*} timestamp 秒时间戳或毫秒时间戳
     * @param {Number} type 预设时间格式对应的数字
     */
    timeFilter(value, type = 1) {
        if (value == null) return '';
        if (value.toString() === '0') return '-';
        switch (type) {
            case 1:
                return dayjs.unix(value).format('YYYY-MM-DD HH:mm:ss');
            case 2:
                return dayjs.unix(value).format('YYYY-MM-DD HH:mm');
            case 3:
                return dayjs.unix(value).format('YYYY-MM-DD');
            case 4:
                return dayjs.unix(value).format('YYYY年MM月DD日');
            default:
                return '-';
        }
    },
    /**
     * 将秒时间戳转换成对应格式
     * @param {*} timestamp 秒时间戳
     * @param {String} format 时间格式
     */
    timeFormat(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
        if (timestamp == null) return '';
        if (timestamp.toString() === '0') return '-';
        return dayjs.unix(timestamp).format(format)
    },
    /**
     * 计算秒时间戳距离现在过去的时间
     * @param {*} timestamp 秒时间戳
     * @param {String} format 时间差距单位
     */
    pastTimeFormat(timestamp, format = 'day') {
        if (timestamp == null) return '';
        if (timestamp.toString() === '0') return '-';
        return dayjs().diff(dayjs.unix(timestamp), format)
    },
    /**
     * 对 'YYYYMMDD' 转换
     * @param {String} val 秒时间戳
     * @param {Number} type 预设时间格式
     */
    dayFilter(val, type = 1) {
        if (!val) return '';
        val = val.toString();
        switch (type) {
            case 1:
                return `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6)}`
            case 2:
                return `${val.slice(0, 4)}-${val.slice(4, 6)}`
        }
    },
    /**
     * 将分钟单位的数值转换为小时带分钟的字符串
     * @param {Number} val 分钟
     */
    minToHour(val) {
        if (!val) return '0';
        if (val <= 60) {
            return val + '分'
        }
        let h = ~~(val / 60)
        let min = ~~(val % 60)
        return `${h}时${min}分`
    },
    /**
     * 将时间戳转换成那一天的起始秒时间戳
     * @param {*} timestamp 时间戳
     * @param {String} to 默认转为'天'的开始 year/month/week/date/day/hour/minute/second
     * @param {Number} type 1=传入的为秒时间戳 2=传入的为毫秒时间戳
     */
    startOfTime(timestamp, to = 'date', type = 1) {
        timestamp = Number(timestamp)
        if (!timestamp) {
            return ''
        }
        switch (type) {
            case 1:
                return dayjs.unix(timestamp).startOf(to).unix();
            case 2:
                return dayjs(timestamp).startOf(to).unix();
        }
    },
    /**
     * 将时间戳转换成那一天的结束秒时间戳
     * @param {*} timestamp 时间戳
     * @param {String} to 默认转为'天'的结束 year/month/week/date/day/hour/minute/second
     * @param {Number} type 默认 1=传入的为秒时间戳 2=传入的为毫秒时间戳
     */
    endOfTime(timestamp, to = 'date', type = 1) {
        timestamp = Number(timestamp)
        if (!timestamp) {
            return ''
        }
        switch (type) {
            case 1:
                return dayjs.unix(timestamp).endOf(to).unix();
            case 2:
                return dayjs(timestamp).endOf(to).unix();
        }
    },
    /* =============== 时间 ================ */

    /* =============== 数值 ================ */
    /**
     * @description:数值转换 将后端传来的数值转换成对应值
     * @param {Number} val 被除数 需要转换的数值
     * @param {Number} divisor 除数 默认为100
     * @param {Number} dp 保留几位小数 默认为2
     * @param {Number} type 乘法/除法 false=除法 true=乘法
     */
    countFilter(val = 0, divisor = 100, dp = 2, type = false) {
        if (val === 0) {
            return "0"
        }
        if (val < 0){
	        return "N/A"
        }
        if (type) {
            return parseFloat((val * divisor).toFixed(dp))
        } else {
            return parseFloat((val / divisor).toFixed(dp))
        }
    },
    /**
     * 将1-20以内的阿拉伯数字转换为中文
     * @param {Number} value 1-20以内的阿拉伯数字
     */
    chNumFilter(value) {
        if (!value) {
            return ''
        }
        const CH_NUM_MAP = {
            0: '零',
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五',
            6: '六',
            7: '七',
            8: '八',
            9: '九',
            10: '十',
            11: '十一',
            12: '十二',
            13: '十三',
            14: '十四',
            15: '十五',
            16: '十六',
            17: '十七',
            18: '十八',
            19: '十九',
            20: '二十',
        }
        return CH_NUM_MAP[value] || value
    },
    priceUnitFilter(val) {
        const MAP = Const.ITEM.MONETARY_TYPE_MAP
        return MAP[val]
    },
    /* =============== 数值 ================ */

    /* =============== 通用过滤器 ================ */
    imageFilter(item, default_type = 1) {
        if (!item || typeof item !== 'string') {
            // console.warn("imageFilter 没有找到图像")
            let map = Const.DEFULT_IMG
            return map[default_type] || ''
        }

        if (item.includes("http")) {
            return item
        } else {
            return Const.NET.FILE_URL_PREFIX + item
        }
    },

    addressFilter(obj,lang, type = 1) {
        if (typeof obj !== 'object' || !obj) {
            return '-'
        }
        let { province, city, county, address } = obj
        if (!province && !city && !county && !address) {
            return '-'
        }
       /* switch (type) {
            case 1:
                return `${province} ${city} ${county} ${address}`;
            case 2:
                return `${province} ${city} ${county}`;
        }*/
        if (lang === 'en') {
            let { province_en, city_en, county, address } = obj
            switch (type) {
                case 1:
                    return `${province_en} ${city_en} ${county} ${address}`;
            }
        }
        if (lang === 'zh') {
            let { province, city, county, address } = obj
            switch (type) {
                case 1:
                    return `${province} ${city} ${county} ${address}`;
                case 2:
                    return `${province} ${city} ${county}`;
            }
        }
    },

    boolFlagFilter(val, name) {
        if (name) {
            switch (val) {
                case 10:
                    return '已' + name
                case 0:
                    return '未' + name
                default:
                    return '未知'
            }
        } else {
            switch (val) {
                case 10:
                    return '是'
                case -10:
                    return '否'
                default:
                    return '未知'
            }
        }
    },
    tableFilterFormat(list, lang) {
        let arr = list.map(i => {
            return {
                value: i.value,
                text: i[lang]
            }
        })
        console.log('tableFilterFormat', arr)
        return arr

    },
    tableFieldsFilter(columns = [], role) {
        if (!columns.length) {
            return []
        }
        return columns.filter(item => {
            return item.role === undefined || item.role.includes(role)
        })
    },

    /* =============== 通用过滤器 ================ */

    /* =============== 分销商管理 ================ */
    distributorTypeFilter(val, to='zh') {
        const MAP = Const.DISTRIBUTOR.TYPE_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
	payTypeFilter(val, to='zh') {

		const MAP = Const.DISTRIBUTOR.PAY_TIME_LIST
		let value = MAP[val + ''] || {}
		return value[to] || '-'
	},

    /* =============== 分销商管理 ================ */

    /* =============== 商品 ================ */
    itemTypeFilter(val, to='zh') {
        const MAP = Const.ITEM.TYPE_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
    itemSpecFilter(attr_list, to='zh') {
        if (!(attr_list instanceof Array) || !attr_list.length) {
            return '-'
        }
        if (to === 'zh'){
	        let attr = attr_list.map(i => i.value)
	        return attr.join(' ')
        } else {
	        let attr = attr_list.map(i => i.value_en)
	        return attr.join(' ')
        }


    },
	itemFlagEntityFilter(val, to= 'zh') {
		const MAP = Const.ITEM.FLAG_ENTITY_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
    /* =============== 商品 ================ */


    /* =============== 维修单 ================ */
    repairStatusFilter(val, to = 'key') {
        const MAP = Const.REPAIR.STATUS_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
    repairTypeFilter(val, to = 'key') {
        const MAP = Const.REPAIR.TYPE_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
    repairChannelFilter(val, to='key') {
        const MAP = Const.REPAIR.CHANNEL_MAP
        let value = MAP[val] || {}
        return value[to] || '-'
    },
    repairMethodFilter(val, to='key') {
        const MAP = Const.REPAIR.METHOD_MAP
        let value = MAP[val] || {}
        return value[to] || '-'
    },
    repairServiceFilter(val, to='key') {
        const MAP = Const.REPAIR.SERVICE_TYPE_MAP
        let value = MAP[val] || {}
        return value[to] || '-'
    },
    repairPriorityFilter(val, to = 'key') {
        const MAP = Const.REPAIR.PRIORITY_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },

	deviceTypeFilter(val, to = 'zh') {
		const MAP = Const.REPAIR.DEVICE_LIST
		let value = MAP[val + ''] || {}
		return value[to] || '-'
	},
    /* repairItemTypeFilter(val) {
        const MAP = Const.REPAIR.ITEM_TYPE_MAP
        return MAP[val] || '未知'
    },
    repairFaultOptionsListFilter(val) {
        const MAP = Const.REPAIR.FAULT_OPTIONS_MAP
        return MAP[val] || '未知'
    }, */
    actionLogTypeFilter(val, to= 'zh') {
        const MAP = Const.ACTION_LOG.TYPE_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    /* =============== 维修单 ================ */


    /* =============== 采购单 && 售后管理 && 退款管理 ================ */
    purchaseStatusFilter(val, to = 'text') {
        const MAP = Const.PURCHASE.STATUS_MAP
        // const COLOR_MAP = Const.PURCHASE.STATUS_COLOR_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    purchasePayMethodFilter(val, to = 'zh') {
        const MAP = Const.PURCHASE.PAY_METHOD
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
	purchasePayStatusFilter(val, to = 'zh') {
		const MAP = Const.PURCHASE.PAY_STATUS_LIST
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
    purchaseFlagReviewFilter(val) {
        const MAP = Const.PURCHASE.FLAG_REVIEW_MAP
        return MAP[val] || '-'
    },
    paymentStatusFilter(val, to = 'zh') {
        const MAP = Const.PURCHASE.PAYMENT_STATUS_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    purchaseTransferFilter(val, to='zh') {
        const MAP = Const.PURCHASE.FLAG_TRANSFER_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    purchaseExpressFilter(val, to='zh') {
        if ( val === 0) {
            return '-'
        } else {
        	console.log("val",val)
	        console.log("to",to)
            const MAP = Const.WAYBILL.COURIER_MAP
            let item = MAP[val + ''] || {}
            return item[to] || ''
        }
    },
    purchaseWaybillFilter(val, to='zh') {
        console.log('val',val)
        if ( val === 0) {
            return '-'
        } else {
            const MAP = Const.WAYBILL.RECEIPT_MAP
            let item = MAP[val + ''] || {}
            return item[to] || ''
        }
    },
    aftersalesTypeFilter(val, to='zh') {
        const MAP = Const.AFTERSALES.TYPE_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
    aftersalesStatusFilter(val, to = 'key') {
        console.log('aftersalesStatusFilter to', to)
        const MAP = Const.AFTERSALES.STATUS_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },

    refundTypeFilter(val, to='zh') {
        const MAP = Const.REFUND.TYPE_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
    refundStatusFilter(val, to = 'zh') {
        const MAP = Const.REFUND.STATUS_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
	purchaseTypeFilter(val, to = 'zh') {
		const MAP = Const.PURCHASE.FLAG_ORDER_TYPE_LIST
		let value = MAP[val + ''] || {}
		return value[to] || '-'
	},
	purchasePayTypeFilter(val, to = 'zh') {
		const MAP = Const.DISTRIBUTOR.PAY_TIME_LIST
		let value = MAP[val + ''] || {}
		return value[to] || '-'
	},
    refundOrderStatusFilter(val, to='zh') {
        const MAP = Const.REFUND.REFUND_STATUS_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
    /* =============== 采购单 && 售后管理 && 退款管理  ================ */

    /* =============== 员工/账号/用户 ================ */
    userTypeFilter(val, to='zh') {
        const MAP = Const.USER.TYPE_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    /* =============== 员工/账号/用户 ================ */


    /* =============== 物流信息 ================ */
    waybillCompanyFilter(key) {
        const MAP = Const.WAYBILL.COMPANY_MAP
        return MAP[key] || '未知物流公司'
    },
    waybillTargetFilter(val, to='zh') {
        const MAP = Const.WAYBILL.TARGET_TYPE_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '未知货物订单'
    },
    waybillTypeFilter(val, to='zh') {
        const MAP = Const.WAYBILL.TYPE_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },
    /* =============== 物流信息 ================ */


    /* =============== 系统管理 ================ */
    noticeTypeFilter(val, to='zh') {
        const MASTER_MAP = Const.NOTICE.MASTER_TYPE_MAP
        const ORG_MAP = Const.NOTICE.ORG_TYPE_MAP
        const MAP = { ...MASTER_MAP, ...ORG_MAP }
        const item = MAP[val] || {}
        return item[to] || 'Unknown'
    },
    fileTargetTypeFilter(val, to='zh') {
        const MAP = Const.SYSTEM.FILE.TARGET_TYPE_MAP
        const item = MAP[val] || {}
        return item[to] || 'Unknown'
    },
    authUserTypeFilter(val, to='text') {
        const MAP = Const.NOTICE.RESOURCE_TYPE_MAP
        const item = MAP[val] || {}
        return item[to] || '未知'
    },
    /* =============== 系统管理 ================ */


    /* =============== 出入库 ================ */
    stockRecordFilter(val, to='zh') {
        const MAP = Const.STOCK_RECORD.TYPE_MAP
        const item = MAP[val] || {}
        return item[to] || '未知'
    },
    stockRecordSourceFilter(val) {
        const MAP = Const.STOCK_RECORD.SOURCE_TYPE_MAP
        return MAP[val] || '未知'
    },
    warehouseTypeFilter(val, to='zh') {
        const MAP = Const.WAREHOUSE.TYPE_MAP
        const item = MAP[val] || {}
        return item[to] || '未知'
    },
    invoiceStatusFilter(val, to = 'zh') {
        const MAP = Const.STOCK_RECORD.STATUS_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    targetTypeFilter(val, to='zh') {
        const MAP = Const.STOCK_RECORD.COMMODITY_TYPE_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
	targetTypeOldFilter(val, to='zh') {
		const MAP = Const.STOCK_RECORD.COMMODITY_TYPE_OLD_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
    sourceTypeAdminFilter(val, to='zh') {
        const MAP = Const.STOCK_RECORD.SOURCE_TYPE_ADMIN_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    sourceTypeFilter(val, to='zh') {
        const MAP = Const.STOCK_RECORD.SOURCE_TYPE_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    sourceFormFilter(val, to='zh') {
        const MAP = Const.STOCK_RECORD.SOURCE_FORM_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },

    /* =============== 出入库 ================ */

    /* =============== 调货单 ================ */
    transferStatusFilter(val, to = 'text') {
        const MAP = Const.TRANSFER_ORDER.STATUS_MAP
        const COLOR_MAP = Const.TRANSFER_ORDER.STATUS_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },
    /* =============== 调货单 ================ */

    /* =============== 故障件管理 ================ */
    faultStatusFilter(val, to = 'text') {
        const MAP = Const.FAULT_ENTITY.STATUS_MAP
        const COLOR_MAP = Const.FAULT_ENTITY.STATUS_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },
    /* =============== 故障件管理 ================ */


    /* =============== 账户 ================ */
    walletTypeFilter(val) {
        const MAP = Const.WALLET.TYPE_MAP
        return MAP[val] || '未知'
    },
    operateTypeFilter(val, to= 'zh') {
        const MAP = Const.WALLET.OPERATE_TYPE_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    subjectTypeFilter(val, to= 'zh') {
        const MAP = Const.WALLET.SUBJECT_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    /* =============== 账户 ================ */

    /* =============== 生产管理 ================ */
    bomTargetTypeFilter(val, to = 'text') {
        const MAP = Const.BOM.TARGET_TYPE_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    productionStatusFilter(val, to = 'text') {
        const MAP = Const.PRODUCTION.STATUS_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    /* =============== 生产管理 ================ */

    /* =============== 供应商管理 ================ */
    supplierPaymentTypeFilter(val) {
        const MAP = Const.SUPPLIER.PAYMENT_TYPE_MAP
        return MAP[val] || '未知'
    },
    flagPurchaseFilter(val, to = 'text') {
        const MAP = Const.SUPPLIER.STATUS_PURCHASE_MAP
        const COLOR_MAP = Const.SUPPLIER.STATUS_PURCHASE_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },
    flagSettlementFilter(val, to = 'text') {
        const MAP = Const.SUPPLIER.STATUS_SETTLEMENT_MAP
        const COLOR_MAP = Const.SUPPLIER.STATUS_SETTLEMENT_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },
    supplierTypeFilter(val, to='text') {
        const MAP = Const.SUPPLIER.SUPPLIER_TYPE_MAP
        const COLOR_MAP = Const.SUPPLIER.SUPPLIER_TYPE_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },
    /* =============== 供应商管理 ================ */

    /* =============== 物料采购 ================ */
    materialPurchaseStatusFilter(val, to = 'text') {
        const MAP = Const.MATERIAL_PURCHASE.STATUS_MAP
        const COLOR_MAP = Const.MATERIAL_PURCHASE.STATUS_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },

    /* =============== 物料采购 ================ */

	/* =============== 质量反馈单 ================ */
	feedbackStatusFilter(val, to = 'key') {
		const MAP = Const.FEEDBACK.STATUS_MAP
		let value = MAP[val + ''] || {}
		return value[to] || '-'
	},
	/* =============== 质量反馈单 ================ */

    /* =============== 调货单 ================ */
    warehouseTransferStatusFilter(val, to = 'text') {
        const MAP = Const.WAREHOUSE_TRANSFER.STATUS_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    transferTypeFilter(val) {
        const MAP = Const.WAREHOUSE_TRANSFER.COMMODITY_TYPE_MAP
        return MAP[val] || '未知'
    },
    /* =============== 调货单 ================ */
	/* =============== 整车 ================ */
	entityStatusFilter(val,  to='zh') {
		const MAP = Const.ENTITY.STATUS_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	/* =============== 整车 ================ */

    /* =============== 权限 ================ */
    userAuthFilter(val,  to='zh') {
        const MAP = Const.NOTICE.RESOURCE_TYPE_MAP
        let item = MAP[val + ''] || {}
        return item[to] || ''
    },
    /* =============== 权限 ================ */
	/* =============== CRM客户管理 ================ */
	CRMCustomerTypeFilter(val,  to='zh') {
		const MAP = Const.CRM_CUSTOMER.TYPE_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	CRMCustomerLevelFilter(val,  to='zh') {
		const MAP = Const.CRM_CUSTOMER.LEVEL_MAP
		let item = MAP[val + ''] || {}
		console.log("item",val)
		return item[to] || ''
	},
	CRMCustomerSourceFilter(val,  to='zh') {
		const MAP = Const.CRM_CUSTOMER.SOURCE_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	CRMCustomerIndustryFilter(val,  to='zh') {
		const MAP = Const.CRM_CUSTOMER.INDUSTRY_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	CRMCustomerGenderFilter(val,  to='zh') {
		const MAP = Const.CRM_CUSTOMER.GENDER_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	CRMCustomerMaritalStatusFilter(val,  to='zh') {
		const MAP = Const.CRM_CUSTOMER.MARITAL_STATUS_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	CRMTrackStatusMapFilter(val,  to='zh') {
		const MAP = Const.CRM_CUSTOMER.TRACK_STATUS_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},

	/* =============== CRM客户管理 ================ */

	/* =============== CRM订单管理 ================ */
	CRMOrderTypeFilter(val,  to='zh') {
		const MAP = Const.CRM_ORDER.TYPE_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	CRMOrderStatusFilter(val,  to='zh') {
		const MAP = Const.CRM_ORDER.STATUS_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	/* =============== CRM订单管理 ================ */

	/* =============== CRM跟进记录 ================ */
	CRMTrackRecordFilter(val,  to='zh') {
		const MAP = Const.CRM_TRACK_RECORD.TYPE_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	/* =============== CRM跟进记录 ================ */

	/* =============== CRM回款单 ================ */
	CRMOrderIncomeStatusFilter(val,  to='zh') {
		const MAP = Const.CRM_ORDER_INCOME.STATUS_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	CRMOrderIncomeTypeFilter(val,  to='zh') {
		const MAP = Const.CRM_ORDER_INCOME.TYPE_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	CRMOrderIncomePaymentTypeFilter(val,  to='zh') {
		const MAP = Const.CRM_ORDER_INCOME.PAYMENT_TYPE_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	/* =============== CRM回款单 ================ */
	/* =============== CRM回款单 ================ */
	CRMActionRecordTypeMapFilter(val,  to='zh') {
		console.log(val)
		const MAP = Const.CRM_ACTION_RECORD.TYPE_MAP
		let item = MAP[val + ''] || {}
		return item[to] || ''
	},
	/* =============== CRM回款单 ================ */

}

export default Util

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
        if (val == 0) {
            return 0
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

    addressFilter(obj, type = 1) {
        let { province, city, county, address } = obj
        if (!province && !city && !county && !address) {
            return '-'
        }
        switch (type) {
            case 1:
                return `${province} ${city} ${county} ${address}`;
            case 2:
                return `${province} ${city} ${county}`
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

    tableFieldsFilter(columns = [], role) {
        if (!columns.length) {
            return []
        }
        return columns.filter(item => {
            return item.role === undefined || item.role.includes(role)
        })
    },
    /* =============== 通用过滤器 ================ */

    /* ===============  ================ */
    distributorTypeFilter(val) {
        const MAP = Const.DISTRIBUTOR.TYPE_MAP
        return MAP[val] || '未知'
    },
    /* =============== 通用过滤器 ================ */

    /* =============== 商品 ================ */
    itemTypeFilter(val) {
        const MAP = Const.ITEM.TYPE_MAP
        return MAP[val] || '未知'
    },
    itemSpecFilter(attr_list) {
        if (!(attr_list instanceof Array) || !attr_list.length) {
            return '-'
        }
        let attr = attr_list.map(i => i.value)
        return attr.join(' ')
    },
    /* =============== 商品 ================ */


    /* =============== 维修单 ================ */
    repairStatusFilter(val, to = 'text') {
        const MAP = Const.REPAIR.STATUS_MAP
        const COLOR_MAP = Const.REPAIR.STATUS_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val] || 'grey'
        }
    },
    repairTypeFilter(val) {
        const MAP = Const.REPAIR.TYPE_MAP
        return MAP[val] || '未知'
    },
    repairChannelFilter(val) {
        const MAP = Const.REPAIR.CHANNEL_MAP
        return MAP[val] || '未知'
    },
    repairMethodFilter(val) {
        const MAP = Const.REPAIR.METHOD_MAP
        return MAP[val] || '未知'
    },
    repairServiceFilter(val) {
        const MAP = Const.REPAIR.SERVICE_TYPE_MAP
        return MAP[val] || '未知'
    },
    repairPriorityFilter(val, to = 'text') {
        const MAP = Const.REPAIR.PRIORITY_MAP
        const COLOR_MAP = Const.REPAIR.PRIORITY_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val] || '未知'
            case 'color':
                return COLOR_MAP[val] || 'grey'
        }
    },
    /* repairItemTypeFilter(val) {
        const MAP = Const.REPAIR.ITEM_TYPE_MAP
        return MAP[val] || '未知'
    },
    repairFaultOptionsListFilter(val) {
        const MAP = Const.REPAIR.FAULT_OPTIONS_MAP
        return MAP[val] || '未知'
    }, */
    actionLogTypeFilter(val) {
        const MAP = Const.ACTION_LOG.TYPE_MAP
        return MAP[val] || '未知'
    },
    /* =============== 维修单 ================ */


    /* =============== 采购单 && 售后管理 && 退款管理 ================ */
    purchaseStatusFilter(val, to = 'text') {
        const MAP = Const.PURCHASE.STATUS_MAP
        const COLOR_MAP = Const.PURCHASE.STATUS_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },
    purchasePayMethodFilter(val) {
        const MAP = Const.PURCHASE.PAY_METHOD
        return MAP[val] || '-'
    },
    purchaseFlagReviewFilter(val) {
        const MAP = Const.PURCHASE.FLAG_REVIEW_MAP
        return MAP[val] || '-'
    },
    paymentStatusFilter(val, to = 'text') {
        const MAP = Const.PURCHASE.PAYMENT_STATUS_MAP
        const COLOR_MAP = Const.PURCHASE.PAYMENT_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },

    aftersalesTypeFilter(val) {
        const MAP = Const.AFTERSALES.TYPE_MAP
        return MAP[val + ''] || '未知'
    },
    aftersalesStatusFilter(val, to = 'text') {
        const MAP = Const.AFTERSALES.STATUS_MAP
        let value = MAP[val + ''] || {}
        return value[to] || '-'
    },

    refundTypeFilter(val) {
        const MAP = Const.REFUND.TYPE_MAP
        return MAP[val] || '未知'
    },
    refundStatusFilter(val, to = 'text') {
        const MAP = Const.REFUND.STATUS_MAP
        const COLOR_MAP = Const.REFUND.STATUS_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },
    /* =============== 采购单 && 售后管理 && 退款管理  ================ */

    /* =============== 员工/账号/用户 ================ */
    userTypeFilter(val) {
        const MAP = Const.USER.TYPE_MAP
        return MAP[val] || '未知'
    },
    /* =============== 员工/账号/用户 ================ */


    /* =============== 物流信息 ================ */
    waybillCompanyFilter(key) {
        const MAP = Const.WAYBILL.COMPANY_MAP
        return MAP[key] || '未知物流公司'
    },
    waybillTargetFilter(val) {
        const MAP = Const.WAYBILL.TARGET_TYPE_MAP
        return MAP[val] || '未知货物订单'
    },
    /* =============== 物流信息 ================ */


    /* =============== 系统管理 ================ */
    noticeTypeFilter(val, to='text') {
        const MASTER_MAP = Const.NOTICE.MASTER_TYPE_MAP
        const ORG_MAP = Const.NOTICE.ORG_TYPE_MAP
        const MAP = { ...MASTER_MAP, ...ORG_MAP }
        const item = MAP[val] || {}
        return item[to] || '未知'
    },
    fileTargetTypeFilter(val) {
        const MAP = Const.SYSTEM.FILE.TARGET_TYPE_MAP
        return MAP[val] || '未知'
    },
    /* =============== 系统管理 ================ */


    /* =============== 出入库 ================ */
    stockRecordFilter(val) {
        const MAP = Const.STOCK_RECORD.TYPE_MAP
        return MAP[val] || '未知'
    },
    stockRecordSourceFilter(val) {
        const MAP = Const.STOCK_RECORD.SOURCE_TYPE_MAP
        return MAP[val] || '未知'
    },
    warehouseTypeFilter(val) {
        const MAP = Const.WAREHOUSE.TYPE_MAP
        return MAP[val] || '未知'
    },
    invoiceStatusFilter(val, to = 'text') {
        const MAP = Const.STOCK_RECORD.STATUS_MAP
        const COLOR_MAP = Const.STOCK_RECORD.STATUS_COLOR_MAP
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知'
            case 'color':
                return COLOR_MAP[val + ''] || 'grey'
        }
    },
    targetTypeFilter(val) {
        const MAP = Const.STOCK_RECORD.COMMODITY_TYPE_MAP
        return MAP[val] || '未知'
    },
    sourceTypeFilter(val) {
        const MAP = Const.STOCK_RECORD.SOURCE_TYPE_MAP
        return MAP[val] || '未知'
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
    operateTypeFilter(val) {
        const MAP = Const.WALLET.OPERATE_TYPE_MAP
        return MAP[val] || '未知'
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
    }
    /* =============== 生产管理 ================ */

}

export default Util
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import Data from './data';
import Const from './const';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import Image from './modules/units/image';
import Number from './modules/units/number';
import Common from './modules/units/common';

dayjs.extend(weekday);
dayjs.extend(localeData);

const Util = {
    /* =============== 通用方法 ================ */
    /**
     * 判断当前登录用户是否有某项权限
     * @param {String,String} keys 权限的关键字
     */
    auth(...arr) {
        if (!arr.length) {
            return true;
        }
        const rolesMap = Data.getAuthority() || {};
        return arr.some(key => {
            return rolesMap[key];
        });
    },
    confirm(param, type = 'warning') {
        Modal.confirm({
            ...param,
            icon: createVNode('span', {
                class: `modal-confirm-icon icon i_m_${type}`,
            }),
        });
    },
    /**
     * 深拷贝
     * @param {Object} target
     */
    deepCopy(target) {
        let copyed_objs = [];

        function _deepCopy(target) {
            if (typeof target === 'string') {
                return target.trim();
            }
            if (typeof target !== 'object' || !target) {
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
            copyed_objs.push({ target: target, copyTarget: obj });
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
            return true;
        }
        return !Object.keys(obj).length;
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
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * 检测字符串中是否包含 表情图标
     * @param {String} str 需要检测的字符串
     */
    includeEmoji(str = '') {
        str = str.toString();
        let regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        return str.match(regRule) ? true : false;
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
        id = id || 'id';
        parentId = parentId || 'parentId';
        children = children || 'children';
        rootId = rootId || 0;
        //对源数据深度克隆
        const cloneData = JSON.parse(JSON.stringify(data));
        //循环所有项
        const treeData = cloneData.filter(father => {
            let branchArr = cloneData.filter(child => {
                //返回每一项的子级数组
                return father[id] === child[parentId];
            });
            branchArr.length > 0 ? (father.children = branchArr) : '';
            //返回第一层
            return father[parentId] === rootId;
        });
        return treeData != '' ? treeData : data;
    },
    fileSaveAs(blob, filename) {},

    /* =============== 通用方法 ================ */

    /* =============== 时间 ================ */

    /**
     * 将秒时间戳或毫秒时间戳转换成moment对象
     * @param {*} timestamp 秒时间戳或毫秒时间戳
     */
    dayjsReview(value) {
        //    antd3.x 用法 将秒时间戳或毫秒时间戳转换成Dayjs对象
        return dayjs.unix(value);
    },
    dayjsToTimestamp(value) {
        //    antd3.x 用法 将Dayjs对象转换成秒时间戳
        return dayjs(value).unix();
    },
    /**
     * 将秒时间戳或毫秒时间戳转换成对应格式
     * @param {*} timestamp 秒时间戳或毫秒时间戳
     * @param {Number} type 预设时间格式对应的数字
     */
    timeFilter(value, type = 1) {
        if (value == null || value == '') return '-';
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
            case 5:
                return dayjs.unix(value).format('HH:mm:ss');
            case 6: // 英文时间格式
                return dayjs.unix(value).format('DD.MM.YYYY');
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
        return dayjs.unix(timestamp).format(format);
    },
    /**
     * 计算秒时间戳距离现在过去的时间
     * @param {*} timestamp 秒时间戳
     * @param {String} format 时间差距单位
     */
    pastTimeFormat(timestamp, format = 'day') {
        if (timestamp == null) return '';
        if (timestamp.toString() === '0') return '-';
        return dayjs().diff(dayjs.unix(timestamp), format);
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
                return `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6)}`;
            case 2:
                return `${val.slice(0, 4)}-${val.slice(4, 6)}`;
        }
    },
    /**
     * 将分钟单位的数值转换为小时带分钟的字符串
     * @param {Number} val 分钟
     */
    minToHour(val) {
        if (!val) return '0';
        if (val <= 60) {
            return val + '分';
        }
        let h = ~~(val / 60);
        let min = ~~(val % 60);
        return `${h}时${min}分`;
    },
    /**
     * 将时间戳转换成那一天的起始秒时间戳
     * @param {*} timestamp 时间戳
     * @param {String} to 默认转为'天'的开始 year/month/week/date/day/hour/minute/second
     * @param {Number} type 1=传入的为秒时间戳 2=传入的为毫秒时间戳
     */
    startOfTime(timestamp, to = 'date', type = 1) {
        timestamp = Number(timestamp);
        if (!timestamp) {
            return '';
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
        timestamp = Number(timestamp);
        if (!timestamp) {
            return '';
        }
        switch (type) {
            case 1:
                return dayjs.unix(timestamp).endOf(to).unix();
            case 2:
                return dayjs(timestamp).endOf(to).unix();
        }
    },
    /**
     * 转换两个时间点间的耗时并转换成对应格式
     * @param {String, Number} begin_time 开始时间戳
     * @param {String, Number} end_time 结束时间戳 不传则默认当前时间
     */
    timeConsumedFilter(begin_time, end_time = dayjs().unix(), type = 1) {
        let begin = dayjs.unix(begin_time);
        let end = dayjs.unix(end_time);
        let diff = end.diff(begin, 's');

        if (diff < 0) {
            return '-';
        }

        let d_h = end.diff(begin, 'h');
        let d_m = end.diff(begin, 'm');
        let d_s = diff;

        let s_h = d_h.toString().padStart(2, '0');
        let s_m = (d_m - 60 * d_h).toString().padStart(2, '0');
        let s_s = (d_s - 60 * d_m).toString().padStart(2, '0');

        switch (type) {
            case 1:
                return [s_h, s_m, s_s].filter(i => i).join(':');
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
            return '0';
        }
        if (val < 0) {
            return 'N/A';
        }
        if (type) {
            return parseFloat((val * divisor).toFixed(dp));
        } else {
            return parseFloat((val / divisor).toFixed(dp));
        }
    },
    /**
     * 将1-20以内的阿拉伯数字转换为中文
     * @param {Number} value 1-20以内的阿拉伯数字
     */
    chNumFilter(value) {
        if (!value) {
            return '';
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
        };
        return CH_NUM_MAP[value] || value;
    },
    priceUnitFilter(val) {
        const MAP = Const.ITEM.MONETARY_TYPE_MAP;
        return MAP[val];
    },
    /* =============== 数值 ================ */

    /* =============== 通用过滤器 ================ */
    valueFilter(val, map, to = 'text') {
        let arr = map.split('.');
        let MAP = Const[arr[0]][arr[1]] || {};
        let ITEM = MAP[val + ''] || {};
        return ITEM[to] || '';
    },
    imageFilter(item, default_type = 1, default_img_url = '') {
        if (!item || typeof item !== 'string') {
            console.warn('imageFilter 没有找到图像');
            let map = Const.DEFULT_IMG;
            // return map[default_type] || '';
            return default_img_url || map[default_type] || '';
        }
        // 如果是多张-逗号拼接形式
        if (item.includes(',')) {
            item = item.split(',')?.[0];
        }
        if (item.includes('http')) {
            return item;
        } else {
            return Const.NET.FILE_URL_PREFIX + item;
        }
    },

    addressFilter(obj, lang, type = 1) {
        if (typeof obj !== 'object' || !obj) {
            return '-';
        }
        let { province, city, county, address } = obj;
        if (!province && !city && !county && !address) {
            return '-';
        }
        /* switch (type) {
             case 1:
                 return `${province} ${city} ${county} ${address}`;
             case 2:
                 return `${province} ${city} ${county}`;
         }*/
        if (lang === 'en') {
            let { province_en, city_en, county, address } = obj;
            switch (type) {
                case 1:
                    return `${province_en} ${city_en} ${county} ${address}`;
            }
        }
        if (lang === 'zh') {
            let { province, city, county, address } = obj;
            switch (type) {
                case 1:
                    return `${province} ${city} ${county} ${address}`;
                case 2:
                    return `${province} ${city} ${county}`;
            }
        }
    },

    addressFilterZh(obj, lang, type = 1) {
        if (typeof obj !== 'object' || !obj) {
            return '-';
        }
        let { country, province, city, county, address } = obj;
        if (!province && !city && !county && !address) {
            return country;
        }
        /* switch (type) {
             case 1:
                 return `${province} ${city} ${county} ${address}`;
             case 2:
                 return `${province} ${city} ${county}`;
         }*/
        if (lang === 'en') {
            let { province_en, city_en, county, address } = obj;
            switch (type) {
                case 1:
                    return `${province_en} ${city_en} ${county} ${address}`;
            }
        }
        if (lang === 'zh') {
            let { province, city, county, address } = obj;
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
                    return '已' + name;
                case 0:
                    return '未' + name;
                default:
                    return '未知';
            }
        } else {
            switch (val) {
                case 10:
                    return '是';
                case -10:
                    return '否';
                default:
                    return '未知';
            }
        }
    },
    tableFilterFormat(list, lang) {
        let arr = list.map(i => {
            return {
                value: i.value,
                text: i[lang],
            };
        });
        console.log('tableFilterFormat', arr);
        return arr;
    },
    tableFieldsFilter(columns = [], role) {
        if (!columns.length) {
            return [];
        }
        return columns.filter(item => {
            return item.role === undefined || item.role.includes(role);
        });
    },
    ifPhoneFilter(val, phoneAreaCode) {
        return true;
        // 国内限制手机号11位  国外限制手机号9位
        // if(phoneAreaCode === '+86') {
        //     let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        //     if (phoneReg.test(val)){
        //         return true;
        //     } else {
        //         return false;
        //     }
        // } else {
        //     if (val.length === 9){
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
    },
    phoneEncryption(val) {
        //手机号加密
        if (val.length === 11) {
            return val.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2');
        } else {
            return val.replace(/^(\d{3})(\d+)/, '$1****');
        }
    },

    /* =============== 通用过滤器 ================ */

    /* =============== 分销商管理 ================ */
    distributorTypeFilter(val, to = 'zh') {
        const MAP = Const.DISTRIBUTOR.TYPE_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    payTypeFilter(val, to = 'zh') {
        const MAP = Const.DISTRIBUTOR.PAY_TIME_LIST;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },

    /* =============== 分销商管理 ================ */

    /* =============== 商品 ================ */
    itemTypeFilter(val, to = 'zh') {
        const MAP = Const.ITEM.TYPE_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    itemSpecFilter(attr_list, to = 'zh') {
        if (!(attr_list instanceof Array) || !attr_list.length) {
            return '-';
        }
        if (to === 'zh') {
            let attr = attr_list.map(i => i.value);
            return attr.join(' / ');
        } else {
            let attr = attr_list.map(i => i.value_en);
            return attr.join(' / ');
        }
    },
    itemFlagEntityFilter(val, to = 'zh') {
        const MAP = Const.ITEM.FLAG_ENTITY_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 商品 ================ */

    /* =============== 维修单 ================ */
    repairStatusFilter(val, to = 'key') {
        const MAP = Const.REPAIR.NEW_STATUS_MAP;
        switch (to) {
            case 'key':
                return MAP[val + ''] || {};
            case 'color':
                return MAP[val + '']?.color || 'gray';
        }
    },
    repairAllStatusFilter(val, to = 'key') {
        const MAP = Const.REPAIR.STATUS_MAP;
        switch (to) {
            case 'key':
                return MAP[val + ''] || {};
            case 'color':
                return MAP[val + '']?.color || 'grey';
        }
    },
    repairNewTypeFilter(val) {
        const MAP = Const.REPAIR.CATEGORY_LIST_MAP;
        let value = MAP[val + ''] || {};
        return value || '-';
    },
    repairLogTypeFilter(val) {
        const MAP = Const.REPAIR.LOG_MAP;
        let value = MAP[val + ''] || {};
        return value || '-';
    },
    repairTypeFilter(val, to = 'key') {
        const MAP = Const.REPAIR.DEVICE_LIST_OBJ;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    repairChannelFilter(val, to = 'key') {
        const MAP = Const.REPAIR.CHANNEL_MAP;
        let value = MAP[val] || {};
        return value[to] || '-';
    },
    repairMethodFilter(val, to = 'key') {
        const MAP = Const.REPAIR.METHOD_MAP;
        let value = MAP[val] || {};
        return value[to] || '-';
    },
    repairServiceFilter(val, to = 'key') {
        const MAP = Const.REPAIR.SERVICE_TYPE_MAP;
        let value = MAP[val] || {};
        return value[to] || '-';
    },
    repairPayMethodFilter(val, to = 'key') {
        const MAP = Const.REPAIR.PAYMETHOD_TYPE_MAP;
        let value = MAP[val] || {};
        return value[to] || '-';
    },
    repairCategoryTypeFilter(val, to = 'key') {
        const MAP = Const.REPAIR.CATEGORY_TYPE_MAP;
        let value = MAP[val] || {};
        return value[to] || '-';
    },
    repairPriorityFilter(val, to = 'key') {
        const MAP = Const.REPAIR.PRIORITY_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },

    deviceTypeFilter(val, to = 'zh') {
        const MAP = Const.REPAIR.DEVICE_LIST_OBJ;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    /* repairItemTypeFilter(val) {
        const MAP = Const.REPAIR.ITEM_TYPE_MAP
        return MAP[val] || '未知'
    },
    repairFaultOptionsListFilter(val) {
        const MAP = Const.REPAIR.FAULT_OPTIONS_MAP
        return MAP[val] || '未知'
    }, */
    actionLogTypeFilter(val, to = 'zh') {
        const MAP = Const.ACTION_LOG.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    threePagFilter(val, to = 'key') {
        const MAP = Const.REPAIR.SERVICE_TYPE_MAP;
        let value = MAP[val] || {};
        return value[to] || '-';
    },
    /* =============== 维修单 ================ */

    /* =============== 采购单 && 售后管理 && 退款管理 ================ */
    purchaseStatusFilter(val, to = 'text') {
        const MAP = Const.PURCHASE.STATUS_MAP;
        // const COLOR_MAP = Const.PURCHASE.STATUS_COLOR_MAP
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    purchasePayMethodFilter(val, to = 'zh') {
        const MAP = Const.PURCHASE.PAY_METHOD;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    purchasePayStatusFilter(val, to = 'zh') {
        const MAP = Const.PURCHASE.PAY_STATUS_LIST;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    purchaseFlagReviewFilter(val) {
        const MAP = Const.PURCHASE.FLAG_REVIEW_MAP;
        return MAP[val] || '-';
    },
    paymentStatusFilter(val, to = 'zh') {
        const MAP = Const.PURCHASE.PAYMENT_STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    purchaseTransferFilter(val, to = 'zh') {
        const MAP = Const.PURCHASE.FLAG_TRANSFER_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    purchaseExpressFilter(val, to = 'zh') {
        if (val === 0) {
            return '-';
        } else {
            console.log('val', val);
            console.log('to', to);
            const MAP = Const.WAYBILL.COURIER_MAP;
            let item = MAP[val + ''] || {};
            return item[to] || '';
        }
    },
    purchaseWaybillFilter(val, to = 'zh') {
        console.log('val', val);
        if (val === 0) {
            return '-';
        } else {
            const MAP = Const.WAYBILL.RECEIPT_MAP;
            let item = MAP[val + ''] || {};
            return item[to] || '';
        }
    },
    purchaseDeliveryMethodFilter(val, to = 'zh') {
        console.log('val', val);
        if (val === 0) {
            return '-';
        } else {
            const MAP = Const.WAYBILL.COURIER_MAP;
            let item = MAP[val + ''] || {};
            return item[to] || '';
        }
    },
    purchaseDeliveryMethodFilter(val, to = 'zh') {
        console.log('val', val);
        if (val === 0) {
            return '-';
        } else {
            const MAP = Const.WAYBILL.COURIER_MAP;
            let item = MAP[val + ''] || {};
            return item[to] || '';
        }
    },
    aftersalesTypeFilter(val, to = 'zh') {
        const MAP = Const.AFTERSALES.TYPE_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    aftersalesStatusFilter(val, to = 'key') {
        console.log('aftersalesStatusFilter to', to);
        const MAP = Const.AFTERSALES.STATUS_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },

    refundTypeFilter(val, to = 'zh') {
        const MAP = Const.REFUND.TYPE_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    refundStatusFilter(val, to = 'zh') {
        const MAP = Const.REFUND.STATUS_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    purchaseTypeFilter(val, to = 'zh') {
        const MAP = Const.PURCHASE.FLAG_ORDER_TYPE_LIST;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    purchasePayTypeFilter(val, to = 'zh') {
        const MAP = Const.DISTRIBUTOR.PAY_TIME_LIST;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    refundOrderStatusFilter(val, to = 'zh') {
        const MAP = Const.AFTERSALES.REFUND_STATUS_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    // 统一状态管理
    StatusFilter(val, MAP, to = 'zh', final = 'finally') {
        let item = MAP[String(val)] || MAP[final];
        return item[to] || '';
    },
    /* =============== 采购单 && 售后管理 && 退款管理  ================ */

    /* =============== 用户/账号/用户 ================ */
    userTypeFilter(val, to = 'zh') {
        const MAP = Const.USER.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 用户/账号/用户 ================ */

    /* =============== 物流信息 ================ */
    waybillCompanyFilter(key) {
        const MAP = Const.WAYBILL.COMPANY_MAP;
        return MAP[key] || '未知物流公司';
    },
    waybillTargetFilter(val, to = 'zh') {
        const MAP = Const.WAYBILL.TARGET_TYPE_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '未知货物订单';
    },
    waybillTypeFilter(val, to = 'zh') {
        const MAP = Const.WAYBILL.TYPE_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    /* =============== 物流信息 ================ */

    /* =============== 系统管理 ================ */
    noticeTypeFilter(val, to = 'zh') {
        const MASTER_MAP = Const.NOTICE.MASTER_TYPE_MAP;
        const ORG_MAP = Const.NOTICE.ORG_TYPE_MAP;
        const MAP = { ...MASTER_MAP, ...ORG_MAP };
        const item = MAP[val] || {};
        return item[to] || 'Unknown';
    },
    fileTargetTypeFilter(val, to = 'zh') {
        const MAP = Const.SYSTEM.FILE.TARGET_TYPE_MAP;
        const item = MAP[val] || {};
        return item[to] || 'Unknown';
    },
    authUserTypeFilter(val, to = 'text') {
        const MAP = Const.NOTICE.RESOURCE_TYPE_MAP;
        const item = MAP[val] || {};
        return item[to] || '未知';
    },
    printTemplateTypeMapFilter(val, to = 'zh') {
        const MAP = Const.SYSTEM.PRINT_TEMPLATE.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 系统管理 ================ */

    /* =============== 出入库 ================ */
    stockRecordFilter(val, to = 'zh') {
        const MAP = Const.STOCK_RECORD.TYPE_MAP;
        const item = MAP[val] || {};
        return item[to] || '未知';
    },
    stockRecordSourceFilter(val) {
        const MAP = Const.STOCK_RECORD.SOURCE_TYPE_MAP;
        return MAP[val] || '未知';
    },
    warehouseTypeFilter(val, to = 'zh') {
        const MAP = Const.WAREHOUSE.TYPE_MAP;
        const item = MAP[val] || {};
        return item[to] || '未知';
    },
    inventoryTypeFilter(val, to = 'zh') {
        const MAP = Const.INVENTORY.TYPE_MAP;
        const item = MAP[val] || {};
        return item[to] || '未知';
    },
    invoiceStatusFilter(val, to = 'zh') {
        const MAP = Const.STOCK_RECORD.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    targetTypeFilter(val, to = 'zh') {
        const MAP = Const.STOCK_RECORD.COMMODITY_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    targetTypeOldFilter(val, to = 'zh') {
        const MAP = Const.STOCK_RECORD.COMMODITY_TYPE_OLD_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    sourceTypeAdminFilter(val, to = 'zh') {
        const MAP = Const.STOCK_RECORD.SOURCE_TYPE_ADMIN_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    sourceTypeFilter(val, to = 'zh') {
        const MAP = Const.STOCK_RECORD.SOURCE_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    sourceFormFilter(val, to = 'zh') {
        const MAP = Const.STOCK_RECORD.SOURCE_FORM_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },

    /* =============== 出入库 ================ */

    /* =============== 调货单 ================ */
    transferStatusFilter(val, to = 'text') {
        const MAP = Const.TRANSFER_ORDER.STATUS_MAP;
        const COLOR_MAP = Const.TRANSFER_ORDER.STATUS_COLOR_MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },
    /* =============== 调货单 ================ */

    /* =============== 故障件管理 ================ */
    faultStatusFilter(val, to = 'text') {
        const MAP = Const.FAULT_ENTITY.STATUS_MAP;
        const COLOR_MAP = Const.FAULT_ENTITY.STATUS_COLOR_MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },
    /* =============== 故障件管理 ================ */

    /* =============== 账户 ================ */
    walletTypeFilter(val) {
        const MAP = Const.WALLET.TYPE_MAP;
        return MAP[val] || '未知';
    },
    operateTypeFilter(val, to = 'zh') {
        const MAP = Const.WALLET.OPERATE_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    subjectTypeFilter(val, to = 'zh') {
        const MAP = Const.WALLET.SUBJECT_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 账户 ================ */

    /* =============== 生产管理 ================ */
    bomTargetTypeFilter(val, to = 'text') {
        const MAP = Const.BOM.TARGET_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    productionStatusFilter(val, to = 'text') {
        const MAP = Const.PRODUCTION.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 生产管理 ================ */

    /* =============== 供应商管理 ================ */
    supplierPaymentTypeFilter(val) {
        const MAP = Const.SUPPLIER.PAYMENT_TYPE_MAP;
        return MAP[val] || '未知';
    },
    flagPurchaseFilter(val, to = 'text') {
        const MAP = Const.SUPPLIER.STATUS_PURCHASE_MAP;
        const COLOR_MAP = Const.SUPPLIER.STATUS_PURCHASE_COLOR_MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },
    flagSettlementFilter(val, to = 'text') {
        const MAP = Const.SUPPLIER.STATUS_SETTLEMENT_MAP;
        const COLOR_MAP = Const.SUPPLIER.STATUS_SETTLEMENT_COLOR_MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },
    supplierTypeFilter(val, to = 'text') {
        const MAP = Const.SUPPLIER.SUPPLIER_TYPE_MAP;
        const COLOR_MAP = Const.SUPPLIER.SUPPLIER_TYPE_COLOR_MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },
    /* =============== 供应商管理 ================ */

    /* =============== 物料采购 ================ */
    materialPurchaseStatusFilter(val, to = 'text') {
        const MAP = Const.MATERIAL_PURCHASE.STATUS_MAP;
        const COLOR_MAP = Const.MATERIAL_PURCHASE.STATUS_COLOR_MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },

    /* =============== 物料采购 ================ */

    /* =============== 质量反馈单 ================ */
    feedbackStatusFilter(val, to = 'key') {
        const MAP = Const.FEEDBACK.STATUS_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },
    /* =============== 质量反馈单 ================ */

    /* =============== 调货单 ================ */
    warehouseTransferStatusFilter(val, to = 'text') {
        const MAP = Const.WAREHOUSE_TRANSFER.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    transferTypeFilter(val) {
        const MAP = Const.WAREHOUSE_TRANSFER.COMMODITY_TYPE_MAP;
        return MAP[val] || '未知';
    },
    /* =============== 调货单 ================ */
    /* =============== 整车 ================ */
    entityStatusFilter(val, to = 'zh') {
        const MAP = Const.ENTITY.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 整车 ================ */
    /* =============== 整车 ================ */
    deviceStatusFilter(val, to = 'zh') {
        const MAP = Const.DEVICE.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 整车 ================ */

    /* =============== 权限 ================ */
    userAuthFilter(val, to = 'zh') {
        const MAP = Const.NOTICE.RESOURCE_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 权限 ================ */
    /* =============== CRM客户管理 ================ */
    CRMCustomerTypeFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerLevelFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.LEVEL_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerPurchaseIntentFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.PURCHASE_INTENT_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerTestDriveIntentFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.TEST_DRIVE_INTENT_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerPurchaseIntentChartFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.PURCHASE_INTENT_CHART_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerTestDriveIntentChartFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.TEST_DRIVE_INTENT_CHART_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerSourceFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.SOURCE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerIndustryFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.INDUSTRY_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerGenderFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.GENDER_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerMaritalStatusFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.MARITAL_STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTrackStatusMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.TRACK_STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCompanySizeMapMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.COMPANY_SIZE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMCustomerSourceTypeFilter(val, to = 'zh') {
        const MAP = Const.CRM_CUSTOMER.SOURCE_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },

    /* =============== CRM客户管理 ================ */

    /* =============== CRM订单管理 ================ */
    CRMOrderTypeFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMOrderStatusFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMAddressLogFilter(val, lang) {
        const addressObj = JSON.parse(val);
        const adminArea1 = addressObj.admin_area_1;
        const countryCode = addressObj.country_code;
        const addressLine1 = addressObj.address_line_1;
        const adminArea2 = addressObj.admin_area_2;
        const postalCode = addressObj.postal_code;
        if (lang === 'zh') {
            return `州/省: ${adminArea1} 国家区号: ${countryCode} 街道: ${addressLine1} 城市: ${adminArea2} 邮编: ${postalCode}`;
        } else {
            return `State: ${adminArea1} Country: ${countryCode} Street: ${addressLine1} City: ${adminArea2} Postcode: ${postalCode}`;
        }
    },
    CRMOrderIntentFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.INTENTION_STATUS;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // 性别
    CRMOrderSexFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.SEX;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // 骑行经验RidingExperience
    CRMRidingFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.RidingExperience;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // 车型
    CRMVehicleTypeFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.VehicleType;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // 是否
    CRMOrderYesNoFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.WhetherNot;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },

    /* =============== CRM订单管理 ================ */

    /* =============== CRM跟进记录 ================ */
    CRMTrackRecordFilter(val, to = 'zh') {
        const MAP = Const.CRM_TRACK_RECORD.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTrackRecordIntentFilter(val, to = 'zh', selectList) {
        /* selectList 传需要转换的数据*/
        let MAP = Const.CRM_TRACK_RECORD.INTENT_MAP;
        if (selectList) {
            MAP = selectList;
        }
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTrackChinaIntentFilter(val, to = 'zh', selectList) {
        /* selectList 传需要转换的数据*/
        let MAP = Const.CRM_TRACK_RECORD.CHINA_INTENT;
        if (selectList) {
            MAP = selectList;
        }
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM跟进记录 ================ */
    /* =============== CRM跟进团队 ================ */
    CRMGroupFilter(val, to = 'zh') {
        const MAP = Const.CRM_TRACK_MEMBER.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM跟进团队 ================ */

    /* =============== CRM回款单 ================ */
    CRMOrderIncomeStatusFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER_INCOME.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMOrderIncomeTypeFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER_INCOME.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMOrderIncomePaymentTypeFilter(val, to = 'zh') {
        const MAP = Const.CRM_ORDER_INCOME.PAYMENT_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM回款单 ================ */
    /* =============== CRM操作记录 ================ */
    CRMActionRecordTypeMapFilter(val, to = 'zh') {
        console.log(val);
        const MAP = Const.CRM_ACTION_RECORD.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM操作记录 ================ */

    /* =============== CRM商机 ================ */
    CRMBoSourceMapFilter(val, to = 'zh') {
        console.log(val);
        const MAP = Const.CRM_BO.SOURCE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMBoLostReasonFilter(val, to = 'zh') {
        console.log(val);
        const MAP = Const.CRM_BO.LOST_REASON_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM商机 ================ */

    /* =============== CRM退款记录 ================ */
    CRMRefundRecordTypeMapFilter(val, to = 'zh') {
        console.log(val);
        const MAP = Const.CRM_REFUND_RECORD.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM退款记录 ================ */

    /* =============== CRM标签 ================ */
    CRMLabelCategoryMapFilter(val, to = 'zh') {
        const MAP = Const.LABEl.CATEGORY_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM标签 ================ */

    /* =============== CRM设置 ================ */
    CRMDictTypeMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_DICT.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM设置 ================ */

    /* =============== 试驾单 ================ */
    CRMTestDriveChannelMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.CHANNEL_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveStatusMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveBuyTypeMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.BUY_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveRentalDemandMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.RENTAL_DEMAND_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveTravelRangeMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.TRAVEL_RANGE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveGreenCarOwnerMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.GREEN_CAR_OWNER_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveDriverLicenseMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.DRIVER_LICENSE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveRideExpMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.RIDE_EXP_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveMotoExpMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.MOTO_EXP_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveMotoTourIntentionMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.MOTO_TOUR_INTENTION_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDrivePayAttentionToMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.PAY_ATTENTION_TO_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveGreenEnergyUnderstandMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.GREEN_ENERGY_UNDERSTAND_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveElectricTwoWheelerUnderstandMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.ELECTRIC_TWO_WHEELER_UNDERSTAND_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMPreOrderCarTypeMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.PRE_ORDER_CAR_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveStatusCycFilter(val, to = 'zh') {
        const MAP = Const.test_drive.test_drive_status;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },

    /* =============== 试驾单 ================ */
    /* =============== 待办事项 ================ */
    CRMToDoStatusFilter(val, to = 'zh') {
        const MAP = Const.CRM_TODO.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 待办事项 ================ */
    /* =============== 测试报告 ================ */
    testCaseNameFilter(id, type) {
        const TAR = Const.TEST.TYPE_CASE_MAP[type + ''] || {};
        return TAR[id + ''] || '';
    },
    /* =============== 测试报告 ================ */

    /* =============== CRM商机 ================ */
    CRMBoSourceMapFilter(val, to = 'zh') {
        console.log(val);
        const MAP = Const.CRM_BO.SOURCE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMBoLostReasonFilter(val, to = 'zh') {
        console.log(val);
        const MAP = Const.CRM_BO.LOST_REASON_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM商机 ================ */

    /* =============== CRM退款记录 ================ */
    CRMRefundRecordTypeMapFilter(val, to = 'zh') {
        console.log(val);
        const MAP = Const.CRM_REFUND_RECORD.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM退款记录 ================ */

    /* =============== CRM标签 ================ */
    CRMLabelCategoryMapFilter(val, to = 'zh') {
        const MAP = Const.LABEl.CATEGORY_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM标签 ================ */

    /* =============== CRM设置 ================ */
    CRMDictTypeMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_DICT.TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== CRM设置 ================ */

    /* =============== 试驾单 ================ */
    CRMTestDriveChannelMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.CHANNEL_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveStatusMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveBuyTypeMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.BUY_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveRentalDemandMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.RENTAL_DEMAND_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveTravelRangeMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.TRAVEL_RANGE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveGreenCarOwnerMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.GREEN_CAR_OWNER_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveDriverLicenseMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.DRIVER_LICENSE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveRideExpMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.RIDE_EXP_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveMotoExpMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.MOTO_EXP_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveMotoTourIntentionMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.MOTO_TOUR_INTENTION_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDrivePayAttentionToMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.PAY_ATTENTION_TO_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveGreenEnergyUnderstandMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.GREEN_ENERGY_UNDERSTAND_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveElectricTwoWheelerUnderstandMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.ELECTRIC_TWO_WHEELER_UNDERSTAND_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMPreOrderCarTypeMapFilter(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.PRE_ORDER_CAR_TYPE_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveStatusCycFilter(val, to = 'zh') {
        const MAP = Const.test_drive.test_drive_status;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    CRMTestDriveSourceFilter(val, to = 'zh') {
        const MAP = Const.test_drive.appointment_channel;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 三包 ================ */
    warrantyStatusFilter(val, to = 'zh') {
        // const MAP = Const.WARRANTY.STATUS_MAP
        // const COLOR_MAP = Const.WARRANTY.STATUS_COLOR_MAP
        // switch (to) {
        //     case 'zh':
        //         let item = MAP[val + ''] || {}
        //         return item[to] || ''
        //     case 'en':
        //         let en_item = MAP[val + ''] || {}
        //         return en_item[to] || ''
        //     case 'color':
        //         return COLOR_MAP[val + ''] || 'grey'
        // }
        const MAP = Const.WARRANTY.STATUS_MAP;
        let value = MAP[val] || {};
        return value[to] || '-';
    },
    /* =============== 三包 ================ */
    /* =============== 试驾单 ================ */
    /* =============== 待办事项 ================ */
    CRMToDoStatusFilter(val, to = 'zh') {
        const MAP = Const.CRM_TODO.STATUS_MAP;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* =============== 待办事项 ================ */
    /* =============== 测试报告 ================ */
    testCaseNameFilter(id, type) {
        const TAR = Const.TEST.TYPE_CASE_MAP[type + ''] || {};
        return TAR[id + ''] || '';
    },
    /* =============== 测试报告 ================ */
    /* =============== 意向程度 ================ */
    intentionTypeFilter(val, to = 'key') {
        const MAP = Const.INTENTION.TYPE_MAP;
        switch (to) {
            case 'key':
                try {
                    return MAP[val + ''].key || {};
                } catch (error) {
                    return '';
                }
            case 'status':
                return MAP[val + ''].status || 'empty';
        }
    },
    /* =============== 意向程度 ================ */
    /* =============== 意向车辆 ================ */
    intentionCarTypeFilter(val, to = 'key') {
        const MAP = Const.INTENTION.CAR_TYPE_MAP;
        let ITEM = MAP[val + ''] || { key: '' };
        return ITEM[to] || '未知';
    },
    /* =============== 意向车辆 ================ */
    /* =============== 客户来源 ================ */
    // 客户来源
    intentionSourceTypeFilter(val, to = 'key') {
        const MAP = Const.INTENTION.SOURCE_TYPE_MAP;
        let ITEM = MAP[val + ''] || { key: '' };
        return ITEM[to] || '未知';
    },
    /* =============== 客户来源 ================ */

    /* ======== 搜索条件筛选null过滤掉去 
    * obj { uid: null, status: null }
    start========== */
    searchFilter(obj) {
        let _searchOptions = this.deepCopy(obj);
        for (let el in _searchOptions) {
            if (!_searchOptions[el]) {
                if (_searchOptions[el] === '' || _searchOptions[el] === null || _searchOptions[el] === undefined) {
                    Reflect.deleteProperty(_searchOptions, el);
                }
            }
        }
        return _searchOptions;
    },
    /* ======== 搜索条件筛选 end ========== */

    /* ======== 判断门店,分销商,零售商重置密码权限判断 start ========== */
    userAuth(...arr) {
        if (!arr.length) {
            return true;
        }
        // console.log("数据", arr);
        const rolesMap = Const.USERNAME;
        const result = arr.some(key => {
            return rolesMap[key];
        });
        // console.log("结果", result);
        return result;
    },
    /* ======== 判断门店,分销商,零售商重置密码权限判断 end ========== */

    /* ======== 传参数的时候删除自己不需要的字段 ========== */
    deleteParamsFilter(_options, deleteValue = []) {
        deleteValue.forEach(el => {
            if (Reflect.has(_options, el)) {
                Reflect.deleteProperty(_options, el);
            }
        });

        return _options;
    },
    /* ======== 传参数的时候删除自己不需要的字段 ========== */

    /* ======== 百分比 ==========
        denominator  // 分母
        numerator // 分子
    */
    percentageFilter(denominator, numerator, type = '%') {
        if (!Number(denominator)) return 0 + type;
        let result = (Number(numerator) / Number(denominator)) * 100 + type;
        return result;
    },
    /* ======== 百分比 ========== */

    /* ======== 好物订单修改记录 ========== */
    goodItemOrderUpdateRecordFilter(val, to = 'zh') {
        const MAP = Const.GOODITEMORDER.Update_Record;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* ======== 好物订单来源 ========== */
    goodSourceChannelFilter(val, to = 'zh') {
        const MAP = Const.GOODITEMORDER.Source_Channel;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /* ======== 好物订单activity_Source_Type来源 ========== */
    goodSourceTypeFilter(val, to = 'zh') {
        const MAP = Const.GOODITEMORDER.Source_Type;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /**
     * @description:字符串拼接 将后端传来的数组转换成字符串拼接
     * @param {Array} list     数组
     * @param {String} keyName 项的属性名称
     * @return {String}        逗号拼接的字符串
     */
    goodItemListFilter(list, keyName, to = 'zh') {
        if (!list?.length) {
            return '';
        }
        let str = '',
            dotext = '';
        list.forEach((item, index) => {
            if (index < list.length - 1) {
                dotext = ',';
            } else {
                dotext = '';
            }
            if (item[keyName]) {
                str += item[keyName] || '' + dotext;
            }
        });
        return str || '';
    },
    // 质检状态
    inspectionStatusColorFilter(val, to = 'text') {
        const MAP = Const.INSPECTION.STATUS_MAP;
        const COLOR_MAP = Const.INSPECTION.STATUS_COLOR_MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },
    // 门店类型
    storeType(val, to = 'zh') {
        const MAP = Const.RETAIL.STORE_TYPE;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // 门店状态
    storeSTATUS(val, to = 'zh') {
        const MAP = Const.RETAIL.STORE_STATUS;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    /**
     * 计算时间 返回days，hours, minutes
     * @param {*} startTimestamp  // 开始时间
     * @param {*} endTimestamp  // 结束时间
     */
    calculateTimeDifference(startTimestamp, endTimestamp) {
        const start = dayjs.unix(startTimestamp);
        const end = dayjs.unix(endTimestamp);

        const diffInSeconds = end.diff(start, 'second');

        const days = Math.floor(diffInSeconds / (24 * 60 * 60));
        const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);

        return { days, hours, minutes };
    },
    // 跟进方式标签状态
    tabStatus(val, to = 'zh') {
        const MAP = Const.WORK_OPERATION.FOLLOW_TYPE;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // 门店人员-职务
    peoStoreStatus(val, to = 'zh') {
        const MAP = Const.FEISHUTYPE.TYPE;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // 跟进方式标签状态
    tabTypeStatus(val, to = 'zh') {
        const MAP = Const.WORK_OPERATION.COMMUNICATE_TYPE;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // 质检方式
    inspectionTypeColorFilter(val, to = 'text') {
        const MAP = Const.INSPECTION.TYPE_MAP;
        const COLOR_MAP = Const.INSPECTION.TYPE_COLOR__MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },
    emailSubscriptionFilter(val, to = 'text') {
        const MAP = Const.SUBSCRIPTION.STATUS_MAP;
        let value = MAP[val + ''] || {};
        return value[to] || '-';
    },

    // 门店-等级方法缺失-补充
    storeLevel(val, to = 'zh') {
        const MAP = Const.RETAIL.STORE_LEVEL;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },

    // crm-订单管理-订单来源
    orderSourceType(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.SOURCE_TYPE;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },

    // crm-订单管理-订单状态
    orderManageStatus(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.Order_Status_Map;
        let item = MAP[val + ''] || {};
        return item || '';
    },
    // crm-订单管理-支付方式
    orderPaymentType(val, to = 'zh') {
        const MAP = Const.CRM_ORDER.PAYMENT_TYPE;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },
    // crm-试驾单-来源
    orderTestSourceType(val, to = 'zh') {
        const MAP = Const.CRM_TEST_DRIVE.SOURCE_TYPE;
        let item = MAP[val + ''] || {};
        return item[to] || '';
    },

    // 问卷状态
    naireStatusColorFilter(val, to = 'text') {
        const MAP = Const.QUE_NAIRE_LIST.STATUS_FILTER_MAP;
        const COLOR_MAP = Const.QUE_NAIRE_LIST.STATUS_FILTER_COLOR_MAP;
        switch (to) {
            case 'text':
                return MAP[val + ''] || '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },

    isExternal(path) {
        return /^(https?:|mailto:|tel:)/.test(path); //匹配是否是外部链接
    },
    // 商品售后-销售区域-方法
    getSalesAreaStr(arr, lang = 'zh') {
        let str = '';
        if (!(arr instanceof Array)) return '-';
        arr?.forEach(item => {
            str += (str ? ',' : '') + item[lang === 'zh' ? 'country' : 'country_en'];
        });
        return str || '-';
    },

    /**
     * 监听触底滚动
     * @param {Object} e dom
     * @param {Function} fn 回调方法
     * @param {Object} pagination 分页对象
     * @param {Boolean} scrollLoading 是否已触发
     *
     * 使用 Core.Util.scroll.handleScrollFn(e, this.getData, this.pagination, this.showLoading)
     */
    handleScrollFn(e, fn, pagination = {}, scrollLoading = false, hitBottomHeightQ = '') {
        if (!e || !fn) return;
        const hitBottomHeight = 10;
        const element = e;
        if (
            Math.ceil(element.scrollTop + element.clientHeight) >=
            element.scrollHeight - (hitBottomHeightQ || 0 + hitBottomHeight)
        ) {
            // console.log("滑到底部")
            if (pagination.page < pagination.total_page && !scrollLoading) {
                pagination.page++;
                fn({ page: pagination.page });
            }
        }
    },
    // 地域决定金额单位
    regionalUnitMoney() {
        let val = Data.getLang() || 'eur';
        return { ...Const.ORDER.AreaUnit[val] };
    },
    /**
    //  点赞数过滤 1000以内  1000=1.0k 
     * @param {String} time 时间戳
     * @typeBoolean { Boolean } 七天以上按日期显示
     * */
    goodNumber(value, dp = 1) {
        if (value < 1000) {
            return value;
        } else {
            return parseFloat(value / 1000).toFixed(dp) + 'k';
        }
    },
    auditStatusFilter(val, to = 'text', lang) {
        const MAP = Const.AUDIT_MANAGEMENT.STATUS_MAP;
        const COLOR_MAP = Const.AUDIT_MANAGEMENT.STATUS_COLOR_MAP;
        switch (to) {
            case 'text':
                const status = MAP[val + ''];
                if (status) {
                    return status[lang] || '未知';
                }
                return '未知';
            case 'color':
                return COLOR_MAP[val + ''] || 'grey';
        }
    },
    // 公共样式
    Common,
    // 照片逻辑
    Image,
    // 数字处理
    Number,
};
export default Util;

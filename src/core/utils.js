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
        if (!arr.length) { return true }
        const rolesMap = Data.getAuthority() || {};
        return arr.some(key => {
            return rolesMap[key];
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
                return target.trim()
            }
            if ( (typeof target !== 'object') || !target ) {
                return target;
            }
            for(let i= 0 ; i < copyed_objs.length; i++) {
                if (copyed_objs[i].target === target) {
                    return copyed_objs[i].copyTarget;
                }
            }
            let obj = {};
            if (Array.isArray(target)) {
                obj = [];
            }
            copyed_objs.push({ target:target, copyTarget:obj })
            Object.keys(target).forEach(key => {
                if(obj[key]){ return; }
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
        if (!obj) { return true }
        return !Object.keys(obj).length
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
            case 1: return dayjs.unix(value).format('YYYY-MM-DD HH:mm:ss');
            case 2: return dayjs.unix(value).format('YYYY-MM-DD HH:mm');
            case 3: return dayjs.unix(value).format('YYYY-MM-DD');
            case 4: return dayjs.unix(value).format('YYYY年MM月DD日');
            default: return '-';
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
            case 1: return `${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6)}`
            case 2: return `${val.slice(0,4)}-${val.slice(4,6)}`
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
    startOfTime(timestamp, to = 'date' ,type = 1) {
        timestamp = Number(timestamp)
        if (!timestamp) {
            return ''
        }
        switch (type) {
            case 1: return dayjs.unix(timestamp).startOf(to).unix();
            case 2: return dayjs(timestamp).startOf(to).unix();
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
            case 1: return dayjs.unix(timestamp).endOf(to).unix();
            case 2: return dayjs(timestamp).endOf(to).unix();
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
    countFilter(val = 0 ,divisor = 100, dp = 2, type= false) {
        if (val == 0) { return 0 }
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
        if (!value) { return '' }
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
/* =============== 数值 ================ */

/* =============== 通用过滤器 ================ */
    imageFilter(item) {
        if (!item) {
            return console.warn("imageFilter 没有找到图像")
        }
        if (typeof item !== 'string') {
            return console.warn('imageFilter 请传入字符串', item)
        }

        if (item.includes("http")) {
            return item
        } else {
            return Const.NET.FILE_URL_PREFIX + item
        }
    },

    addressFilter(obj, type = 1) {
        const province = obj.province || '';
        const city = obj.city || '';
        const county = obj.county || '';
        const detail = obj.address || '';
        if (!province && !city && !county && !detail) {
            return '-'
        }
        switch (type) {
            case 1:
                if (!province && !city && !county && !detail) return '-';
                return `${province} ${city} ${county} ${detail}`;
            case 2:
                if (!province && !city && !county) return '-';
                return `${province} ${city} ${county}`
        }
    },

    boolFlagFilter(val, name) {
        if (name) {
            switch (val) {
                case  10: return '已' + name
                case  0: return '未' + name
                default: return '未知'
            }
        } else {
            switch (val) {
                case  10: return '是'
                case -10: return '否'
                default: return '未知'
            }
        }
    },

    tableFieldsFilter(columns = [],role) {
        if (!columns.length) {
            return []
        }
        return columns.filter(item => {
            return item.role === undefined || item.role.includes(role)
        })
    },
/* =============== 通用过滤器 ================ */



}

export default Util
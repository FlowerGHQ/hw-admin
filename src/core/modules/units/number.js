import Data from "../../data";
export default {
    /**
    * @description 获取价格参数名
   */
    getPriceIndex() {
        let unit = ''
        if (Data.getCurrency() === 'EUR') {
            unit = "eur"
        } else {
            unit = "usd"
        }
        return 'fob_' + unit;
    },
    /**
    * @description 根据单位获取阶梯价格参数名
   */
    getStepPriceIndex(type = 'normal') {
        let unit = ''
        if (Data.getCurrency() === 'EUR') {
            unit = "eur"
        } else {
            unit = "usd"
        }
        if (type === 'normal') {
            return `fob_${unit}`;
        } else {
            return `fob_${type}_${unit}`;
        }
    },
    /**
    * @description 根据数量获取阶梯价格参数名
   */
    getStepPriceIndexByNums(nums = 1) {
        let unit = ''
        let type = 'normal'
        nums = Number(nums)
        if (Data.getCurrency() === 'EUR') {
            unit = "eur"
        } else {
            unit = "usd"
        }
        if (1 <= nums && 10 >= nums) {// 1<=订货量<=10(样品)
            type = "normal"
        } else if (11 <= nums && 25 >= nums) {// 11<=订货量<=25（20GP）
            type = "20gp"
        } else if (26 <= nums) {// 26<=订货量（40QH）
            type = "40qh"
        } else {// 默认(样品)
            type = "normal"
        }
        if (type === 'normal') {
            return `fob_${unit}`;
        } else {
            return `fob_${type}_${unit}`;
        }
    },
    /**
    * @description 给数字 , 分割
    * @param 数字 num
   */
    numFormat(num) {
        return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
    },
}
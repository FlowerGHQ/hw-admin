
export default {
    /**
    * @description 获取图片文件
    * @param 文件名称 file
    * @param 精确文件名称 precise_file
   */
    numFormat(num) {
        return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
    },
}
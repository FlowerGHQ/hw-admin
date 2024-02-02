const Modules = import.meta.globEager(`../../../assets/images/*/*`, { eager: true });

export default {
    /**
     * @description 查看type是否存在typeIncludes数组中
     * @param(type) 文件名称 file
     * @param(typeIncludes) 数组
     */
    returnTypeBool(type, typeIncludes) {
        let result = typeIncludes.includes(Number(type));
        return result;
    },
    /**
    * @description 返回className
    * @param(type) 
    * @param(classNames) 
    * 例子 $Util.Common.returnClassName(customerCareDetail.status, [
          {
              status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.EQUALTREATMENT,
              className: 'wait',
          },
          {
              status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.INPROCESS,
              className: 'deal',
          },
          {
              status: Core.Const.CUSTOMER_CARE.ORDER_STATUS_MAP.RESOLVED,
              className: 'success',
          },
      ]),
   */
    returnClassName(type, classNames) {
        const item = classNames.find((el) => Number(el.status) === Number(type));
        const key = item?.className;
        return key;
    },
    /**
     * @description 返回翻译的参数 { t: "common.xxx", }
     */
    returnTranslation(text, ConstData) {
        let result = ConstData[text] ? ConstData[text]?.t : "-";
        return result;
    },
};

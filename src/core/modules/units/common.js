const Modules = import.meta.globEager(`../../../assets/images/*/*`, { eager: true });

export default {
    /**
     * @description 查看type是否存在typeIncludes数组中
     * @param(type) 文件名称 file
     * @param(typeIncludes) 数组
     */
    isMember(type, typeIncludes) {
        let baseType = typeof type;
        let result = typeIncludes.includes(type);

        if (baseType === 'number') {
            result = typeIncludes.includes(Number(type));
        }

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
        const item = classNames.find(el => Number(el.status) === Number(type));
        const key = item?.className;
        return key;
    },
    /**
     * @description 返回翻译的参数 { t: "common.xxx", }
     */
    returnTranslation(text, ConstData) {
        let result = ConstData[text] ? ConstData[text]?.t : '-';
        return result;
    },
    /**
     * @description 使用正则表达式提取第一句内容
     */
    getFirstSentence(html) {
        var regex = /<[^>]+>/g; // 匹配所有标签
        var firstSentence = html.replace(regex, '').split('.')[0]; // 去除标签后按"."分隔并获取第一部分
        return firstSentence;
    },
    /**
     * @description 获取图片比例
     */
    getRatio(url) {
        return new Promise((resolve, reject) => {
            // 创建一个新的 Image() 对象
            var img = new Image();
            // 设置图片源路径
            img.src = url; // 这里需要将 image.jpg 替换为真正的图片路径
            // 当图片加载完成后触发 onload 事件
            img.onload = function () {
                resolve({
                    width: this.naturalWidth,
                    height: this.naturalHeight,
                });
            };
        });
    },
    /**
     * 传dom id
     * @param {String | Number} id
     */
    copyText(id) {
        const divElement = document.getElementById(id);
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(divElement);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
        } else {
            throw Error('No window.getSelection!');
        }
    },
    /**
     * @description 判断两个数组是否相同
     * @param { Array } arr1
     * @param { Array } arr2
     * @returns Boolean
     */
    arraysAreEqual(arr1, arr2) {
        // console.log("arr1", arr1, "arr2", arr2);
        let result = false;
        // 检查数组长度是否相等
        if (arr1.length !== arr2.length) {
            result = false;
            return result;
        }

        // 逐个比较数组元素
        result = arr1.every(el => {
            return arr2.some(ele => ele === el);
        });
        console.log('arraysAreEqual', result);

        // 所有元素都相等
        return result;
    },
};


const Modules = import.meta.globEager(`../../../assets/images/*/*`, { eager: true })

export default {
    /**
    * @description 查看type是否存在typeIncludes数组中
    * @param(type) 文件名称 file
    * @param(typeIncludes) 数组
   */
    returnTypeBool(type, typeIncludes) {  
        let result = typeIncludes.includes(Number(type))
        return result
    },
    /**
    * @description 
    * @param() 
    * @param() 
   */
    returnClassName(type, classNames) {  
        const item = classNames.find((el) => Number(el.status) === Number(type))        
        const key = item?.className        
        return key
    },
}
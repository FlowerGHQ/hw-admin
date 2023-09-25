/**
 * 创建一个文件user-center
 * 使用 USER_CENTER.name ........
*/
const modules = import.meta.glob("./*/*.js");

const constModules = {};

for (const path in modules) {
    modules[path]().then((mod) => {        
        const namespace = path.split("/")[1];
        let result = ''
        // 将 user-center 为大写英文字母 USER_CENTER
        if (namespace.includes("-")) {
            const words = namespace.split("-");
            for (let i = 0; i < words.length; i++) {
                const word = words[i];                
                const capitalizedWord = word.toUpperCase();
                result += capitalizedWord;

                if (i < words.length - 1) {
                    result += "_";
                }
            }
        } else {
            result = namespace.toUpperCase();
        }
        constModules[result] = mod.default  // 值赋值
    });
}
console.log("最终的结果", constModules);

export { constModules };

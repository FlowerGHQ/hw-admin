/**
 * 例子一
 * 第一步创建一个文件夹例如 test/ *.js  const TEST(建议这里定义的和文件夹名称一样大写字母) = { name: "测试用例" } export default TEST
 * 第二步使用 根据文件名称(编译好是大写字母)来使用 例如使用 TEST.name
 * 例子二
 * 创建了一个test-w或者test_w文件夹 const TEST_W(建议这里定义的和文件夹名称一样大写字母) = { name: "测试用例" } export default TEST_W
 * 封装好了会自己封装成这样TEST_W  使用 TEST_W.name
 */
const modules = import.meta.globEager('./*/*.js', { eager: true });

let constModules = {};

for (const path in modules) {
    const namespace = path.split('/')[1];
    let result = '';

    // 将 user-center 为大写英文字母 USER_CENTER
    if (namespace.includes('-')) {
        const words = namespace.split('-');
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const capitalizedWord = word.toUpperCase();
            result += capitalizedWord;

            if (i < words.length - 1) {
                result += '_';
            }
        }
    } else {
        result = namespace.toUpperCase();
    }
    constModules[result] = modules[path].default; // 值赋值
}

export default constModules;

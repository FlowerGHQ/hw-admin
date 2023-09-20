
const messages = {
  en: {},
  zh: {}
}
const models = import.meta.globEager(`@/lang/**/*.js`)
console.log("输出的丁峡谷", models);
Object.keys(models).forEach(key => {
  // 以文件名作为语言包的命名空间
  const namespace = key.split('/')[1]
  messages.en[namespace] = models[key].default.en
  messages.zh[namespace] = models[key].default.zh
})


export default messages
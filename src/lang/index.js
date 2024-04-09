const messages = {
    en: {},
    zh: {},
};
// const models = import.meta.glob(`@/lang/**/*.js`);
const models = import.meta.glob('../lang/**/*.js', { eager: true });

console.log(models);

Object.keys(models).forEach(key => {
    // 以文件名作为语言包的命名空间
    const namespace = key.split('/')[1];
    messages.en[namespace] = models[key].default.en;
    messages.zh[namespace] = models[key].default.zh;
});

export default messages;

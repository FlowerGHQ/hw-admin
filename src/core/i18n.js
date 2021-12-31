import { createI18n } from 'vue-i18n'

// 准备翻译的语言环境信息
const messages = {
    ch: {
        message: {
            hello: 'こんにちは、世界'
        }
    },
    en: {
        message: {
            hello: 'hello world'
        }
    },
}


const i18n = createI18n({
    locale: 'ch', // 设置地区
    messages, // 设置地区信息
})

export default i18n
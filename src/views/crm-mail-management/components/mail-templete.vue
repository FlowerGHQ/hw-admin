<template>
    <div class="mail-template">
        <div v-html="mailTemplates[type]" class="mail-content"></div>
    </div>
</template>

<script>
import { mailTemplates } from './mail-template.js';
export default {
    name: 'mailTemplete',
    components: {},
    props: {
        mailData: {
            type: Object,
        },
        // 模板类型
        type: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            mailTemplates,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.setTemplate()
    },
    methods: {
        setTemplate () {
            for(let key in this.mailData) {
                if (key === 'poster') {
                    this.setTemplateData(key, this.mailData[key], 2)
                } else if (key === 'url') {
                    this.setTemplateData(key, this.mailData[key], 3)
                } else if (key === 'qrcode') {
                    this.setTemplateData(key, this.mailData[key], 4)
                } else {
                    this.setTemplateData(key, this.mailData[key])
                }
            }
        },
        // 设置模板数据
        setTemplateData(key, data, type = 1 /* type: 1.文本内容  2.图片  3.链接  4.自定义*/) {
            const domName = `${key}_template`
            let dom = document.getElementById(domName)
            if(!data) {
                dom.style.display = 'none'
                return
            }
            if (type === 1) {
                dom.innerHTML = data
            } else if (type === 2) {
                dom.src = data
            } else if (type === 3) {
                dom.querySelector('a').href = data
            } else if (type === 4) {          
                if (data.length === 0) {
                    dom.style.display = 'none'
                    return
                }
                let result = ""
                data.forEach(el => {
                    result += `
                        <div style="text-align: center; width: 368px;">
                            <img
                                style="width: 170px; height: 170px"
                                src="${ el.img }"
                                alt=""
                            />
                            <div
                                style="
                                    color: #333;
                                    text-align: center;
                                    font-family: Montserrat;
                                    font-size: 28px; 
                                    font-weight: 400;
                                    line-height: 150%; /* 42px */
                                "
                            >
                                ${ el.introduce }
                            </div>
                        </div>
                        `
                })
                dom.innerHTML = result
                
            }
        }
    }
};
</script>

<style lang="less" scoped>
.mail-template {
    // padding: 64px;
    // background-color: #F6F6F6;
    .mail-content {
        // background-color: #FFF;
        // padding: 40px;
    }
}
</style>

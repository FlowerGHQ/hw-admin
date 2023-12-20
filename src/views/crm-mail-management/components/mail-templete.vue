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
            for(let i in this.mailData) {
                if (i === 'poster') {
                    this.setTemplateData(i, this.mailData[i], 2)
                } else {
                    this.setTemplateData(i, this.mailData[i])
                }
            }
        },
        // 设置模板数据
        setTemplateData(dataIndex, data, type = 1/* type:1.内容 2.图片 */) {
            const domName = `${dataIndex}_template`
            let dom = document.getElementById(domName)
            if (type === 1) {
                dom.innerHTML = data
            } else if (type === 2) {
                dom.src = data
            }
        }
    }
};
</script>

<style lang="less" scoped>
.mail-template {
    padding: 64px;
    background-color: #F6F6F6;
    .mail-content {
        background-color: #FFF;
        padding: 40px;
    }
}
</style>

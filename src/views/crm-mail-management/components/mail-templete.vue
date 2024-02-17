<template>
    <div class="mail-template">
        <div v-html="mailTemplates[type]" class="mail-content"></div>
    </div>
</template>

<script>
import { mailTemplates } from './mail-template.js';
import Core from '@/core';
export default {
    name: 'mailTemplete',
    components: {},
    props: {
        // 数据 key 值和html模板 id 对应关系为：id = key_template
        mailData: {
            type: Object,
        },
        // 模板类型
        type: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            mailTemplates,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.setTemplate();
    },
    methods: {
        setTemplate() {
            // 删除多余的参数
            this.filterData(this.mailData);

            for (let key in this.mailData) {
                if (key === 'poster') {
                    this.setTemplateData(key, this.mailData[key], 2);
                } else if (key === 'uri') {
                    this.setTemplateData(key, this.mailData[key], 3);
                } else if (key === 'qr_code') {
                    this.setTemplateData(key, this.mailData[key], 4);
                } else {
                    this.setTemplateData(key, this.mailData[key]);
                }
            }
        },
        // 设置模板数据
        setTemplateData(key, data, type = 1 /* type: 1.文本内容  2.图片  3.链接  4.自定义*/) {
            const domName = `${key}_template`;
            let dom = document.getElementById(domName);
            // console.log("dom", dom);

            if (!dom) return;

            if (!data) {
                dom.style.display = 'none';
                return;
            }

            if (type === 1) {
                dom.innerHTML = data;
            } else if (type === 2) {
                dom.src = data;
            } else if (type === 3) {
                dom.querySelector('a').href = data;
            } else if (type === 4) {
                if (data.length === 0 || !(data instanceof Array)) {
                    dom.style.display = 'none';
                    return;
                }
                let result = '';
                data.forEach(el => {
                    if (el.img) {
                        result += `
                            <div style="text-align: center; width: 170px;">
                                <img
                                    style="width: 170px; height: 170px; border: 1px solid #E2E2E2; padding: 5px;"
                                    src="${el.img}"
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
                                    ${el.introduce || ''}
                                </div>
                            </div>
                            `;
                    }
                });
                dom.innerHTML = result;
            }
        },
        filterData(data) {
            // 删除不需要的参数
            Core.Util.deleteParamsFilter(data, [
                'is_schedule_time',
                'qr_code1_introduce',
                'qr_code2_introduce',
                'template_param',
                'id',
                'receiver_type',
                'templat',
                'schedule_time',
            ]);

            // console.log("删除不需要的参数", data);
        },
    },
};
</script>

<style lang="less" scoped>
.mail-template {
}
</style>

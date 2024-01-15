<template>
    <a-config-provider :locale="zhCN" :autoInsertSpaceInButton='false'>
        <div id="mall-layout" :class="lang">
            <Header v-if="headAuth"></Header>
            <div class="mall-container">
                <router-view></router-view>
            </div>
            <Footer v-if="footAuth"></Footer>
        </div>
    </a-config-provider>
</template>
    
<script>
import Core from '@/core';
import Header from './components/header.vue';
import Footer from './components/footer.vue';

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            Core,
            zhCN,
            enUS,

            headAuth: false,
            footAuth: false,
            loginType: Core.Data.getLoginType(),
        };
    },
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(n) {
                let result = Core.Const.MALLHEADERAUTH.ROUTERS.find(el => {
                    return el.value == n.path
                })
                this.headAuth = result
                let target = Core.Const.MALLHEADERAUTH.FOOTER.some(el => {
                    return el.value == n.path
                });
                this.footAuth = target
            }
        },
        $lang: {
            deep: true,
            immediate: true,
            handler(n) {
                switch (n) {
                    case 'zh': this.locale = zhCN; break;
                    case 'en': this.locale = enUS; break;
                }
            }
        }
    },
    created() {
    },
    mounted() {
        this.loginType = Core.Data.getLoginType()
        if (Core.Data.getLang() === "" || Core.Data.getLang() === null) {
            Core.Data.setLang("zh")
        }
        this.$i18n.locale = Core.Data.getLang()
        this.$store.state.lang = Core.Data.getLang()

        // 监听页面窗口
        window.onresize = this.handleWindowResize
        if (window.innerWidth <= 830) {}
    },
    methods: {
        // 监听窗口变化
        handleWindowResize(e) {},
    }
};
</script>
    
<style lang="less" scoped>
#mall-layout{
    background: #F8F8F8;
    .mall-container {
        min-height: calc(100vh - var(--header-h-pc-mall)/* 页头 */ - var(--footer-h-pc-mall)/* 页尾 */);
    }
    @media (min-width: 820px) {}
    @media (max-width: 820px) {}
}
.ant-input {
    border: none;
    caret-color: red; /* 将光标颜色设为红色 */
    &:focus {
        box-shadow: none;
    }
}
input.ant-input {
    font-size: 14px;
}
.mall-layout-en {
    font-family: Montserrat;
}
</style>
<style lang="less">
#mall-layout {
    &.en * {
        font-family: Montserrat !important;
    }
}
</style>
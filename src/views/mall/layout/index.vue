<template>
    <a-config-provider :locale="zhCN" :autoInsertSpaceInButton="false">
        <div id="mall-layout" :class="lang">
            <Header v-if="headAuth"></Header>
            <div class="mall-container">
                <Breadcrumb :list="breadcrumbList"></Breadcrumb>
                <router-view :key="$route.fullPath"></router-view>
                <template v-if="totopAuth">
                    <a id="back-top" :style="{ position: upTopPosition }" @click="back2Top" v-show="showTop">
                        <svg-icon icon-class="purchase-up" class-name="back-top-icon" />
                        <svg-icon icon-class="purchase-up-color" class-name="back-top-icon-color" />
                        <p class="back-top-text">{{ $t('purchase.back_top') }}</p>
                    </a>
                </template>
            </div>
            <Footer v-if="footAuth"></Footer>
        </div>
    </a-config-provider>
</template>

<script>
import Core from '@/core';
import Header from './components/header.vue';
import Footer from './components/footer.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        SvgIcon,
    },
    data() {
        return {
            Core,
            zhCN,
            enUS,

            headAuth: false,
            footAuth: false,
            totopAuth: false,
            loginType: Core.Data.getLoginType(),
            breadcrumbList: [],
            showTop: false,
            upTopPosition: 'fixed',
        };
    },
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(n) {
                this.breadcrumbList = n.matched.slice(1, n.matched.length);
                let result = Core.Const.MALL_HEADER_AUTH.ROUTERS.find(el => {
                    return el.value == n.path;
                });
                this.headAuth = result;
                let target = Core.Const.MALL_HEADER_AUTH.FOOTER.some(el => {
                    return el.value == n.path;
                });
                this.footAuth = target;
                let totop = Core.Const.MALL_HEADER_AUTH.TOTOP.some(el => {
                    return el.value == n.path;
                });
                this.totopAuth = totop;
            },
        },
        $lang: {
            deep: true,
            immediate: true,
            handler(n) {
                switch (n) {
                    case 'zh':
                        this.locale = zhCN;
                        break;
                    case 'en':
                        this.locale = enUS;
                        break;
                }
            },
        },
    },
    created() {},
    mounted() {
        this.loginType = Core.Data.getLoginType();
        if (Core.Data.getLang() === '' || Core.Data.getLang() === null) {
            Core.Data.setLang('zh');
        }
        this.$i18n.locale = Core.Data.getLang();
        this.$store.state.lang = Core.Data.getLang();

        // 监听页面窗口
        window.onresize = this.handleWindowResize;
        if (this.totopAuth) {
            setTimeout(() => {
                this.scrollFn(); // 首次执行初始化回到顶部按钮位置
            }, 1000);
            window.addEventListener('scroll', this.scrollFn);
        }
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollFn);
    },
    methods: {
        // 监听窗口变化
        handleWindowResize(e) {},
        // 回到顶部
        back2Top() {
            const dom = document.getElementById('mall-header');
            dom.scrollIntoView({
                behavior: 'smooth',
            });
        },
        // 回到顶部按钮定位
        scrollFn() {
            const footerEl = document.querySelector('#mall-footer');
            //获取页面滚动距离
            const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const scrollBottom = scrollHeight - scrollTop - innerHeight;
            if (scrollBottom > footerEl?.clientHeight) {
                // 离开footer
                this.upTopPosition = 'fixed';
            } else {
                // 进入footer
                this.upTopPosition = 'absolute';
            }
            // 控制显隐
            if (scrollTop > 300) {
                this.showTop = true;
            } else {
                this.showTop = false;
            }
        },
    },
};
</script>

<style lang="less" scoped>
#mall-layout {
    background: #f8f8f8;

    .mall-container {
        min-height: calc(100vh - var(--header-h-pc-mall) /* 页头 */ - var(--footer-h-pc-mall) /* 页尾 */);
        position: relative;
    }

    @media (min-width: 820px) {
    }

    @media (max-width: 820px) {
    }
}

.ant-input {
    border: none;

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

#back-top {
    .flex(center, center, column);
    padding: 14px 12px 19px 12px;
    width: 80px;
    height: 80px;
    right: 80px;
    bottom: 40px;
    border: 1px solid #eee;
    background: #fff;
    cursor: pointer;
    z-index: 999;

    .back-top-icon,
    .back-top-icon-color {
        width: 32px;
        height: 32px;
    }

    .back-top-icon-color {
        display: none;
    }

    .back-top-text {
        color: #666;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        text-transform: capitalize;
        white-space: nowrap;
    }

    &:hover {
        .back-top-icon {
            display: none;
        }

        .back-top-icon-color {
            display: block;
        }

        .back-top-text {
            background: linear-gradient(100deg, #c6f 0%, #66f 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }
}
</style>
<style lang="less">
#mall-layout {
    &.en * {
        font-family: Montserrat !important;
    }

    .ant-input,
    .ant-input-number-input {
        caret-color: #c6f;
    }
}
</style>

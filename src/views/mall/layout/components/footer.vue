<template>
    <div id="mall-footer">
        <div class="content" style="height: 97px;">
            <div class="menu-one menu">
                <span class="menu-item tab-animate" v-for="(item, index) in menuListOne" :key="index" @click="routerChange(item.path)">
                    {{ $t(`mall.${item.lang}`) }}
                </span>
            </div>
        </div>
        <div class="content">
            <div class="menu">
                <!-- <span class="menu-item" v-for="(item, index) in menuList" :key="index">
                    {{ $t(`mall.${item.lang}`) }}
                </span> -->
            </div>
            <div class="about">
                <!-- {{ $t('mall.about') }} -->
                © 2023 | HORWIN Inc
            </div>
        </div>
    </div>
</template>
    
<script>
import Core from '@/core';

export default {
    components: {},
    data() {
        return {
            Core,
            menuListOne: Core.Const.LOGINMALL.FOOTERMENUONE,
            menuList: Core.Const.LOGINMALL.FOOTERMENU,
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
        // 路由跳转
        routerChange(routeUrl, item = {}, type = 1) {
            switch (type) {
                case 1:
                    this.$router.push({
                        path: routeUrl,
                        query: item
                    })
                    break;
                default:
                    break;
            }
        },
    }
};
</script>
    
<style lang="less">
#mall-footer{
    height: var(--footer-h-pc-mall);
    overflow: hidden;
    background-color: #000;
    color: #FFF;
    .content {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        .fcc(space-between);
        margin: 0 auto;
        width: 75%;
        height: 62px;
        .menu {
            .fcc();
            height: 100%;
            .menu-item {
                .fcc();
                margin-right: 40px;
                color: rgba(255, 255, 255, 0.4);
                font-family: Urbanist;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                cursor: pointer;
                &:hover {
                    color: rgba(255, 255, 255, 0.7);
                }
            }
        }
        .about {
            display: inline-block;
            color: rgba(255, 255, 255, 0.4);
            font-family: Urbanist;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }
        .menu-one {
            .menu-item {
                font-size: 14px;
                color: #FFF;
                &:hover {
                    color: #FFF;
                }
            }
        }
    }
    @media (min-width: 820px) {}
    @media (max-width: 820px) {}
}
</style>
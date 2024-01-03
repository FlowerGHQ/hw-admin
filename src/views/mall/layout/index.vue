<template>
    <a-config-provider :locale="zhCN" :autoInsertSpaceInButton='false'>
        <div id="mall-layout">
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
            openKeys: [],
            selectedKeys: [],
            passShow: false,
            user: Core.Data.getUser() || {},
            form: {
                id: '',
                password: '',
                new_password: '',
                old_password: '',
            },
            unread: {
                master: '',
                org: '',
            },
            tabPosition: 1, // 顶部的 销售 售后 生产 CRM权限
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
        routerChange(type) {
            let routeUrl = ''
            switch (type) {
                case 'notice':        //系统
                    routeUrl = this.$router.resolve({
                        path: "/system/notice-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'shop_cart':
                    routeUrl = this.$router.resolve({
                        path: "/purchase/item-collect",
                    })
                    window.open(routeUrl.href, '_self')
                    break;

            }
        },
        getUnreadCount() {    // 获取 未读消息数 数据
            let CATEGORY = Core.Const.NOTICE.CATEGORY
            Core.Api.Notice.list({
                category: CATEGORY.ORG
            }).then(res => {
                this.unread.org = res.un_count;
            }).catch(err => {
                console.log('getUnreadCount err', err)
            })
            Core.Api.Notice.list({
                category: CATEGORY.MASTER
            }).then(res => {
                this.unread.master = res.un_count;
            }).catch(err => {
                console.log('getUnreadCount err', err)
            })
        },
        handleLink(path) {
            this.$router.push(path);
        },

        handleLogout() {           
            this.$router.replace('/login');
            localStorage.clear()
            Core.Api.Common.logout()
        },

        handleEditShow() {
            this.passShow = true;
        },
        handleEditClose() {
            this.passShow = false;
            this.form = {
                id: '',
                password: '',
                new_password: '',
                old_password: '',
            }
        },
        handleEditSubmit() {
            let form = Core.Util.deepCopy(this.form)
            console.log('handleLogin form:', form)
            if (!form.old_password) {
                return this.$message.warning(this.$t('u.old_password'))
            }
            if (!form.password) {
                return this.$message.warning(this.$t('u.new_password'))
            }
            if (!form.new_password) {
                return this.$message.warning(this.$t('u.again'))
            }
            if (this.form.new_password !== this.form.password) {
                this.$message.warning(this.$t('u.not'))
                return
            }

            this.loading = true;
            Core.Api.Common.updatePwd(this.form).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.handleEditClose();
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        // 中英文切换
        handleLangSwitch() {
            console.log('handleLangSwitch')
            this.$store.commit('switchLang')
            this.$i18n.locale = this.$store.state.lang
            console.log('this.$i18n.locale', this.$i18n.locale)
        },

        // 监听窗口变化
        handleWindowResize(e) {},
    }
};
</script>
    
<style lang="less">
#mall-layout{
    background: #F8F8F8;
    .mall-container {
        min-height: calc(100vh - var(--header-h-pc-mall)/* 页头 */ - var(--footer-h-pc-mall)/* 页尾 */);
        margin: 0 auto;
        max-width: 1440px;
    }
    @media (min-width: 820px) {}
    @media (max-width: 820px) {}
}
</style>
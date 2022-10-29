<template>
<a-config-provider :locale="zhCN" :autoInsertSpaceInButton='false'>
    <a-layout id="Layout">
        <a-layout-header class="layout-header">
            <div class="header-left"  :class="{'collapsed': collapsed}">
                <img src="@images/header-logo3.png" class="logo" @click="collapsed = !collapsed" alt="浩万"/>

            </div>
            <div class="header-left"  :class="{'collapsed': collapsed}" v-if="loginType === Core.Const.USER.TYPE.ADMIN">
                <a-radio-group v-model:value="tabPosition" @change="handleRouterSwitch">
                    <a-radio-button class="header-button" :value="ROUTER_TYPE.SALES"><img src="@images/router_type_3.png" class="router-type" alt="浩万"/>{{ $t('n.sales') }}</a-radio-button>
                    <a-radio-button class="header-button" :value="ROUTER_TYPE.AFTER"><img src="@images/router_type_2.png" class="router-type" alt="浩万"/>{{ $t('n.after') }}</a-radio-button>
                    <a-radio-button class="header-button" :value="ROUTER_TYPE.PRODUCTION"><img src="@images/router_type_4.png" class="router-type" alt="浩万"/>{{ $t('n.production') }}</a-radio-button>
                    <a-radio-button class="header-button" :value="ROUTER_TYPE.CRM"><img src="@images/router_type_1.png" class="router-type" alt="浩万"/>{{ $t('n.crm') }}</a-radio-button>
                </a-radio-group>
            </div>

            <div class="header-right">
<!--                <a-button type="link" @click="routerChange('shop_cart')"><i class="icon i_cart"/></a-button>-->
                <a-button class="lang-switch" type="link"  @click="handleLangSwitch">
                    <i class="icon" :class="lang =='zh' ? 'i_zh-en' : 'i_en-zh'"/>
                </a-button>
                <a-divider type="vertical"/>
                <a-button class="notice" type="link">
                    <a-badge :count="unread.org + unread.master"  @click="routerChange('notice')">
                        <i class="icon i_notify" />
                    </a-badge>
                </a-button>
                <a-divider type="vertical"/>
                <a-tag color="blue" style="font-size: 12px;">{{ USER_TYPE[loginType][$i18n.locale] }}</a-tag>
<!--                <a-divider type="vertical"/>-->
                <a-dropdown :trigger="['click']" overlay-class-name='account-action-menu'>
                    <a-button class="user-info" type="link">
                        <a-avatar class="user-avatar" :src="$Util.imageFilter(user.avatar, 3)" :size='30'>
                            <template #icon><i  class="icon i_user"/></template>
                        </a-avatar>
                        <span class="user-name">{{ user.name }}</span>
                    </a-button>
                    <template #overlay>
                        <a-menu style="text-align: center;">
                            <a-menu-item @click="handleEditShow">
                                <a-button type="link"  class="menu-item-btn">{{ $t('n.password') }}</a-button>
                                <a-modal v-model:visible="passShow" :title="$t('n.password')" class="password-edit-modal" :after-close="handleEditClose">
                                    <div class="form-title">
                                        <div class="form-item required">
                                            <div class="key">{{ $t('n.old') }}:</div>
                                            <div class="value">
                                                <a-input-password :placeholder="$t('def.input')" v-model:value="form.old_password" />
                                            </div>
                                        </div>
                                        <div class="form-item required">
                                            <div class="key">{{ $t('n.new') }}:</div>
                                            <div class="value">
                                                <a-input-password v-model:value="form.password" :placeholder="$t('def.input')" />
                                            </div>
                                        </div>
                                        <div class="form-item required">
                                            <div class="key">{{ $t('n.double') }}:</div>
                                            <div class="value">
                                                <a-input-password v-model:value="form.new_password" :placeholder="$t('n.double')" />
                                            </div>
                                        </div>
                                    </div>
                                    <template #footer>
                                        <a-button key="back" @click="handleEditSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                                        <a-button @click="passShow=false">{{ $t('def.cancel') }}</a-button>
                                    </template>
                                </a-modal>
                            </a-menu-item>
                            <a-menu-item  @click="handleLogout">
                                <a-button type="link" class="menu-item-btn">{{ $t('n.exit') }}</a-button>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </a-layout-header>
        <a-layout class="layout-container">
            <a-layout-sider class="layout-sider" v-model:collapsed="collapsed" :width="144" :collapsedWidth='64' theme='light'>
                <a-menu theme="light" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline"
                    :inlineCollapsed='collapsed' :inlineIndent='8'>
                    <template v-for="item of showList">
                        <a-menu-item :key="item.path" v-if="$auth(...item.auth) && item.not_sub_menu" @click="handleLink(item.path)">
                            <i class='icon' :class="item.meta.icon"/>
                            <span :class="{'collapsed-title': collapsed}">{{ item.meta.title }}</span>
                        </a-menu-item>
                        <a-sub-menu :key="item.path" v-else-if="$auth(...item.auth)">
                            <template #title>
                                <i class='icon' :class="item.meta.icon"/>
                                <span v-show="!collapsed">{{ lang =='zh' ? item.meta.title : item.meta.title_en }}</span>
                            </template>
                            <template v-for="i of item.children">
                                <template v-if="$auth(...i.auth)">
                                    <a-menu-item :key="item.path + '/' + i.path" @click="handleLink(item.path + '/' + i.path)">
                                        <span>{{ lang =='zh' ? i.meta.title : i.meta.title_en }}</span>
                                    </a-menu-item>
                                </template>
                            </template>
                        </a-sub-menu>
                    </template>
                </a-menu>
            </a-layout-sider>
            <a-layout class="layout-main" :class="{longer: collapsed}">
                <!-- <MyBreadcrumb class="layout-breadcrumb"/> -->
                <a-layout-content class="layout-content">
                    <router-view></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</a-config-provider>
</template>

<script>
import Core from '../../core';
import {SIDER} from '../../router/routes';

import MyBreadcrumb from './components/Breadcrumb.vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';

export default {
    components: {
        MyBreadcrumb,
    },
    data() {
        return {
            Core,
            zhCN,
            enUS,
            breadcrumbList: [],

            loginType: Core.Data.getLoginType(),
            USER_TYPE: Core.Const.USER.TYPE_MAP,
            ROUTER_TYPE: Core.Const.LOGIN.ROUTER_TYPE,
            collapsed: false,
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
            tabPosition: 1

        };
    },
    computed: {
        showList() {
            let showList
            let LOGIN_TYPE = Core.Const.USER.TYPE
            switch (this.loginType) {
                case LOGIN_TYPE.ADMIN: showList = SIDER.ADMIN; break;
                case LOGIN_TYPE.DISTRIBUTOR: showList = SIDER.DISTRIBUTOR; break;
                case LOGIN_TYPE.AGENT: showList = SIDER.AGENT; break;
                case LOGIN_TYPE.STORE: showList = SIDER.STORE; break;
            }
            showList.forEach(item => {
                item.auth = item.meta ? (item.meta.auth || []) : [];
                item.not_sub_menu = item.meta ? (item.meta.not_sub_menu || false) : false;
                item.children = item.children.map(i => {
                    i.auth = i.meta ? (i.meta.auth || []) : [];
                    return i
                })
            })
            // 选择模块进行路由过滤
            if (this.loginType === LOGIN_TYPE.ADMIN){
                let newShowList = []
                SIDER.ADMIN.forEach(item => {
                    if (item.type != undefined ? item.type.indexOf(this.tabPosition) != -1: true){
                        newShowList.push(item)
                    }
                })
                showList = newShowList;
            }
            console.log('computed showList:', showList)
            return showList
        },
        lang() {
            return this.$store.state.lang
        }
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(n) {
                let meta = n.meta || {}
                console.log('watch $route:', n)
                let not_sub_menu = n.matched.length > 1 ? n.matched[0].meta.not_sub_menu : n.meta.not_sub_menu
                let is_sp = n.matched.length > 1 ? n.matched[0].meta.sp : n.meta.sp
                console.log('is_sp:', is_sp)
                let path = n.path.split('/').slice(1)

                if (n.meta.parent) {
                    this.selectedKeys = [n.meta.parent]
                } else if (not_sub_menu && !is_sp) {
                    this.selectedKeys = ['/' + path[0]]
                } else {
                    this.selectedKeys = [n.fullPath]
                }
                console.log('this.selectedKeys:', this.selectedKeys)

                if (!meta.hidden || (this.breadcrumbList[0] && this.breadcrumbList[0].key !== path[0])) {
                    this.breadcrumbList = [{text: meta.title, path: n.path, key: path[0]}]
                } else {
                    this.breadcrumbList.push({text: meta.title, path: n.path, key: path[0]})
                }
                console.log('this.breadcrumbList:', this.breadcrumbList)
            }
        },
        $lang: {
            deep: true,
            immediate: true,
            handler(n) {
                console.log('watch $lang:', n)
                switch (n) {
                    case 'zh': this.locale = zhCN; break;
                    case 'en': this.locale = enUS; break;
                }
                console.log('this.locale:', this.locale)
            }
        }
    },
    created() {
    },
    mounted() {
        this.loginType = Core.Data.getLoginType()
        this.getUnreadCount();
        this.$i18n.locale = Core.Data.getLang()
        this.$store.state.lang = Core.Data.getLang()
        this.tabPosition = Core.Data.getTabPosition() || 1
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
                console.log('getUnreadCount res: ORG', res)
                this.unread.org = res.un_count;
            }).catch(err => {
                console.log('getUnreadCount err', err)
            })
            Core.Api.Notice.list({
                category: CATEGORY.MASTER
            }).then(res => {
                console.log('getUnreadCount res: MASTER', res)
                this.unread.master = res.un_count;
            }).catch(err => {
                console.log('getUnreadCount err', err)
            })
        },
        handleLink(path) {
            this.$router.push(path);
        },

        handleLogout() {
            Core.Data.setUser('');
            Core.Data.setAuthority('');
            this.$router.replace('/login');
            Core.Api.Common.logout().finally(() => {
                Core.Data.setToken('');
            });
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
            console.log('this.$i18n.locale',this.$i18n.locale)
        },
        handleRouterSwitch() {
            console.log("tabPosition",this.tabPosition)
            Core.Data.setTabPosition(this.tabPosition)
        },
    }
};
</script>

<style lang="less">
.ant-menu-inline-collapsed-tooltip {
    i.icon {
        display: none;
    }
}

.account-action-menu {
    ul.ant-dropdown-menu {
        width: 100px;
    }
}

#Layout {
    background: @BG_body;
    height: 100vh;

    .layout-header {
        height: 64px;
        background: #FFFFFF;
        border-bottom: 1px solid rgba(82, 91, 103, 0.2);
        padding: 0 20px;
        .fsb();

        .header-left {
            .fcc();
            img.logo {
                width: 115px;
                height: 30px;
            }
            .router-type{
                width: 30px;
                height: 30px;
                margin-top: -5px;
                margin-right: 10px;

            }
            .header-button{
                padding-top: 5px;
                height: 40px;
                border: 0px;
                padding-left: 20px;
                padding-right: 20px;
                text-align: center;
                align-items: center;
                .ant-radio-button-wrapper{
                    display:none;
                }
            }
            .ant-radio-button-wrapper:focus{
                border: 0px;
            }
            .ant-radio-button-wrapper:not(:first-child)::before {
                border: 0px solid #d9d9d9;
                border-radius: 2px 0 0 2px;
                background: #fff;
            }
            .ant-radio-button-wrapper-checked {
                background-color: #F3F6F8;
                border: 0px;
            }

        }

        .header-right {
            .fcc();
            .notice {
                width: 50px;
                height: 50px;
            }
            .lang-switch {
                .icon {
                    font-size: 20px;
                }
            }
        }

        .user-info {
            height: 100%;
            .fac();

            &:hover .user-name {
                color: @TC_P;
            }

            .icon.i_user {
                margin: 0;
            }
        }

        .user-name {
            margin-left: 10px;
            color: @TC_header_name;
        }

        .header-right {
            height: 100%;
            cursor: pointer;
            .fjc();

            i.icon {
                font-size: 14px;
            }
            i.i_cart {
                font-size: 25px;
                color: @TC_header_item;
            }

            //&:hover i.i_cart {
            //    color: @TC_P;
            //}
            //&:hover i.i_notify {
            //    color: @TC_P;
            //}
        }
    }

    .layout-container {
        height: calc(~'100% - 50px');
    }

    .layout-sider {
        height: 100%;

        .ant-menu-root {
            .no-select();
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            padding: 12px 10px 0;
            overflow-y: auto;
            overflow-x: hidden;
            background-color: transparent;
            border-right: 0;

            &::-webkit-scrollbar {
                width: 2px;
                height: 6px;

                &-thumb {
                    border-radius: 3px;
                    background-color: @scrollbar-thumb;
                    transition: background-color 0.3s;

                    &:hover {
                        background: @scrollbar-thumb-hover;
                    }
                }

                &-track {
                    background: @scrollbar-track;
                }
            }
        }

        .ant-menu {
            .ant-menu-title-content {
                font-size: 12px;
                font-weight: 400;
                color: #8090A6;

                i.icon {
                    font-size: 14px;
                    color: #B9C6DD;
                    margin-right: 10px;
                }
            }

            .ant-menu-item {
                margin: 0;
                padding-right: 6px;
                border-radius: 4px;
                box-shadow: 0 0 0 0;

                &::after {
                    display: none;
                }

                &:hover {
                    background-color: #F2F8FF;
                }

                &.ant-menu-item-selected {
                    background-color: @BG_P;

                    .ant-menu-title-content {
                        color: @TC_InP;

                        i.icon {
                            color: @TC_InP;
                        }
                    }
                }
            }

            .ant-menu-submenu {
                border-radius: 6px;

                .ant-menu-submenu-title {
                    border-radius: 4px;
                    padding-right: 6px;
                    margin: 0;
                    box-shadow: 0 0 0 0;

                    &:hover {
                        background-color: #F2F8FF;
                    }

                    .ant-menu-submenu-arrow {
                        color: #6E7C94;
                        font-size: 12px;
                        right: 8px;
                        transform: translateY(3px);

                        &::after, &::before {
                            height: 1px;
                        }
                    }
                }

                .ant-menu-sub {
                    background-color: transparent;

                    .ant-menu-title-content {
                        padding-left: 16px;
                    }
                }

                &.ant-menu-submenu-open {
                    background-color: #F3F6F8;

                    .ant-menu-submenu-arrow {
                        transform: translateY(-1px);
                    }
                }
            }
        }

        .ant-menu-inline-collapsed {
            .ant-menu-item {
                .collapsed-title {
                    display: none;
                }
            }
        }
    }

    // .layout-breadcrumb {
    // }

    .layout-content {
        padding: 16px;
        box-sizing: border-box;
        height: 100%;
        // height: calc(~"100% - 38px");
        overflow-y: auto;
    }
}
</style>

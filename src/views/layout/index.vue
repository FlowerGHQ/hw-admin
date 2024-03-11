<template>
    <a-config-provider :locale="zhCN" :autoInsertSpaceInButton="false">
        <!-- 头部布局 -->
        <a-layout id="Layout" :class="lang">
            <a-layout-header class="layout-header">
                <div class="header-left" :class="{ collapsed: collapsed }">
                    <img src="@images/header-logo2.png" class="logo" @click="collapsed = !collapsed" alt="浩万" />
                </div>
                <div class="header-center" v-if="loginType === Core.Const.USER.TYPE.ADMIN">
                    <a-radio-group v-model:value="tabPosition" @change="handleRouterSwitch">
                        <a-radio-button
                            v-for="item in moduleAuthList"
                            :key="item.id"
                            class="header-button"
                            :value="item.value"
                        >
                            <div class="router-type"><img :src="item.img" alt="" />{{ $t(item.t) }}</div>
                        </a-radio-button>
                    </a-radio-group>
                </div>
                <div class="header-right">
                    <a-button class="lang-switch" type="link" @click="handleLangSwitch(lang == 'zh' ? 'en' : 'zh')">
                        <i class="icon" :class="lang == 'zh' ? 'i_zh-en' : 'i_en-zh'" />
                    </a-button>
                    <a-divider type="vertical" />
                    <a-button class="notice PC" type="link">
                        <a-badge :count="unread.org + unread.master" @click="routerChange('notice')">
                            <i class="icon i_notify" />
                        </a-badge>
                    </a-button>
                    <a-divider class="PC" type="vertical" />
                    <a-tag class="PC" color="blue" style="font-size: 12px">{{
                        USER_TYPE[loginType][$i18n.locale]
                    }}</a-tag>
                    <a-dropdown :trigger="['click']" overlay-class-name="account-action-menu">
                        <a-button class="user-info" type="link">
                            <a-avatar class="user-avatar PC" :src="$Util.imageFilter(user.avatar, 3)" :size="30">
                                <template #icon><i class="icon i_user" /></template>
                            </a-avatar>
                            <span class="user-name">{{ user.name }}</span>
                        </a-button>

                        <template #overlay>
                            <a-menu style="text-align: center">
                                <a-menu-item @click="handleEditShow">
                                    <a-button type="link" class="menu-item-btn">{{
                                        $t('n.password') /*修改密码*/
                                    }}</a-button>
                                </a-menu-item>
                                <a-menu-item @click="$router.push('/login')" v-if="user_type_list.length > 1">
                                    <a-button type="link" class="menu-item-btn">{{
                                        $t('mall.switch_identity') /*切换身份*/
                                    }}</a-button>
                                </a-menu-item>
                                <a-menu-divider class="menu_divider" v-if="user_type_list.length > 1" />
                                <a-menu-item @click="handleLogout">
                                    <a-button type="link" class="menu-item-btn">{{ $t('n.exit') /*退出*/ }}</a-button>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </a-layout-header>
            <!-- 内容区域 -->
            <a-layout class="layout-container">
                <a-layout-sider
                    class="layout-sider"
                    v-model:collapsed="collapsed"
                    :width="200"
                    :collapsedWidth="64"
                    theme="light"
                >
                    <a-menu
                        theme="light"
                        v-model:openKeys="openKeys"
                        v-model:selectedKeys="selectedKeys"
                        mode="inline"
                        :inlineCollapsed="collapsed"
                        :inlineIndent="8"
                    >
                        <template v-for="item of showList">
                            <!-- 这个是只有当个导航栏 -->
                            <a-menu-item v-if="item.not_sub_menu" :key="item.path" @click="handleLink(item.path)">
                                <i class="icon" :class="item.meta.icon" />
                                <span :class="{ 'collapsed-title': collapsed }">{{
                                    lang == 'zh' ? item.meta.title : item.meta.title_en
                                }}</span>
                            </a-menu-item>
                            <!-- 有二级导航栏的 -->
                            <a-sub-menu v-else :key="item.path">
                                <template #title>
                                    <i class="icon" :class="item.meta.icon" />
                                    <span v-show="!collapsed">
                                        {{ lang == 'zh' ? item.meta.title : item.meta.title_en }}
                                    </span>
                                </template>
                                <template v-for="i of item.children">
                                    <template
                                        v-if="
                                            $auth(...i.auth) && isExistArr(i.meta?.admin_module, tabPosition)
                                            /*判断子children meta.admin_module admin中四大模块*/
                                        "
                                    >
                                        <a-menu-item
                                            :key="item.path + '/' + i.path"
                                            @click="handleLink(item.path + '/' + i.path)"
                                        >
                                            <span>{{ lang == 'zh' ? i.meta.title : i.meta.title_en }}</span>
                                        </a-menu-item>
                                    </template>
                                </template>
                            </a-sub-menu>
                        </template>
                    </a-menu>
                </a-layout-sider>
                <a-layout class="layout-main" :class="{ longer: collapsed }">
                    <!-- <MyBreadcrumb class="layout-breadcrumb"/> 面包屑没用上-->
                    <a-layout-content class="layout-content">
                        <router-view></router-view>
                    </a-layout-content>
                </a-layout>
            </a-layout>
        </a-layout>

        <!-- 修改密码弹窗 -->
        <a-modal
            v-model:visible="passShow"
            :title="$t('n.password')"
            class="password-edit-modal"
            :after-close="handleEditClose"
        >
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
                <a-button @click="passShow = false">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </a-config-provider>
</template>

<script>
import Core from '../../core';
import { SIDER } from '../../router/routes';

import MyBreadcrumb from './components/Breadcrumb.vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';
const ROUTER_TYPE = Core.Const.LOGIN.ROUTER_TYPE;

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
            ROUTER_TYPE,
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
            tabPosition: 1, // 顶部的 销售 售后 生产 CRM权限
            user_type_list: [],
            authFirst: Core.Data.getAuthFirst() || [], // 判断 CRM等模块的谁在第一
            moduleAuth: [
                {
                    id: 1,
                    value: ROUTER_TYPE.SALES,
                    img: Core.Util.Image.getImageFile('router', 'router_type_3'),
                    t: 'n.sales',
                },
                {
                    id: 2,
                    value: ROUTER_TYPE.AFTER,
                    img: Core.Util.Image.getImageFile('router', 'router_type_2'),
                    t: 'n.after',
                },
                {
                    id: 3,
                    value: ROUTER_TYPE.PRODUCTION,
                    img: Core.Util.Image.getImageFile('router', 'router_type_4'),
                    t: 'n.production',
                },
                {
                    id: 4,
                    value: ROUTER_TYPE.SUPPLIER,
                    img: Core.Util.Image.getImageFile('router', 'router_type_5'),
                    t: 'n.supplier',
                },
                {
                    id: 5,
                    value: ROUTER_TYPE.CRM,
                    img: Core.Util.Image.getImageFile('router', 'router_type_1'),
                    t: 'n.crm',
                },
                {
                    id: 7,
                    value: ROUTER_TYPE.FINANCE,
                    img: Core.Util.Image.getImageFile('router', 'router_type_1'),
                    t: 'payment-management.finance',
                },
                {
                    id: 6,
                    value: ROUTER_TYPE.SYSTEM,
                    img: Core.Util.Image.getImageFile('router', 'router_type_1'),
                    t: 'n.system_management',
                },
            ],
        };
    },
    provide() {
        return {
            setIndex: this.setIndex,
        };
    },
    computed: {
        showList() {
            let showList;
            let LOGIN_TYPE = Core.Const.USER.TYPE;
            switch (this.loginType) {
                case LOGIN_TYPE.ADMIN:
                    showList = SIDER.ADMIN;
                    break;
                case LOGIN_TYPE.DISTRIBUTOR:
                    showList = SIDER.DISTRIBUTOR;
                    break;
                case LOGIN_TYPE.AGENT:
                    showList = SIDER.AGENT;
                    break;
                case LOGIN_TYPE.STORE:
                    showList = SIDER.STORE;
                    break;
            }
            showList.forEach(item => {
                item.auth = item.meta ? item.meta.auth || [] : [];
                item.not_sub_menu = item.meta ? item.meta.not_sub_menu || false : false;
                if (item.children) {
                    item.children = item.children.map(i => {
                        i.auth = i.meta ? i.meta.auth || [] : [];
                        return i;
                    });
                }
            });

            // 选择模块进行路由过滤ADMIN的时候的权限
            if (this.loginType === LOGIN_TYPE.ADMIN) {
                let newShowList = [];
                SIDER.ADMIN.forEach(item => {
                    if (item.type != undefined ? item.type.indexOf(this.tabPosition) != -1 : true) {
                        newShowList.push(item);
                    }
                });

                showList = newShowList;

                // 是否只在超级管理员显示，普通平台方不展示
                if (!Core.Data.getManager()) {
                    let superList = Core.Util.deepCopy(showList); // 为了防止影响之前的数据
                    let result = superList.filter(first => {
                        let firstMeta = first.meta;
                        if (first.children) {
                            let children = first.children.filter(second => {
                                let secondMeta = second.meta;
                                return !secondMeta.super_admin_show;
                            });
                            first.children = children;
                        }
                        return !firstMeta.super_admin_show;
                    });

                    showList = result;
                }
            }

            return showList.filter(el => this.$auth(...el.auth));
        },
        lang() {
            return this.$store.state.lang;
        },
        moduleAuthList() {
            // 纯展示的显示模块有哪些
            const arr = [];
            this.moduleAuth.forEach(el => {
                const find = this.authFirst.find(item => el.value == item.tabPosition);
                if (find) {
                    arr.push(el);
                }
            });

            console.log('moduleAuth', arr);

            return arr;
        },
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(n) {
                console.log('输出的路由', n);
                let meta = n.meta || {};
                let not_sub_menu = n.matched.length > 1 ? n.matched[0].meta.not_sub_menu : n.meta.not_sub_menu;

                let path = n.path.split('/').slice(1);

                if (n.meta.parent) {
                    this.selectedKeys = [this.getPathNoQuery(n.meta.parent)];
                } else if (not_sub_menu) {
                    this.selectedKeys = [this.getPathNoQuery('/' + path[0])];
                } else {
                    this.selectedKeys = [this.getPathNoQuery(n.fullPath)]; // 例如 '/distributor/purchase-order-list'
                }

                this.openKeys = [`/${path[0]}`];

                if (!meta.hidden || (this.breadcrumbList[0] && this.breadcrumbList[0].key !== path[0])) {
                    this.breadcrumbList = [{ text: meta.title, path: n.path, key: path[0] }];
                } else {
                    this.breadcrumbList.push({ text: meta.title, path: n.path, key: path[0] });
                }

                // 登录页面走过来在执行
                if (n.query.from) {
                    if (this.loginType === Core.Const.USER.TYPE.ADMIN) {
                        // 平台方执行
                        this.returnAdminFilter(ROUTER_TYPE.SALES);
                        this.returnAdminFilter(ROUTER_TYPE.AFTER);
                        this.returnAdminFilter(ROUTER_TYPE.PRODUCTION);
                        this.returnAdminFilter(ROUTER_TYPE.SUPPLIER);
                        this.returnAdminFilter(ROUTER_TYPE.CRM);
                        this.returnAdminFilter(ROUTER_TYPE.SYSTEM);
                        this.returnAdminFilter(ROUTER_TYPE.FINANCE);
                    }
                }
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
    created() {
        this.user_type_list = Core.Data.getUserTypeList();
    },
    mounted() {
        this.loginType = Core.Data.getLoginType();
        console.log(this.loginType);
        this.getUnreadCount();
        if (Core.Data.getLang() === '' || Core.Data.getLang() === null) {
            Core.Data.setLang('zh');
        }
        this.$i18n.locale = Core.Data.getLang();
        this.$store.state.lang = Core.Data.getLang();
        this.tabPosition = Core.Data.getTabPosition() || 1;

        // 监听页面窗口
        window.onresize = this.handleWindowResize;
        if (window.innerWidth <= 830) {
            this.collapsed = true;
        }
    },
    methods: {
        routerChange(type) {
            let routeUrl = '';
            switch (type) {
                case 'notice': //系统
                    routeUrl = this.$router.resolve({
                        path: '/system/notice-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'shop_cart':
                    routeUrl = this.$router.resolve({
                        path: '/mall/shopping-bag',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getUnreadCount() {
            // 获取 未读消息数 数据
            let CATEGORY = Core.Const.NOTICE.CATEGORY;
            Core.Api.Notice.list({
                category: CATEGORY.ORG,
            })
                .then(res => {
                    this.unread.org = res.un_count;
                })
                .catch(err => {
                    console.log('getUnreadCount err', err);
                });
            Core.Api.Notice.list({
                category: CATEGORY.MASTER,
            })
                .then(res => {
                    this.unread.master = res.un_count;
                })
                .catch(err => {
                    console.log('getUnreadCount err', err);
                });
        },
        handleLink(path) {
            this.$router.push(path);
        },

        handleLogout() {
            Core.Api.Common.logout().then(() => {
                Core.Data.clearSpecificItem();
                if (Number(Core.Data.getLoginType()) === Core.Const.USER.TYPE.SUPPLIER) {
                    this.$router.replace(`/login?user_type=${Core.Data.getLoginType()}`);
                } else {
                    this.$router.replace(`/login`);
                }
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
            };
        },
        handleEditSubmit() {
            let form = Core.Util.deepCopy(this.form);
            console.log('handleLogin form:', form);
            if (!form.old_password) {
                return this.$message.warning(this.$t('u.old_password'));
            }
            if (!form.password) {
                return this.$message.warning(this.$t('u.new_password'));
            }
            if (!form.new_password) {
                return this.$message.warning(this.$t('u.again'));
            }
            if (this.form.new_password !== this.form.password) {
                this.$message.warning(this.$t('u.not'));
                return;
            }

            this.loading = true;
            Core.Api.Common.updatePwd(this.form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleEditClose();
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },

        // 中英文切换
        handleLangSwitch(lang) {
            console.log('handleLangSwitch');
            this.$store.commit('switchLang', lang);
            this.$i18n.locale = this.$store.state.lang;
            console.log('this.$i18n.locale', this.$i18n.locale);
        },
        // 切换顶部的 销售 售后 生产 CRM权限操作
        handleRouterSwitch() {
            if (Core.Data.getTabPosition() === this.tabPosition) {
                return;
            }
            Core.Data.setTabPosition(this.tabPosition);

            // console.log('获取路由列表第一个的跳转', this.showList[0]?.path);
            switch (this.tabPosition) {
                case this.ROUTER_TYPE.SALES:
                    this.$router.replace({ path: this.showList[0]?.path });
                    break;
                case this.ROUTER_TYPE.AFTER:
                    this.$router.replace({ path: this.showList[0]?.path });
                    break;
                case this.ROUTER_TYPE.PRODUCTION:
                    this.$router.replace({ path: this.showList[0]?.path });
                    break;
                case this.ROUTER_TYPE.CRM:
                    this.$router.replace({ path: this.showList[0]?.path });
                    break;
                case this.ROUTER_TYPE.SUPPLIER:
                    this.$router.replace({ path: this.showList[0]?.path });
                    break;
                case this.ROUTER_TYPE.SYSTEM:
                    console.log(this.showList);
                    this.$router.replace({ path: this.showList[0]?.path });
                    break;
                case this.ROUTER_TYPE.FINANCE:
                    console.log(this.showList);
                    this.$router.replace({ path: this.showList[0]?.path });
                    break;
                default:
                    break;
            }
        },
        // 判断顶部的 销售/售后/生产/CRM/供应链 路口显示(根据底下是否有路由)
        returnAdminFilter(tabPosition, data = SIDER.ADMIN) {
            let result = undefined;

            result = data.find(el => {
                if (el.type?.includes(tabPosition)) {
                    if (el.meta?.auth) {
                        return this.$auth(...el.meta?.auth);
                    } else {
                        return true;
                    }
                }
            });

            if (result) {
                this.authFirst.push({ tabPosition, path: result.path });
                // 对象去重
                this.authFirst = Array.from(
                    this.authFirst.reduce((map, item) => map.set(item.tabPosition, item), new Map()).values(),
                ).sort((a, b) => a.tabPosition - b.tabPosition);

                console.log('returnAdminFilter', this.authFirst);
                this.tabPosition = this.authFirst[0].tabPosition;
                Core.Data.setTabPosition(this.authFirst[0].tabPosition);
                Core.Data.setAuthFirst(this.authFirst);

                if (this.authFirst[0].path) {
                    this.$router.replace({ path: this.authFirst[0]?.path });
                }
            }

            return result;
        },

        // 监听窗口变化
        handleWindowResize(e) {
            if (window.innerWidth <= 830) {
                this.collapsed = true;
            } else {
                this.collapsed = false;
            }
        },
        setIndex(tabPosition, selectedKeys) {
            this.tabPosition = tabPosition;
            this.selectedKeys = selectedKeys;
            Core.Data.setTabPosition(this.tabPosition);
        },
        // 获取无参数路径
        getPathNoQuery(path) {
            return path.split('?')[0];
        },
        // 判断一个值是否在这个数组中
        isExistArr(arr, value) {
            if (!arr) return true; // 默认arr不传 全部显示
            // 传了arr 数据走下面逻辑
            const Arr = arr || [];
            const result = Arr.includes(value);
            return result; // true为显示 false 为不显示
        },
    },
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
        background: #ffffff;
        border-bottom: 1px solid rgba(82, 91, 103, 0.2);
        padding: 0 20px;
        .fsb();

        .header-left {
            .fcc();

            img.logo {
                height: 34px;
                cursor: pointer;
            }
        }

        .header-center {
            .fcc();

            .header-button {
                height: 40px;
                border: 0px;
                padding: 0 10px;
                text-align: center;
                align-items: center;

                .ant-radio-button-wrapper {
                    display: none;
                }
            }

            .router-type {
                height: 100%;
                width: 100%;
                .fcc();

                img {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }
            }

            .ant-radio-button-wrapper:focus {
                border: 0px;
            }

            .ant-radio-button-wrapper:not(:first-child)::before {
                border: 0px solid #d9d9d9;
                border-radius: 2px 0 0 2px;
                background: #fff;
            }

            .ant-radio-button-wrapper-checked {
                background-color: #f3f6f8;
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
    }

    .layout-container {
        height: calc(~'100% - 64px');
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
                // color: #8090A6;

                i.icon {
                    font-size: 14px;
                    // color: #B9C6DD;
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
                    background-color: rgba(0, 0, 0, 0.06);
                }

                &.ant-menu-item-selected {
                    background-color: #e6f7ff;

                    // .ant-menu-title-content {
                    //     color: @TC_InP;

                    //     i.icon {
                    //         color: @TC_InP;
                    //     }
                    // }
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
                        background-color: #f2f8ff;
                    }

                    .ant-menu-submenu-arrow {
                        // color: #6E7C94;
                        font-size: 12px;
                        right: 8px;
                        // transform: translateY(3px);

                        &::after,
                        &::before {
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
            }

            .ant-menu-submenu-selected .ant-menu-submenu-title .ant-menu-submenu-arrow {
                color: #1890ff;
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
        padding-right: 10px;
        box-sizing: border-box;
        height: 100%;
        // height: calc(~"100% - 38px");
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #6e7c94;
            border-radius: 3px;
        }
    }

    @media (min-width: 820px) {
    }

    @media (max-width: 820px) {
        .layout-header {
            .header-center {
                .header-button {
                    padding: 2px 10px;

                    .router-type {
                        flex-direction: column;
                        font-size: 10px;
                        line-height: 1;

                        img {
                            margin: 0 5px;
                            width: 26px;
                            height: 26px;
                        }
                    }
                }
            }
        }
    }
}

.transform-scale-95 {
    transform: scale(0.95);
}
</style>

<template>
    <a-config-provider :locale="zhCN" :autoInsertSpaceInButton="false">
        <!-- 头部布局 -->
        <a-layout id="Layout" :class="lang">
            <a-layout-header class="layout-header">
                <div class="header-left" :class="{ collapsed: collapsed }">
                    <img src="@images/header-logo2.png" class="logo" @click="collapsed = !collapsed" alt="浩万" />
                </div>
                <!-- tab切换 -->
                <div v-if="$auth('ADMIN')" class="header-center">
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
                    <a-tag class="PC" color="blue" style="font-size: 12px">
                        {{ USER_TYPE[loginType][$i18n.locale] }}
                    </a-tag>
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
                                    <a-button type="link" class="menu-item-btn">
                                        {{ $t('n.password') /*修改密码*/ }}
                                    </a-button>
                                </a-menu-item>
                                <a-menu-item @click="$router.push('/login')" v-if="user_type_list.length > 1">
                                    <a-button type="link" class="menu-item-btn">
                                        {{ $t('mall.switch_identity') /*切换身份*/ }}
                                    </a-button>
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
                            <!-- 这个是只有单个导航栏 -->
                            <a-menu-item v-if="item.not_sub_menu" :key="item.path" @click="handleLink(item.path)">
                                <i class="icon" :class="item.meta.icon" />
                                <span :class="{ 'collapsed-title': collapsed }">
                                    {{ lang == 'zh' ? item.meta.title : item.meta.title_en }}
                                </span>
                            </a-menu-item>
                            <!-- 有二级导航栏的 -->
                            <a-sub-menu v-else :key="item.path">
                                <template #title>
                                    <i class="icon" :class="item.meta.icon" />
                                    <span v-show="!collapsed">
                                        {{ lang == 'zh' ? item.meta.title : item.meta.title_en }}
                                    </span>
                                </template>
                                <a-menu-item
                                    v-for="i of item.children"
                                    :key="item.path + '/' + i.path"
                                    @click="handleLink(item.path + '/' + i.path)"
                                >
                                    <span>{{ lang == 'zh' ? i.meta.title : i.meta.title_en }}</span>
                                </a-menu-item>
                            </a-sub-menu>
                        </template>
                    </a-menu>
                </a-layout-sider>
                <a-layout class="layout-main" :class="{ longer: collapsed }">
                    <a-layout-content class="layout-content">
                        <router-view :key="tabPosition"></router-view>
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
const MODULEAUTH = Core.Const.SYSTEM_AUTH.MODULEAUTH;
const ROUTER_TYPE_MAP = Core.Const.SYSTEM_AUTH.ROUTER_TYPE_MAP;

export default {
    components: {
        MyBreadcrumb,
    },
    data() {
        return {
            Core,
            zhCN,
            enUS,

            loginType: Core.Data.getLoginType(),
            USER_TYPE: Core.Const.USER.TYPE_MAP,
            ROUTER_TYPE_MAP,
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
            tabPosition: null, // { tabPosition: 1, path: '' } tab和path 顶部的 销售 售后 生产 CRM权限
            user_type_list: [],
            moduleAuth: MODULEAUTH,
            moduleAuthList: null,
            showList: null,
        };
    },
    provide() {
        return {
            setIndex: this.setIndex,
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
                console.log('输出的路由', n);
                let meta = n.meta || {};
                let not_sub_menu = n.matched.length > 1 ? n.matched[0].meta.not_sub_menu : meta.not_sub_menu;

                let path = n.path.split('/').slice(1);
                console.log('path', path);
                if (meta.parent) {
                    this.selectedKeys = [this.getPathNoQuery(meta.parent)];
                } else if (not_sub_menu) {
                    this.selectedKeys = [this.getPathNoQuery('/' + path[0])];
                } else {
                    this.selectedKeys = [this.getPathNoQuery(n.fullPath)]; // 例如 '/distributor/purchase-order-list'
                }
                this.openKeys = [`/${path[0]}`];
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
        this.handleInitRouter();
    },
    mounted() {
        this.loginType = Core.Data.getLoginType();
        this.getUnreadCount();
        if (Core.Data.getLang() === '' || Core.Data.getLang() === null) {
            Core.Data.setLang('zh');
        }
        this.$i18n.locale = Core.Data.getLang();
        this.$store.state.lang = Core.Data.getLang();

        // 监听页面窗口
        window.onresize = this.handleWindowResize;
        if (window.innerWidth <= 830) {
            this.collapsed = true;
        }
    },
    unmounted() {
        console.log('销毁');
        this.$store.commit('ADMIN_AUTH_TAB/SETTABPOSITION', null);
        this.$store.commit('ADMIN_AUTH_TAB/SETSHOWCLASSIFY', null);
    },
    methods: {
        // 将路由分类
        handleInitRouter() {
            let showClassify = {};
            let routeList = [];
            let LOGIN_TYPE = Core.Const.USER.TYPE;
            switch (this.loginType) {
                case LOGIN_TYPE.ADMIN:
                    routeList = SIDER.ADMIN;
                    break;
                case LOGIN_TYPE.DISTRIBUTOR:
                    routeList = SIDER.DISTRIBUTOR;
                    break;
                case LOGIN_TYPE.AGENT:
                    routeList = SIDER.AGENT;
                    break;
                case LOGIN_TYPE.STORE:
                    routeList = SIDER.STORE;
                    break;
            }

            // 这里操作相当于把meta中的数据拿到外面来
            routeList.forEach(item => {
                item.auth = item.meta ? item.meta.auth || [] : [];
                item.not_sub_menu = item.meta ? item.meta.not_sub_menu || false : false;
                if (item.children) {
                    item.children = item.children.map(i => {
                        i.auth = i.meta ? i.meta.auth || [] : [];
                        return i;
                    });
                }
            });

            // 过滤掉 路由不在 全局（authority.list）中的
            routeList = this.handleUnAuthListFilter(Core.Util.deepCopy(routeList));

            // 平台方过滤数据
            if (this.loginType === LOGIN_TYPE.ADMIN) {
                routeList.forEach(el => {
                    el.auth?.forEach(authItem => {
                        let parts = authItem.split('.')[0];
                        if (parts !== 'MANAGER') {
                            if (showClassify[parts]?.length > 0) {
                                showClassify[parts].push(...this.handleAdminRouter(parts, [el]))
                            } else {
                                showClassify[parts] = this.handleAdminRouter(parts, [el]);
                            }
                        }
                    });
                });                
                this.$store.commit('ADMIN_AUTH_TAB/SETSHOWCLASSIFY', showClassify);

                this.moduleAuthList = this.handleModuleAuthList(Object.keys(showClassify));
            } else {
                this.showList = routeList;
                this.$store.commit('ADMIN_AUTH_TAB/SETSHOWCLASSIFY', routeList);
            }
        },
        // 模块切换
        handleGetModule() {            
            let showClassify = this.$store.state.ADMIN_AUTH_TAB.SHOWCLASSIFY;
            let KEY = ROUTER_TYPE_MAP[this.tabPosition]?.KEY;
            if (KEY) {
                this.showList = showClassify[KEY];
            }
        },
        handleModuleAuthList(routerArr) {
            const arr = [];
            this.moduleAuth.forEach(el => {
                // 根据权限判断顶部是否存在
                if (routerArr.includes(el.key)) {
                    arr.push(el);
                }
            });

            // 判断本地是否存在tabValue不存在赋值
            if (!this.$store.state.ADMIN_AUTH_TAB.TABPOSITION) {
                this.tabPosition = arr[0].value;
                this.handleGetModule();

                console.log('第一次进入跳转', this.showList);

                try {
                    this.routerReplace()
                    this.$store.commit('ADMIN_AUTH_TAB/SETTABPOSITION', {
                        tabPosition: this.tabPosition,
                        path: this.showList[0]?.path,
                    });
                } catch (error) {
                    console.log('error', error);
                }
            } else {
                this.tabPosition = this.$store.state.ADMIN_AUTH_TAB.TABPOSITION;
                this.handleGetModule();
            }

            return arr;
        },
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
            this.$store.commit('ADMIN_AUTH_TAB/SETTABPOSITION', { tabPosition: this.tabPosition, path: path });
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
        handleRouterSwitch(e) {
            this.handleGetModule();
            if (this.$store.state.ADMIN_AUTH_TAB.TABPOSITION === this.tabPosition) {
                return;
            }
            
            this.routerReplace()
            this.$store.commit('ADMIN_AUTH_TAB/SETTABPOSITION', {
                tabPosition: this.tabPosition,
                path: this.showList[0]?.path,
            });
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
            this.$store.commit('ADMIN_AUTH_TAB/SETTABPOSITION', { tabPosition: this.tabPosition, path: selectedKeys });
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

        // adminRouter过滤
        handleAdminRouter(KEY, LIST) {
            let routeList = Core.Util.deepCopy(LIST);
            let newShowList = [];

            const adminTemplateFilter = list => {
                let result = [];
                result = list.filter(el => {
                    let someResult = el.auth?.some((authItem, index) => {
                        let parts = authItem.split('.')[0];
                        // 根据模块过滤掉 和 管理员的权限
                        return (
                            (parts === KEY && this.$auth(authItem)) || (authItem === 'MANAGER' && this.$auth('MANAGER'))
                        );
                    });
                    if (el.children?.length) {
                        el.children = adminTemplateFilter(el.children);
                    }
                    return someResult;
                });
                return result;
            };
            // 防止影响ADMIN数据
            newShowList = adminTemplateFilter(routeList);

            return newShowList;
        },

        // 过滤掉 路由不在 全局（authority.list）中的
        handleUnAuthListFilter(list) {
            let result = [];
            result = list.filter(el => {
                if (el.children?.length) {
                    el.children = this.handleUnAuthListFilter(el.children);
                }
                return this.$auth(...el.auth);
            });
            return result;
        },

        // 路由替换
        routerReplace() {
            console.log("使用");
            let path = this.showList[0]?.path
            let subPath = this.showList[0].children?.length ? '/' + this.showList[0].children[0].path : ''
            
            this.$router.replace({ path: path + subPath });
        }
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

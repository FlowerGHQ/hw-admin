<template>
<a-layout id="Layout">
    <a-layout-header class="layout-header">
        <div class="header-logo" @click="collapsed = !collapsed" :class="{'collapsed': collapsed}">
            <img src="@images/header-logo.png" alt="浩万" />
        </div>
        <div class="header-right">
            <a-dropdown :trigger="['click']" overlay-class-name='account-action-menu'>
                <a-button class="user-info" type="link">
                    <a-avatar class="user-avatar" :src="$Util.imageFilter(user.avatar)" :size='30'>
                        <i class="icon i_user"/>
                    </a-avatar>
                    <span class="user-name">{{user.username}}</span>
                </a-button>
                <template #overlay>
                    <a-menu style="text-align: center;">
                        <a-menu-item>
                            <a-button type="link" @click="handleLogout" class="menu-item-btn">退 出</a-button>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </a-layout-header>
    <a-layout class="layout-container" :class="{longer: collapsed}">
        <a-layout-sider class="layout-sider" v-model="collapsed" width="144px" theme='light'>
            <a-menu theme="light" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" :inlineCollapsed='collapsed'>
                <template v-for="item of showList">
                    <a-menu-item :key="item.path" v-if="$auth(...item.auth) && item.children.length === 1" @click="handleLink(item.path)" >
                        <i class='icon' :class="item.meta.icon"/>
                        <span :class="{'collapsed-title': collapsed}">{{item.meta.title}}</span>
                    </a-menu-item>
                    <a-sub-menu :key="item.path" v-else-if="$auth(...item.auth)">
                        <template #title>
                            <i class='icon' :class="item.meta.icon"/>
                            <span v-show="!collapsed">{{item.meta.title}}</span>
                        </template>
                        <template v-for="i of item.children">
                            <template v-if="!i.hidden && $auth(...i.auth)">
                                <a-menu-item :key="item.path + '/' + i.path"
                                    @click="handleLink(item.path + '/' + i.path)" v-if="showMenuItem(i)">
                                    <span>{{i.meta.title}}</span>
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
</template>

<script>
import Core from '../../core';
import routes from '@/router/routes';
import MyBreadcrumb from './components/Breadcrumb.vue'
export default {
    components: {
        MyBreadcrumb,
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),

            collapsed: false,
            openKeys: [],
            selectedKeys: [],

            user: Core.Data.getUser() || {}
        };
    },
    computed: {
        showList() {
            let showList = routes.filter((item) => {
                const roles = item.meta ? item.meta.roles : '';
                return roles ? (roles.includes(this.loginType) && !item.hidden) : !item.hidden;
            });
            showList.forEach(item => {
                item.auth = item.meta ? (item.meta.auth || []) : [];
                item.children = item.children.filter((i) => {
                    const roles = i.meta ? i.meta.roles : '';
                    return roles ? (roles.includes(this.loginType) && !i.hidden) : !i.hidden;
                });
                item.children = item.children.map(i => {
                    i.auth = i.meta ? (i.meta.auth || []) : [];
                    return i
                })
            })
            console.log('showList:', showList)
            return showList
        },
    },
    watch: {
        $route: {
            deep: true,
            handler(n) {
                console.log('n:', n)
                let is_sub_menu = n.meta ? n.meta.is_sub_menu : false
                let path = n.path.split('/').slice(1)
                if (is_sub_menu) {
                    this.selectedKeys = [n.fullPath]
                } else {
                    this.selectedKeys = ['/' + path[0]]
                }
                console.log('this.selectedKeys:', this.selectedKeys)
            }
        }
    },
    created() {
        for (const item of routes) {
            if (item.hidden || item.children.length === 1) {
                continue;
            }
            for (const i of item.children) {
                if (item.path + '/' + i.path === this.$route.path) {
                    this.openKeys = [item.path];
                    break;
                }
            }
        }
        this.selectedKeys = ['/' + this.$route.path.split('/')[1]];
    },
    mounted() {
        this.$auth('MANMGE')
    },
    methods: {
        handleLink(path) {
            this.$router.push(path);
        },
        showMenuItem(i) {
            const roles = i.meta ? i.meta.roles : '';
            return roles ? !i.hidden && roles.includes(this.loginType) : !i.hidden;
        },

        handleLogout() {
            Core.Data.setUser('');
            Core.Data.setAuthority('');
            this.$router.replace('/login');
            Core.Api.Common.logout();
            Core.Data.setToken('');
        },
    }
};
</script>

<style lang="less">
/* #layout-container {
    background: @BG_body;
    .layout-sider {
        width: 144px;
        overflow-y: auto;
        overflow-x: hidden;
        height: 100vh;
        position: fixed;
        left: 0;
        z-index: 1;
        background: @BG_side;
        box-shadow: 2px 0px 6px 0px @BG_shadow;
        .logo {
            background: @BG_side_logo;
            width: 100%;
            height: 64px;
            display: flex;
            align-items: center;
            overflow: hidden;
            cursor: pointer;
            img {
                max-width: calc(~"100% - 60px");
                margin-left: 30px;
            }
            .title {
                font-size: 20px;
                font-weight: 500;
                color: @TC_L;
                margin-left: 30px;
            }
            &.collapsed {
                justify-content: center;
                img {
                    max-width: 100%;
                    margin-left: 0;
                }
                .title {
                    margin: 0 auto;
                    font-size: 16px;
                }
            }
        }
        .ant-menu {
            .no-select();
            height: calc(~"100% - 64px");
            overflow-y: auto;
            overflow-x: hidden;
            background-color: transparent;
            border-right: 0;
            &.ant-menu-inline {
                border-right: 0;
                .ant-menu-item,
                .ant-menu-submenu-title {
                    width: 100%;
                }
            }
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

            .ant-menu-item {
                height: 50px;
                line-height: 50px;
                margin: 0;
                background: transparent;
                color: @TC_L_T;
                &::after {
                    display: none;
                }
                &:hover, &-active, &-selected {
                    color: @TC_L;
                }
            }
            .ant-menu-submenu {
                &-title {
                    color: @TC_L_T;
                    margin: 0;
                    height: 50px;
                    line-height: 50px;
                }
                &-title:hover, &-active, &-selected {
                    color: @TC_L;
                }
            }
            i.ant-menu-submenu-arrow {
                &::before, &::after {
                    background: @TC_L_T;
                }
            }

            &:not(.ant-menu-inline) .ant-menu-submenu-open {
                color: @TC_L;
            }
            i.icon {
                margin-right: 10px;
                font-size: 14px;
                &.i_s_design {
                    font-size: 13px;
                }
            }
            .collapsed-title {
                padding-left: 24px;
            }
        }
    }
    .layout-main {
        height: 100vh;
        margin-left: 144px;
        width: calc(~"100% - 144px");
        .layout-header {
            .fsb();
            padding: 0 20px;
            height: 64px;
            width: calc(~"100% - 144px");
            background: @BG_N;
            box-shadow: 0px 1px 4px 0px @BG_shadow;
            padding: 0 24px;
            box-sizing: border-box;
            position: fixed;
            z-index: 10;

            .header-right {
                .fac();
                height: 100%;
                .user-info {
                    height: 100%;
                    .fac();
                    &:hover .user-name {
                        color: @TC_P;
                    }
                }
                .user-name {
                    margin-left: 10px;
                    color: @TC_header_name;
                }
                .header-item {
                    width: 64px;
                    height: 100%;
                    cursor: pointer;
                    .fjc();
                    i.icon {
                        font-size: 14px;
                        color: @TC_header_item;
                    }
                    &:hover i.icon {
                        color: @TC_P;
                    }
                }
            }
        }
        .layout-content {
            min-width: 768px;
            margin-top: 60px;
            height: calc(~"100% - 64px");
            overflow-y: auto;
            overflow-x: auto;
            .main-container {
                padding: 24px;
                min-height: 100px;
                min-width: 500px;
            }
        }
        &.longer {
            margin-left: 80px;
            width: calc(~"100% - 80px");
            .layout-header {
                width: calc(~"100% - 80px");
            }
        }
    }
} */
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
        height: 50px;
        background: #FFFFFF;
        border-bottom: 1px solid rgba(82, 91, 103, 0.2);
        padding: 0 20px;
        .fsb();
        .header-logo {
            img {
                width: 115px;
                height: 30px;
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
        .header-item {
            width: 64px;
            height: 100%;
            cursor: pointer;
            .fjc();
            i.icon {
                font-size: 14px;
                color: @TC_header_item;
            }
            &:hover i.icon {
                color: @TC_P;
            }
        }
    }
    .layout-container {
        height: calc(~'100% - 50px');
    }
    .layout-sider {
        height: 100%;
    }
    .layout-breadcrumb {

    }
    .layout-content {
        padding: 16px;
        box-sizing: border-box;
        height: 100%;
        // height: calc(~"100% - 38px");
        overflow-y: auto;
    }
}
</style>
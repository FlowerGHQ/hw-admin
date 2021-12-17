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
    <a-layout class="layout-container">
        <a-layout-sider class="layout-sider" v-model:collapsed="collapsed" :width="144" :collapsedWidth='64' theme='light'>
            <a-menu theme="light" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" :inlineCollapsed='collapsed' :inlineIndent='8'>
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
            immediate: true,
            handler(n) {
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
    },
    mounted() {
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
            Core.Api.Common.logout().finally(() => {
                Core.Data.setToken('');
            });
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
        .ant-menu-root {
            .no-select();
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            padding: 0 10px;
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
                &::after { display: none; }
                &.ant-menu-item-selected, &:hover {
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
                    .ant-menu-submenu-arrow {
                        color: #6E7C94;
                        font-size: 12px;
                        right: 8px;
                        transform: translateY(3px);
                        &::after, &::before {
                            height: 1px;
                        }
                    }
                    &:hover {
                        background-color: @BG_P;
                        .ant-menu-submenu-arrow {
                            color: @TC_InP;
                        }
                        .ant-menu-title-content {
                            color: @TC_InP;
                            i.icon {
                                color: @TC_InP;
                            }
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
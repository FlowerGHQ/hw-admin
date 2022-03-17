<template>
<a-config-provider :locale="lang == 'zh' ? zhCN : enUS" :autoInsertSpaceInButton='false'>
    <a-layout id="Layout">
        <a-layout-header class="layout-header">
            <div class="header-left" @click="collapsed = !collapsed" :class="{'collapsed': collapsed}">
                <img src="@images/header-logo.png" class="logo" alt="浩万"/>
                <a-divider type="vertical"/>
                <a-tag color="blue" style="font-size: 12px;">{{ USER_TYPE[loginType] }}端</a-tag>
            </div>
            <div class="header-right">
                <!-- <a-button class="lang-switch" type="link"  @click="handleLangSwitch">
                    <i class="icon" :class="lang =='zh' ? 'i_zh-en' : 'i_en-zh'"/>
                </a-button> -->
                <a-divider type="vertical"/>
                <a-button class="notice" type="link">
                    <a-badge :count="un_count"  @click="routerChange('notice')">
                        <i class="icon i_notify" />
                    </a-badge>
                </a-button>
                <a-divider type="vertical"/>
                <a-dropdown :trigger="['click']" overlay-class-name='account-action-menu'>
                    <a-button class="user-info" type="link">
                        <a-avatar class="user-avatar" :src="$Util.imageFilter(user.avatar, 3)" :size='30'>
                            <template #icon><i  class="icon i_user"/></template>
                        </a-avatar>
                        <span class="user-name">{{ user.name }}</span>
                    </a-button>
                    <template #overlay>
                        <a-menu style="text-align: center;">
                            <a-menu-item>
                                <a-button type="link" @click="handleEditShow" class="menu-item-btn">修改密码</a-button>
                                <a-modal v-model:visible="passShow" title="修改密码" class="password-edit-modal" :after-close="handleEditClose">
                                    <div class="form-title">
                                        <div class="form-item required">
                                            <div class="key">旧密码:</div>
                                            <div class="value">
                                                <a-input-password placeholder='请输入旧密码' v-model:value="form.old_password" />
                                            </div>
                                        </div>
                                        <div class="form-item required">
                                            <div class="key">新密码:</div>
                                            <div class="value">
                                                <a-input-password v-model:value="form.password" placeholder="请输入新密码" />
                                            </div>
                                        </div>
                                        <div class="form-item required">
                                            <div class="key">再次确认:</div>
                                            <div class="value">
                                                <a-input-password v-model:value="form.new_password" placeholder="请再次确认密码" />
                                            </div>
                                        </div>
                                    </div>
                                    <template #footer>
                                        <a-button key="back" @click="handleEditSubmit" type="primary">确定</a-button>
                                        <a-button @click="passShow=false">取消</a-button>
                                    </template>
                                </a-modal>
                            </a-menu-item>
                            <a-menu-item>
                                <a-button type="link" @click="handleLogout" class="menu-item-btn">退 出</a-button>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </a-layout-header>
        <a-layout class="layout-container">
            <a-layout-sider class="layout-sider" v-model:collapsed="collapsed" :width="144" :collapsedWidth='64'
                            theme='light'>
                <a-menu theme="light" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline"
                        :inlineCollapsed='collapsed' :inlineIndent='8'>
                    <template v-for="item of showList">
                        <a-menu-item :key="item.path" v-if="$auth(...item.auth) && item.children.length === 1" @click="handleLink(item.path)">
                            <i class='icon' :class="item.meta.icon"/>
                            <span :class="{'collapsed-title': collapsed}">{{ item.meta.title }}</span>
                        </a-menu-item>
                        <a-sub-menu :key="item.path" v-else-if="$auth(...item.auth)">
                            <template #title>
                                <i class='icon' :class="item.meta.icon"/>
                                <span v-show="!collapsed">{{ item.meta.title }}</span>
                            </template>
                            <template v-for="i of item.children">
                                <template v-if="!i.hidden && $auth(...i.auth)">
                                    <a-menu-item :key="item.path + '/' + i.path" @click="handleLink(item.path + '/' + i.path)" v-if="showMenuItem(i)">
                                        <span>{{ i.meta.title }}</span>
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
import routes from '../../router/routes';

import MyBreadcrumb from './components/Breadcrumb.vue';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';

export default {
    components: {
        MyBreadcrumb,
    },
    data() {
        return {
            zhCN,
            enUS,

            loginType: Core.Data.getLoginType(),
            USER_TYPE: Core.Const.USER.TYPE_MAP,
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
            un_count: '', //未读消息存放数量
        };
    },
    computed: {
        showList() {
            // console.log('computed routes:', routes)
            let showList = routes.filter((item) => {
                // console.log('this.loginType:', this.loginType)
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
                n = n.redirectedFrom ? n.redirectedFrom : n
                let is_sub_menu = n.meta ? n.meta.is_sub_menu : false
                let path = n.path.split('/').slice(1)
                this.selectedKeys = is_sub_menu ? [n.fullPath] : ['/' + path[0]]
                console.log('this.selectedKeys:', this.selectedKeys)
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
        // console.log('created routes:', routes)
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
        // console.log('created routes:', routes)
    },
    mounted() {
        // this.getTableData();
        this.getUnreadCount();
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
            }
        },
        getUnreadCount() {    // 获取 未读消息数 数据
            Core.Api.Notice.list().then(res => {
                console.log("getNoticeData res", res)
                this.un_count = res.un_count;
            }).catch(err => {
                console.log('getNoticeData err', err)
            })
        },
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
                return this.$message.warning('请输入旧密码')
            }
            if (!form.password) {
                return this.$message.warning('请输入新密码')
            }
            if (!form.new_password) {
                return this.$message.warning('请再次确认密码')
            }
            if (this.form.new_password !== this.form.password) {
                this.$message.warning('两次密码输入不一致')
                return
            }

            this.loading = true;
            Core.Api.Common.updatePwd(this.form).then(() => {
                this.$message.success('保存成功')
                this.handleEditClose();
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        // 中英文切换
        handleLangSwitch() {
            this.$store.commit('switchLang')
            this.$i18n.locale = this.$store.state.lang
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

        .header-left {
            .fcc();
            img.logo {
                width: 115px;
                height: 30px;
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
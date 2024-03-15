<template>
    <div id="Login">
        <div class="login-header">
            <span class="text">{{ $t('n.system') }}</span>
            <div class="header-right">
                <a-button class="lang-switch" type="link" @click="handleLangSwitch(lang == 'zh' ? 'en' : 'zh')">
                    <i class="icon" :class="lang == 'zh' ? 'i_zh-en' : 'i_en-zh'" />
                </a-button>
            </div>
        </div>
        <div class="login-container">
            <div class="form-title">{{ $t('n.account_login') }}</div>
            <div class="form-content">
                <div class="login-type" :class="TYPE_MAP[loginForm.user_type]">
                    <div
                        class="type-item"
                        v-for="item of loginTypeList"
                        :key="item.value"
                        :class="loginForm.user_type === item.value ? 'active' : ''"
                        @click="loginForm.user_type = item.value"
                    >
                        {{ item[$i18n.locale] }}
                    </div>
                </div>
                <!-- 供应商 页面用手机号 -->
                <template v-if="loginForm.user_type === TYPE.SUPPLIER">
                    <a-input
                        class="form-item"
                        :placeholder="$t('n.enter') + $t('n.phone')"
                        v-model:value="supplierLoginForm.phone"
                        @keydown.enter="handleFocusCode"
                    >
                        <template #prefix>
                            <i class="icon i_shouji placeholder" />
                        </template>
                    </a-input>
                    <div class="supplier-code">
                        <a-input
                            class="form-item code-form-item"
                            :placeholder="$t('n.verification_code')"
                            v-model:value="supplierLoginForm.code"
                            ref="code-input"
                            @keydown.enter="handleLogin('supplier')"
                        >
                        </a-input>
                        <div class="get-code-text" ref="get-code" @click="onGetCode">
                            {{ $t('supply-chain.access_code') }}
                        </div>
                    </div>
                    <a-button class="form-button" type="primary" @click="handleLogin('supplier')">{{
                        $t('n.login')
                    }}</a-button>
                </template>
                <!-- 其他平台 -->
                <template v-else>
                    <a-input
                        class="form-item"
                        :placeholder="$t('n.username')"
                        v-model:value="loginForm.username"
                        @keydown.enter="handleFocusPwd"
                    >
                        <template #prefix>
                            <i class="icon i_user placeholder" />
                        </template>
                    </a-input>
                    <a-input
                        class="form-item"
                        :placeholder="$t('n.enter_password')"
                        v-model:value="loginForm.password"
                        @keydown.enter="handleLogin"
                        type="password"
                        ref="password-input"
                    >
                        <template #prefix>
                            <i class="icon i_lock placeholder" />
                        </template>
                    </a-input>
                    <a-button class="form-button" type="primary" @click="handleLogin">{{ $t('n.login') }}</a-button>
                </template>
            </div>
        </div>
        <div class="login-footer">Copyright © 2019-2022 常州浩万新能源科技有限公司 苏ICP备2022002975号-2</div>
    </div>
</template>

<script>
import Core from '../core';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';
import jsapi from '../core/jsapi';
const TYPE = Core.Const.LOGIN.TYPE;
const TYPE_MAP = Core.Const.LOGIN.TYPE_MAP;
export default {
    name: 'Login',
    components: {},
    props: {},
    data() {
        return {
            zhCN,
            enUS,
            TYPE,
            TYPE_MAP,
            loginTypeList: Core.Const.LOGIN.TYPE_LIST,

            loginForm: {
                username: '',
                password: '',
                user_type: 10,
            },
            // 供应商form
            supplierLoginForm: {
                phone: '',
                code: '',
            },
            user: {},
            countdown: 60, // 倒计时
            countdownTime: null, // 定时器记录
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    created() {
        if (Core.Data.getLang() === '' || Core.Data.getLang() === null) {
            Core.Data.setLang('zh');
        }
        // 初始化看选中哪个登录方
        this.loginForm.user_type = Core.Data.getLoginType() || TYPE.ADMIN;
    },
    mounted() {
        this.fsLogin();
    },
    unmounted() {
        clearInterval(this.countdownTime);
        this.countdownTime = null;
    },
    methods: {
        /* Fetch start*/
        // 检查是否是超级管理员
        isAdminFetch(parmas) {
            // 分销商不调用
            if (Core.Data.getLoginType() === Core.Const.USER.TYPE.DISTRIBUTOR) return;
            let obj = {
                ...parmas,
            };
            Core.Api.User.checkAdmin(obj)
                .then(res => {
                    Core.Logger.log('参数', obj, '是否是超级管理员', res);
                    Core.Data.setManager(res.status);
                })
                .catch(err => {
                    Core.Logger.warn('参数', obj, '是否是超级管理员', err);
                });
        },
        // 登录接口
        loginFetch(params = {}, type) {
            let obj = {
                ...params,
            };

            Core.Api.Common.login(obj)
                .then(res => {
                    console.log('handleLogins apiName res', res);

                    Core.Data.setToken(res.token);
                    Core.Data.setUser(res.user.account);

                    Core.Data.setLoginType(res.user.type); // 设置登录方的数字
                    let loginType = TYPE_MAP[res.user.type];
                    Core.Data.setUserType(loginType); // 设置登录方的文字

                    if (type === 'supplier') {
                        this.$router.push('/supply-home');
                        return;
                    }

                    Core.Data.setOrgObj(res.user.org);
                    Core.Data.setOrgId(res.user.org_id); // 组织的id
                    Core.Data.setOrgType(res.user.org_type); // 组织的类型
                    Core.Data.setCurrency(res.user?.org.currency); // 账号的单位

                    this.getAuthority(
                        res.user.id,
                        res.user.type,
                        loginType,
                        res.user.role_id,
                        res.user.flag_admin,
                        res.user.flag_group_customer_admin,
                    );
                    this.isAdminFetch();
                })
                .catch(err => {
                    console.log('handleLogins apiName err', err);
                });
        },
        // 获取验证码
        getPhoneCodeFetch(params = {}) {
            let obj = {
                ...params,
            };

            Core.Api.Common.phoneCode(obj)
                .then(res => {
                    console.log('getPhoneCodeFetchs res', res);
                })
                .catch(err => {
                    console.log('getPhoneCodeFetchs err', err);
                });
        },
        /* Fetch end*/
        fsLogin() {
            if (window.h5sdk) {
                jsapi.apiAuth();
            }
        },
        handleFocusPwd() {
            this.$refs['password-input'].focus();
        },

        async handleLogin(type) {
            let form = Core.Util.deepCopy(this.loginForm);
            let _supplierLoginForm = Core.Util.deepCopy(this.supplierLoginForm);

            if (type === 'supplier') {
                if (this.isCheck(this.supplierLoginForm, type)) return;
                let obj = {
                    ..._supplierLoginForm,
                    type: Core.Const.COMMON.LOGIN_TYPE.CODE,
                    platform: Core.Const.COMMON.PLATFORM.SUPPLY,
                };
                this.loginFetch(obj, 'supplier');
            } else {
                if (this.isCheck(form, type)) return;
                this.loginFetch(form);
            }
        },

        // 检查是否填写了
        isCheck(form, type) {
            if (type === 'supplier') {
                if (!form.phone) {
                    return this.$message.warning(`${this.$t('n.enter')}${this.$t('n.phone')}`);
                }
                if (!form.code) {
                    return this.$message.warning(`${this.$t('n.enter')}${this.$t('n.verification_code')}`);
                }
            } else {
                if (!form.username) {
                    return this.$message.warning(this.$t('n.username'));
                }
                if (!form.password) {
                    return this.$message.warning(this.$t('n.enter_password'));
                }
            }

            return false;
        },

        async getAuthority(userId, userType, loginType, roleId, flag_admin, flagGroupCustomerAdmin) {
            Core.Data.setAuthority('');
            let authorityMap = {};
            authorityMap[loginType] = true;
            if (flag_admin) {
                authorityMap['MANAGER'] = true;
            }
            if (flagGroupCustomerAdmin) {
                authorityMap['MANAGER_GROUP'] = true;
            }

            Core.Api.Authority.authUserAll({
                user_id: userId,
                user_type: userType,
            })
                .then(res => {
                    let list = res.list;
                    for (const item of list) {
                        authorityMap[item.key] = true;
                    }
                })
                .finally(() => {
                    Core.Data.setAuthority(authorityMap);
                    if (userType === Core.Const.USER.TYPE.ADMIN) {
                        setTimeout(() => {
                            this.$router.replace({ path: '/distributor', query: { from: 'login' } });
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            this.$router.replace({ path: '/mall/index', query: { from: 'login' } });
                        }, 1000);
                    }
                });
        },
        handleLangSwitch(lang) {
            this.$store.commit('switchLang', lang);
            this.$i18n.locale = this.$store.state.lang;
        },

        // 供应商的逻辑
        handleFocusCode() {
            // 快速定位到验证码
            this.$refs['code-input'].focus();
        },
        // 获取验证码
        onGetCode() {
            // 防止多次点击
            if (this.countdownTime) return;

            if (!this.supplierLoginForm.phone) {
                return this.$message.warning(`${this.$t('n.enter')}${this.$t('n.phone')}`);
            }

            this.getPhoneCodeFetch({
                type: 1, // 短信类型：1.登录注册
                phone: this.supplierLoginForm.phone,
            });

            console.log('获取验证码');
            this.countdown--;
            this.$refs['get-code'].innerHTML = this.countdown;
            this.$refs['get-code'].style.color = '#bfbfbf';
            this.$refs['get-code'].style.cursor = 'not-allowed';

            this.countdownTime = setInterval(() => {
                this.countdown--;
                if (this.countdown === 0) {
                    this.$refs['get-code'].innerHTML = this.$t('supply-chain.access_code');
                    clearInterval(this.countdownTime);
                    this.countdownTime = null;

                    this.countdown = 60;
                    this.$refs['get-code'].style.color = '#006CFF';
                    this.$refs['get-code'].style.cursor = 'pointer';
                } else {
                    this.$refs['get-code'].innerHTML = this.countdown;
                }
            }, 1000);
        },
    },
};
</script>

<style lang="less">
#Login {
    .flex(space-between);
    height: 100vh;
    background: @BG_body;
    .login-header {
        .no-select();
        width: 100%;
        height: 60px;
        background: @BG_login_herder;
        font-size: 20px;
        font-weight: 500;
        color: @TC_L;
        box-sizing: border-box;
        .fsb();
        .text {
            padding-left: 40px;
        }
        .header-right {
            .fcc();
            margin-right: 100px;
            .lang-switch {
                .icon {
                    font-size: 20px;
                }
            }
        }
    }
    .login-container {
        background: @BG_panel;
        border-radius: 6px;
        border: 1px solid @BC_login_box;
        overflow: hidden;
        .form-title {
            height: 70px;
            line-height: 70px;
            text-align: center;
            background: @BG_login_title;
            font-size: 18px;
            font-weight: 500;
            color: @TC_login_title;
        }
        .form-content {
            width: 100%;
            padding: 20px 40px 66px;
            box-sizing: border-box;
        }
        .login-type {
            .fac(space-between);
            position: relative;
            margin-bottom: 28px;
            .type-item {
                cursor: pointer;
                text-align: center;
                font-size: 16px;
                color: @TC_N;
                line-height: 24px;
                padding: 10px 0px;
                width: 68px;
                transition: color 0.3s ease;
                &.active {
                    color: @TC_P;
                }
            }
            &::after {
                content: '';
                display: inline-block;
                width: 68px;
                height: 3px;
                background: @BG_P;
                border-radius: 2px;
                position: absolute;
                bottom: 2px;
                transition: left 0.3s ease;
                right: 0;
            }

            &.SUPPLIER::after {
                left: calc(~'68px * 0');
            }
            &.STORE::after {
                left: calc(~'68px * 1');
            }
            &.AGENT::after {
                left: calc(~'68px * 2');
            }
            &.DISTRIBUTOR::after {
                left: calc(~'68px * 3');
            }
            &.ADMIN::after {
                left: calc(~'68px * 4');
            }
        }
        .form-item {
            padding: 0 0 0 8px;
            margin-bottom: 24px;
            .ant-input {
                height: 44px;
                background: @BG_N;
                border-radius: 2px;
            }
            .ant-input-prefix {
                margin-right: 8px;
            }
            .placeholder {
                color: @TC_placeholder;
            }
        }
        .form-button {
            width: 100%;
            height: 44px;
            line-height: 44px;
            background: @BG_P;
            border-radius: 2px;
        }
    }
    .login-footer {
        margin-bottom: 60px;
        font-size: 14px;
        color: @TC_login_footer;
    }
}

.supplier-code {
    display: flex;
    .code-form-item {
        height: 44px;
    }
    .get-code-text {
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 44px;
        white-space: nowrap;
        border: 1px solid #eaecf2;
        border-radius: 4px;
        color: @BG_P;
        margin-left: 20px;
        font-size: 12px;
        cursor: pointer;
    }
}
</style>

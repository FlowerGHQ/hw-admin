<template>
<div id="Login">
    <div class="login-header">
        <span class="text">{{ $t('n.system') }}</span>
        <div class="header-right">
            <a-button class="lang-switch" type="link"  @click="handleLangSwitch">
                <i class="icon" :class="lang =='zh' ? 'i_zh-en' : 'i_en-zh'"/>
            </a-button>
        </div>
    </div>
    <div class="login-container">
        <div class="form-title">{{ $t('n.account_login') }}</div>
        <div class="form-content">
            <div class="login-type" :class="TYPE_MAP[loginForm.user_type]">
                <div class="type-item" v-for="item of loginTypeList" :key="item.value"
                    :class="loginForm.user_type === item.value ? 'active' : ''"
                    @click="loginForm.user_type = item.value">
                    {{item[$i18n.locale]}}
                </div>
            </div>
            <a-input class="form-item" :placeholder="$t('n.username')" v-model:value="loginForm.username" @keydown.enter="handleFocusPwd">
                <template #prefix>
                    <i class="icon i_user placeholder"/>
                </template>
            </a-input>
            <a-input class="form-item" :placeholder="$t('n.enter_password')" v-model:value="loginForm.password" @keydown.enter="handleLogin" type="password" ref="password-input">
                <template #prefix>
                    <i class="icon i_lock placeholder"/>
                </template>
            </a-input>
            <a-button class="form-button" type="primary" @click="handleLogin">{{ $t('n.login') }}</a-button>
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
const TYPE = Core.Const.LOGIN.TYPE
const TYPE_MAP = Core.Const.LOGIN.TYPE_MAP
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

            user: {},
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    created() {
        if (Core.Data.getLang() === "" || Core.Data.getLang() === null){
            Core.Data.setLang("zh")
        }
        // 初始化看选中哪个登录方
        this.loginForm.user_type = Core.Data.getLoginType() || TYPE.ADMIN
    },
    mounted() {
        this.fsLogin()
    },
    methods: {
        /* Fetch start*/
        // 检查是否是超级管理员
        isAdminFetch(parmas) {
            // 分销商不调用
            if (Core.Data.getLoginType() === Core.Const.USER.TYPE.DISTRIBUTOR) return
            let obj = {
                ...parmas
            }
            Core.Api.User.checkAdmin(obj).then(res => {
                Core.Logger.log("参数", obj, "是否是超级管理员", res)
                Core.Data.setManager(res.status)
            }).catch(err => {
                Core.Logger.warn("参数", obj, "是否是超级管理员", err)
            })
        },
        /* Fetch end*/
        fsLogin() {
            if (window.h5sdk) {
                jsapi.apiAuth();                
            }
        },
        handleFocusPwd() {
            this.$refs['password-input'].focus()
        },
        async handleLogin() {
            let form = Core.Util.deepCopy(this.loginForm)
            console.log('handleLogin form:', form)
            if (!form.username) {
                return this.$message.warning(this.$t('n.username'))
            }
            if (!form.password) {
                return this.$message.warning(this.$t('n.enter_password'))
            }
            Core.Api.Common.login(form).then(res => {
                console.log('handleLogin apiName res', res)                
                Core.Data.setToken(res.token);
                Core.Data.setUser(res.user.account);
                Core.Data.setOrgId(res.user.org_id);
                Core.Data.setOrgType(res.user.org_type);
                Core.Data.setCurrency(res.user.currency);
                
                Core.Data.setLoginType(this.loginForm.user_type);  // 设置登录方的数字
                
                let loginType = TYPE_MAP[this.loginForm.user_type]
                Core.Data.setUserType(loginType); // 设置登录方的文字

                this.getAuthority(res.user.id, res.user.type, loginType, res.user.role_id, res.user.flag_admin, res.user.flag_group_customer_admin);
                this.isAdminFetch()
            });
        },

        async getAuthority(userId, userType, loginType, roleId, flag_admin, flagGroupCustomerAdmin) {
            Core.Data.setAuthority('')
            let authorityMap = {}
            authorityMap[loginType] = true
            if (flag_admin) {
                authorityMap['MANAGER'] = true
            }
            if (flagGroupCustomerAdmin){
                authorityMap['MANAGER_GROUP'] = true
            }

            Core.Api.Authority.authUserAll({
                user_id: userId,
                user_type: userType
            }).then(res => {
                let list = res.list                
                for (const item of list) {
                    authorityMap[item.key] = true
                }
            }).finally(() => {
                Core.Data.setAuthority(authorityMap)
                if (userType === Core.Const.USER.TYPE.ADMIN){
                    setTimeout(() => {
                        this.$router.replace({ path: '/dashboard', query: {from: 'login'} })
                    }, 1000)
                } else {
                    setTimeout(() => {
                        this.$router.replace({ path: '/dashboard/index', query: {from: 'login'} })
                    }, 1000)
                }
            })
        },
        handleLangSwitch() {
            
            this.$store.commit('switchLang');
            this.$i18n.locale = this.$store.state.lang;
            console.log('this.$i18n.locale',this.$i18n.locale)
        },
    }
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
        width: 390px;
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
            .fac(space-around);
            position: relative;
            margin-bottom: 28px;
            .type-item {
                cursor: pointer;
                text-align: center;
                font-size: 16px;
                color: @TC_N;
                line-height: 24px;
                padding: 10px;
                transition: color 0.3s ease;
                flex: 1;
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
                transform: translateX(-50%);
                transition: left .3s ease;
            }

            &.STORE::after {
                left: calc(~'100% / 8');
            }
            &.AGENT::after {
                left: calc(~'100% / 8 * 3');
            }
            &.DISTRIBUTOR::after {
                left: calc(~'100% / 8 * 5');
            }
            &.ADMIN::after {
                left: calc(~'100% / 8 * 7');
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
</style>

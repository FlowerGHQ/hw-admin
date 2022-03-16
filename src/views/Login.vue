<template>
<div id="Login">
    <div class="login-header">
        <span class="text">浩万后台管理系统</span>
    </div>
    <div class="login-container">
        <div class="form-title">账号登录</div>
        <div class="form-content">
            <div class="login-type" :class="TYPE_MAP[loginForm.user_type]">
                <div class="type-item" v-for="item of loginTypeList" :key="item.value"
                    :class="loginForm.user_type === item.value ? 'active' : ''"
                    @click="loginForm.user_type = item.value">
                    {{item.text}}
                </div>
            </div>
            <a-input class="form-item" placeholder='请输入用户名' v-model:value="loginForm.username" @keydown.enter="handleFocusPwd">
                <template #prefix>
                    <i class="icon i_user placeholder"/>
                </template>
            </a-input>
            <a-input class="form-item" placeholder='请输入密码' v-model:value="loginForm.password" @keydown.enter="handleLogin" type="password" ref="password-input">
                <template #prefix>
                    <i class="icon i_lock placeholder"/>
                </template>
            </a-input>
            <a-button class="form-button" type="primary" @click="handleLogin">登 录</a-button>
        </div>
    </div>
    <div class="login-footer">Copyright © 2021 杭州重构科技有限公司 浙ICP备17006717号</div>
</div>
</template>

<script>
import Core from '../core';
const TYPE = Core.Const.LOGIN.TYPE
const TYPE_MAP = Core.Const.LOGIN.TYPE_MAP
export default {
    name: 'Login',
    components: {},
    props: {},
    data() {
        return {
            TYPE,
            TYPE_MAP,
            loginTypeList: Core.Const.LOGIN.TYPE_LIST,

            loginForm: {
                username: '',
                password: '',
                user_type: 30,
            },

            user: {},
        };
    },
    watch: {},
    computed: {},
    created() {
        if (Core.Data.getLoginType()) {
            this.loginForm.user_type = Core.Data.getLoginType();
        } else {
            this.loginForm.user_type = TYPE.AGENT;
        }
    },
    mounted() {},
    methods: {
        handleFocusPwd() {
            this.$refs['password-input'].focus()
        },
        async handleLogin() {
            let form = Core.Util.deepCopy(this.loginForm)
            console.log('handleLogin form:', form)
            if (!form.username) {
                return this.$message.warning('请输入用户名')
            }
            if (!form.password) {
                return this.$message.warning('请输入密码')
            }
            Core.Api.Common.login(form).then(res => {
                console.log('handleLogin apiName res', res)
                Core.Data.setToken(res.token);
                Core.Data.setLoginType(this.loginForm.user_type);
                Core.Data.setToken(res.token);
                Core.Data.setUser(res.user.account);
                Core.Data.setOrgId(res.user.org_id);
                Core.Data.setOrgType(res.user.org_type);

                let userType = TYPE_MAP[this.loginForm.user_type]
                /* switch (this.loginForm.user_type) {
                    case TYPE.ADMIN:
                        break;
                    case TYPE.AGENT:
                        break;
                    case TYPE.STORE:
                        break;
                } */
                Core.Data.setUserType(userType);
                this.getAuthority(userType, res.user.id, res.user.flag_admin);
            });
        },

        async getAuthority(userType, userId, flag_admin) {
            Core.Data.setAuthority('')
            let authorityMap = {}
            authorityMap[userType] = true
            if (flag_admin) {
                authorityMap['MANAGER'] = true
            }
            Core.Data.setAuthority(authorityMap)
            setTimeout(() => {
                this.$router.replace({ path: '/dashboard?from=login' })
            }, 1000)
            return

        }
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

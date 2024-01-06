<template>
    <div id="LoginMall">
        <div class="login-header">
            <div class="content">
                <div class="text">
                    <img class="img" src="@/assets/images/mall/login/icon.svg" alt="Horwin">
                    <span>{{ $t('mall.system') }}</span>
                </div>
                <div class="header-right">
                    <!-- <a-button class="lang-switch" type="link"  @click="handleLangSwitch">
                        <i class="icon" :class="lang =='zh' ? 'i_zh-en' : 'i_en-zh'"/>
                    </a-button> -->
                    <a-dropdown :trigger="['click']" placement="bottom" @visibleChange="langDropDownChange">
                        <div class="mt-user-switch" @click.prevent>
                            <svg-icon icon-class="header-lang-icon" class-name="mt-user-icon" />
                            <!-- 当前语言 -->
                            <span class="mt-header-lang-text">{{ currentAreaType }}</span>
                            <svg-icon icon-class="header-expand-icon" :class-name="langShow ? 'mt-triangle-icon expand' : 'mt-triangle-icon'" />
                        </div>
                        <template #overlay>
                            <a-menu style="bottom: 0px; position: relative;">
                                <a-menu-item key="0" @click="handleLangSwitch('en')">
                                    <a class="menu_text">EN</a>
                                </a-menu-item>
                                <a-menu-divider />
                                <a-menu-item key="1" @click="handleLangSwitch('zh')">
                                    <a class="menu_text">中文</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </div>
        <div class="login-container">
            <div class="form-title">{{ $t('mall.account_login') }}</div>
            <div class="form-content">
                <div class="login-type" :class="[TYPE_MAP[loginForm.user_type], lang]">
                    <div class="type-item" v-for="item of loginTypeList" :key="item.value"
                        :class="loginForm.user_type === item.value ? 'active' : ''"
                        @click="loginForm.user_type = item.value">
                        {{item[$i18n.locale]}}
                    </div>
                </div>
                <!-- 用户名 -->
                <FormModel 
                    key="username" 
                    @handleValid="handleChangeUserNameValid"
                    :unValid="unUserNameValid" 
                    type="Basic" 
                    :placeholder="$t('n.username')"
                    @keydownEnter="handleFocusPwd" 
                    :value="loginForm.username"
                    @input="loginForm.username = $event.target.value" 
                />
                <!-- 密码 -->
                <FormModel 
                    key="password" 
                    @handleValid="handleChangePassWordValid"
                    :unValid="unPassWordValid" 
                    type="Password" 
                    :placeholder="$t('n.enter_password')"
                    @keydownEnter="handleLogin" 
                    :value="loginForm.password"
                    @input="loginForm.password = $event.target.value"
                    ref="password-input" 
                />
                <div class="login-btn">
                    <my-button type="primary" showRightIcon @click="handleLogin">
                        {{ $t('mall.account_login') }}
                    </my-button>
                </div>
            </div>
        </div>
        <div class="login-footer">
            <div class="content">
                <div class="menu">
                    <span class="menu-item" v-for="(item, index) in menuList" :key="index">
                        {{ $t(`mall.${item.lang}`) }}
                    </span>
                </div>
                <div class="about">
                    <!-- {{ $t('mall.about') }} -->
                    © 2023 | HORWIN Inc
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '@/core';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';
import jsapi from '@/core/jsapi';
import SvgIcon from "@/components/SvgIcon/index.vue";
import FormModel from "@/components/common/FormModel.vue";
import MyButton from '@/components/common/MyButton.vue';
const TYPE = Core.Const.LOGIN.TYPE
const TYPE_MAP = Core.Const.LOGIN.TYPE_MAP
export default {
    name: 'Login',
    components: {
        SvgIcon,
        FormModel,
        MyButton
    },
    props: {},
    data() {
        return {
            zhCN,
            enUS,
            TYPE,
            TYPE_MAP,
            loginTypeList: Core.Const.LOGINMALL.TYPE_LIST,
            menuList: Core.Const.LOGINMALL.FOOTERMENU,

            loginForm: {
                username: '',
                password: '',
                user_type: 15, 
            },

            user: {},
            currentAreaType: '',
            langShow: false,
            unUserNameValid: false,
            unPassWordValid: false,
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    created() {
        const lang = Core.Data.getLang()
        if (lang === "" || lang === null){
            Core.Data.setLang("zh")
        }
        this.handleLangSwitch(Core.Data.getLang())
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
        // 必填项检查
        checkInput(form) {
            let allValid = true;
            console.log(form)
            this.unUserNameValid = !form.username;
            this.unPassWordValid = !form.password;
            allValid = form.username && form.password
            return allValid;
        },
        async handleLogin() {
            console.log(this.loginForm)
            let form = Core.Util.deepCopy(this.loginForm)
            if (this.checkInput(form)) {//表单验证通过且验证码正确
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
            }
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
                        this.$router.replace({ path: '/distributor', query: {from: 'login'} })
                    }, 1000)
                } else {
                    setTimeout(() => {
                        this.$router.replace({ path: '/mall/index', query: {from: 'login'} })
                    }, 1000)
                }
            })
        },
        handleLangSwitch(lang) {
            this.$store.commit('switchLang', lang);
            this.$i18n.locale = this.$store.state.lang;
            if (this.$i18n.locale === 'zh') {
                this.currentAreaType = '中文'
            } else {
                this.currentAreaType = this.$i18n.locale.toUpperCase();
            }
            this.langShow = false
        },
        // 语言下拉菜单是否展示
        langDropDownChange(e) {
            this.langShow = e
        },
        handleChangeUserNameValid() {
            this.unUserNameValid = false
        },
        handleChangePassWordValid() {
            this.unPassWordValid = false
        },
    }
};
</script>

<style lang="less">
#LoginMall {
    position: relative;
    height: 100vh;
    background-image: url(../../assets/images/mall/login/bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #000;
    .login-header {
        height: 60px;
        width: 100%;
        position: fixed;
        top: 0;
        .content {
            margin: 0 auto;
            width: 75%;
            height: 100%;
            .no-select();
            background-color: #000;
            font-size: 20px;
            font-weight: 500;
            color: @TC_L;
            box-sizing: border-box;
            .fsb();
            .text {
                > span {
                    color: rgba(255, 255, 255, 0.7);
                    font-family: Montserrat;
                    font-size: 18px;
                    font-style: normal;
                    line-height: 120%; /* 21.6px */
                    &::before {
                        content: "|";
                        padding: 0 16px;
                    }
                }
            }
            .header-right {
                .fcc();
                .lang-switch {
                    .icon {
                        font-size: 20px;
                    }
                }
                .mt-user-switch {
                    cursor: pointer;
                    >img {
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        margin-right: 8px;
                    }
                    .fcc();
                    color: #fff;
                    font-family: Montserrat;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 150%; /* 18px */
                    // letter-spacing: 0.64px;
                    position: relative;
                    .mt-user-icon {
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                    }
                    .mt-header-lang-text {
                        color: #FFF;
                        font-family: Montserrat;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 150%; /* 18px */
                        // letter-spacing: 0.64px;
                        margin-right: 2px;
                    }
                    .mt-triangle-icon {
                        font-size: 24px;
                        transition: transform 0.3s ease, top 0.3s ease;
                        fill: #FFF;
                        &.expand {
                            transform: rotate(180deg);
                        }
                    }
                    .mt-arrow-icon {
                        position: absolute;
                        width: 14px;
                        height: 6px;
                        bottom: 32.5px;
                    }
                    .mt-arrow-icon-user {
                        position: absolute;
                        width: 14px;
                        height: 6px;
                        bottom: 37px;
                        left: 8px;
                    }
                }
            }
        }
    }
    .login-container {
        padding: 48px 40px;
        width: 453px;
        background: @BG_panel;
        border-radius: 6px;
        border: 1px solid @BC_login_box;
        overflow: hidden;
        position: absolute;
        top: 50%;
        right: 12.5%;
        transform: translateY(-50%);
        .form-title {
            height: 70px;
            font-size: 24px;
            font-weight: 700;
            font-family: Montserrat;
            color: #333;
        }
        .form-content {
            width: 100%;
            box-sizing: border-box;
        }
        .login-type {
            .fac(flex-start);
            position: relative;
            margin-bottom: 28px;
            .type-item {
                cursor: pointer;
                text-align: center;
                font-size: 16px;
                background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                line-height: 24px;
                padding: 10px;
                transition: color 0.3s ease;
                &.active {
                    color: @TC_P;
                }
            }
            &::after {
                content: '';
                display: inline-block;
                width: 60px;
                height: 3px;
                background: linear-gradient(100deg, #C6F 0%, #66F 100%);
                border-radius: 2px;
                position: absolute;
                bottom: 2px;
                transform: translateX(-50%);
                transition: all .3s ease;
            }

            &.DISTRIBUTOR::after {
                left: 50px;
                width: 90px;
            }
            &.ADMIN::after {
                left: 135px;
            }
        }
        .zh {
            &.DISTRIBUTOR::after {
                left: 35px;
                width: 60px;
            }
            &.ADMIN::after {
                left: 103px;
            }
        }
        .login-btn {
            margin-top: 48px;
        }
    }
    .login-footer {
        width: 100%;
        position: fixed;
        bottom: 0;
        font-size: 14px;
        height: 80px;
        color: rgba(255, 255, 255, 0.4);
        overflow: hidden;
        .content {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            .fcc(space-between);
            margin: 0 auto;
            width: 75%;
            height: 100%;
            .menu {
                .menu-item {
                    display: inline-block;
                    margin-right: 40px;
                    cursor: pointer;
                }
            }
        }
    }
}
// dropdown start
.ant-dropdown-menu {
    position: relative;
    border-radius: 0;
    &::before {
        content: '';
        position: absolute;
        right: 47px;
        top: -8px;
        z-index: 999999;
        width: 0;
        height: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 12px solid #fff;
    }
}
.ant-dropdown-menu-item {
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    &:hover {
        background-color: #EEE;
    }
}
.ant-dropdown {
    position: absolute;
    top: 60px !important;
}
.menu_text {
    color: #000;
    font-family: Montserrat;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    text-align: center;
}
// dropdown end
.ant-input {
   caret-color: #C6F; /* 将光标颜色设为红色 */
}
input.ant-input {
    border: none;
    font-size: 14px;
    &:focus {
        box-shadow: none;
    }
}
</style>
    
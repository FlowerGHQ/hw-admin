<template>
    <div id="LoginMall" :class="lang">
        <div class="login-header">
            <div class="content">
                <div class="text">
                    <img class="img" src="@/assets/images/mall/login/icon.svg" alt="HORWIN" />
                    <span>{{ $t('mall.system') }}</span>
                </div>
                <div class="header-right">
                    <!-- <a-button class="lang-switch" type="link"  @click="handleLangSwitch">
                        <i class="icon" :class="lang =='zh' ? 'i_zh-en' : 'i_en-zh'"/>
                    </a-button> -->
                    <span>
                        <a-dropdown
                            :trigger="['click']"
                            overlay-class-name="action-menu"
                            placement="bottom"
                            @visibleChange="langDropDownChange"
                        >
                            <div class="mt-user-switch" @click.prevent>
                                <svg-icon icon-class="header-lang-icon" class-name="mt-user-icon" />
                                <!-- 当前语言 -->
                                <span class="mt-header-lang-text tab-animate">{{ currentAreaType }}</span>
                                <svg-icon
                                    icon-class="header-expand-icon"
                                    :class-name="langShow ? 'mt-triangle-icon expand' : 'mt-triangle-icon'"
                                />
                            </div>
                            <template #overlay>
                                <a-menu style="bottom: 0px; position: relative">
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
                    </span>
                </div>
            </div>
        </div>
        <div class="login-container" :style="{ padding: fsLoginShow ? '48px 40px' : '48px 40px 20px 40px' }">
            <!-- 密码手机号登录 -->
            <template v-if="!fsLoginShow">
                <div class="form-title">{{ token ? $t('mall.choose_identity') : $t('mall.account_login') }}</div>
                <div class="form-content">
                    <template v-if="token && user_type_list > 0">
                        <div class="user-list">
                            <div
                                class="user-item"
                                v-for="item in user_type_list"
                                :key="item"
                                @click="handleLogin(item)"
                            >
                                {{ Core.Const.USER.TYPE_MAP[item][lang] }}
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <!-- <div class="login-type">
                        <div class="type-item" v-for="item of loginMethodsList" :key="item.id"
                            :class="login_methods === item.id ? 'active' : ''"
                            @click="login_methods = item.id">
                            <svg-icon :icon-class="item.icon" :class-name="item.icon" />
                            <svg-icon :icon-class="item.icon_black" :class-name="item.icon_black" />
                            {{ $t(`mall.${item.name_lang}`) }}
                        </div>
                    </div> -->
                        <!-- 手机号登录 -->
                        <template v-if="login_methods === 2">
                            <!-- 手机号 -->
                            <FormModel
                                key="phone"
                                @handleValid="handleChangePhoneValid"
                                :unValid="unPhoneValid"
                                type="Basic"
                                :placeholder="$t('mall.enter_phone')"
                                @keydownEnter="handleFocusCode"
                                :value="loginPhoneForm.phone"
                                @input="loginPhoneForm.phone = $event.target.value"
                            />
                            <!-- 验证码 -->
                            <div class="web-value">
                                <input
                                    ref="code"
                                    @focus="handleCodeFocus"
                                    :placeholder="$t('mall.enter_code')"
                                    v-model="loginPhoneForm.code"
                                    :class="codeInputClassName"
                                    type="text"
                                />
                                <button
                                    :class="['web-verification', loginPhoneForm.phone ? 'can-hover' : 'grey']"
                                    v-if="!countdown"
                                    @click="sendCode"
                                >
                                    {{ $t(/*发送验证码*/ 'mall.verification_code') }}
                                </button>
                                <button class="web-verification grey" v-else disabled>
                                    {{ $t(/*已发送*/ 'mall.sented') }}({{ countdown }})
                                </button>
                            </div>
                        </template>
                        <!-- 密码登录 -->
                        <template v-else>
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
                                @keydownEnter="handleAccount"
                                :value="loginForm.password"
                                @input="loginForm.password = $event.target.value"
                                ref="password-input"
                            />
                        </template>
                        <div class="login-btn" @click="handleAccount">
                            <my-button type="primary" showRightIcon>
                                {{ $t('mall.account_login') }}
                            </my-button>
                        </div>
                    </template>
                    <template v-if="!token">
                        <div class="more-login">
                            <span class="more-login-text">
                                {{ $t('mall.more_login') }}
                            </span>
                        </div>
                        <div class="login-body">
                            <div class="login-item">
                                <div class="select-login" @click="changeMethods">
                                    <img
                                        src="@images/mall/login/phone.png"
                                        class="phone-icon"
                                        v-if="login_methods === 1"
                                    />
                                    <img
                                        src="@images/mall/login/lock.png"
                                        class="lock-icon"
                                        v-if="login_methods === 2"
                                    />
                                </div>
                                <span class="login-text" v-if="login_methods === 1">{{ $t('mall.phone_login') }}</span>
                                <span class="login-text" v-if="login_methods === 2">{{
                                    $t('mall.user_name_login')
                                }}</span>
                            </div>
                            <div class="login-item">
                                <div class="select-login" @click="changeFsLoginShow">
                                    <img src="@images/mall/login/fs-login.png" class="fs-icon" />
                                </div>
                                <span class="login-text">{{ $t('mall.fs_login') }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </template>
            <!-- 飞书二维码 -->
            <template v-else>
                <!-- 飞书扫码成功页 -->
                <template v-if="$route.path === '/login/feishu'">
                    <div class="form-title">
                        <img
                            src="@images/mall/login/back-arrow.png"
                            class="fs-back"
                            @click="$router.push('/login')"
                        />{{ $t('mall.fs_login') }}
                    </div>
                    <div class="form-content fs-form-content">
                        <router-view></router-view>
                        <div class="fs-body">
                            <div class="fs-login">
                                <img src="@images/mall/login/fs-login.png" alt="" />
                                <span>{{ $t('mall.scan_successful') }}!</span>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="form-title">
                        <img src="@images/mall/login/back-arrow.png" class="fs-back" @click="fsLoginShow = false" />{{
                            $t('mall.fs_login')
                        }}
                    </div>
                    <div class="form-content fs-form-content">
                        <div id="login_container"></div>
                        <div class="fs-body">
                            <div class="fs-login">
                                <img src="@images/mall/login/fs-login.png" alt="" />
                                <span>{{ $t('mall.fs_qrcode') }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
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
                    © 2024 | HORWIN Inc
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
import SvgIcon from '@/components/SvgIcon/index.vue';
import FormModel from '@/components/common/FormModel.vue';
import MyButton from '@/components/common/MyButton.vue';
const TYPE = Core.Const.LOGIN.TYPE;
const TYPE_MAP = Core.Const.LOGIN.TYPE_MAP;
function getUrlParams(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'); //定义正则表达式
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
export default {
    name: 'Login',
    components: {
        SvgIcon,
        FormModel,
        MyButton,
    },
    props: {},
    data() {
        return {
            Core,
            zhCN,
            enUS,
            TYPE,
            TYPE_MAP,
            loginMethodsList: [
                {
                    id: 1,
                    name_lang: 'phone_number',
                    icon: 'phone-icon',
                    icon_black: 'phone-black-icon',
                },
                {
                    id: 2,
                    name_lang: 'password',
                    icon: 'pwd-icon',
                    icon_black: 'pwd-black-icon',
                },
            ],
            loginTypeList: Core.Const.LOGINMALL.TYPE_LIST,
            menuList: Core.Const.LOGINMALL.FOOTERMENU,
            loginPhoneForm: {
                phone: '',
                code: '',
            },
            loginForm: {
                username: '',
                password: '',
            },
            login_methods: 1, // 1账号登录  2 手机号登录
            user: {},
            currentAreaType: '',
            langShow: false,
            unPhoneValid: false,
            unValidCode: false,
            unUserNameValid: false,
            unPassWordValid: false,
            codeInputStatus: 'not-enter',
            countdown: null, // 倒计时
            countdownTime: null, // 定时器记录
            user_type: '',
            user_type_list: [],
            token: Core.Data.getToken(),
            fsLoginShow: false,
            QRLoginObj: null,
            goto: '',
        };
    },
    watch: {},
    computed: {
        codeInputClassName() {
            if (this.codeInputStatus === 'not-enter' && !this.loginPhoneForm.code) {
                return 'web-input not-enter';
            } else if (this.codeInputStatus === 'be-entering') {
                return 'web-input be-entering';
            } else if (this.codeInputStatus === 'entered' && this.loginPhoneForm.code) {
                return 'web-input entered';
            } else if (this.codeInputStatus === 'err-enter') {
                return 'web-input err-enter';
            }
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    created() {
        this.user_type = Number(this.$route.query?.user_type);
        const lang = Core.Data.getLang();
        if (lang === '' || lang === null) {
            Core.Data.setLang('zh');
        }
        this.handleLangSwitch(Core.Data.getLang());
        // Core.Data.clearUserTypeList();// 用于测试
        this.user_type_list = Core.Data.getUserTypeList();
        window.addEventListener('message', this.handleMessage, false);
        this.getCode();
    },
    mounted() {
        this.fsLogin();
        if (Number(this.$route.query?.user_type) === Core.Const.USER.TYPE.SUPPLIER) {
            // 供应链的时候自动切换到手机中
            this.login_methods = 2;
        }
    },
    unmounted() {
        clearInterval(this.countdownTime);
        this.countdownTime = null;
        window.removeEventListener('message', this.handleMessage, false);
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
        /* Fetch end*/
        fsLogin() {
            if (window.h5sdk) {
                jsapi.apiAuth();
            }
        },
        changeFsLoginShow() {
            const appId = 'cli_a4f7ecfb66bb500d'; // 在飞书开放平台上注册的应用程序的App ID
            const REDIRECT_URI = window.location.origin; // 当前域名
            this.goto = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${appId}&redirect_uri=${REDIRECT_URI}&response_type=code`;
            this.fsLoginShow = true;
            this.$nextTick(() => {
                this.QRLoginObj = QRLogin({
                    id: 'login_container',
                    goto: this.goto,
                    width: '260px',
                    height: '260px',
                    style: 'width:260px;height:260px;border:none', //可选的，二维码html标签的style属性
                });
            });
        },
        handleMessage(event) {
            // 使用 matchOrigin 和 matchData 方法来判断 message 和来自的页面 url 是否合法
            if (this.QRLoginObj.matchOrigin(event.origin) && this.QRLoginObj.matchData(event.data)) {
                var loginTmpCode = event.data.tmp_code;
                // 在授权页面地址上拼接上参数 tmp_code，并跳转
                window.location.href = `${this.goto}&tmp_code=${loginTmpCode}`;
            }
        },
        // 获取飞书重定向后返回的 code 用于登录
        getCode() {
            const href = window.location.href;
            let code;
            if (/code=/.test(href)) {
                this.fsLoginShow = true;
                this.$router.replace('/login/feishu');
                code = getUrlParams('code');
                Core.Api.ThirdParty.fsAuthorize({ code })
                    .then(res => {
                        Core.Data.setToken(res.token);
                        Core.Data.setUser(res.user.account);
                        res.user.type = 10; // 飞书登录默认给 10
                        Core.Data.setLoginType(res.user.type); // 设置登录方的数字
                        let loginType = TYPE_MAP[res.user.type];
                        Core.Data.setUserType(loginType); // 设置登录方的文字
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
                    .finally(() => {
                        window.history.replaceState({}, '', '/' + window.location.hash);
                    });
            }
        },
        handleFocusCode() {
            this.$refs['code'].focus();
        },
        handleFocusPwd() {
            this.$refs['password-input'].focus();
        },
        // 必填项检查
        checkInput(form, type) {
            let allValid = true;
            if (type === 1) {
                this.unUserNameValid = !form.username;
                this.unPassWordValid = !form.password;
                allValid = form.username && form.password;
            } else if (type === 2) {
                this.unPhoneValid = !form.phone;
                this.unValidCode = !form.code;
                this.codeInputStatus = form.code ? 'entered' : 'err-enter';
                allValid = form.phone && form.code;
            }
            return allValid;
        },
        // 登录点击事件
        handleAccount() {
            let type = this.login_methods;
            let obj = {};
            let form = {};
            if (type === 1) {
                form = Core.Util.deepCopy(this.loginForm);
                if (!this.checkInput(form, type)) return;
                obj = {
                    ...form,
                    type: Core.Const.COMMON.LOGIN_TYPE.PWD,
                };
            } else if (type === 2) {
                form = Core.Util.deepCopy(this.loginPhoneForm);
                if (!this.checkInput(form, type)) return;
                obj = {
                    ...form,
                    type: Core.Const.COMMON.LOGIN_TYPE.CODE,
                };
            }
            this.checkAccountFetch(obj, type);
        },
        // 类型选择事件
        async handleLogin(user_type) {
            if (this.token) {
                this.switchUserFetch(user_type);
            } else {
                let obj = Core.Data.getLoginMes();
                obj.user_type = user_type;
                this.loginFetch(obj, obj.type);
            }
        },
        // 校验登录账号接口
        checkAccountFetch(params = {}, type) {
            let obj = {
                ...params,
            };
            if (this.user_type === TYPE.SUPPLIER) {
                // 手机号临时用户-供应商
                Core.Api.Common.loginByTempUser({ ...obj, temp_user_type: 10 /* 临时用户类型：10.供应商 */ }).then(
                    res => {
                        console.log('handleLogins apiName res', res);

                        Core.Data.setToken(res.token);
                        // Core.Data.setUser(res.user.account);

                        Core.Data.setLoginType(TYPE.SUPPLIER); // 设置登录方的数字
                        let loginType = TYPE_MAP[TYPE.SUPPLIER];
                        Core.Data.setUserType(loginType); // 设置登录方的文字

                        // 手机登录跳转供应链页面
                        this.$router.push('/supply-home');
                    },
                );
            } else {
                // 其他用户
                Core.Api.Common.checkAccount(obj).then(res => {
                    Core.Data.setLoginMes(obj);
                    Core.Data.setUserTypeList(res?.user_type_list);
                    this.user_type_list = res?.user_type_list;
                    if (this.user_type_list.length === 1) {
                        // 如果类型只有一种则跳过选择直接登录
                        this.handleLogin(this.user_type_list[0]);
                    }
                });
            }
        },
        // 登录接口
        loginFetch(params = {}, type) {
            let obj = {
                ...params,
            };

            Core.Api.Common.selectUser(obj)
                .then(res => {
                    console.log('handleLogins apiName res', res);

                    Core.Data.setToken(res.token);
                    Core.Data.setUser(res.user.account);

                    Core.Data.setLoginType(res.user.type); // 设置登录方的数字
                    let loginType = TYPE_MAP[res.user.type];
                    Core.Data.setUserType(loginType); // 设置登录方的文字

                    // 手机登录跳转供应链页面
                    if (res.user.type === TYPE.SUPPLIER) {
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

                    // 登录成功清除登录传参信息
                    Core.Data.clearLoginMes();
                })
                .catch(err => {
                    console.log('handleLogins apiName err', err);
                });
        },
        // 切换身份接口
        switchUserFetch(user_type) {
            Core.Api.Common.switchUser({ user_type })
                .then(res => {
                    console.log('handleLogins apiName res', res);

                    Core.Data.setToken(res.token);
                    Core.Data.setUser(res.user.account);

                    Core.Data.setLoginType(res.user.type); // 设置登录方的数字
                    let loginType = TYPE_MAP[res.user.type];
                    Core.Data.setUserType(loginType); // 设置登录方的文字

                    // 手机登录跳转供应链页面
                    if (res.user.type === TYPE.SUPPLIER) {
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
        sendCode() {
            //发送验证码
            // 防止多次点击
            if (this.countdownTime) return;

            if (!this.loginPhoneForm.phone) {
                return this.$message.warning(`${this.$t('n.enter')}${this.$t('n.phone')}`);
            }

            this.getPhoneCodeFetch({
                type: 1, // 短信类型：1.登录注册
                phone: this.loginPhoneForm.phone,
            });
            this.countdown = 60;
            this.countdown--;
            this.countdownTime = setInterval(() => {
                this.countdown--;
                if (this.countdown === 0) {
                    clearInterval(this.countdownTime);
                    this.countdownTime = null;
                    this.countdown = null;
                }
            }, 1000);
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
        handleLangSwitch(lang) {
            this.$store.commit('switchLang', lang);
            this.$i18n.locale = this.$store.state.lang;
            if (this.$i18n.locale === 'zh') {
                this.currentAreaType = '中文';
            } else {
                this.currentAreaType = this.$i18n.locale.toUpperCase();
            }
            this.langShow = false;
        },
        // 语言下拉菜单是否展示
        langDropDownChange(e) {
            this.langShow = e;
        },
        handleChangeUserNameValid() {
            this.unUserNameValid = false;
        },
        handleChangePassWordValid() {
            this.unPassWordValid = false;
        },
        handleChangePhoneValid() {
            this.unPhoneValid = false;
        },
        // 验证码输入框聚焦
        handleCodeFocus() {
            this.codeInputStatus = 'be-entering';
        },
        // 切换登录方法
        changeMethods() {
            if (this.login_methods === 1) {
                this.login_methods = 2;
            } else if (this.login_methods === 2) {
                this.login_methods = 1;
            }
        },
    },
};
</script>

<style lang="less" scoped>
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
                    font-size: 18px;
                    font-style: normal;
                    line-height: 120%; /* 21.6px */
                    &::before {
                        content: '|';
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
                    > img {
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        margin-right: 8px;
                    }
                    .fcc();
                    color: #fff;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 150%; /* 18px */
                    // letter-spacing: 0.64px;
                    position: relative;
                    .mt-user-icon {
                        width: 18px;
                        height: 18px;
                        margin-right: 8px;
                    }
                    .mt-header-lang-text {
                        color: #fff;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 150%; /* 18px */
                        // letter-spacing: 0.64px;
                        margin-right: 2px;
                    }
                    .mt-triangle-icon {
                        font-size: 18px;
                        transition:
                            transform 0.3s ease,
                            top 0.3s ease;
                        fill: #fff;
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
        min-height: 544px;
        background: @BG_panel;
        border: 1px solid @BC_login_box;
        overflow: hidden;
        position: absolute;
        top: 50%;
        right: 12.5%;
        transform: translateY(-50%);
        .form-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 44px;
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
                flex: 1;
                .fcc();
                text-align: center;
                font-size: 14px;
                background: #666;
                border: 1px solid #eee;
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                line-height: 24px;
                padding: 10px 0;
                transition: color 0.3s ease;
                .phone-icon,
                .phone-icon-black,
                .pwd-icon,
                .pwd-black-icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 4px;
                }
                .phone-icon,
                .pwd-icon {
                    display: none;
                }
                .phone-icon-black,
                .pwd-black-icon {
                    display: inline-block;
                }
            }
            .active {
                border: 1px solid #c6f;
                background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                .phone-icon,
                .pwd-icon {
                    display: inline-block;
                }
                .phone-black-icon,
                .pwd-black-icon {
                    display: none;
                }
            }
        }
        .login-btn {
            margin-top: 48px;
        }
        .web-value {
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            position: relative;
            input::-webkit-input-placeholder {
                /* 修改placeholder颜色  */
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 150%; /* 21px */
                // letter-spacing: 0.56px;
                color: #bfbfbf;
            }
            input:focus {
                outline: none;
            }
            .web-input {
                outline: none;
                width: 100%;
                padding: 15px 0;
                box-sizing: border-box;
                font-weight: 400;
                font-style: normal;
                // letter-spacing: 0.56px;
                &.not-enter {
                    border-bottom: 1px solid #dfdfdf;
                    font-weight: 400;
                }
                &.be-entering {
                    border-bottom: 1px solid #bfbfbf;
                    color: #333;
                    font-weight: 400;
                    caret-color: #c6f;
                }
                &.entered {
                    border-bottom: 1px solid #dfdfdf;
                    color: #333;
                    font-weight: 400;
                }
                &.err-enter {
                    border-bottom: 1px solid #ff0000;
                    color: #333;
                    font-weight: 400;
                    &::-webkit-input-placeholder {
                        color: #ff0000;
                    }
                }
            }
            .web-verification {
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 150%; /* 21px */
                // letter-spacing: 0.56px;
                position: absolute;
                right: 0;
                &.grey {
                    color: #999999;
                    //pointer-events: none; /* 禁用鼠标事件 */
                    cursor: not-allowed; /* 鼠标样式为禁用状态 */
                }
                &.can-hover:hover {
                    background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
        }
        .user-list {
            .user-item {
                .flex(initial, center, row);
                color: #333;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 150%; /* 21px */
                padding: 16px;
                border: 1px solid #eee;
                margin-bottom: 16px;
                cursor: pointer;
                &:hover {
                    border: 1px solid #c6f;
                    background: linear-gradient(100deg, #c6f 0%, #66f 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        .more-login {
            .fcc();
            margin: 40px 0 24px 0;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                display: inline-block;
                height: 1px;
                width: 100%;
                background: #eeeeee;
                z-index: 0;
            }
            .more-login-text {
                padding: 0 8px;
                position: relative;
                color: #999;
                text-align: center;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 183.333% */
                z-index: 1;
                background: #fff;
            }
        }
        .login-body {
            .fcc();
            .login-item {
                .flex();
                &:nth-child(n + 2) {
                    margin-left: 60px;
                }
                .select-login {
                    .fcc();
                    height: 42px;
                    width: 42px;
                    border-radius: 50%;
                    border: 1px solid #eeeeee;
                    border: 1px solid #999;
                    > span {
                        color: #333;
                        text-align: center;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: 22px; /* 183.333% */
                    }
                    cursor: pointer;

                    .phone-icon,
                    .lock-icon,
                    .fs-icon {
                        width: 16px;
                        height: 16px;
                    }
                    &:hover {
                        border: 1px solid transparent;
                        background-clip: padding-box, border-box;
                        background-origin: padding-box, border-box;
                        background-image: linear-gradient(to right, #fff, #fff),
                            linear-gradient(90deg, #8f41e9, #578aef);
                    }
                    &:hover ~ .login-text {
                        background-image: linear-gradient(100deg, #c6f 0%, #66f 100%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }
                .login-text {
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 15px;
                    color: #999999;
                    margin-top: 8px;
                }
            }
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
                    &:hover {
                        color: rgba(255, 255, 255, 0.7);
                    }
                }
            }
        }
    }
    .fs-back {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        cursor: pointer;
    }
    .fs-form-content {
        #login_container {
            .fcc();
        }
        .fs-body {
            .fcc();
            padding-bottom: 30px;
            .fs-login {
                margin-top: 10px;
                font-size: 14px;
                font-weight: 500;
                line-height: 22px;
                > img {
                    width: 16px;
                    height: 16px;
                    margin-right: 8px;
                }
            }
        }
    }
}
.ant-input {
    caret-color: #c6f; /* 光标颜色 */
}
input.ant-input {
    border: none;
    font-size: 14px;
    &:focus {
        box-shadow: none;
    }
}
</style>
<style lang="less">
#LoginMall {
    &.en * {
        font-family: Montserrat !important;
    }
}
// dropdown start
.action-menu {
    position: absolute;
    top: 60px !important;
    .ant-dropdown-menu {
        position: relative;
        border-radius: 0;
        &::before {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
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
        min-width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        &:hover {
            background-color: #eee;
        }
        .ant-dropdown-menu-title-content {
            padding: 0 10px;
        }
        padding: 8px 0px;
        .menu_divider {
            position: relative;
            bottom: -8px;
        }
    }
    .menu_text {
        color: #000;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
        text-align: center;
    }
}
// dropdown end
</style>

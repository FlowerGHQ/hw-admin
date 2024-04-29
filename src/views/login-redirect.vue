<template>
    <div class="login-redirect">
        <div id="login_container"></div>
        <!-- <div class="load">
            <a-spin tip="Loading..." size="large" />
        </div> -->
    </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Core from '../core';
const TYPE_MAP = Core.Const.LOGIN.TYPE_MAP;

const route = useRoute();
const router = useRouter();

const token = route.query.token;
let QRLoginObj = null;
const appId = 'cli_a4f7ecfb66bb500d'; // 在飞书开放平台上注册的应用程序的App ID
const REDIRECT_URI = window.location.origin; // 当前域名
const goto = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${appId}&redirect_uri=${REDIRECT_URI}&response_type=code`;

onMounted(() => {
    // Core.Data.setToken(token);
    // loginRedirect(token);
    QRLoginObj = QRLogin({
        id: 'login_container',
        goto: goto,
        width: '500',
        height: '500',
        style: 'width:500px;height:600px', //可选的，二维码html标签的style属性
    });
});
const handleMessage = function (event) {
    // 使用 matchOrigin 和 matchData 方法来判断 message 和来自的页面 url 是否合法
    if (QRLoginObj.matchOrigin(event.origin) && QRLoginObj.matchData(event.data)) {
        var loginTmpCode = event.data.tmp_code;
        // 在授权页面地址上拼接上参数 tmp_code，并跳转
        window.location.href = `${goto}&tmp_code=${loginTmpCode}`;
        console.log(window.location.href);
    }
};
if (typeof window.addEventListener != 'undefined') {
    window.addEventListener('message', handleMessage, false);
} else if (typeof window.attachEvent != 'undefined') {
    window.attachEvent('onmessage', handleMessage);
}
/* Fetch */
const loginRedirect = token => {
    axios({
        url: 'http://eos-dev-api.horwincloud.com/authorize/user-by-token',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        params: { token },
        timeout: 10000,
    })
        .then(res => {
            console.log('输出数据', res.data.data);
            Core.Data.setUser(res.data.data.account);
            Core.Data.setOrgObj(res.user.org);
            Core.Data.setOrgId(res.data.data.org_id);
            Core.Data.setOrgType(res.data.data.org_type);
            Core.Data.setCurrency(res.data.data.currency);

            Core.Data.setLoginType(res.data.data.type); // 设置登录方的数字

            let loginType = TYPE_MAP[res.data.data.type];
            Core.Data.setUserType(loginType); // 设置登录方的文字

            getAuthority(
                res.data.data.id,
                res.data.data.type,
                loginType,
                res.data.data.role_id,
                res.data.data.flag_admin,
                res.data.data.flag_group_customer_admin,
            );
        })
        .catch(err => {
            console.log(err);
        });
};

/* methods */
const getAuthority = (userId, userType, loginType, roleId, flag_admin, flagGroupCustomerAdmin) => {
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
                    router.replace({ path: '/distributor', query: { from: 'login' } });
                }, 1000);
            } else {
                setTimeout(() => {
                    router.replace({ path: '/dashboard/index', query: { from: 'login' } });
                }, 1000);
            }
        });
};
</script>

<style lang="less" scoped>
.login-redirect {
    width: 100%;
    height: 100vh;
    position: relative;
    .load {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%);
    }
}
</style>

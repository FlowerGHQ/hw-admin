const appId = 'cli_a4f7ecfb66bb500d'; // 在飞书开放平台上注册的应用程序的App ID
const appSecret = 'tz2mi3zVFEE3Qbr8kqDCweER5p5SpMsE'; // 在飞书开放平台上注册的应用程序的App Secret

import router from '../../router';
import Core from '../index';
export default {
    apiAuth(jsApiList, success, error) {
        console.log('start apiAuth');
        // if (!window.h5sdk) {
        //     console.log('invalid h5sdk')
        //     alert('please open in feishu')
        //     return
        // }
        window.h5sdk.ready(() => {
            // 调用 JSAPI tt.requestAuthCode 获取 authorization code
            tt.requestAuthCode({
                appId: appId,
                // 获取成功后的回调
                success(res) {
                    console.log('getAuthCode succeed', res);
                    const code = res.code;
                    fetch(`http://eos-dev-api.horwincloud.com/feishu/authorize/authorize?code=${code}`)
                        .then(response => response.json())
                        .then(res => {
                            console.log('authorize res', res);
                            Core.Data.setToken(res.data.token);
                            Core.Data.setUser(res.data.user.account || '');
                            Core.Data.setOrgId(res.data.user.org_id);
                            Core.Data.setOrgType(res.data.user.org_type);
                            Core.Data.setCurrency(res.data.user?.org.currency); // 账号的单位
                            Core.Data.setLoginType(res.data.user.type);
                            Core.Data.setAuthority('');
                            let loginType = res.data.user.type;
                            let flagAdmin = res.data.user.flag_admin;
                            let flagGroupCustomerAdmin = res.data.user.flag_group_customer_admin;
                            let userId = res.data.user.id;
                            let authorityMap = {};
                            authorityMap[loginType] = true;
                            if (flagAdmin) {
                                authorityMap['MANAGER'] = true;
                            }
                            if (flagGroupCustomerAdmin) {
                                authorityMap['MANAGER_GROUP'] = true;
                            }
                            Core.Api.Authority.authUserAll({
                                user_id: userId,
                                user_type: loginType,
                            })
                                .then(res => {
                                    console.log('authUserAll', res);
                                    let list = res.list;
                                    for (const item of list) {
                                        authorityMap[item.key] = true;
                                    }
                                })
                                .finally(() => {
                                    Core.Data.setAuthority(authorityMap);
                                    if (loginType === Core.Const.USER.TYPE.ADMIN) {
                                        setTimeout(() => {
                                            router.replace({ path: '/distributor', query: { from: 'login' } });
                                        }, 1000);
                                    } else {
                                        setTimeout(() => {
                                            router.replace({ path: '/dashboard/index', query: { from: 'login' } });
                                        }, 1000);
                                    }
                                });
                        });
                },
                // 获取失败后的回调
                fail(err) {
                    console.log(`getAuthCode failed, err:`, JSON.stringify(err));
                },
            });
        });
    },
};

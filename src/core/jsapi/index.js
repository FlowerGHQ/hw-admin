const appId = 'your_app_id'; // 在飞书开放平台上注册的应用程序的App ID
const appSecret = 'your_app_secret'; // 在飞书开放平台上注册的应用程序的App Secret

export default {
    apiAuth(jsApiList, success, error) {
        console.log("start apiAuth");
        if (!window.h5sdk) {
            console.log('invalid h5sdk')
            alert('please open in feishu')
            return
        }
        // 调用config接口的当前网页url
        const myUrl = encodeURIComponent(location.href.split("#")[0]);
        // fetch(`/get_config_parameters?url=${myUrl}`)
        //     .then((response) =>
        //         response.json().then((res) => {
        //             console.log("get_signature", res);
        //             // 通过error接口处理API验证失败后的回调
        //             window.h5sdk.error((err) => {
        //                 throw ("h5sdk error:", JSON.stringify(err));
        //             });
        //             // 调用config接口进行鉴权
        //             window.h5sdk.config({
        //                 appId: res.appid,
        //                 timestamp: res.timestamp,
        //                 nonceStr: res.noncestr,
        //                 signature: res.signature,
        //                 jsApiList: [],
        //                 //鉴权成功回调
        //                 onSuccess: (res) => {
        //                     console.log(`config success: ${JSON.stringify(res)}`);
        //                 },
        //                 //鉴权失败回调
        //                 onFail: (err) => {
        //                     throw `config failed: ${JSON.stringify(err)}`;
        //                 },
        //             });
        //             // 完成鉴权后，便可在 window.h5sdk.ready 里调用 JSAPI
        //             window.h5sdk.ready(() => {
        //                 // window.h5sdk.ready回调函数在环境准备就绪时触发
        //                 // 调用 getUserInfo API 获取已登录用户的基本信息，详细文档参见https://open.feishu.cn/document/uYjL24iN/ucjMx4yNyEjL3ITM
        //                 tt.getUserInfo({
        //                     // getUserInfo API 调用成功回调
        //                     success(res) {
        //                         console.log(`getUserInfo success: ${JSON.stringify(res)}`);
        //                         // 单独定义的函数showUser，用于将用户信息展示在前端页面上
        //                         showUser(res.userInfo);
        //                     },
        //                     // getUserInfo API 调用失败回调
        //                     fail(err) {
        //                         console.log(`getUserInfo failed, err:`, JSON.stringify(err));
        //                     },
        //                 });
        //                 // 调用 showToast API 弹出全局提示框，详细文档参见https://open.feishu.cn/document/uAjLw4CM/uYjL24iN/block/api/showtoast
        //                 tt.showToast({
        //                     title: "鉴权成功",
        //                     icon: "success",
        //                     duration: 3000,
        //                     success(res) {
        //                         console.log("showToast 调用成功", res.errMsg);
        //                     },
        //                     fail(res) {
        //                         console.log("showToast 调用失败", res.errMsg);
        //                     },
        //                     complete(res) {
        //                         console.log("showToast 调用结束", res.errMsg);
        //                     },
        //                 });
        //             });
        //         })
        //     )
        //     .catch(function (e) {
        //         console.error(e);
        //     });
        fetch(`/get_appid`).then(response1 => response1.json().then(res1 => {
            console.log("get appid succeed: ", res1.appid);
            // 通过 error 接口处理 API 验证失败后的回调
            window.h5sdk.error(err => {
                throw ('h5sdk error:', JSON.stringify(err));
            });
            // 通过 ready 接口确认环境准备就绪后才能调用 API
            window.h5sdk.ready(() => {
                console.log("window.h5sdk.ready");
                console.log("url:", window.location.href);
                // 调用 JSAPI tt.requestAuthCode 获取 authorization code
                tt.requestAuthCode({
                    appId: res1.appid,
                    // 获取成功后的回调
                    success(res) {
                        console.log("getAuthCode succeed");
                        //authorization code 存储在 res.code
                        // 此处通过 fetch 把 code 传递给接入方服务端 Route: callback，并获得user_info
                        // 服务端 Route: callback 的具体内容请参阅服务端模块 server.py 的callback() 函数
                        fetch(`/callback?code=${res.code}`).then(response2 => response2.json().then(res2 => {
                            console.log("getUserInfo succeed");
                            // 示例 Demo 中单独定义的函数 showUser，用于将用户信息展示在前端页面上
                            showUser(res2);
                        }
                        )
                        ).catch(function (e) { console.error(e) })
                    },
                    // 获取失败后的回调
                    fail(err) {
                        console.log(`getAuthCode failed, err:`, JSON.stringify(err));
                    }
                })
            }
            )
        })).catch(function (e) { // 从服务端获取 app_id 失败后的处理
            console.error(e)
        })
    },
};
const appId = 'your_app_id'; // 在飞书开放平台上注册的应用程序的App ID
const appSecret = 'your_app_secret'; // 在飞书开放平台上注册的应用程序的App Secret

export default {
    apiAuth(jsApiList, success, error) {
        console.log("start apiAuth");
        if (!window.h5sdk) {
            console.log("invalid h5sdk");
            alert("please open in feishu");
            return;
        }
        // 调用config接口的当前网页url
        const myUrl = encodeURIComponent(location.href.split("#")[0]);
        // const params = {
        //     app_id: appId,
        //     timestamp: Date.now(),
        //     nonce: Math.random().toString(36).substring(2, 15),
        //     signature: '',
        //     url: window.location.href.split('#')[0],
        //     jsapi_list: jsApiList,
        // };
        // const url = `https://open.feishu.cn/open-apis/jsapi/config`;
        // const data = qs.stringify(params);
        // const headers = {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        // };
        // axios.post(url, data, { headers })
        //     .then(response => {
        //         const data = response.data;
        //         if (data.code === 0) {
        //             const config = data.data;
        //             window.FS.config({
        //                 beta: true,
        //                 debug: false,
        //                 appId: config.appId,
        //                 timestamp: config.timestamp,
        //                 nonceStr: config.nonce,
        //                 signature: config.signature,
        //                 jsApiList: jsApiList,
        //             });
        //             success && success();
        //         } else {
        //             console.error(data);
        //             error && error();
        //         }
        //     })
        //     .catch(error => {
        //         console.error(error);
        //         error && error();
        //     });
        fetch(`/get_config_parameters?url=${myUrl}`)
            .then((response) =>
                response.json().then((res) => {
                    console.log("get_signature", res);
                    // 通过error接口处理API验证失败后的回调
                    window.h5sdk.error((err) => {
                        throw ("h5sdk error:", JSON.stringify(err));
                    });
                    // 调用config接口进行鉴权
                    window.h5sdk.config({
                        appId: res.appid,
                        timestamp: res.timestamp,
                        nonceStr: res.noncestr,
                        signature: res.signature,
                        jsApiList: [],
                        //鉴权成功回调
                        onSuccess: (res) => {
                            console.log(`config success: ${JSON.stringify(res)}`);
                        },
                        //鉴权失败回调
                        onFail: (err) => {
                            throw `config failed: ${JSON.stringify(err)}`;
                        },
                    });
                    // 完成鉴权后，便可在 window.h5sdk.ready 里调用 JSAPI
                    window.h5sdk.ready(() => {
                        // window.h5sdk.ready回调函数在环境准备就绪时触发
                        // 调用 getUserInfo API 获取已登录用户的基本信息，详细文档参见https://open.feishu.cn/document/uYjL24iN/ucjMx4yNyEjL3ITM
                        tt.getUserInfo({
                            // getUserInfo API 调用成功回调
                            success(res) {
                                console.log(`getUserInfo success: ${JSON.stringify(res)}`);
                                // 单独定义的函数showUser，用于将用户信息展示在前端页面上
                                showUser(res.userInfo);
                            },
                            // getUserInfo API 调用失败回调
                            fail(err) {
                                console.log(`getUserInfo failed, err:`, JSON.stringify(err));
                            },
                        });
                        // 调用 showToast API 弹出全局提示框，详细文档参见https://open.feishu.cn/document/uAjLw4CM/uYjL24iN/block/api/showtoast
                        tt.showToast({
                            title: "鉴权成功",
                            icon: "success",
                            duration: 3000,
                            success(res) {
                                console.log("showToast 调用成功", res.errMsg);
                            },
                            fail(res) {
                                console.log("showToast 调用失败", res.errMsg);
                            },
                            complete(res) {
                                console.log("showToast 调用结束", res.errMsg);
                            },
                        });
                    });
                })
            )
            .catch(function (e) {
                console.error(e);
            });
    },
};
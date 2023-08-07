import ajax from './http';
import Const from '../const';
import Data from '../data';

class ApiBase {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    static getMark() {
        const LOGIN_TYPE = Const.LOGIN.TYPE
        const loginType = Data.getLoginType();
        let mark = 'admin/1'
        switch (loginType) {
            case LOGIN_TYPE.ADMIN:
                mark = 'admin/1'
                break;
            case LOGIN_TYPE.DISTRIBUTOR:
                mark = 'distributor/1'
                break;
            case LOGIN_TYPE.AGENT:
                mark = 'agent/1'
                break;
            case LOGIN_TYPE.STORE:
                mark = 'store/1'
                break;
        }
        return mark
    }
    static stringify(obj) {
        // transformObjectToUrlencodedData
        let p = [];
        for (let key in obj) {
            p.push(
                encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
            );
        }
        return p.join('&');
    }

    http(config, moduleName, args = {}) {
        let mark = ApiBase.getMark()
        const token = Data.getToken()

        const commonModule = ['Common']
        if (commonModule.includes(moduleName)) { mark = 'core/1' }

        let fullUrl = `${this.baseUrl}/${mark}/${config[1]}`;
        if (moduleName == 'Export') {
            return fullUrl + '?' + ApiBase.stringify({token, ...args})
        }
        switch(config[0]) {
            case 'PostJson':
                return ajax({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'post',
                    url: fullUrl,
                    params: { token },
                    data: args,
                })
            case 'GetJson':
                return ajax({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'get',
                    url: fullUrl,
                    params: {token, ...args},
                })
            case 'Post':
                console.log('config', config)
                return ajax({
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    method: 'post',
                    url: fullUrl,
                    data: ApiBase.stringify({token, ...args}),
                })
            case 'Get':
                return ajax({
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    method: 'get',
                    url: fullUrl,
                    params: {token, ...args},
                })
        }
    }
}

class Api extends ApiBase {
    constructor(baseUrl, apiList) {
        super(baseUrl);
        for (const moduleName in apiList) {
            this[moduleName] = Object.create(null);
            const module = apiList[moduleName];
            for (const functionName in module) {
                const config = module[functionName];
                this[moduleName][functionName] = ((config) => {
                    return (...args) => {
                        return super.http(config, moduleName, ...args);
                    };
                })(config);
            }
        }
    }
}

export default Api;

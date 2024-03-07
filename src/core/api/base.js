import ajax from './http';
import Const from '../const';
import Data from '../data';

class ApiBase {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    static getMark(moduleName) {
        const LOGIN_TYPE = Const.LOGIN.TYPE;
        const loginType = Data.getLoginType();
        const RETAILModule = ['RETAIL']; // 这个走的是 crm/1/.... 前缀
        const CLIENTModule = ['CLIENT']; // 这个走的是 client/1/.... 前缀
        let mark = 'admin/1';
        switch (loginType) {
            case LOGIN_TYPE.ADMIN:
                mark = 'admin/1';
                if (RETAILModule.includes(moduleName)) {
                    mark = 'crm/1';
                }
                break;
            case LOGIN_TYPE.DISTRIBUTOR:
                mark = 'distributor/1';
                console.log(moduleName);
                if (CLIENTModule.includes(moduleName)) {
                    mark = 'client/1';
                }
                break;
            case LOGIN_TYPE.AGENT:
                mark = 'agent/1';
                break;
            case LOGIN_TYPE.STORE:
                mark = 'store/1';
                break;
            case LOGIN_TYPE.SUPPLIER:
                mark = 'supplier/1';
                break;
        }
        return mark;
    }
    static stringify(obj) {
        // transformObjectToUrlencodedData
        let p = [];
        for (let key in obj) {
            p.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
    }

    http(config, moduleName, args = {}) {
        let mark = ApiBase.getMark(moduleName);
        const token = Data.getToken();
        const commonModule = ['Common'];
        const ThirdPartyModule = ['ThirdParty'];
        if (commonModule.includes(moduleName)) {
            mark = 'core/1';
        }
        if (ThirdPartyModule.includes(moduleName)) {
            mark = 'third-party/1';
        }
        let fullUrl = `${this.baseUrl}/${mark}/${config[1]}`;
        if (moduleName == 'Export') {
            return fullUrl + '?' + ApiBase.stringify({ token, ...args });
        }
        switch (config[0]) {
            case 'PostJson':
                return ajax({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'post',
                    url: fullUrl,
                    params: { token },
                    data: args,
                });
            case 'GetJson':
                return ajax({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'get',
                    url: fullUrl,
                    params: { token, ...args },
                });
            case 'Post':
                console.log('config', config);
                return ajax({
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    method: 'post',
                    url: fullUrl,
                    data: ApiBase.stringify({ token, ...args }),
                });
            case 'Get':
                return ajax({
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    method: 'get',
                    url: fullUrl,
                    params: { token, ...args },
                });
            case 'BlobPost':
                return ajax({
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'post',
                    url: fullUrl,
                    responseType: 'blob',
                    // 参数放入body中
                    data: args,
                    params: { token },
                });
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
                this[moduleName][functionName] = (config => {
                    return (...args) => {
                        return super.http(config, moduleName, ...args);
                    };
                })(config);
            }
        }
    }
}

export default Api;

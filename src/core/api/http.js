import axios from 'axios';
import { message } from 'ant-design-vue';
import i18n from '../i18n';
import Data from '../data';

console.log('i18n.global', i18n.global)

const showMessage = (msg) => {
    message.error(msg);
};

const errorHandle = (status, message = '未知错误') => {
    if (message.includes('登录状态已过期，请重新登录')) {
        window.location.href = window.location.href.split('#')[0] + '#/login'
        return showMessage(message);
    }
    if (message.includes('timeout')) {
        return showMessage('请求超时');
    }
    if (status === -1) {
        return showMessage('系统异常');
    }
    if (status >= 1000) {
        let lang = Data.getLang()
        switch(lang) {
            case "zh" :
                return showMessage(i18n.global.messages.zh.error_code[status]);
                break;
            case "en" :
                return showMessage(i18n.global.messages.en.error_code[status]);
                break;
        }
    }
    showMessage(message);
};

var instance = axios.create({ timeout: 1000 * 15 });
// instance.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
instance.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded;charset=UTF-8';

instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.error(error)
);

instance.interceptors.response.use(
    (res) => {
        if (res.status === 200) {
            if (res.data.code === 0) {
                return res.data.data;
                // return Promise.resolve(res.data.data);
            } else {
                errorHandle(res.data.code, res.data.message);
                return Promise.reject(res);
            }
        } else {
            Promise.reject(res);
        }
    },
    (error) => {
        console.log('error:', error)
        const { response } = error;
        if (response) {
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            errorHandle('other', error.toString());
            if (window.navigator.onLine) {
                return Promise.reject(error);
            }
        }
    }
);

export default instance;

import axios from 'axios';
import { message } from 'ant-design-vue';
import i18n from '../i18n';
import Data from '../data';

const shownErrorMessages = [];
const showMessage = (msg) => {
    message.error(msg);
};

const errorHandle = (status, message = i18n.global.t('error_code.unknown')) => {
    if (message.includes('登录状态已过期，请重新登录')) {
        window.location.href = window.location.href.split('#')[0] + '#/login'
        // return showMessage(i18n.global.t('error_code.expire'));
        return
    }
    if (message.includes('timeout')) {
        return showMessage(i18n.global.t('error_code.timeout'));
    }
    if (status === -1) {
        return showMessage(i18n.global.t('error_code.system'));
    }
    // if (status >= 1000) {
    //     try {
    //         message = JSON.parse(message)
    //     } catch (err) {
    //         message = {}
    //     }
    //     return showMessage(i18n.global.t('error_code.' + status, message))
    // }
    // showMessage(message);
    if (status >= 1000) {
        try {
            message = JSON.parse(message)
        } catch (err) {
            message = {}
        }
        const errorMessageKey = i18n.global.t('error_code.' + status, message);
        if (shownErrorMessages.includes(errorMessageKey)) {
            return;
        }
        shownErrorMessages.push(errorMessageKey);
        return showMessage(errorMessageKey);
    }
    const errorMessageKey = message;
    if (shownErrorMessages.includes(errorMessageKey)) {
        return;
    }
    shownErrorMessages.push(errorMessageKey);
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

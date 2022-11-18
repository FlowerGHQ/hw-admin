import Const from './const';

function isLocalStorageUsable() {
    const localStorageTestKey = '__localStorage_support_test';
    const localStorageTestValue = 'test';
    let isSupport = false;

    try {
        localStorage.setItem(localStorageTestKey, localStorageTestValue);
        if (
            localStorage.getItem(localStorageTestKey) === localStorageTestValue
        ) {
            isSupport = true;
        }
        localStorage.removeItem(localStorageTestKey);
        return isSupport;
    } catch (e) {
        if (
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
            console.warn('localStorage 存储已达上限！');
        } else {
            console.warn('当前浏览器不支持 localStorage！');
        }
        return isSupport;
    }
}

function normalizeKey(key) {
    if (typeof key !== 'string') {
        console.warn(`${key} used as a key, but it is not a string.`);
        key = String(key);
    }
    return key;
}

function serialize(value, callback) {
    try {
        const valueString = JSON.stringify(value);
        callback(null, valueString);
    } catch (e) {
        callback(e);
    }
}
class StorageHandler {
    ready() {
        if (this.isSupport == null) {
            this.isSupport = isLocalStorageUsable();
        }
        return this.isSupport
    }

    setItem(key, value) {
        key = normalizeKey(key);
        if (this.ready()) {
            if (value === undefined) {
                value = null;
            }
            serialize(value, (error, valueString) => {
                if (error) {
                    return;
                }
                try {
                    // 可能会因超出最大存储空间，存储失败。
                    const FINAL_KEY = `${Const.DATA.KEY_PREFIX}${key}`;
                    localStorage.setItem(FINAL_KEY, valueString);
                } catch (e) {
                    console.log('e', e);
                }
            });
        }
    }
    getItem(key) {
        key = normalizeKey(key);
        const FINAL_KEY = `${Const.DATA.KEY_PREFIX}${key}`;
        return JSON.parse(localStorage.getItem(FINAL_KEY));
    }

    setToken(value) {
        this.setItem(Const.DATA.KEY_TOKEN, value);
    }
    getToken() {
        return this.getItem(Const.DATA.KEY_TOKEN)
    }

    setUser(value) {
        this.setItem(Const.DATA.KEY_USER, value);
    }
    getUser() {
        return this.getItem(Const.DATA.KEY_USER)
    }

    setOrgId(value) {
        this.setItem(Const.DATA.KEY_ORG_ID, value);
    }
    getOrgId() {
        return this.getItem(Const.DATA.KEY_ORG_ID)
    }

    setOrgType(value) {
        this.setItem(Const.DATA.KEY_ORG_TYPE, value);
    }
    getOrgType() {
        return this.getItem(Const.DATA.KEY_ORG_TYPE)
    }
	setCurrency(value) {
		this.setItem(Const.DATA.KEY_CURRENCY, value);
	}
	getCurrency() {
		return this.getItem(Const.DATA.KEY_CURRENCY)
	}

    setUserType(value) {
        this.setItem(Const.DATA.KEY_USER_TYPE, value);
    }
    getUserType() {
        return this.getItem(Const.DATA.KEY_USER_TYPE)
    }

    setLoginType(value) {
        this.setItem(Const.DATA.KEY_LOGIN_TYPE, value);
    }
    getLoginType() {
        return this.getItem(Const.DATA.KEY_LOGIN_TYPE)
    }

    setAuthority(value) {
        this.setItem(Const.DATA.KEY_AUTHORITY_LIST, value);
    }
    getAuthority() {
        return this.getItem(Const.DATA.KEY_AUTHORITY_LIST)
    }

    setLang(value) {
        this.setItem(Const.DATA.KEY_LANGUAGE, value);
    }
    getLang() {
        return this.getItem(Const.DATA.KEY_LANGUAGE)
    }

    setFieldDisplay(key, value) {
        let field = this.getItem(Const.DATA.KEY_FIELD_DISPLAY) || {}
        field[key] = value

        this.setItem(Const.DATA.KEY_FIELD_DISPLAY, field);
    }
    getFieldDisplay(key) {
        let field = this.getItem(Const.DATA.KEY_FIELD_DISPLAY) || {}
        return key ? (field[key] || []) : {}
    }
	setTabPosition(value) {
		this.setItem(Const.DATA.TAB_POSITION, value);
	}
	getTabPosition() {
		return this.getItem(Const.DATA.TAB_POSITION)
	}
	setCountryCode(value) {
        this.setItem(Const.DATA.COUNTRY_CODE, value);
    }
	getCountryCode() {
		return this.getItem(Const.DATA.COUNTRY_CODE)
	}
    setGroupId(value) {
        this.setItem(Const.DATA.GROUP_ID, value);
    }
    getGroupId() {
		return this.getItem(Const.DATA.GROUP_ID)
	}
}

export default new StorageHandler();

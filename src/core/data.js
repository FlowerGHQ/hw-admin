import Const from "./const";

function isLocalStorageUsable() {
    const localStorageTestKey = "__localStorage_support_test";
    const localStorageTestValue = "test";
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
            e.name === "QuotaExceededError" ||
            e.name === "NS_ERROR_DOM_QUOTA_REACHED"
        ) {
            console.warn("localStorage 存储已达上限！");
        } else {
            console.warn("当前浏览器不支持 localStorage！");
        }
        return isSupport;
    }
}

function normalizeKey(key) {
    if (typeof key !== "string") {
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
        return this.isSupport;
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
                    console.log("e", e);
                }
            });
        }
    }
    getItem(key) {
        key = normalizeKey(key);
        const FINAL_KEY = `${Const.DATA.KEY_PREFIX}${key}`;
        return JSON.parse(localStorage.getItem(FINAL_KEY));
    }

    removeItem(key) {
        key = normalizeKey(key);
        const FINAL_KEY = `${Const.DATA.KEY_PREFIX}${key}`;
        return localStorage.removeItem(FINAL_KEY);
    }

    setToken(value) {
        this.setItem(Const.DATA.KEY_TOKEN, value);
    }
    getToken() {
        return this.getItem(Const.DATA.KEY_TOKEN);
    }

    setUser(value) {
        this.setItem(Const.DATA.KEY_USER, value);
    }
    getUser() {
        return this.getItem(Const.DATA.KEY_USER);
    }

    setOrgId(value) {
        this.setItem(Const.DATA.KEY_ORG_ID, value);
    }
    getOrgId() {
        return this.getItem(Const.DATA.KEY_ORG_ID);
    }

    setOrgType(value) {
        this.setItem(Const.DATA.KEY_ORG_TYPE, value);
    }
    getOrgType() {
        return this.getItem(Const.DATA.KEY_ORG_TYPE);
    }
    setCurrency(value) {
        this.setItem(Const.DATA.KEY_CURRENCY, value);
    }
    getCurrency() {
        return this.getItem(Const.DATA.KEY_CURRENCY);
    }

    setUserType(value) {
        this.setItem(Const.DATA.KEY_USER_TYPE, value);
    }
    getUserType() {
        return this.getItem(Const.DATA.KEY_USER_TYPE);
    }

    setLoginType(value) {
        this.setItem(Const.DATA.KEY_LOGIN_TYPE, value);
    }
    getLoginType() {
        return this.getItem(Const.DATA.KEY_LOGIN_TYPE);
    }

    setAuthority(value) {
        this.setItem(Const.DATA.KEY_AUTHORITY_LIST, value);
    }
    getAuthority() {
        return this.getItem(Const.DATA.KEY_AUTHORITY_LIST);
    }

    setLang(value) {
        this.setItem(Const.DATA.KEY_LANGUAGE, value);
    }
    getLang() {
        return this.getItem(Const.DATA.KEY_LANGUAGE);
    }

    setFieldDisplay(key, value) {
        let field = this.getItem(Const.DATA.KEY_FIELD_DISPLAY) || {};
        field[key] = value;

        this.setItem(Const.DATA.KEY_FIELD_DISPLAY, field);
    }
    getFieldDisplay(key) {
        let field = this.getItem(Const.DATA.KEY_FIELD_DISPLAY) || {};
        return key ? field[key] || [] : {};
    }
    setTabPosition(value) {
        this.setItem(Const.DATA.TAB_POSITION, value);
    }
    getTabPosition() {
        return this.getItem(Const.DATA.TAB_POSITION);
    }
    setCountryCode(value) {
        this.setItem(Const.DATA.COUNTRY_CODE, value);
    }
    getCountryCode() {
        return this.getItem(Const.DATA.COUNTRY_CODE);
    }
    setGroupId(value) {
        this.setItem(Const.DATA.GROUP_ID, value);
    }
    getGroupId() {
        return this.getItem(Const.DATA.GROUP_ID);
    }

    // 判断这个是否是超级管理员
    setManager(value) {
        this.setItem(Const.DATA.SUPER_ADMIN, value);
    }
    getManager() {
        return this.getItem(Const.DATA.SUPER_ADMIN) || false;
    }
    clearManager() {
        this.removeItem(Const.DATA.SUPER_ADMIN);
    }
    // 存客服分配线索
    setCustomerServiceClue(value) {
        this.setItem(Const.DATA.CUSTOMER_SERVICE_CLUE, value);
    }
    getCustomerServiceClue() {
        return this.getItem(Const.DATA.CUSTOMER_SERVICE_CLUE) || [];
    }
    clearCustomerServiceClue() {
        this.removeItem(Const.DATA.CUSTOMER_SERVICE_CLUE);
    }

    // 供应链存储-草稿数据
    /**
     * 
     *  SUPPLY_CHAIN: 'supply-chain',
        SUPPLY_Daft_CHAIN: 'supply-draft-chain',
        SUPPLY_DETAILS_CHAIN: 'supply-details-chain',
        SUPPLY_STEP: 'supply-step',
        SUPPLY_ISREAD: 'supply-isread',
     * */
    // 供应链存储-真数据/校验通过
    setSupplyChain(value) {
        this.setItem(Const.DATA.SUPPLY_CHAIN, value);
    }
    getSupplyChain() {
        return this.getItem(Const.DATA.SUPPLY_CHAIN) || "";
    }
    setSupplyDraftChain(value) {
        this.setItem(Const.DATA.SUPPLY_Daft_CHAIN, value);
    }
    getSupplyDraftChain() {
        return this.getItem(Const.DATA.SUPPLY_Daft_CHAIN) || "";
    }
    // 设置第几步
    setStep(value) {
        this.setItem(Const.DATA.SUPPLY_STEP, value);
    }
    getStep() {
        return this.getItem(Const.DATA.SUPPLY_STEP) || undefined;
    }
    // 设置是否已经阅读
    setRead(value) {
        this.setItem(Const.DATA.SUPPLY_ISREAD, value);
    }
    getRead() {
        return this.getItem(Const.DATA.SUPPLY_ISREAD) || undefined;
    }
    // 是否已经 提交了
    setSubmitEd(value) {
        this.setItem(Const.DATA.SUPPLY_SUBMITED, value);
    }
    getSubmitEd() {
        return this.getItem(Const.DATA.SUPPLY_SUBMITED) || false;
    }
    // 保存用户类型列表
    setUserTypeList(value) {
        return this.setItem(Const.DATA.USER_TYPE_LIST, value);
    }
    getUserTypeList() {
        return this.getItem(Const.DATA.USER_TYPE_LIST) || [];
    }
    clearUserTypeList() {
        this.removeItem(Const.DATA.USER_TYPE_LIST);
    }
    // 保存登录传参信息
    setLoginMes(value) {
        return this.setItem(Const.DATA.LOGIN_MES, value);
    }
    getLoginMes() {
        return this.getItem(Const.DATA.LOGIN_MES) || undefined;
    }
    clearLoginMes() {
        this.removeItem(Const.DATA.LOGIN_MES);
    }
    setSalesData(value) {
        return this.setItem(Const.DATA.SALES_DATA, value);
    }
    getSalesData() {
        return this.getItem(Const.DATA.SALES_DATA) || [];
    }
    clearSalesData() {
        this.removeItem(Const.DATA.SALES_DATA);
    }
    // 商品管理的草稿信息
    setGoodsDraft(value) {
        return this.setItem(Const.DATA.GOODS_DRAFT, value);
    }
    getGoodsDraft() {
        return this.getItem(Const.DATA.GOODS_DRAFT) || undefined;
    }
    clearGoodsDraft() {
        this.removeItem(Const.DATA.GOODS_DRAFT);
    }
    // 设置购物车选中商品
    setCartData(value) {
        return this.setItem(Const.DATA.CART_DATA, value);
    }
    getCartData() {
        return this.getItem(Const.DATA.CART_DATA) || [];
    }
    clearCartData() {
        this.removeItem(Const.DATA.CART_DATA);
    }
}

export default new StorageHandler();

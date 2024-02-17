import { createStore } from 'vuex';
import Data from '../core/data';
import { SUPPLY_CHAIN } from './supply';

const store = createStore({
    state() {
        return {
            lang: 'zh',
            isRead: false,
            mallSearchKey: '',
            shopCartNum: 0,
        };
    },
    mutations: {
        switchLang(state, props) {
            if (props) {
                const lang = props;
                state.lang = lang;
                Data.setLang(lang);
            } else {
                state.lang = 'zh';
                Data.setLang('zh');
            }
        },
        setMallKey(state, props) {
            if (props || props === '') {
                state.mallSearchKey = props;
            }
        },
        clearMallKey(state) {
            state.mallSearchKey = '';
        },
        setShopCartNum(state, props) {
            if (props || props === '') {
                state.shopCartNum = props;
            }
        },
        // 设置是否已经阅读
        setRead(state, read) {
            state.isRead = read;
        },
    },
    // modules
    modules: {
        SUPPLY_CHAIN,
    },
});

export default store;

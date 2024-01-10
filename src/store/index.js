import { createStore } from 'vuex'
import Data from '../core/data'

const store = createStore({
    state () {
        return {
            lang: 'zh',
            mallSearchKey: '',
            shopCartNum: 0,
        }
    },
    mutations: {
        switchLang (state, props) {
            if (props) {
                const lang = props
                state.lang = lang
                Data.setLang(lang)
            } else {
                state.lang = 'zh'
                Data.setLang('zh')
            }
        },
        setMallKey(state, props) {
            if (props || props === '') {
                state.mallSearchKey = props
            }
        },
        setShopCartNum(state, props) {
            if (props || props === '') {
                state.shopCartNum = props
            }
        },
    }
})

export default store
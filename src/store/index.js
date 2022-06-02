import { createStore } from 'vuex'
import Data from '../core/data'

const store = createStore({
    state () {
        return {
            lang: 'zh'
        }
    },
    mutations: {
        switchLang (state) {
            if (state.lang === 'zh') {
                state.lang = 'en'
                Data.setLang('en')
            } else {
                state.lang = 'zh'
                Data.setLang('en')
            }
        }
    }
})

export default store
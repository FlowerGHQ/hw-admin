import { createStore } from 'vuex'
import Data from '../core/data'

const store = createStore({
    state () {
        return {
            lang: 'zh'
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
        }
    }
})

export default store
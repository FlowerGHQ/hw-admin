import { createStore } from 'vuex'

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
            } else {
                state.lang = 'zh'
            }
        }
    }
})

export default store
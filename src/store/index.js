import { createStore } from 'vuex'
import Data from '../core/data'

const store = createStore({
    state () {
        return {
            lang: 'zh',
            isRead:false
        }
    },
    mutations: {
        switchLang (state) {
            if (state.lang === 'zh') {
                state.lang = 'en'
                Data.setLang('en')
            } else {
                state.lang = 'zh'
                Data.setLang('zh')
            }
        },
        // 设置是否已经阅读
        setRead(state,read){
            state.isRead = read
        }
    }
})

export default store
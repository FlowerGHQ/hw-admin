import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import Util from './core/utils'
import i18n from './core/i18n'
// import Antd from 'ant-design-vue'
// import './core/vconsole'

import { message, notification } from 'ant-design-vue';
import MyDirective from './core/myDirective/index.js'
// import 'default-passive-events' // 解决ios下click事件报错
// "default-passive-events": "^2.0.0",


// import address from './assets/js/address/cascader-address-options.js'

// 引入样式
import '@/assets/styles/reset.css';
import 'ant-design-vue/dist/antd.less';
import '@/assets/iconfont/iconfont.css';
import '@/assets/styles/public.less';
import '@/assets/styles/common.less';
import '@/assets/font-family/index.css'
// svg
import 'virtual:svg-icons-register';

const app = createApp(App)

app.config.globalProperties.$Util = Util
app.config.globalProperties.$auth = Util.auth
app.config.globalProperties.$UserAuth = Util.userAuth  // 判断登录是哪个账号
app.config.globalProperties.$message = message
app.config.globalProperties.$notification = notification
app.config.globalProperties.$confirm = Util.confirm

app.use(router).use(store).use(i18n).mount('#app')

// 自定义指令
const directive = new MyDirective(app)
directive.default()
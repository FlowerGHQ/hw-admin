import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import Util from './core/utils'
import i18n from './core/i18n'
import Antd from 'ant-design-vue'
// import './core/vconsole'
console.log('i18n', i18n)
import {message,notification} from 'ant-design-vue';
import MyDirective from './core/myDirective/index.js'

// import address from './assets/js/address/cascader-address-options.js'

// 引入样式
import '@/assets/styles/reset.css';
import 'ant-design-vue/dist/antd.less';
import '@/assets/iconfont/iconfont.css';
import '@/assets/styles/public.less';

const app = createApp(App)

app.config.globalProperties.$Util = Util
app.config.globalProperties.$auth = Util.auth
app.config.globalProperties.$UserAuth = Util.userAuth  // 判断登录是哪个账号
app.config.globalProperties.$message = message
app.config.globalProperties.$notification = notification
app.config.globalProperties.$confirm = Util.confirm

app.use(router).use(Antd).use(store).use(i18n).mount('#app')

// 自定义指令
const directive = new MyDirective(app)
directive.default()
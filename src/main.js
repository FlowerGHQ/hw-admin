import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import Util from './core/utils'
import {message,notification,Modal} from 'ant-design-vue';
// 引入样式
import '@/assets/styles/reset.css';
import 'ant-design-vue/dist/antd.less';
import '@/assets/styles/public.less';
import '@/assets/iconfont/iconfont.css';

const app = createApp(App)

app.config.globalProperties.$Util = Util
app.config.globalProperties.$auth = Util.auth
app.config.globalProperties.$message = message
app.config.globalProperties.$notification = notification
app.config.globalProperties.$confirm = Modal.confirm

app.use(router).mount('#app')
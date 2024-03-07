import Layout from '../views/fs-login/index.vue';

// 飞书登录相关页面
const fsLogin = {
    path: '/fs-login',
    component: Layout,
    name: 'FsLogin',
    meta: {
        title: '飞书扫码登录',
        title_en: 'Feishu Scan Code Login',
        hidden: true,
    },
};
export { fsLogin };

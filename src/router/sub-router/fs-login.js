// 飞书登录相关页面
const fsLogin = {
    path: '/feishu-login',
    component: () => import('@/views/layout/index.vue'),
    name: 'FeishuLogin',
    meta: {
        title: '飞书扫码登录',
        title_en: 'Feishu Scan Code Login',
        hidden: true,
    },
};
export { fsLogin };

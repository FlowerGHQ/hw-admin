import { createRouter, createWebHashHistory } from 'vue-router';

import Core from '../core';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { message } from 'ant-design-vue';

import routes from './routes';

NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 500, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 初始化时的最小百分比
});

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 设置路由白名单(其实网上很多做法用meta的requiresAuth就是跟白名单一样的)
function inWhiteList(toPath) {
    const whiteList = ['/', '/login', '/loginMall', '/login-redirect', '/feishu-login', '/login/feishu'];
    const bool = whiteList.some(el => el == toPath); // 有一个正确就正确
    return bool;
}
router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0); // 跳转页面后 滚动条默认置顶
    const token = Core.Data.getToken();
    const loginType = Core.Data.getLoginType();
    NProgress.start();
    if (to.meta.title) {
        const lang = Core.Data.getLang();
        document.title = 'EOS' + ' | ' + (lang === 'zh' ? to.meta.title : to.meta.title_en);
    }
    if (inWhiteList(to.path)) {
        if (to.path === '/') next('/login');
        next();
        NProgress.done();
        return;
    }
    if (!token) {
        // 没登录
        message.info('请先登录');
        NProgress.done();
        next('/login');
    } else {
        // 已登录
        const roles = to.meta.roles;
        if (roles) {
            // 如果进入的路由meta中有roles规则
            if (roles.includes(loginType)) {
                next();
            } else {
                // 表前userType禁止访问
                message.warning('当前身份无法访问');
                next('/');
                NProgress.done();
            }
        } else {
            // 没有roles规则直接放行
            next();
        }
    }
});

router.afterEach((to, from) => {
    NProgress.done();
});

export default router;

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
    minimum: 0.3 // 初始化时的最小百分比
});

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
	let _this = this
    NProgress.start();
    if (to.meta.title) {
        /* let sys_name = Core.Data.getLoginType() === 1 ? '管理 | ' : '运营 | '
        document.title = sys_name + to.meta.title */
        let org_name = Core.Util.userTypeFilter(Core.Data.getLoginType())
        document.title = org_name + ' | ' + to.meta.title
    }
    if (to.path === '/login') {
        // 去登录页面直接放行
        NProgress.done();
        next();
    } else {
        const token = Core.Data.getToken();
        const loginType = Core.Data.getLoginType()
        if (!token) {
            // 没登录
            message.info('请先登录');
            NProgress.done();
            next('/login');
        } else {
            // 已登录
            const roles = to.meta.roles;
            // next();
            if (roles) {
                // 如果进入的路由meta中有roles规则
                if (roles.includes(loginType)) {
                    // 如果当前usertType在roles arr中有
                    next();
                } else {
                    // 表前userType禁止访问
                    message.warning('当前身份无法访问');
                    next('/dashboard');
                    NProgress.done();
                }
            } else {
                // 没有roles规则直接放行
                next();
            }
        }
    }
});

router.afterEach((to, from) => {
    NProgress.done();
});

export default router;




import Const from "../core/const"
const LOGIN_TYPE = Const.LOGIN.TYPE

import Layout from '../views/layout/index.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        hidden: true
    },
    {   // 登录
        path: '/login',
        hidden: true,
        component: () => import('@/views/Login.vue'),
        meta: {
            title: '登录',
        }
    },
    {   // 时效看板
        path: '/dashboard',
        component: Layout,
        // hidden: true,
        meta: {
            title: '时效看板',
            icon: 'i_s_dashboard',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/Dashboard.vue'),
                meta: {
                    title: '时效看板',
                }
            },
        ]
    },
    {   // 维修单
        path: '/maintain',
        component: Layout,
        meta: {
            title: '维修单管理',
            icon: 'i_s_dashboard',
            // auth: ['dashboard'],
            // roles: [LOGIN_TYPE.ADMIN],
        },
        children: [
            {
                path: 'maintain-list',
                name: 'MaintainList',
                component: () => import('@/views/maintain/maintain-list.vue'),
                meta: {
                    title: '维修单列表',
                }
            },
            {
                path: 'maintain-detail',
                name: 'MaintainDetail',
                component: () => import('@/views/maintain/maintain-edit.vue'),
                meta: {
                    title: '维修单编辑',
                }
            },
        ]
    },
];

export default routes;

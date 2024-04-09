import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';
import Layout from '../../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 系统
const SYSTEM = {
    // 系统管理
    path: '/system',
    component: Layout,
    redirect: '/system/user-list',
    name: 'SystemManagement',
    type: [ROUTER_TYPE.SYSTEM],
    meta: {
        title: '系统管理',
        title_en: 'System Management',
        icon: 'i_menu_xitongguanli',
        auth: ['sys.sys', 'MANAGER'],
    },
    children: [
        {
            path: 'user-list',
            name: 'UserList',
            component: () => import('@/views/user/user-list.vue'),
            meta: {
                title: '用户列表',
                title_en: 'User',
                auth: ['sys.sys.user', 'MANAGER'],
            },
        },
        {
            path: 'user-edit',
            name: 'UserEdit',
            component: () => import('@/views/user/user-edit.vue'),
            meta: {
                hidden: true,
                title: '用户编辑',
                parent: '/user/user-list',
            },
        },
        {
            path: 'user-edit-fs',
            name: 'UserEditFs',
            component: () => import('@/views/user/user-edit-fs.vue'),
            meta: {
                hidden: true,
                title: '飞书添加用户',
                parent: '/user/user-list-fs',
            },
        },
        {
            path: 'user-detail',
            name: 'UserDetail',
            component: () => import('@/views/user/user-detail.vue'),
            meta: {
                hidden: true,
                title: '用户详情',
                parent: '/user/user-list',
            },
        },
        {
            path: 'user-scope',
            name: 'UserScope',
            component: () => import('@/views/user/components/UserScope.vue'),
            meta: {
                hidden: true,
                title: '用户详情',
                parent: '/user/user-list',
            },
        },
        {
            path: 'auth-role-list',
            name: 'RoleList',
            component: () => import('@/views/authority/auth-role-list.vue'),
            meta: {
                title: '角色管理',
                title_en: 'Roles',
                auth: ['sys.sys.role', 'MANAGER'],
            },
        },
        {
            path: 'auth-role-edit',
            name: 'RoleEdit',
            component: () => import('@/views/authority/auth-role-edit.vue'),
            meta: {
                hidden: true,
                title: '角色编辑',
                parent: '/authority/auth-role-list',
            },
        },
        {
            path: 'allot-org-auth',
            name: 'AllotOrgAuth',
            component: () => import('@/views/system/allot-org-auth.vue'),
            meta: {
                title: '权限管理',
                title_en: 'Authority Management',
                auth: ['sys.sys.authority', 'MANAGER'],
            },
        },
        {
            path: 'system-file-edit',
            name: 'SystemFileEdit',
            component: () => import('@/views/system/system-file-edit.vue'),
            meta: {
                hidden: true,
                title: '附件编辑',
                parent: '/system/system-file-list',
            },
        },
        {
            path: 'notice-list',
            name: 'NoticeList',
            component: () => import('@/views/system/notice-list.vue'),
            meta: {
                title: '消息列表',
                title_en: 'Messages ',
                auth: ['sys.sys.message', 'MANAGER'],
            },
        },
        {
            path: 'notice-edit',
            name: 'NoticeEdit',
            component: () => import('@/views/system/notice-edit.vue'),
            meta: {
                hidden: true,
                title: '新增消息',
                parent: '/system/notice-list',
            },
        },
        {
            path: 'notice-detail',
            name: 'NoticeDetail',
            component: () => import('@/views/system/notice-detail.vue'),
            meta: {
                hidden: true,
                title: '消息详情',
                parent: '/system/notice-list',
            },
        },
        {
            path: 'system-file-list',
            name: 'SystemFileList',
            component: () => import('@/views/system/system-file-list.vue'),
            meta: {
                title: '文件管理',
                title_en: 'Files ',
                auth: ['sys.sys.file', 'MANAGER'],
            },
        },
        {
            path: 'print_template_list',
            name: 'PrintTemplatelList',
            component: () => import('@/views/system/print_template_list.vue'),
            meta: {
                title: '标签规则',
                title_en: 'Label rules ',
                auth: ['sys.sys.label', 'MANAGER'],
            },
        },
    ],
};

export { SYSTEM };

import Const from '../core/const';
import Util from '../core/utils';
import Data from '../core/data';
import Layout from '../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.LOGIN.ROUTER_TYPE;

// 系统
const system = {
    // 系统管理
    path: '/system',
    component: Layout,
    redirect: '/system/system-file-list',
    name: 'SystemManagement',
    type: [ROUTER_TYPE.SYSTEM],
    meta: {
        title: '系统管理',
        title_en: 'System Management',
        icon: 'i_menu_xitongguanli',
        auth: ['MANAGER'], // 管理员
    },
    children: [
        {
            path: 'user-list',
            name: 'UserList',
            component: () => import('@/views/user/user-list.vue'),
            meta: {
                title: '用户列表',
                title_en: 'User',
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
        /* {
            path: 'auth-user-list',
            name: 'AuthUserList',
            component: () => import('@/views/authority/auth-user-list.vue'),
            meta: {
                title: '用户权限',
            }
        },
        {
            path: 'auth-user-edit',
            name: 'AuthUserEdit',
            component: () => import('@/views/authority/auth-user-edit.vue'),
            meta: {
                hidden: true,
                title: '用户权限编辑',
                parent: '/authority/auth-user-list',
            }
        },*/
        // {
        //     path: 'dept-list',
        //     name: 'DeptList',
        //     component: () => import('@/views/system/dept-list.vue'),
        //     meta: {
        //         title: '部门管理',
        //         title_en: 'Dept',
        //     }
        // },
        {
            path: 'auth-role-list',
            name: 'RoleList',
            component: () => import('@/views/authority/auth-role-list.vue'),
            meta: {
                title: '角色管理',
                title_en: 'Roles',
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
                roles: [LOGIN_TYPE.ADMIN],
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
                roles: [LOGIN_TYPE.ADMIN],
            },
        },
        {
            path: 'notice-list',
            name: 'NoticeList',
            component: () => import('@/views/system/notice-list.vue'),
            meta: {
                title: '消息列表',
                title_en: 'Messages ',
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
                roles: [LOGIN_TYPE.ADMIN],
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
            },
        },
        {
            path: 'print_template_list',
            name: 'PrintTemplatelList',
            component: () => import('@/views/system/print_template_list.vue'),
            roles: [LOGIN_TYPE.ADMIN],
            meta: {
                title: '标签规则',
                roles: [LOGIN_TYPE.ADMIN, LOGIN_TYPE.DISTRIBUTOR],
                title_en: 'Label rules ',
            },
        },
    ],
};

export { system };

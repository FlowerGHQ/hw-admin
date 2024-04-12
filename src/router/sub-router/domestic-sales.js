import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';
import Layout from '../../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 国内销售
const domesticSales = [
    {
        // 工作台
        path: '/crm-staging',
        component: Layout,
        redirect: '/crm-staging/staging',
        name: 'crm-staging',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '工作台',
            title_en: 'Staging',
            icon: 'i_crm_bo',
            hidden: true,
        },
        children: [
            {
                path: 'staging',
                name: 'CrmStaging',
                component: () => import('@/views/crm-staging/staging.vue'),
                meta: {
                    title: '工作台',
                    title_en: 'Staging',
                },
            },
            {
                // 工作台详情
                path: 'staging-detail',
                name: 'stagingDetail',
                component: () => import('@/views/crm-staging-detail/staging.vue'),
                meta: {
                    title: '工作台详情',
                    title_en: 'StagingDetail',
                    hidden: true,
                },
            },
        ],
    },
    {
        // 用户中心
        path: '/user-center',
        component: Layout,
        redirect: '/user-center/clue-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '用户中心',
            title_en: 'User Center',
            icon: 'i_menu_yonghuzhognxin',
            hidden: true,            
        },
        children: [
            {
                path: 'clue-list',
                name: 'clueList',
                component: () => import('@/views/crm-customer-center/clue-list.vue'),
                meta: {
                    title: '线索',
                    title_en: 'Clue List',
                    icon: 'i_home',
                },
            },
            {
                path: 'user-list',
                name: 'userList',
                component: () => import('@/views/crm-customer-center/user-list.vue'),
                meta: {
                    title: '用户列表',
                    title_en: 'User List',
                    icon: 'i_home',
                },
            },
            {
                path: 'user-edit',
                name: 'userEdit',
                component: () => import('@/views/crm-customer-center/user-edit.vue'),
                meta: {
                    hidden: true,
                    title: '门店详情',
                    title_en: 'Payment Receipt Phase',
                    parent: '/stores-vehicle/stores-list',
                },
            },
        ],
    },
    {
        // 门店管理
        path: '/stores-vehicle',
        component: Layout,
        redirect: '/stores-vehicle/stores-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '门店管理',
            title_en: 'Stores Management',
            icon: 'i_stores',
            hidden: true,
        },
        children: [
            {
                path: 'stores-list',
                name: 'storesList',
                component: () => import('@/views/retail-crm/stores/store-list.vue'),
                meta: {
                    title: '门店列表',
                    title_en: 'Stores List',
                    icon: 'i_home',
                },
            },
            {
                path: 'regional-mangage',
                name: 'regionalMangage',
                component: () => import('@/views/retail-crm/stores/regional-mangage.vue'),
                meta: {
                    title: '区域管理',
                    title_en: 'Regional Mangage',
                    icon: 'i_home',
                },
            },
            {
                path: 'shift-mangage',
                name: 'shiftMangage',
                component: () => import('@/views/retail-crm/stores/shift-mangage.vue'),
                meta: {
                    title: '班次管理',
                    title_en: 'Shift Mangage',
                    icon: 'i_home',
                    hidden: true,
                },
            },
            {
                path: 'target-mangage',
                name: 'targetMangage',
                component: () => import('@/views/retail-crm/stores/target-mangage.vue'),
                meta: {
                    title: '目标管理',
                    title_en: 'Target Mangage',
                    icon: 'i_home',
                    hidden: true,
                },
            },
            {
                path: 'store-edit',
                name: 'store-edit',
                component: () => import('@/views/retail-crm/stores/store-edit.vue'),
                meta: {
                    hidden: true,
                    title: '',
                    parent: '/stores-vehicle/stores-list',
                },
            },
            {
                path: 'stores-detail',
                name: 'storesDetail',
                component: () => import('@/views/retail-crm/stores/store-detail.vue'),
                meta: {
                    hidden: true,
                    title: '门店详情',
                    title_en: 'Payment Receipt Phase',
                    parent: '/stores-vehicle/stores-list',
                },
            },
        ],
    },
    {
        // 人员管理
        path: '/retail-personnel',
        component: Layout,
        redirect: '/retail-personnel/personnel-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '人员管理',
            title_en: 'Personnel Management',
            icon: 'i_menu_renyuanguanli',
            hidden: true,
        },
        children: [
            {
                path: 'personnel-list',
                name: 'personnelList',
                component: () => import('@/views/retail-crm/personnel/list.vue'),
                meta: {
                    title: '人员列表',
                    title_en: 'Personnel List',
                    icon: 'i_s_user',
                },
            },
            {
                path: 'personnel-detail',
                name: 'personnelDetail',
                component: () => import('@/views/retail-crm/personnel/detail.vue'),
                meta: {
                    hidden: true,
                    title: '人员详情',
                    title_en: 'Personnel Detail',
                },
            },
        ],
    },
    {
        // 探索
        path: '/retail-explore',
        component: Layout,
        redirect: '/retail-explore/file-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '探索',
            title_en: 'Explore',
            icon: 'i_tansuo',
            hidden: true,
        },
        children: [
            {
                path: 'file-list',
                name: 'fileList',
                component: () => import('@/views/retail-crm/explore/file-list.vue'),
                meta: {
                    title: '文件',
                    title_en: 'File',
                },
            },
            {
                path: 'que-answer-list',
                name: 'queAnswerList',
                component: () => import('@/views/retail-crm/explore/que-answer-list.vue'),
                meta: {
                    // hidden: true,
                    title: '问卷解答',
                    title_en: 'Questionnaire Answers',
                },
            },
            {
                path: 'que-naire-list',
                name: 'queNaireList',
                component: () => import('@/views/retail-crm/explore/que-naire-list.vue'),
                meta: {
                    title: '问卷列表',
                    title_en: 'List Of Questionnaires',
                },
            },
            {
                path: 'naire-edit',
                name: 'naireEdit',
                component: () => import('@/views/retail-crm/explore/naire-edit.vue'),
                meta: {
                    hidden: true,
                    title: '编辑问卷',
                    title_en: 'Edit The Questionnaire',
                },
            },
        ],
    },
    {
        // 分配规则
        path: '/service',
        component: Layout,
        redirect: '/service/lead-list',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '分配规则',
            title_en: 'Allocation rules',
            icon: 'i_menu_fenpeiguize',
            hidden: true,
        },
        children: [
            {
                path: 'lead-list',
                name: 'leadList',
                component: () => import('@/views/crm-service-customer/lead-list.vue'),
                meta: {
                    title: '分配规则',
                    title_en: 'Allocation rules',
                },
            },
        ],
    },
    {
        // 好物订单
        path: '/good-items-order',
        component: Layout,
        redirect: '/good-items-order/order-list',
        name: 'good-items-order',
        type: [ROUTER_TYPE.CRM],
        meta: {
            title: '好物订单',
            title_en: 'Good Items Order',
            icon: 'i_menu_haowudingdan',
            hidden: true,
        },
        children: [
            {
                path: 'order-list',
                name: 'orderListItem',
                component: () => import('@/views/good-items-order/order-list.vue'),
                meta: {
                    title: '订单列表',
                    title_en: 'Order List',
                },
            },
            {
                path: 'order-edit',
                name: 'orderEdit',
                component: () => import('@/views/good-items-order/order-detail.vue'),
                meta: {
                    hidden: true,
                    title: '订单详情',
                    title_en: 'Order Edit',
                    parent: '/good-items-order/order-list',
                },
            },
        ],
    },
];
export { domesticSales };

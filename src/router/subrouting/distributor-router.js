import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';
import Layout from '../../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 分销商客户关怀
const customerCare = {
    path: '/customer-care',
    component: Layout,
    name: 'CustomerCare',
    redirect: '/customer-care/list',
    meta: {
        title: '客户关怀',
        title_en: 'Customer Care',
        icon: 'i_menu_fankuguanli',
        auth: ['aftermarket.enquiry'],
    },
    children: [
        {
            path: 'list',
            name: 'CustomerCareList',
            component: () => import('@/views/customer-care/customer-care-list.vue'),
            meta: {
                title: '客服问询单',
                title_en: 'Customer Service Inquiry',
                auth: ['aftermarket.enquiry.enquiry-ticket'],
            },
        },
        {
            path: 'edit',
            name: 'CustomerCareEdit',
            component: () => import('@/views/customer-care/customer-care-edit.vue'),
            meta: {
                hidden: true,
                title: '客服问询单编辑',
                title_en: 'Customer Service Inquiry Edit',
            },
        },
        {
            path: 'detail',
            name: 'CustomerCareDetail',
            component: () => import('@/views/customer-care/customer-care-detail.vue'),
            meta: {
                hidden: true,
                title: '客服问询单详情',
                title_en: 'Customer Service Inquiry Detail',
            },
        },
    ],
};

// 尾款未支付订单表
const unpaidFinalPayment = {
    path: 'unpaid-final-list',
    name: 'unpaidFinalList',
    component: () => import('@/views/distributor/final-unpaid-payment/list.vue'),
    meta: {
        title: '尾款未支付订单表',
        title_en: 'Unpaid Final List',
        icon: 'i_menu_fankuguanli',
        roles: [LOGIN_TYPE.DISTRIBUTOR],
        auth: ['sales.distribution.un-payment', 'aftermarket.distribution.un-payment'],
    },
};
export { customerCare, unpaidFinalPayment };

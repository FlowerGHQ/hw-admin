import Const from '../core/const';
import Layout from '../views/layout/index.vue';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.LOGIN.ROUTER_TYPE;

// 运费待确认订单(分销商和平台方都有)
const freightConfirmed = {
    path: 'freight-confirmed-list',
    name: 'FreightConfirmedList',
    component: () => import('@/views/distributor/freight-confirmed/list.vue'),
    meta: {
        title: '运费待确认订单',
        title_en: 'Freight Confirmed List',
        icon: 'i_menu_fankuguanli',
    },
};

export { freightConfirmed };

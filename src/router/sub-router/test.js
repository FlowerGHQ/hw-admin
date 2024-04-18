import Const from '../../core/const';
import Util from '../../core/utils';
import Data from '../../core/data';

const LOGIN_TYPE = Const.LOGIN.TYPE;
const ROUTER_TYPE = Const.SYSTEM_AUTH.ROUTER_TYPE;

// 平台方客户关怀
const testUseCases = [
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/z-test/test1.vue'),
        meta: {
            title: '测试1',
            not_sub_menu: true,
            hidden: true,
        },
    },
]
 


export {
    testUseCases
};

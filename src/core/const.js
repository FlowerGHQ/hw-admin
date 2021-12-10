import moment from 'moment';

let OSS_POINT = 'http://rebuildsoft-smartwork.oss-cn-hangzhou.aliyuncs.com'
let URL_POINT = 'http://api.eos.rebuildsoft.com'
// let   EXPORT_POINT = 'http://api.eos.rebuildsoft.com/admin/1'

switch (window.location.hostname) {
    case 'eos.rebuildsoft.com':
		URL_POINT = 'http://api.eos.rebuildsoft.com'
        // EXPORT_POINT = 'http://api.eos.rebuildsoft.com/admin/1'
        break;
        case 'localhost':
        case '10.0.0.227':
        case '10.0.0.230':
        case '10.0.0.195':
        case '10.0.0.135':
        case '10.0.0.39':
		// URL_POINT = 'http://10.0.0.226:8083'  // 谢耀圣
		URL_POINT = 'http://10.0.0.39:8083'  // 徐伟
        break;
}

let Const = {
    NET: {
        URL_POINT: URL_POINT,
        OSS_POINT: OSS_POINT,
        FILE_URL_PREFIX: `${OSS_POINT}/`,
        FILE_UPLOAD_END_POINT: `${URL_POINT}/core/1/file/file-upload`,
    },
    DATA: { // 本地存储
        KEY_PREFIX: 'haowan.admin.data.',
        KEY_TOKEN: 'token',
        KEY_USER: 'user',
        KEY_LOGIN_TYPE: 'login.type',
        KEY_USER_TYPE: 'user.type',
        KEY_AUTHORITY_LIST: 'authority.list',

        KEY_FIELD_DISPLAY: 'field.display',
    },

    TIME_PICKER_DEFAULT_VALUE: {
        B_TO_B: {
            defaultValue: [
                moment().seconds(0).minute(0).hour(0),
                moment().seconds(0).minute(0).hour(0)
            ],
        },
        B_TO_E: {
            defaultValue: [
                moment().seconds(0).minute(0).hour(0),
                moment().seconds(59).minute(59).hour(23)
            ],
        }
    },

    ACCOUNT: {
        TYPE: {
            ADMIN: 10,      // 管理员
            AGENT: 20,      // 代理商
            DEALER: 30,     // 经销商
            CUSTOMER: 40,   // 终端用户
        },
        TYPE_MAP: {
            10:  'ADMIN',
            20:  'AGENT',
            30:  'DEALER',
            40:  'CUSTOMER',
        },
    },
    LOGIN: {
        TYPE: {
            ADMIN: 10,     // 管理员
            AGENT: 20,     // 代理商
            DEALER: 30,    // 经销商
        },
        TYPE_LIST: [
            { value: 30 ,text: '经销商'},
            { value: 10 ,text: '管理员'},
        ],
        TYPE_MAP: {
            10: '管理员',
            30: '经销商',
        },
    },
    ITEM: {
        TYPE_LIST: [ // 产品类型
            // { text: '全部', value: 0 },
            { text: '车辆', value: 1 },
            { text: '电池', value: 2 },
            { text: '其他', value: 3 },
        ],
        TYPE_MAP: {
            1: '车辆',
            2: '电池',
            3: '其他',
        },
    },
    MAINTAIN: {
        TYPE_LIST: [ // 维修方式
            { text: '上门', value: 1 },
            { text: '到店', value: 2 },
            { text: '寄修', value: 3 },
        ],
        SUBJECT_LIST: [ // 维修类别
            { text: '保养', value: 1 },
            { text: '维修', value: 2 },
        ],

        STATUS_MAP: {
            10: '待分配',
            20: '待确认',
            30: '待检测',
            40: '维修中',
            50: '已完成',
            60: '异常',
        },
        STATUS_COLOR_MAP: {
            10: 'red',
            20: 'orange',
            30: 'yellow',
            40: 'blue',
            50: 'green',
            60: 'grey',
        }
    }
};

export default Const;

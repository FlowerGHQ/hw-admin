import dayjs from 'dayjs';

let OSS_POINT = 'http://rebuildsoft-smartwork.oss-cn-hangzhou.aliyuncs.com'
let URL_POINT = 'http://api.eos.rebuildsoft.com'

switch (window.location.hostname) {
    default:
		URL_POINT = 'http://10.0.0.198:8083'  // 谢耀圣
		// URL_POINT = 'http://10.0.0.149:8083'  // 徐伟
        // URL_POINT = 'http://10.0.0.39:8083'  // yao
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
                dayjs().second(0).minute(0).hour(0),
                dayjs().second(0).minute(0).hour(0)
            ],
        },
        B_TO_E: {
            defaultValue: [
                dayjs().second(0).minute(0).hour(0),
                dayjs().second(59).minute(59).hour(23)
            ],
        }
    },

    COUNTRY_LIST: [
        {
            "value":"AA",
            "label":"America"
        },
        {
            "value":"AD",
            "label":"Andorra"
        },
        {
            "value":"AE",
            "label":"United Arab Emirates"
        },
        {
            "value":"AF",
            "label":"Afghanistan"
        },
        {
            "value":"AG",
            "label":"Antigua and Barbuda"
        },
        {
            "value":"AL",
            "label":"Albania"
        },
        {
            "value":"AM",
            "label":"Armenia"
        },
        {
            "value":"AO",
            "label":"Angola"
        },
        {
            "value":"AR",
            "label":"Argentina"
        },
        {
            "value":"AT",
            "label":"Austria"
        },
        {
            "value":"AU",
            "label":"Australia"
        },
        {
            "value":"AW",
            "label":"Aruba"
        },
        {
            "value":"AZ",
            "label":"Azerbaijan"
        },
        {
            "value":"BA",
            "label":"Bosnia and Herzegovina"
        },
        {
            "value":"BB",
            "label":"Barbados"
        },
        {
            "value":"BD",
            "label":"Bangladesh"
        },
        {
            "value":"BE",
            "label":"Belgium"
        },
        {
            "value":"BF",
            "label":"Burkina Faso"
        },
        {
            "value":"BG",
            "label":"Bulgaria"
        },
        {
            "value":"BH",
            "label":"Bahrain"
        },
        {
            "value":"BI",
            "label":"Burundi"
        },
        {
            "value":"BJ",
            "label":"Benin"
        },
        {
            "value":"BM",
            "label":"Bermuda"
        },
        {
            "value":"BN",
            "label":"Brunei"
        },
        {
            "value":"BO",
            "label":"Bolivia"
        },
        {
            "value":"BR",
            "label":"Brazil"
        },
        {
            "value":"BS",
            "label":"Bahamas"
        },
        {
            "value":"BT",
            "label":"Bhutan"
        },
        {
            "value":"BW",
            "label":"Botswana"
        },
        {
            "value":"BY",
            "label":"Belarus"
        },
        {
            "value":"BZ",
            "label":"Belize"
        },
        {
            "value":"CA",
            "label":"Canada"
        },
        {
            "value":"CD",
            "label":"Democratic Republic of the Congo"
        },
        {
            "value":"CF",
            "label":"Central African Republic"
        },
        {
            "value":"CG",
            "label":"Democratic Republic of the Congo"
        },
        {
            "value":"CH",
            "label":"Switzerland"
        },
        {
            "value":"CL",
            "label":"Chile"
        },
        {
            "value":"CM",
            "label":"Cameroon"
        },
        {
            "value":"CN",
            "label":"China"
        },
        {
            "value":"CO",
            "label":"Colombia"
        },
        {
            "value":"CR",
            "label":"Costa Rica"
        },
        {
            "value":"CU",
            "label":"Cuba"
        },
        {
            "value":"CV",
            "label":"Cape Verde"
        },
        {
            "value":"CY",
            "label":"Cyprus"
        },
        {
            "value":"CZ",
            "label":"Czech Republic"
        },
        {
            "value":"DE",
            "label":"Germany"
        },
        {
            "value":"DJ",
            "label":"Djibouti"
        },
        {
            "value":"DK",
            "label":"Denmark"
        },
        {
            "value":"DM",
            "label":"Dominica"
        },
        {
            "value":"DO",
            "label":"Dominican Republic"
        },
        {
            "value":"DZ",
            "label":"Algeria"
        },
        {
            "value":"EC",
            "label":"Ecuador"
        },
        {
            "value":"EE",
            "label":"Estonia"
        },
        {
            "value":"EG",
            "label":"Egypt"
        },
        {
            "value":"ER",
            "label":"Eritrea"
        },
        {
            "value":"ES",
            "label":"Spain"
        },
        {
            "value":"ET",
            "label":"Ethiopia"
        },
        {
            "value":"FI",
            "label":"Finland"
        },
        {
            "value":"FJ",
            "label":"Fiji"
        },
        {
            "value":"FK",
            "label":"Falkland Islands"
        },
        {
            "value":"FM",
            "label":"Micronesia"
        },
        {
            "value":"FO",
            "label":"Faroe Islands"
        },
        {
            "value":"FR",
            "label":"France"
        },
        {
            "value":"GA",
            "label":"Gabon"
        },
        {
            "value":"GB",
            "label":"United Kingdom"
        },
        {
            "value":"GD",
            "label":"Grenada"
        },
        {
            "value":"GE",
            "label":"Georgia"
        },
        {
            "value":"GH",
            "label":"Ghana"
        },
        {
            "value":"GI",
            "label":"Gibraltar"
        },
        {
            "value":"GM",
            "label":"Gambia"
        },
        {
            "value":"GN",
            "label":"Guinea"
        },
        {
            "value":"GQ",
            "label":"Equatorial Guinea"
        },
        {
            "value":"GR",
            "label":"Greece"
        },
        {
            "value":"GT",
            "label":"Guatemala"
        },
        {
            "value":"GW",
            "label":"Guinea-Bissau"
        },
        {
            "value":"GY",
            "label":"Guyana"
        },
        {
            "value":"HK",
            "label":"Hong Kong"
        },
        {
            "value":"HN",
            "label":"Honduras"
        },
        {
            "value":"HR",
            "label":"Croatia"
        },
        {
            "value":"HT",
            "label":"Haiti"
        },
        {
            "value":"HU",
            "label":"Hungary"
        },
        {
            "value":"ID",
            "label":"Indonesia"
        },
        {
            "value":"IE",
            "label":"Ireland"
        },
        {
            "value":"IL",
            "label":"Israel"
        },
        {
            "value":"IN",
            "label":"India"
        },
        {
            "value":"IQ",
            "label":"Iraq"
        },
        {
            "value":"IR",
            "label":"Iran"
        },
        {
            "value":"IS",
            "label":"Iceland"
        },
        {
            "value":"IT",
            "label":"Italy"
        },
        {
            "value":"JM",
            "label":"Jamaica"
        },
        {
            "value":"JO",
            "label":"Jordan"
        },
        {
            "value":"JP",
            "label":"Japan"
        },
        {
            "value":"KE",
            "label":"Kenya"
        },
        {
            "value":"KG",
            "label":"Kyrgyzstan"
        },
        {
            "value":"KH",
            "label":"Cambodia"
        },
        {
            "value":"KI",
            "label":"Kiribati"
        },
        {
            "value":"KM",
            "label":"Comoros"
        },
        {
            "value":"KN",
            "label":"Saint Kitts and Nevis"
        },
        {
            "value":"KP",
            "label":"North Korea"
        },
        {
            "value":"KR",
            "label":"South Korea"
        },
        {
            "value":"KW",
            "label":"Kuwait"
        },
        {
            "value":"KY",
            "label":"Cayman Islands"
        },
        {
            "value":"KZ",
            "label":"Kazakhstan"
        },
        {
            "value":"LA",
            "label":"Laos"
        },
        {
            "value":"LB",
            "label":"Lebanon"
        },
        {
            "value":"LC",
            "label":"Saint Lucia"
        },
        {
            "value":"LI",
            "label":"Liechtenstein"
        },
        {
            "value":"LK",
            "label":"Sri Lanka"
        },
        {
            "value":"LR",
            "label":"Liberia"
        },
        {
            "value":"LS",
            "label":"Lesotho"
        },
        {
            "value":"LT",
            "label":"Lithuania"
        },
        {
            "value":"LU",
            "label":"Luxembourg"
        },
        {
            "value":"LV",
            "label":"Latvia"
        },
        {
            "value":"LY",
            "label":"Libya"
        },
        {
            "value":"MA",
            "label":"Morocco"
        },
        {
            "value":"MC",
            "label":"Monaco"
        },
        {
            "value":"MD",
            "label":"Moldova"
        },
        {
            "value":"ME",
            "label":"Montenegro"
        },
        {
            "value":"MG",
            "label":"Madagascar"
        },
        {
            "value":"MK",
            "label":"Macedonia"
        },
        {
            "value":"ML",
            "label":"Mali"
        },
        {
            "value":"MM",
            "label":"Myanmar"
        },
        {
            "value":"MN",
            "label":"Mongolia"
        },
        {
            "value":"MO",
            "label":"Macao"
        },
        {
            "value":"MR",
            "label":"Mauritania"
        },
        {
            "value":"MT",
            "label":"Malta"
        },
        {
            "value":"MU",
            "label":"Mauritius"
        },
        {
            "value":"MV",
            "label":"Maldives"
        },
        {
            "value":"MW",
            "label":"Malawi"
        },
        {
            "value":"MX",
            "label":"Mexico"
        },
        {
            "value":"MY",
            "label":"Malaysia"
        },
        {
            "value":"MZ",
            "label":"Mozambique"
        },
        {
            "value":"NA",
            "label":"Namibia"
        },
        {
            "value":"NE",
            "label":"Niger"
        },
        {
            "value":"NG",
            "label":"Nigeria"
        },
        {
            "value":"NI",
            "label":"Nicaragua"
        },
        {
            "value":"NL",
            "label":"Netherlands"
        },
        {
            "value":"NO",
            "label":"Norway"
        },
        {
            "value":"NP",
            "label":"Nepal"
        },
        {
            "value":"NR",
            "label":"Nauru"
        },
        {
            "value":"NZ",
            "label":"New Zealand"
        },
        {
            "value":"OM",
            "label":"Oman"
        },
        {
            "value":"PA",
            "label":"Panama"
        },
        {
            "value":"PE",
            "label":"Peru"
        },
        {
            "value":"PG",
            "label":"Papua New Guinea"
        },
        {
            "value":"PH",
            "label":"Philippines"
        },
        {
            "value":"PK",
            "label":"Pakistan"
        },
        {
            "value":"PL",
            "label":"Poland"
        },
        {
            "value":"PR",
            "label":"Puerto Rico"
        },
        {
            "value":"PS",
            "label":"Palestine"
        },
        {
            "value":"PT",
            "label":"Portugal"
        },
        {
            "value":"PW",
            "label":"Palau"
        },
        {
            "value":"PY",
            "label":"Paraguay"
        },
        {
            "value":"QA",
            "label":"Qatar"
        },
        {
            "value":"RO",
            "label":"Romania"
        },
        {
            "value":"RS",
            "label":"Serbia"
        },
        {
            "value":"RU",
            "label":"Russia"
        },
        {
            "value":"RW",
            "label":"Rwanda"
        },
        {
            "value":"SA",
            "label":"Saudi Arabia"
        },
        {
            "value":"SB",
            "label":"Solomon Islands"
        },
        {
            "value":"SC",
            "label":"Seychelles"
        },
        {
            "value":"SD",
            "label":"Sudan"
        },
        {
            "value":"SE",
            "label":"Sweden"
        },
        {
            "value":"SG",
            "label":"Singapore"
        },
        {
            "value":"SI",
            "label":"Slovenia"
        },
        {
            "value":"SK",
            "label":"Slovak Republic"
        },
        {
            "value":"SL",
            "label":"Sierra Leone"
        },
        {
            "value":"SM",
            "label":"San Marino"
        },
        {
            "value":"SN",
            "label":"Senegal"
        },
        {
            "value":"SO",
            "label":"Somalia"
        },
        {
            "value":"SR",
            "label":"Suriname"
        },
        {
            "value":"ST",
            "label":"Sao Tome and Principe"
        },
        {
            "value":"SV",
            "label":"El Salvador"
        },
        {
            "value":"SY",
            "label":"Syria"
        },
        {
            "value":"SZ",
            "label":"Swaziland"
        },
        {
            "value":"TD",
            "label":"Chad"
        },
        {
            "value":"TG",
            "label":"Togo"
        },
        {
            "value":"TH",
            "label":"Thailand"
        },
        {
            "value":"TJ",
            "label":"Tajikistan"
        },
        {
            "value":"TM",
            "label":"Turkmenistan"
        },
        {
            "value":"TN",
            "label":"Tunisia"
        },
        {
            "value":"TO",
            "label":"Tonga"
        },
        {
            "value":"TR",
            "label":"Turkey"
        },
        {
            "value":"TT",
            "label":"Trinidad and Tobago"
        },
        {
            "value":"TV",
            "label":"Tuvalu"
        },
        {
            "value":"TW",
            "label":"Taiwan"
        },
        {
            "value":"TZ",
            "label":"Tanzania"
        },
        {
            "value":"UA",
            "label":"Ukraine"
        },
        {
            "value":"UG",
            "label":"Uganda"
        },
        {
            "value":"UY",
            "label":"Uruguay"
        },
        {
            "value":"UZ",
            "label":"Uzbekistan"
        },
        {
            "value":"VC",
            "label":"Saint Vincent And The Grenadine"
        },
        {
            "value":"VE",
            "label":"Venezuela"
        },
        {
            "value":"VG",
            "label":"British Virgin Islands"
        },
        {
            "value":"VN",
            "label":"Vietnam"
        },
        {
            "value":"VU",
            "label":"Vanuatu"
        },
        {
            "value":"WF",
            "label":"Wallis and Futuna"
        },
        {
            "value":"WS",
            "label":"Western Samoa"
        },
        {
            "value":"YE",
            "label":"Yemen"
        },
        {
            "value":"ZA",
            "label":"South Africa"
        },
        {
            "value":"ZM",
            "label":"Zambia"
        },
        {
            "value":"ZW",
            "label":"Zimbabwe"
        }
    ],

    ACCOUNT: {
        TYPE: {
            ADMIN: 10,      // 管理员
            AGENT: 20,      // 代理商
            STORE: 30,      // 门店
            CUSTOMER: 40,   // 终端用户
        },
        TYPE_MAP: {
            10:  'ADMIN',
            20:  'AGENT',
            30:  'STORE',
            40:  'CUSTOMER',
        },
    },
    LOGIN: {
        TYPE: {
            ADMIN: 10,     // 管理员
            AGENT: 20,     // 代理商
            STORE: 30,     // 门店
        },
        TYPE_LIST: [
            { value: 20 ,text: '代理商'},
            { value: 10 ,text: '管理员'},
        ],
        TYPE_MAP: {
            10: '管理员',
            20: '代理商',
        },
    },
    ITEM: {
        TYPE_LIST: [ // 产品类型
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

    REPAIR: {
        // 工单分类
        TYPE_LIST: [
            { text: '维修工单', value: 1 }, // 普通工单
            { text: '特批订单', value: 2 },
        ],
        TYPE_MAP: {
            1: '维修工单',
            2: '特批订单',
        },
        // 维修方式
        CHANNEL_LIST: [
            { text: '上门', value: 1 },
            { text: '到店', value: 2 },
            { text: '寄修', value: 3 },
        ],
        CHANNEL_MAP: {
            1: '上门',
            2: '到店',
            3: '寄修',
        },
        // 维修类别
        METHOD_LIST: [
            { text: '维修', value: 1 },
            { text: '更换', value: 2 },
        ],
        METHOD_MAP: {
            1: '维修',
            2: '更换',
        },
        // 优先级
        PRIORITY_LIST: [
            { text: '高', value: 1 },
            { text: '中', value: 2 },
            { text: '低', value: 3 },
        ],
        PRIORITY_MAP: {
            1: '高',
            2: '中',
            3: '低',
        },

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

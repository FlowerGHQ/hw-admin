<template>
<div id="DistributorEdit" class="edit-container">
    <div class="title-container"><div class="title-area">{{form.id ? '编辑经销商' : '新建经销商'}}</div></div>
    <div class="form-block">
        <div class="form-title">
            <div class="title-colorful">基本信息</div>
        </div>
        <div class="form-content">
            <div class="form-item required" v-if="!form.id">
                <div class="key">经销商名:</div>
                <div class="value">
                    <a-input v-model:value="form.name" placeholder="请输入经销商"/>
                </div>
            </div>
            <div class="form-item required" v-if="!form.id">
                <div class="key">密码:</div>
                <div class="value">
                    <a-input-password v-model:value="form.password" placeholder="请输入密码"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">手机号:</div>
                <div class="value">
                    <a-input v-model:value="form.phone" placeholder="请输入经销商手机号"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">邮箱:</div>
                <div class="value">
                    <a-input v-model:value="form.email" placeholder="请输入经销商邮箱"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">国家:</div>
                <div class="value">
                    <a-select v-model:value="form.country" placeholder="请选择国家">
                        <a-select-option v-for="item in countryList" :key="item.label" :value="item.label">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
        </div>
    </div>
    <div class="form-btns">
        <a-button @click="handleSubmit" type="primary">确定</a-button>
        <a-button @click="routerChange('back')" type="primary" ghost="">取消</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'DistributorEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            countryList: [
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
            detail: {},
            form: {
                id: '',
                name: '',
                password: '',
                phone: '',
                email: '',
                country: undefined,
            }
        };
    },
    watch: {},
    computed: {},

    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getDistributorDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },
        getDistributorDetail() {
            this.loading = true;
            console.log("id",this.form.id)
            Core.Api.Dealers.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getDistributorDetail res', res)
                this.detail = res.detail
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
            }).catch(err => {
                console.log('getDistributorDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            if (!form.id) {
                if (!form.name) {
                    return this.$message.warning('请输入经销商名')
                }
                if (!form.password) {
                    return this.$message.warning('请输入密码')
                }
            }
            if (!form.phone) {
                return this.$message.warning('请输入经销商手机号')
            }
            if (!form.email) {
                return this.$message.warning('请输入经销商邮箱')
            }
            if (!form.country) {
                return this.$message.warning('请选择经销商国家')
            }
            Core.Api.Dealers.save(form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        }
    }
};
</script>

<style lang="less" scoped>
// #DistributorEdit {}
</style>
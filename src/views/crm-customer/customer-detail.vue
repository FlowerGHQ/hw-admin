<template>
    <div id="CustomerEdit" class="edit-container">
        <div class="title-container">
                <div class="title-area">{{  $t('crm_c.detail')  }}
                <a-tag v-if="$auth('ADMIN')" :color='detail.status ? "green" : "red"'>
                    {{ detail.status ? $t('def.enable_ing') : $t('def.disable_ing') }}
                </a-tag>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_c.level') }}：</span>
                        <span class="value">{{ $Util.CRMCustomerLevelFilter(detail.level, $i18n.locale) || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_c.type') }}：</span>
                        <span class="value">{{ $Util.CRMCustomerTypeFilter(detail.type, $i18n.locale) || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">{{detail.phone}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                        <a-button>写跟进</a-button>
                        <a-button>编辑</a-button>
                        <a-button>新建联系人</a-button>
                        <a-button>新建商机</a-button>
                        <a-button>新建订单</a-button>
                        <a-button>移交</a-button>
                        <a-button>退回</a-button>
                        <a-button>删除</a-button>
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-row class="desc-detail has-logo">
            <a-col :xs='16' :sm='16' :lg='16' class='detail-item'>
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="UserList" :tab="$t('d.manage_employees')">
                            <InformationInfo/>
                        </a-tab-pane>

                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs='8' :sm='8' :lg='8' class='detail-item'>

            </a-col>
        </a-row>
    </div>
</template>

<script>
import Core from '../../core';
import InformationInfo from './components/InformationInfo.vue';

import dayjs from "dayjs";

export default {
    name: 'CustomerEdit',
    components: { InformationInfo},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            CRM_TYPE_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,
            CRM_LEVEL_MAP: Core.Const.CRM_CUSTOMER.LEVEL_MAP,
            CRM_SOURCE_MAP: Core.Const.CRM_CUSTOMER.SOURCE_MAP,
            CRM_INDUSTRY_MAP: Core.Const.CRM_CUSTOMER.INDUSTRY_MAP,
            CRM_GENDER_MAP: Core.Const.CRM_CUSTOMER.GENDER_MAP,
            CRM_MARITAL_STATUS_MAP: Core.Const.CRM_CUSTOMER.MARITAL_STATUS_MAP,
            CRM_TYPE: Core.Const.CRM_CUSTOMER.TYPE,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            TYPE_MAP: 1,
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                type: '',
                name: '',
                phone: '',
                level: '',
                source: '',
                company_size: '',
                company_license_id:'',
                gender: '',
                birthday: '',
                industry: '',
                nationality: '',
                hobby: '',
                marital_status: '',
                income: '',
                remark: '',

                address: '',
            },
            defAddr: [],
            areaList: [],
            defArea: [],
            area: {
                country: '',
                country_en: '',
                province: '',
                province_en: '',
                city: '',
                city_en: '',
                county: '',
                county_en: '',

            },
            areaMap: {},
            countryShow: false,
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getCustomerDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    let routeUrl = this.$router.resolve({
                        path: "/crm-customer/customer-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getCustomerDetail() {
            this.loading = true;
            Core.Api.CRMCustomer.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getCustomerDetail res', res)
                let d = res.detail
                this.detail = d
                this.detail.birthday = this.detail.birthday ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD') : undefined
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                this.defAddr = [d.province, d.city, d.county]

                // this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.phone) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.level) {
                return this.$message.warning(this.$t('def.enter'))
            }
           /* if (!form.province || !form.city || !form.county || !form.address) {
                // return this.$message.warning('请完善客户地址')
            }*/
            form.birthday = form.birthday ? dayjs(form.birthday).unix() : 0 // 日期转时间戳

            console.log('form',this.form)
            // if (!Core.Util.isEmptyObj(this.defAddr)) {
            //     console.log('areaMap2222',this.defAddr)
            //     area.country = this.defAddr.country
            //     area.city = this.defAddr.city
            //     if (this.defAddr.province) {
            //         area.province = this.defAddr.province
            //     }
            //     if (this.defAddr.county) {
            //         area.county = this.defAddr.county
            //     }
            //     console.log('area1234556',area)
            // }
            Core.Api.CRMCustomer.save({
                ...form,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },
        getCountry(data) {
            console.log('getCountry data',data)
            if (data.country == '中国' || data.country == 'China') {
                this.countryShow = true
            } else {
                this.countryShow = false
            }
            console.log('data.country',data.country)
            console.log('countryShow',this.countryShow)

        },
    }
};
</script>

<style lang="less">
.CustomerEdit {

    .icon {
        font-size: 12px;
    }
}
</style>

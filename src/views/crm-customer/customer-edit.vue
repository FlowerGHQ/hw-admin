<template>
    <div id="CustomerEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('c.edit') : $t('c.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.type') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type">
                            <a-radio v-for="item in CRM_TYPE_MAP" :value="item.value">
                                {{lang === 'zh' ? item.zh: item.en}}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" @blur="handleCustomerBlur"/>
                    </div>
                    <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                    <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('n.phone') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.level') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.level" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of CRM_LEVEL_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>

                </div>
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_c.extended_information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item">
                    <div class="key">{{ $t('crm_c.source') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.source_def_id" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of sourceList" :key="item.id" :value="item.id">{{lang === 'zh' ? item.name: item.name_en}}</a-select-option>
                        </a-select>
                    </div>
                    <div class="sp">
                        <a-button type="link" v-if="$auth('customer.save')" @click="handleSourceModalShow">{{ $t('crm_set.save') }}</a-button>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.UNIT">
                    <div class="key">{{ $t('crm_c.company_size') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.company_size" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.INDIVIDUAL">
                    <div class="key">{{ $t('crm_c.gender') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.gender">
                            <a-radio v-for="item in CRM_GENDER_MAP" :value="item.value">
                                {{lang === 'zh' ? item.zh: item.en}}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.INDIVIDUAL">
                    <div class="key">{{ $t('crm_c.birthday') }}：</div>
                    <div class="value">
                        <a-date-picker v-model:value="form.birthday" valueFormat='YYYY-MM-DD' :placeholder="$t('def.input')"/>
<!--                        <a-input v-model:value="form.birthday" :placeholder="$t('def.input')"/>-->
                    </div>
                </div>

                <div class="form-item">
                    <div class="key">{{ $t('crm_c.industry') }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.industry" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of CRM_INDUSTRY_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.UNIT">
                    <div class="key">{{ $t('crm_c.company_license_id') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.company_license_id" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.INDIVIDUAL">
                    <div class="key">{{ $t('crm_c.nationality') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.nationality" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.INDIVIDUAL">
                    <div class="key">{{ $t('crm_c.hobby') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.hobby" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.INDIVIDUAL">
                    <div class="key">{{ $t('crm_c.marital_status') }}:</div>
                    <div class="value">
                        <a-select v-model:value="form.marital_status" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of CRM_MARITAL_STATUS_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.INDIVIDUAL">
                    <div class="key">{{ $t('crm_c.income') }}:</div>
                    <div class="value">
                        <a-input v-model:value="form.income" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('r.address') }}:</div>
                    <div class="value">
                        <ChinaAddressCascader @select='handleAddressSelect' :default-address='defAddr'/>
                    </div>
                </div>
                <div class="form-item ">
                    <div class="key"></div>
                    <div class="value">
                        <a-input v-model:value="form.address" :placeholder="$t('def.input')"/>
                    </div>
                </div>

                <div class="form-item textarea">
                    <div class="key">{{ $t('def.remark') }}</div>
                    <div class="value">
                        <a-textarea v-model:value="form.remark" :placeholder="$t('def.input')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='500'/>
                        <span class="content-length">{{ form.remark != undefined?form.remark.length : 0 }}/500</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('crm-customer.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="sourceModalShow" :title="sourceForm.id ? $t('crm_set.edit') : $t('crm_set.save')" :after-close="handleSourceModalClose">
                <div class="modal-content">
                    <div class="form-item">
                        <div class="key">{{ $t('n.name') }}</div>
                        <div class="value">
                            <a-input v-model:value="sourceForm.name" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('n.name_en') }}</div>
                        <div class="value">
                            <a-input v-model:value="sourceForm.name_en" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                    <div class="form-item">
                        <div class="key">{{ $t('n.index') }}</div>
                        <div class="value">
                            <a-input v-model:value="sourceForm.index" :placeholder="$t('def.input')"/>
                        </div>
                    </div>

                </div>
                <template #footer>
                    <a-button @click="handleSourceModalClose()">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleSourceModalSubmit()" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';

import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'
import CountryCascader from '@/components/common/CountryCascader.vue'
import AddressCascader from '@/components/common/AddressCascader.vue';
import dayjs from "dayjs";

export default {
    name: 'CustomerEdit',
    components: { ChinaAddressCascader, CountryCascader, AddressCascader},
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
            // 加载
            loading: false,
            detail: {},
            form: {
                id: '',
                type: '',
                name: '',
                phone: '',
                level: '',
                source_def_id: '',
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
                status: Core.Const.CRM_CUSTOMER.STATUS.POOL,
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
            sourceList: [],

            isExist: '', // 名称输入框提示

            sourceModalShow: false,
            sourceForm: {
                id: '',
                name: '',
                name_en: '',
                index: '',
            },
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
        } else {
            this.form.status = Number(this.$route.query.status) || 0
        }
        this.getSourceList()
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    this.$router.go(-1)
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
        getSourceList(){
            Core.Api.CRMCustomerSource.list({

            }).then(res => {
                this.sourceList = res.list
            })
        },
        handleCustomerBlur() {  // 获取 车架号
            if (!this.form.name) {
                return this.isExist = ''
            }
            Core.Api.CRMCustomer.checkName({
                id: this.form.id,
                name: this.form.name,
            }).then(res => {
                this.isExist = res.results ? 1 : 2
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },
        handleSourceModalShow(record) {
            this.sourceForm =  Core.Util.deepCopy(record)
            this.sourceModalShow = true
        },
        handleSourceModalClose() {
            this.sourceForm = Core.Util.deepCopy(this.$options.data().sourceForm)
            this.sourceModalShow = false
        },
        handleSourceModalSubmit() {
            let form = Core.Util.deepCopy(this.sourceForm)
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.name_en) {
                return this.$message.warning(this.$t('def.enter'))
            }
            this.loading = true
            let apiName = form.id ? 'update' : 'save';
            Core.Api.CRMCustomerSource[apiName](form).then(res => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.getSourceList()
                this.sourceModalShow = false
            }).catch(err => {
                console.log('handleModalSubmit err:', err)
            }).finally(() => {
                this.loading = false
            })

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
.form-item {
    .fac();

    .ant-input {
        width: calc(~'100% - 24px');
    }

    i.icon {
        display: inline-block;
        width: 24px;
        text-align: right;
    }

    .i_confirm {
        color: @green;
        font-size: 18px;
    }

    .i_close_c {
        color: @red;
        font-size: 18px;
    }
}
</style>

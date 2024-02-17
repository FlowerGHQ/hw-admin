<template>
    <a-button class="CustomerAdd" @click.stop="handleModalShow" :ghost="ghost" :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <a-modal
        :title="btnText"
        v-model:visible="modalShow"
        :after-close="handleModalClose"
        width="600px"
        class="CustomerAddModal"
    >
        <div class="form-title">
            <div class="form-item required">
                <div class="key">{{ $t('n.name') }}：</div>
                <div class="value">
                    <a-input v-model:value="form.name" :placeholder="$t('def.input')" />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('n.phone') }}：</div>
                <div class="value">
                    <a-input v-model:value="form.phone" :placeholder="$t('def.input')" />
                </div>
                <ContactSelect
                    :radioMode="true"
                    :phone="this.form.phone"
                    :check-mode="false"
                    :select-btn="true"
                    :select-customer="true"
                    btn-class="select-item-btn"
                    btnType="link"
                    @select="selectItem"
                    :btnText="$t('crm_c.rechecking')"
                >
                    {{ $t('crm_c.rechecking') }}
                </ContactSelect>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_c.level') }}：</div>
                <div class="value">
                    <a-select v-model:value="form.level" :placeholder="$t('def.input')">
                        <a-select-option v-for="item of CRM_LEVEL_MAP" :key="item.value" :value="item.value">{{
                            lang === 'zh' ? item.zh : item.en
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('n.source') }}：</div>
                <div class="value">
                    <a-select v-model:value="form.source" :placeholder="$t('def.input')">
                        <a-select-option v-for="item of CRM_SOURCE_MAP" :key="item.value" :value="item.value">{{
                            lang === 'zh' ? item.zh : item.en
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_c.gender') }}：</div>
                <div class="value">
                    <a-radio-group v-model:value="form.gender">
                        <a-radio v-for="item in CRM_GENDER_MAP" :value="item.value">
                            {{ lang === 'zh' ? item.zh : item.en }}
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_c.birthday') }}：</div>
                <div class="value">
                    <a-date-picker
                        v-model:value="form.birthday"
                        valueFormat="YYYY-MM-DD"
                        :placeholder="$t('def.input')"
                    />
                    <!--                        <a-input v-model:value="form.birthday" :placeholder="$t('def.input')"/>-->
                </div>
            </div>

            <div class="form-item">
                <div class="key">{{ $t('crm_c.industry') }}:</div>
                <div class="value">
                    <a-select v-model:value="form.industry" :placeholder="$t('def.input')">
                        <a-select-option v-for="item of CRM_INDUSTRY_MAP" :key="item.value" :value="item.value">{{
                            lang === 'zh' ? item.zh : item.en
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_c.nationality') }}:</div>
                <div class="value">
                    <CountryCascader v-model:value="areaListContinent" :def-area="defAreaContinent" />
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_c.hobby') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.hobby" :placeholder="$t('def.input')" />
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_c.marital_status') }}:</div>
                <div class="value">
                    <a-select v-model:value="form.marital_status" :placeholder="$t('def.input')">
                        <a-select-option v-for="item of CRM_MARITAL_STATUS_MAP" :key="item.value" :value="item.value">{{
                            lang === 'zh' ? item.zh : item.en
                        }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_c.income') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.income" :placeholder="$t('def.input')" />
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('r.address') }}:</div>
                <div class="value">
                    <ChinaAddressCascader @select="handleAddressSelect" :default-address="defAddr" />
                </div>
            </div>
            <div class="form-item">
                <div class="key"></div>
                <div class="value">
                    <a-input v-model:value="form.address" :placeholder="$t('def.input')" />
                </div>
            </div>

            <div class="form-item textarea">
                <div class="key">{{ $t('crm_c.remark') }}</div>
                <div class="value">
                    <a-textarea
                        v-model:value="form.remark"
                        :placeholder="$t('r.enter_remark')"
                        :auto-size="{ minRows: 2, maxRows: 6 }"
                        :maxlength="500"
                    />
                    <span class="content-length">{{ form.remark.length }}/500</span>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="modal-footer">
                <div class="paging-area"></div>
                <div class="btn-area">
                    <a-button @click="handleModalClose">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleSubmit" type="primary">{{ $t('def.sure') }}</a-button>
                </div>
            </div>
        </template>
    </a-modal>
</template>

<script>
import Core from '@/core';

import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue';
import CountryCascader from '@/components/common/CountryCascader.vue';
import ItemTable from '@/components/table/ItemTable.vue';
import CategoryTreeSelect from '@/components/popup-btn/CategoryTreeSelect.vue';
import dayjs from 'dayjs';

import ContactSelect from '@/components/crm/popup-btn/ContactSelect.vue';

export default {
    components: {
        ItemTable,
        CategoryTreeSelect,
        ChinaAddressCascader,
        CountryCascader,
        ContactSelect,
    },
    emits: ['select', 'option'],
    props: {
        btnText: {
            type: String,
            default: '添加联系人',
        },
        btnType: {
            type: String,
            default: 'primary',
        },
        btnClass: {
            type: String,
        },
        ghost: {
            type: Boolean,
            default: false,
        },
        targetId: {
            type: Number,
            default: 0,
        },
        targetType: {
            type: Number,
            default: 0,
        },
        groupId: {
            type: Number,
            default: 0,
        },
        selectBtn: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loading: false,
            modalShow: false,

            loginType: Core.Data.getLoginType(),
            CRM_TYPE_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,
            CRM_LEVEL_MAP: Core.Const.CRM_CUSTOMER.LEVEL_MAP,
            CRM_SOURCE_MAP: Core.Const.CRM_CUSTOMER.SOURCE_MAP,
            CRM_INDUSTRY_MAP: Core.Const.CRM_CUSTOMER.INDUSTRY_MAP,
            CRM_GENDER_MAP: Core.Const.CRM_CUSTOMER.GENDER_MAP,
            CRM_MARITAL_STATUS_MAP: Core.Const.CRM_CUSTOMER.MARITAL_STATUS_MAP,
            CRM_TYPE: Core.Const.CRM_CUSTOMER.TYPE,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            detail: {},
            form: {
                id: '',
                type: Core.Const.CRM_CUSTOMER.TYPE.INDIVIDUAL,
                name: '',
                phone: '',
                level: '',
                source: '',
                company_size: '',
                company_license_id: '',
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
            areaListContinent: [],
            defAreaContinent: [],
            areaContinent: {
                continent: '',
                country: '',
                country_en: '',
                country_code: '',
            },
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    created() {},
    mounted() {},
    methods: {
        handleModalShow() {
            this.modalShow = true;
        },
        routerChange(type, item) {
            switch (type) {
                case 'back': // 详情
                    let routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getCustomerDetail() {
            this.loading = true;
            Core.Api.CRMCustomer.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    this.detail.birthday = this.detail.birthday
                        ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD')
                        : undefined;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    this.defAddr = [d.province, d.city, d.county];

                    // this.defArea = [d.continent || '', d.country || '']
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            let area = Core.Util.deepCopy(this.area);
            let areaContinent = Core.Util.deepCopy(this.areaContinent);
            if (this.areaListContinent.length) {
                console.log('this.areaList:', this.areaListContinent);
                areaContinent = {
                    continent: this.areaListContinent[0].name,
                    country: this.areaListContinent[1].name,
                    country_en: this.areaListContinent[1].name_en,
                    country_code: this.areaListContinent[1].code,
                };
            }
            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.phone) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!this.$Util.ifPhoneFilter(form.phone)) {
                return this.$message.warning(this.$t('def.error_phone'));
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'));
            }
            if (!form.level) {
                return this.$message.warning(this.$t('def.enter'));
            }
            /* if (!form.province || !form.city || !form.county || !form.address) {
                 // return this.$message.warning('请完善客户地址')
             }*/
            form.birthday = form.birthday ? dayjs(form.birthday).unix() : 0; // 日期转时间戳

            console.log('form', this.form);
            console.log('targetId', this.targetId);
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
                ...areaContinent,
                target_id: this.targetId,
                target_type: this.targetType,
                group_id: this.groupId,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleModalClose();
                    this.$emit('select');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0];
            this.form.city = address[1];
            this.form.county = address[2];
        },
        getCountry(data) {
            console.log('getCountry data', data);
            if (data.country == '中国' || data.country == 'China') {
                this.countryShow = true;
            } else {
                this.countryShow = false;
            }
            console.log('data.country', data.country);
            console.log('countryShow', this.countryShow);
        },
        handleModalClose() {
            this.modalShow = false;
            Object.assign(this.form, this.$options.data().form);
        },
        selectItem(id, item) {
            console.log('select2 item:', id);
            item.birthday = item.birthday ? dayjs.unix(item.birthday).format('YYYY-MM-DD') : undefined;
            for (const key in this.form) {
                this.form[key] = item[key];
            }
            this.form.id = 0;
        },
        // handleConfirm() {
        //     Core.Api.CRMCustomer.save({
        //         ...this.form,
        //     }).then(() => {
        //         this.$message.success(this.$t('pop_up.save_success'));
        //         this.handleModalClose();
        //         this.$emit("select");
        //     }).catch(err => {
        //         console.log('handleSubmit err:', err)
        //     })
        //
        // },
    },
};
</script>

<style lang="less">
.CustomerAdd {
    &.ant-btn-link {
        line-height: 1;
        height: 1em;
    }
    .ant-modal-content {
        .ant-modal-body {
            .hint-count {
                margin-bottom: 5px;
            }
        }
    }
}
.CustomerAddModal {
    .tip {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
        font-size: 12px;
    }
    .form-item {
        display: -webkit-box;
        .value {
            width: calc(80% - 86px);
        }
    }
}
</style>

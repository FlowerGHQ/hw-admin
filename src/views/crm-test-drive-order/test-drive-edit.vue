<template>
    <div id="TestDriveEdit" class="edit-container" :class="$i18n.locale">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_d.edit') : $t('crm_d.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_d.customer_information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" :disabled="form.id > 0 || form.customer_id > 0"/>
                    </div>

                </div>
                <div class="form-item required with-btn">
                    <div class="key">{{ $t('n.phone') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" :placeholder="$t('def.input')" @blur="handleCustomerBlur" :disabled="form.id > 0 || form.customer_id > 0"/>
                        <div class="btn">
                            <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                            <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                            <CustomerSelect v-if="form.id == 0" @select="selectItem" :select-btn="true" :radioMode="true" :phone="form.phone" :check-mode="false" :select-customer="true" btn-class="select-item-btn" btnType='link' :btnText="$t('crm_c.rechecking')">
                                {{ $t('crm_c.rechecking') }}
                            </CustomerSelect>
                        </div>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.group') }}：</div>
                    <div class="value">
                        <a-tree-select class="CategoryTreeSelect"
                            v-model:value="form.group_id"
                            :placeholder="$t('def.select')"
                            :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                            :tree-data="groupOptions"
                            :disabled="(form.id > 0 || form.customer_id > 0) && form.group_id > 0"
                            tree-default-expand-all
                        />
                    </div>

                </div>
                <div class="form-item"  v-if="form.id == 0">
                    <div class="key">{{ $t('crm_c.gender') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.gender">
                            <a-radio v-for="item in CRM_GENDER_MAP" :value="item.value">
                                {{lang === 'zh' ? item.zh: item.en}}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item" v-if="form.id == 0">
                    <div class="key">{{ $t('crm_c.birthday') }}：</div>
                    <div class="value">
                        <a-date-picker v-model:value="form.birthday" valueFormat='YYYY-MM-DD' :placeholder="$t('def.input')"/>
                        <!--                        <a-input v-model:value="form.birthday" :placeholder="$t('def.input')"/>-->
                    </div>
                </div>
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_d.drive_information') }}</div>
            </div>
            <div class="form-content">
                <div class="form-item required with-btn">
                    <div class="key">{{ $t('crm_d.crm_dict_id') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.crm_dict_id" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of sourceList" :key="item.id" :value="item.id">{{lang === 'zh' ? item.name: item.name_en}}</a-select-option>
                        </a-select>
                        <div class="btn">
                            <a-button type="link"  @click="getSourceList()">{{ $t('crm_set.refresh') }}</a-button>
                        </div>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_d.test_drive_time') }}：</div>
                    <div class="value">
                        <a-date-picker v-model:value="form.test_drive_time" valueFormat='YYYY-MM-DD HH:mm:ss' :show-time="defaultTime" :placeholder="$t('def.input')">
                            <template #suffixIcon><i class="icon i_calendar"/></template>
                        </a-date-picker>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_d.dept_id') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.dept_id" :placeholder="$t('def.input')" >
                            <a-select-option  :key="1" :value="1">浩万门店</a-select-option>
                        </a-select>
                    </div>

                </div>
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_d.user_portrait') }}</div>
            </div>
            <a-row class="form-content long-key">
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.buy_type') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.buy_type" :placeholder="$t('def.input')" >
                                <a-select-option v-for="item of BUY_TYPE_MAP" :key="item.key" :value="item.key">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.rental_demand') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.rental_demand">
                                <a-radio v-for="item in RENTAL_DEMAND_MAP" :value="item.key">
                                    {{lang === 'zh' ? item.zh: item.en}}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.city') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.city" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.travel_range') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.travel_range" :placeholder="$t('def.input')" >
                                <a-select-option v-for="item of TRAVEL_RANGE_MAP" :key="item.key" :value="item.key">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.other_brand_model') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.other_brand_model" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.park_and_charging_pile') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.park_and_charging_pile" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.family_member') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.family_member" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.green_car_owner') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.green_car_owner">
                                <a-radio v-for="item in GREEN_CAR_OWNER_MAP" :value="item.key">
                                    {{lang === 'zh' ? item.zh: item.en}}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.driver_license') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.driver_license">
                                <a-radio v-for="item in DRIVER_LICENSE_MAP" :value="item.key">
                                    {{lang === 'zh' ? item.zh: item.en}}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.ride_exp') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.ride_exp">
                                <a-radio v-for="item in RIDE_EXP_MAP" :value="item.key">
                                    {{lang === 'zh' ? item.zh: item.en}}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.moto_exp') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.moto_exp">
                                <a-radio v-for="item in MOTO_EXP_MAP" :value="item.key">
                                    {{lang === 'zh' ? item.zh: item.en}}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.moto_tour_intention') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.moto_tour_intention">
                                <a-radio v-for="item in MOTO_TOUR_INTENTION_MAP" :value="item.key">
                                    {{lang === 'zh' ? item.zh: item.en}}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.pay_attention_to') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.pay_attention_to">
                                <a-radio v-for="item in PAY_ATTENTION_TO_MAP" :value="item.key">
                                    {{lang === 'zh' ? item.zh: item.en}}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.green_energy_understand') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.green_energy_understand" :placeholder="$t('def.input')" >
                                <a-select-option v-for="item of GREEN_ENERGY_UNDERSTAND_MAP" :key="item.key" :value="item.key">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :md='24' :lg='12'>
                    <div class="form-item ">
                        <div class="key">{{ $t('crm_c_p.electric_two_wheeler_understand') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.electric_two_wheeler_understand" :placeholder="$t('def.input')" >
                                <a-select-option v-for="item of ELECTRIC_TWO_WHEELER_UNDERSTAND_MAP" :key="item.key" :value="item.key">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>

        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('crm-customer.save')">{{ $t('def.sure') }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

import dayjs from "dayjs";
import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';

export default {
    name: 'TestDriveEdit',
    components: {CustomerSelect },
    props: {},
    data() {
        return {
            Core,
            loginType: Core.Data.getLoginType(),
            CRM_TYPE_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,
            CRM_GENDER_MAP: Core.Const.CRM_CUSTOMER.GENDER_MAP,

            BUY_TYPE_MAP: Core.Const.CRM_TEST_DRIVE.BUY_TYPE_MAP,
            RENTAL_DEMAND_MAP: Core.Const.CRM_TEST_DRIVE.RENTAL_DEMAND_MAP,
            TRAVEL_RANGE_MAP: Core.Const.CRM_TEST_DRIVE.TRAVEL_RANGE_MAP,
            GREEN_CAR_OWNER_MAP: Core.Const.CRM_TEST_DRIVE.GREEN_CAR_OWNER_MAP,
            DRIVER_LICENSE_MAP: Core.Const.CRM_TEST_DRIVE.DRIVER_LICENSE_MAP,
            RIDE_EXP_MAP: Core.Const.CRM_TEST_DRIVE.RIDE_EXP_MAP,
            MOTO_EXP_MAP: Core.Const.CRM_TEST_DRIVE.MOTO_EXP_MAP,
            MOTO_TOUR_INTENTION_MAP: Core.Const.CRM_TEST_DRIVE.MOTO_TOUR_INTENTION_MAP,
            PAY_ATTENTION_TO_MAP: Core.Const.CRM_TEST_DRIVE.PAY_ATTENTION_TO_MAP,
            GREEN_ENERGY_UNDERSTAND_MAP: Core.Const.CRM_TEST_DRIVE.GREEN_ENERGY_UNDERSTAND_MAP,
            ELECTRIC_TWO_WHEELER_UNDERSTAND_MAP: Core.Const.CRM_TEST_DRIVE.ELECTRIC_TWO_WHEELER_UNDERSTAND_MAP,

            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            // 加载
            loading: false,
            detail: {},
            id: '',
            form: {
                id: '',

                customer_id:'',
                //用户信息
                name: '',
                phone: '',
                group_id: '',
                gender: '',
                birthday: '',
                customer_type: Core.Const.CRM_CUSTOMER.TYPE.INDIVIDUAL,
                customer_status: Core.Const.CRM_CUSTOMER.STATUS.POOL,



                //用户画像
                customer_portrait_id: '',
                buy_type	:'',
                rental_demand	:'',
                country	:'',
                province	:'',
                city	:'',
                country_en	:'',
                province_en	:'',
                city_en	:'',
                travel_range	:'',
                other_brand_model	:'',
                park_and_charging_pile	:'',
                family_member	:'',
                green_car_owner	:'',
                driver_license	:'',
                ride_exp	:'',
                moto_exp	:'',
                moto_tour_intention	:'',
                pay_attention_to	:'',
                green_energy_understand	:'',
                electric_two_wheeler_understand	:'',
                //试驾信息
                test_drive_time: '',
                crm_dict_id: '',
                dept_id: '',
                channel:Core.Const.CRM_TEST_DRIVE.SALES_ENTRY,

            },

            isExist: '', // 名称输入框提示
            sourceList: [],
            groupOptions: [],

        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.customer_id = Number(this.$route.query.customer_id) || 0
        this.form.id = this.id
        this.form.customer_id = this.customer_id
        if (this.form.id) {
            this.getCrmTestDriveOrder()
            // this.getCustomerDetail();
        } else if (this.form.customer_id){
            this.getCustomerDetail();
            this.getCustomerPortraitDetail();
        } else {
            this.form.status = Number(this.$route.query.status) || 0
        }
        this.getSourceList()
        this.handleGroupTree()
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    this.$router.go(-1)
            }
        },
        getCrmTestDriveOrder() {
            this.loading = true;
            Core.Api.CRMTestDriveOrder.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getCustomerDetail res', res)
                let detail = res.detail
                this.form.test_drive_time = detail.test_drive_time? dayjs.unix(detail.test_drive_time).format('YYYY-MM-DD  HH:mm:ss') : undefined
                this.form.crm_dict_id = detail.crm_dict_id;
                this.form.dept_id = detail.dept_id;
                this.form.customer_id = detail.customer_id;
                console.log("customer_id",res)
                this.getCustomerDetail();
                this.getCustomerPortraitDetail();

            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getCustomerDetail() {
            console.log("customer_id",this.form.customer_id)
            this.loading = true;
            Core.Api.CRMCustomer.detail({
                id: this.form.customer_id,
            }).then(res => {
                console.log('getCustomerDetail res', res)
                let d = res.detail
                this.detail = d
                this.form.birthday = this.detail.birthday ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD') : undefined
                this.form.customer_type = this.detail.type;
                this.form.customer_status = this.detail.status;
                this.form.name = this.detail.name;
                this.form.phone = this.detail.phone;
                this.form.group_id = this.detail.group_id

            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getCustomerPortraitDetail() {
            console.log("customer_id",this.form.customer_id)
            this.loading = true;
            Core.Api.CRMCustomerPortrait.detailCustomerId({
                customer_id: this.form.customer_id,
            }).then(res => {
                console.log('getCustomerDetail res', res)
                let d = res.detail
                this.detail = d
                for (const key in this.detail) {
                    this.form[key] = d[key]
                }
                this.form.customer_portrait_id = this.detail.id
                this.form.id = this.id


            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)

            if (!form.name) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.phone) {
                return this.$message.warning(this.$t('def.enter'))
            }

            if (!this.$Util.ifPhoneFilter(form.phone)){
                return this.$message.warning(this.$t('def.error_phone'))
            }

            if (!form.group_id) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.test_drive_time) {
                return this.$message.warning(this.$t('def.enter'))
            }

            form.test_drive_time = form.test_drive_time ? dayjs(form.test_drive_time).unix() : 0 // 日期转时间戳
            form.birthday = form.birthday ? dayjs(form.birthday).unix() : 0 // 日期转时间戳

            Core.Api.CRMTestDriveOrder.save({
                ...form,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        handleCustomerBlur() {  // 获取 车架号
            if (!this.form.name) {
                return this.isExist = ''
            }
            Core.Api.CRMCustomer.checkPhone({
                id: this.form.id,
                phone: this.form.phone,
            }).then(res => {
                this.isExist = res.results ? 1 : 2
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },
        getSourceList(){
            Core.Api.CRMDict.list({
                type: Core.Const.CRM_DICT.TYPE.TYPE_TEST_MODEL,
                status: Core.Const.CRM_DICT.STATUS.STATUS_NORM
            }).then(res => {
                this.sourceList = res.list
            })
        },
        selectItem(id){
            this.form.customer_id = id
            this.getCustomerDetail()

        },
        handleGroupTree(){
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list
                console.log(res)

            })
        },

    }
};
</script>

<style lang="less">
#TestDriveEdit {

    .icon {
        font-size: 12px;
    }
    .customer-tag {
        margin-top: 10px;

    }

    .form-item.with-btn {
        .value {
            .fac();
            position: relative;
            padding-right: 100px;
            .btn {
                position: absolute;
                width: 80px;
                text-align: right;
                right: 0;
            }
        }
    }

    .form-content.long-key {
        .key { width: 115px; }
        .value { width: calc(100% - 120px); }
    }
    &.en {
        .form-content.long-key {
            .key { width: 200px; }
            .value { width: calc(100% - 200px); }
        }
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

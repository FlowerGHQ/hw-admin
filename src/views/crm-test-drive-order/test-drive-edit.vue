<template>
    <div id="TestDriveEdit" class="edit-container" :class="$i18n.locale">
        <div class="title-container">
            <div class="title-area">
                {{ form.id ? $t('crm_d.edit') : $t('crm_d.save') }}
            </div>
        </div>
        <!-- 客户信息 -->
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_d.customer_information') }}</div>
            </div>
            <div class="form-content">
                <!-- 名称 -->
                <div class="form-item required">
                    <div class="key">{{ $t('n.name') }}：</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.name"
                            :placeholder="$t('def.input')"
                            :disabled="form.id > 0 || form.customer_id > 0"
                        />
                    </div>
                </div>
                <!-- 国家/地区 -->
                <div class="form-item required" v-if="form.id === 0 || form.phone_country_code === ''">
                    <div class="key">{{ $t('n.select_country') }}：</div>
                    <div class="value">
                        <a-select
                            v-model:value="form.country_code"
                            :placeholder="$t('def.input')"
                            :disabled="form.id > 0 && form.country_code != ''"
                            show-search
                            option-filter-prop="key"
                            allow-clear
                        >
                            <a-select-option
                                v-for="item of phoneCountryCodeList"
                                :key="item.phoneAreaCode + item.name + item.enName"
                                :value="item.code"
                            >
                                <span class="phoneCountryCode">{{ item.phoneAreaCode }}</span>
                                {{ lang === 'zh' ? item.name : item.enName }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <!-- 手机号 -->
                <div class="form-item required with-btn">
                    <div class="key">{{ $t('n.phone') }}：</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.phone"
                            :placeholder="$t('def.input')"
                            @blur="handleCustomerBlur"
                            :disabled="form.id > 0 || form.customer_id > 0"
                        />
                        <div class="btn">
                            <span v-if="isExistPhone == 1"><i class="icon i_confirm" /></span>
                            <span v-else-if="isExistPhone == 2"><i class="icon i_close_c" /></span>
                            <CustomerSelect
                                v-if="form.id == 0"
                                @select="selectItem"
                                :select-btn="true"
                                :radioMode="true"
                                :phone="form.phone"
                                :check-mode="false"
                                :select-customer="true"
                                btn-class="select-item-btn"
                                btnType="link"
                                :btnText="$t('crm_c.rechecking')"
                            >
                                {{ $t('crm_c.rechecking') }}
                            </CustomerSelect>
                        </div>
                    </div>
                </div>
                <!-- 邮箱 -->
                <div class="form-item required with-btn">
                    <div class="key">{{ $t('n.email') }}：</div>
                    <div class="value">
                        <a-input
                            v-model:value="form.email"
                            :placeholder="$t('def.input')"
                            @blur="handleCustomerEmailBlur"
                            :disabled="form.id > 0 && form.email != ''"
                        />
                        <div class="btn">
                            <span v-if="isExistEmail == 1"><i class="icon i_confirm" /></span>
                            <span v-else-if="isExistEmail == 2"><i class="icon i_close_c" /></span>
                            <CustomerSelect
                                :radioMode="true"
                                :email="this.form.email"
                                :check-mode="false"
                                :select-customer="true"
                                btn-class="select-item-btn"
                                btnType="link"
                                :btnText="$t('crm_c.rechecking')"
                            >
                                {{ $t('crm_c.rechecking') }}
                            </CustomerSelect>
                        </div>
                    </div>
                </div>
                <!-- 语言 -->
                <div class="form-item required">
                    <div class="key">{{ $t('dis.language') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.language" :placeholder="$t('def.input')">
                            <template v-for="(item, index) in language" :key="index">
                                <a-select-option v-if="item.key !== 1" :value="item.key">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-select-option>
                            </template>
                        </a-select>
                    </div>
                </div>
                <!-- 区域 -->
                <div class="form-item required">
                    <div class="key">{{ $t('crm_c.group') }}：</div>
                    <div class="value">
                        <!-- 防止后面需要禁用(要使用禁用就要判断两种情况一种是官网进来，一种是系统创建) 
				:disabled="
                (form.id > 0 || form.customer_id > 0) && form.group_id > 0
              " -->
                        <a-tree-select
                            class="CategoryTreeSelect"
                            v-model:value="form.group_id"
                            :placeholder="$t('def.select')"
                            :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                            :tree-data="groupOptions"
                            tree-default-expand-all
                            @select="setGroupId"
                        />
                    </div>
                </div>
                <!-- 性别 -->
                <div class="form-item" v-if="form.id == 0">
                    <div class="key">{{ $t('crm_c.gender') }}：</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.gender">
                            <a-radio v-for="item in CRM_GENDER_MAP" :value="item.value">
                                {{ lang === 'zh' ? item.zh : item.en }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- 生日 -->
                <div class="form-item" v-if="form.id == 0">
                    <div class="key">{{ $t('crm_c.birthday') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="form.birthday"
                            valueFormat="YYYY-MM-DD"
                            :placeholder="$t('def.input')"
                        />
                    </div>
                </div>
                <!-- 试驾时间 -->
                <div class="form-item required">
                    <div class="key">{{ $t('crm_d.test_drive_time') }}：</div>
                    <div class="value">
                        <a-date-picker
                            v-model:value="form.drive_time"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            :show-time="defaultTime"
                            :placeholder="$t('def.input')"
                        >
                            <template #suffixIcon><i class="icon i_calendar" /></template>
                        </a-date-picker>
                    </div>
                </div>
                <!-- 门店 -->
                <div class="form-item required">
                    <div class="key">{{ $t('crm_d.dept_id') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.store_id" :placeholder="$t('def.input')" @change="storeChange">
                            <a-select-option v-for="(item, index) in storeList" :key="index" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <!-- 门店邮箱 -->
                <div class="form-item">
                    <div class="key">{{ $t('dis.store_email') }}：</div>
                    <div class="value">
                        {{ storeDetail?.contact_email || '-' }}
                    </div>
                </div>
                <!-- 门店电话号 -->
                <div class="form-item">
                    <div class="key">{{ $t('dis.store_phone') }}：</div>
                    <div class="value">
                        {{ storeDetail?.contact_phone }}
                    </div>
                </div>
                <!-- 营业时间 -->
                <div class="form-item">
                    <div class="key">{{ $t('dis.business_hours') }}：</div>
                    <div class="value">
                        <span v-if="storeDetail.business_time">
                            {{ $t('dis.morning') }}: {{ JSON.parse(storeDetail.business_time)?.time.morning.begin }} -
                            {{ JSON.parse(storeDetail.business_time)?.time.morning.end }} {{ $t('dis.afternoon') }}:
                            {{ JSON.parse(storeDetail.business_time)?.time.afternoon.begin }} -
                            {{ JSON.parse(storeDetail.business_time)?.time.morning.end }}
                        </span>
                        <span v-else> - </span>
                    </div>
                </div>
                <!-- 门店地址 -->
                <div class="form-item">
                    <div class="key">{{ $t('dis.store_address') }}：</div>
                    <div class="value">
                        {{ storeDetail?.address || '-' }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 用户画像 -->
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_d.user_portrait') }}</div>
            </div>
            <a-row class="form-content long-key">
                <!-- 购车方式 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.buy_type') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.buy_type" :placeholder="$t('def.input')">
                                <a-select-option v-for="item of BUY_TYPE_MAP" :key="item.key" :value="item.key">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </a-col>
                <!-- 租赁需求 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.rental_demand') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.rental_demand">
                                <a-radio v-for="item in RENTAL_DEMAND_MAP" :value="item.key">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <!-- 常驻城市 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.city') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.city" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </a-col>
                <!-- 出行范围 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.travel_range') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.travel_range" :placeholder="$t('def.input')">
                                <a-select-option v-for="item of TRAVEL_RANGE_MAP" :key="item.key" :value="item.key">{{
                                    lang === 'zh' ? item.zh : item.en
                                }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </a-col>
                <!-- 他牌车型 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.other_brand_model') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.other_brand_model" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </a-col>
                <!-- 车位&充电桩情况 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.park_and_charging_pile') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.park_and_charging_pile" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </a-col>
                <!-- 家庭成员 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.family_member') }}：</div>
                        <div class="value">
                            <a-input v-model:value="form.family_member" :placeholder="$t('def.input')" />
                        </div>
                    </div>
                </a-col>
                <!-- 新能源车主 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.green_car_owner') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.green_car_owner">
                                <a-radio v-for="item in GREEN_CAR_OWNER_MAP" :value="item.key">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <!-- 驾驶资格 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.driver_license') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.driver_license">
                                <a-radio v-for="item in DRIVER_LICENSE_MAP" :value="item.key">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <!-- 骑行经验 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.ride_exp') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.ride_exp">
                                <a-radio v-for="item in RIDE_EXP_MAP" :value="item.key">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <!-- 摩旅经验 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.moto_exp') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.moto_exp">
                                <a-radio v-for="item in MOTO_EXP_MAP" :value="item.key">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <!-- 摩旅意向 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.moto_tour_intention') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.moto_tour_intention">
                                <a-radio v-for="item in MOTO_TOUR_INTENTION_MAP" :value="item.key">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <!-- 重视方向 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.pay_attention_to') }}：</div>
                        <div class="value">
                            <a-radio-group v-model:value="form.pay_attention_to">
                                <a-radio v-for="item in PAY_ATTENTION_TO_MAP" :value="item.key">
                                    {{ lang === 'zh' ? item.zh : item.en }}
                                </a-radio>
                            </a-radio-group>
                        </div>
                    </div>
                </a-col>
                <!-- 新能源认知度 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.green_energy_understand') }}：</div>
                        <div class="value">
                            <a-select v-model:value="form.green_energy_understand" :placeholder="$t('def.input')">
                                <a-select-option
                                    v-for="item of GREEN_ENERGY_UNDERSTAND_MAP"
                                    :key="item.key"
                                    :value="item.key"
                                    >{{ lang === 'zh' ? item.zh : item.en }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </div>
                </a-col>
                <!-- 电动两轮认知度 -->
                <a-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="form-item">
                        <div class="key">{{ $t('crm_c_p.electric_two_wheeler_understand') }}：</div>
                        <div class="value">
                            <a-select
                                v-model:value="form.electric_two_wheeler_understand"
                                :placeholder="$t('def.input')"
                            >
                                <a-select-option
                                    v-for="item of ELECTRIC_TWO_WHEELER_UNDERSTAND_MAP"
                                    :key="item.key"
                                    :value="item.key"
                                    >{{ lang === 'zh' ? item.zh : item.en }}</a-select-option
                                >
                            </a-select>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>

        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('crm-customer.save')">{{
                $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '@/core';

import dayjs from 'dayjs';
import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';
import phoneCountryCode from '@/assets/js/phoneAreaCode/phoneAreaCode.js';

export default {
    name: 'TestDriveEdit',
    components: { CustomerSelect },
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
            language: Core.Const.language,
            // 加载
            loading: false,
            detail: {},
            id: undefined,
            form: {
                id: undefined,

                customer_id: undefined,
                //用户信息
                name: undefined,
                country_code: undefined, // 国家区域
                phone: undefined, // 手机
                email: undefined, // 邮箱
                group_id: undefined, // 区域
                phone_country_code: undefined,
                gender: undefined, // 性别
                birthday: undefined, // 生日
                drive_time: undefined, // 试驾时间
                store_id: undefined, // 门店选择
                language: undefined, // 语言

                //用户画像
                customer_portrait_id: undefined,
                buy_type: undefined, // 购车方式
                rental_demand: undefined, // 租赁需求
                country: undefined, // start
                province: undefined,
                city: undefined,
                country_en: undefined,
                province_en: undefined,
                city_en: undefined, // end 常驻城市
                travel_range: undefined, // 出行范围
                other_brand_model: undefined, // 他牌车型
                park_and_charging_pile: undefined, // 车位&充电桩情况
                family_member: undefined, // 家庭成员
                green_car_owner: undefined, // 新能源车主
                driver_license: undefined, // 驾驶资格
                ride_exp: undefined, // 骑行经验
                moto_exp: undefined, // 摩旅经验
                moto_tour_intention: undefined, //摩旅意向
                pay_attention_to: undefined, // 重视方向
                green_energy_understand: undefined, // 新能源认知度
                electric_two_wheeler_understand: undefined, // 电动两轮认知度

                // 其他
                channel: Core.Const.CRM_TEST_DRIVE.SALES_ENTRY,
                customer_type: Core.Const.CRM_CUSTOMER.TYPE.INDIVIDUAL,
                customer_status: Core.Const.CRM_CUSTOMER.STATUS.POOL,
            },

            isExistPhone: '', // 名称输入框提示
            isExistEmail: '', // 名称输入框提示
            sourceList: [],
            groupOptions: [],
            phoneCountryCodeList: [],
            storeList: [], // 门店列表
            storeDetail: [], // 门店详情
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
    },
    async mounted() {
        this.phoneCountryCodeList = phoneCountryCode;
        this.id = Number(this.$route.query.id) || 0;
        this.customer_id = Number(this.$route.query.customer_id) || 0;
        this.form.id = this.id;
        this.form.customer_id = this.customer_id;
        await this.getStoreListFetch(); // 获取门店列表
        if (this.form.id) {
            this.getCrmTestDriveOrder();
            // this.getCustomerDetail();
        } else if (this.form.customer_id) {
            this.getCustomerDetail();
            this.getCustomerPortraitDetail();
        } else {
            this.form.status = Number(this.$route.query.status) || 0;
        }
        this.getSourceList();
        this.handleGroupTree();
        if (Core.Data.getCountryCode()) {
            this.form.country_code = Core.Data.getCountryCode();
            this.phoneCountryCodeList.forEach(item => {
                if (item.code === this.form.country_code) {
                    this.form.phone_country_code = item.phoneAreaCode;
                }
            });
        }
        if (Core.Data.getGroupId() && !this.form.group_id) this.form.group_id = Core.Data.getGroupId();
    },
    methods: {
        // 路由跳转
        routerChange(type, item) {
            switch (type) {
                case 'back': // 详情
                    this.$router.go(-1);
            }
        },
        /* Fetch start*/
        // 获取试驾车型列表接口
        getSourceList() {
            Core.Api.CRMDict.list({
                type: Core.Const.CRM_DICT.TYPE.TYPE_TEST_MODEL,
                status: Core.Const.CRM_DICT.STATUS.STATUS_NORM,
            }).then(res => {
                console.log('试驾单车型接口', res.list);
                this.sourceList = res.list;
            });
        },
        // 用户详情接口
        getCustomerDetail() {
            console.log('customer_id', this.form.customer_id);
            this.loading = true;
            Core.Api.CRMCustomer.detail({
                id: this.form.customer_id,
            })
                .then(res => {
                    console.log('用户详情接口', res);
                    this.detail = res.detail;
                    this.form.birthday = this.detail.birthday
                        ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD')
                        : undefined;
                    this.form.customer_type = this.detail.type;
                    this.form.customer_status = this.detail.status;
                    this.form.name = this.detail.name;
                    this.form.phone = this.detail.phone;
                    this.form.email = this.detail.email;
                    this.form.country_code = this.detail.country_code;
                    this.form.phone_country_code = this.detail.phone_country_code;
                    this.form.group_id = this.detail.group_id || '';
                    this.form.channel = this.detail?.channel
                        ? this.detail?.channel
                        : this.detail?.crm_test_drive_order?.channel; // 订单来源
                    //   console.log("测试group_id", this.detail.group_id);
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 用户画像详情
        getCustomerPortraitDetail() {
            console.log('customer_id', this.form.customer_id);
            this.loading = true;
            Core.Api.CRMCustomerPortrait.detailCustomerId({
                customer_id: this.form.customer_id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    for (const key in this.detail) {
                        this.form[key] = d[key];
                    }
                    this.form.customer_portrait_id = this.detail.id;
                    this.form.id = this.id;
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取区域接口
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list;
                console.log('获取区域接口', res);
            });
        },
        // 获取门店列表
        getStoreListFetch(params = {}) {
            return new Promise((resolve, reject) => {
                Core.Api.Store.list({ ...params })
                    .then(res => {
                        console.log('获取门店列表', res);
                        this.storeList = res.list;
                        resolve();
                    })
                    .catch(err => {
                        console.log('获取门店列表失败', err);
                        reject();
                    });
            });
        },
        getCrmTestDriveOrder() {
            this.loading = true;
            Core.Api.CRMTestDriveOrder.detail({
                id: this.form.id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    let detail = res.detail;
                    this.form.drive_time = detail.drive_time
                        ? dayjs.unix(detail.drive_time).format('YYYY-MM-DD  HH:mm:ss')
                        : undefined; // 试驾时间
                    this.form.store_id = detail.store_id; // 门店选择
                    this.form.customer_id = detail.customer_id;

                    // 有门店选择的话渲染门店下面的信息
                    if (this.form.store_id && this.form.store_id != '') {
                        this.storeDetail = this.storeList.find(el => {
                            return el.id == this.form.store_id;
                        });
                        console.log('进来', this.storeDetail.business_time);
                    }
                    console.log('customer_id', res);
                    this.getCustomerDetail(); // 用户详情
                    this.getCustomerPortraitDetail();
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        /* Fetch end */
        /* methods */
        // 确定
        handleSubmit() {
            let formCopy = Core.Util.deepCopy(this.form);

            formCopy.drive_time = formCopy.drive_time ? dayjs(formCopy.drive_time).unix() : 0; // 日期转时间戳
            formCopy.birthday = formCopy.birthday ? dayjs(formCopy.birthday).unix() : 0; // 日期转时间戳

            if (this.checkInput(formCopy)) return;
            Core.Api.CRMTestDriveOrder.save({
                ...Core.Util.searchFilter(formCopy),
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.routerChange('back');
                })
                .catch(err => {
                    console.log('handleSubmit err:', err);
                });
        },
        // 失去焦点手机号验证
        handleCustomerBlur() {
            // 获取 车架号
            if (!this.form.phone) {
                return (this.isExistPhone = '');
            }
            if (!this.form.phone_country_code) {
                return (this.isExistPhone = '');
            }
            Core.Api.CRMCustomer.checkPhone({
                id: this.form.id,
                phone: this.form.phone,
                phone_country_code: this.form.phone_country_code,
            })
                .then(res => {
                    this.isExistPhone = res.results ? 1 : 2;
                    console.log('handleVehicleBlur res', res);
                })
                .catch(err => {
                    console.log('handleVehicleBlur err', err);
                })
                .finally(() => {});
        },
        // 失去焦点邮箱验证
        handleCustomerEmailBlur() {
            // 获取 车架号
            if (!this.form.email) {
                return (this.isExistEmail = '');
            }
            Core.Api.CRMCustomer.checkEmail({
                id: this.form.id,
                email: this.form.email,
            })
                .then(res => {
                    this.isExistEmail = res.results ? 1 : 2;
                    console.log('handleVehicleBlur res', res);
                })
                .catch(err => {
                    console.log('handleVehicleBlur err', err);
                })
                .finally(() => {});
        },
        selectItem(id) {
            this.form.customer_id = id;
            this.getCustomerDetail();
        },
        setGroupId(val) {
            Core.Data.setGroupId(val);
        },
        // form表单检查
        checkInput(formCopy) {
            if (!formCopy.name) {
                return this.$message.warning(`${this.$t('def.enter')}(${this.$t('n.name')})`);
            }
            if (!formCopy.phone) {
                return this.$message.warning(`${this.$t('def.enter')}(${this.$t('n.phone')})`);
            }
            if (!formCopy.language) {
                return this.$message.warning(`${this.$t('def.enter')}(${this.$t('dis.language')})`);
            }
            if (!this.$Util.ifPhoneFilter(formCopy.phone)) {
                return this.$message.warning(this.$t('def.error_phone'));
            }

            if (!formCopy.email || formCopy.email == '') {
                return this.$message.warning(`${this.$t('def.enter')} (${this.$t('n.email')})`);
            }

            if (!formCopy.group_id) {
                return this.$message.warning(`${this.$t('def.enter')} (${this.$t('crm_c.group')})`);
            }
            if (!formCopy.drive_time) {
                return this.$message.warning(`${this.$t('def.enter')} (${this.$t('crm_d.test_drive_time')})`);
            }

            return false;
        },
        // 门店选择
        storeChange(data) {
            this.storeDetail = this.storeList.find(el => {
                return el.id == data;
            });
        },
    },
};
</script>

<style lang="less">
#TestDriveEdit {
    .icon {
        font-size: 12px;
    }

    .form-content.long-key {
        .key {
            width: 115px;
        }
        .value {
            width: calc(100% - 120px);
        }
    }
    &.en {
        .form-content.long-key {
            .key {
                width: 200px;
            }
            .value {
                width: calc(100% - 200px);
            }
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

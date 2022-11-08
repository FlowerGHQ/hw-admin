<template>
    <div id="CustomerEdit" class="edit-container" :class="$i18n.locale">
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
                        <a-input v-model:value="form.name" :placeholder="$t('def.input')" :disabled="form.id > 0"/>
                    </div>

                </div>
                <div class="form-item required" v-if="form.id === 0 || form.phone_country_code === ''">
                    <div class="key">{{ $t('n.select_country') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.phone_country_code" :placeholder="$t('def.input')" @select="setPhoneCountryCode" :disabled="form.id > 0 && form.phone_country_code != ''" show-search option-filter-prop="key" allow-clear>
                            <a-select-option v-for="item of phoneCountryCodeList" :key="item.phoneAreaCode+item.name+item.enName" :value="item.phoneAreaCode"  >
                                <span  class="phoneCountryCode">{{ item.phoneAreaCode }}</span>
                                {{lang === 'zh' ? item.name: item.enName}}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required with-btn" v-if="form.id === 0 || form.phone === ''">
                    <div class="key">{{ $t('n.phone') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.phone" :placeholder="$t('def.input')" @blur="handleCustomerPhoneBlur" :disabled="form.id > 0 && form.phone != ''"/>
                        <div class="btn">
                            <span v-if="isExistPhone == 1"><i class="icon i_confirm"/></span>
                            <span v-else-if="isExistPhone == 2"><i class="icon i_close_c"/></span>
                            <CustomerSelect :radioMode="true" :phone="this.form.phone" :check-mode="false" :select-customer="true" btn-class="select-item-btn" btnType='link' :btnText="$t('crm_c.rechecking')">
                                {{ $t('crm_c.rechecking') }}
                            </CustomerSelect>
                        </div>
                    </div>
                </div>
                <div class="form-item required with-btn" v-if="form.id === 0 || form.email === ''">
                    <div class="key">{{ $t('n.email') }}：</div>
                    <div class="value">
                        <a-input v-model:value="form.email" :placeholder="$t('def.input')" @blur="handleCustomerEmailBlur" :disabled="form.id > 0 && form.email != ''"/>
                        <div class="btn">
                            <span v-if="isExistEmail == 1"><i class="icon i_confirm"/></span>
                            <span v-else-if="isExistEmail == 2"><i class="icon i_close_c"/></span>
                            <CustomerSelect :radioMode="true" :email="this.form.email" :check-mode="false" :select-customer="true" btn-class="select-item-btn" btnType='link' :btnText="$t('crm_c.rechecking')">
                                {{ $t('crm_c.rechecking') }}
                            </CustomerSelect>
                        </div>
                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">{{ $t('crm_group.name') }}：</div> <!--区域 -->
                    <div class="value">
                        <!-- <a-select-->
                        <!--     v-model:value="form.group_id"-->
                        <!--     show-search-->
                        <!--     :placeholder="$t('n.enter')"-->
                        <!--     :default-active-first-option="false"-->
                        <!--     :show-arrow="false"-->
                        <!--     :filter-option="false"-->
                        <!--     :not-found-content="null"-->
                        <!--     @search="handleGroupNameSearch"-->
                        <!--     allowClear-->
                        <!-- >-->
                        <!--     <a-select-option v-for=" item in groupOptions" :key="item.id" :value="item.id">-->
                        <!--         {{item.name}}-->
                        <!--     </a-select-option>-->
                        <!-- </a-select>-->

                        <a-tree-select class="CategoryTreeSelect"
                            v-model:value="form.group_id"
                            :placeholder="$t('def.select')"
                            :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                            :tree-data="groupOptions"
                            tree-default-expand-all
                            @select="setGroupId"
                        />
                    </div>

                </div>
            </div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('crm_c.extended_information') }}</div>
            </div>
            <div class="form-content key130">
                <div class="form-item">
                    <div class="key">{{ $t('crm_c.level') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.level" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of CRM_LEVEL_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>

                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_c.purchase_intent') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.purchase_intent" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of CRM_PURCHASE_INTENT_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>

                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_c.test_drive_intent') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.test_drive_intent" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of CRM_TEST_DRIVE_INTENT_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>

                </div>

                <div class="form-item with-btn">
                    <div class="key">{{ $t('crm_c.crm_dict_id') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.crm_dict_id" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of sourceList" :key="item.id" :value="item.id">{{lang === 'zh' ? item.name: item.name_en}}</a-select-option>
                        </a-select>
                        <div class="btn">
                            <a-button type="link" v-if="$auth('crm-dict.save')" @click="handleSourceModalShow">{{ $t('crm_set.save' )}}</a-button>
                            <a-button type="link"  @click="getSourceList()">{{ $t('crm_set.refresh') }}</a-button>
                        </div>
                    </div>
                </div>
                <div class="form-item" v-if="form.type === CRM_TYPE.UNIT">
                    <div class="key">{{ $t('crm_c.company_size') }}：</div>
                    <div class="value">
                        <a-select v-model:value="form.company_size" :placeholder="$t('def.input')" >
                            <a-select-option v-for="item of CRM_COMPANY_SIZE_MAP" :key="item.key" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
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
                        <!-- <a-input v-model:value="form.birthday" :placeholder="$t('def.input')"/>-->
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
                    <!-- <div class="value">-->
                    <!--     <a-input v-model:value="form.nationality" :placeholder="$t('def.input')"/>-->
                    <!-- </div>-->
                    <div class="value">
                        <CountryCascader v-model:value="areaListContinent" :def-area='defAreaContinent'/>
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
                <div class="form-item textarea">
                    <div class="key">{{ $t('sl.name') }}</div>
                    <div class="value">
                        <LabelSelect :btnText="$t('sl.add')" :category="Core.Const.CRM_LABEL.CATEGORY.CUSTOMER" add-customer-btn="true" @select="handleAddLabelShow" :disabled-checked="labelIdList" />
                        <br/>
                        <a-tag v-for="(label,index) in labelList" color="blue" closable @close="handleDeleteLabel(index)" class="customer-tag">
                            {{lang ==="zh"? label.name : label.name_en}}
                        </a-tag>
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
                            <a-input v-model:value="sourceForm.weight" :placeholder="$t('def.input')"/>
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
import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';
import LabelSelect from '@/components/crm/popup-btn/LabelSelect.vue';
import phoneCountryCode from '@/assets/js/phoneAreaCode/phoneAreaCode.js'

import dayjs from "dayjs";

export default {
    name: 'CustomerEdit',
    components: { ChinaAddressCascader, CountryCascader, AddressCascader, CustomerSelect, LabelSelect},
    props: {},
    data() {
        return {
            Core,
            loginType: Core.Data.getLoginType(),
            CRM_TYPE_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,
            CRM_LEVEL_MAP: Core.Const.CRM_CUSTOMER.LEVEL_MAP,
            CRM_PURCHASE_INTENT_MAP: Core.Const.CRM_CUSTOMER.PURCHASE_INTENT_MAP,
            CRM_TEST_DRIVE_INTENT_MAP: Core.Const.CRM_CUSTOMER.TEST_DRIVE_INTENT_MAP,
            CRM_SOURCE_MAP: Core.Const.CRM_CUSTOMER.SOURCE_MAP,
            CRM_INDUSTRY_MAP: Core.Const.CRM_CUSTOMER.INDUSTRY_MAP,
            CRM_GENDER_MAP: Core.Const.CRM_CUSTOMER.GENDER_MAP,
            CRM_MARITAL_STATUS_MAP: Core.Const.CRM_CUSTOMER.MARITAL_STATUS_MAP,
            CRM_TYPE: Core.Const.CRM_CUSTOMER.TYPE,
            CRM_COMPANY_SIZE_MAP: Core.Const.CRM_CUSTOMER.COMPANY_SIZE_MAP,

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
                group_id: '',
                purchase_intent: '',
                test_drive_intent: '',
                crm_dict_id: '',
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

                phone_country_code: ''
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

            isExistPhone: '', // 名称输入框提示
            isExistEmail: '', // 名称输入框提示

            sourceModalShow: false,
            sourceForm: {
                id: '',
                name: '',
                name_en: '',
                weight: '',
                type: '',
            },
            areaListContinent: [],
            defAreaContinent: [],
            areaContinent: {
                continent: '',
                country: '',
                country_en: '',
                country_code: '',
            },
            labelList: [],
            labelIdList: [],
            groupOptions: [],

            phoneCountryCodeList: []  //手机号地区
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        // console.log('111',phoneCountryCode);
        this.phoneCountryCodeList = phoneCountryCode
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getCustomerDetail();
            this.getLabelList()

        } else {
            this.form.status = Number(this.$route.query.status) || 0
        }
        this.handleGroupTree();
        this.getSourceList()
        if(Core.Data.getPhoneCountryCode()) this.form.phone_country_code = Core.Data.getPhoneCountryCode()
        if(Core.Data.getGroupId()) this.form.group_id = Core.Data.getGroupId()
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
                    if (d[key] !== 0){
                        this.form[key] = d[key]
                    } else {
                        this.form[key] = undefined
                    }
                }
                this.defAddr = [d.province, d.city, d.county]
                this.defAreaContinent = [d.continent || '', d.country || '', d.country_en || '']
                this.handleContinentSelect(this.defAreaContinent);
                this.handleAddressSelect(this.defAddr);


            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let areaContinent = Core.Util.deepCopy(this.areaContinent)
            if (this.areaListContinent.length) {
                console.log('this.areaList:', this.areaListContinent)
                areaContinent = {
                    continent: this.areaListContinent[0].name,
                    country: this.areaListContinent[1].name,
                    country_en: this.areaListContinent[1].name_en,
                    country_code: this.areaListContinent[1].code,
                }
            }

            console.log("areaContinent", areaContinent)
            if (!form.phone_country_code) {
                return this.$message.warning(this.$t('n.choose') + ":" + this.$t('crm_c.phone_country_code') )
            }
            if (!this.$Util.ifPhoneFilter(form.phone,form.phone_country_code)){
                return this.$message.warning(this.$t('def.error_phone'))
            }
            if (!form.name) {
                return this.$message.warning(this.$t('n.enter') + ":" + this.$t('crm_c.name') )
            }
            if (!form.phone && !form.email) {
                return this.$message.warning(this.$t('n.enter') + ":" + this.$t('n.email') + " Or " +  this.$t('n.phone')  )
            }
            if (!form.type) {
                return this.$message.warning(this.$t('n.enter')+ ":" + this.$t('crm_c.type') )
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
                ...areaContinent,
                label_id_list: this.labelIdList,
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
        handleContinentSelect(continent = []) {
            this.areaContinent.continent = continent[0]
            this.areaContinent.country = continent[1]
            this.areaContinent.country_en = continent[2]
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
            Core.Api.CRMDict.list({
              type: Core.Const.CRM_DICT.TYPE.TYPE_CUSTOMER_SOURCE,
              status: Core.Const.CRM_DICT.STATUS.STATUS_NORM
            }).then(res => {
                this.sourceList = res.list
            })
        },
        handleCustomerPhoneBlur() {  // 获取 车架号
            if (!this.form.phone) {
                return this.isExistPhone = ''
            }
            Core.Api.CRMCustomer.checkPhone({
                id: this.form.id,
                phone: this.form.phone,
            }).then(res => {
                this.isExistPhone = res.results ? 1 : 2
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },
        handleCustomerEmailBlur() {  // 获取 车架号
            if (!this.form.email) {
                return this.isExistPhone = ''
            }
            Core.Api.CRMCustomer.checkPhone({
                id: this.form.id,
                phone: this.form.email,
            }).then(res => {
                this.isExistEmail = res.results ? 1 : 2
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
            form.type = Core.Const.CRM_DICT.TYPE.TYPE_CUSTOMER_SOURCE
            Core.Api.CRMDict.save(form).then(res => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.getSourceList()
                this.sourceModalShow = false
            }).catch(err => {
                console.log('handleModalSubmit err:', err)
            }).finally(() => {
                this.loading = false
            })

        },
        // 添加联系人
        // handleAddCustomerShow(ids, items) {
        //     Core.Api.CrmContactBind.batchSave({
        //         target_id: this.detail.id,
        //         target_type: Core.Const.CRM_CONTACT_BIND.TARGET_TYPE.BO,
        //         contact_customer_ids: ids,
        //     }).then(() => {
        //         this.$message.success(this.$t('pop_up.save_success'));
        //     }).catch(err => {
        //         console.log("handleDelete err", err);
        //     })
        // },
        // 添加商品
        handleAddLabelShow(ids, items) {
            console.log("items",items)
            let labelList = Core.Util.deepCopy(this.labelList)
            items.forEach(it => {
                labelList.push(it)
                this.labelIdList.push(it.id)
            })
            this.labelList = labelList

            console.log("items",this.labelList)
        },
        // 添加商品
        handleDeleteLabel(index ) {
            this.labelIdList.splice(index, 1)
            this.labelList.splice(index, 1)
        },
        getLabelList(){
            Core.Api.CRMLabelBind.list({
                target_id: this.form.id,
                target_type: Core.Const.CRM_LABEL.CATEGORY.CUSTOMER,
            }).then(res => {
                let labelList = [];
                res.list.forEach(it => {
                    labelList.push({
                        id: it.label_id,
                        name: it.label,
                        name_en: it.label_en
                    })
                    this.labelIdList.push(it.label_id)
                })
                this.labelList = labelList
            })
        },
        handleGroupTree(){
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list
                console.log(res)

            })
        },
        // 存国家和区域数据
        setPhoneCountryCode(val) {
            Core.Data.setPhoneCountryCode(val)
        },
        setGroupId(val) {
            Core.Data.setGroupId(val)
        },
        filterOption(input, option) {
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;

        },
    }
};
</script>

<style lang="less" scope>
#CustomerEdit {

    .icon {
        font-size: 12px;
    }
    .customer-tag {
        margin-top: 10px;

    }

}

.phoneCountryCode {
    display: inline-block !important;
    width: 50px !important;
}
.form-item {
    .fac();

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
    .key {
        width: 120px;
    }
}
</style>

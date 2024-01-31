<template>
    <div id="OrderIncomeEdit" class="edit-container" :class="$i18n.locale">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_oi.edit') : $t('crm_oi.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content key130">
                <!-- <div class="form-item required">-->
                <!--     <div class="key">{{ $t('crm_oi.belong_order') }}：</div> &lt;!&ndash; 归属合同订单 &ndash;&gt;-->
                <!--     <div class="value">-->
                <!--         <a-input v-model:value="form.order_id" :placeholder="$t('def.input')"/>-->
                <!--     </div>-->
                <!-- </div>-->

                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.belong_order') }}：</div> <!-- 所属客户 -->
                    <div class="value">
                        <a-select v-model:value="form.order_id" show-search :placeholder="$t('n.enter')"
                            :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                            :not-found-content="null" @search="handleOrderNameSearch"
                            @change="handleOrderIdSearch('change')" allowClear
                            :disabled="order_id !== '' && order_id !== 0">
                            <a-select-option v-for=" item in itemOptions" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.uid') }}：</div> <!-- 回款编号 -->
                    <div class="value">
                        <a-input v-model:value="form.uid" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.money') }}：</div> <!-- 回款金额 -->
                    <div class="value">
                        <a-input v-model:value="form.money" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.date') }}：</div> <!-- 签约日期 -->
                    <div class="value">
                        <a-date-picker v-model:value="form.date" valueFormat='YYYY-MM-DD'
                            :placeholder="$t('crm_def.select_date')" />
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.payment_type') }}：</div> <!-- 支付方式 -->
                    <div class="value">
                        <a-select v-model:value="form.payment_type" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of CRM_PAYMENT_TYPE" :key="item.value" :value="item.value">{{ lang
                                === 'zh' ? item.zh : item.en }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.type') }}：</div> <!-- 回款类型 -->
                    <div class="value">
                        <a-select v-model:value="form.type" :placeholder="$t('def.select')">
                            <a-select-option v-for="item of CRM_TYPE" :key="item.value" :value="item.value">{{ lang === 'zh'
                                ? item.zh : item.en }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_oi.remark') }}：</div> <!-- 备注 -->
                    <div class="value">
                        <a-input v-model:value="form.remark" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 附件上传及列表 -->
                <UploadFileWithList :target_id="form.id" :target_type="CRM_ORDER_INCOME_FILE" @getUploadData="getUploadData"
                    ref='UploadFile' />
                <div class="form-item textarea">
                    <div class="key">{{ $t('sl.name') }}</div>
                    <div class="value">
                        <LabelSelect :btnText="$t('sl.add')" :category="Core.Const.CRM_LABEL.CATEGORY.ORDER_INCOME"
                            add-customer-btn="true" @select="handleAddLabelShow" :disabled-checked="labelIdList" />
                        <br />
                        <a-tag v-for="(label, index) in labelList" closable color="blue" @close="handleDeleteLabel(index)"
                            class="customer-tag">
                            <template #closeIcon><i class="icon i_m_error"></i></template>
                            {{ lang === "zh" ? label.label : label.label_en }}
                        </a-tag>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_o.approval_process') }}：</div>
                    <div class="value">
                        <AuditUser :def-audit-user-list="auditUserList" :group-id="order_detail.group_id"
                            @list="handleAuditUserIdList" :btn-text="$t('crm_o.add_reviewer')"></AuditUser>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('crm-order-income.save')">{{ $t('def.sure')
            }}</a-button>
            <a-button @click="routerChange('back')" type="primary" ghost="">{{ $t('def.cancel') }}</a-button>
        </div>
    </div>
</template>

<script>
import Core from '../../core';

import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'
import CountryCascader from '@/components/common/CountryCascader.vue'
import AddressCascader from '@/components/common/AddressCascader.vue';
import UploadFileWithList from '@/components/common/UploadFileWithList.vue'
import AuditUser from '@/components/crm/popup-btn/AuditUser.vue'
import dayjs from "dayjs";
import LabelSelect from '@/components/crm/popup-btn/LabelSelect.vue';
export default {
    name: 'OrderIncomeEdit',
    components: { ChinaAddressCascader, CountryCascader, AddressCascader, UploadFileWithList, AuditUser, LabelSelect },
    props: {},
    data() {
        return {
            Core,
            CRM_ORDER_INCOME_FILE: Core.Const.ATTACHMENT.TARGET_TYPE.CRM_ORDER_INCOME_FILE,

            loginType: Core.Data.getLoginType(),
            CRM_PAYMENT_TYPE: Core.Const.CRM_ORDER_INCOME.PAYMENT_TYPE_MAP,
            CRM_TYPE: Core.Const.CRM_ORDER_INCOME.TYPE_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            // 加载
            loading: false,
            detail: {},
            form: {
                order_id: undefined,
                uid: '',
                name: '',
                date: '',
                money: '',
                payment_type: undefined,
                type: undefined,
                seller_signatory: '',
                buyer_signatory: '',
                remark: '',
                attachment_list: [],
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
            order_id: '',
            itemOptions: [],
            auditUserList: [],
            labelList: [],
            labelIdList: [],
            order_detail: {},
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
        this.order_id = Number(this.$route.query.order_id) || 0

        if (this.form.id) {
            this.getOrderDetail();
            this.getLabelList()
        } else if (this.order_id != 0) {
            this.form.order_id = this.order_id
            this.handleOrderIdSearch("init")
        } else {
            this.handleOrderNameSearch()
        }

    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    let routeUrl = this.$router.resolve({
                        path: "/crm-order-income/order-income-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.CRMOrderIncome.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getOrderDetail res', res)
                this.detail = res.detail
                this.detail.date = this.detail.date ? dayjs.unix(this.detail.date).format('YYYY-MM-DD') : undefined
                this.detail.money = Core.Util.countFilter(this.detail.money)
                for (const key in this.form) {
                    if (this.detail[key] !== 0) {
                        this.form[key] = this.detail[key]
                    } else {
                        this.form[key] = undefined
                    }
                }
                this.handleOrderIdSearch("init")
                let auditUserList = []
                this.detail.audit_user_list.forEach(item => {
                    let param = {
                        id: item.audit_user_id,
                        name: item.audit_user_name,
                    }
                    auditUserList.push(param)
                })

                this.auditUserList = auditUserList

                // this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getOrderDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSubmit() {
            this.$refs.UploadFile.getUploadData() // 子组件拿值
            let form = Core.Util.deepCopy(this.form)
            // let area = Core.Util.deepCopy(this.area)
            if (!form.order_id) {
                return this.$message.warning(this.$t('n.enter') + ":" + this.$t('crm_oi.belong_order'))
            }
            if (!form.uid) {
                return this.$message.warning(this.$t('n.enter') + ":" + this.$t('crm_oi.uid'))
            }
            if (!form.money) {
                return this.$message.warning(this.$t('n.enter') + ":" + this.$t('crm_oi.money'))
            }
            if (!form.date) {
                return this.$message.warning(this.$t('n.enter') + ":" + this.$t('crm_oi.date'))
            }
            if (!form.payment_type) {
                return this.$message.warning(this.$t('n.choose') + ":" + this.$t('crm_oi.payment_type'))
            }
            if (!form.type) {
                return this.$message.warning(this.$t('n.choose') + ":" + this.$t('crm_oi.type'))
            }
            // form.birthday = form.birthday ? dayjs(form.birthday).unix() : 0 // 日期转时间戳
            form.date = form.date ? dayjs(form.date).unix() : 0 // 日期转时间戳
            console.log('form', this.form)
            let audit_user_id_list = []
            this.auditUserList.forEach(it => {
                audit_user_id_list.push(it.id)
            })
            if (audit_user_id_list.length === 0) {
                return this.$message.warning(this.$t('def.enter'))
            }
            Core.Api.CRMOrderIncome.save({
                ...form,
                audit_user_id_list: audit_user_id_list,
                label_id_list: this.labelIdList,
                money: this.form.money * 100
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.$router.go(-1)
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        getUploadData(uploadData) { // 子组件拿值
            this.form.attachment_list = uploadData
        },

        handleAddressSelect(address = []) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        },
        getCountry(data) {
            console.log('getCountry data', data)
            if (data.country == '中国' || data.country == 'China') {
                this.countryShow = true
            } else {
                this.countryShow = false
            }
            console.log('data.country', data.country)
            console.log('countryShow', this.countryShow)

        },
        handleOrderNameSearch(name) {
            Core.Api.CRMOrder.list({ name: name, search_type: Core.Const.CRM_ORDER.SEARCH_TYPE.PERSONAL }).then(res => {
                this.itemOptions = res.list

            })
        },
        handleOrderIdSearch(type) {
            Core.Api.CRMOrder.detail({ id: this.form.order_id }).then(res => {
                this.order_detail = res.detail;
                let customer_name = res.detail.customer_name
                if (type === 'init') {
                    this.handleOrderNameSearch(customer_name)
                }
                if (type === 'change') {
                    this.auditUserList = []
                }

            })
        },
        handleAuditUserIdList(auditUserList) {
            console.log("auditUserList11111", auditUserList)
            if (auditUserList !== null) {
                this.auditUserList = auditUserList
            } else {
                this.auditUserList = []
            }

        },
        // handleOrderIdSearch(type){
        //     Core.Api.CRMOrder.detail({id: this.form.customer_id}).then(res => {
        //         this.CRMOrder = res.detail
        //         console.log("res", res)
        //         if (type === 'init'){
        //             this.handleCustomerNameSearch(res.name)
        //         }
        //
        //     })
        // },
        // 添加商品
        handleAddLabelShow(ids, items) {
            console.log("items", items)
            let labelList = Core.Util.deepCopy(this.labelList)
            items.forEach(it => {
                labelList.push(it)
                this.labelIdList.push(it.id)
            })
            this.labelList = labelList

            console.log("items", this.labelList)
        },
        // 添加商品
        handleDeleteLabel(index) {
            this.labelIdList.splice(index, 1)
            this.labelList.splice(index, 1)
        },
        getLabelList() {
            Core.Api.CRMLabelBind.list({
                target_id: this.form.id,
                target_type: Core.Const.CRM_LABEL.CATEGORY.ORDER_INCOME,
            }).then(res => {
                let labelList = [];
                res.list.forEach(it => {
                    labelList.push({
                        id: it.label_id,
                        name: it.label,
                        name_en: it.label_en,
                    })
                    this.labelIdList.push(it.id)
                })
                this.labelList = labelList
            })
        },
    }
};
</script>

<style lang="less">
#OrderIncomeEdit {
    .customer-tag {
        margin-top: 10px;

    }

    .icon {
        font-size: 12px;
    }
}
</style>

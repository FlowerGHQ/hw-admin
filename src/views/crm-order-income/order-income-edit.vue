<template>
    <div id="OrderEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_oi.edit') : $t('crm_oi.save') }}</div>
        </div>
        <div class="form-block">
            <div class="form-title">
                <div class="title-colorful">{{ $t('n.information') }}</div>
            </div>
            <div class="form-content">
<!--                <div class="form-item required">-->
<!--                    <div class="key">{{ $t('crm_oi.belong_order') }}：</div> &lt;!&ndash; 归属合同订单 &ndash;&gt;-->
<!--                    <div class="value">-->
<!--                        <a-input v-model:value="form.order_id" :placeholder="$t('def.input')"/>-->
<!--                    </div>-->
<!--                </div>-->

                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.belong_order') }}：</div> <!-- 所属客户 -->
                    <div class="value">
                        <a-select
                            v-model:value="form.order_id"
                            show-search
                            :placeholder="$t('n.enter')"
                            :default-active-first-option="false"
                            :show-arrow="false"
                            :filter-option="false"
                            :not-found-content="null"
                            @search="handleOrderNameSearch"
                            allowClear
                            :disabled="order_id !== ''"
                        >
                            <a-select-option v-for=" item in itemOptions" :key="item.id" :value="item.id">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </div>
                </div>

                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.uid') }}：</div> <!-- 回款编号 -->
                    <div class="value">
                        <a-input v-model:value="form.uid" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.money') }}：</div> <!-- 回款金额 -->
                    <div class="value">
                        <a-input v-model:value="form.money" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.date') }}：</div> <!-- 签约日期 -->
                    <div class="value">
                        <a-date-picker v-model:value="form.date" valueFormat='YYYY-MM-DD' placeholder="选择日期"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.payment_type') }}：</div> <!-- 支付方式 -->
                    <div class="value">
                        <a-select v-model:value="form.payment_type" :placeholder="$t('def.select')" >
                            <a-select-option v-for="item of CRM_PAYMENT_TYPE" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">{{ $t('crm_oi.type') }}：</div> <!-- 回款类型 -->
                    <div class="value">
                        <a-select v-model:value="form.type" :placeholder="$t('def.select')" >
                            <a-select-option v-for="item of CRM_TYPE" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">{{ $t('crm_oi.remark') }}：</div> <!-- 备注 -->
                    <div class="value">
                        <a-input v-model:value="form.remark" :placeholder="$t('def.input')"/>
                    </div>
                </div>
                <!-- 附件上传及列表 -->
                <UploadFileWithList :target_id="form.id" :target_type="CRM_ORDER_INCOME_FILE" @getUploadData="getUploadData" ref='UploadFile'/>
        </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary" v-if="$auth('crm-order-income.save')">{{ $t('def.sure') }}</a-button>
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
import dayjs from "dayjs";

export default {
    name: 'OrderEdit',
    components: { ChinaAddressCascader, CountryCascader, AddressCascader, UploadFileWithList},
    props: {},
    data() {
        return {
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
                payment_type: undefined,
                type: undefined,
                seller_signatory: '',
                buyer_signatory: '',
                remark:'',
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
            this.getOrderDetail();
        }
        this.handleOrderNameSearch()
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':    // 详情
                    this.$router.go(-1)
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.CRMOrderIncome.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getOrderDetail res', res)
                let d = res.detail
                this.detail = d
                this.detail.date = detail.date ? dayjs.unix(detail.date).format('YYYY-MM-DD') : undefined
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                this.defAddr = [d.province, d.city, d.county]

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
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.uid) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.money) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.date) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.payment_type) {
                return this.$message.warning(this.$t('def.enter'))
            }
            if (!form.type) {
                return this.$message.warning(this.$t('def.enter'))
            }
            // form.birthday = form.birthday ? dayjs(form.birthday).unix() : 0 // 日期转时间戳
            form.date = form.date ? dayjs(form.date).unix() : 0 // 日期转时间戳
            console.log('form',this.form)
            Core.Api.CRMOrderIncome.save({
                ...form,
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
            console.log('getCountry data',data)
            if (data.country == '中国' || data.country == 'China') {
                this.countryShow = true
            } else {
                this.countryShow = false
            }
            console.log('data.country',data.country)
            console.log('countryShow',this.countryShow)

        },
        handleOrderNameSearch(name){
            Core.Api.CRMOrder.list({name: name, search_type: Core.Const.CRM_ORDER.SEARCH_TYPE.PERSONAL}).then(res => {
                this.itemOptions = res.list

            })
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
    }
};
</script>

<style lang="less">
.OrderEdit {

    .icon {
        font-size: 12px;
    }
}
</style>

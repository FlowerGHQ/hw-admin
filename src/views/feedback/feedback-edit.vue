<template>
<div id="FeedbackEdit" class="edit-container">
    <div class="title-container">
        <div class="title-area">{{ form.id ? $t('fe.feedback_update') : $t('fe.feedback_create') }}</div>
    </div>
    <div class="form-block"> <!-- 工单内容 -->
        <div class="form-title"><div class="title">{{ $t('fe.feedback_content') }}</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">{{ $t('fe.feedback_title') }}</div>
                <div class="value">
                    <a-input v-model:value="form.title" :placeholder="$t('fe.enter_name')" :maxlength='50'/>
                </div>
            </div>

            <div class="form-item required textarea">
                <div class="key">{{ $t('fe.feedback_desc') }}</div>
                <div class="value">
                    <a-textarea v-model:value="form.desc" :placeholder="$t('fe.fault_description')"
                        :auto-size="{ minRows: 4, maxRows: 6 }" :maxlength='500'/>
                    <span class="content-length">{{ form.desc.length }}/500</span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block"> <!-- 车辆信息 -->
        <div class="form-title">
            <div class="title">{{ $t('r.vehicle_information') }}</div>
        </div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">{{ $t('search.vehicle_no') }}</div>
                <div class="value">
                    <a-input v-model:value="form.entity_uid" :placeholder="$t('search.enter_vehicle_no')" @blur="handleVehicleBlur" :disabled="form.id!==0 "/>
                    <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                    <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                </div>
            </div>
            <div class="form-item" v-if="form.entity_uid && isExist == 1">
                <div class="key">{{ $t('r.arrival_time') }}</div>
                <div class="value" >
                    {{ $Util.timeFilter(arrival_time) }}
                </div>
            </div>
            <div class="form-item" v-if="form.entity_uid && isExist == 1">
                <div class="key">{{ $t('fe.vehicle_model') }}</div>
                <div class="value" >
                    {{ item_name }}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('r.miles_driven') }}</div>
                <div class="value">
                    <a-input-number v-model:value="form.mileage" :min="0" :precision="3"/>
                    <span class="unit">{{ $t('r.km') }}</span>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('r.time_buying') }}</div>
                <div class="value">
                    <a-date-picker v-model:value="form.sale_time" valueFormat='YYYY-MM-DD HH:mm:ss' :show-time="defaultTime" :placeholder="$t('r.select_arrival')">
                        <template #suffixIcon><i class="icon i_calendar"/></template>
                    </a-date-picker>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block"> <!-- 车主信息 -->
        <div class="form-title">
            <div class="title">{{ $t('r.customer') }}</div>
        </div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">{{ $t('r.associated_customers') }}</div>
                <div class="value">
                    <a-select :placeholder="$t('r.select_customer')" v-model:value="form.customer_id" @change="handleCustomerSelect" show-search option-filter-prop="children"
                        :disabled="detail.status == REPAIR.STATUS.WAIT_DETECTION">
                        <a-select-option v-for="(item,index) of customerList" :key="index" :value="item.id">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="sp">
                    <a-button type="link" v-if="$auth('customer.save')" @click="routerChange('customer')">{{ $t('r.add_customer') }}</a-button>
                    <a-button type="link" @click="getCustomerList('refresh')">{{ $t('r.refresh') }}</a-button>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('r.email') }}</div>
                <div class="value">
                    <a-input v-model:value="form.customer_email" :placeholder="$t('r.enter_email')"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('r.address') }}</div>
                <div class="value">
<!--                    <ChinaAddressCascader @select='handleAddressSelect' :default-address='defAddr'/>-->
                    <AddressCascader v-model:value="areaMap" :def-area='area' :default-address='defAddr'/>
                </div>
            </div>
            <div class="form-item" :class="form.channel == 1 ? 'required' : ''">
                <div class="key">{{ $t('r.specific_address') }}</div>
                <div class="value">
                    <a-input v-model:value="form.customer_address" :placeholder="$t('r.enter_specific')"/>
                </div>
            </div>
        </div>
    </div>
    <div class="form-btns">
        <a-button @click="handleSubmit" type="primary" v-if="$auth('repair-order.save')">{{ $t('def.sure') }}</a-button>
        <a-button @click="routerChange('back')">{{ $t('def.cancel') }}</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';

const REPAIR = Core.Const.REPAIR
import ChinaAddressCascader from '@/components/common/ChinaAddressCascader.vue'
import AddressCascader from '@/components/common/AddressCascader.vue'

export default {
    name: 'RepairEdit',
    components: {ChinaAddressCascader, AddressCascader},
    props: {},
    data() {
        return {
            REPAIR,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {
                status: 0,
            }, // 工单详情
            create_time: [],
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,

            customerList: [], // 车主列表
            isExist: '', // 车辆编号输入框提示
            form: {
                id: '',

                type: 1,  // 工单分类
                category: 1, // 维修工单类别
                title: '', // 工单名称
                desc: '', // 问题描述
                service_type: '',//保内维修、保外维修
                mileage: '',//行程公里数

                entity_uid: '', // 车架号
                sale_time: '',
                customer_id: undefined,  // 相关客户-id
                customer_name: "",  // 相关客户-名称
                customer_phone: "", // 客户电话
                customer_email: "", // 客户邮箱
                customer_address: "", // 维修地址
                remark: "", // 工单备注

                repair_user_id: undefined, // 工单负责人
                plan_time: undefined, // 计划时间
                // finish_time: undefined, // 完成时间
                repair_message: "", // 处理信息、工单备注
            },
            defAddr: [],
            arrival_time: '',
            item_name:'',
            areaMap: {},
            area: {
                country: '',
                country_en: '',
                province: '',
                province_en: '',
                city: '',
                city_en: '',
                county: '',
            }
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        this.getCustomerList();
        if (this.form.id) {
            this.getFeedbackDetail();
        }

    },
    methods: {
        // 页面跳转
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'customer':  // 新建客户
                    routeUrl = this.$router.resolve({
                        path: "/customer/customer-edit",
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
                case 'detail':  // 维修单详情
                    routeUrl = this.$router.resolve({
                        path: "/feedback/feedback-detail",
                        query: {
                            id: item.id
                        }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },

        // 获取 车主列表
        getCustomerList(val) {
            Core.Api.Customer.list(
            ).then(res => {
                this.customerList = res.list
                if (val == 'refresh') {
                    this.$message.success(this.$t('r.refreshed'))
                }
            })
        },
        // 获取工单详情
        getFeedbackDetail() {
            this.loading = true;
            Core.Api.Feedback.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.form.id = res.id
                for (const key in this.form) {
                    if (key !== "sale_time"){
                        this.form[key] = res[key]
                    }

                }
                this.form.customer_id = this.form.customer_id || undefined
                this.form.repair_user_id = this.form.repair_user_id || undefined
                this.handleVehicleBlur()
                Core.Api.Customer.list(
                ).then(res => {
                    this.customerList = res.list
                    this.handleCustomerSelect(this.form.customer_id)
                })

                // this.form.sale_time = this.form.sale_time ? dayjs.unix(this.form.sale_time).format('YYYY-MM-DD HH:mm:ss') : undefined
                // this.form.finish_time = this.form.finish_time ? dayjs.unix(this.form.finish_time).format('YYYY-MM-DD HH:mm:ss') : undefined
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 表单提交
        async handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            let area = Core.Util.deepCopy(this.area)

            if (!Core.Util.isEmptyObj(this.areaMap)) {
                console.log('areaMap2222',this.areaMap)
                area.country = this.areaMap.country.name
                area.country_en = this.areaMap.country.name_en
                area.city = this.areaMap.city.name
                area.city_en = this.areaMap.city.name_en
                if (this.areaMap.province) {
                    area.province = this.areaMap.province.name
                    area.province_en = this.areaMap.province.name_en
                } else {
                    area.province = ""
                    area.province_en = ""

                }
                if (this.areaMap.county) {
                    area.county = this.areaMap.county.name
                    area.county_en = this.areaMap.county.county_en
                }else {
                    area.county = ""
                    area.county_en = ""
                }
            }
            console.log('handleSubmit area:', area)
            console.log('handleSubmit areaMap:', this.areaMap)
            console.log('handleSubmit form:', form)

            let checkRes = this.checkFormInput(form,area);
            if (!checkRes) {
                return
            }
            let apiName = form.id ? 'update' : 'create'
            form.sale_time = form.sale_time ? dayjs(form.sale_time).unix() : 0 // 日期转时间戳
            console.log('area27249534',area)
            await Core.Api.Feedback[apiName]({
                ...form,
                ...area,
            }).then(res => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.routerChange('detail', res.detail)
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },

        handleVehicleBlur() {  // 获取 车架号
            if (!this.form.entity_uid) {
                return this.isExist = ''
            }
            Core.Api.Entity.detailByUid({
                uid: this.form.entity_uid,
            }).then(res => {
                this.isExist = res.detail == null ? 2 : 1
                this.arrival_time = res.detail.arrival_time
                this.item_name = res.detail.item? res.detail.item.name: ''
                this.form.sale_time = res.detail.sale_time ? dayjs.unix(res.detail.sale_time).format('YYYY-MM-DD HH:mm:ss') : undefined

                console.log('arrival_time')
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },
        // 检查表单输入
        checkFormInput(form,area) {

            if (!form.mileage) {
                this.$message.warning(this.$t('def.enter'))
                return 0
            }
            if (!form.sale_time) {
                this.$message.warning(this.$t('def.enter'))
                return 0
            }
            if (!form.title) {
                this.$message.warning(this.$t('def.enter')+1)
                return 0
            }
            if (!form.desc) {
                this.$message.warning(this.$t('def.enter'))
                return 0
            }
            if (!form.entity_uid) {
                this.$message.warning(this.$t('def.enter'))
                return 0
            }
            if (this.isExist === false) {
                this.$message.warning(this.$t('def.enter'))
            }
            if (form.id) {
                if (!form.customer_id) {
                    this.$message.warning(this.$t('def.enter'))
                    return 0
                }
                // if (!form.repair_user_id) {
                //     this.$message.warning('请选择工单负责人')
                //     return 0
                // }
                if (!form.customer_name) {
                    this.$message.warning(this.$t('def.enter'))
                    return 0
                }
                if (!form.customer_phone) {
                    this.$message.warning(this.$t('def.enter'))
                    return 0
                }
                if (!form.customer_email) {
                    this.$message.warning(this.$t('def.enter'))
                    return 0
                }
                if ( !area.county && !area.city) {
                    this.$message.warning(this.$t('def.enter'))
                    return 0
                }
            }
            return 1
        },

        // 选择客户
        handleCustomerSelect(id) {
            let item = this.customerList.find(i => i.id === id)
            console.log('customerList',this.customerList)
            this.form.customer_name = item.name
            this.form.customer_phone = item.phone
            this.form.customer_email = item.email
            this.area.country = item.country
            this.area.country_en = item.country_en
            this.area.province = item.province
            this.area.province_en = item.province_en
            this.area.city = item.city
            this.area.city_en = item.city_en
            this.area.county = item.county
            this.form.customer_address = item.address
            // this.defAddr = [item.country,item.province, item.city, item.county]
            console.log('this.addr', this.defAddr)

        },
        handleTypeChange(){
            switch (this.form.type){
                case REPAIR.TYPE.TYPE_COMMON: {
                    this.form.service_type = '';
                    break;
                }
                case REPAIR.TYPE.TYPE_SPECIAL: {
                    this.form.service_type = REPAIR.SERVICE_TYPE.IN_REPAIR_TIME;
                    break;
                }
            }
        },

       /* handleAddressSelect(address) {
            this.form.province = address[0]
            this.form.city = address[1]
            this.form.county = address[2]
        }*/
    }
};
</script>

<style lang="less">
#FeedbackEdit {
    .form-item {
        .value {
            .fac();
            .ant-input-number {
                margin-right: 10px;
            }
            .unit {
                font-size: 12px;
                line-height: 16px;
                color: #363D42;
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
    }
}
</style>

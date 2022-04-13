<template>
<div id="RepairEdit" class="edit-container">
    <div class="title-container">
        <div class="title-area">{{ form.id ? $t('n.repair.edit') : $t('n.repair_create') }}</div>
    </div>
    <div class="form-block"> <!-- 工单内容 -->
        <div class="form-title"><div class="title">{{ $t('r.repair_content') }}</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">{{ $t('r.repair_classify') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="form.type" :disabled="!!form.id">
                        <a-radio v-for="item of typeList" :key="item.value" :value="item.value">{{item[$i18n.locale]}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required" v-if="form.type == 1">
                <div class="key">{{ $t('r.category') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="form.category">
                        <a-radio v-for="item of categoryList" :key="item.value" :value="item.value">{{item[$i18n.locale]}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('r.urgency') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="form.priority">
                        <a-radio v-for="item of priorityList" :key="item.value" :value="item.value">{{item[$i18n.locale]}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('r.warranty') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="form.service_type" :disabled="!!form.id">
                        <a-radio v-for="item of serviceList" :key="item.value" :value="item.value">{{item[$i18n.locale]}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <!-- <a-date-picker v-model:value="form.plan_time" valueFormat='YYYY-MM-DD HH:mm:ss'/> -->
            <div class="form-item required">
                <div class="key">{{ $t('r.repair_name') }}</div>
                <div class="value">
                    <a-input v-model:value="form.name" :placeholder="$t('r.enter_name')" :maxlength='50'/>
                </div>
            </div>

            <div class="form-item required textarea">
                <div class="key">{{ $t('r.description') }}</div>
                <div class="value">
                    <a-textarea v-model:value="form.desc" :placeholder="$t('r.fault_description')"
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
                <div class="key">{{ $t('r.repair_way') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="form.channel">
                        <a-radio v-for="item of channelList" :key="item.value" :value="item.value">{{ item[$i18n.locale] }}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('r.repair_category') }}</div>
                <div class="value">
                    <a-radio-group v-model:value="form.repair_method">
                        <a-radio v-for="item of methodList" :key="item.value" :value="item.value">{{ item[$i18n.locale] }}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('search.vehicle_no') }}</div>
                <div class="value">
                    <a-input v-model:value="form.vehicle_no" :placeholder="$t('search.enter_vehicle_no')" @blur="handleVehicleBlur"/>
                    <span v-if="isExist == 1"><i class="icon i_confirm"/></span>
                    <span v-else-if="isExist == 2"><i class="icon i_close_c"/></span>
                </div>
            </div>
            <div class="form-item" v-if="form.vehicle_no && isExist == 1">
                <div class="key">{{ $t('r.arrival_time') }}</div>
                <div class="value" >
                    {{ $Util.timeFilter(arrival_time) }}
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('r.miles_driven') }}</div>
                <div class="value">
                    <a-input-number v-model:value="form.travel_distance" :min="0" :precision="3"/>
                    <span class="unit">{{ $t('r.km') }}</span>
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
                    <a-button type="link" @click="routerChange('customer')">{{ $t('r.add_customer') }}</a-button>
                    <a-button type="link" @click="getCustomerList('refresh')">{{ $t('r.refresh') }}</a-button>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('r.customer_phone') }}</div>
                <div class="value">
                    <a-input v-model:value="form.customer_phone" :placeholder="$t('r.enter_phone')"/>
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
                    <AddressCascader @select='handleAddressSelect' :default-address='defAddr'/>
                </div>
            </div>
            <div class="form-item" :class="form.channel == 1 ? 'required' : ''">
                <div class="key">{{ $t('r.specific_address') }}</div>
                <div class="value">
                    <a-input v-model:value="form.customer_address" :placeholder="$t('r.enter_specific')"/>
                </div>
            </div>
            <div class="form-item textarea">
                <div class="key">{{ $t('r.remark') }}</div>
                <div class="value">
                    <a-textarea v-model:value="form.remark" :placeholder="$t('r.enter_remark')"
                        :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='500'/>
                    <span class="content-length">{{ form.remark.length }}/500</span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-btns">
        <a-button @click="handleSubmit" type="primary">{{ $t('def.ok') }}</a-button>
        <a-button @click="routerChange('back')">{{ $t('def.cancel') }}</a-button>
    </div>
</div>
</template>

<script>
import Core from '../../core';
import dayjs from 'dayjs';

const REPAIR = Core.Const.REPAIR
import AddressCascader from '@/components/common/AddressCascader.vue'

export default {
    name: 'RepairEdit',
    components: {AddressCascader},
    props: {},
    data() {
        return {
            REPAIR,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {
                status: 0,
                repair_user_id: undefined, // 工单负责人
                plan_time: undefined, // 计划时间
                repair_message: "", // 处理信息、工单备注
                priority: 0, // 紧急程度
            }, // 工单详情
            create_time: [],
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,

            typeList: REPAIR.TYPE_LIST, // 工单分类
            categoryList: REPAIR.CATEGORY_LIST, // 维修工单类别
            methodList: REPAIR.METHOD_LIST, // 维修类别
            serviceList: REPAIR.SERVICE_TYPE_LIST,//工单帐类
            channelList: REPAIR.CHANNEL_LIST, // 维修方式
            priorityList: REPAIR.PRIORITY_LIST, // 紧急程度
            customerList: [], // 车主列表
            isExist: '', // 车辆编号输入框提示
            form: {
                id: '',

                type: 1,  // 工单分类
                category: 1, // 维修工单类别
                name: '', // 工单名称
                desc: '', // 问题描述
                service_type: '',//保内维修、保外维修
                travel_distance: '',//行程公里数

                channel: 1, // 维修方式、维修途径
                repair_method: 1, // 维修类别
                vehicle_no: '', // 车架号

                customer_id: undefined,  // 相关客户-id
                customer_name: "",  // 相关客户-名称
                customer_phone: "", // 客户电话
                customer_email: "", // 客户邮箱
                customer_province: "", // 维修地址
                customer_city: "", // 维修地址
                customer_county: "", // 维修地址
                customer_address: "", // 维修地址
                remark: "", // 工单备注

                repair_user_id: undefined, // 工单负责人
                plan_time: undefined, // 计划时间
                // finish_time: undefined, // 完成时间
                repair_message: "", // 处理信息、工单备注
                priority: 0, // 紧急程度
            },
            defAddr: [],
            arrival_time: '',
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.form.id = Number(this.$route.query.id) || 0
        if (this.form.id) {
            this.getRepairDetail();
        }
        this.getCustomerList();
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
                        path: "/repair/repair-detail",
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
                    this.$message.success('刷新成功')
                }
            })
        },
        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.form.id = res.id
                for (const key in this.form) {
                    this.form[key] = res[key]
                }
                this.form.customer_id = this.form.customer_id || undefined
                this.form.repair_user_id = this.form.repair_user_id || undefined
                this.form.plan_time = this.form.plan_time ? dayjs.unix(this.form.plan_time).format('YYYY-MM-DD HH:mm:ss') : undefined
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

            form.plan_time = form.plan_time ? dayjs(form.plan_time).unix() : 0
            // form.finish_time = form.finish_time ? dayjs(form.finish_time).unix() : 0
            console.log('handleSubmit form:', form)
            let checkRes = this.checkFormInput(form);
            if (!checkRes) {
                return
            }
            let apiName = form.id ? 'update' : 'create'

            await Core.Api.Repair[apiName]({
                ...form,
                arrival_time: this.arrival_time
            }).then(res => {
                this.$message.success('保存成功')
                this.routerChange('detail', res.detail)
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        handleVehicleBlur() {  // 获取 车架号
            if (!this.form.vehicle_no) {
                return this.isExist = ''
            }
            Core.Api.Entity.detailByUid({
                uid: this.form.vehicle_no,
            }).then(res => {
                this.isExist = res.detail == null ? 2 : 1
                this.arrival_time = res.detail.arrival_time
                console.log('arrival_time')
                console.log("handleVehicleBlur res", res)
            }).catch(err => {
                console.log('handleVehicleBlur err', err)
            }).finally(() => {
            });
        },
        // 检查表单输入
        checkFormInput(form) {
            if (!form.type) {
                this.$message.warning('请选择工单分类')
                return 0
            }
            if (!form.priority) {
                this.$message.warning('请选择工单紧急程度')
                return 0
            }
            if (!form.service_type) {
                this.$message.warning('请选择工单帐类')
                return 0
            }
            /* if (!form.travel_distance) {
                this.$message.warning('请输入行程公里数')
                return 0
            }*/
            if (!form.name) {
                this.$message.warning('请输入工单名称')
                return 0
            }
            if (!form.desc) {
                this.$message.warning('请输入工单描述')
                return 0
            }
            if (!form.channel) {
                this.$message.warning('请选择维修方式')
                return 0
            }
            if (!form.repair_method) {
                this.$message.warning('请选择维修类别')
                return 0
            }
            if (!form.vehicle_no) {
                this.$message.warning('请输入车架号')
                return 0
            }
            if (this.isExist === false) {
                return this.$message.warning('请输入正确的车架号')
            }
            if (form.id) {
                if (!form.customer_id) {
                    this.$message.warning('请选择相关客户')
                    return 0
                }
                if (form.channel == 1 && !form.customer_address) {
                    this.$message.warning('请输入详细地址')
                    return 0
                }
                // if (!form.repair_user_id) {
                //     this.$message.warning('请选择工单负责人')
                //     return 0
                // }
                if (!form.customer_name) {
                    this.$message.warning('请选择客户名称')
                    return 0
                }
                if (!form.customer_phone) {
                    this.$message.warning('请选择客户电话')
                    return 0
                }
                if (!form.customer_email) {
                    this.$message.warning('请输入客户邮箱')
                    return 0
                }
                if (!form.customer_province && !form.customer_county && !form.customer_county) {
                    this.$message.warning('请选择客户地址')
                    return 0
                }

            }
            return 1
        },

        // 选择客户
        handleCustomerSelect(id) {
            let item = this.customerList.find(i => i.id === id)
            this.form.customer_name = item.name
            this.form.customer_phone = item.phone
            this.form.customer_email = item.email
            this.form.customer_province = item.province
            this.form.customer_city = item.city
            this.form.customer_county = item.county
            this.form.customer_address = item.address
            this.defAddr = [item.province, item.city, item.county]
        },

        handleAddressSelect(address) {
            this.form.customer_province = address[0]
            this.form.customer_city = address[1]
            this.form.customer_county = address[2]
        }
    }
};
</script>

<style lang="less">
#RepairEdit {
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

<template>
    <div id="RepairEdit" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ form.id ? '编辑工单' : '新建工单' }}</div>
        </div>
        <div class="form-block"> <!-- 工单内容 -->
            <div class="form-title">
                <div class="title">工单内容</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">工单分类</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.type" :disabled="!!form.id">
                            <a-radio v-for="item of typeList" :key="item.value" :value="item.value">{{
                                    item.text
                                }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">紧急程度</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.priority">
                            <a-radio v-for="item of priorityList" :key="item.value" :value="item.value">{{
                                    item.text
                                }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">工单帐类</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.service_type" :disabled="!!form.id">
                            <a-radio v-for="item of serviceList" :key="item.value" :value="item.value">{{
                                    item.text
                                }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">行程公里数</div>
                    <div class="value">
                        <a-input-number v-model:value="form.travel_distance" :min="0"/>
                        <span class="kilometre">公里</span>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">到港时间</div>
                    <div class="value">
                        <a-date-picker v-model:value="form.arrival_time" valueFormat='X' :show-time="defaultTime"
                                       placeholder="请选择到港时间">
                            <template #suffixIcon><i class="icon i_calendar"/></template>
                        </a-date-picker>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">工单名称</div>
                    <div class="value">
                        <a-input v-model:value="form.name" placeholder="请输入工单名称(最多输入50个字符)" :maxlength='50'/>
                    </div>
                </div>

                <div class="form-item required textarea">
                    <div class="key">问题描述</div>
                    <div class="value">
                        <a-textarea v-model:value="form.desc" placeholder="请输入问题描述"
                                    :auto-size="{ minRows: 4, maxRows: 6 }"
                                    :maxlength='500'/>
                        <span class="content-length">{{ form.desc.length }}/500</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-block"> <!-- 车辆信息 -->
            <div class="form-title">
                <div class="title">车辆信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">维修方式</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.channel">
                            <a-radio v-for="item of channelList" :key="item.value" :value="item.value">{{ item.text }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">维修类别</div>
                    <div class="value">
                        <a-radio-group v-model:value="form.repair_method">
                            <a-radio v-for="item of methodList" :key="item.value" :value="item.value">{{ item.text }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">车辆编号</div>
                    <div class="value">
                        <a-input class="item-code" v-model:value="form.item_code" placeholder="请输入车辆编号" @blur="onblur"/>
                        <span v-if="isExist === true"><i class="icon i_confirm"/></span>
                        <span v-else-if="isExist === false"><i class="icon i_close_c"/></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-block"> <!-- 车主信息 -->
            <div class="form-title">
                <div class="title">车主信息</div>
            </div>
            <div class="form-content">
                <div class="form-item required">
                    <div class="key">相关客户</div>
                    <div class="value">
                        <a-select placeholder="请选择相关客户" v-model:value="form.customer_id" @change="handleCustomerSelect"
                                  show-search
                                  :disabled="detail.status == REPAIR.STATUS.WAIT_CHECK">
                            <a-select-option v-for="(item,index) of customerList" :key="index" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="sp">
                        <a-button type="link" @click="routerChange('customer')">新建客户</a-button>
                        <a-button type="link" @click="getCustomerList('refresh')">刷新</a-button>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">客户电话</div>
                    <div class="value">
                        <a-input v-model:value="form.customer_phone" placeholder="请输入客户电话"/>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">客户邮箱</div>
                    <div class="value">
                        <a-input v-model:value="form.customer_email" placeholder="请输入客户邮箱"/>
                    </div>
                </div>
                <div class="form-item">
                    <div class="key">维修地址</div>
                    <div class="value">
                        <AddressCascader @change='handleAddressSelect'
                                         :default-address='[form.customer_province, form.customer_city, form.customer_county]'/>
                    </div>
                </div>
                <div class="form-item" :class="form.channel == 1 ? 'required' : ''">
                    <div class="key">详细地址</div>
                    <div class="value">
                        <a-input v-model:value="form.customer_address" placeholder="请输入详细地址"/>
                    </div>
                </div>
                <div class="form-item textarea">
                    <div class="key">工单备注</div>
                    <div class="value">
                        <a-textarea v-model:value="form.remark" placeholder="请输入工单备注"
                                    :auto-size="{ minRows: 2, maxRows: 6 }"
                                    :maxlength='500'/>
                        <span class="content-length">{{ form.remark.length }}/500</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button @click="handleSubmit" type="primary">确定</a-button>
            <a-button @click="routerChange('back')">取消</a-button>
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
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {
                status: 0,
            }, // 工单详情
            create_time: [],
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,

            typeList: REPAIR.TYPE_LIST, // 工单分类
            methodList: REPAIR.METHOD_LIST, // 维修类别
            serviceList: REPAIR.SERVICE_TYPE_LIST,//工单帐类
            channelList: REPAIR.CHANNEL_LIST, // 维修方式
            priorityList: REPAIR.PRIORITY_LIST, // 紧急程度
            customerList: [], // 车主列表
            REPAIR,
            isExist: '', // 车辆编号输入框提示
            form: {
                id: '',

                type: 1,  // 工单分类
                name: '', // 工单名称
                desc: '', // 问题描述
                service_type: '',//保内维修、保外维修
                arrival_time: '',//到港时间
                travel_distance: '',//行程公里数

                channel: 1, // 维修方式、维修途径
                repair_method: 1, // 维修类别
                item_code: '', // 车辆编号
                vehicle_no: '', // 车辆编号

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

                /*
                "fail_remark": "string",
                "item_code": "string",
                "item_id": 0,
                "operate_time": 0,
                "operator_id": 0,
                "parent_id": 0,
                "parent_type": 0,
                "results": 0,
                */
            },
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
            }
        },

        // 获取 车主列表
        getCustomerList(val) {
            Core.Api.Customer.list().then(res => {
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
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)

            form.plan_time = form.plan_time ? dayjs(form.plan_time).unix() : 0
            // form.finish_time = form.finish_time ? dayjs(form.finish_time).unix() : 0
            console.log('handleSubmit form:', form)
            let checkRes = this.checkFormInput(form);
            if (!checkRes) {
                return
            }
            let apiName = form.id ? 'update' : 'create'
            this.form.vehicle_no =

                Core.Api.Repair[apiName]({
                    ...form,
                    vehicle_no: this.form.item_code,
                }).then(() => {
                    this.$message.success('保存成功')
                    this.routerChange('back')
                }).catch(err => {
                    console.log('handleSubmit err:', err)
                })
        },
        onblur() {  // 获取 车辆编码 数据
            if (!this.form.item_code) {
                return this.isExist = ''
            }
            Core.Api.Item.detailByCode({
                code: this.form.item_code,
            }).then(res => {
                this.isExist = res.detail != null
                console.log("getItemCode res", res)
            }).catch(err => {
                console.log('getItemCode err', err)
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
            if (!form.travel_distance) {
                this.$message.warning('请输入行程公里数')
                return 0
            }
            if (!form.arrival_time) {
                this.$message.warning('请选择到港时间')
                return 0
            }
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
            if (!form.item_code) {
                this.$message.warning('请输入车辆编号')
                return 0
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
    .form-block {
        .form-content {
            .form-item {
                .value {
                    .fac();
                    .ant-input-number {
                        margin-right: 10px;
                    }

                    .kilometre {
                        font-size: 12px;
                        line-height: 16px;
                        color: #363D42;
                    }
                    .item-code {
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
                    }
                }

            }
        }
    }
}


</style>

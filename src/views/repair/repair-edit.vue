<template>
<div id="RepairEdit" class="edit-container">
    <div class="title-container"><div class="title-area">{{form.id ? '编辑工单' : '新建工单'}}</div></div>
    <div class="form-block"> <!-- 工单内容 -->
        <div class="form-title"><div class="title">工单内容</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">工单分类</div>
                <div class="value">
                    <a-radio-group v-model:value="form.type" :disabled="form.id">
                        <a-radio v-for="item of typeList" :key="item.value" :value="item.value" >{{item.text}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item">
                <div class="key">紧急程度</div>
                <div class="value">
                    <a-radio-group v-model:value="form.priority">
                        <a-radio v-for="item of priorityList" :key="item.value" :value="item.value" >{{item.text}}</a-radio>
                    </a-radio-group>
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
                    <a-textarea v-model:value="form.desc" placeholder="请输入问题描述" :auto-size="{ minRows: 4, maxRows: 6 }" :maxlength='500'/>
                    <span class="content-length">{{form.desc.length}}/500</span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block"> <!-- 车辆信息 -->
        <div class="form-title"><div class="title">车辆信息</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">维修方式</div>
                <div class="value">
                    <a-radio-group v-model:value="form.channel">
                        <a-radio v-for="item of channelList" :key="item.value" :value="item.value" >{{item.text}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">产品类型</div>
                <div class="value">
                    <a-radio-group v-model:value="form.item_type">
                        <a-radio v-for="item of itemTypeList" :key="item.value" :value="item.value" >{{item.text}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">维修类别</div>
                <div class="value">
                    <a-radio-group v-model:value="form.repair_method">
                        <a-radio v-for="item of methodList" :key="item.value" :value="item.value" >{{item.text}}</a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">车辆编号</div>
                <div class="value">
                    <a-input v-model:value="form.vehicle_code" placeholder="请输入车辆编号"/>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block" v-if="form.id"> <!-- 车主信息 -->
        <div class="form-title"><div class="title">车主信息</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">相关客户</div>
                <div class="value">
                    <a-select v-model:value="form.customer_id" placeholder="请选择相关客户">
                        <a-select-option v-for="item of customerList" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
                    </a-select>
                </div>
                <div class="sp">
                    <a-button type="link" @click="routerChange('customer')">新建客户</a-button>
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
                    <a-cascader v-model:value="customer_address" :options="addressOptions" placeholder="请选择省/市/区县"
                        :field-names="{ label: 'name', value: 'code' , children: 'children'}" :show-search="{ filter }"/>
                </div>
            </div>
            <div class="form-item" :class="form.channel == 1 ? 'required' : ''">
                <div class="key">详细地址</div>
                <div class="value">
                    <a-input v-model:value="form.customer_detail_address" placeholder="请输入详细地址"/>
                </div>
            </div>
            <div class="form-item textarea">
                <div class="key">工单备注</div>
                <div class="value">
                    <a-textarea v-model:value="form.remark" placeholder="请输入工单备注" :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='500'/>
                    <span class="content-length">{{form.desc.length}}/500</span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-block" v-if="form.id"> <!-- 维修人员 -->
        <div class="form-title"><div class="title">维修人员</div></div>
        <div class="form-content">
            <div class="form-item required">
                <div class="key">工单负责人</div>
                <div class="value">
                    <a-select v-model:value="form.repair_user_id" placeholder="请选择工单负责人">
                        <a-select-option v-for="item of staffList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                    </a-select>
                </div>
                <div class="sp">
                    <a-button type="link" @click="routerChange('staff')">新建员工</a-button>
                </div>
            </div>
            <div class="form-item">
                <div class="key">计划时间</div>
                <div class="value">
                    <a-date-picker v-model:value="form.plan_time" valueFormat='X'/>
                </div>
            </div>
            <div class="form-item">
                <div class="key">完成时间</div>
                <div class="value">
                    <a-date-picker v-model:value="form.finish_time" valueFormat='X'/>
                </div>
            </div>
            <div class="form-item textarea">
                <div class="key">维修备注</div>
                <div class="value">
                    <a-textarea v-model:value="form.repair_message" placeholder="请输入维修备注" :auto-size="{ minRows: 2, maxRows: 2 }" :maxlength='500'/>
                    <span class="content-length">{{form.desc.length}}/500</span>
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
import axios from 'axios';

const REPAIR = Core.Const.REPAIR
export default {
    name: 'RepairEdit',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {}, // 工单详情

            typeList: REPAIR.TYPE_LIST, // 工单分类
            methodList: REPAIR.METHOD_LIST, // 维修类别
            channelList: REPAIR.CHANNEL_LIST, // 维修方式
            priorityList: REPAIR.PRIORITY_LIST, // 紧急程度
            itemTypeList: Core.Const.ITEM.TYPE_LIST, // 产品类型
            addressOptions: [], // 地址选择
            customerList: [], // 车主列表
            staffList: [], // 员工列表
            customer_address: [],
            form: {
                id: '',

                type: 1,  // 工单分类
                name: '', // 工单名称
                desc: '', // 问题描述

                channel: 1, // 维修方式、维修途径
                item_type: 1, // 产品类型
                repair_method: 1, // 维修类别
                vehicle_code: '', // 车辆编号

                customer_id: undefined,  // 相关客户-id
                customer_name: "",  // 相关客户-名称
                customer_phone: "", // 客户电话
                customer_email: "", // 客户邮箱
                customer_address: "", // 维修地址
                customer_detail_address: "", // 详细地址
                remark: "", // 工单备注

                repair_user_id: undefined, // 工单负责人
                plan_time: 0, // 计划时间
                finish_time: 0, // 完成时间
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
        this.getStaffList();
        this.getRoughlyAddressList();
    },
    methods: {
        // 获取 车主列表
        getCustomerList() {
        },
        // 获取 员工列表
        getStaffList() {
        },
        // 获取 地址选择列表
        getRoughlyAddressList() {
            axios.get('/ext/region-code.json')
                .then(response => {
                    this.addressOptions = response.data.zh;
                })
        },
        // 地址选择搜索
        addressFilter(inputValue, path) {
            return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
        },
        // 页面跳转
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'customer':  // 新建客户
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                    })
                    break;
                case 'staff':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                    })
                    break;
            }
        },
        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.form.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res.detail
                let address = res.detail.customer_address
                for (const key in this.form) {
                    this.form[key] = res.detail[key]
                }
                if (address) {
                    this.customer_address = address.split('/')
                } else {
                    this.customer_address = []
                }
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 表单提交
        handleSubmit() {
            let form = Core.Util.deepCopy(this.form)
            form.customer_address = this.customer_address.join('/')
            console.log('handleSubmit form:', form)
            let checkRes = this.checkFormInput(form);
            if (!checkRes) { return }

            let apiName = form.id ? 'update' : 'create'
            Core.Api.Repair[apiName](form).then(() => {
                this.$message.success('保存成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        // 检查表单输入
        checkFormInput(form) {
            if (!form.type) {
                this.$message.warning('请选择工单分类')
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
            if (!form.item_type) {
                this.$message.warning('请选择产品类型')
                return 0
            }
            if (!form.repair_method) {
                this.$message.warning('请选择维修类别')
                return 0
            }
            if (!form.vehicle_code) {
                this.$message.warning('请输入车辆编号')
                return 0
            }
            if (form.id) {
                if (!form.customer_id) {
                    this.$message.warning('请选择相关客户')
                    return 0
                }
                if (!form.customer_phone) {
                    this.$message.warning('请输入客户电话')
                    return 0
                }
                if (!form.customer_email) {
                    this.$message.warning('请输入客户邮箱')
                    return 0
                }
                if (form.channel == 1 && !form.customer_detail_address) {
                    this.$message.warning('请输入详细地址')
                    return 0
                }
                if (!form.repair_user_id) {
                    this.$message.warning('请选择工单负责人')
                    return 0
                }
            }
            return 1
        },
    }
};
</script>

<style lang="less" scoped>
// #RepairEdit {}
</style>
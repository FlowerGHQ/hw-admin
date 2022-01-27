<template>
<div id="RepairDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">工单详情</div>
            <div class="btns-area">
                <template v-if="$auth('ADMIN')">
                    <a-button type="primary" @click="handleAuditShow('audit')"
                        v-if="detail.status === STATUS.WAIT_AUDIT"><i class="icon i_edit"/>审核
                    </a-button>
                </template>
                <template v-if="$auth('DISTRIBUTOR')">
                    <a-button type="primary" @click="handleAuditShow('check')"
                        v-if="detail.status === STATUS.WAIT_CHECK"><i class="icon i_confirm"/>确定接单
                    </a-button>
                </template>
                <template v-if="$auth('AGENT', 'STORE') && detail.org_type == OrgType">
                    <!-- <template v-if="detail.account_id == User.id || $auth('MANAGER')"> -->
                    <!-- </template> -->
                    <a-button type="primary" ghost @click="routerChange('edit')"
                        v-if="[STATUS.WAIT_CHECK, STATUS.WAIT_DISTRIBUTION, STATUS.AUDIT_FAIL, STATUS.CHECK_FAIL].includes(detail.status)">
                        <i class="icon i_edit"/>编辑
                    </a-button>
                    <a-button type="primary" ghost @click="handleDeliveryShow()"
                        v-if="needDelivery"><i class="icon i_deliver"/>转单物流
                    </a-button>
<!--                    <a-button type="primary" @click="handleSecondRepairShow()"
                        v-if="[STATUS.WAIT_CHECK, STATUS.WAIT_DISTRIBUTION, STATUS.WAIT_REPAIR].includes(detail.status) ">
                        <i class="icon i_edit_l"/>二次维修
                    </a-button>-->
                    <a-button type="primary" @click="handleFaultSubmit()"
                        v-if="detail.status == STATUS.WAIT_DETECTION"><i class="icon i_submit"/>提交
                    </a-button>
                    <a-button type="primary" @click="handleResultShow()"
                        v-if="detail.status == STATUS.WAIT_REPAIR"><i class="icon i_completed"/>维修完成
                    </a-button>
                    <a-button type="primary" @click="handleSettlement()"
                        v-if="detail.status == STATUS.REPAIR_END"><i class="icon i_settle"/>结算
                    </a-button>
                </template>
                <a-button type="primary" @click="routerChange('invoice')"
                    v-if="detail.status == STATUS.SETTLEMENT"><i class="icon i_detail_l"/>查看结算单
                </a-button>
            </div>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left"><span>工单编号</span> {{ detail.uid }}</div>
                <div class="right">
                    <div class="staff" v-if="detail.repair_user_id">员工：{{ detail.repair_user_name || '-' }}</div>
                    <div class="status">
                        <i class="icon i_point" :class="$Util.repairStatusFilter(detail.status,'color')"/>
                        {{ $Util.repairStatusFilter(detail.status) }}
                    </div>
                </div>
            </div>
            <div class="panel-content">
                <div class="info-item">
                    <div class="key">工单帐类</div>
                    <div class="value">{{ $Util.repairServiceFilter(detail.service_type || '-') }}</div>
                </div>
                <div class="info-item">
                    <div class="key">创建人</div>
                    <div class="value">{{ detail.user_name || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">相关客户</div>
                    <div class="value">{{ detail.customer_name || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">优先级</div>
                    <div class="value">{{ $Util.repairPriorityFilter(detail.priority) }}</div>
                </div>
                <div class="info-item">
                    <div class="key">创建时间</div>
                    <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">计划时间</div>
                    <div class="value">{{ $Util.timeFilter(detail.plan_time) || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">实施时间</div>
                    <div class="value">{{ $Util.timeFilter(detail.finish_time) || '-' }}</div>
                </div>
                <div class="info-item" v-if="detail.audit_message != ''">
                    <div class="key">未通过原因</div>
                    <div class="value">{{ detail.audit_message || '-' }}</div>
                </div>
            </div>
        </div>
        <MySteps :stepsList='stepsList' :current='currStep' v-if="detail.status != STATUS.CLOSE"/>
        <div class="form-container">
            <Distribution :id='id' :detail='detail' @submit="getRepairDetail" v-if="detail.status == STATUS.WAIT_DISTRIBUTION && $auth('AGENT', 'STORE')"/>
            <CheckFault   :id='id' :detail='detail' @submit="getRepairDetail" v-if="detail.status == STATUS.WAIT_DETECTION && $auth('AGENT', 'STORE')" ref="CheckFault"/>
            <CheckResult  :id='id' :detail='detail' v-if="showCheckResult" @hasTransfer='hasTransfer = true'/>
            <RepairInfo  :id='id' :detail='detail'/>
            <AttachmentFile :detail='detail' :target_id='id' :target_type='ATTACHMENT_TARGET_TYPE.REPAIR_ORDER'/>
            <WaybillInfo :id='id' :detail='detail' v-if="hasTransfer" @needDelivery='needDelivery = true' ref="WaybillInfo"/>
            <ActionLog   :id='id' :detail='detail'/>
        </div>
    </div>
    <template class="modal-container">
        <!-- 工单确认 & 审核 -->
        <a-modal v-model:visible="auditShow" :title="auditType == 'check' ? '确认接单' : '审核'" @ok="handleAuditSubmit">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">{{auditType == 'check' ? '确认' : '审核'}}结果:</div>
                    <div class="value">
                        <a-radio-group v-model:value="auditForm.audit_result">
                            <a-radio :value="1">通过</a-radio>
                            <a-radio :value="0">不通过</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required textarea" v-if="auditForm.audit_result === 0">
                    <div class="key">原因:</div>
                    <div class="value">
                        <a-textarea v-model:value="auditForm.audit_message" placeholder="请输入不通过的原因" :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                        <span class="content-length">{{auditForm.audit_message.length}}/99</span>
                    </div>
                </div>
            </div>
        </a-modal>
        <!-- 维修结果 -->
        <a-modal v-model:visible="resultShow" title="维修结果" @ok="handleResultSubmit">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">维修结果:</div>
                    <div class="value">
                        <a-radio-group v-model:value="resultForm.results">
                            <a-radio v-for="results of resultsList" :key="results.value" :value="results.value">{{ results.name }}</a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div class="form-item required textarea" v-if="resultForm.results == REPAIR_RESULTS.FAIL">
                    <div class="key">失败原因:</div>
                    <div class="value">
                        <a-textarea v-model:value="resultForm.audit_message" placeholder="请输入失败原因" :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                        <span class="content-length">{{resultForm.audit_message.length}}/99</span>
                    </div>
                </div>
            </div>
        </a-modal>
        <!-- 二次维修计划时间 -->
        <a-modal v-model:visible="secondShow" title="二次维修计划时间" @ok="handleSecondRepairSubmit">
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">计划时间</div>
                    <div class="value">
                        <a-date-picker v-model:value="secondForm.plan_time" valueFormat='YYYY-MM-DD HH:mm:ss'/>
                    </div>
                </div>
            </div>
        </a-modal>
        <!-- 转单物流 -->
        <a-modal v-model:visible="deliveryShow" title="转单物流" @ok="handleDeliverySubmit">
            <div class="form-item required">
                <div class="key">物流公司:</div>
                <div class="value">
                    <a-select v-model:value="deliveryForm.company_uid" placeholder="请选择物流公司" show-search>
                        <a-select-option v-for="(val,key) in companyMap" :key="key" :value="key">{{ val }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">物流单号:</div>
                <div class="value">
                    <a-input v-model:value="deliveryForm.waybill_uid" placeholder="请输入物流单号"/>
                </div>
            </div>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../../core';
import dayjs from "dayjs";

import CheckFault from './components/CheckFault.vue';
import CheckResult from './components/CheckResult.vue';
import RepairInfo from './components/RepairInfo.vue';
import WaybillInfo from './components/WaybillInfo.vue';
import Distribution from './components/Distribution.vue';
import ActionLog from './components/ActionLog.vue';
import MySteps from '@/components/common/MySteps.vue';
import AttachmentFile from '@/components/popup-btn/AttachmentFile.vue';

const REPAIR = Core.Const.REPAIR
const STATUS = Core.Const.REPAIR.STATUS
const REPAIR_ITEM = Core.Const.REPAIR_ITEM

export default {
    name: 'RepairDetail',
    components: {
        AttachmentFile,
        CheckFault,
        CheckResult,
        RepairInfo,
        ActionLog,
        MySteps,
        Distribution,
        WaybillInfo,
    },
    props: {},
    data() {
        return {
            OrgType: Core.Data.getOrgType(),
            STATUS,
            REPAIR_RESULTS: REPAIR.RESULTS,
            ATTACHMENT_TARGET_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,

            // 加载
            loading: false,
            id: 0,
            detail: {}, // 工单详情

            stepsList: [
                {title: '分配工单'},
                {title: '后台审核'},
                {title: '检测'},
                {title: '维修'},
                {title: '结算'},
            ],
            currStep: 1,

            faultMap: {}, // 所有故障类型

            // 工单确认&&审核
            auditShow: false,
            auditType: '',
            auditForm: {
                audit_result: 1,
                audit_message: '',
            },

            // 维修结果
            resultShow: false,
            resultsList: REPAIR.RESULTS_LIST,
            resultForm: {
                results: '1',
                audit_message: '',
            },

            // 二次维修
            secondShow: false,
            secondForm: {
                plan_time: undefined,
            },
            // 转单
            hasTransfer: false,
            needDelivery: false,
            deliveryShow: false,
            companyMap: Core.Const.WAYBILL.COMPANY_MAP,
            deliveryForm: {
                waybill_uid: "",
                company_uid: undefined,
            },

        };
    },
    watch: {},
    computed: {
        showCheckResult() {
            switch (this.detail.status) {
                case STATUS.WAIT_REPAIR:
                case STATUS.REPAIR_END:
                case STATUS.SETTLEMENT:
                    return true
                default:
                    return false
            }
        }
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
        this.getRepairDetail();
    },
    methods: {
        // 页面跳转
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'edit':  // 编辑工单
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                        query: {id: this.id},
                    })
                    break;
                case 'list':  // 工单列表
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-list",
                    })
                    break;
                case 'invoice':  // 工单列表
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-invoice",
                        query: {id: this.id},
                    })
                    break;
            }
            window.open(routeUrl.href, '_self')
        },
        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.getCurrStep(this.detail.status)
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取当前工单进度
        getCurrStep(status) {
            switch (status) {
                case STATUS.WAIT_DISTRIBUTION:
                    this.currStep = 0;
                    break;
                case STATUS.WAIT_CHECK:
                case STATUS.WAIT_AUDIT:
                case STATUS.CHECK_FAIL:
                case STATUS.AUDIT_FAIL:
                    this.currStep = 1;
                    break;
                case STATUS.WAIT_DETECTION:
                    this.currStep = 2;
                    break;
                case STATUS.WAIT_REPAIR:
                    this.currStep = 3;
                    break;
                case STATUS.REPAIR_END:
                    this.currStep = 4;
                    break;
                case STATUS.SETTLEMENT:
                    this.currStep = 5;
                    break;
            }
        },

        // 分销商确认接单 以及 平台方确认审核
        handleAuditShow(type) {
            Object.assign(this.auditForm, this.$options.data().auditForm)
            this.auditType = type
            this.auditShow = true
        },
        handleAuditSubmit() {
            this.loading = true;
            let form = Core.Util.deepCopy(this.auditForm)
            if (form.audit_result == 0 && !form.audit_message) {
                return this.$message.warning('请输入不通过的原因')
            }
            Core.Api.Repair[this.auditType]({
                id: this.id,
                ...this.auditForm
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.$message.success('操作成功')
                this.routerChange('back')
            }).catch(err => {
                console.log('handleAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 提交检测结果
        handleFaultSubmit() {
            this.$refs.CheckFault.handleFaultSubmit();
        },

        // 提交 维修结果
        handleResultShow() {
            this.resultShow = true
            Object.assign(this.resultForm, this.$options.data().resultForm)
        },
        handleResultSubmit() {
            this.loading = true;
            let form = Core.Util.deepCopy(this.resultForm)
            if (form.results == 2 && !form.audit_message) {
                return this.$message.warning('请输入维修失败的原因')
            }
            Core.Api.Repair.repair({
                id: this.id,
                ...form
            }).then(() => {
                this.$message.success('操作成功')
                this.getRepairDetail()
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.resultShow = false
            });
        },

        // 工单 结算
        handleSettlement() {
            let _this = this;
            this.$confirm({
                title: '确定要结算该工单吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    Core.Api.Repair.settlement({id: _this.id}).then(() => {
                        _this.$message.success('操作成功')
                        _this.getRepairDetail()
                    })
                },
            });
        },

        // 工单 二次维修
/*        handleSecondRepairShow() {
            this.secondShow = true
            this.secondForm.plan_time = this.detail.plan_time ? dayjs.unix(this.detail.plan_time).format('YYYY-MM-DD HH:mm:ss') : undefined
        },*/
        handleSecondRepairSubmit() {
            let form = Core.Util.deepCopy(this.secondForm)
            if (!form.plan_time) {
                return this.$message.warning('请选择预计二次维修时间')
            }
            form.plan_time = dayjs(form.plan_time).unix()
            Core.Api.Repair.secondDoor({
                id: this.detail.id,
                ...form
            }).then(() => {
                this.$message.success('操作成功')
                this.getRepairDetail()
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.secondShow = false
            });
        },

        // 转单物流
        handleDeliveryShow() {
            this.deliveryShow = true;
            Object.assign(this.deliveryForm, this.$options.data().deliveryForm)
        },
        handleDeliverySubmit() {
            this.loading = true;
            let form = Core.Util.deepCopy(this.deliveryForm)
            if (!form.company_uid) {
                return this.$message.warning('请选择物流公司')
            }
            if (!form.waybill_uid) {
                return this.$message.warning('请输入物流单号')
            }
            Core.Api.Repair.post({
                id: this.id,
                ...form
            }).then(() => {
                this.$message.success('操作成功')
                this.getRepairDetail()
                this.$refs.WaybillInfo.getWaybillDetail();
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.deliveryShow = false
            });
        },
    }
};
</script>

<style lang="less">
#RepairDetail {
    .gray-panel.info {
        .right {
            .fcc();
            font-size: 12px;

            .staff {
                color: rgba(0, 0, 0, 0.85);
                margin-right: 12px;
                font-weight: 500;
            }

            .status {
                .fcc();

                .i_point {
                    margin-right: 6px;
                }
            }
        }
    }

    .panel-content.affirm {
        .title {
            color: #DD5D5D;
            margin-bottom: 24px;

            i.icon {
                margin-right: 12px;
            }
        }

        .fault_select {
            width: 100%;
            padding-left: 12px;

            .ant-checkbox-wrapper {
                width: 25%;
                margin-left: 0;
                margin-bottom: 18px;
            }
        }
    }

    .steps-container {
        padding: 0 20px;
        margin-bottom: 20px;
    }
}
</style>
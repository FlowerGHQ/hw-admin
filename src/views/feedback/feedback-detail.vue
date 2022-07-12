<template>
<div id="FeedbackDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('fe.feedback_detail') }}</div>
            <div class="btns-area">
<!--                <template v-if="sameOrg && $auth('repair-order.save')">
                    <a-button type="primary" ghost @click="routerChange('edit')" v-if="detail.status == STATUS.WAIT_DETECTION">
                        <i class="icon i_edit"/>{{ $t('def.edit') }}
                    </a-button>
                    <a-button type="primary" ghost @click="routerChange('edit')" v-if="detail.status == STATUS.AUDIT_FAIL">
                        {{ $t('def.re_edit') }}
                    </a-button>
&lt;!&ndash;                    <a-button type="primary" ghost @click="handleDeliveryShow()" v-if="needDelivery">
                        <i class="icon i_deliver"/>转单物流
                    </a-button>&ndash;&gt;
                    <a-button type="primary" @click="handleFaultSubmit()" v-if="detail.status == STATUS.WAIT_DETECTION">
                        <i class="icon i_submit"/>{{ $t('def.submit') }}
                    </a-button>
                    <a-button type="primary" @click="handleRepairEndShow()" v-if="detail.status == STATUS.WAIT_REPAIR">
                        <i class="icon"/>维修
                    </a-button>
                    <a-button type="primary" @click="handleSettlement()" v-if="detail.status == STATUS.REPAIR_END">
                        <i class="icon i_settle"/>{{ $t('r.settle_accounts') }}
                    </a-button>
                </template>-->
<!--                <a-button type="primary" @click="routerChange('invoice')" v-if="!haveSettle && $auth('repair-order.settlement')">
                    <i class="icon i_detail_l"/>{{ $t('r.bill') }}
                </a-button>
               <a-button type="primary" @click="handleAuditShow()" v-if="detail.status == STATUS.SETTLEMENT && $auth('DISTRIBUTOR') && $auth('repair-order.audit')">
                    <i class="icon i_audit"/>{{ $t('n.audit') }}
                </a-button>
                <a-button type="primary" @click="handleAuditShow()" v-if="detail.status == STATUS.DISTRIBUTOR_AUDIT_SUCCESS && $auth('ADMIN') && $auth('repair-order.audit')">
                    <i class="icon i_audit"/>{{ $t('n.audit') }}
                </a-button>
                <a-button type="primary" @click="handleAuditShow()" v-if="detail.status == STATUS.SETTLEMENT_DISTRIBUTOR && $auth('ADMIN') && $auth('repair-order.audit')">
                    <i class="icon i_audit"/>{{ $t('n.audit') }}
                </a-button>-->
            </div>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left"><span>{{ $t('fe.feedback_uid') }}:</span> {{ detail.uid }}</div>
                <div class="right">
                    <a-tooltip :title='detail.audit_message'>
                        <div class="status">
                            <i class="icon i_point" :class="$Util.feedbackStatusFilter(detail.status,'color')"/>
                            {{ $Util.feedbackStatusFilter(detail.status, $i18n.locale) }}
                            <i class="icon i_hint" style="font-size: 12px; padding-left: 6px;"  v-if="detail.status == STATUS.AUDIT_FAIL"/>
                        </div>
                    </a-tooltip>
                </div>
            </div>
            <div class="panel-content">
                <div class="info-item">
                    <div class="key">{{ $t('search.vehicle_no') }}</div>
                    <div class="value">{{ detail.entity_uid  || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('fe.feedback_company') }}</div>
                    <div class="value">{{ detail.feedback_name || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('fe.feedback_user') }}</div>
                    <div class="value">{{ detail.feedback_user_name || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('fe.feedback_phone') }}</div>
                    <div class="value">{{ detail.feedback_user_phone || '-' }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('r.associated_customer') }}</div>
                    <div class="value">{{detail.customer_name || '-'  }}</div>
                </div>
                <div class="info-item">
                    <div class="key">{{ $t('r.create_time') }}</div>
                    <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                </div>


                <!-- <div class="info-item">
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
                </div>-->
            </div>
        </div>
        <MySteps :stepsList='stepsList' :current='currStep' v-if="detail.status != STATUS.CLOSE"/>
        <div class="form-container">
            <CheckFault  :id='id' :detail='detail' :serviceType='detail.service_type' @submit="getFeedbackDetail"  ref="CheckFault"/>
            <CheckResult :id='id' :detail='detail' @hasTransfer='hasTransfer = true' v-if="showCheckResult"/>
            <FeedbackInfo  :id='id' :detail='detail'/>
            <AttachmentFile :detail='detail' :target_id='id' :target_type='ATTACHMENT_TARGET_TYPE.QUALITY_FEEDBACK'/>
            <ActionLog   :id='id' :detail='detail' :sourceType="Core.Const.ACTION_LOG.SOURCE_TYPE.QUALITY_FEEDBACK"/>
        </div>
    </div>
    <template class="modal-container">
        <!-- 转单物流 -->
        <a-modal v-model:visible="deliveryShow" title="转单物流" @ok="handleDeliverySubmit">
            <div class="form-item required">
                <div class="key">物流公司:</div>
                <div class="value">
                    <a-select v-model:value="deliveryForm.company_uid" placeholder="请选择物流公司">
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
        <a-modal v-model:visible="repairEndShow" title="维修" class="repair-audit-modal" :after-close='handleRepairEndClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">维修结果:</div>
                    <a-radio-group v-model:value="repairForm.results">
                        <a-radio :value="1">通过</a-radio>
                        <a-radio :value="0">不通过</a-radio>
                    </a-radio-group>
                </div>
                <div class="form-item textarea">
                    <div class="key">备注:</div>
                    <div class="value">
                        <a-textarea v-model:value="repairForm.repair_message" placeholder="请输入备注"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="repairEndShow = false">取消</a-button>
                <a-button @click="handleRepairEnd()" type="primary">确定</a-button>
            </template>
        </a-modal>
        <a-modal v-model:visible="repairAuditShow" title="审核" class="repair-audit-modal" :after-close='handleAuditClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">审核结果:</div>
                    <a-radio-group v-model:value="auditForm.audit_result">
                        <a-radio :value="1">通过</a-radio>
                        <a-radio :value="0">不通过</a-radio>
                    </a-radio-group>
                </div>
                <div class="form-item textarea required" v-if="auditForm.audit_result === 0">
                    <div class="key">原因:</div>
                    <div class="value">
                        <a-textarea v-model:value="auditForm.audit_message" placeholder="请输入不通过原因"
                            :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="repairAuditShow = false">取消</a-button>
                <a-button @click="handleAuditSubmit()" type="primary">确定</a-button>
            </template>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../../core';
import dayjs from "dayjs";

import CheckFault from './components/CheckFault.vue';
import CheckResult from './components/CheckResult.vue';
import FeedbackInfo from './components/FeedbackInfo.vue';
import ActionLog from '../repair/components/ActionLog.vue';
import MySteps from '@/components/common/MySteps.vue';
import AttachmentFile from '@/components/panel/AttachmentFile.vue';

const REPAIR = Core.Const.REPAIR
const STATUS = Core.Const.REPAIR.STATUS
const REPAIR_ITEM = Core.Const.REPAIR_ITEM
const AUDIT = Core.Const.REPAIR.AUDIT

export default {
    name: 'RepairDetail',
    components: {
        AttachmentFile,
        CheckFault,
        CheckResult,
        FeedbackInfo,
        ActionLog,
        MySteps,
    },
    props: {},
    data() {
        return {
            Core,
            orgType: Core.Data.getOrgType(),
            orgId: Core.Data.getOrgId(),
            STATUS,
            AUDIT,
            REPAIR_RESULTS: REPAIR.RESULTS,
            ATTACHMENT_TARGET_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,

            // 加载
            loading: false,
            id: 0,
            detail: {}, // 工单详情

            stepsList: [
                // {title: '分配工单'},
                // {title: '后台审核'},
                {zh: '检测', en: 'Check'},
                {zh: '维修', en: 'Service'},
                {zh: '结算', en: 'Settle accounts'},

            ],
            currStep: 0,

            faultMap: {}, // 所有故障类型

            repairAuditShow: false, //审核
            // auditType: '',
            auditForm: {
                audit_result: '',
                audit_message: '',
            },

            repairEndShow: false,
            repairForm: {
                results: '',
                repair_message: '',
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
                case STATUS.WAIT_DETECTION:
                    return false
                default:
                    return true
            }
        },
        sameOrg() {
            if (this.detail.org_id === this.orgId && this.detail.org_type === this.orgType) {
                return true
            }
            return false
        },
        haveSettle() {
            switch (this.detail.status) {
                case STATUS.WAIT_DETECTION:
                case STATUS.WAIT_REPAIR:
                case STATUS.CLOSE:
                    return true
                default: return false
            }
        }
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
        this.getFeedbackDetail();
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
        getFeedbackDetail() {
            this.loading = true;
            Core.Api.Feedback.detail({
                id: this.id,
            }).then(res => {
                console.log('getFeedbackDetail res', res)
                this.detail = res
                this.getCurrStep(this.detail.status)
            }).catch(err => {
                console.log('getFeedbackDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        // 获取当前工单进度
        getCurrStep(status) {
            switch (status) {
                case STATUS.WAIT_DETECTION:
                    this.currStep = 0;
                    break;
                case STATUS.WAIT_REPAIR:
                    this.currStep = 1;
                    break;
                case STATUS.REPAIR_END:
                    this.currStep = 2;
                    break;
                case STATUS.SETTLEMENT:
                    this.currStep = 3;
                    break;
                case STATUS.SETTLEMENT_DISTRIBUTOR:
                    this.currStep = 3;
                    break;
                case STATUS.AUDIT_SUCCESS:
                    this.currStep = 3;
                    break;
                case STATUS.FINISH:
                    this.currStep = 3;
                    break;
            }
        },
        // 提交检测结果
        handleFaultSubmit() {
            this.$refs.CheckFault.handleFaultSubmit();
        },

        // 工单 结算
        handleRepairEndShow() {
            this.repairEndShow = true
        },
        handleRepairEnd() {
            let form = Core.Util.deepCopy(this.repairForm)
            if (!form.results) {
                return this.$message.warning('请选择维修结果')
            }
            let _this = this;
            Core.Api.Repair.repair({id: this.id, ...form}).then(() => {
                _this.$message.success(_this.$t('pop_up.save_success'))
                _this.handleRepairEndClose()
                _this.getFeedbackDetail()
            })
        },
        handleRepairEndClose() {
            this.repairEndShow = false;
            Object.assign(this.repairForm, this.$options.data().repairForm)
        },

        // 工单 结算
        handleSettlement() {
            let _this = this;
            this.$confirm({
                title: _this.$t('r.sure_bill'),
                okText: _this.$t('pop_up.yes'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.Repair.settlement({id: _this.id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.save_success'))
                        _this.getFeedbackDetail()
                    })
                },
            });
        },
        handleAuditShow() { // 显示弹框
            this.repairAuditShow = true
        },

        handleAuditClose() { // 关闭弹框
            this.repairAuditShow = false;
            Object.assign(this.auditForm, this.$options.data().auditForm)
        },
        handleAuditSubmit() { // 审核提交
            let form = Core.Util.deepCopy(this.auditForm)
            if (!form.audit_result) {
                return this.$message.warning('请选择审核结果')
            }
            /*if (form.audit_result === 0 && !form.audit_message) {
                return this.$message.warning('请输入审核未通过的原因')
            }*/
            this.loading = true;
            Core.Api.Repair.audit({
                ...form,
                id: this.id
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.handleAuditClose()
                this.routerChange('back')
            }).catch(err => {
                console.log('handleAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 工单 二次维修
/*        handleSecondRepairShow() {
            this.secondShow = true
            this.secondForm.plan_time = this.detail.plan_time ? dayjs.unix(this.detail.plan_time).format('YYYY-MM-DD HH:mm:ss') : undefined
        },*/
        /*handleSecondRepairSubmit() {
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
                this.getFeedbackDetail()
            }).catch(err => {
                console.log('getFeedbackDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.secondShow = false
            });
        },*/

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
                this.getFeedbackDetail()
                this.$refs.WaybillInfo.getWaybillDetail();
            }).catch(err => {
                console.log('getFeedbackDetail err', err)
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
            text-align: center;
            display: flex;
            align-content: flex-start;
            flex-flow: row wrap;

            .ant-checkbox-wrapper {
                width: 25%;
                margin-left: 0;
                margin-bottom: 18px;
                flex: 0 0 20%;
            }
        }
    }

    .steps-container {
        padding: 0 20px;
        margin-bottom: 20px;
    }
}
</style>

<template>
<div id="FeedbackDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('fe.feedback_detail') }}</div>
            <div class="btns-area">
                <template v-if="authOrg(detail.org_id, detail.org_type)">
                    <a-button type="primary" @click="handleFaultSubmit()" v-if="detail.status == STATUS.INIT  && !$auth('ADMIN')">
                        <i class="icon i_submit"/>{{ $t('def.submit') }}
                    </a-button>

                    <a-button type="primary" @click="updateFeedback()" v-if="haveUpdate && !$auth('ADMIN') && $auth('quality-feedback.save')">
                        <i class="icon i_audit"/>{{ $t('n.amend') }}
                    </a-button>
                </template>
                <a-button type="primary" @click="handleAuditShow()" v-if="detail.status === STATUS.WAIT_AFTER_SALES_AUDIT && $auth('ADMIN') && $auth('quality-feedback.after-audit')">
                    <i class="icon i_audit"/>{{ $t('fe.after_sales_audit') }}
                </a-button>
                <a-button type="primary" @click="handleAuditShow()" v-if="detail.status === STATUS.WAIT_QUALITY_AUDIT && $auth('ADMIN') && $auth('quality-feedback.quality-audit')">
                    <i class="icon i_audit"/>{{ $t('fe.quality_audit') }}
                </a-button>
                <a-button type="primary" @click="handleFeedbackShow()" v-if="(detail.status === STATUS.WAIT_FEEDBACK || detail.status === STATUS.QUALITY_AUDIT_FAIL ) && $auth('ADMIN') && $auth('quality-feedback.feedback')">
                    <i class="icon i_audit"/>{{ $t('fe.title') }}
                </a-button>
                <a-button type="primary" @click="handleFeedbackEnShow()" v-if="(detail.status === STATUS.WAIT_AFTER_FEEDBACK) && $auth('ADMIN') && $auth('quality-feedback.feedback')">
                    <i class="icon i_audit"/>{{ $t('fe.title') }}
                </a-button>

              <a-button type="primary" @click="handleExportConfirm()" v-if="detail.status === STATUS.CLOSE && $auth('ADMIN')">
                <i class="icon i_audit"/>{{ $t('n.export') }}
              </a-button>
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
            </div>
        </div>
        <MySteps :stepsList='stepsList' :current='currStep' v-if="detail.status != STATUS.CLOSE"/>
        <div class="form-container">
            <FeedbackEn  :id='id' :detail='detail' :serviceType='detail.service_type' @submit="getFeedbackDetail" v-if="detail.status == STATUS.CLOSE" ref="FeedbackEn"/>
            <Feedback  :id='id' :detail='detail' :serviceType='detail.service_type' @submit="getFeedbackDetail" v-if="detail.status == STATUS.WAIT_AFTER_FEEDBACK || detail.status == STATUS.CLOSE" ref="Feedback"/>

            <CheckFault  :id='id' :detail='detail' :serviceType='detail.service_type' @submit="getFeedbackDetail" v-if="detail.status == STATUS.INIT && sameOrg" ref="CheckFault"/>
            <CheckResult :id='id' :detail='detail' @hasTransfer='hasTransfer = true' v-if="showCheckResult"/>
            <FeedbackInfo  :id='id' :detail='detail'/>
            <AttachmentFile :detail='detail' :target_id='id' :target_type='ATTACHMENT_TARGET_TYPE.QUALITY_FEEDBACK'/>
            <ActionLog :id='id' :detail='detail' :sourceType="Core.Const.ACTION_LOG.SOURCE_TYPE.QUALITY_FEEDBACK"/>
            <AuditRecord :id='id' :detail='detail' :sourceType="Core.Const.AUDIT_RECORD.TARGET_TYPE.QUALITY_FEEDBACK"/>

        </div>
    </div>
    <template class="modal-container">
        <a-modal v-model:visible="feedbackAuditShow" :title="$t('fe.feedback')" class="repair-audit-modal" :after-close='handleAuditClose'>
            <div class="modal-content">
                <div class="form-item required">
                    <div class="key">{{ $t('n.result_a') }}:</div>
                    <a-radio-group v-model:value="auditForm.audit_result">
                        <a-radio :value="1">{{ $t('n.pass') }}</a-radio>
                        <a-radio :value="2">{{ $t('n.fail') }}</a-radio>
                        <a-radio :value="3">{{ $t('n.refuse') }}</a-radio>
                    </a-radio-group>
                </div>
                <div class="form-item textarea required">
                    <div class="key">{{ $t('n.reason') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="auditForm.audit_message" :placeholder="$t('n.please_input')+ $t('n.reason')"
                            :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="feedbackAuditShow = false">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleAuditSubmit()" type="primary">{{ $t('def.ok') }}</a-button>
            </template>
        </a-modal>
        <a-modal v-model:visible="feedbackShow" :title="$t('fe.after_feedback')" class="repair-audit-modal" :after-close='handleFeedbackClose'>
            <div class="modal-content">
                <div class="form-item textarea required">
                    <div class="key">{{ $t('n.fault_analysis') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="feedbackForm.fault" :placeholder="$t('n.please_input')+ $t('n.fault_analysis')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
                <div class="form-item textarea required">
                    <div class="key">{{ $t('fe.maintenance') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="feedbackForm.treatment" :placeholder="$t('n.please_input')+ $t('fe.maintenance')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
                <div class="form-item textarea required">
                    <div class="key">{{ $t('fe.solution') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="feedbackForm.solution" :placeholder="$t('n.please_input')+ $t('fe.solution')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
                <div class="form-item textarea required">
                    <div class="key">{{ $t('fe.demand') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="feedbackForm.requirement" :placeholder="$t('n.please_input')+ $t('fe.demand')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="feedbackShow = false">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleFeedbackSubmit()" type="primary">{{ $t('def.ok') }}</a-button>
            </template>
        </a-modal>
        <a-modal v-model:visible="feedbackEnShow" :title="$t('n.audit')" class="repair-audit-modal" :after-close='handleFeedbackEnClose'>
            <div class="modal-content">
                <div class="form-item textarea required">
                    <div class="key">{{ $t('n.fault_analysis') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="feedbackEnForm.fault_en" :placeholder="$t('n.please_input')+ $t('n.fault_analysis')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
                <div class="form-item textarea required">
                    <div class="key">{{ $t('fe.maintenance') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="feedbackEnForm.treatment_en" :placeholder="$t('n.please_input')+ $t('fe.maintenance')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
                <div class="form-item textarea required">
                    <div class="key">{{ $t('fe.solution') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="feedbackEnForm.solution_en" :placeholder="$t('n.please_input')+ $t('fe.solution')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
                <div class="form-item textarea required">
                    <div class="key">{{ $t('fe.demand') }}:</div>
                    <div class="value">
                        <a-textarea v-model:value="feedbackEnForm.requirement_en" :placeholder="$t('n.please_input')+ $t('fe.demand')"
                                    :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='99'/>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="feedbackEnShow = false">{{ $t('def.cancel') }}</a-button>
                <a-button @click="handleFeedbackEnSubmit()" type="primary">{{ $t('def.ok') }}</a-button>
            </template>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../../core';

import CheckFault from './components/CheckFault.vue';
import CheckResult from './components/CheckResult.vue';
import FeedbackInfo from './components/FeedbackInfo.vue';
import ActionLog from '../repair/components/ActionLog.vue';
import Feedback from './components/Feedback.vue';
import FeedbackEn from './components/FeedbackEn.vue';
import MySteps from '@/components/common/MySteps.vue';
import AttachmentFile from '@/components/panel/AttachmentFile.vue';
import AuditRecord from '@/components/common/AuditRecord.vue';


const FEEDBACK = Core.Const.FEEDBACK
const STATUS = Core.Const.FEEDBACK.STATUS
const REPAIR_ITEM = Core.Const.REPAIR_ITEM
const AUDIT = Core.Const.FEEDBACK.AUDIT

export default {
    name: 'RepairDetail',
    components: {
        AttachmentFile,
        CheckFault,
        CheckResult,
        FeedbackInfo,
        ActionLog,
        MySteps,
        AuditRecord,
        Feedback,
        FeedbackEn,
    },
    props: {},
    data() {
        return {
            Core,
            orgType: Core.Data.getOrgType(),
            orgId: Core.Data.getOrgId(),
            STATUS,
            AUDIT,
            ATTACHMENT_TARGET_TYPE: Core.Const.ATTACHMENT.TARGET_TYPE,

            // 加载
            loading: false,
            id: 0,
            detail: {}, // 工单详情

            stepsList: [
                // {title: '分配工单'},
                // {title: '后台审核'},
                {zh: '填写', en: 'Fill in'},
                {zh: '审核', en: 'Audit'},
                {zh: '反馈', en: 'Feedback'},

            ],
            currStep: 0,

            faultMap: {}, // 所有故障类型

            feedbackAuditShow: false, //审核
            feedbackShow: false,
            feedbackEnShow: false,
            // auditType: '',
            auditForm: {
                audit_result: '',
                audit_message: '',
                status: '',
            },
            feedbackForm: {
                fault: '',
                treatment: '',
                solution: '',
                requirement: '',
            },
            feedbackEnForm: {
                fault_en: '',
                treatment_en: '',
                solution_en: '',
                requirement_en: '',
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
            loginType: Core.Data.getLoginType(),
            loginOrgId: Core.Data.getOrgId(),
            loginOrgType: Core.Data.getOrgType(),
        };
    },
    watch: {},
    computed: {
        showCheckResult() {
            if (this.detail.source_id > 0){
                return true
            }
            switch (this.detail.status) {
                case STATUS.INIT:
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
        haveUpdate() {
            switch (this.detail.status) {
                case STATUS.INIT:
                case STATUS.AFTER_SALES_AUDIT_FAIL:
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
                case STATUS.INIT:
                    this.currStep = 0;
                    break;
                case STATUS.AFTER_SALES_AUDIT_FAIL:
                    this.currStep = 0;
                    break;
                case STATUS.WAIT_AFTER_SALES_AUDIT:
                    this.currStep = 1;
                    break;
                case STATUS.WAIT_FEEDBACK:
                    this.currStep = 2;
                    break;
                case STATUS.WAIT_AFTER_FEEDBACK:
                    this.currStep = 2;
                    break;
                case STATUS.WAIT_QUALITY_AUDIT:
                    this.currStep = 2;
                    break;
                case STATUS.QUALITY_AUDIT_FAIL:
                    this.currStep = 2;
                    break;

                case STATUS.CLOSE:
                    this.currStep = 3;
                    break;
            }
        },
        // 提交检测结果
        handleFaultSubmit() {
            this.$refs.CheckFault.handleSubmit();
        },
        // 提交检测结果
        handleSubmit() {
            Core.Api.Feedback.submit({
                id: this.id
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.handleAuditClose();
                this.getFeedbackDetail();
                // this.routerChange('back')
            }).catch(err => {
                console.log('handleAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleAuditShow() { // 显示弹框
            this.feedbackAuditShow = true;
            this.auditForm.status = this.detail.status;
        },

        handleAuditClose() { // 关闭弹框
            this.feedbackAuditShow = false;
            Object.assign(this.auditForm, this.$options.data().auditForm)
        },
        handleAuditSubmit() { // 审核提交
            let form = Core.Util.deepCopy(this.auditForm)
            if (!form.audit_result) {
                return this.$message.warning(this.$t('def.select') + this.$t('n.result'))
            }
            if ((form.audit_result === 2 ||form.audit_result === 3) && !form.audit_message) {
                return this.$message.warning(this.$t('audit.reason'))
            }
            this.loading = true;
            Core.Api.Feedback.audit({
                ...form,
                id: this.id
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.handleAuditClose();
                this.getFeedbackDetail();
                // this.routerChange('back')
            }).catch(err => {
                console.log('handleAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleFeedbackShow() { // 显示弹框
            this.feedbackShow = true;
        },
        handleFeedbackEnShow() { // 显示弹框
            this.feedbackEnShow = true;
        },

        handleFeedbackClose() { // 关闭弹框
            this.feedbackShow = false;
            Object.assign(this.feedbackForm, this.$options.data().feedbackForm)
        },
        handleFeedbackEnClose() {
            this.feedbackEnShow = false;
            Object.assign(this.feedbackEnForm, this.$options.data().feedbackEnForm)
        },
        handleFeedbackSubmit() { // 审核提交
            let form = Core.Util.deepCopy(this.feedbackForm)
            // if ((form.audit_result === 2 ||form.audit_result === 3) && !form.audit_message) {
            //     return this.$message.warning('请输入审核未通过的原因')
            // }
            this.loading = true;
            Core.Api.Feedback.feedback({
                ...form,
                id: this.id
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.handleFeedbackClose();
                this.getFeedbackDetail();
                // this.routerChange('back')
            }).catch(err => {
                console.log('handleAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleFeedbackEnSubmit() { // 审核提交
            let form = Core.Util.deepCopy(this.feedbackEnForm)
            // if ((form.audit_result === 2 ||form.audit_result === 3) && !form.audit_message) {
            //     return this.$message.warning('请输入审核未通过的原因')
            // }
            this.loading = true;
            Core.Api.Feedback.feedback({
                ...form,
                id: this.id
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.handleFeedbackEnClose();
                this.getFeedbackDetail();
                // this.routerChange('back')
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

        handleDeliverySubmit() {
            this.loading = true;
            let form = Core.Util.deepCopy(this.deliveryForm)
            if (!form.company_uid) {
                return this.$message.warning(this.$t('n.choose') + this.$t('n.logistics_company'))
            }
            if (!form.waybill_uid) {
                return this.$message.warning(this.$t('n.please_input') + this.$t('n.tracking_number'))
            }
            Core.Api.Repair.post({
                id: this.id,
                ...form
            }).then(() => {
                this.$message.success(this.$t('pop_up.operate'))
                this.getFeedbackDetail()
                this.$refs.WaybillInfo.getWaybillDetail();
            }).catch(err => {
                console.log('getFeedbackDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.deliveryShow = false
            });
        },
        updateFeedback(){
            var routeUrl = this.$router.resolve({
                path: "/feedback/feedback-edit",
                query: {id: this.detail.id}
            })
            window.open(routeUrl.href, '_self')
        },
        handleExportConfirm() { // 确认订单是否导出
            let _this = this;
            this.$confirm({
                title: _this.$t('fe.sure_export'),
                okText: _this.$t('def.sure'),
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    _this.handleExportIn();
                }
            })
        },
        // 导出订单
        handleExportIn() {
            const params = {
                id: this.detail.id, // 订单i
            };

            this.exportDisabled = true;
            let exportUrl = Core.Api.Export.feedbackTemplateExport(params);
            console.log("handlePurchaseExport _exportUrl", exportUrl)
            window.open(exportUrl, '_blank')
            this.exportDisabled = false;
        },
        authOrg(orgId, orgType) {
            console.log('org',this.loginOrgId === orgId && this.loginOrgType === orgType)
            if (this.loginOrgId === orgId && this.loginOrgType === orgType) {
                return true
            } else{ return false }
        },
    }
};
</script>

<style lang="less">
#FeedbackDetail {
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

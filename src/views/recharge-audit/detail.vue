<template>
    <div class="recharge-detail-container">
        <div class="title">{{ $t(/*充值审核详情*/ 'payment-management.recharge_audit_details') }}</div>
        <div class="detail-panel head">
            <div class="panel-flex-wrap">
                <div class="info-wrap">
                    <div class="info-line center">
                        <div class="info-key">
                            {{ $t(/*分销商名称*/ 'payment-management.dis_name') }}
                        </div>
                        <div class="info-value">
                            {{ detail.distributor_name || '-' }}
                        </div>
                    </div>
                    <div class="info-line">
                        <div class="info-block">
                            <div class="info-key">
                                {{ $t(/*本次充值总金额*/ 'payment-management.total_amount') }}
                            </div>
                            <div class="info-value flex">
                                {{ currencyValue }}{{ $Util.countFilter(detail?.content?.total_amount) || '-' }}
                            </div>
                        </div>
                        <div class="info-block">
                            <div class="info-key">
                                {{ $t(/*整车余额充值金额*/ 'payment-management.vehicle_amount') }}
                            </div>
                            <div class="info-value flex">
                                {{ currencyValue }}{{ $Util.countFilter(detail?.content?.vehicle_balance) || '-' }}
                            </div>
                        </div>
                        <div class="info-block">
                            <div class="info-key">
                                {{ $t(/*配件余额充值金额*/ 'payment-management.module_amount') }}
                            </div>
                            <div class="info-value flex">
                                {{ currencyValue }}{{ $Util.countFilter(detail?.content?.part_balance) || '-' }}
                            </div>
                        </div>
                    </div>
                    <div class="info-line start">
                        <div class="info-key">
                            {{ $t(/*收款账户信息*/ 'payment-management.collection_acc_info') }}
                        </div>
                        <div class="info-value w725">
                            <div v-for="(item, index) in fields" :key="index">
                                {{ item.label }}: {{ detail?.content?.payment_information[item.key] || '-' }}
                            </div>
                        </div>
                    </div>
                    <div class="info-line start">
                        <div class="info-key">
                            {{ $t(/*支付凭证*/ 'payment-management.payment_document') }}
                        </div>
                        <div
                            v-if="
                                detail?.content?.payment_information
                                    ? detail?.content?.payment_information.img.length
                                    : false
                            "
                            class="info-value w725 img"
                        >
                            <img
                                class="img-value"
                                v-for="item in detail?.content?.payment_information.img"
                                :src="$Util.imageFilter(item)"
                            />
                        </div>
                        <div class="info-value" v-else>-</div>
                    </div>
                </div>
                <div class="info-status">
                    <div class="info-status-box" :class="$Util.auditStatusFilter(detail.status, 'color')">
                        <img
                            v-if="
                                detail.status === CONST.AUDIT_STATUS_MAP.PENDING_FIRST ||
                                detail.status === CONST.AUDIT_STATUS_MAP.PENDING_SECOND
                            "
                            :src="pendingImg"
                        />
                        <img v-else-if="detail.status === CONST.AUDIT_STATUS_MAP.APPROVAL_SECOND" :src="approveImg" />
                        <img
                            v-else-if="
                                detail.status === CONST.AUDIT_STATUS_MAP.REJECT_FIRST ||
                                detail.status === CONST.AUDIT_STATUS_MAP.REJECT_SECOND
                            "
                            :src="rejectImg"
                        />
                        {{ $Util.auditStatusFilter(detail.status, 'text', $i18n.locale) }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 只有是业务员且当前状态为一审 或者是财务且当前状态为二审 才能进行审核操作 -->
        <!-- (一审核权限 && 等待审核状态) | (二审核权限 && 等待审核状态)  -->
        <template
            v-if="
                ($auth('finance.audit-record.recharge.first-instance') &&
                    $Util.Common.isMember(detail.status, [AUDIT_STATUS_MAP.PENDING_FIRST])) ||
                ($auth('finance.audit-record.recharge.second-instance') &&
                    $Util.Common.isMember(detail.status, [AUDIT_STATUS_MAP.PENDING_SECOND]))
            "
        >
            <div class="detail-panel">
                <div
                    :class="
                        detail.result === CONST.AUDIT_RESULT_MAP.REJECT
                            ? 'info-line center required'
                            : 'info-line center required mb'
                    "
                >
                    <div class="info-key">
                        {{ $t(/*审核结果*/ 'payment-management.audit_result') }}
                    </div>
                    <div class="info-value">
                        <a-radio-group @change="radioGroupChange" v-model:value="form.result">
                            <a-radio v-for="item in CONST.AUDIT_RESULT" :value="item.value">
                                {{ item[$i18n.locale] }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <div v-if="form.result === CONST.AUDIT_RESULT_MAP.REJECT" class="info-line start required mb">
                    <div class="info-key">
                        {{ $t(/*不通过原因填写*/ 'payment-management.caus_key') }}
                    </div>
                    <div class="info-value">
                        <a-textarea
                            v-model:value="form.remark"
                            :placeholder="$t(/*请输入不通过原因*/ 'payment-management.textarea')"
                            :auto-size="{ minRows: 6, maxRows: 6 }"
                        />
                    </div>
                </div>
            </div>
        </template>
        <!-- 审核不通过可以查看结果和审核原因 -->
        <div class="detail-panel" v-if="rejectAudit">
            <div :class="detail.result === CONST.AUDIT_RESULT_MAP.REJECT ? 'info-line center' : 'info-line center mb'">
                <div class="info-key">
                    {{ $t(/*审核结果*/ 'payment-management.audit_result') }}
                </div>
                <div class="info-value">
                    {{ $Util.auditStatusFilter(detail.status, 'text', $i18n.locale) }}
                </div>
            </div>
            <div v-if="form.result === CONST.AUDIT_RESULT_MAP.REJECT" class="info-line start">
                <div class="info-key">
                    {{ $t(/*不通过原因*/ 'payment-management.caus_result') }}
                </div>
                <div class="info-value">
                    {{ detail?.remark }}
                </div>
            </div>
        </div>
        <template
            v-if="
                ($auth('finance.audit-record.recharge.first-instance') &&
                    $Util.Common.isMember(detail.status, [AUDIT_STATUS_MAP.PENDING_FIRST])) ||
                ($auth('finance.audit-record.recharge.second-instance') &&
                    $Util.Common.isMember(detail.status, [AUDIT_STATUS_MAP.PENDING_SECOND]))
            "
        >
            <div class="btn-container">
                <a-button @click="routerChange('back')">{{ $t(/*取消*/ 'pop_up.no') }}</a-button>
                <a-button @click="handleSubmit" type="primary">{{ $t(/*确定*/ 'pop_up.yes') }}</a-button>
            </div>
        </template>
        <CheckModal :visible="modalShow" :bodyText="modalText" :title="modalTitle">
            <a-button @click="modalShow = false">{{ $t(/*返回修改*/ 'payment-management.return_modify') }}</a-button>
            <a-button type="primary" @click="handleModalSubmit">{{ submitText }}</a-button>
        </CheckModal>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance, watch } from 'vue';
import Core from '@/core';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import CheckModal from '@/components/horwin/based-on-ant/CheckModal.vue';
const router = useRouter();
const route = useRoute();
// const $i18n = useI18n();
const $t = useI18n().t;
const { proxy } = getCurrentInstance();
const detail = ref({
    name: 'Pioneer worldwide Pvt Ltd.（英国）',
    status: 1,
    total_amount: 150,
    vehicle_amount: 150,
    module_amount: 150,
    account_info:
        'BENEFICIARY BANK: J.P. MORGAN BANK LUXEMBOURG S.A., DUBLIN BRANCH SWIFT CODE: CHASIE4L BANK ADDRESS: 200 Capital Dock 79 Sir John Rogersons Quay Dublin 2 D02 RK57 ACCOUNT NUMBER: IE79CHAS93090301193329 COMPANY NAME: HORWIN NETHERLANDS B.V. COMAPANY ADDRESS: Flight Forum 40 5657 DB Eindhoven The Netherlands',
    img_list: [
        'https://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/2cf34279db262a4563d82e3033c7f4c18ed183efd6b45063f72582005349987d.png',
        'https://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/2cf34279db262a4563d82e3033c7f4c18ed183efd6b45063f72582005349987d.png',
        'https://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/2cf34279db262a4563d82e3033c7f4c18ed183efd6b45063f72582005349987d.png',
        'https://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/2cf34279db262a4563d82e3033c7f4c18ed183efd6b45063f72582005349987d.png',
        'https://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/2cf34279db262a4563d82e3033c7f4c18ed183efd6b45063f72582005349987d.png',
        'https://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/2cf34279db262a4563d82e3033c7f4c18ed183efd6b45063f72582005349987d.png',
        'https://horwin-app.oss-cn-hangzhou.aliyuncs.com/png/2cf34279db262a4563d82e3033c7f4c18ed183efd6b45063f72582005349987d.png',
    ],
});
const form = ref({
    id: 0,
    result: 3,
    remark: undefined,
});
const CONST = Core.Const.AUDIT_MANAGEMENT;
const AUDIT_STATUS_MAP = Core.Const.AUDIT_MANAGEMENT.AUDIT_STATUS_MAP;
// 当前货币类型
const currencyValue = computed(() => {
    if (detail.value.currency === 'EUR') {
        return '€';
    } else {
        return '$';
    }
});
// 是否是待审核状态
const pendingAudit = computed(() => {
    if (
        detail.value.status === CONST.AUDIT_STATUS_MAP.PENDING_FIRST ||
        detail.value.status === CONST.AUDIT_STATUS_MAP.PENDING_SECOND
    ) {
        return true;
    } else {
        return false;
    }
});
// 是否是审核不通过状态
const rejectAudit = computed(() => {
    if (
        detail.value.status === CONST.AUDIT_STATUS_MAP.REJECT_FIRST ||
        detail.value.status === CONST.AUDIT_STATUS_MAP.REJECT_SECOND
    ) {
        return true;
    } else {
        return false;
    }
});
const fields = ref([
    { key: 'beneficiary_bank', label: 'BENEFICIARY BANK' },
    { key: 'swift_code', label: 'SWIFT CODE' },
    { key: 'bank_address', label: 'BANK ADDRESS' },
    { key: 'account_number', label: 'ACCOUNT NUMBER' },
    { key: 'company_name', label: 'COMPANY NAME' },
    { key: 'company_address', label: 'COMPANY ADDRESS' },
    { key: 'remark', label: $t(/*其他汇款信息*/ 'payment-management.other_remittance_info') },
]);
const OSS_URL = 'https://horwin-app.oss-cn-hangzhou.aliyuncs.com';
const approveImg = `${OSS_URL}/png/323d149575aa263510339aeb319f6739b85a35e03788ca30a6ea119b004e7d46.png`;
const pendingImg = `${OSS_URL}/png/c82cb239af7563f5062ffbb4bd199d0512b15c062a97323a34113a198b447853.png`;
const rejectImg = `${OSS_URL}/png/92c9d1c2acbce09186c357d0e7cc7f16304ee584eeb69b7b639aa15c793b9104.png`;
const modalShow = ref(false);
const modalTitle = ref('payment-management.sure_fail');
const modalText = ref($t('payment-management.sure_tip'));
const submitText = ref($t('payment-management.confirm_reject'));
// watch(
//     () => $i18n.locale.value,
//     val => {
//         console.log('lang: ', $i18n.locale.value);
//         if (form.value.result === 1) {
//             modalTitle.value = 'payment-management.sure_success';
//             modalText.value = proxy.$t('payment-management.sure_approve_tip');
//             submitText.value = proxy.$t('payment-management.confirm_through');
//         } else {
//             modalTitle.value = 'payment-management.sure_fail';
//             modalText.value = proxy.$t('payment-management.sure_tip');
//             submitText.value = proxy.$t('payment-management.confirm_reject');
//         }
//     },
// );
onMounted(() => {
    form.value.id = Number(route.query.id) || 0;
    detail.value.id = Number(route.query.id) || 0;
    if (form.value.id) {
        getDetailService(form.value.id);
    }
});
/* Fetch start*/
const handleAuditService = params => {
    Core.Api.RechargeAudit.audit({
        ...params,
    })
        .then(res => {
            console.log('handleAuditService res', res);
            proxy.$message.success(proxy.$t(/*审核成功*/ 'payment-management.successful_audit'));
            modalShow.value = false;
            getDetailService(detail.value.id);
        })
        .catch(err => {
            console.log('handleAuditService err', err);
        });
};
const getDetailService = id => {
    Core.Api.RechargeAudit.detail({
        id: id,
    })
        .then(res => {
            console.log('getDetailService res', res);
            detail.value = res.detail;
            if (detail.value.content) {
                detail.value.content = JSON.parse(detail.value.content);
            }
            console.log('detail?.content?.payment_information.img', detail.value.content.payment_information.img);
        })
        .catch(err => {
            console.log('getDetailService err', err);
        });
};
/* Fetch end*/

/* methods start*/
const checkForm = form => {
    if (form.result === CONST.AUDIT_RESULT_MAP.REJECT) {
        if (!form.remark) {
            return proxy.$message.warning(proxy.$t(/*请填写不通过原因*/ 'payment-management.unvalid_tip'));
        }
    }
    return false;
};
const handleSubmit = () => {
    let _form = Core.Util.deepCopy(form.value);
    if (checkForm(_form)) return;
    console.log(_form.result);
    if (_form.result === 3) {
        modalShow.value = true;
    } else {
        handleModalSubmit();
    }
};
const routerChange = type => {
    switch (type) {
        case 'back': // 编辑
            router.go(-1);
            break;
    }
};
const radioGroupChange = e => {
    if (e.target.value === 1) {
        modalTitle.value = 'payment-management.sure_success';
        modalText.value = proxy.$t('payment-management.sure_approve_tip');
        submitText.value = proxy.$t('payment-management.confirm_through');
    } else {
        modalTitle.value = 'payment-management.sure_fail';
        modalText.value = proxy.$t('payment-management.sure_tip');
        submitText.value = proxy.$t('payment-management.confirm_reject');
    }
};
const handleModalSubmit = () => {
    handleAuditService({
        id: form.value.id,
        status: form.value.result,
        remark: form.value.remark,
    });
};
/* methods end*/
</script>

<style lang="less" scoped>
.recharge-detail-container {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .title {
        width: 100%;
        font-size: 18px;
        color: #1d2129;
        font-weight: 600;
        padding: 15px 20px;
        box-sizing: border-box;
    }
    .detail-panel {
        width: 100%;
        background: #ffffff;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 6px 6px 0 0;
        &.head {
            border-radius: 6px;
            margin-bottom: 24px;
        }
        .panel-flex-wrap {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        .info-line {
            display: flex;
            margin-bottom: 36px;
            &:last-child {
                margin-bottom: 0;
            }
            &.center {
                align-items: center;
            }
            &.start {
                align-items: flex-start;
            }
            &.mb {
                margin-bottom: 55px;
            }
            .info-block {
                margin-right: 140px;
                display: flex;
                align-items: center;
                &:last-child {
                    margin-right: 0;
                }
            }
            &.required {
                .info-key::before {
                    content: '*';
                    color: #eb4141;
                    vertical-align: middle;
                    margin-right: 2px;
                }
            }

            .info-key {
                min-width: 100px;
                text-align: right;
                margin-right: 16px;
                font-size: 14px;
                color: #1d2129;
                font-weight: 400;
                line-height: 22px;
            }
            .info-value {
                font-size: 16px;
                color: #4e5969;
                font-weight: 400;
                line-height: 22px;
                &.w725 {
                    width: 725px;
                }
                &.img {
                    display: flex;
                    flex-wrap: wrap;
                }
                .img-value {
                    width: 80px;
                    height: 80px;
                    border-radius: 4px;
                    margin-right: 16px;
                    margin-bottom: 16px;
                }
            }
        }
        .info-status {
            .info-status-box {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 8px 16px;
                box-sizing: border-box;
                font-size: 20px;
                font-weight: 400;
                > img {
                    width: 18px;
                    height: 18px;
                    margin-right: 4px;
                }
                &.yellow {
                    background: #fef7e7;
                    color: #faad14;
                }
                &.green {
                    background: rgba(38, 171, 84, 0.05);
                    color: #26ab54;
                }
                &.red {
                    color: #ff3d40;
                    background: rgba(255, 61, 64, 0.05);
                }
                &.grey {
                    color: #8090a6;
                    background: rgba(140, 140, 140, 0.05);
                }
            }
        }
    }
    .btn-container {
        background: #ffffff;
        border-top: 1px solid #f2f3f5;
        padding: 18px 0;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.ant-radio-group .ant-radio-wrapper {
    font-size: 14px;
}
textarea.ant-input {
    width: 725px;
    font-size: 14px;
    color: #4e5969;
}
.ant-btn {
    font-size: 14px;
}
</style>

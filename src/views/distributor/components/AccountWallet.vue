<template>
    <div class="account gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('distributor-detail.wallet') }}</div>
        </div>
        <!-- 整车账户 -->
        <div class="account-card">
            <a-row :gutter="24">
                <a-col :span="24">
                    <div class="account-card-title">
                        {{ $t('distributor-detail.vehicle_account') }}
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <div class="account-card-content-item">
                                <div class="account-card-content-item-top">
                                    <div class="account-card-content-item-title">
                                        {{ $t('distributor-detail.available_balance') }}：
                                    </div>
                                    <div class="account-card-content-item-value">
                                        {{ currency }} {{ dataObject.vehicleData.balance }}
                                    </div>
                                    <!-- 充值按钮 -->
                                    <a-button
                                        v-if="$auth('DISTRIBUTOR') && payType !== 'OLD'"
                                        type="primary"
                                        size="small"
                                        @click="handleRouteChange(0, dataObject.vehicleData)"
                                        >{{ $t('distributor-detail.recharge') }}</a-button
                                    >
                                    <!-- 资金变动明细 -->
                                    <div
                                        class="line-item"
                                        @click="handleRouteChange(1, dataObject.vehicleData, 10)"
                                        v-if="payType !== 'OLD'"
                                    >
                                        {{ $t('distributor-detail.fund_change_detail') }}
                                    </div>
                                    <!-- 充值记录 -->
                                    <div
                                        class="line-item"
                                        @click="handleRouteChange(2, dataObject.vehicleData)"
                                        v-if="payType !== 'OLD'"
                                    >
                                        {{ $t('distributor-detail.recharge_record') }}
                                    </div>
                                </div>
                                <div class="account-card-content-item-bottom">
                                    {{ $t('distributor-detail.vehicle_tips') }}
                                </div>
                            </div></a-col
                        >
                        <a-col :span="12">
                            <div class="account-card-content-item">
                                <div class="account-card-content-item-top">
                                    <div class="account-card-content-item-title">
                                        {{ $t('distributor-detail.pending_verification_marketing_balance') }}：
                                    </div>
                                    <div class="account-card-content-item-value">-</div>
                                </div>
                                <div class="account-card-content-item-bottom">
                                    {{ $t('distributor-detail.vehicle_warning_tips') }}
                                </div>
                            </div></a-col
                        >
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <!-- 授权账户 -->
        <div class="account-card" v-if="isShowCreditAccount">
            <a-row :gutter="24">
                <a-col :span="24">
                    <div class="account-card-title">
                        {{ $t('distributor-detail.credit_account') }}
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <div class="account-card-content-item">
                                <div class="account-card-content-item-top">
                                    <div class="account-card-content-item-title">
                                        {{ $t('distributor-detail.credit_amount') }}：
                                    </div>
                                    <div class="account-card-content-item-value">
                                        {{ currency }} {{ Core.Util.countFilter(detail.credit) }}
                                    </div>
                                    <!-- 调整额度 -->
                                    <a-button
                                        v-if="$auth('ADMIN') && payType !== 'OLD'"
                                        type="primary"
                                        size="small"
                                        @click="handleAdjustmentLimit"
                                        >{{ $t('distributor-detail.adjust_amount') }}</a-button
                                    >
                                    <!-- 授信变化 -->
                                    <div
                                        class="line-item"
                                        @click="handleRouteChange(3, dataObject.creditData)"
                                        v-if="payType !== 'OLD'"
                                    >
                                        {{ $t('distributor-detail.credit_change') }}
                                    </div>
                                </div>
                                <div class="account-card-content-item-bottom">
                                    {{ $t('distributor-detail.credit_tips') }}
                                </div>
                            </div></a-col
                        >
                        <a-col :span="12">
                            <div class="account-card-content-item">
                                <div class="account-card-content-item-top">
                                    <div class="account-card-content-item-title">
                                        {{ $t('distributor-detail.credit_balance') }}：
                                    </div>
                                    <div class="account-card-content-item-value">
                                        {{ currency }} {{ creditBalance }}
                                    </div>
                                </div>
                            </div></a-col
                        >
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <!-- 零部件账户 -->
        <div class="account-card">
            <a-row :gutter="24">
                <a-col :span="24">
                    <div class="account-card-title">
                        {{ $t('distributor-detail.parts_account') }}
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <div class="account-card-content-item">
                                <div class="account-card-content-item-top">
                                    <div class="account-card-content-item-title">
                                        {{ $t('distributor-detail.available_balance') }}：
                                    </div>
                                    <div class="account-card-content-item-value">
                                        {{ currency }} {{ dataObject.partsData.balance }}
                                    </div>
                                    <!-- 充值按钮 -->
                                    <a-button
                                        v-if="$auth('DISTRIBUTOR') && payType !== 'OLD'"
                                        @click="handleRouteChange(0, dataObject.partsData)"
                                        type="primary"
                                        size="small"
                                        >{{ $t('distributor-detail.recharge') }}</a-button
                                    >
                                    <!-- 资金变动明细 -->
                                    <div
                                        class="line-item"
                                        v-if="payType !== 'OLD'"
                                        @click="handleRouteChange(1, dataObject.partsData, 20)"
                                    >
                                        {{ $t('distributor-detail.fund_change_detail') }}
                                    </div>
                                    <!-- 充值记录 -->
                                    <div
                                        class="line-item"
                                        v-if="payType !== 'OLD'"
                                        @click="handleRouteChange(2, dataObject.partsData)"
                                    >
                                        {{ $t('distributor-detail.recharge_record') }}
                                    </div>
                                </div>
                                <div class="account-card-content-item-bottom">
                                    {{ $t('distributor-detail.parts_tips') }}
                                </div>
                            </div></a-col
                        >
                        <a-col :span="12">
                            <div class="account-card-content-item">
                                <div class="account-card-content-item-top">
                                    <div class="account-card-content-item-title">
                                        {{ $t('distributor-detail.credit_balance_re') }}：
                                    </div>
                                    <div class="account-card-content-item-value">
                                        {{ currency }} {{ dataObject.afterSaleData.balance }}
                                    </div>
                                    <div
                                        class="line-item"
                                        v-if="payType !== 'OLD'"
                                        @click="handleRouteChange(1, dataObject.afterSaleData, 30)"
                                    >
                                        {{ $t('distributor-detail.fund_change_detail') }}
                                    </div>
                                    <template v-if="$auth('sales.distribution.distributor.account-operations')">
                                        <span class="deduction" @click="handleOpenOp">{{ $t('def.operate') }}</span>
                                    </template>
                                </div>
                                <div class="account-card-content-item-bottom">
                                    {{ $t('distributor-detail.parts_warning_tips') }}
                                </div>
                            </div></a-col
                        >
                    </a-row>
                </a-col>
            </a-row>
        </div>
        <div class="modal-area" ref="modalRefs">
            <!-- 弹框 调整额度-->
            <a-modal
                v-model:visible="visible"
                centered
                :getContainer="() => modalRefs"
                :closable="false"
                :title="$t('distributor-detail.credit_balance')"
                @ok="handleOk"
                @cancel="handleCancel"
            >
                <div class="modal-content">
                    <a-form :model="formState">
                        <a-form-item :label="$t('distributor-detail.order_final_payment')">
                            {{ formState.orderBalance }} {{ currency }}
                        </a-form-item>
                        <a-form-item :label="$t('distributor-detail.available_balance')">
                            {{ formState.availableBalance }} {{ currency }}
                        </a-form-item>
                        <a-form-item :label="$t('distributor-detail.credit_amount')">
                            <a-input-number v-model:value="formState.creditBalance" :min="0" :precision="0">
                                <template #addonAfter>
                                    <span>{{ currency }}</span>
                                </template>
                            </a-input-number>
                        </a-form-item>
                    </a-form>
                </div>
                <!-- footer -->
                <template #footer>
                    <a-button key="back" @click="handleCancel">
                        {{ $t('common.cancel') }}
                    </a-button>
                    <a-button key="submit" type="primary" @click="handleOk">
                        {{ $t('common.confirm') }}
                    </a-button>
                </template>
            </a-modal>
        </div>
        <a-modal
            destroyOnClose
            wrapClassName="modalOp"
            v-model:visible="visibleOp"
            :title="$t('ac.operation')"
            @ok="handleConfirmOp"
            @cancel="initFormOp"
        >
            <a-row class="balance">
                <a-col :span="6" align="right">余额：</a-col>
                <a-col :span="17">{{ currency }} {{ dataObject.afterSaleData.balance }}</a-col>
            </a-row>
            <a-form
                :model="formStateOp"
                ref="formOpRef"
                name="basic"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 17 }"
            >
                <a-form-item
                    :label="$t('n.type')"
                    name="type"
                    :rules="[{ required: true, message: 'Please input your username!' }]"
                >
                    <a-radio-group v-model:value="formStateOp.type" @change="handleChangeType">
                        <a-radio :value="1">{{ $t('ac.recharge') }}</a-radio>
                        <a-radio :value="2">{{ $t('distributor-detail.deduction') }}</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('n.amount')"
                    name="money"
                    :rules="[{ required: true, message: 'Please input your username!' }]"
                >
                    <a-input-number
                        :addon-after="currency"
                        v-model:value="formStateOp.money"
                        :min="0"
                        :max="formStateOp.type === 2 ? dataObject.afterSaleData.balance || 0 : 9999"
                        :precision="2"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('n.reason')"
                    name="subject"
                    :rules="[{ required: true, message: 'Please input your subject!' }]"
                >
                    <a-select v-model:value="formStateOp.subject" :placeholder="$t('def.select')">
                        <a-select-option v-for="(val, key) of subjectMap" :key="key" :value="key">{{
                            val[$i18n.locale]
                        }}</a-select-option>
                    </a-select>
                </a-form-item>
                <template v-if="showRemark">
                    <a-form-item :label="$t('p.remark')" name="remark">
                        <a-textarea v-model:value="formStateOp.remark" show-count :maxlength="100" />
                    </a-form-item>
                </template>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Core from '@/core';
import { message } from 'ant-design-vue';
const PAY_TIME = Core.Const.DISTRIBUTOR.PAY_TIME_MAP;
const walletType = Core.Const.DISTRIBUTOR.WALLET_TYPE;

const $t = useI18n().t;
const router = useRouter();
const props = defineProps({
    detail: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['handleUpdateDetails']);
const payType = computed(() => {
    return PAY_TIME[props.detail.pay_type] === 'TT' || PAY_TIME[props.detail.pay_type] === 'OA'
        ? PAY_TIME[props.detail.pay_type]
        : 'OLD';
});
// 是否显示授信账户
const isShowCreditAccount = computed(() => {
    let type = payType.value === 'OA' || payType.value === 'OLD' ? true : false;
    return type;
});
// 货币
const currency = computed(() => {
    switch (props.detail.currency) {
        //    EUR
        case 'EUR':
            return '€';
        //    usd
        case 'USD':
            return '$';
        // 容错
        default:
            return '';
    }
});
const subjectMap = computed(() => {
    switch (formStateOp.value.type) {
        case 1:
            return {
                103: { key: 301, zh: '账户充值', en: 'Account recharge' },
            };
        case 2:
            return Core.Const.WALLET.DEDUCTION_SUBJECT_MAP;
        default:
            return Core.Const.WALLET.SUBJECT_MAP;
    }
});
const showRemark = computed(() => {
    const show =
        formStateOp.value.type === 2 && formStateOp.value.subject == Core.Const.WALLET.SUBJECT.MANUAL_DEDUCTION_OTHER;
    if (!show) formStateOp.value.remark = '';
    return show;
});
const visible = ref(false);
const visibleOp = ref(false);
const modalRefs = ref(null);
const formOpRef = ref(null);

const dataObject = ref({
    vehicleData: {
        balance: 0,
    }, // 整车账户
    partsData: {
        balance: 0,
    }, // 零部件账户
    afterSaleData: {
        balance: 0,
    }, // 售后账户
    creditData: {
        balance: 0,
    }, // 授信账户
});
// 授信余额
const creditBalance = ref(0);

const formState = ref({
    //订单尾款占用额度
    orderBalance: 0,
    // 可用余额
    availableBalance: 0,
    // 授信总额
    creditBalance: 0,
});
const formStateOp = ref({
    type: 1,
    money: '',
    subject: '',
    remark: '',
});

const getWalletList = () => {
    let params = {
        org_id: props.detail.id,
        org_type: 15,
    };
    Core.Api.Wallet.list(params).then(res => {
        emit('handleUpdateDetails');
        const typeMap = {
            10: 'vehicleData',
            20: 'partsData',
            30: 'afterSaleData',
            40: 'creditData',
        };
        const currencyMap = {
            EUR: 2,
            USD: 3,
        };
        let typeNumber = currencyMap[props.detail.currency];
        // 过虑数据
        res.list = res.list.filter(item => item.currency_type === typeNumber);
        console.log('res.list', res.list);
        for (let i = 0; i < res.list.length; i++) {
            let item = res.list[i];
            let key = typeMap[item.type];
            item.balance = Core.Util.countFilter(item?.balance || 0, 100, 2, false, true) * 1;
            item.type = item.type;
            dataObject.value[key] = item;
        }
        console.log('dataObject', dataObject.value);
    });
};
// methods
const handleRouteChange = (type, item, walletTypeValue) => {
    const query = {
        org_id: props.detail.id,
        org_type: 15, //分销商类型
        currency: currency.value,
    };

    let routeUrl = '';
    switch (type) {
        case 0:
            routeUrl = router.resolve({
                path: '/mall/recharge',
                query: {
                    id: props.detail.id,
                },
            });
            console.log('routeUrl', routeUrl);
            window.open(routeUrl.href, '_blank');
            break;
        case 1:
            query.walletType = walletType[walletTypeValue].value;
            routeUrl = router.resolve({
                path: '/distributor/distributor-fund-change-detail',
                query,
            });
            window.open(routeUrl.href, '_blank');
            break;
        case 2:
            routeUrl = router.resolve({
                path: '/distributor/distributor-recharge-record',
                query,
            });
            window.open(routeUrl.href, '_blank');
            break;
        case 3:
            routeUrl = router.resolve({
                path: '/distributor/distributor-credit-change',
                query,
            });
            window.open(routeUrl.href, '_blank');
            break;
        default:
            break;
    }
};
// 调整额度
const handleAdjustmentLimit = () => {
    console.log('props.detail', dataObject.value);
    formState.value.orderBalance = Math.abs(dataObject.value.creditData.balance * 1);
    //绝对值
    formState.value.creditBalance = Core.Util.countFilter(props.detail.credit) * 1; //授信总额
    formState.value.availableBalance = formState.value.creditBalance * 1 + dataObject.value.creditData.balance * 1; //可用余额
    visible.value = true;
};
// handleCancel
const handleCancel = () => {
    visible.value = false;
};
// handleOk
const handleOk = () => {
    let params = {
        id: props.detail.id,
        credit: Core.Util.countFilter(formState.value.creditBalance, 100, 2, true, false),
        spare_part_deduction_ratio: props.detail.spare_part_deduction_ratio,
    };
    Core.Api.Distributor.updateCredit(params).then(res => {
        console.log('res', res);
        visible.value = false;
        message.success($t('distributor-detail.operation_success'));
        getWalletList();
    });
};
const handleOpenOp = () => {
    visibleOp.value = true;
};
const handleChangeType = e => {
    console.log(e.target.value);
    formStateOp.value.subject = '';
};
const handleConfirmOp = async () => {
    try {
        const values = await formOpRef.value.validateFields();
        values.money = values.money * 100;
        let params = {
            wallet_id: dataObject.value.afterSaleData.id,
            ...values,
        };
        Core.Api.Wallet.update(params).then(res => {
            getWalletList();
            initFormOp();
            visibleOp.value = false;
        });
    } catch {}
};
const initFormOp = () => {
    formStateOp.value = {
        type: 1,
        money: '',
        subject: '',
        remark: '',
    };
};

watch(
    () => props.detail,
    (newV, oldV) => {
        console.log('newV', newV);
        creditBalance.value =
            Core.Util.countFilter(newV.credit, 100, 2, false, true) * 1 + dataObject.value.creditData.balance * 1;
    },
);

onMounted(() => {
    getWalletList();
});
</script>

<style lang="less" scoped>
.account {
    .panel-title {
        margin-bottom: 14px;
    }
    .account-card {
        width: 100%;
        min-height: 120px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 20px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &:last-child {
            margin-bottom: 0;
        }
        .account-card-title {
            font-weight: 600;
            font-size: 20px;
            margin-bottom: 16px;
        }
        .account-card-content-item {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .account-card-content-item-top {
                display: flex;
                align-items: center;
                .account-card-content-item-title {
                    font-size: 16px;
                    font-weight: 500;
                }
                .account-card-content-item-value,
                .line-item,
                .ant-btn {
                    margin-left: 8px;
                }
                .line-item {
                    color: #1890ff;
                    cursor: pointer;
                    text-decoration: underline;
                }
                .deduction {
                    margin-left: 10px;
                    color: #ff4d4f;
                    cursor: pointer;
                }
            }
            .account-card-content-item-bottom {
                margin-top: 16px;
                color: #8c8c8c;
                font-size: 12px;
            }
        }
    }
    .modal-area {
        :deep(.ant-modal-content) {
            border-radius: 4px;
            .ant-modal-header {
                padding: 16px 24px;
                height: auto !important;
                border-color: #e2e2e2;
                .ant-modal-title {
                    color: #1d2129;
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 1;
                    text-align: center;
                }
            }
            .ant-modal-footer {
                padding: 18px 0;
                height: auto;
                text-align: center;
                .ant-btn {
                    border-radius: 4px;
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
<style lang="less">
.modalOp {
    .balance {
        margin-bottom: 16px;
    }
}
</style>

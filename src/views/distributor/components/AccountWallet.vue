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
                                        @click="handleRouteChange(1, dataObject.vehicleData)"
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
                                        @click="handleRouteChange(1, dataObject.partsData)"
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
                                        @click="handleRouteChange(1, dataObject.afterSaleData)"
                                    >
                                        {{ $t('distributor-detail.fund_change_detail') }}
                                    </div>
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Core from '@/core';
import { message } from 'ant-design-vue';
const PAY_TIME = Core.Const.DISTRIBUTOR.PAY_TIME_MAP;
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
const visible = ref(false);
const modalRefs = ref(null);

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
            dataObject.value[key] = item;
        }
        console.log('dataObject', dataObject.value);
    });
};
// methods
const handleRouteChange = (type, item) => {
    console.log('type', type);
    console.log('item', item);
    const query = {
        org_id: props.detail.id,
        org_type: 15, //分销商类型
        wallet_type: item.type, //钱包类型
        subject: 101, //操作分类 (类型有点多 用到了call我)
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
            query.credit = props.detail.credit;
            routeUrl = router.resolve({
                path: '/distributor/distributor-fund-change-detail',
                query,
            });
            console.log('routeUrl', routeUrl);
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
    formState.value.orderBalance = dataObject.value.creditData.balance * 1; //占用
    formState.value.creditBalance = Core.Util.countFilter(props.detail.credit) * 1; //授信总额
    formState.value.availableBalance = formState.value.creditBalance * 1 + formState.value.orderBalance * 1; //可用余额
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

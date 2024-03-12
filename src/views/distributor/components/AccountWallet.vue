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
                                        {{ $t('distributor-detail.available_amount') }}：
                                    </div>
                                    <div class="account-card-content-item-value">0.00</div>
                                    <!-- 充值按钮 -->
                                    <a-button v-if="$auth('DISTRIBUTOR')" type="primary" size="small">{{
                                        $t('distributor-detail.recharge')
                                    }}</a-button>
                                    <!-- 资金变动明细 -->
                                    <div class="line-item" @click="handleRouteChange(1)">
                                        {{ $t('distributor-detail.fund_change_detail') }}
                                    </div>
                                    <!-- 充值记录 -->
                                    <div class="line-item" @click="handleRouteChange(2)">
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
        <div class="account-card">
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
                                    <div class="account-card-content-item-value">0.00</div>
                                    <!-- 调整额度 -->
                                    <a-button v-if="$auth('ADMIN')" type="primary" size="small">{{
                                        $t('distributor-detail.adjust_amount')
                                    }}</a-button>
                                    <!-- 授信变化 -->
                                    <div class="line-item" @click="handleRouteChange(3)">
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
                                    <div class="account-card-content-item-value">0</div>
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
                                        {{ $t('distributor-detail.available_amount') }}：
                                    </div>
                                    <div class="account-card-content-item-value">0.00</div>
                                    <!-- 充值按钮 -->
                                    <a-button v-if="$auth('DISTRIBUTOR')" type="primary" size="small">{{
                                        $t('distributor-detail.recharge')
                                    }}</a-button>
                                    <!-- 资金变动明细 -->
                                    <div class="line-item">
                                        {{ $t('distributor-detail.fund_change_detail') }}
                                    </div>
                                    <!-- 充值记录 -->
                                    <div class="line-item">
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
                                    <div class="account-card-content-item-value">0.00</div>
                                    <div class="line-item">
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Core from '@/core';
const $t = useI18n().t;
const route = useRoute();
const router = useRouter();
const props = defineProps({});

// methods
const handleRouteChange = type => {
    console.log('type', type);
    switch (type) {
        case 1:
            //    跳转到distributor-fund-change-detail
            router.push('/distributor/distributor-fund-change-detail');
            break;
        case 2:
            router.push('/distributor/distributor-recharge-record');
            break;
        case 3:
            router.push({
                path: '/distributor/distributor-credit-change',
            });
            break;
        default:
            break;
    }
};

onMounted(() => {});
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
}
</style>

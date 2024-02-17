<template>
    <a-steps :current="current">
        <a-step v-for="item in stepsList" :key="item.status">
            <template #title>{{ item[$i18n.locale] }}</template>
            <template #description>
                <!-- 检测 -->
                <template v-if="item.status === STATUS.WAIT_DETECTION">
                    <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(status, 'color')">
                        {{ $Util.StatusFilter(status, examine_status, $i18n.locale) }}
                    </div>
                </template>
                <!-- 维修 -->
                <template v-if="item.status === STATUS.WAIT_PAY">
                    <div
                        class="status status-bg status-tag"
                        :class="$Util.paymentStatusFilter(payment_status, 'color')"
                    >
                        {{ $Util.paymentStatusFilter(payment_status, $i18n.locale) }}
                    </div>
                </template>
                <!-- 结算 -->
                <template v-if="item.status === STATUS.WAIT_DELIVER">
                    <div class="status status-bg status-tag" :class="$Util.purchaseStatusFilter(status, 'color')">
                        {{ $Util.StatusFilter(status, goods_status, $i18n.locale, 'finally') }}
                    </div>
                </template>
                <!-- 发货 -->
                <template v-if="item.status === STATUS.WAIT_TAKE_DELIVER">
                    <span class="time">{{ $t('p.receipt_message') }}</span>
                </template>
            </template>
        </a-step>
    </a-steps>
</template>

<script>
import Core from '@/core';
const STATUS = Core.Const.PURCHASE.STATUS;

export default {
    props: {
        stepsList: {
            type: Array,
            default: [],
        },
        current: {
            type: Number,
            default: 0,
        },
        status: {
            type: Number,
            default: 0,
        },
        payment_status: {
            type: Number,
            default: 0,
        },
    },
    mounted() {},
    data() {
        return {
            STATUS,
            Core,
            goods_status: Core.Const.PURCHASE.goods_status, // 发货状态
            examine_status: Core.Const.PURCHASE.examine_status, // 审核状态
        };
    },
};
</script>

<style scoped>
.time {
    white-space: nowrap;
}
.status {
    padding: 2px 5px;
    border-radius: 4px;
}
</style>

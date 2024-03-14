<template>
    <div class="payment">
        <div class="payment-content">
            <div class="deposit-payment" id="deposit-payment">
                <div class="deposit-payment-row" style="margin-top: 12px">
                    <div class="deposit-payment-row-left">payment method:</div>
                    <div class="deposit-payment-row-right">{{ mes.accountHolder }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">shipping amount:</div>
                    <div class="deposit-payment-row-right">{{ mes.accountNickname }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">30% advance payment:</div>
                    <div class="deposit-payment-row-right">{{ mes.IBAN }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">shipping amount:</div>
                    <div class="deposit-payment-row-right">{{ mes.SWIFTBIC }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">Need to pay this time:</div>
                    <div class="deposit-payment-row-right price">{{ mes.bankName }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    // 渲染数据
    mes: {
        type: Object,
        default: () => {
            return {
                accountHolder: '-',
                accountNickname: '-',
                IBAN: '-',
                SWIFTBIC: '-',
                bankName: '-',
            };
        },
    },
});
</script>
<style lang="less" scoped>
.payment {
    flex: 1;
    .flex(initial,initial);
    .payment-title {
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 25px;
    }
    .payment-content {
        flex: 1;
        background-color: #fff;
        padding: 40px 40px 40px 56px;
        .deposit-payment {
            &-row {
                .flex(initial, center, row);
                &:nth-child(n + 2) {
                    margin-top: 35px;
                }
                &-left {
                    flex-basis: 220px;
                    font-size: 14px;
                    line-height: 21px;
                    color: #666;
                }
                &-right {
                    color: #000;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 21px;
                    &.price {
                        font-size: 18px;
                        color: #8f00ff;
                    }
                }
            }
        }
    }
}
</style>

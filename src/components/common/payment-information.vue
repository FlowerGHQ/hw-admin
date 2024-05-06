<template>
    <div class="payment">
        <div class="payment-content">
            <div class="deposit-payment" id="deposit-payment">
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">BENEFICIARY BANK:</div>
                    <div class="deposit-payment-row-right">{{ mes.beneficiary_bank || '-' }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">SWIFT CODE:</div>
                    <div class="deposit-payment-row-right">{{ mes.swift_code || '-' }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">BANK ADDRESS:</div>
                    <div class="deposit-payment-row-right">{{ mes.bank_address || '-' }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">ACCOUNT NUMBER:</div>
                    <div class="deposit-payment-row-right">{{ mes.account_number || '-' }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">COMPANY NAME:</div>
                    <div class="deposit-payment-row-right">{{ mes.company_name || '-' }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">COMPANY ADDRESS:</div>
                    <div class="deposit-payment-row-right">{{ mes.company_address || '-' }}</div>
                </div>
                <div class="deposit-payment-row">
                    <div class="deposit-payment-row-left">
                        {{ $t(/*其他汇款信息*/ 'payment-management.other_remittance_info') }}:
                    </div>
                    <div class="deposit-payment-row-right">{{ mes.remark || '-' }}</div>
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
                beneficiary_bank: '',
                swift_code: '',
                bank_address: '',
                account_number: '',
                company_name: '',
                company_address: '',
                remark: '',
            };
        },
    },
});
</script>
<style lang="less" scoped>
.payment {
    flex: 1;
    .flex(initial,initial);
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
                    flex-basis: 250px;
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

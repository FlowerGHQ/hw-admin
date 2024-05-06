<template>
    <div id="pending-payment">
        <div class="content">
            <div class="payment-balance">
                <PaymentInformation :mes="mes" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import PaymentInformation from '../../components/common/payment-information.vue';

const route = useRoute();

const mes = JSON.parse(route.query?.form || '');
</script>
<style lang="less" scoped>
#pending-payment {
    .payment-balance {
        .flex(initial,initial,row);
    }
}
</style>

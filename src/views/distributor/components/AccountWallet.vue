<template>
    <div class="account">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" :tab="$t('d.account_balance')">
                <AccountBalance/>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('d.balance_details')">
                <balanceDetails />
            </a-tab-pane>            
        </a-tabs>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import balanceDetails from './balanceDetails.vue'
    import AccountBalance from './AccountBalance.vue'
    const activeKey = ref('1')
</script>

<style lang="less" scoped>

</style>
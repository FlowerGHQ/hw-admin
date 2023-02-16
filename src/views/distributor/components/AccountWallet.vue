<template>
    <div class="account">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" :tab="$t('d.account_balance')">
                <div class="user-name">
                    用户姓名
                </div>
                <div class="account-balance"></div>
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('d.balance_details')">
                2
            </a-tab-pane>            
        </a-tabs>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    const activeKey = ref('1')
</script>

<style lang="less" scoped>
.user-name {
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    padding: 30px 30px;
}
.account-balance {
    
}
</style>
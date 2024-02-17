<template>
    <div class="account">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" :tab="$t('d.account_balance')">
                <AccountBalance
                    v-if="activeKey == 1"
                    :id="detail.id"
                    :name="detail.name"
                    @changeTabToDetail="getTabInfo"
                />
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('d.balance_details')">
                <balanceDetails :org_id="detail.id" v-if="activeKey == 2" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import balanceDetails from './balanceDetails.vue';
import AccountBalance from './AccountBalance.vue';
const activeKey = ref('1');
const name = ref('');
const props = defineProps({
    detail: { type: String, default: () => {} },
});
onMounted(() => {
    name.value = props.name;
});
// 子组件AccountBalance的切换到明细的事件
const getTabInfo = data => {
    activeKey.value = data;
};
</script>

<style lang="less" scoped></style>

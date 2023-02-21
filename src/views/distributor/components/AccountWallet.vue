<template>
    <div class="account">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" :tab="$t('d.account_balance')">
                <AccountBalance :name="name" @changeTabToDetail="getTabInfo" />
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('d.balance_details')">
                <balanceDetails />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import balanceDetails from './balanceDetails.vue'
import AccountBalance from './AccountBalance.vue'
const activeKey = ref('1')
const name = ref('')
const props = defineProps({
    name: { type: String, default: '' },
})
onMounted(()=>{
    name.value = props.name
})
// 子组件AccountBalance的切换到明细的事件
const getTabInfo = (data) => {
    activeKey.value = data
}
</script>

<style lang="less" scoped></style>
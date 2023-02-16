<template>
    <div class="account">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="账户余额">
                1
            </a-tab-pane>
            <a-tab-pane key="2" tab="余额明细">
                2
            </a-tab-pane>            
        </a-tabs>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    const activeKey = ref('1')
</script>

<style lang="scss" scoped>

</style>
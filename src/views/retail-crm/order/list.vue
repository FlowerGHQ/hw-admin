<template>
    <div id="OrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("retail.order_list") }}</div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane :key="1" :tab="$t('retail.paid')"></a-tab-pane>
                    <a-tab-pane :key="2" :tab="$t('retail.to_be_paid')"></a-tab-pane>
                    <a-tab-pane :key="3" :tab="$t('retail.apply_refund')"></a-tab-pane>
                    <a-tab-pane :key="4" :tab="$t('retail.unsubscribed_refunded')"></a-tab-pane>
                </a-tabs>
                <allTable :activeKey="activeKey"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import allTable from './components/custom-table.vue'
const activeKey = ref(1)


const {proxy} = getCurrentInstance()
const router = useRouter()
</script>

<style lang="less" scoped>
</style>

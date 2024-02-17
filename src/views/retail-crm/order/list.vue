<template>
    <div id="OrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('retail.order_list') }}</div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.paid" :tab="$t('retail.paid')"></a-tab-pane>
                    <a-tab-pane
                        :key="Core.Const.RETAIL.Order_Status_Map.to_be_paid"
                        :tab="$t('retail.to_be_paid')"
                    ></a-tab-pane>
                    <a-tab-pane
                        :key="Core.Const.RETAIL.Order_Status_Map.apply_refund"
                        :tab="$t('retail.apply_refund')"
                    ></a-tab-pane>
                    <a-tab-pane
                        :key="Core.Const.RETAIL.Order_Status_Map.unsubscribed_refunded"
                        :tab="$t('retail.unsubscribed_refunded')"
                    ></a-tab-pane>
                </a-tabs>
                <allTable :activeKey="activeKey" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from '@/core';
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import allTable from './components/custom-table.vue';
const activeKey = ref(1);

const { proxy } = getCurrentInstance();
const router = useRouter();
</script>

<style lang="less" scoped></style>

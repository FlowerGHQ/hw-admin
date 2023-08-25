<template>
    <div id="OrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("retail.order_list") }}</div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.all" :tab="`${$t('n.all')}(${num})`"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.to_be_shipped" :tab="$t('n.delivery')"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.to_be_received" :tab="$t('n.shipped')"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.completed" :tab="$t('retail.completed')"></a-tab-pane>
                </a-tabs>{{ activeKey }}
                <allTable :activeKey="activeKey"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import allTable from './components/custom-table.vue'
const activeKey = ref(0)
const num = ref(50)

const {proxy} = getCurrentInstance()
const router = useRouter()


</script>
<style lang="less" scoped>

</style>

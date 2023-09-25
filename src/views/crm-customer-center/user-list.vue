<template>
    <div id="clue-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">用户列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('add')"><i class="icon i_add"/>创建用户</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.paid" :tab="$t('retail.paid')"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.to_be_paid" :tab="$t('retail.to_be_paid')"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.apply_refund" :tab="$t('retail.apply_refund')"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.unsubscribed_refunded" :tab="$t('retail.unsubscribed_refunded')"></a-tab-pane>
                </a-tabs>
                <allTable :activeKey="activeKey"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import allTable from './components/user-table.vue';
const activeKey = ref(1)


const {proxy} = getCurrentInstance()
const router = useRouter()


/* Fetch start */

/* Fetch end */

/* methods start */
const routerChange = (type) => {
    switch(type){
        // 创建用户
        case 'add':
            router.push({
                path: "/user-center/user-edit",
            })
        break;
    }
}
/* methods end */
</script>

<style lang="less" scoped>
</style>

<template>
    <div id="clue-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">线索</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('add')"><i class="icon i_add"/>创建用户</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane :key="Core.Const.WORK_OPERATION.Clue_Status_Map.all" :tab="$t(`${langApi}.tab_all`)"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.WORK_OPERATION.Clue_Status_Map.loss" :tab="$t(`${langApi}.tab_loss`)"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.WORK_OPERATION.Clue_Status_Map.undistributed" :tab="$t(`${langApi}.tab_undistributed`)"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.WORK_OPERATION.Clue_Status_Map.notFollow" :tab="$t(`${langApi}.tab_notFollow`)"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.WORK_OPERATION.Clue_Status_Map.followed" :tab="$t(`${langApi}.tab_followed`)"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.WORK_OPERATION.Clue_Status_Map.dormancy" :tab="$t(`${langApi}.tab_dormancy`)"></a-tab-pane>
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
import allTable from './components/clue-table.vue'
const langApi = 'crm-customer-center'
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

<template>
    <div class="user-about">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane :key="pane.key" :tab="pane.title" v-for="(pane) in panes">
                <template v-if="activeKey === 1">
                    <GeneralView/>
                </template>
                <template v-else-if="activeKey === 2">
                    <p>页面{{ pane.key }}</p>
                    <FollowUp />
                </template>
                <template v-else-if="activeKey === 3">
                    <p>页面{{ pane.key }}</p>
                </template>
                <template v-else-if="activeKey === 4">
                    <Order/>
                </template>
                <template v-else-if="activeKey === 5">
                    <TestDrive/>
                </template>
                <template v-else-if="activeKey === 6">
                    <p>页面{{ pane.key }}</p>
                </template>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Order from './order.vue';
import TestDrive from './test-drive.vue';
import GeneralView from './general-view.vue';
import Core from '@/core';
import { reactive, ref, toRefs } from 'vue';
import FollowUp from "./FollowUp.vue";

const activeKey = ref(1)
const panes = ref([
    { key: 1, title: `总览(${20})` },
    { key: 2, title: `跟进记录(${20})` },
    { key: 3, title: `归属记录(${20})` },
    { key: 4, title: `订单(${20})` },
    { key: 5, title: `试驾(${20})` },
    { key: 6, title: `日志(${20})` },
])

</script>

<style lang="less" scoped>
.user-about {
    height: 100%;
    .ant-tabs {
        height: 100%;
        :deep(.ant-tabs-content-holder) {
            overflow-y: auto;
        }
    }
}
</style>

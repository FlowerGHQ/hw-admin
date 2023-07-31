<template>
    <div id="OrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("retail.order_list") }}</div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane key="1" tab="已支付">
                        <havePaid/>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="待支付">
                        <toBePaid/>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="申请退订/退款">
                        <requestCancellation/>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="已退订/退款">
                        <cancelledRefunded/>
                    </a-tab-pane>
                </a-tabs>            
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import havePaid from './components/have-paid.vue'
import toBePaid from './components/to-be-paid.vue'
import requestCancellation from './components/request-cancellation.vue'
import cancelledRefunded from './components/cancelled-refunded.vue'
const activeKey = ref('1')


const {proxy} = getCurrentInstance()
const router = useRouter()
</script>

<style lang="less" scoped>
</style>

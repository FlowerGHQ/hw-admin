<template>
    <div id="OrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("retail.order_list") }}</div>
            </div>
            <div class="table-container">
                 <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane v-for="item in Core.Const.RETAIL.Order_Status_Map" :key="item.value" :tab="`${lang=='zh'?item.zh:item.en}(${numTab[item.key-1]})`"></a-tab-pane>
                </a-tabs>
                <!-- <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.all" :tab="`${$t('n.all')}(${numTab[0]})`"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.to_be_shipped" :tab="`${$t('n.delivery')}(${numTab[1]})`"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.to_be_received" :tab="$t('n.shipped')"></a-tab-pane>
                    <a-tab-pane :key="Core.Const.RETAIL.Order_Status_Map.completed" :tab="$t('retail.completed')"></a-tab-pane>
                </a-tabs> -->
                <allTable :activeKey="activeKey" @getTabNumber="tabNumber" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import allTable from './components/custom-table.vue';
const { proxy } = getCurrentInstance();
const router = useRouter();
const lang = computed(() => {
    return proxy.$store.state.lang;
})
const activeKey = ref(0);
const numTab = ref([0,0,0,0])

const tabNumber = (obj) => {
    console.log('88888888',obj);
   /*  if(){

    } */
    // numTab.value = num;
}

</script>
<style lang="less" scoped>

</style>

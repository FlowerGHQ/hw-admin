<template>
    <div id="OrderList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t("retail.order_list") }}</div>
            </div>
            <div class="table-container">
                <a-tabs v-model:activeKey="activeKey" @change="tabChange">
                    <a-tab-pane v-for="item in Core.Const.GOODITEMORDER.Order_Status_Map" :key="item.value" :tab="`${lang=='zh'?item.zh:item.en}(${numTab[item.key-1]})`"></a-tab-pane>
                </a-tabs>
                <allTable  ref="Atable"  :activeKey="activeKey" @getTabNumber="tabNumber" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Core from "@/core";
import { computed, getCurrentInstance, onMounted, reactive, ref, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import allTable from './components/custom-table.vue';
const { proxy } = getCurrentInstance();
const router = useRouter();
const lang = computed(() => {
    return proxy.$store.state.lang;
})
const activeKey = ref(0);
const numTab = ref([0,0,0,0]);
const Atable = ref(); 

const tabNumber = (obj) => {
    Core.Api.GoodItemsOrder.statusCount().then((res) => {
        numTab.value[0] = res?.total;
        numTab.value[1] = res?.wait_send_count;
        numTab.value[2] = res?.wait_sake_count;
        numTab.value[3] = res?.completed_count;
        
    }).catch((err) => {
        console.log("getTableData err:", err);

    }).finally(() => {
        
    });
}

provide('tabNumber', tabNumber);
const tabChange = () => {
    proxy.$nextTick(()=>{
        
        Atable.value.handleSearchReset();
    })
}
</script>
<style lang="less" scoped>

</style>

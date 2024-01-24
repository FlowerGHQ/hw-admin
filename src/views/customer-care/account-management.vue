<template>
    <div class="account-management">
        <div class="list-container">
            <!-- 头部 -->
            <div class="title-container">
                <div class="title-area">{{ $t("customer-care.account_management_and_distribution") }}</div>
            </div>
            <div class="search-container">
                <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false"> </SearchAll>
            </div>
            <div class="btn-container"></div>
            <div class="table-container"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch, onMounted } from "vue";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import { useTable } from "@/hooks/useTable";
import SearchAll from "@/components/horwin/based-on-ant/SearchAll.vue";

// 搜索配置
const searchList = [
    {
        // 问询单号
        type: "input",
        value: "",
        searchParmas: "username ",
        key: "customer-care.customer_service_account",
    },
];

// 搜索
const onSearch = (params) => {
    console.log(params);
};
// 重置
const onReset = () => {
    console.log("重置");
};
</script>

<style lang="less" scoped>
.account-management {
}
</style>

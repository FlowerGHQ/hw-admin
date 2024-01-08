<template>
    <div class="sales-strategy-list">
        <div class="search-form">
            <SearchAll
                :options="searchList"
                @search="getSearchFrom"
                @reset="handleSearchReset"
                :isShowMore="false" />
        </div>
        <div class="addd-btn">
            <el-button type="primary" icon="el-icon-plus" @click="add"
                >新增</el-button
            >
        </div>
        <div class="table-area"></div>
    </div>
</template>

<script setup>
import SearchAll from "@/components/common/SearchAll.vue";
import { ref } from "vue";

const searchList = ref([
    {
        id: 0,
        type: "input",
        value: "",
        searchParmas: "strategy_name",
        key: "sales-strategy.strategy_name",
    }, // 名称
    {
        id: 2, // 随意
        type: "select", // 类型
        key: "sales-strategy.area", // 名称
        value: undefined, // 绑定值
        searchParmas: "area", // 返回的搜索名称
        selectMap: [
            {
                zh: "整车",
                en: "Vehicle",
                value: 1, // a-select-option 中的 :value="item.value"  // 固定的
            },
        ],
        placeholder: "def.select",
    },
]);
</script>

<style lang="less" scoped></style>

<template>
    <div class="sales-strategy-list">
        <div class="search-form">
            <SearchAll
                :options="searchList"
                @search="getSearchFrom"
                @reset="handleSearchReset" />
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
	{ type: "input", value: "", searchParmas: "name",  key: 'n.name' },// 名称
]);
</script>

<style lang="less" scoped></style>

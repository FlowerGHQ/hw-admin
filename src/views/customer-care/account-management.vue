<template>
    <div class="account-management">
        <div class="list-container">
            <!-- 头部 -->
            <div class="title-container">
                <div class="title-area">{{ $t("customer-care.account_management_and_distribution") }}</div>
            </div>
            <div class="search">
                <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false"> </SearchAll>
            </div>
            <div class="table-container">
                <a-button type="primary" class="add-btn">
                    <!-- 新增分配 -->
                    {{ $t("customer-care.add_distribution") }}
                    <template #icon>
                        <plus-outlined />
                    </template>
                </a-button>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="(record) => record.id"
                    :pagination="false">
                    <template #bodyCell="{ column, text, record }"> </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, watch, onMounted, h } from "vue";
import Core from "@/core";
import MySvgIcon from "@/components/MySvgIcon/index.vue";
import { useTable } from "@/hooks/useTable";
import SearchAll from "@/components/horwin/based-on-ant/SearchAll.vue";
import { PlusOutlined } from "@ant-design/icons-vue";
const request = Core.Api.inquiry_sheet.cusomerList;





const { loading, tableData, search, refreshTable, onPageChange, searchParam } = useTable({
    request,
    isPageAble: false,
    initParam: {
        org_id: 1,
        org_type: 10,
    }
});


// 搜索配置
const searchList = ref([
    {
        // 问询单号
        type: "input",
        value: "",
        searchParmas: "username",
        key: "customer-care.customer_service_account",
    },
]);
// 表格配置
const tableColumns = [
    {
        // 序号
        title: "序号",
        dataIndex: "index",
        align: "center",
        width: 80,
		customRender: ({ text, record, index }) => {
			return index + 1;
		}
    },
    {
        // 账号
        title: "账号",
        dataIndex: "username",
        align: "center",
    },
    {
        // 名称
        title: "名称",
        dataIndex: "name",
        align: "center",
    },
    {
        // 地区
        title: "地区",
        dataIndex: "area",
        align: "center",
    },
    // 设置
    {
        title: "设置",
        dataIndex: "setting",
        align: "center",
    },
];
// 搜索
const onSearch = (params) => {
    searchParam.value = params;
    search();
};
// 重置
const onReset = () => {
    refreshTable();
};
</script>

<style lang="less" scoped>
.account-management {
    .table-container {
        .add-btn {
            margin-bottom: 10px;
        }
    }
}
</style>

<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t("item-bom.title") }}</div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList"> </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="(record) => record.id"
                :pagination="false"
            >
                <template #bodyCell="{ column, text, record }">                    
                </template>
            </a-table>
        </div>
        <div class="paging-container">
            <a-pagination
                v-model:current="pagination.current"
                :page-size="pagination.size"
                :total="pagination.total"
                show-quick-jumper
                show-size-changer
                show-less-items
                :show-total="(total) => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
                :hide-on-single-page="false"
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="onPageChange"
                @showSizeChange="onSizeChange"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, computed, watch } from "vue";
import Core from "@/core";
import SearchAll from "@/components/common/SearchAll.vue";
import { useTable } from '@/hooks/useTable'
import { useI18n } from "vue-i18n";

const $t = useI18n().t;

const tableColumns = computed(() => {
    let columns = [
        { title: $t("n.name"), dataIndex: "name" },
        { title: $t("n.name_en"), dataIndex: "name_en", key: "name_en" },
        { title: $t("n.continent"), dataIndex: "continent", key: "" },
        { title: $t("n.country"), dataIndex: "country", key: "country" },
        { title: $t("def.operate"), key: "operation", fixed: "right" },
    ];
    return columns;
});

const searchList = ref([
    { 
        type: "input", 
        value: "", 
        searchParmas: "name",  
        key: 'supply-chain.company_name' 
    },
    { 
        type: "select",
        value: undefined,
        searchParmas: "type",
        key: 'supply-chain.supplier_type',
        selectMap: Core.Const.SUPPLAY.SUPPLAY_TYPE,
    },
])

onMounted(() => {});
/* Fetch start*/
const request = Core.Api.SalesArea.list;
const {
    loading,
    tableData,
    pagination,
    search,
    onSizeChange,
    refreshTable,
    onPageChange,
    searchParam,
} = useTable({ request });
/* Fetch end*/

/* methods start*/

/* methods end*/
</script>

<style lang="less" scoped></style>

<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t("supply-chain.application_Materials") }}</div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll 
                :options="searchList"
                :isShowMore="false"
                @search="onSearch"
                @reset="onReset"
            >
            </SearchAll>
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
                <template #bodyCell="{ column, text, record, index }">
                    <!-- 序号 -->
                    <template v-if="column.key === 'number'">
                        {{ index + 1 }}
                    </template>
                    <!-- 公司名称 -->
                    <template v-if="column.key === 'company_name'">
                        <a-tooltip placement="topLeft">
                            <template #title>{{ text }}</template>
                            <div
                                class="one-spils cursor"
                                :style="{
                                    width: text?.length > 6 ? 7 * 12 + 'px' : '',
                                }"
                            >
                                {{ text }}
                            </div>
                        </a-tooltip>
                    </template>
                    <!-- 供应商类型 -->
                    <template v-if="column.key === 'type'">
                        {{ Core.Const.SUPPLAY.SUPPLAY_TYPE[text] ? $t(Core.Const.SUPPLAY.SUPPLAY_TYPE[text]?.t) : '-' }}
                    </template>
                    <!-- 提交时间 -->
                    <template v-if="column.key === 'create_time'">
                        {{ text ? $Util.timeFormat(text) : '-' }}
                    </template>
                    <!-- 操作 -->
                    <template v-if="column.key === 'operations'">
                        <a-button type="link" @click="onView">{{ $t('supply-chain.view') }}</a-button>
                    </template>                 
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
import { useRouter } from "vue-router";

const router = useRouter()
const $t = useI18n().t;

const tableColumns = computed(() => {
    let columns = [
        { title: $t("supply-chain.serial_number"), dataIndex: "number", key: "number" },
        { title: $t("supply-chain.company_name"), dataIndex: "company_name", key: "company_name" },
        { title: $t("supply-chain.supplier_type"), dataIndex: "type", key: "type" },
        { title: $t("supply-chain.submission_time"), dataIndex: "create_time", key: "create_time" },
        { title: $t("common.operations"), key: "operations", fixed: "right" },
    ];
    return columns;
});

const searchList = ref([
    { 
        type: "input", 
        value: "", 
        searchParmas: "company_name",  
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
const request = Core.Api.SUPPLY.adminList;
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
const onSearch = (data) => {
    searchParam.value = data
    search()
}
const onReset = () => {
    refreshTable()
}
// 点击查看
const onView = () => {
    console.log("点击查看了");
    router.push({
        path: '/supply-manage/detail'
    })
}
/* methods end*/
</script>

<style lang="less" scoped></style>

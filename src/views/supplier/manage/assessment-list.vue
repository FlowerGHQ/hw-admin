<template>
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('supply-chain.consider_exempt_supplier_list') }}</div>
        </div>
        <!-- search -->
        <div class="search">
            <SearchAll :options="searchList" :isShowMore="false" @search="onSearch" @reset="onReset"> </SearchAll>
        </div>
        <!-- table -->
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :pagination="{
                    current: pagination.current,
                    pageSize: pagination.size,
                    total: pagination.total,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    showLessItems: true,
                    showTotal: total => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total'),
                    hideOnSinglePage: false,
                    pageSizeOptions: ['10', '20', '30', '40'],
                }"
                @change="channelPagination"
            >
                <template #bodyCell="{ column, text, record, index }">
                    <!-- number -->
                    <template v-if="column.key === 'number'">
                        {{ (pagination.current - 1) * pagination.size + index + 1 }}
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, withDirectives } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
const request = Core.Api.Supplier.list;
const { loading, tableData, pagination, search, onPagenationChange, refreshTable, searchParam } = useTable({
    request,
});

const $t = useI18n().t;
const tableColumns = computed(() => {
    let columns = [
        {
            title: $t('supply-chain.serial_number'),
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: $t('supply-chain.supplier_full_name'),
            dataIndex: 'name',
            key: 'item',
        },
        { title: $t('supply-chain.supplier_type'), dataIndex: 'type', key: 'type' },
    ];
    return columns;
});
const searchList = ref([
    {
        type: 'input',
        value: '',
        searchParmas: 'name',
        key: 'supply-chain.supplier_full_name',
    },
]);

/* Fetch start*/

/* Fetch end*/

/* methods start*/
// 供应商详情
const onSearch = data => {
    searchParam.value = data;
    search();
};
const onReset = () => {
    refreshTable();
};
const channelPagination = ({ current, pageSize }) => {
    onPagenationChange(current, pageSize);
};

/* methods end*/
</script>

<style lang="less" scoped></style>

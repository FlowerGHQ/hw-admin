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
            </a-table>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ref, computed } from 'vue';
import Core from '@/core';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import { useTable } from '@/hooks/useTable';
import { useI18n } from 'vue-i18n';

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
            customRender: ({ text, record, index, column }) => {
                // 当前页码-1 * 每页条数 + 索引 + 1
                return (pagination.value.current - 1) * pagination.value.size + index + 1;
            },
        },
        {
            title: $t('supply-chain.supplier_full_name'),
            dataIndex: 'name',
            key: 'item',
            customRender: ({ text, record, index, column }) => {
                return (
                    <a-button type="link" onClick={() => handleSupplierDetail(record)}>
                        {text}
                    </a-button>
                );
            },
        },
        { title: $t('supply-chain.supplier_type'), dataIndex: 'type', key: 'type' },
        {
            title: $t('supply-chain.exempt_application_form'),
            dataIndex: 'exempt_application_form',
            key: 'exempt_application_form',
            // cousomRender
            customRender: ({ text, record, index, column }) => {
                return (
                    <a-button type="link" onClick={() => handleExemptApplicationForm(record)}>
                        {$t('supply-chain.view')}
                    </a-button>
                );
            },
        },
        {
            title: $t('def.operate'),
            dataIndex: 'operation',
            key: 'operation',
            customRender: ({ text, record, index, column }) => {
                return (
                    <>
                        <a-button type="link" onClick={() => handleSupplierAudit(record)}>
                            {$t('supply-chain.audit')}
                        </a-button>
                        <a-button type="link" onClick={() => handleSupplierDetail(record)}>
                            {$t('supply-chain.view')}
                        </a-button>
                    </>
                );
            },
        },
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

// 审核
const handleSupplierAudit = record => {
    console.log('record', record);
};
// 供应商详情
const handleSupplierDetail = record => {
    console.log('record', record);
};
// 免审核申请表
const handleExemptApplicationForm = record => {
    console.log('record', record);
};
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

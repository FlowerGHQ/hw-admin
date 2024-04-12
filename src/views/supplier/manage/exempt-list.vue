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
                    <!-- name -->
                    <template v-if="column.key === 'name'">
                        <a-button type="link" @click="handleSupplierDetail(record)">{{ text }}</a-button>
                    </template>
                    <!-- exempt_application_form -->
                    <template v-if="column.key === 'exempt_application_form'">
                        <a-button type="link" @click="handleExemptApplicationForm(record)">{{
                            $t('supply-chain.view')
                        }}</a-button>
                    </template>
                    <!-- operation -->
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleSupplierAudit(record)">{{
                            $t('supply-chain.audit')
                        }}</a-button>
                        <a-button type="link" @click="handleSupplierDetail(record)">{{
                            $t('supply-chain.view')
                        }}</a-button>
                    </template>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script setup>
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
        },
        {
            title: $t('supply-chain.supplier_full_name'),
            dataIndex: 'name',
            key: 'item',
        },
        { title: $t('supply-chain.supplier_type'), dataIndex: 'type', key: 'type' },
        {
            title: $t('supply-chain.exempt_application_form'),
            dataIndex: 'exempt_application_form',
            key: 'exempt_application_form',
        },
        {
            title: $t('def.operate'),
            dataIndex: 'operation',
            key: 'operation',
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
</script>

<style lang="less" scoped></style>

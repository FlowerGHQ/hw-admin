<template>
    <div class="credit-detail list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('distributor-detail.credit_change') }}</div>
        </div>
        <div class="search-container">
            <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false" />
        </div>
        <div class="table-container">
            <a-table
                :columns="tableColumns"
                :data-source="tableData"
                :scroll="{ x: true }"
                :loading="loading"
                :row-key="record => record.id"
                :pagination="false"
            >
                <template #bodyCell> </template>
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
                :show-total="total => $t('n.all_total') + ` ${pagination.total} ` + $t('in.total')"
                :hide-on-single-page="false"
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="onPageChange"
                @showSizeChange="onSizeChange"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SearchAll from '@/components/horwin/based-on-ant/SearchAll.vue';
import Core from '@/core';
import { useTable } from '@/hooks/useTable';
const $t = useI18n().t;

const tableColumns = computed(() => {
    let columns = [
        { title: $t('distributor-detail.operator'), dataIndex: 'operator', key: 'operator' },
        { title: $t('distributor-detail.credit_amount'), dataIndex: 'credit_amount', key: 'credit_amount' },
        { title: $t('distributor-detail.operation_time'), dataIndex: 'operation_time', key: 'operation_time' },
    ];
    return columns;
});
// 模拟request
const request = async params => {
    return {
        list: [
            {
                id: 1,
                operator: '张三',
                credit_amount: 100,
                operation_time: '2021-08-01 12:00:00',
            },
            {
                id: 2,
                operator: '李四',
                credit_amount: 200,
                operation_time: '2021-08-02 12:00:00',
            },
        ],
        count: 2,
    };
};

const { loading, tableData, pagination, search, onSizeChange, refreshTable, onPageChange, searchParam } = useTable({
    request,
});
const searchList = ref([
    {
        id: 0,
        type: 'time-range',
        value: [],
        searchParmas: ['begin_time', 'end_time'],
        key: 'distributor-detail.time',
        defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_E,
    },
]);

const typeMap = ref([
    {
        id: 1,
        title: $t('distributor-detail.all'),
        value: 1,
    },
    {
        id: 2,
        title: $t('distributor-detail.account_recharge'),
        value: 2,
    },
    {
        id: 3,
        title: $t('distributor-detail.account_expenditure'),
        value: 3,
    },
]);
const activeTypeValue = ref(1);

// methods
const onSearch = params => {
    console.log(params);
};
const onReset = () => {
    console.log('reset');
};
</script>

<style lang="less" scoped></style>

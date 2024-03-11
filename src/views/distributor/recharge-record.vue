<template>
    <div class="recharge-record list-container">
        <div class="title-container">
            <div class="title-area">{{ $t('distributor-detail.recharge_record') }}</div>
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
                <template #bodyCell="{ record, column }">
                    <!-- 操作 -->
                    <template v-if="column.key === 'operation'">
                        <a-button type="link" @click="handleDetail(record)">{{
                            $t('distributor-detail.check_detail')
                        }}</a-button>
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
        // 充值单号
        {
            title: $t('distributor-detail.recharge_order_number'),
            dataIndex: 'recharge_order_number',
            key: 'recharge_order_number',
        },
        // 充值u账户
        { title: $t('distributor-detail.recharge_account'), dataIndex: 'recharge_account', key: 'recharge_account' },
        // 充值金额
        { title: $t('distributor-detail.recharge_amount'), dataIndex: 'recharge_amount', key: 'recharge_amount' },
        // 到账进度
        { title: $t('distributor-detail.arrival_progress'), dataIndex: 'arrival_progress', key: 'arrival_progress' },
        // 备注
        { title: $t('distributor-detail.remark'), dataIndex: 'remark', key: 'remark' },
        // 操作
        { title: $t('distributor-detail.operation'), dataIndex: 'operation', key: 'operation' },
    ];
    return columns;
});
// 模拟request
const request = async params => {
    return {
        list: [
            {
                id: 1,
                recharge_order_number: '202108010001',
                recharge_account: '余额',
                recharge_amount: 100,
                arrival_progress: '已到账',
                remark: '无',
            },
            {
                id: 2,
                recharge_order_number: '202108010002',
                recharge_account: '余额',
                recharge_amount: 200,
                arrival_progress: '已到账',
                remark: '无',
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

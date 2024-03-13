<template>
    <div class="fund-change-details list-container">
        <div class="title-container">
            <div class="title-area">{{ /*资金变动明细*/ $t('distributor-detail.fund_change_detail') }}</div>
        </div>
        <div class="search-container">
            <SearchAll :options="searchList" @search="onSearch" @reset="onReset" :isShowMore="false" />
        </div>
        <div class="table-container">
            <div class="type-map">
                <div
                    :class="{ 'type-map-item': true, active: activeTypeValue === item.value }"
                    v-for="item in typeMap"
                    :key="item.id"
                    @click="activeTypeValue = item.value"
                >
                    {{ item.title }}
                </div>
            </div>
            <div class="table-area">
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
        { title: $t('distributor-detail.account'), dataIndex: 'account', key: 'account' },
        { title: $t('distributor-detail.type'), dataIndex: 'type', key: 'type' },
        { title: $t('distributor-detail.work_order_number'), dataIndex: 'work_order_number', key: 'work_order_number' },
        { title: $t('distributor-detail.fund_change'), dataIndex: 'fund_change', key: 'fund_change' },
        { title: $t('distributor-detail.create_time'), dataIndex: 'create_time', key: 'create_time' },
    ];
    return columns;
});
// 模拟request
const request = async params => {
    return {
        list: [
            {
                account: '余额',
                type: '账户充值',
                work_order_number: '202108180001',
                fund_change: '+100.00',
                create_time: '2021-08-18 15:00:00',
            },
            {
                account: '积分',
                type: '工单赔付',
                work_order_number: '202108180002',
                fund_change: '-100.00',
                create_time: '2021-08-18 15:00:00',
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
    {
        type: 'select',
        value: '',
        searchParmas: 'type',
        key: 'distributor-detail.type',
        // 是否需要展示全部
        isShowAll: true,
        selectMap: [
            {
                zh: '全部',
                en: 'All',
                value: '',
            },
            // 账户充值
            {
                zh: '账户充值',
                en: 'Account recharge',
                value: 1,
            },
            // 工单赔付
            {
                zh: '工单赔付',
                en: 'Order compensation',
                value: 2,
            },
        ],
    },
    // 充值账户
    {
        type: 'select',
        value: '',
        searchParmas: 'recharge_account',
        key: 'distributor-detail.recharge_account',
        // 是否需要展示全部
        isShowAll: true,
        selectMap: [
            {
                zh: '全部',
                en: 'All',
                value: '',
            },
            {
                zh: '余额',
                en: 'Balance',
                value: 1,
            },
            {
                zh: '积分',
                en: 'Integral',
                value: 2,
            },
        ],
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

<style lang="less" scoped>
.fund-change-details {
    .table-container {
        display: flex;
        .type-map {
            min-width: 200px;
            .type-map-item {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 40px;
                cursor: pointer;
                background-color: #f5f5f5;

                &.active {
                    background-color: #1890ff;
                    color: #fff;
                }
            }
        }
        .table-area {
            flex: 1;
            margin-left: 20px;
        }
    }
}
</style>
